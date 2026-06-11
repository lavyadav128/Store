// cron/jobRefreshCron.js
// Periodically refreshes job listings from external sources (Adzuna, Remotive)
// Import and call setupJobCron() once from your main server file after DB connects.

import cron from "node-cron";
import axios from "axios";
import Job from "../schema/job.model.js";
import Company from "../schema/company.model.js";
import CompanyInsight from "../schema/companyinsight.model.js";

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;
const CLAUDE_API_KEY = process.env.ANTHROPIC_API_KEY;
const CLAUDE_MODEL = "claude-sonnet-4-5-20250929";

// Reuse the same fetchers as jobRoutes (kept inline here to avoid circular requires)
const fetchFromRemotive = async () => {
  const { data } = await axios.get("https://remotive.com/api/remote-jobs");
  return (data.jobs || []).slice(0, 100).map((j) => ({
    title: j.title,
    companyName: j.company_name,
    companyLogo: j.company_logo || "",
    location: j.candidate_required_location || "Remote",
    employmentType: j.job_type || "Full-time",
    description: (j.description || "").replace(/<[^>]*>/g, "").slice(0, 1000),
    applyLink: j.url,
    source: "Remotive",
    sourceId: String(j.id),
    postedDate: j.publication_date ? new Date(j.publication_date) : new Date(),
  }));
};

const setupJobCron = () => {
  // Refresh job listings every 6 hours
  cron.schedule("0 */6 * * *", async () => {
    console.log("[cron] Refreshing job listings...");
    try {
      const jobs = await fetchFromRemotive();
      let upserted = 0;
      for (const job of jobs) {
        const result = await Job.updateOne(
          { source: job.source, sourceId: job.sourceId },
          { $set: job },
          { upsert: true }
        );
        if (result.upsertedCount > 0) upserted++;
      }
      console.log(`[cron] Job refresh done. ${upserted} new jobs added.`);
    } catch (err) {
      console.error("[cron] Job refresh failed:", err.message);
    }
  });

  // Re-run AI company analysis weekly for insights past their refresh date
  cron.schedule("0 3 * * 0", async () => {
    console.log("[cron] Refreshing stale company insights...");
    try {
      const stale = await CompanyInsight.find({ nextRefreshAt: { $lte: new Date() } }).limit(20);
      for (const insight of stale) {
        const company = await Company.findById(insight.company);
        if (!company || !CLAUDE_API_KEY) continue;

        try {
          const userPrompt = `Research the company "${company.name}"${company.website ? ` (website: ${company.website})` : ""}. Use web search for recent (last 6-12 months) news/job posts/reviews hinting at current challenges. Respond ONLY with JSON: {"inferredProblems":[...],"suggestedSolutions":[...],"generatedEmail":"...","sources":[...],"confidence":"low|medium|high"}`;

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

          const text = response.data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
          const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
          const start = cleaned.indexOf("{");
          const end = cleaned.lastIndexOf("}");
          const parsed = JSON.parse(cleaned.slice(start, end + 1));

          insight.inferredProblems = parsed.inferredProblems || [];
          insight.suggestedSolutions = parsed.suggestedSolutions || [];
          insight.generatedEmail = parsed.generatedEmail || "";
          insight.sources = parsed.sources || [];
          insight.confidence = parsed.confidence || "medium";
          insight.generatedAt = new Date();
          insight.nextRefreshAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          await insight.save();
        } catch (e) {
          console.error(`[cron] Insight refresh failed for ${company.name}:`, e.message);
        }
      }
      console.log(`[cron] Refreshed ${stale.length} insights.`);
    } catch (err) {
      console.error("[cron] Insight refresh job failed:", err.message);
    }
  });
};

export default setupJobCron;