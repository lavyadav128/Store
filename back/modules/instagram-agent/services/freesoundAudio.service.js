// back/modules/instagram-agent/services/freesoundAudio.service.js
import fetch from "node-fetch";
import { cloudinary } from "../../../config/cloudinary.js";
import InstagramAgentConfig from "../schema/InstagramAgentConfig.model.js";
import InstagramContent from "../schema/InstagramContent.model.js";

// Curated royalty-free fallback soundscapes when offline
const FALLBACK_SOUNDSCAPES = [
  {
    title: "Morning Alpine Birds & Mountain Breeze",
    author: "NatureSoundsLab",
    url: "https://actions.google.com/sounds/v1/environments/forest_birds_morning.ogg",
    duration: 35,
  },
  {
    title: "Gentle Ocean Waves on Sand Sunset",
    author: "OceanicAudio",
    url: "https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg",
    duration: 40,
  },
  {
    title: "Deep Pine Forest Rain & Droplets",
    author: "RainAmbience",
    url: "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg",
    duration: 30,
  },
  {
    title: "Peaceful Flowing River & Zen Flute",
    author: "SereneFlow",
    url: "https://actions.google.com/sounds/v1/water/river_running_peaceful.ogg",
    duration: 45,
  },
  {
    title: "Ethereal Night Sky Cosmic Ambient",
    author: "CosmicDrone",
    url: "https://actions.google.com/sounds/v1/ambiences/deep_space_drone.ogg",
    duration: 32,
  },
];

// Semantic keyword mapping from visual themes to audio soundscapes
export function formatFreesoundQuery(topic = "", realm = "", soundscape = "") {
  if (soundscape && soundscape.length > 5) {
    const cleanSound = soundscape.replace(/["']/g, "").slice(0, 30);
    return cleanSound;
  }

  const lower = (realm + " " + topic).toLowerCase();

  if (lower.includes("morning") || lower.includes("sunrise") || lower.includes("dawn")) {
    return "birds morning ambient";
  }
  if (lower.includes("sunset") || lower.includes("evening") || lower.includes("dusk")) {
    return "calm ambient sunset waves";
  }
  if (lower.includes("rain") || lower.includes("rainy") || lower.includes("storm")) {
    return "rain forest peaceful water";
  }
  if (lower.includes("ocean") || lower.includes("sea") || lower.includes("beach") || lower.includes("wave")) {
    return "ocean waves soothing surf";
  }
  if (lower.includes("forest") || lower.includes("pine") || lower.includes("tree") || lower.includes("wood")) {
    return "forest breeze birds stream";
  }
  if (lower.includes("night") || lower.includes("star") || lower.includes("galaxy") || lower.includes("moon")) {
    return "space ambient drone synth";
  }
  if (lower.includes("mountain") || lower.includes("alpine") || lower.includes("snow") || lower.includes("peak")) {
    return "mountain wind acoustic ambient";
  }
  if (lower.includes("wildlife") || lower.includes("deer") || lower.includes("animal") || lower.includes("bird")) {
    return "nature wilderness birds cello";
  }
  if (lower.includes("flower") || lower.includes("spring") || lower.includes("butterfly")) {
    return "acoustic harp peace nature";
  }

  return "peaceful nature ambient relaxation";
}

/**
 * Get active Freesound API Key from database config or environment variable
 */
export async function getFreesoundApiKey() {
  const envKey = process.env.FREESOUND_API_KEY;
  if (envKey && envKey.trim()) return envKey.trim();

  try {
    const config = await InstagramAgentConfig.findOne({ key: "default" });
    if (config?.freesoundApiKey && config.freesoundApiKey.trim()) {
      return config.freesoundApiKey.trim();
    }
  } catch (_) {}

  return null;
}

/**
 * Fetch matching background music / nature soundscape from Freesound API based on visual description
 */
export async function fetchMatchingFreesoundAudio({
  topic = "",
  realm = "",
  soundscape = "",
  customQuery = "",
}) {
  const apiKey = await getFreesoundApiKey();
  const searchQuery = customQuery || formatFreesoundQuery(topic, realm, soundscape);

  console.log(`[Freesound Audio] Searching Freesound for query: "${searchQuery}"...`);

  // 1. Fetch previously used Freesound IDs to ensure variety
  const pastContents = await InstagramContent.find(
    { freesoundId: { $exists: true, $ne: "" } },
    { freesoundId: 1 }
  ).lean();
  const usedSoundIds = new Set(pastContents.map((c) => String(c.freesoundId)));

  if (apiKey) {
    try {
      const endpoint = `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(
        searchQuery
      )}&token=${apiKey}&fields=id,name,username,previews,duration,tags,avg_rating&filter=duration:[10.0 TO 180.0]&sort=rating_desc&page_size=15`;

      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        const results = data.results || [];

        // Filter out previously used sounds
        const unused = results.filter((s) => !usedSoundIds.has(String(s.id)));
        const candidates = unused.length > 0 ? unused : results;

        if (candidates.length > 0) {
          const picked = candidates[Math.floor(Math.random() * candidates.length)];
          const previewMp3 =
            picked.previews?.["preview-hq-mp3"] ||
            picked.previews?.["preview-lq-mp3"] ||
            picked.previews?.["preview-hq-ogg"];

          if (previewMp3) {
            console.log(
              `[Freesound Audio] Found matching soundscape "${picked.name}" by ${picked.username} (Rating: ${picked.avg_rating?.toFixed(1) || 5.0}). Uploading to Cloudinary...`
            );

            // Upload audio to Cloudinary
            const cloudinaryAudio = await cloudinary.uploader.upload(previewMp3, {
              folder: "instagram-agent/audio",
              resource_type: "video", // Cloudinary handles audio files under video resource_type
              overwrite: true,
            });

            return {
              audioUrl: cloudinaryAudio.secure_url,
              previewUrl: previewMp3,
              freesoundId: String(picked.id),
              title: picked.name,
              author: picked.username || "Freesound Creator",
              duration: Math.round(picked.duration || 30),
              tags: picked.tags || [],
              rating: picked.avg_rating || 5,
            };
          }
        }
      } else {
        console.warn(`[Freesound Audio] Freesound API responded with status ${res.status}`);
      }
    } catch (apiErr) {
      console.warn("[Freesound Audio] Search error:", apiErr.message);
    }
  }

  // Fallback to high-quality curated nature soundscape
  console.log(`[Freesound Audio] Using curated ambient soundscape fallback...`);
  const pickedFallback = FALLBACK_SOUNDSCAPES[Math.floor(Math.random() * FALLBACK_SOUNDSCAPES.length)];

  let audioUrl = pickedFallback.url;
  try {
    const uploadRes = await cloudinary.uploader.upload(pickedFallback.url, {
      folder: "instagram-agent/audio",
      resource_type: "video",
    });
    audioUrl = uploadRes.secure_url;
  } catch (_) {}

  return {
    audioUrl,
    previewUrl: pickedFallback.url,
    freesoundId: "curated_" + Math.floor(Math.random() * 10000),
    title: pickedFallback.title,
    author: pickedFallback.author,
    duration: pickedFallback.duration,
    tags: ["nature", "ambient", "meditation"],
    rating: 5,
  };
}
