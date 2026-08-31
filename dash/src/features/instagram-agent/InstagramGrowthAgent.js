import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CampaignIcon from "@mui/icons-material/Campaign";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import server from "../../shared/environment";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const whiteCard = {
  borderRadius: "16px",
  border: "1px solid #e4e4e7",
  boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
  p: { xs: 2.5, sm: 3.5 },
  bgcolor: "#ffffff",
  color: "#09090b",
};

const titleStyle = {
  fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontWeight: 800,
  color: "#09090b",
  letterSpacing: "-0.5px",
};

const field = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    fontFamily: "'DM Sans', sans-serif",
    bgcolor: "#fafafa",
    "& fieldset": { borderColor: "#e4e4e7" },
    "&:hover fieldset": { borderColor: "#a1a1aa" },
    "&.Mui-focused fieldset": { borderColor: "#09090b" },
  },
  "& .MuiInputLabel-root": { fontFamily: "'DM Sans', sans-serif", color: "#71717a" },
};

const NATURE_REALMS = [
  {
    id: "morning",
    title: "🌅 Nature's Morning",
    realm: "🌅 Nature's Morning",
    defaultTopic: "Golden Morning Valley Sunrise",
    defaultCaption: "🌅 Nature's Morning: The Sacred Silence of Dawn.\n\nThere is a quiet magic in the first light of day. Take a slow, deep breath. Inhale clarity, exhale tension.\n\n📌 Save this post for your daily peace.\n💬 What is your favorite time to wake up in nature? Drop a '🌅' below! 👇",
    defaultHashtags: "#naturesmorning #sunrisephotography #mountainsunrise #earthfocus #peacefulnature #8knature #cinematicnature",
  },
  {
    id: "sunset",
    title: "🌄 Sunset of the Day",
    realm: "🌄 Sunset of the Day",
    defaultTopic: "Crimson Coastal Sunset Waves",
    defaultCaption: "🌄 Sunset of the Day: Where Fire Meets Ocean.\n\nAs the sun dips below the horizon, let go of everything that no longer serves you.\n\n✨ Rest, breathe, and reset.\n📌 Save this for your evening serenity! 👇",
    defaultHashtags: "#sunsetlovers #sunsetoftheday #goldenhoursea #cinematicsunset #earthfocus #peacefulnature #sunsetreel",
  },
  {
    id: "wildlife",
    title: "🦌 Wildlife Moments",
    realm: "🦌 Wildlife Moments",
    defaultTopic: "Wild Stag in Autumn Mist",
    defaultCaption: "🦌 Wildlife Moments: Grace in the Wild.\n\nWitnessing pure majesty undisturbed in nature. A reminder of the silent strength within all living things.\n\n📌 Double tap if you love wildlife! 🦌✨",
    defaultHashtags: "#wildlifemoments #wildlifephotography #naturelovers #earthfocus #forestanimals #cinematicwildlife",
  },
  {
    id: "forest",
    title: "🌲 Hidden Forests",
    realm: "🌲 Hidden Forests",
    defaultTopic: "Ancient Redwood Canopy Light Rays",
    defaultCaption: "🌲 Hidden Forests: Sanctuary of Ancient Giants.\n\nStep into the quiet mossy depths where sunlight pierces the canopy like emerald beams.\n\n🌿 Take a deep breath of fresh pine air.\n📌 Save this reel for daily calming vibes.",
    defaultHashtags: "#hiddenforests #redwoods #forestbathing #earthfocus #peacefulnature #cinematicforest #naturevibes",
  },
  {
    id: "ocean",
    title: "🌊 Ocean Diaries",
    realm: "🌊 Ocean Diaries",
    defaultTopic: "Turquoise Shoreline & Coral Depths",
    defaultCaption: "🌊 Ocean Diaries: The Endless Blue Rhythm.\n\nThe rhythmic crash of crystal waves against golden sand resets the mind. Listen closely to the tide.\n\n🌊 Drop a '💙' if you need an ocean escape! 👇",
    defaultHashtags: "#oceandiaries #oceanlovers #beachvibes #turquoiseocean #peacefulnature #earthfocus #cinematicwaves",
  },
  {
    id: "rain",
    title: "🌧️ Rainy Nature",
    realm: "🌧️ Rainy Nature",
    defaultTopic: "Gentle Rain on Mountain Pine Needles",
    defaultCaption: "🌧️ Rainy Nature: The Soothing Symphony of Raindrops.\n\nRain washes away the old and nurtures life. Let the gentle sound of rainfall calm your thoughts.\n\n☕ Save this for rainy day comfort.\n💬 Do you love rainy weather? Drop a '🌧️' below!",
    defaultHashtags: "#rainynature #rainambience #peacefulrain #rainlovers #earthfocus #cinematicnature #naturetherapy",
  },
  {
    id: "night",
    title: "🌌 Nature at Night",
    realm: "🌌 Nature at Night",
    defaultTopic: "Milky Way Galaxy over Desert Dunes",
    defaultCaption: "🌌 Nature at Night: Under a Billion Stars.\n\nLook up. In the vastness of the cosmic sky, find peace in how small yet deeply connected we are.\n\n✨ Sleep peacefully tonight.\n📌 Save this for bedtime serenity!",
    defaultHashtags: "#natureatnight #astrophotography #milkywaychasers #nightsky #peacefulnight #earthfocus #cinematicnight",
  },
  {
    id: "tiny",
    title: "🦋 Tiny Wonders",
    realm: "🦋 Tiny Wonders",
    defaultTopic: "Emerald Hummingbird & Morning Dew Flower",
    defaultCaption: "🦋 Tiny Wonders: Microscopic Miracles.\n\nThe smallest details of nature hold infinite beauty. Slow down and appreciate the little things today.\n\n🌸 Double tap if this brightened your day! 🦋",
    defaultHashtags: "#tinywonders #macronature #hummingbird #earthfocus #peacefulnature #naturemacro #8knature",
  },
  {
    id: "mountains",
    title: "🏔️ Mountain Stories",
    realm: "🏔️ Mountain Stories",
    defaultTopic: "Alpine Glacier Peak at High Altitude",
    defaultCaption: "🏔️ Mountain Stories: Standing Tall Above the Clouds.\n\nNo storm lasts forever. Stand tall like the mountain peaks, enduring through every season.\n\n🏔️ Tag someone who loves mountain adventures! 👇",
    defaultHashtags: "#mountainstories #alpinelife #glacierviews #earthfocus #mountainlovers #cinematicmountains #peakviews",
  },
  {
    id: "seasons",
    title: "🍂 Earth Through the Seasons",
    realm: "🍂 Earth Through the Seasons",
    defaultTopic: "Golden Aspen Autumn Forest Cascade",
    defaultCaption: "🍂 Earth Through the Seasons: The Golden Dance of Autumn.\n\nNature teaches us how graceful it can be to let things go. Embrace every season of your journey.\n\n🍂 Save this autumn serenity! 👇",
    defaultHashtags: "#earththroughtheseasons #autumnleaves #goldenautumn #earthfocus #peacefulnature #seasonschange",
  },
  {
    id: "world_wildlife",
    title: "🐘 Wildlife Around the World",
    realm: "🐘 Wildlife Around the World",
    defaultTopic: "Elephant Herd on African Savannah Sunset",
    defaultCaption: "🐘 Wildlife Around the World: Giants of the Savannah.\n\nFamily, loyalty, and timeless wisdom across the golden plains. Protect our wild earth.\n\n🌍 Drop a '🐘' to show love for wild animals! 👇",
    defaultHashtags: "#wildlifearoundtheworld #africansavannah #elephantlove #earthfocus #conservation #cinematicwildlife",
  },
  {
    id: "one_planet",
    title: "🌍 One Planet, Many Worlds",
    realm: "🌍 One Planet, Many Worlds",
    defaultTopic: "Bioluminescent Lagoon & Emerald Waterfalls",
    defaultCaption: "🌍 One Planet, Many Worlds: Earth's Hidden Realms.\n\nFrom glowing lagoons to roaring emerald falls, our planet is a masterpiece of living art.\n\n✨ Protect and cherish our only home.\n📌 Share this reel to spread nature's beauty!",
    defaultHashtags: "#oneplanetmanyworlds #earthfocus #discoverearth #planetearth #cinematicnature #naturegeography",
  },
];

export default function InstagramGrowthAgent() {
  const [data, setData] = useState({
    account: { connected: true, username: "quietframes.ai", followers: 4, reach: null, mediaCount: 25 },
    content: [],
    promotions: [],
    activities: [],
    accountError: "",
  });
  const [config, setConfig] = useState({
    autoReplyComments: true,
    autoReplyMessages: true,
  });
  const [growthAnalysis, setGrowthAnalysis] = useState({
    growthStatus: "🌱 Active & Connected",
    growthBadgeColor: "#22c55e",
    growthSummary: "Instagram Reels publisher is ready. Select your video and publish directly to @quietframes.ai.",
    topCategory: "🌅 Nature's Morning",
    recommendation: "Publish high-quality 9:16 vertical 4K nature reels with clear hooks and audio soundscapes.",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, text: "", severity: "success" });

  const notify = (text, severity = "success") => setSnack({ open: true, text, severity });

  const [liveFollowers, setLiveFollowers] = useState(null);
  const [hasFollowerIncremented, setHasFollowerIncremented] = useState(false);
  const [lastFollowerCheck, setLastFollowerCheck] = useState(null);

  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [exchangingToken, setExchangingToken] = useState(false);
  const [longLivedResult, setLongLivedResult] = useState(null);

  // Direct Upload & Publish States
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [realm, setRealm] = useState("🌅 Nature's Morning");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [topic, setTopic] = useState("Golden Morning Valley Sunrise");
  const [caption, setCaption] = useState(NATURE_REALMS[0].defaultCaption);
  const [hashtags, setHashtags] = useState(NATURE_REALMS[0].defaultHashtags);
  const [publishing, setPublishing] = useState(false);
  const [publishProgressText, setPublishProgressText] = useState("");
  const fileInputRef = useRef(null);

  const [cinemaModalOpen, setCinemaModalOpen] = useState(false);
  const [cinemaItem, setCinemaItem] = useState(null);

  const [collabModalOpen, setCollabModalOpen] = useState(false);
  const [selectedCollab, setSelectedCollab] = useState(null);
  const [collabNote, setCollabNote] = useState("");
  const [reviewingCollab, setReviewingCollab] = useState(false);

  const fetchLiveFollowers = useCallback(async () => {
    try {
      const res = await fetch(`${server}/api/instagram-agent/live-followers`, {
        headers: authHeaders(),
      });
      if (res.ok) {
        const payload = await res.json();
        if (payload.followers !== null && payload.followers !== undefined) {
          setLiveFollowers((prev) => {
            if (prev !== null && payload.followers > prev) {
              setHasFollowerIncremented(true);
              setTimeout(() => setHasFollowerIncremented(false), 5000);
            }
            return payload.followers;
          });
        }
      }
    } catch (_) {}
    setLastFollowerCheck(new Date());
  }, []);

  const load = useCallback(async () => {
    try {
      const [overviewRes, growthRes] = await Promise.all([
        fetch(`${server}/api/instagram-agent/overview`, { headers: authHeaders() }),
        fetch(`${server}/api/instagram-agent/growth-intel`, { headers: authHeaders() }),
      ]);

      if (overviewRes.ok) {
        const overviewData = await overviewRes.json();
        setData((prev) => ({
          ...prev,
          ...overviewData,
          account: overviewData.account || prev.account,
          content: overviewData.content || [],
          promotions: overviewData.promotions || [],
          activities: overviewData.activities || [],
        }));
        if (overviewData.config) {
          setConfig((prev) => ({ ...prev, ...overviewData.config }));
        }
        if (overviewData.account?.followers !== undefined) {
          setLiveFollowers(overviewData.account.followers);
        }
      }

      if (growthRes.ok) {
        const growthData = await growthRes.json();
        setGrowthAnalysis(growthData);
      }
    } catch (err) {
      console.warn("[Instagram Agent Overview Warning]:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    fetchLiveFollowers();
    const timer = setInterval(() => {
      fetchLiveFollowers();
    }, 8000);
    return () => clearInterval(timer);
  }, [load, fetchLiveFollowers]);

  const handleRealmChange = (newRealmTitle) => {
    setRealm(newRealmTitle);
    const target = NATURE_REALMS.find((r) => r.realm === newRealmTitle) || NATURE_REALMS[0];
    setTopic(target.defaultTopic);
    setCaption(target.defaultCaption);
    setHashtags(target.defaultHashtags);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    setSelectedFile(file);
    setVideoUrlInput("");
    setVideoPreviewUrl(URL.createObjectURL(file));

    const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
    setTopic(cleanName);
    notify(`Selected video: "${file.name}" (${(file.size / (1024 * 1024)).toFixed(1)} MB)`);
  };

  const handleClearSelectedFile = () => {
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    setSelectedFile(null);
    setVideoPreviewUrl("");
    setVideoUrlInput("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePublishDirectly = async () => {
    if (!selectedFile && !videoUrlInput.trim()) {
      notify("Please select a video file or paste a video URL first.", "warning");
      return;
    }

    setPublishing(true);
    setPublishProgressText("Preparing secure upload to CDN...");

    try {
      let finalVideoUrl = videoUrlInput.trim();

      // 1. If file is selected, upload directly to Cloudinary Edge CDN
      if (selectedFile) {
        setPublishProgressText(`Uploading "${selectedFile.name}" directly to Cloudinary CDN...`);

        // Fetch signature from backend
        let sig = null;
        try {
          const sigRes = await fetch(`${server}/api/instagram-agent/cloudinary/signature`, {
            headers: authHeaders(),
          });
          if (sigRes.ok) sig = await sigRes.json();
        } catch (_) {}

        if (sig?.cloudName && sig?.signature) {
          const cFormData = new FormData();
          cFormData.append("file", selectedFile);
          cFormData.append("api_key", sig.apiKey);
          cFormData.append("timestamp", sig.timestamp);
          cFormData.append("signature", sig.signature);
          cFormData.append("folder", sig.folder || "instagram-agent/admin-reels");

          const cUploadRes = await fetch(
            `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`,
            { method: "POST", body: cFormData }
          );

          const cUploadJson = await cUploadRes.json();
          if (cUploadRes.ok && cUploadJson.secure_url) {
            finalVideoUrl = cUploadJson.secure_url;
          } else {
            throw new Error(cUploadJson?.error?.message || "Cloudinary direct upload failed.");
          }
        } else {
          throw new Error("Unable to connect to Cloudinary upload service. Please check network and retry.");
        }
      }

      if (!finalVideoUrl) {
        throw new Error("Missing video CDN URL.");
      }

      // 2. Publish to Instagram Reels via Meta Graph API Container
      setPublishProgressText("Processing & Publishing to Instagram Reels (@quietframes.ai)...");

      const token = localStorage.getItem("token") || "";
      const publishRes = await fetch(`${server}/api/instagram-agent/content/publish-direct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          videoUrl: finalVideoUrl,
          category: realm,
          topic: topic.trim() || `${realm} Reel`,
          caption: `${caption.trim()}\n\n${hashtags.trim()}`,
          aspectRatio,
        }),
      });

      const rawText = await publishRes.text();
      let parsed;
      try {
        parsed = JSON.parse(rawText);
      } catch (_) {
        throw new Error(publishRes.statusText || "Server error while publishing to Instagram.");
      }

      if (!publishRes.ok) {
        throw new Error(parsed.error || "Failed to publish reel to Instagram.");
      }

      notify(`🎉 Successfully Published to Instagram Reels! (@quietframes.ai). Cloudinary storage cleaned up.`, "success");
      handleClearSelectedFile();
      await load();
      await fetchLiveFollowers();
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setPublishing(false);
      setPublishProgressText("");
    }
  };

  const handleExchangeLongLivedToken = async () => {
    setExchangingToken(true);
    setTokenModalOpen(true);
    try {
      const res = await fetch(`${server}/api/instagram-agent/exchange-token`, {
        method: "POST",
        headers: authHeaders(),
      });
      const data = await res.json();
      setLongLivedResult(data);
    } catch (err) {
      setLongLivedResult({ error: err.message });
    } finally {
      setExchangingToken(false);
    }
  };

  const handleReviewCollab = async (status) => {
    if (!selectedCollab) return;
    setReviewingCollab(true);
    try {
      const res = await fetch(`${server}/api/instagram-agent/promotions/${selectedCollab._id}/review`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ status, adminNotes: collabNote }),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error || "Review failed");
      notify(`Brand inquiry marked as ${status}.`);
      setCollabModalOpen(false);
      await load();
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setReviewingCollab(false);
    }
  };

  const account = data.account || {};
  const content = data.content || [];
  const promotions = data.promotions || [];
  const publishedItems = content.filter((c) => c.status === "published");

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", p: { xs: 2, sm: 3, md: 4 } }}>
      {/* ── HEADER BANNER ── */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
            <Typography variant="h4" sx={{ ...titleStyle, fontSize: { xs: 24, sm: 28 } }}>
              Instagram Reels Publisher
            </Typography>
            <Chip
              label="1-Click Direct Publish"
              size="small"
              sx={{ bgcolor: "#09090b", color: "#ffffff", fontWeight: 700, fontSize: 11 }}
            />
          </Box>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#71717a", fontSize: 14 }}>
            Direct Instagram Reel Uploader & AI Nature Cinematography Engine · Connected to <strong>@{account.username || "quietframes.ai"}</strong>
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.2, alignItems: "center" }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => { load(); fetchLiveFollowers(); }}
            startIcon={<RefreshIcon />}
            sx={{ borderRadius: "8px", textTransform: "none", color: "#09090b", borderColor: "#e4e4e7", fontWeight: 700 }}
          >
            Sync
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleExchangeLongLivedToken}
            startIcon={<VpnKeyIcon />}
            sx={{ borderRadius: "8px", textTransform: "none", color: "#09090b", borderColor: "#e4e4e7", fontWeight: 700 }}
          >
            60-Day Meta Token
          </Button>
        </Box>
      </Box>

      {/* ── TOP STATS BAR WITH LIVE PULSE ── */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2, mb: 3 }}>
        <Paper sx={{ ...whiteCard, p: 2.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#71717a", textTransform: "uppercase" }}>
              Live Followers
            </Typography>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#22c55e",
                animation: "pulse 1.5s infinite",
                "@keyframes pulse": { "0%": { opacity: 0.4 }, "50%": { opacity: 1 }, "100%": { opacity: 0.4 } },
              }}
            />
          </Box>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 800, color: "#09090b", mt: 0.5 }}>
            {liveFollowers !== null ? liveFollowers.toLocaleString() : (account.followers !== null ? account.followers : "—")}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#71717a", mt: 0.5 }}>
            Live count from @{account.username || "quietframes.ai"}
          </Typography>
        </Paper>

        <Paper sx={{ ...whiteCard, p: 2.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#71717a", textTransform: "uppercase" }}>
              Published Reels
            </Typography>
            <TrendingUpIcon sx={{ color: "#71717a", fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 800, color: "#09090b", mt: 0.5 }}>
            {publishedItems.length || account.mediaCount || 0}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#71717a", mt: 0.5 }}>
            Live on Instagram Reels
          </Typography>
        </Paper>

        <Paper sx={{ ...whiteCard, p: 2.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#71717a", textTransform: "uppercase" }}>
              Brand Collab Requests
            </Typography>
            <CampaignIcon sx={{ color: "#71717a", fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 800, color: "#09090b", mt: 0.5 }}>
            {promotions.length}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#71717a", mt: 0.5 }}>
            Sponsorships & Partnership DMs
          </Typography>
        </Paper>
      </Box>

      {/* ── AI CHANNEL GROWTH ADVISOR ── */}
      {growthAnalysis && (
        <Paper sx={{ ...whiteCard, mb: 3, bgcolor: "#09090b", color: "#ffffff", borderColor: "#27272a" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5, flexWrap: "wrap", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AutoAwesomeIcon sx={{ color: "#22c55e", fontSize: 20 }} />
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 16, color: "#ffffff" }}>
                Channel Growth Intelligence · @{account.username || "quietframes.ai"}
              </Typography>
            </Box>
            <Chip
              label={growthAnalysis.growthStatus || "🌱 Active"}
              size="small"
              sx={{ bgcolor: "#27272a", color: growthAnalysis.growthBadgeColor || "#22c55e", fontWeight: 700, fontSize: 11 }}
            />
          </Box>
          <Typography sx={{ fontSize: 13, color: "#d4d4d8", mb: 1.5 }}>
            {growthAnalysis.growthSummary}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", pt: 1, borderTop: "1px solid #27272a" }}>
            <Typography sx={{ fontSize: 12, color: "#a1a1aa" }}>
              ⭐ Top Audience Realm: <strong style={{ color: "#ffffff" }}>{growthAnalysis.topCategory}</strong>
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#a1a1aa" }}>
              💡 Recommendation: <span style={{ color: "#d4d4d8" }}>{growthAnalysis.recommendation}</span>
            </Typography>
          </Box>
        </Paper>
      )}

      {/* ── DIRECT INSTAGRAM REEL PUBLISHER CARD ── */}
      <Paper sx={{ ...whiteCard, mb: 3, border: "2px solid #09090b" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1, flexWrap: "wrap", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CloudUploadIcon sx={{ color: "#09090b", fontSize: 24 }} />
            <Typography sx={{ ...titleStyle, fontSize: 20 }}>
              Direct Instagram Reel Publisher
            </Typography>
          </Box>
          <Chip label="Instant Publishing" size="small" sx={{ bgcolor: "#09090b", color: "#ffffff", fontWeight: 800, fontSize: 11 }} />
        </Box>
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#71717a", fontSize: 13.5, mb: 3 }}>
          Upload your video, pick your 12-Series Nature Realm & Aspect Ratio, and click <strong>Publish to Instagram</strong>. The video is published directly to your Instagram Reels feed and the temporary file is purged from Cloudinary immediately after.
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
          {/* Left Column: Media Selection & Player Preview */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button
                variant="contained"
                onClick={() => fileInputRef.current?.click()}
                startIcon={<CloudUploadIcon />}
                sx={{
                  flex: 1,
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 800,
                  fontSize: 13.5,
                  bgcolor: "#09090b",
                  color: "#ffffff",
                  "&:hover": { bgcolor: "#27272a" },
                  minHeight: 48,
                }}
              >
                {selectedFile ? "📁 Change Video File" : "📁 Choose Video File (.mp4, .mov)"}
              </Button>
              {selectedFile && (
                <Button
                  variant="outlined"
                  onClick={handleClearSelectedFile}
                  sx={{ borderRadius: "10px", textTransform: "none", color: "#ef4444", borderColor: "#fca5a5" }}
                >
                  Clear
                </Button>
              )}
            </Box>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="video/*"
              style={{ display: "none" }}
            />

            <Typography sx={{ fontSize: 11, color: "#71717a", textAlign: "center" }}>— OR PASTE A PUBLIC VIDEO URL —</Typography>

            <TextField
              size="small"
              label="Public Video URL (Optional)"
              value={videoUrlInput}
              onChange={(e) => {
                setVideoUrlInput(e.target.value);
                if (e.target.value) {
                  setSelectedFile(null);
                  setVideoPreviewUrl(e.target.value);
                }
              }}
              placeholder="https://..."
              sx={field}
              fullWidth
            />

            {/* Video Player Preview Box */}
            <Box
              sx={{
                width: "100%",
                height: aspectRatio === "16:9" ? 220 : 340,
                borderRadius: "12px",
                bgcolor: "#09090b",
                border: "1px solid #e4e4e7",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {videoPreviewUrl ? (
                <video
                  src={videoPreviewUrl}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  controls
                  playsInline
                />
              ) : (
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <CloudUploadIcon sx={{ color: "#52525b", fontSize: 42, mb: 1 }} />
                  <Typography sx={{ color: "#a1a1aa", fontSize: 13, fontWeight: 600 }}>
                    Video Preview Will Appear Here
                  </Typography>
                  <Typography sx={{ color: "#71717a", fontSize: 11, mt: 0.5 }}>
                    Select a video above to see instant preview
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Right Column: Settings, Metadata & Publish Button */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1.2fr 1fr" }, gap: 1.5 }}>
              <FormControl sx={field} fullWidth size="small">
                <InputLabel>12-Series Nature Realm ⭐</InputLabel>
                <Select
                  label="12-Series Nature Realm ⭐"
                  value={realm}
                  onChange={(e) => handleRealmChange(e.target.value)}
                >
                  {NATURE_REALMS.map((r) => (
                    <MenuItem key={r.id} value={r.realm}>
                      {r.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={field} fullWidth size="small">
                <InputLabel>Format / Aspect Ratio 📐</InputLabel>
                <Select
                  label="Format / Aspect Ratio 📐"
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                >
                  <MenuItem value="9:16">📱 9:16 Vertical Reel</MenuItem>
                  <MenuItem value="16:9">🖥️ 16:9 Landscape</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              size="small"
              label="Reel Topic / Title"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Mountain Sunrise over Valley Mist"
              sx={field}
              fullWidth
            />

            <TextField
              label="Instagram Reel Caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              multiline
              rows={4}
              sx={field}
              fullWidth
              helperText="Auto-populated with engaging hook & mindful breathing prompt"
            />

            <TextField
              size="small"
              label="Viral Hashtags"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              sx={field}
              fullWidth
            />

            {/* Main Publish Action Button */}
            <Button
              variant="contained"
              onClick={handlePublishDirectly}
              disabled={publishing || (!selectedFile && !videoUrlInput.trim())}
              startIcon={publishing ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              sx={{
                mt: 1,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 800,
                fontSize: 16,
                minHeight: 56,
                bgcolor: "#09090b",
                color: "#ffffff",
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                "&:hover": { bgcolor: "#27272a" },
              }}
            >
              {publishing ? (publishProgressText || "Publishing to Instagram...") : "🚀 Publish Directly to Instagram Reels"}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* ── PUBLISHED REELS HISTORY GRID ── */}
      <Paper sx={{ ...whiteCard, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
          <Typography sx={{ ...titleStyle, fontSize: 18 }}>
            Live Published Reels ({publishedItems.length})
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#71717a" }}>
            Posts live on @{account.username || "quietframes.ai"}
          </Typography>
        </Box>

        {publishedItems.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center", bgcolor: "#fafafa", borderRadius: "12px", border: "1px dashed #e4e4e7" }}>
            <Typography sx={{ color: "#71717a", fontSize: 14 }}>
              No reels published yet. Use the publisher above to upload and publish your first Instagram Reel!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 2 }}>
            {publishedItems.map((item) => (
              <Box
                key={item._id}
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  bgcolor: "#fafafa",
                  border: "1px solid #e4e4e7",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Chip
                      label={item.themeCategory || "Nature Reel"}
                      size="small"
                      sx={{ bgcolor: "#09090b", color: "#ffffff", fontWeight: 700, fontSize: 10 }}
                    />
                    <Chip
                      label={item.aspectRatio === "16:9" ? "🖥️ 16:9" : "📱 9:16"}
                      size="small"
                      sx={{ bgcolor: "#e4e4e7", color: "#09090b", fontWeight: 700, fontSize: 10 }}
                    />
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: 14, color: "#09090b", mb: 0.5 }}>
                    {item.topic}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#71717a", maxHeight: 50, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.caption}
                  </Typography>
                </Box>

                <Box sx={{ mt: 2, pt: 1.5, borderTop: "1px solid #e4e4e7", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography sx={{ fontSize: 11, color: "#a1a1aa" }}>
                    {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : "Live on IG"}
                  </Typography>
                  <Chip
                    icon={<CheckCircleIcon sx={{ fontSize: "14px !important", color: "#22c55e !important" }} />}
                    label="Live on Reels"
                    size="small"
                    sx={{ bgcolor: "#f0fdf4", color: "#16a34a", fontWeight: 700, fontSize: 10 }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* ── BRAND COLLABORATIONS PANEL ── */}
      <Paper sx={{ ...whiteCard, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CampaignIcon sx={{ color: "#09090b", fontSize: 22 }} />
            <Typography sx={{ ...titleStyle, fontSize: 18 }}>
              Brand Collaborations & Sponsorship Inquiries
            </Typography>
          </Box>
          <Chip label={`${promotions.length} Inquiries`} size="small" sx={{ bgcolor: "#f4f4f5", color: "#09090b", fontWeight: 700, fontSize: 11 }} />
        </Box>
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#71717a", fontSize: 13, mb: 2 }}>
          Incoming messages and comments containing sponsorship, partnership, or collab keywords are intercepted here for admin approval.
        </Typography>

        {promotions.length === 0 ? (
          <Typography sx={{ color: "#71717a", fontSize: 13 }}>No brand collaboration requests yet.</Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {promotions.map((p) => (
              <Box
                key={p._id}
                sx={{
                  p: 2,
                  borderRadius: "10px",
                  bgcolor: "#fafafa",
                  border: "1px solid #e4e4e7",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1.5,
                }}
              >
                <Box sx={{ maxWidth: { xs: "100%", md: "70%" } }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <Chip
                      label={p.source === "instagram_dm" ? "📩 Instagram DM" : "💬 Comment"}
                      size="small"
                      sx={{ bgcolor: "#09090b", color: "#ffffff", fontWeight: 700, fontSize: 10 }}
                    />
                    <Typography sx={{ fontWeight: 800, fontSize: 13, color: "#09090b" }}>
                      From: {p.senderName || `@${p.senderId}`}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: "#71717a" }}>
                      · {new Date(p.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: 13, color: "#3f3f46", fontStyle: "italic" }}>
                    "{p.message}"
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={p.status?.toUpperCase() || "PENDING"}
                    size="small"
                    sx={{
                      bgcolor: p.status === "approved" ? "#22c55e" : p.status === "declined" ? "#ef4444" : "#e4e4e7",
                      color: p.status === "pending" ? "#09090b" : "#ffffff",
                      fontWeight: 800,
                      fontSize: 10,
                    }}
                  />
                  {p.status === "pending" && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => { setSelectedCollab(p); setCollabModalOpen(true); }}
                      sx={{ borderRadius: "8px", textTransform: "none", fontSize: 11, fontWeight: 700, color: "#09090b", borderColor: "#d4d4d8" }}
                    >
                      Review
                    </Button>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* ── AUTOMATION SETTINGS ── */}
      <Paper sx={{ ...whiteCard, mb: 3 }}>
        <Typography sx={{ ...titleStyle, fontSize: 18, mb: 2 }}>Community Auto-Replies</Typography>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 4 }}>
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(config.autoReplyComments)}
                onChange={(e) => setConfig((prev) => ({ ...prev, autoReplyComments: e.target.checked }))}
                color="default"
              />
            }
            label={<Typography sx={{ fontSize: 13, fontWeight: 600 }}>💬 Auto-Reply to Post Comments</Typography>}
          />
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(config.autoReplyMessages)}
                onChange={(e) => setConfig((prev) => ({ ...prev, autoReplyMessages: e.target.checked }))}
                color="default"
              />
            }
            label={<Typography sx={{ fontSize: 13, fontWeight: 600 }}>📩 Auto-Reply to Direct Messages (DMs)</Typography>}
          />
        </Box>
      </Paper>

      {/* ── BRAND COLLAB REVIEW DIALOG ── */}
      <Dialog
        open={collabModalOpen}
        onClose={() => setCollabModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "14px", border: "1px solid #e4e4e7" } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: 16 }}>Review Brand Collaboration</DialogTitle>
        <DialogContent dividers>
          {selectedCollab && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography sx={{ fontSize: 13, color: "#71717a" }}>
                Sender: <strong>{selectedCollab.senderName || `@${selectedCollab.senderId}`}</strong> ({selectedCollab.source})
              </Typography>
              <Box sx={{ p: 1.5, bgcolor: "#fafafa", borderRadius: "8px", border: "1px solid #e4e4e7" }}>
                <Typography sx={{ fontSize: 13, color: "#09090b", fontStyle: "italic" }}>
                  "{selectedCollab.message}"
                </Typography>
              </Box>
              <TextField
                label="Admin Review Note (Optional)"
                value={collabNote}
                onChange={(e) => setCollabNote(e.target.value)}
                placeholder="e.g. Approved for $500 sponsorship reel"
                fullWidth
                multiline
                rows={2}
                sx={field}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setCollabModalOpen(false)} sx={{ textTransform: "none", color: "#71717a" }}>
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleReviewCollab("declined")}
            disabled={reviewingCollab}
            sx={{ textTransform: "none", color: "#ef4444", borderColor: "#ef4444", fontWeight: 700 }}
          >
            Decline
          </Button>
          <Button
            variant="contained"
            onClick={() => handleReviewCollab("approved")}
            disabled={reviewingCollab}
            sx={{ textTransform: "none", bgcolor: "#09090b", color: "#ffffff", fontWeight: 700 }}
          >
            Approve Collab
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── 60-DAY META TOKEN MODAL ── */}
      <Dialog
        open={tokenModalOpen}
        onClose={() => setTokenModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "14px", border: "1px solid #e4e4e7" } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: 16 }}>Meta Long-Lived Access Token</DialogTitle>
        <DialogContent dividers>
          {exchangingToken ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress sx={{ color: "#09090b" }} />
              <Typography sx={{ mt: 2, fontSize: 13, color: "#71717a" }}>Exchanging token with Meta Graph API...</Typography>
            </Box>
          ) : longLivedResult?.error ? (
            <Alert severity="error" sx={{ borderRadius: "8px" }}>{longLivedResult.error}</Alert>
          ) : longLivedResult?.longLivedToken ? (
            <Box>
              <Alert severity="success" sx={{ mb: 2, borderRadius: "8px" }}>
                Token generated! Valid for ~{longLivedResult.expiresInDays} days.
              </Alert>
              <TextField
                label="Long-Lived Token"
                value={longLivedResult.longLivedToken}
                fullWidth
                multiline
                rows={4}
                sx={field}
                InputProps={{ readOnly: true }}
              />
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTokenModalOpen(false)} sx={{ textTransform: "none", color: "#09090b" }}>
            Done
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snack.severity} sx={{ borderRadius: "8px", bgcolor: "#09090b", color: "#ffffff" }}>
          {snack.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}
