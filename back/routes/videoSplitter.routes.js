

import { Router }        from "express";
import multer            from "multer";
import ffmpegFluent      from "fluent-ffmpeg";
import ffmpegInstaller   from "@ffmpeg-installer/ffmpeg";
import { exec }          from "child_process";
import { promisify }     from "util";
import path              from "path";
import fs                from "fs";
import { v4 as uuidv4 }  from "uuid";
import { fileURLToPath } from "url";
import axios             from "axios";
import { v2 as cloudinary } from "cloudinary";
import os                from "os";
import https             from "https";

const router    = Router();
const execAsync = promisify(exec);

// ── Persistent HTTPS agent — keeps TCP connections alive across requests ──────
// Prevents "socket disconnected before TLS" on slow/unstable networks
const httpsAgent = new https.Agent({
  keepAlive:            true,
  keepAliveMsecs:       10000, // send TCP keepalive every 10s
  maxSockets:           20,    // max parallel sockets
  maxFreeSockets:       5,
  timeout:              120000, // socket idle timeout 2 min
  rejectUnauthorized:   true,
});

// ── axios instance with keepAlive agent + sane timeouts ───────────────────────
const axiosClient = axios.create({
  httpsAgent,
  timeout: 120000, // 2 min default; overridden per-call where needed
});

/**
 * Retry wrapper — retries on TLS/socket errors up to `retries` times.
 * Pass any async fn that may throw a network error.
 */
const withRetry = async (fn, retries = 3, delayMs = 1500) => {
  let lastErr;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const isNetworkErr =
        err.code === "ECONNRESET" ||
        err.code === "ECONNREFUSED" ||
        err.code === "ETIMEDOUT"   ||
        err.code === "ENOTFOUND"   ||
        err.message?.includes("socket disconnected") ||
        err.message?.includes("TLS") ||
        err.message?.includes("EPROTO");

      if (!isNetworkErr || attempt === retries) throw err;
      console.warn(`⚠️  Network error (attempt ${attempt}/${retries}): ${err.message} — retrying in ${delayMs}ms`);
      await new Promise((r) => setTimeout(r, delayMs * attempt)); // exponential backoff
    }
  }
  throw lastErr;
};

// ── ES module __dirname fix ───────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── Cloudinary config ─────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── FFmpeg setup ──────────────────────────────────────────────────────────────
ffmpegFluent.setFfmpegPath(ffmpegInstaller.path);
const FFMPEG_PATH = ffmpegInstaller.path;

// ── Temp directory ────────────────────────────────────────────────────────────
const TMP_DIR = path.join(os.tmpdir(), "video_splitter");
fs.mkdirSync(TMP_DIR, { recursive: true });

// ── Multer — memory storage ───────────────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    /mp4|mov|avi|mkv|webm|flv|wmv/i.test(path.extname(file.originalname))
      ? cb(null, true)
      : cb(new Error("Only video files are allowed")),
});

// ─────────────────────────────────────────────────────────────────────────────
// YT-DLP HELPERS  ⭐ OPTIMIZED
// ─────────────────────────────────────────────────────────────────────────────

const NODE_EXEC_PATH = process.execPath;

const getCookiesFlag = () => {
  const projectRoot = path.resolve(__dirname, "../../");
  const cookiesPath = path.join(projectRoot, "cookies.txt");
  if (fs.existsSync(cookiesPath)) {
    console.log("🍪 Using cookies.txt for yt-dlp");
    return `--cookies "${cookiesPath}"`;
  }
  return "";
};

/**
 * OPTIMIZED yt-dlp command:
 *  - --concurrent-fragments 8: downloads 8 fragments simultaneously (huge speedup)
 *  - Removed --prefer-free-formats: avoids slow VP9/Opus; prefers h264+aac (faster mux)
 *  - --no-mtime: skips filesystem timestamp update (minor but free speedup)
 *  - --print title: get title in the same invocation, eliminating 2nd network call
 *  - --buffer-size 16K: larger read buffer for faster I/O
 */
const buildYtDlpCommand = (url, outputPath) => {
  const cookiesFlag  = getCookiesFlag();
  const escapedOutput = outputPath.replace(/\\/g, "\\\\");
  const escapedFfmpeg = FFMPEG_PATH.replace(/\\/g, "\\\\");
  const escapedNode   = NODE_EXEC_PATH.replace(/\\/g, "\\\\");

  return [
    `yt-dlp`,
    `"${url}"`,
    // Prefer mp4/h264 — avoids VP9 which is slower to mux
    `-f "bestvideo[ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]/bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best[ext=mp4]/best"`,
    `--merge-output-format mp4`,
    `-o "${escapedOutput}"`,
    `--no-playlist`,
    `--retries 5`,
    `--fragment-retries 5`,
    // ⭐ OPTIMIZATION 1: download 8 fragments in parallel
    `--concurrent-fragments 8`,
    // ⭐ OPTIMIZATION 2: larger I/O buffer
    `--buffer-size 16K`,
    // ⭐ OPTIMIZATION 3: skip filesystem mtime update
    `--no-mtime`,
    `--js-runtimes "node:${escapedNode}"`,
    cookiesFlag,
    `--ffmpeg-location "${escapedFfmpeg}"`,
    `--no-warnings`,
    `--add-header "Accept-Language:en-US,en;q=0.9"`,
  ]
    .filter(Boolean)
    .join(" ");
};

/**
 * OPTIMIZED: Get title in same yt-dlp call using --print to avoid a second network round-trip.
 * Returns [command, titlePromise] — title is extracted from stdout's first line.
 */
const buildYtDlpCommandWithTitle = (url, outputPath) => {
  const base = buildYtDlpCommand(url, outputPath);
  // --print title prints the title to stdout before downloading; we parse it from stdout
  return base + ` --print title`;
};

// ─────────────────────────────────────────────────────────────────────────────
// CLOUDINARY HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// ⭐ TLS FIX: all Cloudinary uploads wrapped in withRetry to survive socket drops
const uploadToCloudinary = (localPath, folder = "video_splitter/outputs") =>
  withRetry(() =>
    new Promise((resolve, reject) =>
      cloudinary.uploader.upload(
        localPath,
        {
          resource_type:   "video",
          folder,
          use_filename:    false,
          unique_filename: true,
          overwrite:       false,
          chunk_size:      50 * 1024 * 1024, // 50 MB chunks — avoids one huge TCP connection
          timeout:         10 * 60 * 1000,   // 10 min per upload
        },
        (err, result) => (err ? reject(err) : resolve(result))
      )
    )
  );

const uploadBufferToCloudinary = (buffer, folder = "video_splitter/uploads") =>
  withRetry(() =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type:   "video",
          folder,
          use_filename:    false,
          unique_filename: true,
          overwrite:       false,
          chunk_size:      50 * 1024 * 1024,
          timeout:         10 * 60 * 1000,
        },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(buffer);
    })
  );

/**
 * OPTIMIZED + TLS FIX: keepAlive httpsAgent + retry on socket drop.
 */
const downloadFromCloudinary = async (url, ext = ".mp4") => {
  const tmpPath = path.join(TMP_DIR, `${uuidv4()}${ext}`);
  await withRetry(async () => {
    const response = await axiosClient({ url, method: "GET", responseType: "stream", timeout: 10 * 60 * 1000 });
    await new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(tmpPath, { highWaterMark: 2 * 1024 * 1024 });
      response.data.pipe(writer);
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  });
  return tmpPath;
};

// ─────────────────────────────────────────────────────────────────────────────
// FFMPEG HELPERS  ⭐ OPTIMIZED
// ─────────────────────────────────────────────────────────────────────────────

const getDuration = (filePath) =>
  new Promise((resolve, reject) =>
    ffmpegFluent.ffprobe(filePath, (err, meta) => {
      if (err) return reject(new Error(`ffprobe failed on "${path.basename(filePath)}": ${err.message}`));
      if (!meta?.format?.duration) return reject(new Error(`ffprobe returned no duration for "${path.basename(filePath)}"`));
      resolve(meta.format.duration);
    })
  );

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
};

/**
 * extractClip — TWO-PASS STRATEGY for maximum speed:
 *
 *  PASS 1 — stream copy (-c copy): INSTANT. No re-encoding at all.
 *    FFmpeg just cuts bytes from the source. A 60s clip from a 1hr video takes < 1 second.
 *    Downside: cut points snap to the nearest keyframe (may be off by up to ~2s).
 *    Fine for reels/parts splits where exact frame accuracy isn't needed.
 *
 *  PASS 2 — re-encode fallback: only triggered if stream copy fails (codec mismatch etc.)
 *    Uses ultrafast + crf 23 as before, but this is now the exception not the rule.
 *
 *  NOTE: for ai-clips, we use extractClipAccurate() which forces a re-encode so the
 *  hook/start point is frame-accurate (important when GPT picks a specific timestamp).
 */
const extractClip = ({ inputPath, outputPath, startTime, duration }) =>
  new Promise((resolve, reject) => {
    ffmpegFluent(inputPath)
      .inputOptions([`-ss ${startTime}`])
      .inputPath(inputPath)
      .outputOptions([
        `-t ${duration}`,
        "-c copy",
        "-movflags +faststart",
        "-avoid_negative_ts make_zero",
      ])
      .output(outputPath)
      .on("end", resolve)
      .on("error", (streamCopyErr) => {
        // Stream copy failed — log the real reason and fall back to re-encode
        console.warn(`⚠️  Stream copy failed (${streamCopyErr.message}), falling back to re-encode`);
        // Delete partial output before retry
        try { if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath); } catch (_) {}

        ffmpegFluent(inputPath)
          .setStartTime(startTime)
          .setDuration(duration)
          .videoCodec("libx264")
          .audioCodec("aac")
          .outputOptions([
            "-crf 23",
            "-preset ultrafast",
            "-threads 0",
            "-profile:v high",
            "-level 4.1",
            "-pix_fmt yuv420p",
            "-movflags +faststart",
            "-b:a 192k",
            "-ar 44100",
            "-ac 2",
          ])
          .output(outputPath)
          .on("end", resolve)
          .on("error", (reencodeErr) => {
            // Both strategies failed — surface a clear combined error
            reject(new Error(
              `FFmpeg failed.\n` +
              `  Stream copy error: ${streamCopyErr.message}\n` +
              `  Re-encode error:   ${reencodeErr.message}\n` +
              `  Input: ${inputPath} | Start: ${startTime}s | Duration: ${duration}s`
            ));
          })
          .run();
      })
      .run();
  });

/**
 * extractClipAccurate — frame-accurate re-encode for AI clips.
 * Used when GPT picks a precise timestamp and we need the hook to start exactly there.
 * Slower than stream copy but still uses ultrafast preset.
 */
const extractClipAccurate = ({ inputPath, outputPath, startTime, duration }) =>
  new Promise((resolve, reject) =>
    ffmpegFluent(inputPath)
      .setStartTime(startTime)
      .setDuration(duration)
      .videoCodec("libx264")
      .audioCodec("aac")
      .outputOptions([
        "-crf 23",
        "-preset ultrafast",
        "-threads 0",
        "-profile:v high",
        "-level 4.1",
        "-pix_fmt yuv420p",
        "-movflags +faststart",
        "-b:a 192k",
        "-ar 44100",
        "-ac 2",
      ])
      .output(outputPath)
      .on("end", resolve)
      .on("error", reject)
      .run()
  );

const extractAudio = (videoPath, audioPath) =>
  new Promise((resolve, reject) =>
    ffmpegFluent(videoPath)
      .noVideo()
      .audioChannels(1)
      .audioFrequency(16000)
      .audioCodec("pcm_s16le")
      .output(audioPath)
      .on("end", resolve)
      .on("error", reject)
      .run()
  );

// ─────────────────────────────────────────────────────────────────────────────
// WHISPER TRANSCRIPTION  ⭐ OPTIMIZED
// ─────────────────────────────────────────────────────────────────────────────
const transcribeWithWhisper = async (audioPath) => {
  const scriptPath = path.join(TMP_DIR, `whisper_${uuidv4()}.py`);
  const outputJson = path.join(TMP_DIR, `transcript_${uuidv4()}.json`);

  const pythonScript = `
import json
from faster_whisper import WhisperModel

# ⭐ OPTIMIZATION: beam_size=1 is ~2x faster with minimal accuracy loss for viral detection
model = WhisperModel("base", device="cpu", compute_type="int8")
segments, info = model.transcribe("${audioPath.replace(/\\/g, "\\\\")}", beam_size=1, vad_filter=True)

result = []
for segment in segments:
    result.append({
        "start": round(segment.start, 2),
        "end":   round(segment.end, 2),
        "text":  segment.text.strip()
    })

with open("${outputJson.replace(/\\/g, "\\\\")}", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False)

print("done")
`;

  fs.writeFileSync(scriptPath, pythonScript);

  try {
    const pyCmd = process.platform === "win32" ? "python" : "python3";
    await execAsync(`${pyCmd} "${scriptPath}"`, { timeout: 10 * 60 * 1000 });
    const raw = fs.readFileSync(outputJson, "utf-8");
    return JSON.parse(raw);
  } finally {
    if (fs.existsSync(scriptPath)) fs.unlinkSync(scriptPath);
    if (fs.existsSync(outputJson)) fs.unlinkSync(outputJson);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GPT-4o VIRAL MOMENT DETECTION
// ─────────────────────────────────────────────────────────────────────────────
const detectViralMoments = async ({ segments, totalDuration, clipLength, contentType, clipCount }) => {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY not set in .env");

  const transcriptText = segments
    .map((s) => `[${s.start}s - ${s.end}s]: ${s.text}`)
    .join("\n");

  const clipInstruction =
    clipLength === "ai_decide"
      ? "You decide the best duration for each clip (between 30 and 120 seconds) based on the content flow."
      : `Each clip must be exactly or close to ${clipLength} seconds long. Adjust start/end to fit.`;

  const prompt = `
You are an expert viral video editor specialising in ${contentType} content for TikTok, Instagram Reels, and YouTube Shorts.

Below is a timestamped transcript of a video (total duration: ${Math.floor(totalDuration)} seconds).

YOUR TASK:
Identify the TOP ${clipCount} most viral, engaging, shareable moments from this transcript.

CLIP DURATION RULE:
${clipInstruction}

WHAT MAKES A GREAT CLIP for ${contentType} content:
- Strong hook in the first 3 seconds (surprising fact, bold claim, question, or emotional moment)
- Clear standalone value — viewer understands it without watching the full video
- High energy, emotion, or insight
- Natural start and end (don't cut mid-sentence)
- Avoid intros, outros, sponsor segments, or filler

TRANSCRIPT:
${transcriptText}

RESPOND ONLY with a valid JSON array — no explanation, no markdown, no extra text:
[
  {
    "rank": 1,
    "start": 45.2,
    "end": 98.7,
    "duration": 53.5,
    "title": "Short punchy clip title",
    "reason": "Why this moment is viral",
    "hook": "The opening line or moment that grabs attention"
  }
]

Make sure start and end times are within 0 and ${Math.floor(totalDuration)}.
Return exactly ${clipCount} clips ranked by viral potential.
`;

  const response = await withRetry(() => axiosClient.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model:       "openai/gpt-4o",
      messages:    [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens:  2000,
    },
    {
      headers: {
        Authorization:  `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://notenova.app",
        "X-Title":      "NoteNova Video Splitter",
      },
      timeout: 120000, // ⭐ increased to 2 min; 60s was too short on slow connections
    }
  ));

  const raw     = response.data.choices[0].message.content.trim();
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
  return JSON.parse(cleaned);
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────────────────────────────────────
const cleanupFiles = (...paths) =>
  paths.forEach((p) => {
    try { if (p && fs.existsSync(p)) fs.unlinkSync(p); } catch (_) {}
  });

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/video-splitter/upload
// ─────────────────────────────────────────────────────────────────────────────
router.post("/upload", upload.single("video"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No video file provided" });

  const tmpPath = path.join(TMP_DIR, `${uuidv4()}${path.extname(req.file.originalname)}`);
  fs.writeFileSync(tmpPath, req.file.buffer);

  try {
    // ⭐ OPTIMIZATION: getDuration and uploadBufferToCloudinary run in parallel
    const [duration, cloudResult] = await Promise.all([
      getDuration(tmpPath),
      uploadBufferToCloudinary(req.file.buffer, "video_splitter/uploads"),
    ]);

    res.json({
      success:           true,
      publicId:          cloudResult.public_id,
      url:               cloudResult.secure_url,
      originalName:      req.file.originalname,
      duration:          Math.floor(duration),
      durationFormatted: formatTime(duration),
      size:              req.file.size,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  } finally {
    cleanupFiles(tmpPath);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/video-splitter/upload-url  ⭐ OPTIMIZED
// Body: { url }
// ─────────────────────────────────────────────────────────────────────────────
router.post("/upload-url", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "url is required" });

  const tmpPath = path.join(TMP_DIR, `${uuidv4()}.mp4`);

  try {
    console.log("⬇️  Downloading via yt-dlp:", url);
    console.log("🟢 Node.js runtime path:", NODE_EXEC_PATH);

    // ⭐ OPTIMIZATION: --print title emits title to stdout before downloading,
    // so we parse it from the same exec call — no second network round-trip.
    const command = buildYtDlpCommandWithTitle(url, tmpPath);
    console.log("📟 yt-dlp command:", command);

    const { stdout } = await execAsync(command, { timeout: 5 * 60 * 1000 });

    if (!fs.existsSync(tmpPath) || fs.statSync(tmpPath).size === 0) {
      throw new Error(
        "yt-dlp ran but no output file was created. " +
        "Try adding a cookies.txt file to your project root (see top of this file)."
      );
    }

    // Title is the first line printed by --print title
    const title = stdout.trim().split("\n")[0] || "Video";

    // ⭐ OPTIMIZATION: getDuration and uploadToCloudinary run in parallel
    const [duration, cloudResult] = await Promise.all([
      getDuration(tmpPath),
      uploadToCloudinary(tmpPath, "video_splitter/uploads"),
    ]);

    const stat = fs.statSync(tmpPath);
    console.log("✅ Done:", title);

    res.json({
      success:           true,
      publicId:          cloudResult.public_id,
      url:               cloudResult.secure_url,
      originalName:      title,
      duration:          Math.floor(duration),
      durationFormatted: formatTime(duration),
      size:              stat.size,
      source:            "yt-dlp",
    });

  } catch (err) {
    console.error("❌ upload-url error:", err.message);

    let hint = "";
    if (err.message.includes("not available")) {
      hint = " | HINT: Add a cookies.txt file to your project root — see file header for instructions.";
    } else if (err.message.includes("JS runtime")) {
      hint = ` | HINT: Node.js runtime not found. Detected path: ${NODE_EXEC_PATH}`;
    }

    res.status(500).json({ success: false, error: err.message + hint });
  } finally {
    cleanupFiles(tmpPath);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SHARED: download source from Cloudinary, run handler, cleanup
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ⭐ SOURCE VIDEO CACHE
 * When the same publicId is used twice in quick succession (e.g. user runs ai-clips
 * then split/reels on same video), the source file is already on disk — skip re-download.
 * Cache entries expire after 10 minutes to avoid stale disk usage.
 */
const srcVideoCache = new Map(); // publicId → { path, expiresAt }
const SRC_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const withSourceVideo = async (publicId, cloudinaryUrl, handler) => {
  const now    = Date.now();
  const cached = srcVideoCache.get(publicId);

  let srcPath;
  let isCached = false;

  if (cached && cached.expiresAt > now && fs.existsSync(cached.path)) {
    console.log("⚡ Using cached source video for:", publicId);
    srcPath  = cached.path;
    isCached = true;
  } else {
    console.log("⬇️  Downloading source from Cloudinary...");
    srcPath = await downloadFromCloudinary(cloudinaryUrl);
    srcVideoCache.set(publicId, { path: srcPath, expiresAt: now + SRC_CACHE_TTL });
    // Auto-expire: delete from cache and disk after TTL
    setTimeout(() => {
      const entry = srcVideoCache.get(publicId);
      if (entry) {
        cleanupFiles(entry.path);
        srcVideoCache.delete(publicId);
      }
    }, SRC_CACHE_TTL);
  }

  try {
    return await handler(srcPath);
  } catch (err) {
    // If source was cached but the file got deleted externally, evict cache and rethrow
    if (isCached && err.message?.includes(srcPath)) {
      srcVideoCache.delete(publicId);
    }
    throw err;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/video-splitter/ai-clips  ⭐ FULLY PARALLELIZED
// Body: { publicId, url, clipLength, contentType, clipCount }
// ─────────────────────────────────────────────────────────────────────────────
router.post("/ai-clips", async (req, res) => {
  const {
    publicId,
    url:        videoUrl,
    clipLength  = "ai_decide",
    contentType = "general",
    clipCount   = 5,
  } = req.body;

  if (!publicId || !videoUrl)
    return res.status(400).json({ error: "publicId and url are required" });

  const audioPath = path.join(TMP_DIR, `audio_${uuidv4()}.wav`);
  const tmpClips  = [];
  let   step      = "initializing";

  try {
    await withSourceVideo(publicId, videoUrl, async (srcPath) => {
      step = "extracting audio";
      console.log("📢 Extracting audio...");
      await extractAudio(srcPath, audioPath);

      step = "transcribing";
      console.log("📝 Transcribing with faster-whisper...");
      const [segments, totalDuration] = await Promise.all([
        transcribeWithWhisper(audioPath),
        getDuration(srcPath),
      ]);
      cleanupFiles(audioPath);

      if (!segments || segments.length === 0)
        throw new Error("Transcription returned empty — video may have no speech or be too quiet.");

      step = "detecting viral moments (GPT-4o)";
      console.log("🤖 Asking GPT-4o to find viral moments...");
      const moments = await detectViralMoments({
        segments,
        totalDuration,
        clipLength,
        contentType,
        clipCount: Math.min(parseInt(clipCount) || 5, 10),
      });

      if (!Array.isArray(moments) || moments.length === 0)
        throw new Error("GPT-4o returned no clip suggestions. Try a different video or content type.");

      console.log(`✂️  Cutting ${moments.length} clips in PARALLEL (frame-accurate)...`);
      step = "cutting clips";

      const clipResults = await Promise.all(
        moments.map(async (moment, i) => {
          const start    = Math.max(0, parseFloat(moment.start));
          const end      = Math.min(totalDuration, parseFloat(moment.end));
          const duration = end - start;

          if (duration < 5) {
            console.warn(`Clip ${i + 1} skipped — duration ${duration.toFixed(1)}s is too short`);
            return null;
          }

          const clipName = `clip_${String(i + 1).padStart(2, "0")}_rank${moment.rank}.mp4`;
          const clipPath = path.join(TMP_DIR, `${uuidv4()}_${clipName}`);
          tmpClips.push(clipPath);

          try {
            await extractClipAccurate({ inputPath: srcPath, outputPath: clipPath, startTime: start, duration });
          } catch (clipErr) {
            throw new Error(`Clip ${i + 1} cut failed (start=${start}s, dur=${duration}s): ${clipErr.message}`);
          }

          try {
            const cloudClip = await uploadToCloudinary(clipPath, "video_splitter/outputs");
            return {
              rank:            moment.rank,
              index:           i + 1,
              publicId:        cloudClip.public_id,
              url:             cloudClip.secure_url,
              startTime:       formatTime(start),
              endTime:         formatTime(end),
              duration:        formatTime(duration),
              durationSeconds: Math.round(duration),
              title:           moment.title,
              reason:          moment.reason,
              hook:            moment.hook,
            };
          } catch (uploadErr) {
            throw new Error(`Clip ${i + 1} upload failed: ${uploadErr.message}`);
          }
        })
      );

      const clips = clipResults.filter(Boolean);
      if (clips.length === 0)
        throw new Error("All clips were skipped (durations too short). Check GPT timestamps vs video length.");

      res.json({ success: true, totalClips: clips.length, contentType, clipLength, clips });
    });
  } catch (err) {
    const msg = `[ai-clips] Failed at step "${step}": ${err.message}`;
    console.error("❌", msg);
    res.status(500).json({ success: false, error: msg, step });
  } finally {
    cleanupFiles(audioPath, ...tmpClips);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/video-splitter/split/reels  ⭐ PARALLELIZED
// Body: { publicId, url, clipDuration }
// ─────────────────────────────────────────────────────────────────────────────
router.post("/split/reels", async (req, res) => {
  const { publicId, url: videoUrl, clipDuration } = req.body;
  if (!publicId || !videoUrl || !clipDuration)
    return res.status(400).json({ error: "publicId, url, and clipDuration required" });

  const tmpClips = [];

  try {
    await withSourceVideo(publicId, videoUrl, async (srcPath) => {
      const total   = await getDuration(srcPath);
      const clipSec = parseInt(clipDuration);
      const count   = Math.ceil(total / clipSec);

      const clips = await Promise.all(
        Array.from({ length: count }, async (_, i) => {
          const start   = i * clipSec;
          const dur     = Math.min(clipSec, total - start);
          const tmpPath = path.join(TMP_DIR, `${uuidv4()}_reel_${i + 1}.mp4`);
          tmpClips.push(tmpPath);

          try {
            await extractClip({ inputPath: srcPath, outputPath: tmpPath, startTime: start, duration: dur });
          } catch (e) {
            throw new Error(`Reel ${i + 1} cut failed (start=${formatTime(start)}, dur=${formatTime(dur)}): ${e.message}`);
          }
          try {
            const cloudClip = await uploadToCloudinary(tmpPath, "video_splitter/outputs");
            return {
              index:     i + 1,
              publicId:  cloudClip.public_id,
              url:       cloudClip.secure_url,
              startTime: formatTime(start),
              duration:  formatTime(dur),
            };
          } catch (e) {
            throw new Error(`Reel ${i + 1} upload failed: ${e.message}`);
          }
        })
      );

      res.json({ success: true, totalClips: clips.length, clips });
    });
  } catch (err) {
    const msg = `[split/reels] ${err.message}`;
    console.error("❌", msg);
    res.status(500).json({ success: false, error: msg });
  } finally {
    cleanupFiles(...tmpClips);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/video-splitter/split/parts  ⭐ PARALLELIZED
// Body: { publicId, url, parts }
// ─────────────────────────────────────────────────────────────────────────────
router.post("/split/parts", async (req, res) => {
  const { publicId, url: videoUrl, parts } = req.body;
  if (!publicId || !videoUrl || !parts)
    return res.status(400).json({ error: "publicId, url, and parts required" });

  const tmpClips = [];

  try {
    await withSourceVideo(publicId, videoUrl, async (srcPath) => {
      const total = await getDuration(srcPath);
      const n     = parseInt(parts);
      const dur   = total / n;

      const clips = await Promise.all(
        Array.from({ length: n }, async (_, i) => {
          const start   = i * dur;
          const tmpPath = path.join(TMP_DIR, `${uuidv4()}_part_${i + 1}.mp4`);
          tmpClips.push(tmpPath);

          try {
            await extractClip({ inputPath: srcPath, outputPath: tmpPath, startTime: start, duration: dur });
          } catch (e) {
            throw new Error(`Part ${i + 1}/${n} cut failed (start=${formatTime(start)}): ${e.message}`);
          }
          try {
            const cloudClip = await uploadToCloudinary(tmpPath, "video_splitter/outputs");
            return {
              index:     i + 1,
              publicId:  cloudClip.public_id,
              url:       cloudClip.secure_url,
              startTime: formatTime(start),
              duration:  formatTime(dur),
            };
          } catch (e) {
            throw new Error(`Part ${i + 1}/${n} upload failed: ${e.message}`);
          }
        })
      );

      res.json({ success: true, totalClips: clips.length, clips });
    });
  } catch (err) {
    const msg = `[split/parts] ${err.message}`;
    console.error("❌", msg);
    res.status(500).json({ success: false, error: msg });
  } finally {
    cleanupFiles(...tmpClips);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/video-splitter/split/summarize
// Body: { publicId, url, targetDuration }
// ─────────────────────────────────────────────────────────────────────────────
router.post("/split/summarize", async (req, res) => {
  const { publicId, url: videoUrl, targetDuration } = req.body;
  if (!publicId || !videoUrl || !targetDuration)
    return res.status(400).json({ error: "publicId, url, and targetDuration required" });

  const tmpSegs     = [];
  let   listPath    = null;
  let   summaryPath = null;

  try {
    await withSourceVideo(publicId, videoUrl, async (srcPath) => {
      const total  = await getDuration(srcPath);
      const target = parseInt(targetDuration);

      if (target >= total)
        return res.status(400).json({ error: "Target duration must be shorter than the video." });

      const SEGMENTS  = 10;
      const segDur    = target / SEGMENTS;
      const step      = (total - segDur) / (SEGMENTS - 1);
      const sessionId = uuidv4();

      // ⭐ OPTIMIZATION: extract all segments in parallel
      await Promise.all(
        Array.from({ length: SEGMENTS }, async (_, i) => {
          const segPath = path.join(TMP_DIR, `${sessionId}_seg_${i}.mp4`);
          tmpSegs.push(segPath);
          await extractClip({
            inputPath:  srcPath,
            outputPath: segPath,
            startTime:  i * step,
            duration:   segDur,
          });
        })
      );

      listPath    = path.join(TMP_DIR, `${sessionId}_list.txt`);
      summaryPath = path.join(TMP_DIR, `${sessionId}_summary.mp4`);

      fs.writeFileSync(listPath, tmpSegs.map((p) => `file '${p}'`).join("\n"));

      await new Promise((resolve, reject) =>
        ffmpegFluent()
          .input(listPath)
          .inputOptions(["-f concat", "-safe 0"])
          .videoCodec("libx264")
          .audioCodec("aac")
          .outputOptions([
            "-crf 23",           // ⭐ optimized
            "-preset ultrafast", // ⭐ optimized
            "-threads 0",        // ⭐ use all cores
            "-profile:v high",
            "-level 4.1",
            "-pix_fmt yuv420p",
            "-movflags +faststart",
            "-b:a 192k",
            "-ar 44100",
            "-ac 2",
          ])
          .output(summaryPath)
          .on("end", resolve)
          .on("error", reject)
          .run()
      );

      const cloudResult = await uploadToCloudinary(summaryPath, "video_splitter/outputs");

      res.json({
        success: true,
        summary: {
          publicId:         cloudResult.public_id,
          url:              cloudResult.secure_url,
          originalDuration: formatTime(total),
          summaryDuration:  formatTime(target),
        },
      });
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  } finally {
    cleanupFiles(...tmpSegs, listPath, summaryPath);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/video-splitter/upload/:publicId
// ─────────────────────────────────────────────────────────────────────────────
router.delete("/upload/:publicId(*)", async (req, res) => {
  try {
    const publicId = req.params.publicId;
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
    res.json({ success: true, deleted: publicId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;