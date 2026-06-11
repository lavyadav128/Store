import express from "express";
import axios from "axios";
import Company from "../schema/company.model.js";
import CompanyInsight from "../schema/companyinsight.model.js";
import auth from '../controller/authh.js'; // Custom auth middleware for protecting routes

const router = express.Router();

const CLAUDE_API_KEY = process.env.ANTHROPIC_API_KEY;
const CLAUDE_MODEL = "claude-sonnet-4-5-20250929";

// ── Companies CRUD ───────────────────────────────────────────────────────────

// GET /api/companies?industry=&search=&page=&limit=
router.get("/", async (req, res) => {
  try {
    const { industry, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (industry && industry !== "all") filter.industry = { $regex: new RegExp(industry, "i") };
    if (search) filter.name = { $regex: new RegExp(search, "i") };

    const skip = (Number(page) - 1) * Number(limit);
    const [companies, total] = await Promise.all([
      Company.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Company.countDocuments(filter),
    ]);

    res.json({ companies, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch companies" });
  }
});

// GET /api/companies/industries
router.get("/industries", async (req, res) => {
  try {
    const industries = await Company.distinct("industry");
    res.json(industries.filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch industries" });
  }
});

// POST /api/companies (admin adds a company manually)
router.post("/", auth, async (req, res) => {
  try {
    const { name, website, industry, location, contactEmail, socialLinks } = req.body;
    if (!name) return res.status(400).json({ error: "Company name is required" });

    const company = await Company.create({
      name,
      website,
      industry,
      location,
      contactEmail,
      socialLinks,
      addedBy: req.user?.id,
    });

    res.status(201).json(company);
  } catch (err) {
    res.status(500).json({ error: "Failed to create company" });
  }
});

// PUT /api/companies/:id
router.put("/:id", auth, async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!company) return res.status(404).json({ error: "Company not found" });
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: "Failed to update company" });
  }
});

// DELETE /api/companies/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    await CompanyInsight.deleteMany({ company: req.params.id });
    res.json({ message: "Company deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete company" });
  }
});

// ── AI Insight Generation ────────────────────────────────────────────────────

// POST /api/companies/:id/analyze
// Uses Claude API with web search to infer current challenges + draft outreach email
router.post("/:id/analyze", auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ error: "Company not found" });
    if (!CLAUDE_API_KEY) return res.status(500).json({ error: "Claude API key not configured" });

    const userPrompt = `Research the company "${company.name}"${company.website ? ` (website: ${company.website})` : ""}${company.industry ? `, industry: ${company.industry}` : ""}.

Use web search to find recent news, job postings, reviews, or public statements (last 6-12 months) that hint at challenges or problems the company is currently facing (e.g. hiring gaps, technical debt, scaling issues, market competition, product gaps, customer complaints).

Then respond ONLY with a valid JSON object (no markdown fences, no preamble) in this exact shape:
{
  "inferredProblems": ["problem 1", "problem 2", "problem 3"],
  "suggestedSolutions": ["solution mapped to problem 1", "solution mapped to problem 2", "solution mapped to problem 3"],
  "generatedEmail": "A short, professional outreach email (150-200 words) addressed to the hiring/business team, referencing one of the inferred problems and proposing how the sender could help, with a placeholder [Your Name] and [Your Portfolio/LinkedIn] for sender details",
  "sources": ["url1", "url2"],
  "confidence": "low | medium | high"
}

If you cannot find enough public information, set confidence to "low" and base inferences on general industry trends for a company of this type, but be explicit that these are general/speculative.`;

    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: CLAUDE_MODEL,
        max_tokens: 2000,
        messages: [{ role: "user", content: userPrompt }],
        tools: [{ type: "web_search_20250305", name: "web_search" }],
      },
      {
        headers: {
          "x-api-key": CLAUDE_API_KEY,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        timeout: 60000,
      }
    );

    // Concatenate all text blocks (web search may interleave tool_use blocks)
    const textBlocks = response.data.content.filter((b) => b.type === "text").map((b) => b.text);
    const fullText = textBlocks.join("\n").trim();

    // Strip potential markdown fences and parse JSON
    const cleaned = fullText.replace(/```json/gi, "").replace(/```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      // Fallback: try to find first { ... last }
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");
      if (start !== -1 && end !== -1) {
        parsed = JSON.parse(cleaned.slice(start, end + 1));
      } else {
        throw new Error("Could not parse AI response as JSON");
      }
    }

    const insight = await CompanyInsight.findOneAndUpdate(
      { company: company._id },
      {
        company: company._id,
        inferredProblems: parsed.inferredProblems || [],
        suggestedSolutions: parsed.suggestedSolutions || [],
        generatedEmail: parsed.generatedEmail || "",
        sources: parsed.sources || [],
        confidence: parsed.confidence || "medium",
        isAiGenerated: true,
        generatedAt: new Date(),
        nextRefreshAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      { upsert: true, new: true }
    );

    res.json(insight);
  } catch (err) {
    console.error("Analyze error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate AI insight", details: err.message });
  }
});

// GET /api/companies/:id/insight ── return cached insight if exists
router.get("/:id/insight", async (req, res) => {
  try {
    const insight = await CompanyInsight.findOne({ company: req.params.id });
    if (!insight) return res.status(404).json({ error: "No insight generated yet" });
    res.json(insight);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch insight" });
  }
});

// PUT /api/companies/:id/insight/email ── allow user to edit/regenerate email before sending
router.put("/:id/insight/email", auth, async (req, res) => {
  try {
    const { generatedEmail } = req.body;
    const insight = await CompanyInsight.findOneAndUpdate(
      { company: req.params.id },
      { generatedEmail },
      { new: true }
    );
    if (!insight) return res.status(404).json({ error: "Insight not found" });
    res.json(insight);
  } catch (err) {
    res.status(500).json({ error: "Failed to update email" });
  }
});

export default router;