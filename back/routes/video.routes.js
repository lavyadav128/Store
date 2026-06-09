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
// router.post("/tts", auth, async (req, res) => {
//   const { text, voiceId } = req.body;
//   if (!text || !voiceId)
//     return res.status(400).json({ message: "text and voiceId are required" });

//   console.log("✅ EL Key present:", !!process.env.ELEVENLABS_API_KEY);
//   console.log("✅ Voice ID:", voiceId);
//   console.log("✅ Text length:", text?.length);

//   try {
//     const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
//       method: "POST",
//       headers: {
//         "xi-api-key": "sk_c14e598f87595351917068d3ab4465db1d69633555602923",
//         "Content-Type": "application/json",
//         "Accept": "audio/mpeg",
//       },
//       body: JSON.stringify({
//         text,
//         model_id: "eleven_multilingual_v2",
//         voice_settings: { stability: 0.5, similarity_boost: 0.75 },
//       }),
//     });

//     console.log("✅ ElevenLabs response status:", resp.status);

//     if (!resp.ok) {
//       const err = await resp.json().catch(() => ({}));
//       console.error("❌ ElevenLabs error body:", err);
//       return res.status(resp.status).json({ message: err?.detail?.message || `ElevenLabs error ${resp.status}` });
//     }

//     res.setHeader("Content-Type", "audio/mpeg");
//     resp.body.pipe(res);
//   } catch (err) {
//     console.error("❌ TTS fetch error:", err.message);
//     res.status(500).json({ message: err.message });
//   }
// });


router.post("/tts", auth, async (req, res) => {
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
        VoiceId: "Scarlett",
        Bitrate: "192k",
        Speed: "0",
        Pitch: "1",
        OutputFormat: "mp3",
      }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      return res.status(resp.status).json({ message: err?.message || `TTS error ${resp.status}` });
    }

    // Unreal Speech returns JSON with OutputUri, not direct audio stream
    const data = await resp.json();
    const audioUrl = data.OutputUri;

    if (!audioUrl) {
      return res.status(500).json({ message: "No audio URL in response" });
    }

    // Fetch the actual audio and pipe it
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