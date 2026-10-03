import cron from "node-cron";
import InstagramContent from "../schema/InstagramContent.model.js";
import {
  generateContentDraft,
  getInstagramConfig,
  logInstagramActivity,
  publishDueContent,
  publishContent,
  getQuoteFingerprint,
} from "./instagramAgent.service.js";
import { analyzeAudiencePreferences } from "./growthOptimizer.js";
import {
  searchGoogleKohliImages,
  createViratKohliDraft,
  getNextLoopedSong,
  getUniqueViratKohliQuoteImage,
} from "./viratKohliSearch.service.js";

let scheduled = false;

// IST offset is UTC+5:30 (+330 minutes = 19,800,000 ms)
export const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

export function getISTDate(date = new Date()) {
  return new Date(date.getTime() + IST_OFFSET_MS);
}

// Returns start and end of current IST day represented in UTC Date objects (for Mongo query)
export function getISTDayBounds(date = new Date()) {
  const istDate = new Date(date.getTime() + IST_OFFSET_MS);
  const year = istDate.getUTCFullYear();
  const month = istDate.getUTCMonth();
  const day = istDate.getUTCDate();

  const startOfDayIST = new Date(Date.UTC(year, month, day, 0, 0, 0, 0) - IST_OFFSET_MS);
  const endOfDayIST = new Date(Date.UTC(year, month, day, 23, 59, 59, 999) - IST_OFFSET_MS);

  return { startOfDayIST, endOfDayIST };
}

// Returns today's scheduled Date in UTC Date given "HH:mm" in IST
export function getISTScheduledDate(timeStr = "12:00", date = new Date()) {
  const [postHour, postMinute] = (timeStr || "12:00").split(":").map((n) => parseInt(n, 10) || 0);
  const istDate = new Date(date.getTime() + IST_OFFSET_MS);
  const year = istDate.getUTCFullYear();
  const month = istDate.getUTCMonth();
  const day = istDate.getUTCDate();

  return new Date(Date.UTC(year, month, day, postHour, postMinute, 0, 0) - IST_OFFSET_MS);
}

export async function createDailyDrafts() {
  const config = await getInstagramConfig();
  if (!config.running) return;

  const { startOfDayIST, endOfDayIST } = getISTDayBounds();

  // 1. Purge / cancel any stale pending drafts created before today's IST day start
  // This guarantees that no leftover draft from yesterday or earlier is EVER published today!
  await InstagramContent.updateMany(
    {
      createdBy: "agent",
      status: { $in: ["ready", "scheduled"] },
      createdAt: { $lt: startOfDayIST },
    },
    { $set: { status: "failed", error: "Stale draft from previous day cancelled." } }
  );

  // 2. Count already published posts for today in IST
  const publishedToday = await InstagramContent.countDocuments({
    createdBy: "agent",
    status: "published",
    publishedAt: { $gte: startOfDayIST, $lte: endOfDayIST },
  });

  const postsPerDay = config.postsPerDay || 1;
  const missing = Math.max(0, postsPerDay - publishedToday);
  if (missing <= 0) return;

  // Calculate schedule time in IST for today
  const scheduledTime = getISTScheduledDate(config.dailyPostTime || "12:00");
  const now = Date.now();
  const isOverdue = now >= scheduledTime.getTime();

  // 3. Check for any valid drafts created TODAY
  const todaysDrafts = await InstagramContent.find({
    createdBy: "agent",
    status: { $in: ["ready", "scheduled"] },
    createdAt: { $gte: startOfDayIST },
    assetUrl: { $ne: "" },
  }).sort({ scheduledFor: 1 });

  // If overdue and today's drafts exist, publish them immediately
  if (isOverdue && todaysDrafts.length > 0) {
    for (const draft of todaysDrafts) {
      try {
        console.log(`[Daily Scheduler] Publishing today's overdue draft ${draft._id} (${draft.topic})...`);
        await publishContent(draft);
      } catch (err) {
        console.error(`[Daily Scheduler] Failed to publish overdue draft ${draft._id}:`, err.message);
      }
    }

    const recheckPublished = await InstagramContent.countDocuments({
      createdBy: "agent",
      status: "published",
      publishedAt: { $gte: startOfDayIST, $lte: endOfDayIST },
    });
    if (recheckPublished >= postsPerDay) return;
  }

  const remainingToCreate = Math.max(0, postsPerDay - publishedToday - todaysDrafts.length);
  if (remainingToCreate <= 0) return;

  // If agent persona is Virat Kohli inspiration, use Google Search & Song Engine
  if (config.agentPersona === "virat_kohli_inspiration" || config.searchTopic?.toLowerCase().includes("virat")) {
    const searchTopic = config.searchTopic || "Virat Kohli quotes wallpapers";
    const activeSongs = (config.listedSongs || []).filter((s) => s.active !== false && s.audioUrl);

    for (let index = 0; index < remainingToCreate; index += 1) {
      // 1. Fetch 100% Guaranteed Unique Quote Wallpaper (checks lifetime database history)
      const chosenItem = await getUniqueViratKohliQuoteImage(searchTopic);

      // 2. Select next song in exact round-robin loop
      const chosenSong = await getNextLoopedSong(activeSongs);

      const draft = await createViratKohliDraft({
        imageUrl: chosenItem.imageUrl,
        quote: chosenItem.quote,
        topic: chosenItem.topic || "King Kohli Motivation",
        song: chosenSong,
        status: isOverdue ? "ready" : "scheduled",
      });

      if (draft) {
        draft.scheduledFor = isOverdue ? new Date() : scheduledTime;
        await draft.save();

        if (isOverdue) {
          try {
            console.log(`[Daily Scheduler] Overdue post detected. Publishing 9:16 Reel immediately...`);
            await publishContent(draft);
            await logInstagramActivity(
              "daily_reel_published",
              `Immediately published overdue daily Virat Kohli 9:16 Video Reel with looped song "${chosenSong.title}".`
            );
          } catch (pubErr) {
            console.error(`[Daily Scheduler] Immediate publishing error:`, pubErr.message);
          }
        }
      }
    }

    if (!isOverdue) {
      await logInstagramActivity(
        "daily_drafts_created",
        `Created ${remainingToCreate} unique daily Virat Kohli 9:16 Video Reel(s) with looped song, scheduled for ${config.dailyPostTime || "12:00"} IST.`
      );
    }
    return;
  }

  const types = config.contentMode === "both" ? ["post", "reel"] : [config.contentMode || "post"];

  for (let index = 0; index < remainingToCreate; index += 1) {
    const draft = await generateContentDraft({ type: types[index % types.length] });
    if (draft) {
      draft.scheduledFor = isOverdue ? new Date() : scheduledTime;
      draft.status = isOverdue ? "ready" : "scheduled";
      await draft.save();

      if (isOverdue) {
        try {
          await publishContent(draft);
        } catch (pubErr) {
          console.error(`[Daily Scheduler] Immediate publishing error:`, pubErr.message);
        }
      }
    }
  }

  if (!isOverdue) {
    await logInstagramActivity(
      "daily_drafts_created",
      `Created ${remainingToCreate} unique daily draft(s), scheduled for ${config.dailyPostTime || "12:00"} IST.`
    );
  }
}

// Schedules are server-side only. Stopping the agent makes jobs no-ops.
export function startInstagramAgentScheduler() {
  if (scheduled) return;
  scheduled = true;

  const tz = process.env.INSTAGRAM_TIMEZONE || "Asia/Kolkata";

  // Startup checks: immediately check for missing daily post & publish due content
  setTimeout(() => {
    createDailyDrafts().catch((err) => console.error("[Startup Draft Check Error]:", err.message));
    publishDueContent().catch((err) => console.error("[Startup Publish Error]:", err.message));
  }, 5000);

  // 1. Continuous 1-minute monitor: guarantees that at scheduled IST post time (or upon server start/restart),
  // missing or overdue content is created and published within 60 seconds
  cron.schedule("* * * * *", () => {
    createDailyDrafts().catch((err) => console.error("[1-Min Draft Scheduler Error]:", err.message));
    publishDueContent().catch((err) => console.error("[1-Min Publish Scheduler Error]:", err.message));
  });

  // 2. Daily morning content generation at 06:00 AM IST
  cron.schedule("0 6 * * *", () => createDailyDrafts().catch((err) => console.error("[Morning Draft Scheduler Error]:", err.message)), { timezone: tz });

  // 3. Nightly audience analytics & growth optimization at 23:00 IST
  cron.schedule("0 23 * * *", () => analyzeAudiencePreferences().catch((err) => console.error("[Audience Analytics Error]:", err.message)), { timezone: tz });
}
