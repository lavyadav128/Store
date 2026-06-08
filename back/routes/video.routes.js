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

// ── STYLE GUIDES ──
const STYLE_GUIDES = {
  motivational: "Use powerful, energetic language. Short punchy sentences. Inspire action.",
  educational:  "Explain clearly. Use analogies. Build knowledge step by step.",
  storytelling: "Start with a hook. Build narrative tension. Use sensory details.",
  product_promo:"Lead with the problem. Present the solution. Show benefits.",
  news:         "Factual, objective tone. Professional. Concise but complete.",
  comedy:       "Unexpected punchlines. Relatable scenarios. Light and fun.",
  poem:         "Rhythmic flow. Vivid imagery. Emotional resonance.",
  tutorial:     "Step-by-step. Clear instructions. Reassuring tone.",
};

// ─────────────────────────────────────────
// POST /api/video-studio/generate-script
// ─────────────────────────────────────────
router.post("/generate-script", auth, async (req, res) => {
  try {
    const { scriptType, topic } = req.body;
    if (!scriptType || !topic)
      return res.status(400).json({ message: "scriptType and topic are required" });

    const styleGuide = STYLE_GUIDES[scriptType] || "Engaging and clear.";

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{
        role: "user",
        content: `You are a professional video scriptwriter. Write a ${scriptType} style video script about: "${topic}".

Style guide: ${styleGuide}

Requirements:
1. Write exactly 6-10 complete sentences
2. Each sentence must be vivid and paint a clear visual scene
3. Sentences should flow naturally when spoken aloud
4. Write ONLY the script — no stage directions, no labels, no markdown

Script:`
      }],
      max_tokens: 1000,
      temperature: 0.8,
    });

    const script = completion.choices[0]?.message?.content?.trim() || "";
    const sentences = script.match(/[^.!?\n]+[.!?\n]+/g) || [script];
    const scenes = [];
    for (let i = 0; i < sentences.length; i += 2) {
      scenes.push({ id: i / 2, text: sentences.slice(i, i + 2).join(" ").trim() });
    }

    res.json({ script, scenes, wordCount: script.split(" ").length });
  } catch (err) {
    console.error("Script generation error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────
// POST /api/video-studio/generate-image-prompts
// ─────────────────────────────────────────
router.post("/generate-image-prompts", auth, async (req, res) => {
  try {
    const { scenes, style = "Cinematic" } = req.body;
    if (!scenes || !scenes.length)
      return res.status(400).json({ message: "scenes array is required" });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{
        role: "user",
        content: `You are an expert AI image prompt writer for video production.

For each scene below, write 3 different vivid image prompts in "${style}" style.
Each prompt must be highly detailed, cinematic, and suitable for HD image generation.

Return ONLY a valid JSON array like this (no extra text, no markdown):
[
  { "sceneId": 0, "prompts": ["prompt1", "prompt2", "prompt3"] },
  { "sceneId": 1, "prompts": ["prompt1", "prompt2", "prompt3"] }
]

Scenes:
${scenes.map((s, i) => `Scene ${i}: "${s.text}"`).join("\n")}

Important: Every prompt must end with: "${style} style, ultra HD, 4K, cinematic lighting, sharp focus, professional photography"`
      }],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content?.trim() || "[]";
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    const enrichedScenes = scenes.map((scene, i) => {
      const found = parsed.find(p => p.sceneId === i);
      const prompts = found?.prompts || [
        `${scene.text}, ${style} style, ultra HD, cinematic lighting`,
        `${scene.text}, dramatic ${style}, 4K, professional photography`,
        `${scene.text}, ${style} atmosphere, sharp focus, high resolution`,
      ];
      return { ...scene, imagePrompts: prompts };
    });

    res.json({ scenes: enrichedScenes });
  } catch (err) {
    console.error("Image prompt error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

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

export default router;