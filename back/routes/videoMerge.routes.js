// routes/videoMerge.js
// ─────────────────────────────────────────────────────────────────────────────
// Drop-in route file for your existing Express server.
//
// In your main server/index.js, add:
//   import videoMergeRouter from "./routes/videoMerge.js";
//   app.use("/api/video-merge", videoMergeRouter);
//
// Prerequisites:  npm install multer uuid
//                 ffmpeg must be installed on the server (apt install ffmpeg)
//
// Make sure your package.json has:  "type": "module"
// ─────────────────────────────────────────────────────────────────────────────
import ffmpegStatic          from "ffmpeg-static";
import express               from "express";
import multer                from "multer";
import path                  from "path";
import fs                    from "fs";
import { v4 as uuidv4 }     from "uuid";
import { spawn }             from "child_process";
import { fileURLToPath }     from "url";
import { v2 as cloudinary }  from "cloudinary";
import streamifier           from "streamifier";
import auth                  from "../controller/authh.js";

const FFMPEG_PATH = ffmpegStatic;
const __filename  = fileURLToPath(import.meta.url);
const __dirname   = path.dirname(__filename);

const router = express.Router();

// ── Storage dirs ──────────────────────────────────────────────────────────────
const UPLOAD_DIR = path.join(__dirname, "../video_uploads");
const OUTPUT_DIR = path.join(__dirname, "../video_outputs");
[UPLOAD_DIR, OUTPUT_DIR].forEach((d) => fs.mkdirSync(d, { recursive: true }));

// Serve finished videos as static files
router.use("/outputs", express.static(OUTPUT_DIR));

// ── Cloudinary config ─────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Multer ────────────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".mp4";
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB per file
  fileFilter: (req, file, cb) =>
    file.mimetype.startsWith("video/")
      ? cb(null, true)
      : cb(new Error("Only video files are allowed")),
});

// Separate multer instance for Cloudinary upload (memory storage)
const memUpload = multer({ storage: multer.memoryStorage() });

// ── In-memory job store ───────────────────────────────────────────────────────
const jobs = {};

// ── Probe helper ──────────────────────────────────────────────────────────────
// const probeVideo = (filePath) => {
//   try {
//     const raw     = execSync(
//       `ffprobe -v quiet -print_format json -show_streams "${filePath}"`,
//       { encoding: "utf8" }
//     );
//     const streams = JSON.parse(raw).streams;
//     const video   = streams.find((s) => s.codec_type === "video");
//     const audio   = streams.find((s) => s.codec_type === "audio");
//     return {
//       width:    video?.width,
//       height:   video?.height,
//       fps:      video?.r_frame_rate,
//       codec:    video?.codec_name,
//       hasAudio: !!audio,
//       duration: parseFloat(video?.duration || 0),
//     };
//   } catch {
//     return null;
//   }
// };

// ── FFmpeg promise wrapper ────────────────────────────────────────────────────
const runFFmpeg = (args) =>
  new Promise((resolve, reject) => {
    const proc = spawn(FFMPEG_PATH, args);
    let stderr  = "";
    proc.stderr.on("data", (d) => (stderr += d.toString()));
    proc.on("close", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`FFmpeg error (code ${code}):\n${stderr.slice(-1000)}`))
    );
  });

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/video-merge/upload
// Upload one or more video clips.
// ─────────────────────────────────────────────────────────────────────────────
router.post("/upload", upload.array("videos", 50), (req, res) => {
  if (!req.files?.length)
    return res.status(400).json({ error: "No files uploaded" });

  const files = req.files.map((f) => ({
    id:           path.basename(f.filename, path.extname(f.filename)),
    filename:     f.filename,
    originalName: f.originalname,
    size:         f.size,
    info:         null,
  }));

  res.json({ success: true, files });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/video-merge/merge
// Body: { filenames: string[], outputName: string, resolution: string }
// Returns: { jobId }
// ─────────────────────────────────────────────────────────────────────────────
router.post("/merge", express.json(), (req, res) => {
  const { filenames, outputName, resolution = "1280:720" } = req.body;

  if (!filenames || filenames.length < 2)
    return res.status(400).json({ error: "Need at least 2 video files" });

  for (const fn of filenames) {
    if (!fs.existsSync(path.join(UPLOAD_DIR, fn)))
      return res.status(400).json({ error: `File not found: ${fn}` });
  }

  const jobId      = uuidv4();
  const safeName   = (outputName || "merged_video").replace(/[^a-zA-Z0-9_-]/g, "_");
  const outputFile = path.join(OUTPUT_DIR, `${safeName}_${jobId.slice(0, 8)}.mp4`);
  const listFile   = path.join(UPLOAD_DIR,  `list_${jobId}.txt`);

  jobs[jobId] = { status: "processing", progress: 0, output: null, error: null };
  res.json({ jobId });

  // ── Run async ──────────────────────────────────────────────────────────────
  setImmediate(async () => {
    const tmpDir = path.join(UPLOAD_DIR, `tmp_${jobId}`);
    try {
      fs.mkdirSync(tmpDir, { recursive: true });
      jobs[jobId].progress = 5;

      const [TW, TH] = resolution.split(":").map(Number);
      const TW_ = TW || 1280;
      const TH_ = TH || 720;

      // Step 1 — re-encode every clip to the same spec.
      //          Eliminates codec / fps / resolution mismatches
      //          that cause black frames at join points.
      const normalised = [];

      for (let i = 0; i < filenames.length; i++) {
        const src = path.join(UPLOAD_DIR, filenames[i]);
        const dst = path.join(tmpDir, `clip_${String(i).padStart(4, "0")}.mp4`);

        await runFFmpeg([
          "-y", "-i", src,
          "-vf", [
            `scale=${TW_}:${TH_}:force_original_aspect_ratio=decrease`,
            `pad=${TW_}:${TH_}:(ow-iw)/2:(oh-ih)/2`,
            "fps=30",
          ].join(","),
          "-c:v", "libx264", "-preset", "fast", "-crf", "18",
          "-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-ac", "2",
          "-movflags", "+faststart",
          dst,
        ]);

        normalised.push(dst);
        jobs[jobId].progress = 5 + Math.round(((i + 1) / filenames.length) * 73);
      }

      // Step 2 — build FFmpeg concat list
      fs.writeFileSync(listFile, normalised.map((f) => `file '${f}'`).join("\n"));
      jobs[jobId].progress = 82;

      // Step 3 — stream-copy concat (no re-encode).
      //          All clips are identical spec → zero gap, zero black frame.
      await runFFmpeg([
        "-y",
        "-f", "concat", "-safe", "0", "-i", listFile,
        "-c", "copy",
        "-movflags", "+faststart",
        outputFile,
      ]);

      jobs[jobId].progress = 100;
      jobs[jobId].status   = "done";
      jobs[jobId].output   = path.basename(outputFile);

      fs.rmSync(tmpDir, { recursive: true, force: true });
      fs.unlinkSync(listFile);
    } catch (err) {
      jobs[jobId].status = "error";
      jobs[jobId].error  = err.message;
      fs.rmSync(tmpDir, { recursive: true, force: true });
      if (fs.existsSync(listFile)) fs.unlinkSync(listFile);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/video-merge/status/:jobId
// ─────────────────────────────────────────────────────────────────────────────
router.get("/status/:jobId", (req, res) => {
  const job = jobs[req.params.jobId];
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/video-merge/file/:filename
// Remove an uploaded clip from disk.
// ─────────────────────────────────────────────────────────────────────────────
router.delete("/file/:filename", (req, res) => {
  const safe = path.basename(req.params.filename); // prevent path traversal
  const fp   = path.join(UPLOAD_DIR, safe);
  if (fs.existsSync(fp)) fs.unlinkSync(fp);
  res.json({ success: true });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/video-merge/save-to-cloudinary
// Body: { filename: string }  — filename of the merged output on disk
// ─────────────────────────────────────────────────────────────────────────────
router.post("/save-to-cloudinary", auth, express.json(), async (req, res) => {
  try {
    const { filename } = req.body;
    if (!filename) return res.status(400).json({ message: "filename is required" });

    const safe = path.basename(filename); // prevent path traversal
    const filePath = path.join(OUTPUT_DIR, safe);
    if (!fs.existsSync(filePath))
      return res.status(404).json({ message: "Merged video file not found on server" });

    const publicId = `video_merger_${req.user?.id || "user"}_${Date.now()}`;

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "video_merger",
          public_id: publicId,
          overwrite: true,
          format: "mp4",
          transformation: [{ quality: "auto" }],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      fs.createReadStream(filePath).pipe(stream);
    });

    res.json({
      url: uploadResult.secure_url,
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      duration: uploadResult.duration,
      format: uploadResult.format,
    });
  } catch (err) {
    console.error("Cloudinary upload error (video-merge):", err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;