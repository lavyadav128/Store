// ─────────────────────────────────────────────────────────────────────────────
// IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import express from "express";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import Groq from "groq-sdk";
import { createRequire } from "module";
import { rateLimiter } from "../../shared/middleware/rateLimit.js";
import optionalAuth from "../../shared/middleware/optionalAuth.js";
import { getCommerceContext } from "../revenue-recovery/services/commerceContext.js";
import {
  buildPaymentStatusReply,
  getStudentAssistantContext,
  handlePromiseToPayInChat,
  recordStudentInterests,
} from "./studentContext.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const router = express.Router();

// =========================
// VECTOR STORE (RAG)
// =========================

const VECTOR_STORE_PATH = path.join(path.resolve(), "ai", "vector_store.json");

const vectorStore = fs.existsSync(VECTOR_STORE_PATH)
  ? JSON.parse(fs.readFileSync(VECTOR_STORE_PATH, "utf-8"))
  : [];

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

function cosine(a, b) {
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] ** 2;
    nb += b[i] ** 2;
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

async function searchChunks(query, k = 5) {
  if (!vectorStore || vectorStore.length === 0) return [];
  try {
    const emb = await getEmbedder();
    const output = await emb(query, { pooling: "mean", normalize: true });
    const queryVector = Array.from(output.data);

    const scored = vectorStore.map((chunk) => ({
      ...chunk,
      score: cosine(queryVector, chunk.embedding),
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, k);
  } catch (err) {
    console.warn("Vector search exception, continuing without RAG:", err.message);
    return [];
  }
}

function topicFromUrl(context = {}) {
  const url = context.fullUrl || context.path || "";
  if (!url) return "General Academic & Platform Guidance";
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1] || "General Academic";
}

function detectTopic(chunks = [], context = {}) {
  if (chunks.length > 0 && chunks[0].metadata) {
    return {
      chapter: chunks[0].metadata.chapter || "Platform",
      subject: chunks[0].metadata.subject || "Academics",
    };
  }
  return {
    chapter: topicFromUrl(context),
    subject: "Platform Assistant",
  };
}

// =========================
// MULTI-TIER LLM CALLER (Groq -> OpenRouter)
// =========================

function cleanLlmText(rawText = "") {
  if (!rawText) return "";
  let text = rawText.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  const lastDirectHook = text.lastIndexOf("🎯");
  if (lastDirectHook !== -1) {
    text = text.slice(lastDirectHook);
  }
  const trailingCheckIdx = text.search(/\n(?:4\.\s*\*\*Check Against Constraints|\*\*Check Constraints|Self-Correction|All constraints met|\d+\.\s*\*\*Check)/i);
  if (trailingCheckIdx !== -1) {
    text = text.slice(0, trailingCheckIdx);
  }
  return text.trim();
}

async function callLLM(messages) {
  // 1. Try Groq (Ultra-Fast 500 T/s)
  if (process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes("your_")) {
    try {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
        messages,
      });
      const text = cleanLlmText(completion.choices?.[0]?.message?.content);
      if (text) return text;
    } catch (groqErr) {
      try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const completion = await groq.chat.completions.create({
          model: "qwen/qwen3.6-27b",
          temperature: 0.5,
          messages,
        });
        const text = cleanLlmText(completion.choices?.[0]?.message?.content);
        if (text) return text;
      } catch (_) {}
      console.warn("Groq chatbot exception, trying OpenRouter:", groqErr.message);
    }
  }

  // 2. Try OpenRouter Fallback
  if (process.env.OPENROUTER_API_KEY && !process.env.OPENROUTER_API_KEY.includes("your_")) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "X-Title": "AI Study Copilot",
        },
        body: JSON.stringify({
          model: "nvidia/nemotron-nano-9b-v2:free",
          messages,
          temperature: 0.6,
        }),
      });

      const data = await res.json();
      if (res.ok && data?.choices?.[0]?.message?.content) {
        return cleanLlmText(data.choices[0].message.content);
      }
    } catch (llmErr) {
      console.warn("OpenRouter chatbot exception:", llmErr.message);
    }
  }

  return "I am currently available to assist you! Feel free to ask about your courses, batches, notes, or payment questions.";
}

// =========================
// SYSTEM PROMPT BUILDER
// =========================

function buildMessages(message, context, chunks, history, commerceContext, personalContext) {
  const studyMaterial = chunks.map((c) => c.text).join("\n\n");
  const topic = topicFromUrl(context);

  const availableBatchesFormatted = (commerceContext.availableProducts || []).map((p) => ({
    title: p.title,
    type: p.type === "batch" ? "Video Course Batch" : "PDF Notes Package",
    category: p.category,
    academicLevel: p.academicLevel || "All Levels",
    price: `₹${p.price}`,
    directLink: p.destination,
    whatYouLearn: (p.whatYouLearn || []).slice(0, 4),
    features: (p.includedFeatures || []).slice(0, 4),
    examFocus: p.examFocus || [],
  }));

  const ownedBatchesFormatted = (commerceContext.ownedProducts || []).map((p) => ({
    title: p.title,
    price: `₹${p.price}`,
  }));

  const systemPrompt = `You are the master AI Academic Mentor, Course Counselor, and Platform Assistant for this education platform.
You format every answer following the exact, beautiful, structured sequence of **ChatGPT** (clear headers, clean tables/lists, key takeaways, and thoughtful follow-up prompts).

CURRENT USER PROFILE:
- Name: ${personalContext.learner?.name || "Student"}
- Target Goal: ${personalContext.learner?.goal || "Academic Excellence"}
- Stated Interests: ${(personalContext.learner?.interests || []).join(", ") || "General"}
- Authenticated: ${personalContext.authenticated ? "YES" : "NO (Guest)"}

COURSES THE USER ALREADY OWNS & HAS ACCESS TO:
${JSON.stringify(ownedBatchesFormatted, null, 2)}

ALL CURRENTLY AVAILABLE BATCHES & NOTE PACKAGES:
${JSON.stringify(availableBatchesFormatted, null, 2)}

USER'S LIVE PAYMENT & RECOVERY STATUS:
- Recent Payment Failures / Declines: ${JSON.stringify(personalContext.recentPaymentFailures || [], null, 2)}
- Recent Payment Attempts: ${JSON.stringify(personalContext.recentPaymentAttempts || [], null, 2)}
- Active Recovery Discounts / Coupons: ${JSON.stringify(personalContext.activeRecoveryOffers || [], null, 2)}

STUDY / CONCEPT MATERIAL RETRIEVED:
${studyMaterial || "General academic repository"}

══════════════════════════════════════════════════════════════════════
MANDATORY CHATGPT-STYLE RESPONSE SEQUENCE & FORMATTING PROTOCOL:
══════════════════════════════════════════════════════════════════════
For EVERY user question, organize your response into this clean 5-step sequence:

1. 🎯 **Direct Hook & Core Answer**:
   - Begin immediately with a concise, punchy 1-2 sentence direct response or friendly greeting acknowledging the user's intent.

2. 📋 **Structured Breakdown in Clean Points (NO MARKDOWN TABLES)**:
   - Use clear markdown headers (e.g. \`### 🔹 Key Breakdown\` or \`### 1. ...\`, \`### 2. ...\`).
   - Use structured bullet points (\`•\` or \`🔹\`) with **bold labels** for each detail.
   - **CRITICAL: NEVER USE MARKDOWN TABLES FOR COURSES OR BATCHES!** Always present each course as an organized, beautifully spaced bullet-point card:

     ### 🔹 [Course Title]
     • **Price:** ₹[Price]
     • **Exam Target:** [JEE Main / Advanced / Boards / NEET]
     • **Key Inclusions:** [PYQs, Test Series, Notes, Mentorship]
     • **Best Suited For:** [Ideal student goal]
     • **Direct Access Link:** 👉 [View Course](/class/[id])

3. 🔍 **Deep-Dive & Practical Guidance**:
   - Provide clear comparison points, syllabus insights, or conceptual explanations in concise bullet points.
   - For coding/academic concepts: include concise code snippets or clear mathematical steps.
   - Never invent fake prices, fake discounts, or unlisted features.

4. 💡 **Pro-Tip & Key Takeaway**:
   - Include a practical, high-value takeaway (\`💡 **Pro Tip / Key Takeaway:** ...\`).

5. ❓ **Engaging Follow-Up Question**:
   - End with a friendly, open-ended question that naturally guides the student's next step (e.g. *"Would you like me to map out a 30-day study timetable for this batch, or help you compare specific subjects?"*).

══════════════════════════════════════════════════════════════════════
CORE BEHAVIORAL DIRECTIVES:
══════════════════════════════════════════════════════════════════════
- **Goal-Based Matching:** Recommend the exact most relevant batch or note package from the catalog with exact price in ₹, syllabus features, and direct links. Never recommend courses the user ALREADY OWNS.
- **Unlisted Subject Handling:** If the student asks for a course not in our catalog (e.g. UPSC, CA Foundation, CAT, GRE, SAT, Class 8), answer honestly and reassuringly:
  *"We currently do not offer a dedicated batch for **[Subject/Exam]**, but our academic faculty is actively planning to introduce it soon! Let me know if you need help with our foundational STEM, mathematics, or coding courses."*
- **Live Payment & Failure Diagnosis:** If asked about payment failures or card declines, explain the exact diagnostic cause from their live record (e.g. 3D Secure OTP timeout with issuing bank, insufficient balance, card expired) and provide safe next steps.
- **Payment Doubts, Revenue & Pricing:** Confidently answer all questions about batch pricing, supported payment methods (Razorpay UPI, Google Pay, PhonePe, Paytm, Cards, Netbanking), 10-month course validity, and the 3-day refund policy.
- **Active Recovery Discounts:** If the student has an active recovery discount in their live profile, mention the special discount percentage, highlight the discounted price, and provide direct links to either the Notifications page (/dashboard?view=notifications) or direct checkout (/pay-discount/{offerId}).
- **Tone:** Friendly, encouraging, empathetic, and professional. Support English and Hinglish seamlessly.`;

  const historyMessages = history.slice(-6).map((h) => ({
    role: h.role === "bot" || h.role === "assistant" ? "assistant" : "user",
    content: h.content,
  }));

  return [
    { role: "system", content: systemPrompt },
    ...historyMessages,
    { role: "user", content: message },
  ];
}

async function extractPdfText(base64) {
  const buffer = Buffer.from(base64, "base64");
  const data = await pdfParse(buffer);
  return data.text.slice(0, 15000);
}

// =========================
// MAIN ROUTE: POST /api/chatbot
// =========================

router.post(
  "/chatbot",
  optionalAuth,
  rateLimiter({ requests: 20, window: "1 m", prefix: "rl:chatbot" }),
  async (req, res) => {
    try {
      const { message, context = {}, history = [], pdf } = req.body;
      const userId = req.user?._id || null;

      if (!message) {
        return res.status(400).json({ reply: "Message is required." });
      }

      // Record student interests dynamically from conversation
      if (userId) recordStudentInterests(userId, message).catch(() => {});

      // Fetch live fresh commerce and personal context
      const [commerceContext, personalContext] = await Promise.all([
        getCommerceContext(userId),
        getStudentAssistantContext(userId),
      ]);

      // PDF Summarization Mode
      if (message === "__PDF_SUMMARISE__" && pdf?.base64) {
        const text = await extractPdfText(pdf.base64);
        const msgs = [
          { role: "system", content: "You are an expert academic tutor and PDF summarizer. Provide a concise, structured summary following clean ChatGPT formatting with key takeaways." },
          { role: "user", content: text },
        ];
        const reply = await callLLM(msgs);
        return res.json({
          reply,
          detected: { chapter: "PDF", subject: pdf.name || "Document" },
        });
      }

      // Check for Promise-to-Pay intent (e.g., "I will pay tomorrow / on Friday")
      if (userId) {
        const promiseReply = await handlePromiseToPayInChat(userId, message);
        if (promiseReply) {
          return res.json({
            reply: promiseReply,
            detected: { chapter: "Payment Commitments", subject: "Promise-to-Pay Tracker" },
          });
        }
      }

      // Fast-path payment failure lookup if user explicitly asks about payment
      const paymentDirectReply = buildPaymentStatusReply(message, personalContext);
      if (paymentDirectReply) {
        return res.json({
          reply: paymentDirectReply,
          detected: { chapter: "Account & Payments", subject: "Live Payment Diagnostic" },
        });
      }

      // Search relevant chunks via RAG
      const chunks = await searchChunks(message, 4);

      // Construct omniscient prompt with ChatGPT sequence
      const msgs = buildMessages(message, context, chunks, history, commerceContext, personalContext);

      // Call LLM
      const reply = await callLLM(msgs);

      res.json({
        reply,
        detected: detectTopic(chunks, context),
      });
    } catch (err) {
      console.error("CHATBOT ERROR:", err);
      res.status(500).json({
        reply: "Sorry, I encountered a temporary issue. Please ask again in a moment.",
      });
    }
  }
);

export default router;
