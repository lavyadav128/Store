import express from "express";
import Groq from "groq-sdk";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import streamifier from "streamifier";
import fetch from "node-fetch";
import auth from "../controller/authh.js";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

// ─────────────────────────────────────────
// POST /api/video-studio/save-to-cloudinary
// ─────────────────────────────────────────
router.post("/save-to-cloudinary", auth, upload.single("video"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No video file received" });

    const filename = `video_studio_${req.user?.id || "user"}_${Date.now()}`;

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "video_studio",
          public_id: filename,
          overwrite: true,
          format: "mp4",
          transformation: [{ quality: "auto" }],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
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
// ─────────────────────────────────────────
router.post("/tts", auth, async (req, res) => {
  console.log("TTS body:", req.body); // ADD THIS
  const { text, voiceId } = req.body;
  if (!text || !voiceId)
    return res.status(400).json({ message: "text and voiceId are required" });

  try {
    const resp = await fetch("https://api.v7.unrealspeech.com/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.UNREALSPEECH_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Text: text,
        VoiceId: "Scarlett",   // ✅ Hindi Female voice in Unreal Speech
        Bitrate: "192k",
        Speed: "0",
        Pitch: "1",
        OutputFormat: "mp3",
      }),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.log("UnrealSpeech Error:", errorText);
    
      return res.status(resp.status).json({
        message: errorText
      });
    }

    const data = await resp.json();
    const audioUrl = data.OutputUri;

    if (!audioUrl) {
      return res.status(500).json({ message: "No audio URL in response" });
    }

    const audioResp = await fetch(audioUrl);
    if (!audioResp.ok) {
      return res.status(500).json({ message: "Failed to fetch audio file" });
    }

    res.setHeader("Content-Type", "audio/mpeg");
    audioResp.body.pipe(res);
  } catch (err) {
    console.error("TTS error:", err.message);
    res.status(500).json({ message: err.message });
  }
});


export default router;