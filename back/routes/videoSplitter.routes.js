/**
 * videoSplitter.routes.js  —  FULL AI CLIP DETECTION VERSION
 *
 * IMPORT IN MAIN SERVER:
 *   import videoSplitterRoutes from "./routes/videoSplitter.routes.js";
 *   app.use("/api/video-splitter", videoSplitterRoutes);
 *
 * INSTALL:
 *   npm install fluent-ffmpeg @ffmpeg-installer/ffmpeg multer uuid axios form-data
 *   pip install yt-dlp faster-whisper
 *
 * ENV (.env):
 *   OPENROUTER_API_KEY=sk-or-v1-xxxx
 *
 * ENDPOINTS:
 *   POST   /api/video-splitter/upload            → upload video file
 *   POST   /api/video-splitter/upload-url        → download from YouTube URL
 *   POST   /api/video-splitter/split/reels       → split by clip duration
 *   POST   /api/video-splitter/split/parts       → split into N equal parts
 *   POST   /api/video-splitter/split/summarize   → smart summary clip
 *   POST   /api/video-splitter/ai-clips          → AI detects top 5 viral moments ⭐
 *   DELETE /api/video-splitter/upload/:filename  → cleanup upload
 *   GET    /api/video-splitter/outputs/*         → serve finished clips
 */

import { Router }       from "express";
import express          from "express";
import multer           from "multer";
import ffmpegFluent     from "fluent-ffmpeg";
import ffmpegInstaller  from "@ffmpeg-installer/ffmpeg";
import { exec }         from "child_process";
import { promisify }    from "util";
import path             from "path";
import fs               from "fs";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import axios            from "axios";

const router    = Router();
const execAsync = promisify(exec);

// ── ES module __dirname fix ───────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── FFmpeg setup ──────────────────────────────────────────────────────────────
ffmpegFluent.setFfmpegPath(ffmpegInstaller.path);
const FFMPEG_PATH = ffmpegInstaller.path;

// ── yt-dlp command (Windows & Linux) ─────────────────────────────────────────
const YT_DLP = process.platform === "win32" ? "python -m yt_dlp" : "yt-dlp";

// ── faster-whisper command (Windows & Linux) ──────────────────────────────────
const WHISPER_CMD = process.platform === "win32" ? "python -m faster_whisper" : "python3 -m faster_whisper";

// ── Directories ───────────────────────────────────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, "..", "video_uploads");
const OUTPUTS_DIR = path.join(__dirname, "..", "video_outputs");
[UPLOADS_DIR, OUTPUTS_DIR].forEach((d) => fs.mkdirSync(d, { recursive: true }));

router.use("/outputs", express.static(OUTPUTS_DIR));

// ── Multer ────────────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) =>
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    /mp4|mov|avi|mkv|webm|flv|wmv/i.test(path.extname(file.originalname))
      ? cb(null, true)
      : cb(new Error("Only video files are allowed")),
});

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const getDuration = (filePath) =>
  new Promise((resolve, reject) =>
    ffmpegFluent.ffprobe(filePath, (err, meta) =>
      err ? reject(err) : resolve(meta.format.duration)
    )
  );

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
};

// HD clip extraction — CRF 18, H.264 High, AAC 192k stereo
const extractClip = ({ inputPath, outputPath, startTime, duration }) =>
  new Promise((resolve, reject) =>
    ffmpegFluent(inputPath)
      .setStartTime(startTime)
      .setDuration(duration)
      .videoCodec("libx264")
      .audioCodec("aac")
      .outputOptions([
        "-crf 18",
        "-preset slow",
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

// Extract audio from video → WAV for Whisper
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

// ── Transcribe with faster-whisper via Python script ──────────────────────────
// We write a small Python script, run it, and read JSON output
const transcribeWithWhisper = async (audioPath) => {
  const scriptPath = path.join(UPLOADS_DIR, `whisper_${uuidv4()}.py`);
  const outputJson = path.join(UPLOADS_DIR, `transcript_${uuidv4()}.json`);

  // Inline Python script — uses faster-whisper, outputs JSON with segments
  const pythonScript = `
import json
import sys
from faster_whisper import WhisperModel

model = WhisperModel("base", device="cpu", compute_type="int8")
segments, info = model.transcribe("${audioPath.replace(/\\/g, "\\\\")}", beam_size=5)

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
    await execAsync(`${pyCmd} "${scriptPath}"`, { timeout: 10 * 60 * 1000 }); // 10 min
    const raw = fs.readFileSync(outputJson, "utf-8");
    return JSON.parse(raw); // array of { start, end, text }
  } finally {
    if (fs.existsSync(scriptPath)) fs.unlinkSync(scriptPath);
    if (fs.existsSync(outputJson)) fs.unlinkSync(outputJson);
  }
};

// ── Ask GPT-4o (via OpenRouter) to pick top 5 viral moments ──────────────────
const detectViralMoments = async ({
  segments,
  totalDuration,
  clipLength,   // "ai_decide" | "30" | "60" | "90" | "120"
  contentType,  // e.g. "educational", "motivational", "coding", "general"
  clipCount,    // how many clips to detect (default 5)
}) => {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY not set in .env");

  // Build a readable transcript with timestamps
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
  },
  ...
]

Make sure start and end times are within 0 and ${Math.floor(totalDuration)}.
Return exactly ${clipCount} clips ranked by viral potential.
`;

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 2000,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://notenova.app",
        "X-Title": "NoteNova Video Splitter",
      },
      timeout: 60000,
    }
  );

  const raw = response.data.choices[0].message.content.trim();

  // Strip markdown fences if GPT wraps in ```json
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
  return JSON.parse(cleaned);
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/video-splitter/upload
// ─────────────────────────────────────────────────────────────────────────────
router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const duration = await getDuration(req.file.path);
    res.json({
      success: true,
      filename: req.file.filename,
      originalName: req.file.originalname,
      duration: Math.floor(duration),
      durationFormatted: formatTime(duration),
      size: req.file.size,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/video-splitter/upload-url
// Body: { url }
// ─────────────────────────────────────────────────────────────────────────────
router.post("/upload-url", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "url is required" });

  const filename   = `${uuidv4()}.mp4`;
  const outputPath = path.join(UPLOADS_DIR, filename);

  try {
    await execAsync(
      `${YT_DLP} --ffmpeg-location "${FFMPEG_PATH}" -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" -o "${outputPath}" "${url}"`,
      { timeout: 10 * 60 * 1000 }
    );

    let title = "Video";
    try {
      const { stdout } = await execAsync(`${YT_DLP} --get-title "${url}"`, { timeout: 15000 });
      title = stdout.trim() || "Video";
    } catch (_) {}

    const duration = await getDuration(outputPath);
    const stat     = fs.statSync(outputPath);

    res.json({
      success: true,
      filename,
      originalName: title,
      duration: Math.floor(duration),
      durationFormatted: formatTime(duration),
      size: stat.size,
      source: "url",
    });
  } catch (err) {
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    console.error("yt-dlp error:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to download video. Make sure the URL is public.",
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/video-splitter/ai-clips  ⭐ MAIN AI FEATURE
//
// Body: {
//   filename,
//   clipLength:   "ai_decide" | "30" | "60" | "90" | "120"  (seconds)
//   contentType:  "educational" | "motivational" | "coding" | "entertainment" | "general"
//   clipCount:    number (default 5, max 10)
// }
//
// Flow: extract audio → faster-whisper → GPT-4o → FFmpeg cuts → HD clips
// ─────────────────────────────────────────────────────────────────────────────
router.post("/ai-clips", async (req, res) => {
  const {
    filename,
    clipLength   = "ai_decide",
    contentType  = "general",
    clipCount    = 5,
  } = req.body;

  if (!filename) return res.status(400).json({ error: "filename is required" });

  const inputPath  = path.join(UPLOADS_DIR, filename);
  if (!fs.existsSync(inputPath))
    return res.status(404).json({ error: "Video file not found. Please upload again." });

  const sessionId  = uuidv4();
  const sessionDir = path.join(OUTPUTS_DIR, sessionId);
  fs.mkdirSync(sessionDir);

  const audioPath = path.join(sessionDir, "audio.wav");

  try {
    // ── Step 1: Extract audio ──────────────────────────────────────────────
    console.log("📢 Extracting audio...");
    await extractAudio(inputPath, audioPath);

    // ── Step 2: Transcribe with faster-whisper ─────────────────────────────
    console.log("📝 Transcribing with faster-whisper (first run downloads model ~150MB)...");
    const segments = await transcribeWithWhisper(audioPath);

    if (!segments || segments.length === 0)
      throw new Error("Transcription returned empty. Video may have no speech.");

    // ── Step 3: GPT-4o detects viral moments ──────────────────────────────
    console.log("🤖 Asking GPT-4o to find viral moments...");
    const totalDuration = await getDuration(inputPath);
    const moments = await detectViralMoments({
      segments,
      totalDuration,
      clipLength,
      contentType,
      clipCount: Math.min(parseInt(clipCount) || 5, 10),
    });

    // ── Step 4: Cut HD clips with FFmpeg ──────────────────────────────────
    console.log(`✂️  Cutting ${moments.length} clips...`);
    const clips = [];

    for (let i = 0; i < moments.length; i++) {
      const moment = moments[i];

      // Safety clamp — never go outside video bounds
      const start    = Math.max(0, parseFloat(moment.start));
      const end      = Math.min(totalDuration, parseFloat(moment.end));
      const duration = end - start;

      if (duration < 5) continue; // skip if AI hallucinated a tiny clip

      const clipName = `clip_${String(i + 1).padStart(2, "0")}_rank${moment.rank}.mp4`;
      const clipPath = path.join(sessionDir, clipName);

      await extractClip({
        inputPath,
        outputPath: clipPath,
        startTime:  start,
        duration,
      });

      clips.push({
        rank:      moment.rank,
        index:     i + 1,
        filename:  clipName,
        url:       `/api/video-splitter/outputs/${sessionId}/${clipName}`,
        startTime: formatTime(start),
        endTime:   formatTime(end),
        duration:  formatTime(duration),
        durationSeconds: Math.round(duration),
        title:     moment.title,
        reason:    moment.reason,
        hook:      moment.hook,
      });
    }

    // Cleanup audio file
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);

    res.json({
      success:     true,
      totalClips:  clips.length,
      contentType,
      clipLength,
      clips,
    });

  } catch (err) {
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    console.error("AI clips error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/video-splitter/split/reels
// Body: { filename, clipDuration }
// ─────────────────────────────────────────────────────────────────────────────
router.post("/split/reels", async (req, res) => {
  const { filename, clipDuration } = req.body;
  if (!filename || !clipDuration)
    return res.status(400).json({ error: "filename and clipDuration required" });

  try {
    const inputPath = path.join(UPLOADS_DIR, filename);
    const total     = await getDuration(inputPath);
    const clipSec   = parseInt(clipDuration);
    const count     = Math.ceil(total / clipSec);

    const sessionId  = uuidv4();
    const sessionDir = path.join(OUTPUTS_DIR, sessionId);
    fs.mkdirSync(sessionDir);

    const clips = [];
    for (let i = 0; i < count; i++) {
      const start = i * clipSec;
      const dur   = Math.min(clipSec, total - start);
      const name  = `reel_${String(i + 1).padStart(3, "0")}.mp4`;
      const out   = path.join(sessionDir, name);
      await extractClip({ inputPath, outputPath: out, startTime: start, duration: dur });
      clips.push({
        index: i + 1,
        filename: name,
        url: `/api/video-splitter/outputs/${sessionId}/${name}`,
        startTime: formatTime(start),
        duration: formatTime(dur),
      });
    }

    res.json({ success: true, totalClips: clips.length, clips });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/video-splitter/split/parts
// Body: { filename, parts }
// ─────────────────────────────────────────────────────────────────────────────
router.post("/split/parts", async (req, res) => {
  const { filename, parts } = req.body;
  if (!filename || !parts)
    return res.status(400).json({ error: "filename and parts required" });

  try {
    const inputPath = path.join(UPLOADS_DIR, filename);
    const total     = await getDuration(inputPath);
    const n         = parseInt(parts);
    const dur       = total / n;

    const sessionId  = uuidv4();
    const sessionDir = path.join(OUTPUTS_DIR, sessionId);
    fs.mkdirSync(sessionDir);

    const clips = [];
    for (let i = 0; i < n; i++) {
      const start = i * dur;
      const name  = `part_${String(i + 1).padStart(3, "0")}.mp4`;
      const out   = path.join(sessionDir, name);
      await extractClip({ inputPath, outputPath: out, startTime: start, duration: dur });
      clips.push({
        index: i + 1,
        filename: name,
        url: `/api/video-splitter/outputs/${sessionId}/${name}`,
        startTime: formatTime(start),
        duration: formatTime(dur),
      });
    }

    res.json({ success: true, totalClips: clips.length, clips });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/video-splitter/split/summarize
// Body: { filename, targetDuration }
// ─────────────────────────────────────────────────────────────────────────────
router.post("/split/summarize", async (req, res) => {
  const { filename, targetDuration } = req.body;
  if (!filename || !targetDuration)
    return res.status(400).json({ error: "filename and targetDuration required" });

  try {
    const inputPath = path.join(UPLOADS_DIR, filename);
    const total     = await getDuration(inputPath);
    const target    = parseInt(targetDuration);

    if (target >= total)
      return res.status(400).json({ error: "Target duration must be shorter than the video." });

    const SEGMENTS   = 10;
    const segDur     = target / SEGMENTS;
    const step       = (total - segDur) / (SEGMENTS - 1);

    const sessionId  = uuidv4();
    const sessionDir = path.join(OUTPUTS_DIR, sessionId);
    fs.mkdirSync(sessionDir);

    const segPaths = [];
    for (let i = 0; i < SEGMENTS; i++) {
      const start  = i * step;
      const segOut = path.join(sessionDir, `seg_${i}.mp4`);
      await extractClip({ inputPath, outputPath: segOut, startTime: start, duration: segDur });
      segPaths.push(segOut);
    }

    const listPath = path.join(sessionDir, "list.txt");
    fs.writeFileSync(listPath, segPaths.map((p) => `file '${p}'`).join("\n"));

    const summaryName = "summary.mp4";
    const summaryPath = path.join(sessionDir, summaryName);

    await new Promise((resolve, reject) =>
      ffmpegFluent()
        .input(listPath)
        .inputOptions(["-f concat", "-safe 0"])
        .videoCodec("libx264")
        .audioCodec("aac")
        .outputOptions([
          "-crf 18", "-preset slow", "-profile:v high", "-level 4.1",
          "-pix_fmt yuv420p", "-movflags +faststart", "-b:a 192k", "-ar 44100", "-ac 2",
        ])
        .output(summaryPath)
        .on("end", resolve)
        .on("error", reject)
        .run()
    );

    segPaths.forEach((p) => fs.unlinkSync(p));
    fs.unlinkSync(listPath);

    res.json({
      success: true,
      summary: {
        filename: summaryName,
        url: `/api/video-splitter/outputs/${sessionId}/${summaryName}`,
        originalDuration: formatTime(total),
        summaryDuration: formatTime(target),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/video-splitter/upload/:filename
// ─────────────────────────────────────────────────────────────────────────────
router.delete("/upload/:filename", (req, res) => {
  const p = path.join(UPLOADS_DIR, req.params.filename);
  if (fs.existsSync(p)) fs.unlinkSync(p);
  res.json({ success: true });
});

export default router;