import express from "express";
import axios from "axios";
import Job from "../schema/job.model.js";
import auth from '../controller/authh.js'; // Custom auth middleware for protecting routes

const router = express.Router();

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;

// Map free-text job titles to our category enum
const categorize = (title = "") => {
  const t = title.toLowerCase();
  if (/(software|developer|engineer|backend|frontend|full ?stack|sde|devops)/.test(t)) return "Software Development";
  if (/(data scientist|data analyst|machine learning|ml engineer|ai engineer)/.test(t)) return "Data Science";
  if (/(product manager|product owner)/.test(t)) return "Product";
  if (/(designer|ux|ui)/.test(t)) return "Design";
  if (/(marketing|seo|content)/.test(t)) return "Marketing";
  if (/(sales|business development|bd executive)/.test(t)) return "Sales";
  if (/(finance|accountant|analyst)/.test(t)) return "Finance";
  if (/(hr|human resource|recruiter|talent)/.test(t)) return "HR";
  if (/(operations|ops)/.test(t)) return "Operations";
  return "Other";
};

// crude skill extractor from description text
const SKILL_KEYWORDS = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust",
  "React", "Angular", "Vue", "Node.js", "Express", "Django", "Flask", "Spring",
  "MongoDB", "MySQL", "PostgreSQL", "Redis", "AWS", "Azure", "GCP", "Docker",
  "Kubernetes", "Git", "REST API", "GraphQL", "SQL", "HTML", "CSS", "Tailwind",
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Pandas",
  "NumPy", "Excel", "Power BI", "Tableau", "Figma", "SEO",
];

const extractSkills = (text = "") => {
  const found = new Set();
  for (const skill of SKILL_KEYWORDS) {
    const re = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (re.test(text)) found.add(skill);
  }
  return [...found];
};

// ── Fetch jobs from Adzuna (free tier) ──────────────────────────────────────
const fetchFromAdzuna = async (country = "in", page = 1, what = "") => {
  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) return [];
  const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`;
  const { data } = await axios.get(url, {
    params: {
      app_id: ADZUNA_APP_ID,
      app_key: ADZUNA_APP_KEY,
      results_per_page: 50,
      what,
    },
  });

  return (data.results || []).map((j) => ({
    title: j.title?.replace(/<[^>]*>/g, "") || "Untitled",
    companyName: j.company?.display_name || "Unknown",
    location: j.location?.display_name || "Remote",
    category: categorize(j.title),
    employmentType: j.contract_time === "part_time" ? "Part-time" : "Full-time",
    skills: extractSkills(`${j.title} ${j.description || ""}`),
    description: (j.description || "").slice(0, 1000),
    applyLink: j.redirect_url,
    source: "Adzuna",
    sourceId: j.id,
    postedDate: j.created ? new Date(j.created) : new Date(),
  }));
};

// ── Fetch jobs from Remotive (free, no key required) ────────────────────────
const fetchFromRemotive = async (search = "") => {
  const url = "https://remotive.com/api/remote-jobs";
  const { data } = await axios.get(url, { params: search ? { search } : {} });

  return (data.jobs || []).slice(0, 100).map((j) => ({
    title: j.title,
    companyName: j.company_name,
    companyLogo: j.company_logo || "",
    location: j.candidate_required_location || "Remote",
    category: categorize(j.title),
    employmentType: j.job_type || "Full-time",
    skills: extractSkills(`${j.title} ${j.description || ""} ${(j.tags || []).join(" ")}`),
    description: (j.description || "").replace(/<[^>]*>/g, "").slice(0, 1000),
    applyLink: j.url,
    source: "Remotive",
    sourceId: String(j.id),
    postedDate: j.publication_date ? new Date(j.publication_date) : new Date(),
  }));
};

// ── POST /api/jobs/refresh ── (admin/cron triggered) ────────────────────────
// Pulls fresh listings from external sources and upserts into DB
router.post("/refresh", auth, async (req, res) => {
  try {
    const { keyword = "" } = req.body;

    const [adzuna, remotive] = await Promise.allSettled([
      fetchFromAdzuna("in", 1, keyword),
      fetchFromRemotive(keyword),
    ]);

    const all = [
      ...(adzuna.status === "fulfilled" ? adzuna.value : []),
      ...(remotive.status === "fulfilled" ? remotive.value : []),
    ];

    let upserted = 0;
    for (const job of all) {
      if (!job.sourceId) continue;
      const result = await Job.updateOne(
        { source: job.source, sourceId: job.sourceId },
        { $set: job },
        { upsert: true }
      );
      if (result.upsertedCount > 0) upserted++;
    }

    res.json({ message: "Jobs refreshed", fetched: all.length, newJobs: upserted });
  } catch (err) {
    console.error("Job refresh error:", err.message);
    res.status(500).json({ error: "Failed to refresh jobs" });
  }
});

// ── GET /api/jobs ── (filter by category, skill, location, search) ─────────
router.get("/", async (req, res) => {
  try {
    const { category, skill, location, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (category && category !== "all") filter.category = category;
    if (skill) filter.skills = { $regex: new RegExp(skill, "i") };
    if (location) filter.location = { $regex: new RegExp(location, "i") };
    if (search) {
      filter.$or = [
        { title: { $regex: new RegExp(search, "i") } },
        { companyName: { $regex: new RegExp(search, "i") } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [jobs, total] = await Promise.all([
      Job.find(filter).sort({ postedDate: -1 }).skip(skip).limit(Number(limit)),
      Job.countDocuments(filter),
    ]);

    res.json({ jobs, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// ── GET /api/jobs/categories ── distinct categories with counts ────────────
router.get("/categories", async (req, res) => {
  try {
    const counts = await Job.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(counts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

export default router;