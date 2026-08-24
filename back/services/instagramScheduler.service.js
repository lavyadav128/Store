import cron from "node-cron";
import InstagramContent from "../schema/InstagramContent.model.js";
import { generateContentDraft, getInstagramConfig, logInstagramActivity, publishDueContent } from "./instagramAgent.service.js";

let scheduled = false;

async function createDailyDrafts() {
  const config = await getInstagramConfig();
  if (!config.running) return;
  const today = new Date().toISOString().slice(0, 10);
  const alreadyCreated = await InstagramContent.countDocuments({ createdBy: "agent", createdAt: { $gte: new Date(`${today}T00:00:00.000Z`) } });
  const missing = Math.max(0, config.postsPerDay - alreadyCreated);
  const types = config.contentMode === "both" ? ["post", "reel"] : [config.contentMode];
  for (let index = 0; index < missing; index += 1) await generateContentDraft({ type: types[index % types.length] });
  if (missing) await logInstagramActivity("daily_drafts_created", `Created ${missing} daily AI content draft(s). Attach compliant public media before publishing.`);
}

// Schedules are server-side only. Stopping the agent makes both jobs no-ops.
export function startInstagramAgentScheduler() {
  if (scheduled) return;
  scheduled = true;
  cron.schedule("15 8 * * *", () => createDailyDrafts().catch((error) => console.error("Instagram draft scheduler error:", error.message)), { timezone: process.env.INSTAGRAM_TIMEZONE || "Asia/Kolkata" });
  cron.schedule("*/10 * * * *", () => publishDueContent().catch((error) => console.error("Instagram publish scheduler error:", error.message)));
}
