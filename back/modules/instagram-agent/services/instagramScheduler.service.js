import cron from "node-cron";
import InstagramContent from "../schema/InstagramContent.model.js";
import { generateContentDraft, getInstagramConfig, logInstagramActivity, publishDueContent, getQuoteFingerprint } from "./instagramAgent.service.js";
import { analyzeAudiencePreferences } from "./growthOptimizer.js";
import { searchGoogleKohliImages, createViratKohliDraft, getNextLoopedSong } from "./viratKohliSearch.service.js";

let scheduled = false;

export async function createDailyDrafts() {
  const config = await getInstagramConfig();
  if (!config.running) return;

  const today = new Date().toISOString().slice(0, 10);
  const alreadyCreated = await InstagramContent.countDocuments({
    createdBy: "agent",
    createdAt: { $gte: new Date(`${today}T00:00:00.000Z`) },
  });

  const missing = Math.max(0, (config.postsPerDay || 1) - alreadyCreated);
  if (missing <= 0) return;

  // Calculate schedule time based on config.dailyPostTime (default: "12:00" PM Noon IST)
  const [postHour, postMinute] = (config.dailyPostTime || "12:00").split(":").map(Number);
  const scheduledTime = new Date();
  scheduledTime.setHours(postHour || 12, postMinute || 0, 0, 0);

  // If the scheduled time for today has already passed, schedule for today + 10 mins or tomorrow
  if (scheduledTime.getTime() < Date.now()) {
    scheduledTime.setTime(Date.now() + 10 * 60 * 1000);
  }

  // If agent persona is Virat Kohli inspiration, use Google Search & Song Engine
  if (config.agentPersona === "virat_kohli_inspiration" || config.searchTopic?.toLowerCase().includes("virat")) {
    const searchTopic = config.searchTopic || "Virat Kohli quotes wallpapers";
    const searchResults = await searchGoogleKohliImages(searchTopic, 30);
    
    // Strict Deduplication against all past posts
    const pastContents = await InstagramContent.find(
      {},
      { quoteFingerprint: 1, quote: 1, assetUrl: 1 }
    ).sort({ createdAt: -1 }).limit(300).lean();

    const usedFingerprints = new Set(
      pastContents.map((p) => p.quoteFingerprint || getQuoteFingerprint(p.quote)).filter(Boolean)
    );
    const usedImages = new Set(
      pastContents.map((p) => p.assetUrl).filter(Boolean)
    );

    const activeSongs = (config.listedSongs || []).filter((s) => s.active !== false);

    for (let index = 0; index < missing; index += 1) {
      let chosenItem = searchResults.find((item) => {
        const fp = getQuoteFingerprint(item.imageUrl + item.quote + item.topic);
        return !usedFingerprints.has(fp) && !usedImages.has(item.imageUrl);
      });

      if (!chosenItem) {
        chosenItem = searchResults[index % searchResults.length];
      }
      
      const chosenFp = getQuoteFingerprint(chosenItem.imageUrl + chosenItem.quote + chosenItem.topic);
      usedFingerprints.add(chosenFp);
      usedImages.add(chosenItem.imageUrl);

      const chosenSong = await getNextLoopedSong(activeSongs);

      const draft = await createViratKohliDraft({
        imageUrl: chosenItem.imageUrl,
        quote: chosenItem.quote,
        topic: chosenItem.topic || "King Kohli Motivation",
        song: chosenSong,
        status: "scheduled",
      });

      if (draft) {
        draft.scheduledFor = scheduledTime;
        await draft.save();
      }
    }

    await logInstagramActivity(
      "daily_drafts_created",
      `Created ${missing} unique daily Virat Kohli 9:16 Video Reel(s) with looped song, scheduled for ${config.dailyPostTime || "12:00"} IST.`
    );
    return;
  }

  const types = config.contentMode === "both" ? ["post", "reel"] : [config.contentMode || "post"];

  for (let index = 0; index < missing; index += 1) {
    const draft = await generateContentDraft({ type: types[index % types.length] });
    if (draft) {
      draft.scheduledFor = scheduledTime;
      await draft.save();
    }
  }

  await logInstagramActivity(
    "daily_drafts_created",
    `Created ${missing} unique daily draft(s), scheduled for ${config.dailyPostTime || "12:00"} IST.`
  );
}

// Schedules are server-side only. Stopping the agent makes jobs no-ops.
export function startInstagramAgentScheduler() {
  if (scheduled) return;
  scheduled = true;

  const tz = process.env.INSTAGRAM_TIMEZONE || "Asia/Kolkata";

  // 1. Daily morning content generation at 06:00 AM IST
  cron.schedule("0 6 * * *", () => createDailyDrafts().catch((err) => console.error("Instagram draft scheduler error:", err.message)), { timezone: tz });

  // 2. Continuous publisher for due posts (checks every 2 minutes)
  cron.schedule("*/2 * * * *", () => publishDueContent().catch((err) => console.error("Instagram publish scheduler error:", err.message)));

  // 3. Nightly audience analytics & growth optimization at 23:00 IST
  cron.schedule("0 23 * * *", () => analyzeAudiencePreferences().catch((err) => console.error("Audience analytics error:", err.message)), { timezone: tz });
}
