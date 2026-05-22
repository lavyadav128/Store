import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const router = express.Router();

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Chatbot App",
  },
});

router.post("/chatbot", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message required",
      });
    }

    const completion = await client.chat.completions.create({
      // 🔥 KEY FIX HERE
      model: "openrouter/auto",

      messages: [
        {
          role: "system",
          content:
            "You are a helpful ChatGPT-like AI assistant. Be clear, helpful, and conversational.",
        },

        ...history,

        {
          role: "user",
          content: message,
        },
      ],

      temperature: 0.7,
      max_tokens: 1200,
    });

    const reply =
      completion?.choices?.[0]?.message?.content ||
      "No response generated";

    return res.json({ reply });

  } catch (error) {
    console.error("OpenRouter Error:", error);

    return res.status(500).json({
      error: "AI service failed",
      details: error?.error?.message || error.message,
    });
  }
});

export default router;