import crypto from 'crypto';
import fetch from 'node-fetch';
import InstagramAgentConfig from '../schema/InstagramAgentConfig.model.js';
import InstagramContent from '../schema/InstagramContent.model.js';
import InstagramActivity from '../schema/InstagramActivity.model.js';
import { cloudinary } from '../../../config/cloudinary.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NATURE_THEMES, getUniqueNatureTheme, getDailyNatureTheme } from './natureThemes.js';
import { MOTIVATIONAL_THEMES, getUniqueMotivationalTheme, getQuoteFingerprint, getDailyMotivationalTheme } from './motivationalThemes.js';
import { analyzeAudiencePreferences } from './growthOptimizer.js';
import { automateGeminiGeneration } from './geminiBrowserAutomator.service.js';

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
    config = await InstagramAgentConfig.create({ key: 'default' });
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

/* ═════════════════════════════════════════════════════════════
   ROYALTY-FREE MUSIC CATALOG & TRENDING AUDIO ENGINE
═════════════════════════════════════════════════════════════ */

const ROYALTY_FREE_AUDIO_LIBRARY = [
  {
    id: 'ultimate-dreams-theme',
    title: 'Ultimate Dreams Anthem',
    artist: 'Store Master Soundtrack',
    genre: 'Cinematic Motivation',
    duration: 142,
    audioUrl: 'https://res.cloudinary.com/dlsetxkjj/video/upload/v1788012256/instagram-agent/audio/ultimate_dreams_anthem.mp3',
  },
  {
    id: 'lofi-study-1',
    title: 'Chill Midnight Study Beats',
    artist: 'Lofi Dreamer (CC0)',
    genre: 'Lo-Fi Beats',
    duration: 32,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
  },
  {
    id: 'tech-ambient-2',
    title: 'Cyber Deep Focus Pulse',
    artist: 'Future Wave (Royalty Free)',
    genre: 'Tech Ambient',
    duration: 28,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=electronic-future-beats-117997.mp3',
  },
  {
    id: 'cinematic-inspire-3',
    title: 'Inspiring Cinematic Ascent',
    artist: 'Orchestra Modern (CC-BY)',
    genre: 'Cinematic Motivational',
    duration: 30,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=inspiring-cinematic-ambient-116199.mp3',
  },
  {
    id: 'modern-upbeat-4',
    title: 'Upbeat Creative Groove',
    artist: 'Studio Soundtrack (Royalty Free)',
    genre: 'Modern Indie Upbeat',
    duration: 25,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_8bb5e4688a.mp3?filename=tropical-summer-music-112842.mp3',
  },
];

export function getAvailableMusicTracks() {
  return ROYALTY_FREE_AUDIO_LIBRARY;
}

export function getTrendingAudioRecommendation(topic, niche = 'Education & Tech') {
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
  if (!content.caption.includes('🎵')) {
    content.caption = `${content.caption}\n\n${content.trendingAudioSuggestion}`;
  }

  await content.save();
  await logInstagramActivity(
    'music_attached',
    `Attached free royalty-free music "${track.title}" to ${content.type}: ${content.topic}`,
    { contentId: String(content._id), trackId: track.id }
  );
  return content;
}

export async function generateMediaForContent(content) {
  content.mediaGenerationStatus = 'generating';
  content.mediaGenerationError = '';
  await content.save();

  try {
    // Google Gemini browser automation is the sole media provider.
    const promptText = content.creativeBrief || content.topic;
    const mediaResult = await automateGeminiGeneration(
      promptText,
      content._id,
      content.type === 'reel'
    );

    if (!mediaResult?.url) {
      throw new Error(
        mediaResult?.session?.error ||
          'Google Gemini finished without an image/video file. No fallback generator was used.'
      );
    }
    
    content.assetUrl = mediaResult.url;
    content.assetSource = 'gemini_browser_automated';
    content.mediaGenerationStatus = 'ready';
    content.status = 'ready';
    if (!content.scheduledFor) content.scheduledFor = new Date();
    await content.save();

    await logInstagramActivity(
      'media_generated',
      `Generated media with Google Gemini for ${content.type}: ${content.topic}`,
      { contentId: String(content._id), url: content.assetUrl }
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
  const safeType = 'reel'; // Default to animated video reel
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
  let creativePrompt = selectedTheme.prompt;
  let hashtags = selectedTheme.hashtags;
  let themeCategory = selectedTheme.realm || targetCategory;
  let reelScript = selectedTheme.reelScript;
  let soundscape = selectedTheme.soundscape;

  // 4. Use Gemini Pro AI to dynamically generate brand new, unique Nature Cinematography Reels
  if (geminiKey) {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const geminiPrompt = `You are the executive director for a viral 4K Nature & Earth Cinematography Instagram page.
Category / Realm: "${themeCategory}" (e.g. Celestial & Aurora, Mystic Waters, Ancient Forests, Blooming Wilds, Majestic Peaks, Frozen Wonders)
Topic Request: "${topic || selectedTopic}"
Format: "reel" (9:16 vertical animated cinematic video)
Brand Voice: "Awe-inspiring, serene, calming, and deeply grounded in Earth's natural beauty"

CRITICAL REQUIREMENT: The topic and visual scene MUST be completely unique and NEVER duplicate any of these recently used scenes:
${JSON.stringify(recentlyUsedTopics, null, 2)}

Provide a brand new breathtaking nature scene with vivid camera motion, volumetric lighting, and matching atmospheric audio soundscape.

Return strict JSON with this exact schema:
{
  "topic": "Catchy, viral reel title (5-8 words)",
  "themeCategory": "${themeCategory}",
  "visualScene": "Detailed description of the 8K nature visual scene",
  "cameraMotion": "Cinematic camera movement (e.g. drone dive, upward tilt, tracking shot)",
  "soundscape": "Matching background audio & sound design (e.g. ethereal ambient forest flute, soothing cascading waterfall resonance, gentle binaural wind chimes)",
  "caption": "Viral, calming Instagram caption about this nature marvel with (1) Inspiring nature insight, (2) Deep breathing / mindful reset prompt, (3) Question CTA encouraging saves & comments",
  "hashtags": ["12-15 viral nature, travel, cinematography hashtags"],
  "imagePrompt": "create animated video on <vivid scene details> in 9:16 vertical format",
  "reelScript": "Scene 1 (0-3s Hook): <visual & audio>\\nScene 2 (4-7s Wonder): <visual & audio>\\nScene 3 (8-10s Peace CTA): <visual & audio>\\nAudio Direction: <exact soundscape>"
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
      console.warn('Gemini dynamic draft generation notice:', geminiError.message);
    }
  }

  const topicFp = getQuoteFingerprint(selectedTopic);

  const content = await InstagramContent.create({
    type: 'reel',
    topic: selectedTopic,
    quote: selectedTopic,
    speaker: themeCategory,
    quoteFingerprint: topicFp,
    themeCategory: themeCategory,
    caption: caption,
    hashtags: hashtags,
    creativeBrief: creativePrompt,
    reelScript: reelScript,
    audioTrack: {
      id: `nature_${Date.now()}`,
      title: soundscape || 'Serene Nature Soundscape',
      artist: 'Ambient Earth',
      genre: 'Nature Relaxation',
      durationSeconds: 15,
      isRoyaltyFree: true,
      audioUrl: '',
    },
    trendingAudioSuggestion: `🎵 Soundscape: "${soundscape || 'Serene Nature Soundscape'}"`,
    createdBy: 'agent',
    mediaGenerationStatus: 'not_requested',
  });

  await logInstagramActivity(
    'content_drafted',
    `AI drafted daily 8K Nature Reel [${themeCategory}]: "${selectedTopic}" with soundscape: ${soundscape}`,
    {
      contentId: String(content._id),
      category: themeCategory,
      topic: selectedTopic,
      soundscape: soundscape,
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
    const creationPayload =
      content.type === 'reel'
        ? { media_type: 'REELS', video_url: content.assetUrl, caption, share_to_feed: 'true' }
        : { image_url: content.assetUrl, caption };
    const container = await graph(`/${accountId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creationPayload),
    });
    const published = await graph(`/${accountId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: container.id }),
    });

    content.status = 'published';
    content.instagramMediaId = published.id || '';
    content.publishedAt = new Date();
    content.error = '';
    await content.save();
    await logInstagramActivity('content_published', `Published ${content.type}: ${content.topic}`, {
      contentId: String(content._id),
      mediaId: published.id || '',
    });
    return content;
  } catch (error) {
    content.status = 'failed';
    content.error = error.message;
    await content.save();
    await logInstagramActivity('publish_failed', `Could not publish ${content.type}: ${error.message}`, {
      contentId: String(content._id),
    });
    throw error;
  }
}

export function verifyMetaSignature(rawBody, signature) {
  const secret = process.env.META_APP_SECRET;
  if (!secret || !signature) return false;
  const expected = `sha256=${crypto.createHmac('sha256', secret).update(rawBody).digest('hex')}`;
  const supplied = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return supplied.length === expectedBuffer.length && crypto.timingSafeEqual(supplied, expectedBuffer);
}

export async function publishDueContent() {
  const config = await getInstagramConfig();
  if (!config.running || !accountConfigured()) return;
  const due = await InstagramContent.findOne({
    status: { $in: ['ready', 'scheduled'] },
    assetUrl: { $ne: '' },
    scheduledFor: { $lte: new Date() },
  }).sort({ scheduledFor: 1 });
  if (due) await publishContent(due);
}
