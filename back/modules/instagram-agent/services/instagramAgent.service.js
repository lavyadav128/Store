import crypto from 'crypto';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import os from 'os';
import InstagramAgentConfig from '../schema/InstagramAgentConfig.model.js';
import InstagramContent from '../schema/InstagramContent.model.js';
import InstagramActivity from '../schema/InstagramActivity.model.js';
import { cloudinary } from '../../../config/cloudinary.js';
import { NATURE_THEMES, getUniqueNatureTheme, getDailyNatureTheme } from './natureThemes.js';
import { analyzeAudiencePreferences } from './growthOptimizer.js';

export function getQuoteFingerprint(text = '') {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 40);
}

// Meta Graph API base URL helper with standard v21.0 default
function getGraphBase() {
  const version = process.env.META_GRAPH_VERSION || 'v21.0';
  const configuredBase = String(process.env.META_GRAPH_BASE_URL || '').trim();
  const base = configuredBase || 'https://graph.facebook.com';
  const withoutTrailingSlash = base.replace(/\/+$/, '');

  return withoutTrailingSlash.endsWith(`/${version}`)
    ? withoutTrailingSlash
    : `${withoutTrailingSlash}/${version}`;
}

export async function getInstagramConfig() {
  let config = await InstagramAgentConfig.findOne({ key: 'default' });
  if (!config) {
    config = await InstagramAgentConfig.create({ key: 'default', dailyPostTime: '12:00' });
  } else if (!config.dailyPostTime || config.dailyPostTime === '07:00') {
    config.dailyPostTime = '12:00';
    await config.save();
  }
  return config;
}

export async function startInstagramAgent() {
  const config = await getInstagramConfig();
  config.running = true;
  config.lastStartedAt = new Date();
  config.lastError = '';
  await config.save();
  await logInstagramActivity('agent_started', 'Instagram Growth Agent started.');
  return config;
}

export async function stopInstagramAgent() {
  const config = await getInstagramConfig();
  config.running = false;
  config.lastStoppedAt = new Date();
  await config.save();
  await logInstagramActivity('agent_stopped', 'Instagram Growth Agent stopped.');
  return config;
}

export const accountConfigured = () => Boolean(process.env.META_ACCESS_TOKEN);

async function graph(path, options = {}) {
  if (!accountConfigured()) {
    throw new Error(
      'Instagram is not connected. Add META_ACCESS_TOKEN to the backend environment.'
    );
  }

  const accessToken = String(process.env.META_ACCESS_TOKEN || '')
    .trim()
    .replace(/^META_ACCESS_TOKEN\s*=\s*/i, '')
    .replace(/^Bearer\s+/i, '')
    .replace(/^["']|["']$/g, '')
    .trim();

  if (!accessToken.startsWith('EAA') && !accessToken.startsWith('IGQ') && !accessToken.startsWith('EA')) {
    throw new Error(
      'META_ACCESS_TOKEN is malformed. In your environment, paste only the raw Meta token (starts with EA... or IGQ...).'
    );
  }

  const separator = path.includes('?') ? '&' : '?';

  const response = await fetch(
    `${getGraphBase()}${path}${separator}access_token=${encodeURIComponent(accessToken)}`,
    options
  );
  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data?.error?.message || `Meta Graph API error (${response.status})`;
    throw new Error(errorMsg);
  }
  return data;
}

export async function logInstagramActivity(type, message, metadata = {}) {
  try {
    return await InstagramActivity.create({ type, message, metadata });
  } catch (_) {
    return null;
  }
}

export async function replyToInstagramComment(commentId, text) {
  return graph(`/${commentId}/replies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text }),
  });
}

export async function sendInstagramMessage(recipientId, text) {
  return graph('/me/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text }),
  });
}

const COMMUNITY_REPLIES = [
  "Thank you for the love! Stay connected with the serenity of nature. 🌿✨",
  "Appreciate your support! Take a deep breath and keep smiling today. 🌅🙏",
  "So glad this brought you peace! Share with someone who needs a calm moment today. 💫🍃",
  "Thank you! Wishing you a peaceful and wonderful day ahead. 🌲☀️",
  "Keep shining! Pure nature and serenity to you always. 🌸🌊",
];

export function safeCommunityReply(config, userMessage = '') {
  const clean = String(userMessage || '').toLowerCase();
  if (clean.includes('peace') || clean.includes('calm') || clean.includes('love') || clean.includes('beautiful')) {
    return "Thank you so much! Wishing you infinite peace and serenity today. 🌿✨";
  }
  return COMMUNITY_REPLIES[Math.floor(Math.random() * COMMUNITY_REPLIES.length)];
}

/**
 * Exchange short-lived User token for a 60-Day Long-Lived Token
 */
export async function exchangeLongLivedToken() {
  const accessToken = String(process.env.META_ACCESS_TOKEN || '').trim();
  const appSecret = String(process.env.META_APP_SECRET || '').trim();

  if (!accessToken || !appSecret) {
    throw new Error('META_ACCESS_TOKEN and META_APP_SECRET are required in .env to generate a long-lived token.');
  }

  const debugRes = await fetch(
    `${getGraphBase()}/debug_token?input_token=${encodeURIComponent(accessToken)}&access_token=${encodeURIComponent(accessToken)}`
  );
  const debugData = await debugRes.json();
  const appId = debugData?.data?.app_id || process.env.META_APP_ID;

  if (!appId) {
    throw new Error('Unable to resolve Meta App ID from token. Please ensure META_APP_ID or META_APP_SECRET is valid.');
  }

  const exchangeUrl = `${getGraphBase()}/oauth/access_token?grant_type=fb_exchange_token&client_id=${encodeURIComponent(
    appId
  )}&client_secret=${encodeURIComponent(appSecret)}&fb_exchange_token=${encodeURIComponent(accessToken)}`;

  const response = await fetch(exchangeUrl);
  const data = await response.json();

  if (!response.ok || !data.access_token) {
    throw new Error(data?.error?.message || 'Failed to exchange for long-lived Meta token.');
  }

  const expiresInSeconds = data.expires_in || 5184000;
  const expiresInDays = Math.round(expiresInSeconds / 86400);

  await logInstagramActivity(
    'token_exchanged',
    `Successfully generated 60-day long-lived Meta access token (expires in ~${expiresInDays} days).`
  );

  return {
    longLivedToken: data.access_token,
    tokenType: data.token_type || 'bearer',
    expiresInSeconds,
    expiresInDays,
    message: `Generated 60-Day Long-Lived Token! Copy and update META_ACCESS_TOKEN in your environment.`,
  };
}

export function verifyMetaSignature(req) {
  const signature = req.headers['x-hub-signature-256'];
  const appSecret = process.env.META_APP_SECRET;
  if (!signature || !appSecret) return true;
  const hmac = crypto.createHmac('sha256', appSecret);
  const digest = `sha256=${hmac.update(req.rawBody || JSON.stringify(req.body)).digest('hex')}`;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function getAccountSnapshot() {
  if (!accountConfigured()) {
    return {
      connected: false,
      username: '',
      followers: null,
      reach: null,
      mediaCount: null,
      message: 'Configure META_ACCESS_TOKEN to connect Instagram.',
    };
  }

  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;
  if (!accountId) {
    return {
      connected: true,
      username: 'quietframes.ai',
      followers: 4,
      reach: null,
      mediaCount: 25,
      message: 'Add INSTAGRAM_ACCOUNT_ID in environment to sync live Graph metrics.',
    };
  }

  try {
    const data = await graph(
      `/${accountId}?fields=id,username,name,profile_picture_url,followers_count,follows_count,media_count,biography`
    );

    let profileFollowers = (data.followers_count !== undefined && data.followers_count !== null) ? Number(data.followers_count) : null;

    if (profileFollowers === null || profileFollowers === undefined) {
      try {
        const scrapeRes = await fetch('https://www.instagram.com/quietframes.ai/?__a=1&__d=dis', {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
          }
        });
        if (scrapeRes.ok) {
          const rawText = await scrapeRes.text();
          const match = rawText.match(/"edge_followed_by":\{"count":(\d+)\}/) || rawText.match(/([0-9,]+)\s+Followers/i);
          if (match && match[1]) {
            profileFollowers = parseInt(match[1].replace(/,/g, ''), 10);
          }
        }
      } catch (_) {}
    }

    if (profileFollowers === null || profileFollowers === undefined) {
      profileFollowers = 4;
    }

    return {
      connected: true,
      id: data.id,
      username: data.username || 'quietframes.ai',
      name: data.name,
      profilePictureUrl: data.profile_picture_url,
      followers: profileFollowers,
      follows: data.follows_count,
      mediaCount: data.media_count || 25,
      biography: data.biography,
      message: '',
    };
  } catch (error) {
    return {
      connected: true,
      username: 'quietframes.ai',
      followers: 4,
      reach: null,
      mediaCount: 25,
      message: `Account connected (${error.message})`,
    };
  }
}

function getCloudinaryPublicId(url) {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) return null;
  try {
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return null;
    let pathPart = url.substring(uploadIndex + 8);
    pathPart = pathPart.replace(/^v\d+\//, '');
    const lastDotIndex = pathPart.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      pathPart = pathPart.substring(0, lastDotIndex);
    }
    return pathPart;
  } catch (_) {
    return null;
  }
}

function uploadBuffer(buffer, resourceType) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'instagram-agent', resource_type: resourceType },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });
}

export function getAvailableMusicTracks() {
  return [];
}

export function getTrendingAudioRecommendation(topic) {
  return `🎵 Soundscape curated for "${topic || 'Earth & Wilderness'}"`;
}

export async function attachMusicToContent(content) {
  content.trendingAudioSuggestion = `🎵 Soundscape: Curated for ${content.topic}`;
  if (!content.caption.includes('🎵')) {
    content.caption = `${content.caption}\n\n${content.trendingAudioSuggestion}`;
  }
  await content.save();
  await logInstagramActivity(
    'music_attached',
    `Attached soundscape track to ${content.type}: ${content.topic}`,
    { contentId: String(content._id) }
  );
  return content;
}

export async function generateContentDraft({ topic = '', type = 'reel', category = '' }) {
  const config = await getInstagramConfig();
  const isVideo = type === 'reel' || type === 'video' || (type === undefined && config.contentMode !== 'post');
  const effectiveType = isVideo ? 'reel' : 'post';

  const pastContents = await InstagramContent.find(
    {},
    { quoteFingerprint: 1, quote: 1, topic: 1 }
  ).sort({ createdAt: -1 }).limit(200).lean();

  const usedFingerprints = new Set(
    pastContents
      .map((p) => p.quoteFingerprint || getQuoteFingerprint(p.quote || p.topic))
      .filter(Boolean)
  );

  const targetCategory = category || "All Realms";
  const selectedTheme = getUniqueNatureTheme(usedFingerprints, targetCategory);

  const selectedTopic = topic || selectedTheme.title;
  const caption = selectedTheme.caption;
  const themeCategory = selectedTheme.realm || targetCategory;
  const creativePrompt = selectedTheme.description || selectedTopic;
  const hashtags = selectedTheme.hashtags;
  const reelScript = isVideo ? selectedTheme.reelScript : '';
  const soundscape = selectedTheme.soundscape || 'Ethereal Ambient Nature Soundscape';

  const topicFp = getQuoteFingerprint(selectedTopic);

  const content = await InstagramContent.create({
    type: effectiveType,
    topic: selectedTopic,
    quote: selectedTopic,
    speaker: themeCategory,
    quoteFingerprint: topicFp,
    themeCategory: themeCategory,
    caption: caption,
    hashtags: hashtags,
    creativeBrief: creativePrompt,
    reelScript: reelScript,
    soundscape: soundscape,
    trendingAudioSuggestion: soundscape ? `🎵 Soundscape: "${soundscape}"` : `🎵 Ambient Nature Soundscape`,
    createdBy: 'agent',
    mediaGenerationStatus: 'not_requested',
  });

  await logInstagramActivity(
    'content_drafted',
    `Drafted Nature ${isVideo ? 'Video Reel' : 'Image Post'} [${themeCategory}]: "${selectedTopic}"`,
    {
      contentId: String(content._id),
      category: themeCategory,
      topic: selectedTopic,
    }
  );

  return content;
}

export async function publishContent(content) {
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;
  if (!accountId) {
    throw new Error('INSTAGRAM_ACCOUNT_ID is required to publish content to Instagram.');
  }

  if (!content.assetUrl) {
    throw new Error('Cannot publish content without a media asset (assetUrl is empty).');
  }

  content.status = 'publishing';
  await content.save();

  try {
    const isVideoAsset =
      content.type === 'reel' ||
      content.assetSource === 'ai_video' ||
      content.assetSource === 'admin' ||
      /\.(mp4|mov|webm)(\?|$)/i.test(content.assetUrl);

    const caption = `${content.caption}\n\n${(content.hashtags || []).join(' ')}`.trim();

    let creationPayload = {};

    if (isVideoAsset) {
      creationPayload = {
        media_type: 'REELS',
        video_url: content.assetUrl,
        caption,
        share_to_feed: true,
      };
    } else {
      creationPayload = {
        image_url: content.assetUrl,
        caption,
      };
    }

    const container = await graph(`/${accountId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creationPayload),
    });

    if (!container.id) {
      throw new Error(`Failed to create Instagram container: ${JSON.stringify(container)}`);
    }

    // If video, poll container until FINISHED
    if (isVideoAsset) {
      let isReady = false;
      for (let attempt = 0; attempt < 30; attempt += 1) {
        await new Promise((r) => setTimeout(r, 2500));
        try {
          const statusRes = await graph(`/${container.id}?fields=status_code,status`);
          if (statusRes.status_code === 'FINISHED') {
            isReady = true;
            break;
          }
          if (statusRes.status_code === 'ERROR') {
            throw new Error(`Instagram video processing error: ${statusRes.status || 'Failed to process reel'}`);
          }
        } catch (pollErr) {
          if (pollErr.message.includes('Instagram video processing error')) throw pollErr;
        }
      }
    }

    // Publish container
    const published = await graph(`/${accountId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: container.id }),
    });

    content.status = 'published';
    content.instagramMediaId = published.id || '';
    content.publishedAt = new Date();
    content.error = '';

    // POST-PUBLISH STORAGE CLEANUP: Purge video from Cloudinary
    if (content.assetUrl && content.assetUrl.includes('res.cloudinary.com')) {
      const publicId = getCloudinaryPublicId(content.assetUrl);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId, { resource_type: isVideoAsset ? 'video' : 'image' });
        } catch (_) {}
      }
    }

    content.assetUrl = '';
    await content.save();

    await logInstagramActivity('content_published', `Published ${isVideoAsset ? 'Reel' : 'Post'} to Instagram: ${content.topic}. Storage cleaned up.`, {
      contentId: String(content._id),
      mediaId: published.id || '',
    });
    return content;
  } catch (error) {
    content.status = 'failed';
    content.error = error.message;
    await content.save();
    await logInstagramActivity('publish_failed', `Could not publish reel: ${error.message}`, {
      contentId: String(content._id),
    });
    throw error;
  }
}

export async function getNextAvailableScheduleDate() {
  const config = await getInstagramConfig();
  const timeStr = config.dailyPostTime || '12:00';
  const [postHour, postMin] = timeStr.split(':').map((num) => parseInt(num, 10) || 0);

  const now = new Date();
  const todayPostTime = new Date();
  todayPostTime.setHours(postHour, postMin, 0, 0);

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const publishedToday = await InstagramContent.countDocuments({
    status: 'published',
    publishedAt: { $gte: startOfDay, $lte: endOfDay },
  });

  const latestScheduled = await InstagramContent.findOne({
    status: { $in: ['ready', 'scheduled'] },
    assetUrl: { $ne: '' },
  }).sort({ scheduledFor: -1 });

  let nextDate = new Date(todayPostTime);

  if (latestScheduled && latestScheduled.scheduledFor) {
    const latestDate = new Date(latestScheduled.scheduledFor);
    nextDate = new Date(latestDate.getTime() + 24 * 60 * 60 * 1000);
    nextDate.setHours(postHour, postMin, 0, 0);
  } else if (publishedToday >= 1 || now.getTime() > todayPostTime.getTime()) {
    nextDate = new Date(todayPostTime.getTime() + 24 * 60 * 60 * 1000);
  }

  return nextDate;
}

/**
 * Admin direct video upload with automatic 12-series AI hashtags & caption generation
 */
export async function createAdminUploadedReel({
  filePath,
  fileBuffer,
  fileUrl,
  category = "🌅 Nature's Morning",
  topic = "",
  customCaption = "",
  customHashtags = [],
  aspectRatio = "9:16",
}) {
  let assetUrl = fileUrl;

  if (filePath && fs.existsSync(filePath)) {
    const uploaded = await cloudinary.uploader.upload(filePath, {
      folder: 'instagram-agent/admin-reels',
      resource_type: 'video',
    });
    assetUrl = uploaded.secure_url;
    try {
      fs.unlinkSync(filePath);
    } catch (_) {}
  } else if (fileBuffer) {
    const uploaded = await uploadBuffer(fileBuffer, 'video');
    assetUrl = uploaded.secure_url;
  }

  if (!assetUrl) {
    throw new Error('A valid video file or public video URL is required to create an admin reel.');
  }

  const selectedTheme = getUniqueNatureTheme(new Set(), category);
  const selectedTopic = topic || selectedTheme.title || `${category} Reel`;

  let caption = customCaption || selectedTheme.caption || `🌿 ${category}: ${selectedTopic}\n\nExperience the calm and wonder of Earth's greatest marvels. Take a deep breath and reset.\n\n📌 Save this reel for daily peace!\n💬 Share your thoughts below! 👇`;
  let hashtags = (Array.isArray(customHashtags) && customHashtags.length > 0)
    ? customHashtags
    : (selectedTheme.hashtags || ['#naturelovers', '#reelsinstagram', '#earthfocus', '#peacefulnature', '#8knature', '#cinematicnature', '#naturegram']);
  let soundscape = selectedTheme.soundscape || 'Matching Ambient Nature Soundscape';

  const scheduledDate = await getNextAvailableScheduleDate();

  const content = await InstagramContent.create({
    type: 'reel',
    topic: selectedTopic,
    quote: selectedTopic,
    speaker: category,
    themeCategory: category,
    caption: caption,
    hashtags: hashtags,
    creativeBrief: `Admin uploaded ${aspectRatio} reel for ${category}`,
    aspectRatio: aspectRatio || "9:16",
    assetUrl: assetUrl,
    assetSource: 'admin',
    soundscape: soundscape,
    trendingAudioSuggestion: `🎵 Soundscape: "${soundscape}"`,
    mediaGenerationStatus: 'ready',
    status: 'ready',
    scheduledFor: scheduledDate,
    createdBy: 'admin',
  });

  await logInstagramActivity(
    'admin_reel_created',
    `Admin uploaded ${aspectRatio} video reel for [${category}]: "${selectedTopic}"`,
    {
      contentId: String(content._id),
      category,
      aspectRatio,
      assetUrl,
      scheduledFor: scheduledDate,
    }
  );

  return content;
}
