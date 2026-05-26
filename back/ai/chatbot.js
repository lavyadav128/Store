import express from "express";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { createRequire } from "module";

/// At top of chatbot.js — exact same as ingest.js
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
const router = express.Router();

// =========================
// VECTOR STORE
// =========================
const VECTOR_STORE_PATH = path.join(path.resolve(), "ai", "vector_store.json");
const vectorStore = JSON.parse(fs.readFileSync(VECTOR_STORE_PATH, "utf-8"));

// =========================
// EMBEDDINGS
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
    na  += a[i] ** 2;
    nb  += b[i] ** 2;
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

// =========================
// VECTOR SEARCH
// =========================
async function searchChunks(query, k = 8) {
  const model     = await getEmbedder();
  const embedding = await model(query, { pooling: "mean", normalize: true });
  const qVec      = Array.from(embedding.data);

  return vectorStore
    .map((item) => ({ ...item, score: cosine(qVec, item.embedding) }))
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
    map[chapter]  = (map[chapter] || 0) + 1;
  }
  const best = Object.entries(map).sort((a, b) => b[1] - a[1])[0];
  return {
    chapter: best?.[0] || "Unknown",
    subject: chunks[0]?.metadata?.subject || "General",
    urlTopic: context?.topic || "Unknown",
  };
}

// =========================
// URL → human-readable topic
// =========================
function topicFromUrl(context) {
  const slug = context?.topic || "";
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ") || "the current topic";
}

// =========================
// CHATGPT-STYLE FORMATTING INSTRUCTION
// =========================
const FORMAT_RULES = `
=== RESPONSE FORMAT (always follow this) ===
Structure every reply like a professional AI assistant:

1. Start with a short **bold headline** summarising the answer.
2. Use **## Section Headers** for major sections when the answer has multiple parts.
3. Use **bullet points** (- item) for lists of facts, features, or steps.
4. Use **numbered lists** (1. 2. 3.) for sequential steps or ranked items.
5. Use **bold** for key terms and important phrases.
6. Use > blockquotes for definitions or important notes.
7. End with a **💡 Quick Tip** or **📝 Summary** line when helpful.
8. Keep paragraphs short (2–3 sentences max).
9. Never output a wall of plain text — always add structure.
10. Use emojis sparingly at the start of section headers for visual cues (📘 🔑 🧪 💡 📄).
`;

// =========================
// PROMPT BUILDER — course material mode
// =========================
function buildMessages(message, context, chunks, history) {
  const studyMaterial = chunks.map((c) => c.text).join("\n\n");
  const topic         = topicFromUrl(context);

  const systemPrompt = `You are a focused, expert study assistant embedded in an EdTech platform.

The student is currently viewing: ${context.fullUrl}
Their topic is: "${topic}"

NEVER ask for more context. NEVER say "please provide a topic". Always answer directly about "${topic}".

=== STUDY MATERIAL ===
${studyMaterial || "No material loaded — answer from general knowledge about the topic."}

${FORMAT_RULES}

Additional rules:
- Always answer about "${topic}" even for vague questions ("summarise this" = summarise ${topic})
- Be concise, educational, and well-structured
- The output will be rendered as Markdown in the UI`;

  const historyMessages = history.map((h) => ({
    role:    h.role === "bot" ? "assistant" : "user",
    content: h.content,
  }));

  const enrichedMessage = enrichMessage(message, topic);

  return [
    { role: "system",    content: systemPrompt },
    ...historyMessages,
    { role: "user",      content: enrichedMessage },
  ];
}

// =========================
// PROMPT BUILDER — PDF summarise mode
// =========================
function buildPdfMessages(pdfText, pdfName) {
  const systemPrompt = `You are an expert document summariser.

A student has uploaded a PDF titled: "${pdfName}"

Your job is to produce a comprehensive, well-structured summary of the document.

${FORMAT_RULES}

Additional rules for PDF summarisation:
- Start with ## 📄 Summary of: ${pdfName}
- Include a ## 🔑 Key Points section with 5–8 bullet points
- Include a ## 📘 Main Concepts section explaining the core ideas
- Include a ## 💡 Takeaways section with 2–3 practical insights
- If the document has sections/chapters, reflect them with ## headers
- Be thorough but not repetitive`;

  return [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `Please summarise the following document:\n\n${pdfText}`,
    },
  ];
}

// =========================
// MESSAGE ENRICHER
// =========================
function enrichMessage(message, topic) {
  const lower = message.toLowerCase().trim();

  const genericPatterns = [
    /^summaris[e]?\s*(this(\s+topic)?)?\.?$/i,
    /^summariz[e]?\s*(this(\s+topic)?)?\.?$/i,
    /^give me (the\s+)?key points?\.?$/i,
    /^key points?\.?$/i,
    /^quiz me( on this)?\.?$/i,
    /^explain( this)?\.?$/i,
    /^what is this\??$/i,
    /^tell me about this\.?$/i,
  ];

  for (const pattern of genericPatterns) {
    if (pattern.test(lower)) {
      if (/summar/i.test(lower))    return `Summarise the topic "${topic}" using the study material provided.`;
      if (/key point/i.test(lower)) return `List the key points of "${topic}" from the study material.`;
      if (/quiz/i.test(lower))      return `Create a short 3-question quiz about "${topic}".`;
      if (/explain/i.test(lower))   return `Explain "${topic}" clearly with examples.`;
      return `Tell me about "${topic}".`;
    }
  }

  return `${message}\n\n(Context: the student is studying "${topic}")`;
}

// =========================
// EXTRACT TEXT FROM PDF BASE64
// Uses createRequire — same pattern as ingest.js (reliable in ESM)
// =========================
async function extractPdfText(base64) {
    try {
      const buffer = Buffer.from(base64, "base64");
      const data   = await pdfParse(buffer);   // call directly, no "new", no .default
      return data.text.slice(0, 15000);
    } catch (err) {
      console.error("[Chatbot] pdf-parse error:", err.message);
      throw new Error("Could not extract text from PDF: " + err.message);
    }
  }

// =========================
// OLLAMA CALL
// =========================
async function callLLM(messages) {
  const res = await fetch("http://127.0.0.1:11434/api/chat", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model:    "qwen2.5:1.5b",
      messages,
      stream:   false,
    }),
  });

  const data = await res.json();
  return data?.message?.content || "No response generated";
}

// =========================
// ROUTE  POST /api/chatbot
// =========================
router.post("/chatbot", async (req, res) => {
  try {
    const { message, context = {}, history = [], pdf } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required." });
    }

    // ── PDF SUMMARISE MODE ──────────────────────
    if (message === "__PDF_SUMMARISE__" && pdf?.base64) {
      console.log("[Chatbot] PDF mode | file:", pdf.name);

      const pdfText  = await extractPdfText(pdf.base64);
      const msgs     = buildPdfMessages(pdfText, pdf.name || "document.pdf");
      const reply    = await callLLM(msgs);

      console.log("[Chatbot] PDF reply:", reply.slice(0, 120));
      return res.json({ reply, detected: { chapter: "PDF Upload", subject: pdf.name } });
    }

    // ── NORMAL CHAT MODE ─────────────────────────
    console.log("[Chatbot] topic:", context.topic, "| message:", message);

    const chunks = await searchChunks(message, 8);
    const msgs   = buildMessages(message, context, chunks, history);
    const reply  = await callLLM(msgs);

    console.log("[Chatbot] reply:", reply.slice(0, 120));

    res.json({
      reply,
      detected: detectTopic(chunks, context),
    });

  } catch (err) {
    console.error("[Chatbot] error:", err);
    res.status(500).json({ reply: `Server error: ${err.message}` });
  }
});

export default router;