import express from "express";
import Groq from "groq-sdk";
import auth from "../controller/authh.js";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
// Generates full script using Groq (free)
// ─────────────────────────────────────────
router.post("/generate-script", auth, async (req, res) => {
  try {
    const { scriptType, topic } = req.body;

    if (!scriptType || !topic) {
      return res.status(400).json({ message: "scriptType and topic are required" });
    }

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

    // Split into scenes (2 sentences per scene)
    const sentences = script.match(/[^.!?\n]+[.!?\n]+/g) || [script];
    const scenes = [];
    for (let i = 0; i < sentences.length; i += 2) {
      scenes.push({
        id: i / 2,
        text: sentences.slice(i, i + 2).join(" ").trim(),
      });
    }

    res.json({ script, scenes, wordCount: script.split(" ").length });

  } catch (err) {
    console.error("Script generation error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────
// POST /api/video-studio/generate-image-prompts
// For each scene, generates 3 HD image prompts
// Frontend uses these prompts with Pollinations.ai
// ─────────────────────────────────────────
router.post("/generate-image-prompts", auth, async (req, res) => {
  try {
    const { scenes, style = "Cinematic" } = req.body;

    if (!scenes || !scenes.length) {
      return res.status(400).json({ message: "scenes array is required" });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{
        role: "user",
        content: `You are an expert AI image prompt writer for video production.

For each scene below, write 3 different vivid image prompts in "${style}" style.
Each prompt must be highly detailed, cinematic, and suitable for HD image generation.

Return ONLY a valid JSON array like this (no extra text, no markdown):
[
  {
    "sceneId": 0,
    "prompts": ["prompt1", "prompt2", "prompt3"]
  },
  {
    "sceneId": 1,
    "prompts": ["prompt1", "prompt2", "prompt3"]
  }
]

Scenes:
${scenes.map((s, i) => `Scene ${i}: "${s.text}"`).join("\n")}

Important: Every prompt must end with: "${style} style, ultra HD, 4K, cinematic lighting, sharp focus, professional photography"`
      }],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content?.trim() || "[]";

    // Clean and parse JSON safely
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    // Merge prompts back into scenes
    const enrichedScenes = scenes.map((scene, i) => {
      const found = parsed.find(p => p.sceneId === i);
      const prompts = found?.prompts || [
        `${scene.text}, ${style} style, ultra HD, cinematic lighting`,
        `${scene.text}, dramatic ${style}, 4K, professional photography`,
        `${scene.text}, ${style} atmosphere, sharp focus, high resolution`,
      ];
      return {
        ...scene,
        imagePrompts: prompts,
      };
    });

    res.json({ scenes: enrichedScenes });

  } catch (err) {
    console.error("Image prompt error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;