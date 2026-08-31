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
  generateMediaForContent,
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
import os from "os";
import path from "path";
import multer from "multer";
import { upload, cloudinary } from "../../../config/cloudinary.js";
import { fetchUniquePexelsMedia, getPexelsApiKey } from "../services/pexelsMedia.service.js";
import { fetchMatchingFreesoundAudio, getFreesoundApiKey } from "../services/freesoundAudio.service.js";
import { NATURE_THEMES } from "../services/natureThemes.js";
import { MOTIVATIONAL_THEMES } from "../services/motivationalThemes.js";
import { analyzeAudiencePreferences, getChannelGrowthAnalysis } from "../services/growthOptimizer.js";

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
    if (!verifyMetaSignature(req.body, req.headers["x-hub-signature-256"])) return res.sendStatus(403);
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

// List all 6 Nature Realms Themes & Prompt Templates
router.get("/nature-themes", (_req, res) => {
  res.json(NATURE_THEMES);
});

// List all Master Motivational Mindset Themes
router.get("/themes", (_req, res) => {
  res.json(NATURE_THEMES);
});

// Upload Direct Google Flow Video Reel or 8K Image File
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
    content.assetSource = "google_flow";
    content.mediaGenerationStatus = "ready";
    content.status = "ready";
    if (isVideo) content.type = "reel";
    await content.save();

    await logInstagramActivity(
      "asset_uploaded",
      `Attached Google Flow ${resourceType} to ${content.type}: ${content.topic}`,
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

// List Available Royalty-Free Music Tracks
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
    "geminiApiKey",
    "pexelsApiKey",
    "freesoundApiKey",
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

router.post("/start", async (_req, res) => {
  const config = await getInstagramConfig();
  if (!config.niche) return res.status(400).json({ error: "Set the niche before starting the agent." });
  if (!accountConfigured())
    return res.status(400).json({
      error: "Connect the Instagram professional account through environment credentials before starting.",
    });
  config.running = true;
  config.lastStartedAt = new Date();
  config.lastError = "";
  await config.save();
  const firstType = config.contentMode === "reel" ? "reel" : "post";
  try {
    await generateContentDraft({ topic: `${config.niche} launch plan`, type: firstType });
  } catch (error) {
    config.lastError = `Agent started, but its first draft could not be created: ${error.message}`;
    await config.save();
    await logInstagramActivity("initial_draft_failed", config.lastError);
  }
  await logInstagramActivity("agent_started", "Instagram Growth Agent started by admin.");
  res.json(config);
});

router.post("/stop", async (_req, res) => {
  const config = await getInstagramConfig();
  config.running = false;
  config.lastStoppedAt = new Date();
  await config.save();
  await logInstagramActivity(
    "agent_stopped",
    "Instagram Growth Agent stopped by admin. No scheduled publishing will run."
  );
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

// Admin Bulk Video Upload for Multiple 12-Series Instagram Reels in One Batch
router.post("/content/upload-reels-bulk", videoUpload.array("videos", 30), async (req, res) => {
  try {
    const files = req.files || [];
    if (!files.length) {
      return res.status(400).json({ error: "No video files received in bulk upload." });
    }

    const defaultCategory = req.body.category || "🌅 Nature's Morning";
    const defaultAspectRatio = req.body.aspectRatio || "9:16";
    let metadataList = [];
    if (req.body.metadata) {
      try {
        metadataList = typeof req.body.metadata === "string" ? JSON.parse(req.body.metadata) : req.body.metadata;
      } catch (_) {}
    }

    const createdReels = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const meta = metadataList[i] || {};
      const category = meta.category || defaultCategory;
      const topic = meta.topic || file.originalname.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      const customCaption = meta.caption || "";
      const aspectRatio = meta.aspectRatio || defaultAspectRatio;

      try {
        const reel = await createAdminUploadedReel({
          filePath: file.path,
          fileBuffer: file.buffer,
          category,
          topic,
          customCaption,
          aspectRatio,
        });
        createdReels.push(reel);
      } catch (err) {
        console.error(`[Bulk Upload Error on file ${i + 1} (${file.originalname})]:`, err.message);
        errors.push({ file: file.originalname, error: err.message });
      }
    }

    return res.status(201).json({
      success: true,
      totalReceived: files.length,
      uploadedCount: createdReels.length,
      reels: createdReels,
      errors: errors.length ? errors : undefined,
    });
  } catch (error) {
    console.error("[Admin Bulk Upload Route Error]:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/content/:id/generate-media", async (req, res) => {
  try {
    const content = await InstagramContent.findById(req.params.id);
    if (!content) return res.status(404).json({ error: "Content not found" });
    if (req.body?.type) {
      content.type = (req.body.type === 'image' || req.body.type === 'post') ? 'post' : 'reel';
      await content.save();
    }
    res.json(await generateMediaForContent(content));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Test Pexels API Search
router.post("/pexels/test", async (req, res) => {
  try {
    const result = await fetchUniquePexelsMedia({
      topic: req.body.topic || "mountain sunrise mist",
      realm: req.body.realm || "🌅 Nature's Morning",
      type: req.body.type || "reel",
      orientation: req.body.orientation || "portrait",
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Test Freesound API Search
router.post("/freesound/test", async (req, res) => {
  try {
    const result = await fetchMatchingFreesoundAudio({
      topic: req.body.topic || "mountain sunrise mist",
      realm: req.body.realm || "🌅 Nature's Morning",
      soundscape: req.body.soundscape || "birds morning ambient",
    });
    res.json(result);
  } catch (error) {
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
