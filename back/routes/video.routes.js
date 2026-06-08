import express from "express";
import Groq from "groq-sdk";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import streamifier from "streamifier";
import auth from "../controller/authh.js";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Cloudinary config (uses your existing env vars) ──
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Multer: store upload in memory (no disk) ──
const upload = multer({ storage: multer.memoryStorage() });


// ─────────────────────────────────────────
// POST /api/video-studio/save-to-cloudinary
// Receives video blob, uploads to Cloudinary
// ─────────────────────────────────────────
router.post("/save-to-cloudinary", auth, upload.single("video"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No video file received" });

    const filename = `video_studio_${req.user?.id || "user"}_${Date.now()}`;

    // Upload buffer to Cloudinary as a video resource via stream
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "video_studio",
          public_id: filename,
          overwrite: true,
          // Optional: auto-convert webm to mp4 for broader compatibility
          format: "mp4",
          transformation: [{ quality: "auto" }],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      // Pipe buffer into stream
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    res.json({
      url: uploadResult.secure_url,
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      duration: uploadResult.duration,
      format: uploadResult.format,
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err.message);
    res.status(500).json({ message: err.message });
  }
});


// ─────────────────────────────────────────
// POST /api/video-studio/tts
// Proxies ElevenLabs TTS — key stays on server
// ─────────────────────────────────────────
router.post("/tts", auth, async (req, res) => {
  const { text, voiceId } = req.body;
  if (!text || !voiceId)
    return res.status(400).json({ message: "text and voiceId are required" });

  try {
    const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      return res.status(resp.status).json({ message: err?.detail?.message || `ElevenLabs error ${resp.status}` });
    }

    res.setHeader("Content-Type", "audio/mpeg");
    resp.body.pipe(res);
  } catch (err) {
    console.error("TTS error:", err.message);
    res.status(500).json({ message: err.message });
  }
});


export default router;