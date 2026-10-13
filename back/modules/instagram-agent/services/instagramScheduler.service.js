import cron from "node-cron";
import { randomUUID } from "node:crypto";
import InstagramContent from "../schema/InstagramContent.model.js";
import InstagramAgentConfig from "../schema/InstagramAgentConfig.model.js";
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
  createAthleteDraft,
  getNextLoopedSong,
  getUniqueViratKohliQuoteImage,
  getUniqueRonaldoQuoteImage,
} from "./viratKohliSearch.service.js";

let scheduled = false;
let isCreatingDrafts = false;
const DAILY_GENERATION_RETRY_DELAY_MS = 30 * 60 * 1000;

async function getNextAthleteForDailyPost() {
  const lastPost = await InstagramContent.findOne({
    createdBy: 'agent',
    status: 'published',
    speaker: { $in: ['Virat Kohli', 'Cristiano Ronaldo'] },
  }).sort({ publishedAt: -1, createdAt: -1 }).select({ speaker: 1 }).lean();
  return lastPost?.speaker === 'Virat Kohli' ? 'Cristiano Ronaldo' : 'Virat Kohli';
}

// IST offset is UTC+5:30 (+330 minutes = 19,800,000 ms)
export const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

export function getISTDate(date = new Date()) {
  return new Date(date.getTime() + IST_OFFSET_MS);
}

function getISTDayKey(date = new Date()) {
  const istDate = getISTDate(date);
  return `${istDate.getUTCFullYear()}-${String(istDate.getUTCMonth() + 1).padStart(2, '0')}-${String(istDate.getUTCDate()).padStart(2, '0')}`;
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
  if (isCreatingDrafts) return;
  isCreatingDrafts = true;
  let generationLeaseToken = "";
  let activeConfig = null;

  try {
    let config = await getInstagramConfig();
    activeConfig = config;
    if (!config.running) return;

    // A Mongo lease coordinates multiple deployed Node instances. A process-local
    // boolean alone cannot prevent two instances from scraping/rendering the same day.
    generationLeaseToken = randomUUID();
    config = await InstagramAgentConfig.findOneAndUpdate(
      {
        key: "default",
        $or: [
          { dailyGenerationLeaseUntil: null },
          { dailyGenerationLeaseUntil: { $lte: new Date() } },
        ],
      },
      {
        $set: {
          dailyGenerationLeaseToken: generationLeaseToken,
          dailyGenerationLeaseUntil: new Date(Date.now() + 12 * 60 * 1000),
        },
      },
      { new: true }
    );
    if (!config) {
      generationLeaseToken = "";
      return;
    }
    activeConfig = config;

    const todayKey = getISTDayKey();
    if (config.dailyGenerationDay === todayKey) {
      if (config.dailyGenerationRetryAt && config.dailyGenerationRetryAt.getTime() > Date.now()) return;
    }

    const { startOfDayIST, endOfDayIST } = getISTDayBounds();

    // 1. Purge / cancel any stale pending drafts created before today's IST day start
    await InstagramContent.updateMany(
      {
        createdBy: "agent",
        status: { $in: ["ready", "scheduled"] },
        createdAt: { $lt: startOfDayIST },
      },
      { $set: { status: "failed", error: "Stale draft from previous day cancelled." } }
    ).catch(() => {});

    // 2. Fast check: Count already published posts for today in IST
    const publishedToday = await InstagramContent.countDocuments({
      createdBy: "agent",
      status: "published",
      publishedAt: { $gte: startOfDayIST, $lte: endOfDayIST },
    });

    const athletePersona = config.agentPersona === "virat_kohli_inspiration"
      || config.searchTopic?.toLowerCase().includes("virat")
      || config.searchTopic?.toLowerCase().includes("ronaldo");
    const postsPerDay = athletePersona ? 1 : (config.postsPerDay || 1);
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

    // Persist a cooldown before network searches and FFmpeg work. Failed upstream calls
    // can retry later, but cannot launch a new render on every two-minute scheduler tick.
    config.dailyGenerationAttempts = config.dailyGenerationDay === todayKey
      ? (config.dailyGenerationAttempts || 0) + 1
      : 1;
    config.dailyGenerationDay = todayKey;
    config.dailyGenerationRetryAt = new Date(Date.now() + DAILY_GENERATION_RETRY_DELAY_MS);
    await config.save();

    // Athlete posts alternate only after a successful publish; a failed run retries
    // the same athlete and cannot skip the other athlete's day.
    if (athletePersona) {
      const player = await getNextAthleteForDailyPost();
      const searchTopic = player === 'Cristiano Ronaldo'
        ? 'Cristiano Ronaldo football motivation images'
        : (config.searchTopic || 'Virat Kohli cricket motivation images');
      const activeSongs = (config.listedSongs || []).filter((s) => s.active !== false && s.audioUrl);
      let publishFailed = false;

      for (let index = 0; index < remainingToCreate; index += 1) {
        // Search fresh image pages and generate a never-repeated motivational line.
        const chosenItem = player === 'Cristiano Ronaldo'
          ? await getUniqueRonaldoQuoteImage(searchTopic, config.dailyGenerationAttempts || 0)
          : await getUniqueViratKohliQuoteImage(searchTopic, config.dailyGenerationAttempts || 0);

        // 2. Select next song in exact round-robin loop
        const chosenSong = await getNextLoopedSong(activeSongs);

        const draft = await createAthleteDraft({
          player,
          imageUrl: chosenItem.imageUrl,
          quote: chosenItem.quote,
          topic: chosenItem.topic || "King Kohli Motivation",
          song: chosenSong,
          status: isOverdue ? "ready" : "scheduled",
          scheduledFor: isOverdue ? new Date() : scheduledTime,
        });

        if (draft) {
          if (isOverdue) {
            try {
              console.log(`[Daily Scheduler] Overdue post detected. Publishing 9:16 Reel immediately...`);
              await publishContent(draft);
              await logInstagramActivity(
                "daily_reel_published",
                `Immediately published overdue daily ${player} 9:16 Video Reel with looped song "${chosenSong.title}".`
              );
            } catch (pubErr) {
              publishFailed = true;
              console.error(`[Daily Scheduler] Immediate publishing error:`, pubErr.message);
            }
          }
        }
      }

      if (!isOverdue) {
        await logInstagramActivity(
          "daily_drafts_created",
          `Created ${remainingToCreate} unique daily ${player} 9:16 Video Reel(s) with looped song, scheduled for ${config.dailyPostTime || "12:00"} IST.`
        );
      }
      if (!publishFailed) {
        config.dailyGenerationRetryAt = null;
        config.lastError = "";
        await config.save();
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
    config.dailyGenerationRetryAt = null;
    config.lastError = "";
    await config.save();
  } catch (err) {
    console.error("[Daily Drafts Scheduler Error]:", err.message);
    if (activeConfig) {
      activeConfig.lastError = String(err.message || "Daily reel generation failed.").slice(0, 1000);
      await activeConfig.save().catch(() => {});
    }
  } finally {
    if (generationLeaseToken) {
      await InstagramAgentConfig.updateOne(
        { key: "default", dailyGenerationLeaseToken: generationLeaseToken },
        { $set: { dailyGenerationLeaseToken: "", dailyGenerationLeaseUntil: null } }
      ).catch(() => {});
    }
    isCreatingDrafts = false;
  }
}

// Schedules are server-side only. Stopping the agent makes jobs no-ops.
export function startInstagramAgentScheduler() {
  if (scheduled) return;
  scheduled = true;

  const tz = process.env.INSTAGRAM_TIMEZONE || "Asia/Kolkata";

  // Startup check delayed by 15s so server boots up and accepts incoming requests immediately
  setTimeout(() => {
    createDailyDrafts().catch((err) => console.error("[Startup Draft Check Error]:", err.message));
    publishDueContent().catch((err) => console.error("[Startup Publish Error]:", err.message));
  }, 15000);

  // Check queued posts every minute so a fixed daily schedule is not delayed by
  // the old two-minute polling interval. Publishing itself is DB-claimed atomically.
  cron.schedule("*/2 * * * *", () => {
    createDailyDrafts().catch((err) => console.error("[2-Min Draft Scheduler Error]:", err.message));
  });

  cron.schedule("* * * * *", () => {
    publishDueContent().catch((err) => console.error("[Minute Publish Scheduler Error]:", err.message));
  });

  // 2. Daily morning content generation at 06:00 AM IST
  cron.schedule("0 6 * * *", () => createDailyDrafts().catch((err) => console.error("[Morning Draft Scheduler Error]:", err.message)), { timezone: tz });

  // 3. Nightly audience analytics & growth optimization at 23:00 IST
  cron.schedule("0 23 * * *", () => analyzeAudiencePreferences().catch((err) => console.error("[Audience Analytics Error]:", err.message)), { timezone: tz });
}
