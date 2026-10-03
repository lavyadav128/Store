import express from "express";
import auth from "../../auth/authh.js";
import requireAdmin from "../../../shared/middleware/requireAdmin.js";
import InstagramContent from "../schema/InstagramContent.model.js";
import InstagramBrandRequest from "../schema/InstagramBrandRequest.model.js";
import InstagramActivity from "../schema/InstagramActivity.model.js";
import {
  accountConfigured,
  attachMusicToContent,
  createAdminUploadedReel,
  exchangeLongLivedToken,
  generateContentDraft,
  getAccountSnapshot,
  getAvailableMusicTracks,
  getInstagramConfig,
  logInstagramActivity,
  publishContent,
  replyToInstagramComment,
  safeCommunityReply,
  sendInstagramMessage,
  verifyMetaSignature,
} from "../services/instagramAgent.service.js";
import fs from "fs";
import os from "os";
import path from "path";
import multer from "multer";
import { upload, cloudinary } from "../../../config/cloudinary.js";
import { NATURE_THEMES } from "../services/natureThemes.js";
import { analyzeAudiencePreferences, getChannelGrowthAnalysis } from "../services/growthOptimizer.js";
import {
  searchGoogleKohliImages,
  createViratKohliDraft,
  autoRunViratKohliAgent,
  getNextLoopedSong,
  VIRAT_KOHLI_QUOTES,
} from "../services/viratKohliSearch.service.js";
import {
  createDailyDrafts,
  getISTDayBounds,
  getISTScheduledDate,
} from "../services/instagramScheduler.service.js";
import { publishDueContent } from "../services/instagramAgent.service.js";
import { DEFAULT_SONGS } from "../schema/InstagramAgentConfig.model.js";

// Dedicated disk storage for video reels (avoids RAM limits on free tier servers)
const videoDiskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, os.tmpdir()),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || ".mp4") || ".mp4";
    cb(null, `admin_reel_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`);
  },
});

const videoUpload = multer({
  storage: videoDiskStorage,
  limits: { fileSize: 150 * 1024 * 1024 }, // 150MB
});

// Dedicated disk storage for audio song uploads (.mp3, .wav, .m4a, .aac, .ogg)
const audioDiskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, os.tmpdir()),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || ".mp3") || ".mp3";
    cb(null, `user_song_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`);
  },
});

const audioUpload = multer({
  storage: audioDiskStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("audio/") || /\.(mp3|wav|m4a|aac|ogg|flac|wma)$/i.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files (.mp3, .wav, .m4a, .aac, .ogg, .flac) are allowed!"), false);
    }
  },
});

const router = express.Router();
export const instagramWebhookRouter = express.Router();

// Meta subscription handshake. Keep public; it validates a secret verification token.
instagramWebhookRouter.get("/webhook", (req, res) => {
  if (
    req.query["hub.mode"] === "subscribe" &&
    req.query["hub.verify_token"] === process.env.META_WEBHOOK_VERIFY_TOKEN
  )
    return res.status(200).send(req.query["hub.challenge"]);
  return res.sendStatus(403);
});

// Meta sends raw JSON so the signature can be verified before processing.
instagramWebhookRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    if (!verifyMetaSignature(req, req.headers["x-hub-signature-256"])) return res.sendStatus(403);
    const payload = JSON.parse(req.body.toString("utf8"));
    const config = await getInstagramConfig();
    const isPromotion = (message) =>
      /\b(sponsor|promotion|promote|collab|collaboration|brand deal|paid partnership)\b/i.test(message || "");
    const recordPromotion = async ({ senderId, senderName = "", message, source }) => {
      if (!isPromotion(message)) return false;
      await InstagramBrandRequest.create({
        senderId: String(senderId || "unknown"),
        senderName,
        message,
        source,
      });
      await logInstagramActivity("brand_request_received", "A possible brand/promotion request needs admin approval.");
      return true;
    };
    for (const entry of payload.entry || []) {
      for (const event of entry.messaging || []) {
        const message = event.message?.text || "";
        const promotion = await recordPromotion({
          senderId: event.sender?.id,
          message,
          source: "instagram_dm",
        });
        if (config.running && config.autoReplyMessages && message && !promotion) {
          try {
            await sendInstagramMessage(event.sender?.id, safeCommunityReply(config));
            await logInstagramActivity("dm_replied", "Agent sent an approved safe acknowledgement.", {
              senderId: String(event.sender?.id || ""),
            });
          } catch (error) {
            await logInstagramActivity("dm_reply_failed", error.message);
          }
        }
      }
      for (const change of entry.changes || []) {
        const message = change.value?.message?.text || change.value?.text || "";
        const promotion = await recordPromotion({
          senderId: change.value?.from?.id || entry.id,
          senderName: change.value?.from?.username || "",
          message,
          source: "instagram_comment",
        });
        const commentId = change.value?.id || change.value?.comment_id;
        if (config.running && config.autoReplyComments && message && commentId && !promotion) {
          try {
            await replyToInstagramComment(commentId, safeCommunityReply(config));
            await logInstagramActivity("comment_replied", "Agent replied to a non-promotional comment.", {
              commentId: String(commentId),
            });
          } catch (error) {
            await logInstagramActivity("comment_reply_failed", error.message);
          }
        }
      }
    }
    return res.sendStatus(200);
  }
);

// Cloudinary Direct Signed Upload Token (Eliminates Render server timeouts for direct video uploads)
router.get("/cloudinary/signature", async (_req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "instagram-agent/admin-reels";
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET
    );
    return res.json({
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
      timestamp,
      signature,
    });
  } catch (err) {
    console.error("[Cloudinary Signature Error]:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Public Search & Read-Only Listed Songs (Accessible immediately by dashboard)
router.post("/search-google-quotes", async (req, res) => {
  try {
    const { query = "Virat Kohli quotes wallpapers", limit = 16 } = req.body;
    const results = await searchGoogleKohliImages(query, Number(limit) || 16);
    res.json({ success: true, count: results.length, results, defaultQuotes: VIRAT_KOHLI_QUOTES });
  } catch (error) {
    console.error("[Search Google Quotes Error]:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/listed-songs", async (_req, res) => {
  try {
    const config = await getInstagramConfig();
    res.json({ success: true, songs: config.listedSongs || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Direct Audio File Upload from PC / Mobile (.mp3, .wav, .m4a, .aac, .ogg)
router.post("/upload-song", audioUpload.single("audioFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please select an audio file from your device (.mp3, .wav, .m4a, .aac, .ogg)." });
    }

    const originalName = req.file.originalname || "custom_song.mp3";
    const derivedTitle = req.body.title?.trim() || originalName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").trim();
    const artist = (req.body.artist?.trim() || "My Uploaded Track");
    const genre = (req.body.genre?.trim() || "Custom Audio");

    // Upload audio file to Cloudinary under video/audio resource type
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "instagram-agent/user-songs",
    });

    // Clean up temporary local file
    if (fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (_) {}
    }

    const config = await getInstagramConfig();
    config.listedSongs.push({
      title: derivedTitle,
      artist: artist,
      genre: genre,
      audioUrl: uploadResult.secure_url,
      active: true,
    });
    await config.save();

    await logInstagramActivity(
      'song_uploaded',
      `Uploaded custom audio track: "${derivedTitle}" (${artist})`,
      {
        title: derivedTitle,
        artist: artist,
        audioUrl: uploadResult.secure_url,
      }
    );

    res.json({
      success: true,
      songs: config.listedSongs,
      song: config.listedSongs[config.listedSongs.length - 1],
      message: `"${derivedTitle}" uploaded successfully from your device! 🎵`,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (_) {}
    }
    console.error("[Song Upload Error]:", error);
    res.status(400).json({ error: error.message || "Failed to upload audio file." });
  }
});

// Add a song manually with metadata/URL
router.post("/listed-songs", async (req, res) => {
  try {
    const { title, artist, genre, audioUrl } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Song title is required." });
    }

    const config = await getInstagramConfig();
    config.listedSongs.push({
      title: title.trim(),
      artist: (artist || "Trending Artist").trim(),
      genre: genre || "Motivational / Hype",
      audioUrl: audioUrl || "",
      active: true,
    });
    await config.save();
    res.json({ success: true, songs: config.listedSongs, message: `Added "${title}" to listed songs!` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Clear ALL listed songs from database
router.delete("/listed-songs/all/clear", async (_req, res) => {
  try {
    const config = await getInstagramConfig();
    config.listedSongs = [];
    await config.save();
    await logInstagramActivity('songs_cleared', 'User cleared all listed songs.');
    res.json({ success: true, songs: [], message: "All songs cleared from list!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a single song from listed songs
router.delete("/listed-songs/:id", async (req, res) => {
  try {
    const config = await getInstagramConfig();
    config.listedSongs = config.listedSongs.filter((s) => String(s._id) !== String(req.params.id));
    await config.save();
    res.json({ success: true, songs: config.listedSongs, message: "Song removed from list." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Toggle a song's active state
router.patch("/listed-songs/:id/toggle", async (req, res) => {
  try {
    const config = await getInstagramConfig();
    const song = config.listedSongs.id(req.params.id);
    if (!song) return res.status(404).json({ error: "Song not found." });
    song.active = !song.active;
    await config.save();
    res.json({ success: true, song, songs: config.listedSongs });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create Post from selected Google image + Listed Song
router.post("/create-virat-kohli-post", async (req, res) => {
  try {
    const { imageUrl, quote, topic, song, customCaption, customHashtags, publishImmediately = false } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required." });
    }

    const draft = await createViratKohliDraft({
      imageUrl,
      quote,
      topic,
      song,
      customCaption,
      customHashtags,
      status: "ready",
    });

    if (publishImmediately) {
      const published = await publishContent(draft);
      return res.json({ success: true, content: published, message: "Published to Instagram successfully! 👑🚀" });
    }

    res.json({ success: true, content: draft, message: "Draft created successfully!" });
  } catch (error) {
    console.error("[Create Virat Kohli Post Error]:", error);
    res.status(400).json({ error: error.message });
  }
});

// Autonomous 1-Click Agent Execution
router.post("/auto-run-virat-kohli", async (req, res) => {
  try {
    const result = await autoRunViratKohliAgent();
    res.json(result);
  } catch (error) {
    console.error("[Auto-Run Virat Kohli Agent Error]:", error);
    res.status(500).json({ error: error.message });
  }
});

// Autonomous Status Summary: live running state, loop index, scheduled times
router.get("/status-summary", async (_req, res) => {
  try {
    const config = await getInstagramConfig();
    const activeSongs = (config.listedSongs || []).filter((s) => s.active !== false);
    const pastCount = await InstagramContent.countDocuments({ createdBy: "agent" });
    const currentSongIndex = activeSongs.length > 0 ? (pastCount % activeSongs.length) : 0;
    const nextSongIndex = activeSongs.length > 0 ? ((pastCount + 1) % activeSongs.length) : 0;

    const { startOfDayIST, endOfDayIST } = getISTDayBounds();

    const publishedToday = await InstagramContent.countDocuments({
      createdBy: "agent",
      status: "published",
      publishedAt: { $gte: startOfDayIST, $lte: endOfDayIST },
    });

    const scheduledNext = await InstagramContent.findOne({
      createdBy: "agent",
      status: { $in: ["ready", "scheduled"] },
    }).sort({ scheduledFor: 1 }).lean();

    res.json({
      success: true,
      running: Boolean(config.running),
      dailyPostTime: config.dailyPostTime || "12:00",
      postsPerDay: config.postsPerDay || 1,
      totalSongs: activeSongs.length,
      currentSong: activeSongs[currentSongIndex] || null,
      nextSong: activeSongs[nextSongIndex] || null,
      publishedToday,
      scheduledNext,
      lastStartedAt: config.lastStartedAt,
      lastStoppedAt: config.lastStoppedAt,
      agentPersona: config.agentPersona || "virat_kohli_inspiration",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Autonomous Agent
router.post("/start", async (_req, res) => {
  try {
    const config = await getInstagramConfig();
    if (!config.niche) {
      config.niche = "Virat Kohli Motivation & Cricket Inspiration";
    }
    if (!accountConfigured()) {
      return res.status(400).json({
        error: "Connect the Instagram professional account through environment credentials before starting.",
      });
    }
    config.running = true;
    config.lastStartedAt = new Date();
    config.lastError = "";
    await config.save();

    // Trigger daily content generation & overdue publishing immediately upon start
    createDailyDrafts().catch((err) => console.error("[Agent Start Draft Error]:", err.message));
    publishDueContent().catch((err) => console.error("[Agent Start Publish Error]:", err.message));

    await logInstagramActivity("agent_started", "Instagram Autonomous Growth Agent started by admin. Daily automated posting is now ACTIVE.");
    res.json({ success: true, running: true, config, message: "Autonomous Agent started! Daily automatic posting is now ACTIVE. 👑🚀" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stop Autonomous Agent
router.post("/stop", async (_req, res) => {
  try {
    const config = await getInstagramConfig();
    config.running = false;
    config.lastStoppedAt = new Date();
    await config.save();
    await logInstagramActivity(
      "agent_stopped",
      "Instagram Autonomous Growth Agent stopped by admin. Automated daily publishing paused."
    );
    res.json({ success: true, running: false, config, message: "Autonomous Agent stopped. Automated daily posting is paused." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Agent Config (post time, frequency, persona)
router.put("/config", async (req, res) => {
  try {
    const config = await getInstagramConfig();
    const updates = req.body || {};
    if (updates.dailyPostTime) config.dailyPostTime = updates.dailyPostTime;
    if (updates.postsPerDay) config.postsPerDay = updates.postsPerDay;
    if (updates.agentPersona) config.agentPersona = updates.agentPersona;
    if (updates.searchTopic) config.searchTopic = updates.searchTopic;
    if (updates.running !== undefined) config.running = Boolean(updates.running);
    await config.save();
    await logInstagramActivity("config_updated", "Instagram agent configuration updated.");
    res.json({ success: true, config });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.use(auth, requireAdmin);

router.get("/overview", async (_req, res) => {
  try {
    const [config, content, promotions, activities] = await Promise.all([
      getInstagramConfig(),
      InstagramContent.find().sort({ createdAt: -1 }).limit(30),
      InstagramBrandRequest.find().sort({ createdAt: -1 }).limit(20),
      InstagramActivity.find().sort({ createdAt: -1 }).limit(30),
    ]);

    let account;
    let accountError = "";

    try {
      account = await getAccountSnapshot();
    } catch (error) {
      accountError = error.message;
      account = {
        connected: false,
        followers: null,
        username: "",
        mediaCount: null,
        reach: null,
        engagement: null,
        autoDetectedId: null,
      };

      await logInstagramActivity("meta_connection_error", `Meta check: ${error.message}`).catch(() => {});
    }

    return res.json({
      config,
      account,
      accountError,
      content,
      promotions,
      activities,
      apiConfigured: accountConfigured(),
    });
  } catch (error) {
    console.error("Instagram overview error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Real-Time Live Followers Endpoint (fast polling)
router.get("/live-followers", async (_req, res) => {
  try {
    const account = await getAccountSnapshot();
    return res.json({
      followers: account.followers,
      mediaCount: account.mediaCount,
      username: account.username,
      reach: account.reach,
      engagement: account.engagement,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(200).json({
      followers: null,
      error: err.message,
      updatedAt: new Date().toISOString(),
    });
  }
});

// Comprehensive Channel Growth & Health Analyzer
router.get("/growth-intel", async (_req, res) => {
  try {
    let account = null;
    try {
      account = await getAccountSnapshot();
    } catch (_) {}
    const analysis = await getChannelGrowthAnalysis(account);
    return res.json(analysis);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/analytics/growth", async (_req, res) => {
  try {
    let account = null;
    try {
      account = await getAccountSnapshot();
    } catch (_) {}
    const analysis = await getChannelGrowthAnalysis(account);
    return res.json(analysis);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// List all Nature Themes & Prompt Templates
router.get("/nature-themes", (_req, res) => {
  res.json(NATURE_THEMES);
});

router.get("/themes", (_req, res) => {
  res.json(NATURE_THEMES);
});

// Upload Direct Video Reel or Image Asset
router.post("/content/:id/upload-asset", upload.single("file"), async (req, res) => {
  try {
    const content = await InstagramContent.findById(req.params.id);
    if (!content) return res.status(404).json({ error: "Content not found" });
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const isVideo = req.file.mimetype.startsWith("video/");
    const resourceType = isVideo ? "video" : "image";

    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "instagram-agent",
            resource_type: resourceType,
            quality: "auto:best",
          },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(req.file.buffer);
      });

    const result = await uploadStream();
    content.assetUrl = result.secure_url;
    content.assetSource = "admin";
    content.mediaGenerationStatus = "ready";
    content.status = "ready";
    if (isVideo) content.type = "reel";
    await content.save();

    await logInstagramActivity(
      "asset_uploaded",
      `Attached ${resourceType} to ${content.type}: ${content.topic}`,
      { contentId: String(content._id), url: content.assetUrl }
    );

    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Audience Engagement Insights & Growth Optimization
router.get("/audience-growth", async (_req, res) => {
  try {
    const analysis = await analyzeAudiencePreferences();
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List Available Music Tracks
router.get("/audio/tracks", (_req, res) => {
  res.json(getAvailableMusicTracks());
});

// Attach Selected Audio Track to Content
router.post("/content/:id/attach-audio", async (req, res) => {
  try {
    const content = await InstagramContent.findById(req.params.id);
    if (!content) return res.status(404).json({ error: "Content not found" });

    const updated = await attachMusicToContent(content, req.body.trackId);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Exchange Short-Lived Token for 60-Day Long-Lived Token
router.post("/exchange-token", async (_req, res) => {
  try {
    const result = await exchangeLongLivedToken();
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/token/exchange-long-lived", async (_req, res) => {
  try {
    const result = await exchangeLongLivedToken();
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/config", async (req, res) => {
  const allowed = [
    "niche",
    "targetAudience",
    "brandVoice",
    "contentMode",
    "postsPerDay",
    "dailyPostTime",
    "topAudienceCategory",
    "autoReplyComments",
    "autoReplyMessages",
  ];
  const updates = Object.fromEntries(
    allowed.filter((key) => req.body[key] !== undefined).map((key) => [key, req.body[key]])
  );
  if (updates.postsPerDay !== undefined)
    updates.postsPerDay = Math.min(Math.max(Number(updates.postsPerDay) || 1, 1), 3);
  const config = await getInstagramConfig();
  Object.assign(config, updates);
  await config.save();
  await logInstagramActivity("config_updated", "Instagram agent configuration updated.");
  res.json(config);
});

router.post("/content/generate", async (req, res) => {
  try {
    res.status(201).json(await generateContentDraft({ topic: req.body.topic, type: req.body.type, category: req.body.category }));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin Direct Video Upload for a Single 12-Series Instagram Reel
router.post("/content/upload-reel", videoUpload.single("video"), async (req, res) => {
  try {
    const filePath = req.file?.path;
    const fileBuffer = req.file?.buffer;
    const fileUrl = req.body.videoUrl || req.body.assetUrl;
    const category = req.body.category || "🌅 Nature's Morning";
    const topic = req.body.topic || "";
    const customCaption = req.body.caption || "";
    const aspectRatio = req.body.aspectRatio || "9:16";

    let customHashtags = [];
    if (req.body.hashtags) {
      if (Array.isArray(req.body.hashtags)) {
        customHashtags = req.body.hashtags;
      } else if (typeof req.body.hashtags === "string") {
        try {
          customHashtags = JSON.parse(req.body.hashtags);
        } catch (_) {
          customHashtags = req.body.hashtags
            .split(/[\s,]+/)
            .filter(Boolean)
            .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));
        }
      }
    }

    if (!filePath && !fileBuffer && !fileUrl) {
      return res.status(400).json({ error: "Please provide a video file or a video URL." });
    }

    const reelDraft = await createAdminUploadedReel({
      filePath,
      fileBuffer,
      fileUrl,
      category,
      topic,
      customCaption,
      customHashtags,
      aspectRatio,
    });

    res.status(201).json(reelDraft);
  } catch (error) {
    console.error("[Admin Upload Reel Route Error]:", error);
    res.status(400).json({ error: error.message });
  }
});

// Admin 1-Click Direct Upload & Instant Instagram Reel Publisher
router.post("/content/publish-direct", videoUpload.single("video"), async (req, res) => {
  try {
    const filePath = req.file?.path;
    const fileBuffer = req.file?.buffer;
    const fileUrl = req.body.videoUrl || req.body.assetUrl;
    const category = req.body.category || "🌅 Nature's Morning";
    const topic = req.body.topic || "";
    const customCaption = req.body.caption || "";
    const aspectRatio = req.body.aspectRatio || "9:16";

    let customHashtags = [];
    if (req.body.hashtags) {
      if (Array.isArray(req.body.hashtags)) {
        customHashtags = req.body.hashtags;
      } else if (typeof req.body.hashtags === "string") {
        try {
          customHashtags = JSON.parse(req.body.hashtags);
        } catch (_) {
          customHashtags = req.body.hashtags
            .split(/[\s,]+/)
            .filter(Boolean)
            .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));
        }
      }
    }

    if (!filePath && !fileBuffer && !fileUrl) {
      return res.status(400).json({ error: "Please provide a video file or a video URL." });
    }

    // 1. Create content draft record with asset URL
    const reelDraft = await createAdminUploadedReel({
      filePath,
      fileBuffer,
      fileUrl,
      category,
      topic,
      customCaption,
      customHashtags,
      aspectRatio,
    });

    // 2. Immediately publish to Instagram Reels & clean up Cloudinary storage
    const published = await publishContent(reelDraft);
    res.status(200).json(published);
  } catch (error) {
    console.error("[Admin Direct Publish Route Error]:", error);
    res.status(400).json({ error: error.message });
  }
});

router.patch("/content/:id", async (req, res) => {
  const allowed = [
    "topic",
    "caption",
    "hashtags",
    "creativeBrief",
    "reelScript",
    "assetUrl",
    "scheduledFor",
    "status",
  ];
  const updates = Object.fromEntries(
    allowed.filter((key) => req.body[key] !== undefined).map((key) => [key, req.body[key]])
  );
  if (updates.status && !["draft", "ready", "scheduled"].includes(updates.status))
    return res.status(400).json({ error: "Only draft, ready, or scheduled can be set manually." });
  const content = await InstagramContent.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  );
  if (!content) return res.status(404).json({ error: "Content not found" });
  res.json(content);
});

// Delete a Post or Reel
router.delete("/content/:id", async (req, res) => {
  try {
    const deleted = await InstagramContent.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Content not found" });
    await logInstagramActivity("content_deleted", `Deleted ${deleted.type}: ${deleted.topic}`);
    res.json({ success: true, message: "Content deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/content/:id/publish", async (req, res) => {
  try {
    const content = await InstagramContent.findById(req.params.id);
    if (!content) return res.status(404).json({ error: "Content not found" });
    res.json(await publishContent(content));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/promotions/:id/review", async (req, res) => {
  const status = req.body.status;
  if (!["approved", "declined"].includes(status))
    return res.status(400).json({ error: "Status must be approved or declined." });
  const item = await InstagramBrandRequest.findByIdAndUpdate(
    req.params.id,
    { $set: { status, adminNotes: String(req.body.adminNotes || "").slice(0, 2000) } },
    { new: true }
  );
  if (!item) return res.status(404).json({ error: "Promotion request not found" });
  await logInstagramActivity("promotion_reviewed", `Promotion request ${status} by admin.`, {
    requestId: String(item._id),
  });
  res.json(item);
});

router.patch("/promotions/:id", async (req, res) => {
  const status = req.body.status;
  if (!["approved", "declined"].includes(status))
    return res.status(400).json({ error: "Status must be approved or declined." });
  const item = await InstagramBrandRequest.findByIdAndUpdate(
    req.params.id,
    { $set: { status, adminNote: String(req.body.adminNote || "").slice(0, 2000) } },
    { new: true }
  );
  if (!item) return res.status(404).json({ error: "Promotion request not found" });
  await logInstagramActivity("promotion_reviewed", `Promotion request ${status} by admin.`, {
    requestId: String(item._id),
  });
  res.json(item);
});

export default router;
