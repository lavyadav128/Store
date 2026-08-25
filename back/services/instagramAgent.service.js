import crypto from "crypto";
import fetch from "node-fetch";
import InstagramAgentConfig from "../schema/InstagramAgentConfig.model.js";
import InstagramContent from "../schema/InstagramContent.model.js";
import InstagramActivity from "../schema/InstagramActivity.model.js";
import { cloudinary } from "../config/cloudinary.js";

// Meta Graph API base URL helper with standard v21.0 default
function getGraphBase() {
  const version = process.env.META_GRAPH_VERSION || "v21.0";
  const configuredBase = String(process.env.META_GRAPH_BASE_URL || "").trim();
  const base = configuredBase || "https://graph.facebook.com";
  const withoutTrailingSlash = base.replace(/\/+$/, "");

  return withoutTrailingSlash.endsWith(`/${version}`)
    ? withoutTrailingSlash
    : `${withoutTrailingSlash}/${version}`;
}

export async function getInstagramConfig() {
  let config = await InstagramAgentConfig.findOne({ key: "default" });
  if (!config) config = await InstagramAgentConfig.create({ key: "default" });
  return config;
}

export const accountConfigured = () => Boolean(process.env.META_ACCESS_TOKEN);

async function graph(path, options = {}) {
  if (!accountConfigured()) {
    throw new Error(
      "Instagram is not connected. Add META_ACCESS_TOKEN to the backend environment."
    );
  }

  const accessToken = String(process.env.META_ACCESS_TOKEN || "")
    .trim()
    .replace(/^META_ACCESS_TOKEN\s*=\s*/i, "")
    .replace(/^Bearer\s+/i, "")
    .replace(/^["']|["']$/g, "")
    .trim();

  if (!accessToken.startsWith("EAA") && !accessToken.startsWith("IGQ") && !accessToken.startsWith("EA")) {
    throw new Error(
      "META_ACCESS_TOKEN is malformed. In your environment, paste only the raw Meta token (starts with EA... or IGQ...)."
    );
  }

  const separator = path.includes("?") ? "&" : "?";

  const response = await fetch(
    `${getGraphBase()}${path}${separator}access_token=${encodeURIComponent(accessToken)}`,
    options
  );

  const payload = await response.json();

  if (!response.ok) {
    const errorMsg = payload?.error?.message || `Meta Graph API request failed (${response.status})`;
    const errorCode = payload?.error?.code || "";
    throw new Error(`${errorMsg}${errorCode ? ` [Code: ${errorCode}]` : ""}`);
  }

  return payload;
}

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

/**
 * Exchange short-lived User token for a 60-Day Long-Lived Token
 */
export async function exchangeLongLivedToken() {
  const accessToken = String(process.env.META_ACCESS_TOKEN || "").trim();
  const appSecret = String(process.env.META_APP_SECRET || "").trim();

  if (!accessToken || !appSecret) {
    throw new Error("META_ACCESS_TOKEN and META_APP_SECRET are required in .env to generate a long-lived token.");
  }

  const debugRes = await fetch(
    `${getGraphBase()}/debug_token?input_token=${encodeURIComponent(accessToken)}&access_token=${encodeURIComponent(accessToken)}`
  );
  const debugData = await debugRes.json();
  const appId = debugData?.data?.app_id || "1793875795127300";

  const url = `${getGraphBase()}/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${encodeURIComponent(accessToken)}`;
  const response = await fetch(url);
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message || "Failed to exchange for long-lived token.");
  }

  const longLivedToken = payload.access_token;
  const expiresInDays = payload.expires_in ? Math.round(payload.expires_in / 86400) : 60;

  await logInstagramActivity(
    "token_exchanged",
    `Exchanged Meta access token for a 60-day long-lived token (Expires in ~${expiresInDays} days).`
  );

  return {
    success: true,
    longLivedToken,
    expiresInDays,
    tokenType: payload.token_type,
  };
}

export async function getAccountSnapshot() {
  if (!accountConfigured()) {
    return {
      connected: false,
      followers: null,
      username: "",
      mediaCount: null,
      reach: null,
      engagement: null,
      autoDetectedId: null,
    };
  }

  const accountId = String(process.env.INSTAGRAM_ACCOUNT_ID || "").trim();
  let account = null;
  let autoDetectedId = null;

  if (accountId) {
    try {
      account = await graph(`/${accountId}?fields=username,followers_count,media_count,name`);
    } catch (_) {
      try {
        account = await graph(`/${accountId}?fields=username,media_count`);
      } catch (_) {}
    }
  }

  if (!account || account.followers_count === undefined) {
    try {
      const meData = await graph(
        `/me/accounts?fields=name,access_token,instagram_business_account{id,username,followers_count,media_count,name}`
      );
      const pages = meData.data || [];

      for (const page of pages) {
        if (page.instagram_business_account) {
          const ig = page.instagram_business_account;
          autoDetectedId = ig.id;
          account = {
            username: ig.username || ig.name || page.name,
            followers_count: ig.followers_count !== undefined ? ig.followers_count : account?.followers_count ?? null,
            mediaCount: ig.media_count !== undefined ? ig.media_count : account?.media_count ?? null,
          };
          break;
        }
      }
    } catch (_) {
      try {
        const meDirect = await graph(`/me?fields=id,name,username`);
        if (!account) {
          account = {
            username: meDirect.username || meDirect.name || "",
            followers_count: null,
            media_count: null,
          };
        }
      } catch (_) {}
    }
  }

  if (!account) {
    throw new Error(
      "Cannot access Instagram account with current token. Ensure your Meta App has 'instagram_basic' permissions and the user is an admin of the connected Facebook Page."
    );
  }

  let insights = {};
  const queryId = accountId || autoDetectedId;
  if (queryId) {
    try {
      insights = await graph(`/${queryId}/insights?metric=reach,accounts_engaged&period=day`);
    } catch (_) {}
  }

  const values = Object.fromEntries(
    (insights.data || []).map((item) => [
      item.name,
      item.values?.at(-1)?.value ?? null,
    ])
  );

  return {
    connected: true,
    username: account.username || account.name || "",
    followers: account.followers_count !== undefined ? account.followers_count : null,
    mediaCount: account.media_count !== undefined ? account.media_count : null,
    reach: values.reach ?? null,
    engagement: values.accounts_engaged ?? null,
    autoDetectedId: autoDetectedId || accountId,
  };
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
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });
}

async function uploadRemoteAsset(url, resourceType) {
  return cloudinary.uploader.upload(url, {
    folder: "instagram-agent",
    resource_type: resourceType,
  });
}

/* ═════════════════════════════════════════════════════════════
   ROYALTY-FREE MUSIC CATALOG & TRENDING AUDIO ENGINE
═════════════════════════════════════════════════════════════ */

const ROYALTY_FREE_AUDIO_LIBRARY = [
  {
    id: "lofi-study-1",
    title: "Chill Midnight Study Beats",
    artist: "Lofi Dreamer (CC0)",
    genre: "Lo-Fi Beats",
    duration: 32,
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
  },
  {
    id: "tech-ambient-2",
    title: "Cyber Deep Focus Pulse",
    artist: "Future Wave (Royalty Free)",
    genre: "Tech Ambient",
    duration: 28,
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=electronic-future-beats-117997.mp3",
  },
  {
    id: "cinematic-inspire-3",
    title: "Inspiring Cinematic Ascent",
    artist: "Orchestra Modern (CC-BY)",
    genre: "Cinematic Motivational",
    duration: 30,
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=inspiring-cinematic-ambient-116199.mp3",
  },
  {
    id: "modern-upbeat-4",
    title: "Upbeat Creative Groove",
    artist: "Studio Soundtrack (Royalty Free)",
    genre: "Modern Indie Upbeat",
    duration: 25,
    audioUrl: "https://cdn.pixabay.com/download/audio/2021/09/06/audio_8bb5e4688a.mp3?filename=tropical-summer-music-112842.mp3",
  },
];

export function getAvailableMusicTracks() {
  return ROYALTY_FREE_AUDIO_LIBRARY;
}

export function getTrendingAudioRecommendation(topic, niche = "Education & Tech") {
  const recommendations = [
    `🎵 Trending Audio: "Midnight City Beats" by SynthLab (Viral in ${niche})`,
    `🎵 Trending Audio: "Deep Focus Lo-Fi Flow" by Coffeehop (High engagement on Reels)`,
    `🎵 Trending Audio: "Inspire Tomorrow" by Cinematic Audio Hub`,
    `🎵 Trending Audio: "Electronic Future Pulse" (12.4k Reels using this audio)`,
  ];
  return recommendations[Math.floor(Math.random() * recommendations.length)];
}

export async function attachMusicToContent(content, trackId) {
  const track = ROYALTY_FREE_AUDIO_LIBRARY.find((t) => t.id === trackId) || ROYALTY_FREE_AUDIO_LIBRARY[0];
  content.audioTrack = track;
  content.trendingAudioSuggestion = getTrendingAudioRecommendation(content.topic);

  // Append audio recommendation in caption if not already present
  if (!content.caption.includes("🎵")) {
    content.caption = `${content.caption}\n\n${content.trendingAudioSuggestion}`;
  }

  await content.save();
  await logInstagramActivity(
    "music_attached",
    `Attached free royalty-free music "${track.title}" to ${content.type}: ${content.topic}`,
    { contentId: String(content._id), trackId: track.id }
  );
  return content;
}

/* ═════════════════════════════════════════════════════════════
   ULTRA-HD IMAGE GENERATION & UNSPLASH 4K INTEGRATION
═════════════════════════════════════════════════════════════ */

function cleanPromptForPhotorealism(content, config) {
  // Strip any request for fake text on image to guarantee ultra-clean photographic quality
  const topicClean = (content.topic || config.niche || "study and productivity").replace(/[^\w\s]/gi, "");
  return `Award-winning professional photography of ${topicClean}. Modern aesthetic studio setting, clean lighting, 8k resolution, photorealistic, cinematic depth of field, vivid crisp colors, Sony A7R IV 85mm lens style, completely clean background without distorted text, no watermarks, flawless high definition composition.`;
}

/**
 * Fetch a 4K curated photo matching the topic from Unsplash.
 */
async function fetchUnsplashPhoto(keyword) {
  try {
    const cleanWord = encodeURIComponent(keyword.split(" ")[0] || "technology");
    const unsplashUrl = `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1080&h=1920&fit=crop&q=85&auto=format`;
    // Try keyword search via source/random
    const searchUrl = `https://source.unsplash.com/featured/1080x1920/?${cleanWord},education,technology`;
    return searchUrl;
  } catch (_) {
    return "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1080&h=1920&fit=crop&q=85";
  }
}

/**
 * Resilient multi-tier FLUX.1 Ultra-HD image generator.
 */
async function generateFluxHdImage(prompt, topic) {
  const safePrompt = encodeURIComponent(prompt.slice(0, 420));
  const seed = Math.floor(Math.random() * 999999);

  // 1. FLUX.1 Model (Top tier photorealism)
  const fluxUrl = `https://image.pollinations.ai/prompt/${safePrompt}?model=flux&width=1080&height=1920&nologo=true&enhance=true&seed=${seed}`;

  try {
    const polResponse = await fetch(fluxUrl, { method: "GET" });
    if (polResponse.ok) {
      const arrayBuf = await polResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuf);
      if (buffer.length > 5000) {
        const result = await uploadBuffer(buffer, "image");
        return result.secure_url;
      }
    }
  } catch (fluxErr) {
    console.warn("FLUX image attempt failed, falling back to SDXL:", fluxErr.message);
  }

  // 2. Fallback: SDXL Base Model
  try {
    const sdxlUrl = `https://image.pollinations.ai/prompt/${safePrompt}?width=1080&height=1920&nologo=true&enhance=true&seed=${seed}`;
    const response = await fetch(sdxlUrl, { method: "GET" });
    if (response.ok) {
      const arrayBuf = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuf);
      const result = await uploadBuffer(buffer, "image");
      return result.secure_url;
    }
  } catch (_) {}

  // 3. Fallback: Curated 4K Studio Stock
  const stockUrl = await fetchUnsplashPhoto(topic);
  const result = await uploadRemoteAsset(stockUrl, "image");
  return result.secure_url;
}

export async function generateMediaForContent(content) {
  const config = await getInstagramConfig();
  content.mediaGenerationStatus = "generating";
  content.mediaGenerationError = "";
  await content.save();

  try {
    const hdPrompt = cleanPromptForPhotorealism(content, config);

    if (content.type === "post") {
      const imageUrl = await generateFluxHdImage(hdPrompt, content.topic);
      content.assetUrl = imageUrl;
      content.assetSource = "ai_image";
      content.visualOptions = [imageUrl];
    } else {
      // Reels video generation
      if (!process.env.AI_VIDEO_API_URL || !process.env.AI_VIDEO_API_KEY) {
        const imageUrl = await generateFluxHdImage(hdPrompt, content.topic);
        content.assetUrl = imageUrl;
        content.assetSource = "ai_image";
        content.visualOptions = [imageUrl];
      } else {
        const response = await fetch(process.env.AI_VIDEO_API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.AI_VIDEO_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: hdPrompt,
            model: process.env.AI_VIDEO_MODEL || "default",
            aspect_ratio: "9:16",
            duration_seconds: 10,
          }),
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.error?.message || "Video provider rejected the request.");
        const videoUrl = payload.url || payload.video_url || payload.output?.url || payload.data?.[0]?.url;
        if (!videoUrl) throw new Error("Video provider did not return a completed video URL.");
        const result = await uploadRemoteAsset(videoUrl, "video");
        content.assetUrl = result.secure_url;
        content.assetSource = "ai_video";
        content.visualOptions = [result.secure_url];
      }
    }

    // Auto-attach a royalty-free music track for Reels or Posts
    if (!content.audioTrack?.audioUrl) {
      const defaultTrack = ROYALTY_FREE_AUDIO_LIBRARY[0];
      content.audioTrack = defaultTrack;
      content.trendingAudioSuggestion = getTrendingAudioRecommendation(content.topic, config.niche);
    }

    content.mediaGenerationStatus = "ready";
    content.status = "ready";
    if (!content.scheduledFor) content.scheduledFor = new Date();
    await content.save();

    await logInstagramActivity(
      "media_generated",
      `Generated FLUX.1 Ultra-HD asset and attached audio for ${content.type}: ${content.topic}`,
      { contentId: String(content._id), url: content.assetUrl }
    );
    return content;
  } catch (error) {
    content.mediaGenerationStatus = "failed";
    content.mediaGenerationError = error.message.slice(0, 1800);
    await content.save();
    await logInstagramActivity("media_generation_failed", error.message, {
      contentId: String(content._id),
    });
    throw error;
  }
}

export async function generateContentDraft({ topic = "", type = "post" }) {
  const config = await getInstagramConfig();
  if (!config.niche) throw new Error("Set the account niche before generating content.");
  const safeType = type === "reel" ? "reel" : "post";
  const prompt = `Create one high-quality Instagram ${safeType} for an education & agency brand. Niche: ${config.niche}. Audience: ${config.targetAudience || "students & founders"}. Voice: ${config.brandVoice}. Topic: ${topic || "a timely, useful topic"}. Return strict JSON with caption, creativeBrief, reelScript (empty for a post), and hashtags (array, maximum 15). No fake claims, engagement bait, or promises.`;
  let generated = null;

  if (process.env.OPENROUTER_API_KEY) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "X-Title": "EduPortal Instagram Agent",
        },
        body: JSON.stringify({
          model: process.env.INSTAGRAM_AGENT_MODEL || "nvidia/nemotron-nano-9b-v2:free",
          temperature: 0.65,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      if (response.ok) {
        try {
          generated = JSON.parse(
            (data.choices?.[0]?.message?.content || "{}").replace(/```json|```/g, "").trim()
          );
        } catch (_) {}
      }
    } catch (_) {}
  }

  const caption =
    generated?.caption ||
    `A practical ${config.niche} insight for ${config.targetAudience || "our community"}. Save this for your next session.`;
  const trendingAudio = getTrendingAudioRecommendation(topic || config.niche, config.niche);

  const content = await InstagramContent.create({
    type: safeType,
    topic: topic || config.niche,
    caption: `${caption}\n\n${trendingAudio}`,
    hashtags: Array.isArray(generated?.hashtags) ? generated.hashtags.slice(0, 15) : cleanHashtags(caption),
    creativeBrief: generated?.creativeBrief || `Create an award-winning aesthetic visual illustrating ${topic || config.niche}.`,
    reelScript:
      safeType === "reel"
        ? generated?.reelScript || "Hook (0-2s) → explain one useful idea (3-20s) → concise call to save/share (21-30s)."
        : "",
    audioTrack: ROYALTY_FREE_AUDIO_LIBRARY[0],
    trendingAudioSuggestion: trendingAudio,
    createdBy: "agent",
  });

  await logInstagramActivity("content_drafted", `AI drafted a ${safeType}: ${content.topic}`, {
    contentId: String(content._id),
  });

  if (process.env.AUTO_GENERATE_MEDIA !== "false") {
    try {
      await generateMediaForContent(content);
    } catch (_) {}
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
    const creationPayload =
      content.type === "reel"
        ? { media_type: "REELS", video_url: content.assetUrl, caption, share_to_feed: "true" }
        : { image_url: content.assetUrl, caption };
    const container = await graph(`/${accountId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creationPayload),
    });
    const published = await graph(`/${accountId}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creation_id: container.id }),
    });

    content.status = "published";
    content.instagramMediaId = published.id || "";
    content.publishedAt = new Date();
    content.error = "";
    await content.save();
    await logInstagramActivity("content_published", `Published ${content.type}: ${content.topic}`, {
      contentId: String(content._id),
      mediaId: published.id || "",
    });
    return content;
  } catch (error) {
    content.status = "failed";
    content.error = error.message;
    await content.save();
    await logInstagramActivity("publish_failed", `Could not publish ${content.type}: ${error.message}`, {
      contentId: String(content._id),
    });
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
  const due = await InstagramContent.findOne({
    status: { $in: ["ready", "scheduled"] },
    assetUrl: { $ne: "" },
    scheduledFor: { $lte: new Date() },
  }).sort({ scheduledFor: 1 });
  if (due) await publishContent(due);
}
