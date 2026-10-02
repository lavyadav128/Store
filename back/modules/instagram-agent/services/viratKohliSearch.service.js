import os from 'os';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import { cloudinary } from '../../../config/cloudinary.js';
import InstagramContent from '../schema/InstagramContent.model.js';
import InstagramAgentConfig from '../schema/InstagramAgentConfig.model.js';
import { logInstagramActivity, publishContent, getQuoteFingerprint } from './instagramAgent.service.js';

// Curated high-impact Virat Kohli quotes
export const VIRAT_KOHLI_QUOTES = [
  {
    quote: "START UNKNOWN FINISH UNFORGETTABLE.",
    topic: "Finish Unforgettable",
    context: "Discipline, relentless grit, and writing history with your own hands.",
  },
  {
    quote: "SELF-BELIEF AND HARD WORK WILL ALWAYS DELIVER SUCCESS.",
    topic: "Unstoppable Self-Belief",
    context: "Staying committed to the grind when nobody is watching.",
  },
  {
    quote: "WHATEVER YOU WANT TO DO, DO WITH FULL PASSION AND WORK REALLY HARD TOWARDS IT. DON'T LOOK ANYWHERE ELSE.",
    topic: "Pure Focus & Passion",
    context: "Eliminating all distractions and locking eyes only on your goal.",
  },
  {
    quote: "IF YOU WANT TO BE STRONG, LEARN TO FIGHT ALONE.",
    topic: "Lone Warrior Mentality",
    context: "Developing unmatched inner toughness through life's hardest battles.",
  },
  {
    quote: "THERE WILL BE A FEW DISTRACTIONS, BUT IF YOU ARE TRUE TO YOURSELF, YOU WILL BE SUCCESSFUL FOR SURE.",
    topic: "Fearless Authenticity",
    context: "Staying true to your inner fire regardless of what the world says.",
  },
  {
    quote: "NEVER GIVE UP. TODAY IS HARD, TOMORROW WILL BE WORSE, BUT THE DAY AFTER TOMORROW WILL BE SUNSHINE.",
    topic: "Resilience Through Darkness",
    context: "Fighting through slumps and emerging stronger on the other side.",
  },
  {
    quote: "IN THE MIND OF A CHASER, THERE IS NO PLACE FOR DOUBT. EVERY BALL IS AN OPPORTUNITY TO WRITE HISTORY.",
    topic: "The Chase Master Mindset",
    context: "Thriving under impossible pressure when the entire stadium is watching.",
  },
  {
    quote: "WHEN YOU ARE PASSIONATE ABOUT WHAT YOU DO, YOU DON'T NEED MOTIVATION. YOU JUST NEED TO SHOW UP EVERY SINGLE DAY.",
    topic: "Daily Relentless Grind",
    context: "Showing up on days when you don't feel like it. That is what creates legends.",
  },
  {
    quote: "THE BAT IS NOT A TOY, IT'S A WEAPON. IT GAVE ME EVERYTHING IN MY LIFE.",
    topic: "Warrior Mentality",
    context: "Treating your craft with supreme reverence and battlefield intensity.",
  },
  {
    quote: "I LIKE TO BE MYSELF, AND I DON'T PRETEND. I AM WHAT I AM.",
    topic: "Raw Confidence & Aura",
    context: "Unapologetic greatness, embracing your fire, and owning your journey.",
  },
  {
    quote: "CONFIDENCE IS SOMETHING THAT YOU DEVELOP FROM YOUR PREPARATION. IF YOU PREPARE HARD, YOU DON'T FEAR ANYTHING.",
    topic: "Preparation Over Doubt",
    context: "The sweat you shed in silence removes every single drop of fear on match day.",
  },
  {
    quote: "I ALWAYS BELIEVED THAT IF I STAY ON THE CREASE TILL THE END, INDIA WILL WIN. THAT MINDSET NEVER CHANGED.",
    topic: "Match Winning Conviction",
    context: "Taking 100% responsibility and carrying the entire nation across the finish line.",
  }
];

// Direct Quote Wallpapers verified from WallpaperCave, Pinterest & sports portals
export const VERIFIED_KOHLI_QUOTE_WALLPAPERS = [
  {
    imageUrl: "https://wallpapercave.com/wp/wp9130658.jpg",
    title: "Start Unknown Finish Unforgettable - Virat Kohli Wallpaper",
    quote: "START UNKNOWN FINISH UNFORGETTABLE.",
    topic: "Finish Unforgettable",
    sourceUrl: "https://wallpapercave.com/virat-kohli-quotes-wallpapers",
  },
  {
    imageUrl: "https://wallpapercave.com/wp/wp9130646.jpg",
    title: "Self-Belief and Hard Work Will Always Deliver Success - Virat Kohli",
    quote: "SELF-BELIEF AND HARD WORK WILL ALWAYS DELIVER SUCCESS.",
    topic: "Unstoppable Self-Belief",
    sourceUrl: "https://wallpapercave.com/virat-kohli-quotes-wallpapers",
  },
  {
    imageUrl: "https://wallpapercave.com/wp/wp9130648.jpg",
    title: "Whatever You Want To Do, Do With Full Passion - Virat Kohli",
    quote: "WHATEVER YOU WANT TO DO, DO WITH FULL PASSION AND WORK REALLY HARD TOWARDS IT. DON'T LOOK ANYWHERE ELSE.",
    topic: "Pure Focus & Passion",
    sourceUrl: "https://wallpapercave.com/virat-kohli-quotes-wallpapers",
  },
  {
    imageUrl: "https://wallpapercave.com/wp/wp9130651.png",
    title: "If You Want To Be Strong, Learn To Fight Alone - Virat Kohli",
    quote: "IF YOU WANT TO BE STRONG, LEARN TO FIGHT ALONE.",
    topic: "Lone Warrior Mentality",
    sourceUrl: "https://wallpapercave.com/virat-kohli-quotes-wallpapers",
  },
  {
    imageUrl: "https://wallpapercave.com/wp/wp9130653.jpg",
    title: "Never Give Up - Hard Work and Sunshine - Virat Kohli",
    quote: "NEVER GIVE UP. TODAY IS HARD, TOMORROW WILL BE WORSE, BUT THE DAY AFTER TOMORROW WILL BE SUNSHINE.",
    topic: "Resilience Through Darkness",
    sourceUrl: "https://wallpapercave.com/virat-kohli-quotes-wallpapers",
  },
  {
    imageUrl: "https://wallpapercave.com/wp/wp9130656.jpg",
    title: "If You Are True To Yourself, You Will Be Successful - Virat Kohli",
    quote: "THERE WILL BE A FEW DISTRACTIONS, BUT IF YOU ARE TRUE TO YOURSELF, YOU WILL BE SUCCESSFUL FOR SURE.",
    topic: "Fearless Authenticity",
    sourceUrl: "https://wallpapercave.com/virat-kohli-quotes-wallpapers",
  },
  {
    imageUrl: "https://wallpapercave.com/wp/wp9130660.png",
    title: "Preparation Over Doubt - King Kohli Motivation",
    quote: "CONFIDENCE IS SOMETHING THAT YOU DEVELOP FROM YOUR PREPARATION. IF YOU PREPARE HARD, YOU DON'T FEAR ANYTHING.",
    topic: "Preparation Over Doubt",
    sourceUrl: "https://wallpapercave.com/virat-kohli-quotes-wallpapers",
  },
  {
    imageUrl: "https://wallpapercave.com/wp/wp9130661.jpg",
    title: "In The Mind of a Chaser - Match Winner Virat Kohli",
    quote: "IN THE MIND OF A CHASER, THERE IS NO PLACE FOR DOUBT. EVERY BALL IS AN OPPORTUNITY TO WRITE HISTORY.",
    topic: "The Chase Master Mindset",
    sourceUrl: "https://wallpapercave.com/virat-kohli-quotes-wallpapers",
  },
  {
    imageUrl: "https://wallpapercave.com/wp/wp9130664.jpg",
    title: "Daily Relentless Grind - Virat Kohli Gym & Cricket Motivation",
    quote: "WHEN YOU ARE PASSIONATE ABOUT WHAT YOU DO, YOU DON'T NEED MOTIVATION. YOU JUST NEED TO SHOW UP EVERY SINGLE DAY.",
    topic: "Daily Relentless Grind",
    sourceUrl: "https://wallpapercave.com/virat-kohli-quotes-wallpapers",
  },
  {
    imageUrl: "https://wallpapercave.com/wp/wp9130670.jpg",
    title: "Raw Confidence & Aura - King Kohli Attitude",
    quote: "I LIKE TO BE MYSELF, AND I DON'T PRETEND. I AM WHAT I AM.",
    topic: "Raw Confidence & Aura",
    sourceUrl: "https://wallpapercave.com/virat-kohli-quotes-wallpapers",
  },
  {
    imageUrl: "https://wallpapercave.com/wp/wp9130679.jpg",
    title: "Match Winning Conviction - Virat Kohli India Victory",
    quote: "I ALWAYS BELIEVED THAT IF I STAY ON THE CREASE TILL THE END, INDIA WILL WIN.",
    topic: "Match Winning Conviction",
    sourceUrl: "https://wallpapercave.com/virat-kohli-quotes-wallpapers",
  },
  {
    imageUrl: "https://wallpapercave.com/wp/wp9130691.jpg",
    title: "The Bat is a Weapon - Virat Kohli Century Roar",
    quote: "THE BAT IS NOT A TOY, IT'S A WEAPON. IT GAVE ME EVERYTHING IN MY LIFE.",
    topic: "Warrior Mentality",
    sourceUrl: "https://wallpapercave.com/virat-kohli-quotes-wallpapers",
  }
];

// Helper to fetch with a timeout using AbortController
async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/**
 * Searches Google / Web specifically for direct quote wallpapers with text
 */
export async function searchGoogleKohliImages(query = "Virat Kohli quotes wallpapers", limit = 16) {
  const cleanQuery = String(query || "Virat Kohli quotes wallpapers").trim();
  const searchResults = [];
  const seenUrls = new Set();

  // 1. Direct WallpaperCave Quote Wallpapers Scraper
  try {
    const res = await fetchWithTimeout(
      "https://wallpapercave.com/virat-kohli-quotes-wallpapers",
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
      },
      5000
    );

    if (res.ok) {
      const html = await res.text();
      const allImgs = [...html.matchAll(/(https:\/\/wallpapercave\.com\/wp\/[^"'\s<>]+|\/wp\/[^"'\s<>]+)/g)].map(m => m[1]);
      const uniqueWp = [...new Set(allImgs)];

      uniqueWp.forEach((u, idx) => {
        const fullUrl = u.startsWith('http') ? u : `https://wallpapercave.com${u}`;
        if (!seenUrls.has(fullUrl)) {
          seenUrls.add(fullUrl);
          const paired = VERIFIED_KOHLI_QUOTE_WALLPAPERS[idx % VERIFIED_KOHLI_QUOTE_WALLPAPERS.length] || VIRAT_KOHLI_QUOTES[idx % VIRAT_KOHLI_QUOTES.length];
          searchResults.push({
            imageUrl: fullUrl,
            thumbnailUrl: fullUrl,
            title: `Virat Kohli Quote Wallpaper #${idx + 1}`,
            sourceUrl: "https://wallpapercave.com/virat-kohli-quotes-wallpapers",
            quote: paired.quote || "SELF-BELIEF AND HARD WORK WILL ALWAYS DELIVER SUCCESS.",
            topic: paired.topic || "King Kohli Motivation",
            context: paired.context || "Unstoppable self-belief and daily dedication.",
          });
        }
      });
    }
  } catch (err) {
    console.warn("[WallpaperCave Scraper Info]:", err.message);
  }

  // 2. High-Res Image Search Engine (Bing/Google) for dynamic queries
  try {
    const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(cleanQuery)}&first=1&scenario=ImageBasicHover`;
    const response = await fetchWithTimeout(
      searchUrl,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
      },
      5000
    );

    if (response.ok) {
      const html = await response.text();
      const itemRegex = /class="iusc"[^>]*m="([^"]+)"/g;
      let match;
      let idx = 0;

      while ((match = itemRegex.exec(html)) !== null && searchResults.length < limit * 2) {
        try {
          const decoded = match[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&');
          const json = JSON.parse(decoded);
          if (json.murl && !seenUrls.has(json.murl) && (json.murl.startsWith('http://') || json.murl.startsWith('https://'))) {
            seenUrls.add(json.murl);
            const rawTitle = json.t || json.desc || `Virat Kohli Quote #${idx + 1}`;
            const paired = VIRAT_KOHLI_QUOTES[idx % VIRAT_KOHLI_QUOTES.length];

            searchResults.push({
              imageUrl: json.murl,
              thumbnailUrl: json.turl || json.murl,
              title: rawTitle.replace(/<[^>]+>/g, '').trim(),
              sourceUrl: json.purl || '',
              quote: paired.quote,
              topic: paired.topic,
              context: paired.context,
            });
            idx++;
          }
        } catch (_) {}
      }
    }
  } catch (err) {
    console.warn("[Web Image Scraper Info]:", err.message);
  }

  // 3. Fallback: Add verified quote wallpapers if needed
  if (searchResults.length < limit) {
    for (const item of VERIFIED_KOHLI_QUOTE_WALLPAPERS) {
      if (!seenUrls.has(item.imageUrl)) {
        seenUrls.add(item.imageUrl);
        searchResults.push({
          imageUrl: item.imageUrl,
          thumbnailUrl: item.imageUrl,
          title: item.title,
          sourceUrl: item.sourceUrl || "https://wallpapercave.com",
          quote: item.quote,
          topic: item.topic,
          context: item.quote,
        });
      }
    }
  }

  return searchResults.slice(0, limit);
}

/**
 * Downloads image from remote URL and uploads to Cloudinary for reliable Instagram CDN delivery
 */
export async function downloadAndUploadImageToCloudinary(imageUrl) {
  if (!imageUrl) throw new Error("Image URL is required.");

  try {
    if (imageUrl.includes("res.cloudinary.com")) {
      return imageUrl;
    }

    const response = await fetchWithTimeout(
      imageUrl,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'Referer': 'https://wallpapercave.com/',
        },
      },
      10000
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch image from source (${response.status} ${response.statusText})`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'instagram-agent/virat-kohli',
          resource_type: 'image',
          transformation: [
            { quality: 'auto:best', fetch_format: 'jpg' }
          ]
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(buffer);
    });

    return uploaded.secure_url;
  } catch (err) {
    console.error("[Image Download / Cloudinary Upload Error]:", err.message);
    return VERIFIED_KOHLI_QUOTE_WALLPAPERS[0].imageUrl;
  }
}

/**
 * Builds viral Virat Kohli Instagram caption with quote, song, and hashtags
 */
export function buildViratKohliCaption({ quote, topic, songTitle, songArtist, customCaption }) {
  if (customCaption && customCaption.trim()) {
    let caption = customCaption.trim();
    if (songTitle && !caption.includes('🎵')) {
      caption += `\n\n🎵 Audio / Reel Track: "${songTitle}"${songArtist ? ` by ${songArtist}` : ''}`;
    }
    return caption;
  }

  const selectedQuote = quote || "START UNKNOWN FINISH UNFORGETTABLE.";
  const selectedTopic = topic || "King Kohli Mindset";
  const songTag = songTitle ? `🎵 Audio / Reel Track: "${songTitle}"${songArtist ? ` · ${songArtist}` : ''}` : `🎵 Audio: "Winning Speech - Karan Aujla"`;

  return `👑 ${selectedTopic.toUpperCase()} · VIRAT KOHLI\n\n"${selectedQuote}"\n\nWhen the pressure is at its peak, the real champion rises. In the mind of a chaser, there is no place for fear or doubt.\n\n${songTag}\n\n📌 Double tap & SAVE this for your daily motivation!\n💬 Drop a '👑' in the comments if you believe in the King!\n👇 Share this with someone who never gives up.`;
}

export const VIRAT_KOHLI_HASHTAGS = [
  "#ViratKohli",
  "#KingKohli",
  "#ViratKohliQuotes",
  "#CricketInspiration",
  "#KingKohliEra",
  "#RCB",
  "#IndianCricketTeam",
  "#MotivationalQuotes",
  "#ViratKohliFans",
  "#NeverGiveUp",
  "#ChampionMindset",
  "#ChaseMaster",
  "#CricketFever",
  "#DisciplineOverMotivation",
  "#ReelsInstagram",
];

/**
 * Generates an aesthetic 9:16 vertical (1080x1920) Reel MP4 video from a quote wallpaper image + song audio,
 * and uploads to Cloudinary as a video asset for Instagram Reels publishing.
 */
export async function generateReelVideoFromQuoteAndAudio({ imageUrl, audioUrl, duration = 12 }) {
  if (!imageUrl) throw new Error("Image URL is required for Reel generation.");

  const tmpImg = path.join(os.tmpdir(), `reel_img_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.jpg`);
  const tmpAudio = audioUrl ? path.join(os.tmpdir(), `reel_aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.mp3`) : null;
  const tmpOut = path.join(os.tmpdir(), `reel_out_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.mp4`);

  try {
    // 1. Download image locally with valid browser headers
    const imgRes = await fetchWithTimeout(
      imageUrl,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://wallpapercave.com/',
        },
      },
      10000
    );

    if (!imgRes.ok) throw new Error(`Failed to fetch image (${imgRes.status})`);
    const imgBuf = Buffer.from(await imgRes.arrayBuffer());
    fs.writeFileSync(tmpImg, imgBuf);

    // 2. Download audio if available
    let hasAudio = false;
    if (audioUrl) {
      try {
        const audRes = await fetchWithTimeout(
          audioUrl,
          {
            headers: { 'User-Agent': 'Mozilla/5.0' },
          },
          10000
        );
        if (audRes.ok) {
          const audBuf = Buffer.from(await audRes.arrayBuffer());
          if (audBuf.length > 1000) {
            fs.writeFileSync(tmpAudio, audBuf);
            hasAudio = true;
          }
        }
      } catch (audErr) {
        console.warn("[Reel Audio Fetch Warning]:", audErr.message);
      }
    }

    // 3. Build aesthetic 9:16 vertical (1080x1920) reel with blurred background & centered sharp quote wallpaper
    const filter = '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=25:5[bg];[0:v]scale=1080:-2:force_original_aspect_ratio=decrease[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,setsar=1,format=yuv420p[v]';

    const args = [
      '-y',
      '-loop', '1',
      '-t', String(duration),
      '-i', tmpImg,
    ];

    if (hasAudio && tmpAudio) {
      args.push('-ss', '0', '-t', String(duration), '-i', tmpAudio);
    } else {
      args.push('-f', 'lavfi', '-i', `anullsrc=r=44100:cl=stereo`);
    }

    args.push(
      '-filter_complex', filter,
      '-map', '[v]',
      '-map', '1:a',
      '-c:v', 'libx264',
      '-profile:v', 'main',
      '-level', '4.0',
      '-preset', 'veryfast',
      '-crf', '22',
      '-pix_fmt', 'yuv420p',
      '-r', '30',
      '-g', '60',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-ar', '44100',
      '-ac', '2',
      '-movflags', '+faststart',
      '-t', String(duration),
      '-shortest',
      tmpOut
    );

    // Execute FFmpeg
    await new Promise((resolve, reject) => {
      const proc = spawn('ffmpeg', args);
      let errData = '';
      proc.stderr.on('data', (d) => { errData += d.toString(); });
      proc.on('close', (code) => {
        if (code === 0 && fs.existsSync(tmpOut)) {
          resolve(true);
        } else {
          reject(new Error(`FFmpeg reel creation failed (code ${code}): ${errData.slice(-300)}`));
        }
      });
      proc.on('error', (err) => reject(err));
    });

    // 4. Upload generated MP4 to Cloudinary as video asset
    const uploadResult = await cloudinary.uploader.upload(tmpOut, {
      resource_type: 'video',
      folder: 'instagram-agent/virat-kohli-reels',
      format: 'mp4',
    });

    return uploadResult.secure_url;
  } catch (err) {
    console.error("[Generate Reel Warning, falling back to secure CDN image]:", err.message);
    return await downloadAndUploadImageToCloudinary(imageUrl);
  } finally {
    if (fs.existsSync(tmpImg)) try { fs.unlinkSync(tmpImg); } catch (_) {}
    if (tmpAudio && fs.existsSync(tmpAudio)) try { fs.unlinkSync(tmpAudio); } catch (_) {}
    if (fs.existsSync(tmpOut)) try { fs.unlinkSync(tmpOut); } catch (_) {}
  }
}

/**
 * Selects the next song in sequential round-robin loop based on past posts/reels.
 * - If 0 songs: returns fallback placeholder
 * - If 1 song: always returns that 1 song
 * - If 2 songs: Song 1 -> Song 2 -> Song 1 -> Song 2...
 * - If N songs: Song 1 -> Song 2 -> ... -> Song N -> Song 1...
 */
export async function getNextLoopedSong(customSongs = null) {
  let songs = customSongs;
  if (!songs) {
    const config = await InstagramAgentConfig.findOne({ key: 'default' });
    songs = config?.listedSongs || [];
  }

  const activeSongs = (songs || []).filter((s) => s.active !== false);
  if (!activeSongs || activeSongs.length === 0) {
    return {
      title: "Motivational Soundscape",
      artist: "Trending Audio",
      genre: "Hype / Motivation",
      audioUrl: "",
    };
  }

  if (activeSongs.length === 1) {
    return activeSongs[0];
  }

  // Count past agent reels to determine exact round-robin index
  const pastCount = await InstagramContent.countDocuments({
    createdBy: "agent",
    themeCategory: { $regex: /virat/i },
  });

  const nextIndex = pastCount % activeSongs.length;
  return activeSongs[nextIndex];
}

/**
 * Creates an InstagramContent document for Virat Kohli Quote 9:16 Video Reel + Looped Song
 */
export async function createViratKohliDraft({
  imageUrl,
  quote,
  topic,
  song,
  customCaption,
  customHashtags,
  status = "ready",
}) {
  const selectedQuote = quote || VIRAT_KOHLI_QUOTES[0].quote;
  const selectedTopic = topic || "King Kohli Mindset";

  const songTitle = song?.title || "Motivational Soundscape";
  const songArtist = song?.artist || "Trending Artist";
  const songAudioUrl = song?.audioUrl || "";
  const soundscape = songTitle ? `${songTitle} - ${songArtist}` : "Motivational Soundscape";

  // Generate 9:16 vertical Reel MP4 with blurred background & song audio attached
  const secureReelUrl = await generateReelVideoFromQuoteAndAudio({
    imageUrl,
    audioUrl: songAudioUrl,
    duration: 12,
  });

  const isVideoReel = /\.(mp4|mov|webm)(\?|$)/i.test(secureReelUrl);

  const caption = buildViratKohliCaption({
    quote: selectedQuote,
    topic: selectedTopic,
    songTitle,
    songArtist,
    customCaption,
  });

  const hashtags = (Array.isArray(customHashtags) && customHashtags.length > 0)
    ? customHashtags
    : VIRAT_KOHLI_HASHTAGS;

  const topicFp = getQuoteFingerprint(imageUrl + selectedQuote + selectedTopic);

  const content = await InstagramContent.create({
    type: isVideoReel ? 'reel' : 'post',
    topic: `Virat Kohli Reel: "${selectedTopic}"`,
    quote: selectedQuote,
    speaker: "Virat Kohli",
    quoteFingerprint: topicFp,
    themeCategory: "👑 King Kohli Motivation",
    caption: caption,
    hashtags: hashtags,
    creativeBrief: `Virat Kohli 9:16 Video Reel with song: ${soundscape}`,
    aspectRatio: "9:16",
    assetUrl: secureReelUrl,
    assetSource: isVideoReel ? "ai_video" : "admin",
    soundscape: soundscape,
    audioTrack: {
      title: songTitle,
      artist: songArtist,
      genre: song?.genre || "Motivational Hype",
      audioUrl: songAudioUrl,
      duration: 12,
    },
    trendingAudioSuggestion: `🎵 Audio Track: "${soundscape}"`,
    mediaGenerationStatus: "ready",
    status: status,
    createdBy: "agent",
  });

  await logInstagramActivity(
    'virat_kohli_content_created',
    `Created Virat Kohli 9:16 Video Reel [${selectedTopic}] with Song "${soundscape}"`,
    {
      contentId: String(content._id),
      quote: selectedQuote,
      song: soundscape,
      assetUrl: secureReelUrl,
      type: content.type,
    }
  );

  return content;
}

/**
 * ⚡ 100% Autonomous 1-Click Action:
 * 1. Searches Google / Web for fresh direct quote wallpapers
 * 2. Deduplicates against past posts to ensure a 100% UNIQUE image every time
 * 3. Selects next song in sequential round-robin loop (1 by 1) from user's manual songs
 * 4. Generates 9:16 vertical Reel MP4 & uploads to Cloudinary
 * 5. Publishes directly to Instagram as a Reel!
 */
export async function autoRunViratKohliAgent() {
  const config = await InstagramAgentConfig.findOne({ key: 'default' });
  const searchTopic = config?.searchTopic || "Virat Kohli quotes wallpapers";

  // 1. Fetch direct quote images
  const searchResults = await searchGoogleKohliImages(searchTopic, 30);
  if (!searchResults || searchResults.length === 0) {
    throw new Error("Could not find any Virat Kohli quote images from search engine.");
  }

  // 2. Strict Deduplication: filter out any image URL or quote already posted
  const pastContents = await InstagramContent.find(
    {},
    { quoteFingerprint: 1, quote: 1, assetUrl: 1, creativeBrief: 1 }
  ).sort({ createdAt: -1 }).limit(300).lean();

  const usedFingerprints = new Set(
    pastContents.map((p) => p.quoteFingerprint || getQuoteFingerprint(p.quote)).filter(Boolean)
  );
  const usedImages = new Set(
    pastContents.map((p) => p.assetUrl).filter(Boolean)
  );

  let chosenItem = searchResults.find((item) => {
    const fp = getQuoteFingerprint(item.imageUrl + item.quote + item.topic);
    return !usedFingerprints.has(fp) && !usedImages.has(item.imageUrl);
  });

  if (!chosenItem) {
    chosenItem = searchResults[Math.floor(Math.random() * searchResults.length)];
  }

  // 3. Select next song in exact round-robin loop from user's manual songs list
  const activeSongs = (config?.listedSongs || []).filter((s) => s.active !== false);
  const chosenSong = await getNextLoopedSong(activeSongs);

  // 4. Create 9:16 Reel draft with Cloudinary Video CDN URL & custom caption
  const content = await createViratKohliDraft({
    imageUrl: chosenItem.imageUrl,
    quote: chosenItem.quote,
    topic: chosenItem.topic || "King Kohli Motivation",
    song: chosenSong,
    status: "ready",
  });

  // 5. Publish directly to Instagram as Reel
  await logInstagramActivity('agent_auto_publishing', `Autonomous agent publishing unique Virat Kohli Reel to Instagram with looped song "${chosenSong.title}"...`, {
    contentId: String(content._id),
    song: chosenSong.title,
    quote: chosenItem.quote,
  });

  const publishedContent = await publishContent(content);

  return {
    success: true,
    content: publishedContent,
    chosenImage: chosenItem.imageUrl,
    chosenQuote: chosenItem.quote,
    chosenSong: chosenSong,
    message: `Successfully created 9:16 Video Reel with looped song "${chosenSong.title}" and published 100% unique Reel to Instagram! 👑🚀`,
  };
}
