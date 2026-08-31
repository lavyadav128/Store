import crypto from 'crypto';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import util from 'util';
import ffmpegStatic from 'ffmpeg-static';
import InstagramAgentConfig from '../schema/InstagramAgentConfig.model.js';
import InstagramContent from '../schema/InstagramContent.model.js';
import InstagramActivity from '../schema/InstagramActivity.model.js';
import { cloudinary } from '../../../config/cloudinary.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NATURE_THEMES, getUniqueNatureTheme, getDailyNatureTheme } from './natureThemes.js';
import { MOTIVATIONAL_THEMES, getUniqueMotivationalTheme, getQuoteFingerprint, getDailyMotivationalTheme } from './motivationalThemes.js';
import { analyzeAudiencePreferences } from './growthOptimizer.js';
import { fetchUniquePexelsMedia, formatPexelsQuery } from './pexelsMedia.service.js';
import { fetchMatchingFreesoundAudio, formatFreesoundQuery } from './freesoundAudio.service.js';
import { composeReelWithAudio } from './reelComposer.service.js';

const execPromise = util.promisify(exec);

export const getFfmpegBin = () => {
  if (ffmpegStatic && typeof ffmpegStatic === 'string' && fs.existsSync(ffmpegStatic)) {
    return ffmpegStatic;
  }
  if (process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH)) {
    return process.env.FFMPEG_PATH;
  }
  return 'ffmpeg';
};

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

  const payload = await response.json();

  if (!response.ok) {
    const errorMsg = payload?.error?.message || `Meta Graph API request failed (${response.status})`;
    const errorCode = payload?.error?.code || '';
    throw new Error(`${errorMsg}${errorCode ? ` [Code: ${errorCode}]` : ''}`);
  }

  return payload;
}

export async function sendInstagramMessage(recipientId, text) {
  if (!recipientId) return null;
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;
  return graph(`/${accountId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipient: { id: recipientId }, message: { text } }),
  });
}

export async function replyToInstagramComment(commentId, text) {
  if (!commentId) return null;
  return graph(`/${commentId}/replies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text }),
  });
}

export async function generateMotivationalReplyWithGemini(userMessage, niche = 'Motivation & Success Mindset') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return `Keep pushing forward! 🚀 Consistency and discipline will turn your vision into reality. ✨`;
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    for (const mName of ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.5-flash']) {
      try {
        const model = genAI.getGenerativeModel({ model: mName });
        const prompt = `You are an inspiring, high-energy, and empowering community manager for a top-tier Instagram motivational and mindset page.
A follower commented/messaged: "${userMessage}".
Write an encouraging, powerful, and concise reply (1-2 sentences) in Hindi or English (matching their language). Always end with an empowering quote or emoji like "Keep crushing your goals! 🚀🔥" or "मेहनत जारी रखो, जीत तुम्हारी होगी! ⚡". Do not include quotation marks.`;
        const res = await model.generateContent(prompt);
        return res.response.text().trim();
      } catch (_) {}
    }
    return `Keep pushing forward! 🚀 Consistency and discipline will turn your vision into reality. ✨`;
  } catch (_) {
    return `Keep pushing forward! 🚀 Consistency and discipline will turn your vision into reality. ✨`;
  }
}

export function safeCommunityReply(config, userMessage = '') {
  return generateMotivationalReplyWithGemini(userMessage, config.niche);
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
  const appId = debugData?.data?.app_id || '1793875795127300';

  const url = `${getGraphBase()}/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${encodeURIComponent(accessToken)}`;
  const response = await fetch(url);
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message || 'Failed to exchange for long-lived token.');
  }

  const longLivedToken = payload.access_token;
  const expiresInDays = payload.expires_in ? Math.round(payload.expires_in / 86400) : 60;

  await logInstagramActivity(
    'token_exchanged',
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
      username: '',
      mediaCount: null,
      reach: null,
      engagement: null,
      autoDetectedId: null,
    };
  }

  const accountId = String(process.env.INSTAGRAM_ACCOUNT_ID || '').trim();
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
            username: meDirect.username || meDirect.name || '',
            followers_count: null,
            media_count: null,
          };
        }
      } catch (_) {}
    }
  }

  if (!account) {
    throw new Error(
      'Cannot access Instagram account with current token. Ensure your Meta App has "instagram_basic" permissions and the user is an admin of the connected Facebook Page.'
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
    username: account.username || account.name || '',
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

function cleanHashtags(value = '') {
  return [...new Set((value.match(/#[\p{L}\p{N}_]+/gu) || []).slice(0, 20))];
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

async function uploadRemoteAsset(url, resourceType) {
  return cloudinary.uploader.upload(url, {
    folder: 'instagram-agent',
    resource_type: resourceType,
  });
}

export function getAvailableMusicTracks() {
  return [];
}

export function getTrendingAudioRecommendation(topic, niche = 'Nature & Relaxation') {
  return `🎵 Nature Soundscape matched via Freesound API for "${topic || 'Earth & Wilderness'}"`;
}

export async function attachMusicToContent(content, trackId) {
  content.trendingAudioSuggestion = `🎵 Soundscape: Curated for ${content.topic}`;

  // Append audio recommendation in caption if not already present
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

export async function generateMediaForContent(content) {
  content.mediaGenerationStatus = 'generating';
  content.mediaGenerationError = '';
  await content.save();

  try {
    const isVideo = content.type === 'reel';

    // 1. Fetch authentic HD 9:16 vertical video or 8K photo from Pexels API
    const pexelsMedia = await fetchUniquePexelsMedia({
      topic: content.topic,
      realm: content.themeCategory,
      type: content.type,
      orientation: 'portrait', // 16:9 portrait (9:16 vertical for Reels)
      customQuery: content.creativeBrief,
    });

    // 2. Fetch matching royalty-free background audio from Freesound API
    const freesoundAudio = await fetchMatchingFreesoundAudio({
      topic: content.topic,
      realm: content.themeCategory,
      soundscape: content.soundscape,
    });

    // 3. Compose Reel with audio if video format
    let finalAssetUrl = pexelsMedia.url;
    if (isVideo && freesoundAudio?.audioUrl) {
      try {
        finalAssetUrl = await composeReelWithAudio({
          videoUrl: pexelsMedia.url,
          audioUrl: freesoundAudio.audioUrl,
        });
      } catch (composeErr) {
        console.warn('[Instagram Agent] Reel composition notice:', composeErr.message);
      }
    }

    // 4. Save media and audio attributes
    content.assetUrl = finalAssetUrl;
    content.assetSource = isVideo ? 'pexels_hd_video' : 'pexels_hd_photo';
    content.pexelsId = pexelsMedia.pexelsId;
    content.pexelsPhotographer = pexelsMedia.photographer;
    content.pexelsPhotographerUrl = pexelsMedia.photographerUrl;
    content.freesoundId = freesoundAudio.freesoundId;
    content.freesoundTitle = freesoundAudio.title;
    content.freesoundAuthor = freesoundAudio.author;
    content.audioUrl = freesoundAudio.audioUrl;
    content.audioDuration = freesoundAudio.duration;
    content.trendingAudioSuggestion = `🎵 Soundscape: "${freesoundAudio.title}" by ${freesoundAudio.author}`;
    content.mediaGenerationStatus = 'ready';
    content.status = 'ready';
    if (!content.scheduledFor) content.scheduledFor = new Date();
    await content.save();

    await logInstagramActivity(
      'media_generated',
      `Fetched HD 9:16 ${isVideo ? 'Video Reel' : 'Photo'} via Pexels API and matched background audio via Freesound API for ${content.type}: ${content.topic}`,
      { contentId: String(content._id), url: content.assetUrl, audioUrl: content.audioUrl }
    );
    return content;
  } catch (error) {
    content.mediaGenerationStatus = 'failed';
    content.mediaGenerationError = error.message.slice(0, 1800);
    await content.save();
    await logInstagramActivity('media_generation_failed', error.message, {
      contentId: String(content._id),
    });
    throw error;
  }
}

export async function generateContentDraft({ topic = '', type = 'reel', category = '' }) {
  const config = await getInstagramConfig();
  const isVideo = type === 'reel' || type === 'video' || (type === undefined && config.contentMode !== 'post');
  const effectiveType = isVideo ? 'reel' : 'post';
  const geminiKey = config.geminiApiKey || process.env.GEMINI_API_KEY;

  // 1. Fetch previously used fingerprints to guarantee 100% uniqueness (never repeats)
  const pastContents = await InstagramContent.find(
    {},
    { quoteFingerprint: 1, quote: 1, topic: 1 }
  ).sort({ createdAt: -1 }).limit(200).lean();

  const usedFingerprints = new Set(
    pastContents
      .map((p) => p.quoteFingerprint || getQuoteFingerprint(p.quote || p.topic))
      .filter(Boolean)
  );

  const recentlyUsedTopics = pastContents
    .map((p) => p.topic)
    .filter(Boolean)
    .slice(0, 30);

  // 2. Select Nature Realm category
  const targetCategory = category || "All Realms";

  // 3. Select base unique theme from nature library
  const selectedTheme = getUniqueNatureTheme(usedFingerprints, targetCategory);

  let selectedTopic = topic || selectedTheme.title;
  let caption = selectedTheme.caption;
  let themeCategory = selectedTheme.realm || targetCategory;
  let creativePrompt = selectedTheme.description || selectedTopic;
  let hashtags = selectedTheme.hashtags;
  let reelScript = isVideo ? selectedTheme.reelScript : '';
  let soundscape = selectedTheme.soundscape || 'Ethereal Ambient Nature Soundscape';

  // 4. Use Gemini Pro AI (if API key available) to dynamically generate brand new, unique Nature content
  if (geminiKey) {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const geminiPrompt = isVideo
        ? `You are the executive director for a viral 4K Nature & Earth Cinematography Instagram page.
Category / Realm: "${themeCategory}" (e.g. Celestial & Aurora, Mystic Waters, Ancient Forests, Blooming Wilds, Majestic Peaks, Frozen Wonders)
Topic Request: "${topic || selectedTopic}"
Format: "reel" (16:9 vertical video with matching background music)
Brand Voice: "Awe-inspiring, serene, calming, and deeply grounded in Earth's natural beauty"

CRITICAL REQUIREMENT: The topic and visual scene MUST be completely unique and NEVER duplicate any of these recently used scenes:
${JSON.stringify(recentlyUsedTopics, null, 2)}

Provide a brand new breathtaking nature scene with vivid camera motion, volumetric lighting, and matching atmospheric audio soundscape.

Return strict JSON with this exact schema:
{
  "topic": "Catchy, viral reel title (5-8 words)",
  "themeCategory": "${themeCategory}",
  "visualScene": "Detailed description of the 8K nature visual scene (lighting, fog, textures, composition)",
  "cameraMotion": "Cinematic camera movement (e.g. drone dive, upward tilt, tracking shot)",
  "soundscape": "Detailed descriptive acoustic background music & sound design based on the visual scene (e.g. gentle rain dripping from monstera leaves, soothing bamboo flute, resonant cello chords, calm alpine breeze)",
  "caption": "Viral, calming Instagram caption about this nature marvel with (1) Inspiring nature insight, (2) Deep breathing / mindful reset prompt, (3) Question CTA encouraging saves & comments",
  "hashtags": ["12-15 viral nature, travel, cinematography hashtags"],
  "imagePrompt": "nature scene search keywords",
  "reelScript": "Scene 1 (0-3s Hook): <visual & audio>\\nScene 2 (4-7s Wonder): <visual & audio>\\nScene 3 (8-10s Peace CTA): <visual & audio>\\nAudio Direction: <exact soundscape>"
}`
        : `You are the creative director for a viral 8K Nature & Landscape Photography Instagram page.
Category / Realm: "${themeCategory}" (e.g. Celestial & Aurora, Mystic Waters, Ancient Forests, Blooming Wilds, Majestic Peaks, Frozen Wonders)
Topic Request: "${topic || selectedTopic}"
Format: "post" (16:9 vertical 8K nature image with matching nature soundscape)
Brand Voice: "Breathtaking, serene, crystal-clear, and deeply grounded in Earth's natural beauty"

CRITICAL REQUIREMENT: The topic and visual scene MUST be completely unique and NEVER duplicate any of these recently used scenes:
${JSON.stringify(recentlyUsedTopics, null, 2)}

Provide a brand new breathtaking nature photograph description with natural lighting, golden hour hues, and a matching relaxing acoustic soundscape.

Return strict JSON with this exact schema:
{
  "topic": "Catchy, viral photo title (5-8 words)",
  "themeCategory": "${themeCategory}",
  "visualScene": "Detailed description of the 8K nature photo scene (lighting, fog, textures, composition)",
  "soundscape": "Detailed descriptive acoustic background music & sound design based on the visual scene (e.g. gentle rain dripping from monstera leaves, soothing bamboo flute, resonant cello chords, calm alpine breeze)",
  "caption": "Viral, inspiring Instagram caption about this nature marvel with (1) Inspiring nature insight, (2) Deep breathing / mindful reset prompt, (3) Question CTA encouraging saves & comments",
  "hashtags": ["12-15 viral nature, travel, photography hashtags"],
  "imagePrompt": "nature photo search keywords"
}`;

      let parsed = null;
      for (const mName of ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.5-flash']) {
        try {
          const model = genAI.getGenerativeModel({
            model: mName,
            generationConfig: { responseMimeType: 'application/json' },
          });
          const aiRes = await model.generateContent(geminiPrompt);
          parsed = JSON.parse(aiRes.response.text());
          if (parsed) break;
        } catch (_) {}
      }

      if (parsed?.topic) selectedTopic = parsed.topic;
      if (parsed?.caption) caption = parsed.caption;
      if (Array.isArray(parsed?.hashtags) && parsed.hashtags.length > 0) hashtags = parsed.hashtags;
      if (parsed?.imagePrompt) creativePrompt = parsed.imagePrompt;
      if (parsed?.reelScript) reelScript = parsed.reelScript;
      if (parsed?.themeCategory) themeCategory = parsed.themeCategory;
      if (parsed?.soundscape) soundscape = parsed.soundscape;
    } catch (geminiError) {
      console.warn('AI dynamic draft generation notice:', geminiError.message);
    }
  }

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
    trendingAudioSuggestion: soundscape ? `🎵 Soundscape: "${soundscape}"` : `🎵 Freesound Curated Audio for ${selectedTopic}`,
    createdBy: 'agent',
    mediaGenerationStatus: 'not_requested',
  });

  await logInstagramActivity(
    'content_drafted',
    `AI drafted daily 16:9 Nature ${isVideo ? 'Video Reel' : 'Image Post'} [${themeCategory}]: "${selectedTopic}"`,
    {
      contentId: String(content._id),
      category: themeCategory,
      topic: selectedTopic,
      type: effectiveType,
    }
  );

  if (process.env.AUTO_GENERATE_MEDIA !== 'false') {
    try {
      await generateMediaForContent(content);
    } catch (mediaErr) {
      console.warn('Auto media generation notice:', mediaErr.message);
    }
  }

  return content;
}

export async function publishContent(content) {
  const config = await getInstagramConfig();
  if (!config.running) throw new Error('Instagram agent is stopped. Start it before publishing.');
  if (!content.assetUrl) throw new Error('Attach a public image/video URL before publishing. Instagram requires a valid media asset.');
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;
  content.status = 'publishing';
  await content.save();

  try {
    const caption = `${content.caption || ''}\n\n${(content.hashtags || []).join(' ')}`.trim();
    const isVideoAsset = content.type === 'reel' || content.assetUrl.toLowerCase().endsWith('.mp4') || content.assetUrl.toLowerCase().includes('/video/upload/');

    let creationPayload;
    if (isVideoAsset) {
      // Direct Reel publishing from Gemini's video
      creationPayload = {
        media_type: 'REELS',
        video_url: content.assetUrl,
        caption,
        share_to_feed: 'true',
      };
    } else {
      // Direct 16:9 8K Image post from Gemini's visual
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

    // ── POST-PUBLISH STORAGE CLEANUP ──
    // Delete the heavy video file from Cloudinary and clear assetUrl from active queue
    // (The reel stays live on Instagram Reels permanently)
    if (content.assetUrl && content.assetUrl.includes('res.cloudinary.com')) {
      const publicId = getCloudinaryPublicId(content.assetUrl);
      if (publicId) {
        console.log(`[Cloudinary Cleanup] Deleting published video from Cloudinary (${publicId})...`);
        try {
          await cloudinary.uploader.destroy(publicId, { resource_type: isVideoAsset ? 'video' : 'image' });
          console.log(`[Cloudinary Cleanup] Video ${publicId} successfully deleted from Cloudinary.`);
        } catch (delErr) {
          console.warn(`[Cloudinary Cleanup] Notice: could not destroy ${publicId}:`, delErr.message);
        }
      }
    }

    content.assetUrl = ''; // Cleared so it's removed from active queue while preserved in publish history
    await content.save();

    await logInstagramActivity('content_published', `Published 16:9 ${isVideoAsset ? 'Reel' : 'Post'} to Instagram: ${content.topic}. Cleaned up Cloudinary storage.`, {
      contentId: String(content._id),
      mediaId: published.id || '',
    });
    return content;
  } catch (error) {
    content.status = 'failed';
    content.error = error.message;
    await content.save();
    await logInstagramActivity('publish_failed', `Could not publish reel with audio: ${error.message}`, {
      contentId: String(content._id),
    });
    throw error;
  }
}

export function getCloudinaryPublicId(url) {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
  return match ? match[1] : null;
}

export function verifyMetaSignature(rawBody, signature) {
  const secret = process.env.META_APP_SECRET;
  if (!secret || !signature) return false;
  const expected = `sha256=${crypto.createHmac('sha256', secret).update(rawBody).digest('hex')}`;
  const supplied = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return supplied.length === expectedBuffer.length && crypto.timingSafeEqual(supplied, expectedBuffer);
}

/**
 * Publishes due content adhering strictly to 1-post-per-day rate limit
 */
export async function publishDueContent() {
  const config = await getInstagramConfig();
  if (!config.running || !accountConfigured()) return;

  // STRICT 1 POST PER DAY RATE LIMIT
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const publishedToday = await InstagramContent.countDocuments({
    status: 'published',
    publishedAt: { $gte: startOfDay, $lte: endOfDay },
  });

  if (publishedToday >= 1) {
    // Already published today! Strictly only 1 post per day allowed.
    return;
  }

  const due = await InstagramContent.findOne({
    status: { $in: ['ready', 'scheduled'] },
    assetUrl: { $ne: '' },
    scheduledFor: { $lte: new Date() },
  }).sort({ scheduledFor: 1, createdAt: 1 });

  if (due) await publishContent(due);
}

/**
 * Calculates the next available calendar date for sequentially queued videos
 */
export async function getNextAvailableScheduleDate() {
  const config = await getInstagramConfig();
  const [hourStr, minStr] = (config.dailyPostTime || "12:00").split(":");
  const postHour = parseInt(hourStr, 10) || 12;
  const postMin = parseInt(minStr, 10) || 0;

  const now = new Date();
  const todayPostTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), postHour, postMin, 0, 0);

  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const publishedToday = await InstagramContent.countDocuments({
    status: "published",
    publishedAt: { $gte: startOfDay, $lte: endOfDay },
  });

  // Find the latest scheduled post in queue
  const latestScheduled = await InstagramContent.findOne({
    status: { $in: ["ready", "scheduled"] },
    assetUrl: { $ne: "" },
  }).sort({ scheduledFor: -1 });

  let nextDate = new Date(todayPostTime);

  if (latestScheduled && latestScheduled.scheduledFor) {
    const latestDate = new Date(latestScheduled.scheduledFor);
    nextDate = new Date(latestDate.getTime() + 24 * 60 * 60 * 1000);
    nextDate.setHours(postHour, postMin, 0, 0);
  } else if (publishedToday >= 1 || now.getTime() > todayPostTime.getTime()) {
    // If today's post already happened or time has passed, queue for tomorrow morning
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
    console.log(`[Admin Reel Upload] Uploading video file from disk (${filePath}) to Cloudinary...`);
    const uploaded = await cloudinary.uploader.upload(filePath, {
      folder: 'instagram-agent/admin-reels',
      resource_type: 'video',
    });
    assetUrl = uploaded.secure_url;
    try {
      fs.unlinkSync(filePath);
    } catch (_) {}
  } else if (fileBuffer) {
    console.log(`[Admin Reel Upload] Uploading admin video buffer (${fileBuffer.length} bytes) to Cloudinary...`);
    const uploaded = await uploadBuffer(fileBuffer, 'video');
    assetUrl = uploaded.secure_url;
  }

  if (!assetUrl) {
    throw new Error('A valid video file or public video URL is required to create an admin reel.');
  }

  // Find matching theme from 12 Nature Series
  const selectedTheme = getUniqueNatureTheme(new Set(), category);
  const selectedTopic = topic || selectedTheme.title || `${category} Reel`;

  let caption = customCaption || selectedTheme.caption || `🌿 ${category}: ${selectedTopic}\n\nExperience the calm and wonder of Earth's greatest marvels. Take a deep breath and reset.\n\n📌 Save this reel for daily peace!`;
  let hashtags = (Array.isArray(customHashtags) && customHashtags.length > 0)
    ? customHashtags
    : (selectedTheme.hashtags || ['#naturelovers', '#reelsinstagram', '#earthfocus', '#peacefulnature', '#8knature']);
  let soundscape = selectedTheme.soundscape || 'Matching Ambient Nature Soundscape';

  const config = await getInstagramConfig();
  const geminiKey = config.geminiApiKey || process.env.GEMINI_API_KEY;

  if (geminiKey && !customCaption) {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json' },
      });
      const prompt = `You are the lead content creator for an Instagram Reels page specializing in 4K Nature & Serenity.
Admin has provided a high-definition Reel video in ${aspectRatio === "9:16" ? "9:16 Vertical Portrait" : "16:9 Landscape"} format.
Selected 12-Series Realm: "${category}"
Topic/Title: "${selectedTopic}"

Generate:
1. "caption": An engaging, viral, serene Instagram Reels caption with (1) Inspiring hook, (2) Mindful breath reset, (3) Question CTA for comments.
2. "hashtags": An array of 12-15 high-reach hashtags for this specific realm.
3. "soundscape": Recommended audio direction.

Return strict JSON:
{
  "caption": "caption text",
  "hashtags": ["#tag1", "#tag2", ...],
  "soundscape": "soundscape description"
}`;
      const res = await model.generateContent(prompt);
      const parsed = JSON.parse(res.response.text());
      if (parsed.caption) caption = parsed.caption;
      if (Array.isArray(parsed.hashtags) && parsed.hashtags.length > 0) hashtags = parsed.hashtags;
      if (parsed.soundscape) soundscape = parsed.soundscape;
    } catch (_) {}
  }

  // Calculate sequential daily queue date
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
    `Admin queued ${aspectRatio} video reel for [${category}]: "${selectedTopic}" (Scheduled for ${scheduledDate.toLocaleDateString()})`,
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
