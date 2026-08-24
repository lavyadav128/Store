import crypto from "crypto";
import fetch from "node-fetch";
import InstagramAgentConfig from "../schema/InstagramAgentConfig.model.js";
import InstagramContent from "../schema/InstagramContent.model.js";
import InstagramActivity from "../schema/InstagramActivity.model.js";
import { cloudinary } from "../config/cloudinary.js";

const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v21.0";
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;

export async function getInstagramConfig() {
  let config = await InstagramAgentConfig.findOne({ key: "default" });
  if (!config) config = await InstagramAgentConfig.create({ key: "default" });
  return config;
}

export const accountConfigured = () => Boolean(
  process.env.INSTAGRAM_ACCOUNT_ID && process.env.META_ACCESS_TOKEN
);

async function graph(path, options = {}) {
  if (!accountConfigured()) throw new Error("Instagram is not connected. Add INSTAGRAM_ACCOUNT_ID and META_ACCESS_TOKEN to the backend environment.");
  const separator = path.includes("?") ? "&" : "?";
  const response = await fetch(`${GRAPH_BASE}${path}${separator}access_token=${encodeURIComponent(process.env.META_ACCESS_TOKEN)}`, options);
  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error?.message || "Meta Graph API request failed");
  return payload;
}

// Uses Instagram's official Messenger API. It is deliberately limited to a
// neutral acknowledgement; brand deals are always left for an admin to review.
export async function sendInstagramMessage(recipientId, text) {
  if (!recipientId) return null;
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;
  return graph(`/${accountId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipient: { id: recipientId }, message: { text } }),
  });
}

export async function replyToInstagramComment(commentId, text) {
  if (!commentId) return null;
  return graph(`/${commentId}/replies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text }),
  });
}

export function safeCommunityReply(config) {
  const niche = config.niche || "our page";
  return `Thanks for reaching out! We are glad you are interested in ${niche}. Our team will share helpful updates here.`;
}

export async function getAccountSnapshot() {
  if (!accountConfigured()) return { connected: false, followers: null, username: "", reach: null, engagement: null };
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;
  const account = await graph(`/${accountId}?fields=username,followers_count,media_count`);
  let insights = {};
  try {
    insights = await graph(`/${accountId}/insights?metric=reach,accounts_engaged&period=day`);
  } catch (_) { /* Some Meta permission sets do not expose account insights. */ }
  const values = Object.fromEntries((insights.data || []).map((item) => [item.name, item.values?.at(-1)?.value ?? null]));
  return { connected: true, username: account.username || "", followers: account.followers_count ?? null, mediaCount: account.media_count ?? null, reach: values.reach ?? null, engagement: values.accounts_engaged ?? null };
}

export async function logInstagramActivity(type, message, metadata = {}) {
  return InstagramActivity.create({ type, message, metadata });
}

function cleanHashtags(value = "") {
  return [...new Set((value.match(/#[\p{L}\p{N}_]+/gu) || []).slice(0, 20))];
}

function uploadBuffer(buffer, resourceType) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "instagram-agent", resource_type: resourceType },
      (error, result) => error ? reject(error) : resolve(result)
    );
    stream.end(buffer);
  });
}

async function uploadRemoteAsset(url, resourceType) {
  return cloudinary.uploader.upload(url, { folder: "instagram-agent", resource_type: resourceType });
}

function mediaPrompt(content, config) {
  return `Create a high-quality vertical 9:16 social-media visual for ${config.niche}. Audience: ${config.targetAudience || "general audience"}. Topic: ${content.topic}. Creative direction: ${content.creativeBrief}. Brand voice: ${config.brandVoice}. No logos, no text that cannot be read, no misleading claims, no copyrighted characters.`;
}

// Provider keys and endpoints are configured only via environment variables.
// HF_TOKEN supports the free Hugging Face trial first; replacing it with a
// paid provider key/endpoint later does not require a code change.
export async function generateMediaForContent(content) {
  const config = await getInstagramConfig();
  content.mediaGenerationStatus = "generating";
  content.mediaGenerationError = "";
  await content.save();
  try {
    const prompt = mediaPrompt(content, config);
    if (content.type === "post") {
      if (!process.env.HF_TOKEN) throw new Error("HF_TOKEN is required for automatic image generation.");
      const response = await fetch(process.env.AI_IMAGE_API_URL || "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.HF_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: prompt }),
      });
      if (!response.ok) throw new Error(`Image provider: ${await response.text()}`);
      const result = await uploadBuffer(Buffer.from(await response.arrayBuffer()), "image");
      content.assetUrl = result.secure_url;
      content.assetSource = "ai_image";
    } else {
      if (!process.env.AI_VIDEO_API_URL || !process.env.AI_VIDEO_API_KEY) throw new Error("AI_VIDEO_API_URL and AI_VIDEO_API_KEY are required for automatic reel generation.");
      const response = await fetch(process.env.AI_VIDEO_API_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.AI_VIDEO_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model: process.env.AI_VIDEO_MODEL || "default", aspect_ratio: "9:16", duration_seconds: 10 }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error?.message || "Video provider rejected the request.");
      const videoUrl = payload.url || payload.video_url || payload.output?.url || payload.data?.[0]?.url;
      if (!videoUrl) throw new Error("Video provider did not return a completed public video URL. Configure its completion webhook/polling endpoint.");
      const result = await uploadRemoteAsset(videoUrl, "video");
      content.assetUrl = result.secure_url;
      content.assetSource = "ai_video";
    }
    content.mediaGenerationStatus = "ready";
    content.status = "ready";
    // New AI-generated assets are eligible for the scheduled publishing job.
    if (!content.scheduledFor) content.scheduledFor = new Date();
    await content.save();
    await logInstagramActivity("media_generated", `AI generated and uploaded a ${content.type} asset.`, { contentId: String(content._id) });
    return content;
  } catch (error) {
    content.mediaGenerationStatus = "failed";
    content.mediaGenerationError = error.message.slice(0, 1800);
    await content.save();
    await logInstagramActivity("media_generation_failed", error.message, { contentId: String(content._id) });
    throw error;
  }
}

export async function generateContentDraft({ topic = "", type = "post" }) {
  const config = await getInstagramConfig();
  if (!config.niche) throw new Error("Set the account niche before generating content.");
  const safeType = type === "reel" ? "reel" : "post";
  const prompt = `Create one high-quality Instagram ${safeType} for an education brand. Niche: ${config.niche}. Audience: ${config.targetAudience || "students"}. Voice: ${config.brandVoice}. Topic: ${topic || "a timely, useful topic"}. Return strict JSON with caption, creativeBrief, reelScript (empty for a post), and hashtags (array, maximum 15). No fake claims, engagement bait, or promises.`;
  let generated = null;
  if (process.env.OPENROUTER_API_KEY) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, "Content-Type": "application/json", "X-Title": "EduPortal Instagram Agent" },
      body: JSON.stringify({ model: process.env.INSTAGRAM_AGENT_MODEL || "nvidia/nemotron-nano-9b-v2:free", temperature: 0.65, messages: [{ role: "user", content: prompt }] }),
    });
    const data = await response.json();
    if (response.ok) {
      try { generated = JSON.parse((data.choices?.[0]?.message?.content || "{}").replace(/```json|```/g, "").trim()); } catch (_) { /* use deterministic fallback below */ }
    }
  }
  const caption = generated?.caption || `A practical ${config.niche} tip for ${config.targetAudience || "our learning community"}. Save this for your next study session.`;
  const content = await InstagramContent.create({
    type: safeType,
    topic: topic || config.niche,
    caption,
    hashtags: Array.isArray(generated?.hashtags) ? generated.hashtags.slice(0, 15) : cleanHashtags(caption),
    creativeBrief: generated?.creativeBrief || `Create a clean, on-brand visual explaining one actionable ${config.niche} idea.`,
    reelScript: safeType === "reel" ? (generated?.reelScript || "Hook (0-2s) → explain one useful idea (3-20s) → concise call to save/share (21-30s).") : "",
    createdBy: "agent",
  });
  await logInstagramActivity("content_drafted", `AI drafted a ${safeType}: ${content.topic}`, { contentId: String(content._id) });
  if (process.env.AUTO_GENERATE_MEDIA !== "false") {
    try { await generateMediaForContent(content); }
    catch (_) { /* The draft remains available; dashboard exposes the provider error. */ }
  }
  return content;
}

export async function publishContent(content) {
  const config = await getInstagramConfig();
  if (!config.running) throw new Error("Instagram agent is stopped. Start it before publishing.");
  if (!content.assetUrl) throw new Error("Attach a public image/video URL before publishing. Instagram requires a valid media asset.");
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;
  content.status = "publishing";
  await content.save();
  try {
    const caption = `${content.caption}\n\n${content.hashtags.join(" ")}`.trim();
    const creationPayload = content.type === "reel"
      ? { media_type: "REELS", video_url: content.assetUrl, caption, share_to_feed: "true" }
      : { image_url: content.assetUrl, caption };
    const container = await graph(`/${accountId}/media`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(creationPayload) });
    const published = await graph(`/${accountId}/media_publish`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ creation_id: container.id }) });
    content.status = "published"; content.instagramMediaId = published.id || ""; content.publishedAt = new Date(); content.error = "";
    await content.save();
    await logInstagramActivity("content_published", `Published ${content.type}: ${content.topic}`, { contentId: String(content._id), mediaId: published.id || "" });
    return content;
  } catch (error) {
    content.status = "failed"; content.error = error.message; await content.save();
    await logInstagramActivity("publish_failed", `Could not publish ${content.type}: ${error.message}`, { contentId: String(content._id) });
    throw error;
  }
}

export function verifyMetaSignature(rawBody, signature) {
  const secret = process.env.META_APP_SECRET;
  if (!secret || !signature) return false;
  const expected = `sha256=${crypto.createHmac("sha256", secret).update(rawBody).digest("hex")}`;
  const supplied = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return supplied.length === expectedBuffer.length && crypto.timingSafeEqual(supplied, expectedBuffer);
}

export async function publishDueContent() {
  const config = await getInstagramConfig();
  if (!config.running || !accountConfigured()) return;
  const due = await InstagramContent.findOne({ status: { $in: ["ready", "scheduled"] }, assetUrl: { $ne: "" }, scheduledFor: { $lte: new Date() } }).sort({ scheduledFor: 1 });
  if (due) await publishContent(due);
}
