// back/modules/instagram-agent/services/pexelsMedia.service.js
import fetch from "node-fetch";
import { cloudinary } from "../../../config/cloudinary.js";
import InstagramAgentConfig from "../schema/InstagramAgentConfig.model.js";
import InstagramContent from "../schema/InstagramContent.model.js";

const DEFAULT_PEXELS_QUERIES = [
  "mountain sunrise mist vertical",
  "peaceful forest waterfall nature",
  "ocean waves beach sunset",
  "wildlife deer pine forest",
  "rain falling on green leaves",
  "milky way starry night sky",
  "snow capped mountain peaks",
  "golden hour autumn forest path",
  "tropical island turquoise water",
  "blooming wild flower field drone",
  "breathtaking alpine lake reflection",
  "emerald forest river stream"
];

// Clean and extract the best search query for Pexels
export function formatPexelsQuery(topic = "", realm = "") {
  let clean = topic
    .replace(/^create (video|image|reel|post) on/i, "")
    .replace(/^generate (video|image|reel|post) on/i, "")
    .replace(/["']/g, "")
    .trim();

  // If topic has emojis, remove them for search clarity
  clean = clean.replace(/[\u{1F300}-\u{1FAFF}]/gu, "").trim();

  if (!clean || clean.length < 3) {
    clean = realm.replace(/[\u{1F300}-\u{1FAFF}]/gu, "").trim() || "nature landscape";
  }

  // Optimize keywords for Pexels vertical cinematography
  const keywords = clean.split(/\s+/).slice(0, 5).join(" ");
  return keywords || "peaceful nature landscape";
}

/**
 * Get active Pexels API Key from database config or environment variable
 */
export async function getPexelsApiKey() {
  const envKey = process.env.PEXELS_API_KEY;
  if (envKey && envKey.trim()) return envKey.trim();

  try {
    const config = await InstagramAgentConfig.findOne({ key: "default" });
    if (config?.pexelsApiKey && config.pexelsApiKey.trim()) {
      return config.pexelsApiKey.trim();
    }
  } catch (_) {}

  return null;
}

/**
 * Fetch unique HD 9:16 Vertical Video or 8K Photo from Pexels API and upload to Cloudinary
 */
export async function fetchUniquePexelsMedia({
  topic = "",
  realm = "",
  type = "reel",
  orientation = "portrait", // default 9:16 portrait for Reels
  customQuery = "",
}) {
  const apiKey = await getPexelsApiKey();
  if (!apiKey) {
    throw new Error(
      "Pexels API key is not configured. Please add PEXELS_API_KEY to your environment or Dashboard settings."
    );
  }

  const isVideo = type === "reel" || type === "video";
  const searchQuery = customQuery || formatPexelsQuery(topic, realm);

  // 1. Fetch all previously used Pexels IDs from database to guarantee 100% uniqueness
  const pastContents = await InstagramContent.find(
    { pexelsId: { $exists: true, $ne: "" } },
    { pexelsId: 1 }
  ).lean();
  const usedPexelsIds = new Set(pastContents.map((c) => String(c.pexelsId)));

  console.log(`[Pexels Media] Searching Pexels ${isVideo ? "Videos" : "Photos"} for query: "${searchQuery}" (Orientation: ${orientation})...`);

  // Try pages 1 to 5 with randomized offset for maximum variety
  const randomPage = Math.floor(Math.random() * 4) + 1;
  const pagesToTry = [randomPage, 1, 2, 3, 4, 5];

  let selectedItem = null;
  let selectedFileUrl = null;
  let bestWidth = 1080;
  let bestHeight = 1920;

  for (const page of pagesToTry) {
    try {
      const endpoint = isVideo
        ? `https://api.pexels.com/videos/search?query=${encodeURIComponent(searchQuery)}&orientation=${orientation}&per_page=15&page=${page}`
        : `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&orientation=${orientation}&per_page=15&page=${page}`;

      const res = await fetch(endpoint, {
        headers: { Authorization: apiKey },
      });

      if (!res.ok) {
        const errBody = await res.text();
        console.warn(`[Pexels Media] Pexels API status ${res.status}:`, errBody.slice(0, 200));
        continue;
      }

      const data = await res.json();
      const items = isVideo ? data.videos || [] : data.photos || [];

      // Filter for items not yet used
      const unusedItems = items.filter((item) => !usedPexelsIds.has(String(item.id)));
      const candidates = unusedItems.length > 0 ? unusedItems : items;

      if (candidates.length > 0) {
        // Pick random candidate from list
        const picked = candidates[Math.floor(Math.random() * candidates.length)];

        if (isVideo) {
          // Select best vertical HD video file (1080p or highest resolution)
          const videoFiles = (picked.video_files || []).filter(
            (f) => f.file_type === "video/mp4" && f.link
          );

          // Sort by resolution descending, prioritizing portrait height
          videoFiles.sort((a, b) => {
            const aRes = (a.width || 0) * (a.height || 0);
            const bRes = (b.width || 0) * (b.height || 0);
            return bRes - aRes;
          });

          // Prefer 1080x1920 or vertical HD
          const portraitFile = videoFiles.find((f) => (f.height || 0) >= (f.width || 0)) || videoFiles[0];

          if (portraitFile?.link) {
            selectedItem = picked;
            selectedFileUrl = portraitFile.link;
            bestWidth = portraitFile.width || 1080;
            bestHeight = portraitFile.height || 1920;
            break;
          }
        } else {
          // Select best HD photo
          const photoUrl = picked.src?.large2x || picked.src?.original || picked.src?.large;
          if (photoUrl) {
            selectedItem = picked;
            selectedFileUrl = photoUrl;
            bestWidth = picked.width || 1080;
            bestHeight = picked.height || 1920;
            break;
          }
        }
      }
    } catch (pageErr) {
      console.warn(`[Pexels Media] Search error on page ${page}:`, pageErr.message);
    }
  }

  // Fallback to curated nature collection if specific query returned 0 items
  if (!selectedItem || !selectedFileUrl) {
    const fallbackQuery = DEFAULT_PEXELS_QUERIES[Math.floor(Math.random() * DEFAULT_PEXELS_QUERIES.length)];
    console.log(`[Pexels Media] Falling back to curated nature query: "${fallbackQuery}"...`);

    const endpoint = isVideo
      ? `https://api.pexels.com/videos/search?query=${encodeURIComponent(fallbackQuery)}&orientation=${orientation}&per_page=10&page=1`
      : `https://api.pexels.com/v1/search?query=${encodeURIComponent(fallbackQuery)}&orientation=${orientation}&per_page=10&page=1`;

    const res = await fetch(endpoint, { headers: { Authorization: apiKey } });
    if (res.ok) {
      const data = await res.json();
      const items = isVideo ? data.videos || [] : data.photos || [];
      if (items.length > 0) {
        selectedItem = items[0];
        if (isVideo) {
          const files = (selectedItem.video_files || []).filter((f) => f.file_type === "video/mp4" && f.link);
          const best = files.find((f) => (f.height || 0) >= (f.width || 0)) || files[0];
          selectedFileUrl = best?.link;
          bestWidth = best?.width || 1080;
          bestHeight = best?.height || 1920;
        } else {
          selectedFileUrl = selectedItem.src?.large2x || selectedItem.src?.original;
          bestWidth = selectedItem.width || 1080;
          bestHeight = selectedItem.height || 1920;
        }
      }
    }
  }

  if (!selectedItem || !selectedFileUrl) {
    throw new Error(
      `No HD ${isVideo ? "videos" : "photos"} found on Pexels for query: "${searchQuery}". Please check your API key or query keywords.`
    );
  }

  console.log(`[Pexels Media] Found 1080p/4K Pexels ${isVideo ? "Video" : "Photo"} (ID: ${selectedItem.id}) by ${selectedItem.user?.name || selectedItem.photographer || "Pexels Creator"}. Uploading to Cloudinary...`);

  // 2. Upload to Cloudinary to get a permanent, optimized CDN URL for Instagram Reels / Graph API
  const cloudinaryUpload = await cloudinary.uploader.upload(selectedFileUrl, {
    folder: "instagram-agent",
    resource_type: isVideo ? "video" : "image",
    overwrite: true,
  });

  console.log(`[Pexels Media] Successfully uploaded to Cloudinary: ${cloudinaryUpload.secure_url}`);

  return {
    url: cloudinaryUpload.secure_url,
    sourceUrl: selectedFileUrl,
    pexelsId: String(selectedItem.id),
    photographer: selectedItem.user?.name || selectedItem.photographer || "Pexels Creator",
    photographerUrl: selectedItem.user?.url || selectedItem.photographer_url || "https://www.pexels.com",
    width: bestWidth,
    height: bestHeight,
    duration: selectedItem.duration || 0,
    type: isVideo ? "reel" : "post",
    assetSource: isVideo ? "pexels_hd_video" : "pexels_hd_photo",
  };
}
