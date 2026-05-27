// =========================
// OLLAMA CALL
// =========================
// async function callLLM(messages) {
//   const res = await fetch("http://127.0.0.1:11434/api/chat", {
//     method:  "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       model:    "qwen2.5:1.5b",
//       messages,
//       stream:   false,
//     }),
//   });

//   const data = await res.json();
//   return data?.message?.content || "No response generated";
// }








import express from "express";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const router = express.Router();

// =========================
// VECTOR STORE
// =========================
const VECTOR_STORE_PATH = path.join(path.resolve(), "ai", "vector_store.json");

const vectorStore = JSON.parse(
  fs.readFileSync(VECTOR_STORE_PATH, "utf-8")
);

// =========================
// EMBEDDINGS (lazy load)
// =========================
let embedder = null;

async function getEmbedder() {
  if (!embedder) {
    const transformers = await import("@xenova/transformers");

    embedder = await transformers.pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }
  return embedder;
}

// =========================
// COSINE SIMILARITY
// =========================
function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] ** 2;
    nb += b[i] ** 2;
  }

  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

// =========================
// VECTOR SEARCH (RAG)
// =========================
async function searchChunks(query, k = 6) {
  const model = await getEmbedder();

  const embedding = await model(query, {
    pooling: "mean",
    normalize: true
  });

  const qVec = Array.from(embedding.data);

  return vectorStore
    .map(item => ({
      ...item,
      score: cosine(qVec, item.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

// =========================
// TOPIC DETECTION
// =========================
function detectTopic(chunks, context) {
  const map = {};

  for (const c of chunks) {
    const chapter = c.metadata?.chapter || "Unknown";
    map[chapter] = (map[chapter] || 0) + 1;
  }

  const best = Object.entries(map).sort((a, b) => b[1] - a[1])[0];

  return {
    chapter: best?.[0] || "Unknown",
    subject: chunks[0]?.metadata?.subject || "General",
    urlTopic: context?.topic || "Unknown"
  };
}

// =========================
// URL TOPIC PARSER
// =========================
function topicFromUrl(context) {
  const slug = context?.topic || "";

  return slug
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ") || "the current topic";
}

// =========================
// FORMAT RULES (AI STYLE)
// =========================
const FORMAT_RULES = `
- Use headings (##)
- Use bullet points
- Keep answers structured
- Bold important terms
- Keep explanation beginner friendly
`;

// =========================
// MESSAGE ENRICHER
// =========================
function enrichMessage(message, topic) {
  const lower = message.toLowerCase();

  if (lower.includes("summar")) return `Summarize ${topic}`;
  if (lower.includes("explain")) return `Explain ${topic}`;
  if (lower.includes("quiz")) return `Create quiz on ${topic}`;
  if (lower.includes("key")) return `Key points of ${topic}`;

  return `${message}\n(Context: ${topic})`;
}

// =========================
// BUILD MESSAGES (RAG PROMPT)
// =========================
function buildMessages(message, context, chunks, history) {
  const studyMaterial = chunks.map(c => c.text).join("\n\n");
  const topic = topicFromUrl(context);

  const systemPrompt = `
You are an AI Study Copilot inside an EdTech platform.

Current Topic: ${topic}
URL: ${context.fullUrl || "unknown"}

Use study material first, then general knowledge.

Study Material:
${studyMaterial}

Rules:
${FORMAT_RULES}
`;

  const historyMessages = history.map(h => ({
    role: h.role === "bot" ? "assistant" : "user",
    content: h.content
  }));

  return [
    { role: "system", content: systemPrompt },
    ...historyMessages,
    {
      role: "user",
      content: enrichMessage(message, topic)
    }
  ];
}

// =========================
// PDF TEXT EXTRACTION
// =========================
async function extractPdfText(base64) {
  const buffer = Buffer.from(base64, "base64");
  const data = await pdfParse(buffer);
  return data.text.slice(0, 15000);
}

// =========================
// OPENROUTER LLM (FINAL FIX)
// =========================
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

async function callLLM(messages) {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY not set");
  }

  const res = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost",
        "X-Title": "AI Study Copilot"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct",
        messages,
        temperature: 0.7
      })
    }
  );

  let data;
  try {
    data = await res.json();
  } catch {
    return "Invalid AI response";
  }

  if (!res.ok) {
    console.log("OpenRouter error:", data);
    return "AI service error";
  }

  return data?.choices?.[0]?.message?.content || "No response";
}

// =========================
// MAIN ROUTE
// =========================
router.post("/chatbot", async (req, res) => {
  try {
    const { message, context = {}, history = [], pdf } = req.body;

    if (!message) {
      return res.status(400).json({
        reply: "Message required"
      });
    }

    // =========================
    // PDF MODE
    // =========================
    if (message === "__PDF_SUMMARISE__" && pdf?.base64) {
      const text = await extractPdfText(pdf.base64);

      const msgs = [
        {
          role: "system",
          content: "You are a PDF summarizer"
        },
        {
          role: "user",
          content: text
        }
      ];

      const reply = await callLLM(msgs);

      return res.json({
        reply,
        detected: {
          chapter: "PDF",
          subject: pdf.name
        }
      });
    }

    // =========================
    // NORMAL CHAT (RAG)
    // =========================
    const chunks = await searchChunks(message, 6);
    const msgs = buildMessages(message, context, chunks, history);

    const reply = await callLLM(msgs);

    res.json({
      reply,
      detected: detectTopic(chunks, context)
    });

  } catch (err) {
    console.error("CHATBOT ERROR:", err);

    res.status(500).json({
      reply: "Server error: " + err.message
    });
  }
});

export default router;