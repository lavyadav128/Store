/**
 * videoSplitter.routes.js
 *
 * USAGE in your main server file (ES module):
 *   import videoSplitterRoutes from "./routes/videoSplitter.routes.js";
 *   app.use("/api/video-splitter", videoSplitterRoutes);
 *
 * INSTALL:
 *   npm install fluent-ffmpeg @ffmpeg-installer/ffmpeg multer uuid
 *   pip install yt-dlp
 *
 * ENDPOINTS:
 *   POST   /api/video-splitter/upload          → upload video file
 *   POST   /api/video-splitter/upload-url      → download from YouTube/URL
 *   POST   /api/video-splitter/split/reels     → split by clip duration
 *   POST   /api/video-splitter/split/parts     → split into N equal parts
 *   POST   /api/video-splitter/split/summarize → smart summary clip
 *   DELETE /api/video-splitter/upload/:filename→ cleanup upload
 *   GET    /api/video-splitter/outputs/*       → serve finished clips
 */

import { Router } from "express";
import multer from "multer";
import ffmpegFluent from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import express from "express";

const router    = Router();
const execAsync = promisify(exec);

// ── ES module __dirname fix ───────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── FFmpeg setup (uses npm package — works on Windows & Linux with no install) ─
ffmpegFluent.setFfmpegPath(ffmpegInstaller.path);
const FFMPEG_PATH = ffmpegInstaller.path;

// ── yt-dlp command (works on Windows & Linux) ────────────────────────────────
const YT_DLP = process.platform === "win32" ? "python -m yt_dlp" : "yt-dlp";

// ── Directories ───────────────────────────────────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, "..", "video_uploads");
const OUTPUTS_DIR = path.join(__dirname, "..", "video_outputs");
[UPLOADS_DIR, OUTPUTS_DIR].forEach((d) => fs.mkdirSync(d, { recursive: true }));

// Serve finished clips as static files
router.use("/outputs", express.static(OUTPUTS_DIR));

// ── Multer ────────────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) =>
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 * 1024 }, // 5 GB
  fileFilter: (req, file, cb) =>
    /mp4|mov|avi|mkv|webm|flv|wmv/i.test(path.extname(file.originalname))
      ? cb(null, true)
      : cb(new Error("Only video files are allowed")),
});

// ── Helpers ───────────────────────────────────────────────────────────────────
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

/**
 * extractClip — HD quality H.264 + AAC
 * CRF 18 = near-lossless, audio preserved exactly at 192kbps stereo
 */
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

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/video-splitter/upload
// Body: multipart with "video" field
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
// Body: { url }   — YouTube or any yt-dlp supported URL
// Downloads the video to server, returns same shape as /upload
// ─────────────────────────────────────────────────────────────────────────────
router.post("/upload-url", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "url is required" });

  const filename   = `${uuidv4()}.mp4`;
  const outputPath = path.join(UPLOADS_DIR, filename);

  try {
    // Download best MP4 quality — pass ffmpeg path so yt-dlp can merge streams
    await execAsync(
      `${YT_DLP} --ffmpeg-location "${FFMPEG_PATH}" -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" -o "${outputPath}" "${url}"`,
      { timeout: 10 * 60 * 1000 } // 10 min timeout for long videos
    );

    // Get title
    let title = "Video";
    try {
      const { stdout } = await execAsync(`${YT_DLP} --get-title "${url}"`, { timeout: 15000 });
      title = stdout.trim() || "Video";
    } catch (_) { /* title is optional, don't fail */ }

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
    // Cleanup partial file if exists
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    console.error("yt-dlp error:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to download video. Make sure the URL is public and yt-dlp is installed.",
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/video-splitter/split/reels
// Body: { filename, clipDuration }   clipDuration in seconds
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
// Body: { filename, targetDuration }   targetDuration in seconds
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

    // Extract 10 evenly-spaced representative segments
    const segPaths = [];
    for (let i = 0; i < SEGMENTS; i++) {
      const start  = i * step;
      const segOut = path.join(sessionDir, `seg_${i}.mp4`);
      await extractClip({ inputPath, outputPath: segOut, startTime: start, duration: segDur });
      segPaths.push(segOut);
    }

    // Concatenate with ffmpeg concat demuxer
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

    // Cleanup temp segments
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