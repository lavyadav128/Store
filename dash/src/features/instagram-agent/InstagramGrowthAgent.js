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
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MovieCreationIcon from "@mui/icons-material/MovieCreation";
import ImageIcon from "@mui/icons-material/Image";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import LoopIcon from "@mui/icons-material/Loop";
import server from "../../shared/environment";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Clean Individual White Box Card Styling
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

// 12 Comprehensive Daily Series
const NATURE_REALMS = [
  { id: "morning", title: "🌅 Nature's Morning", realm: "🌅 Nature's Morning", sample: "Mountain sunrise alpenglow & golden valley mist with morning birdsong" },
  { id: "sunset", title: "🌄 Sunset of the Day", realm: "🌄 Sunset of the Day", sample: "Tropical ocean sunset & warm golden reflections with rhythmic waves" },
  { id: "wildlife", title: "🦌 Wildlife Moments", realm: "🦌 Wildlife Moments", sample: "Majestic deer & Bengal tiger in misty forest with calming cello" },
  { id: "forest", title: "🌲 Hidden Forests", realm: "🌲 Hidden Forests", sample: "Ancient giant redwoods & mossy waterfalls with Zen bamboo flute" },
  { id: "ocean", title: "🌊 Ocean Diaries", realm: "🌊 Ocean Diaries", sample: "Dramatic rocky coastline & turquoise ocean waves with sea breeze" },
  { id: "rain", title: "🌧️ Rainy Nature", realm: "🌧️ Rainy Nature", sample: "Peaceful forest rainfall & water droplets on ferns with rain sounds" },
  { id: "night", title: "🌌 Nature at Night", realm: "🌌 Nature at Night", sample: "Milky Way galaxy core over mirror mountain lake with space harp" },
  { id: "tiny", title: "🦋 Tiny Wonders", realm: "🦋 Tiny Wonders", sample: "Blue butterfly & emerald kingfisher macro photography with acoustic harp" },
  { id: "mountains", title: "🏔️ Mountain Stories", realm: "🏔️ Mountain Stories", sample: "Snow-capped alpine peaks & alpenglow summit with alpine strings" },
  { id: "seasons", title: "🍂 Earth Through the Seasons", realm: "🍂 Earth Through the Seasons", sample: "Golden autumn maple path & silent winter snowfall with singing bowls" },
  { id: "world_wildlife", title: "🐘 Wildlife Around the World", realm: "🐘 Wildlife Around the World", sample: "African savanna elephant family at sunset with cinematic strings" },
  { id: "one_planet", title: "🌍 One Planet, Many Worlds", realm: "🌍 One Planet, Many Worlds", sample: "Bioluminescent coral reef abyss & sea turtles with ocean harp" },
];

export default function InstagramGrowthAgent() {
  const [data, setData] = useState(null);
  const [config, setConfig] = useState(null);
  const [topic, setTopic] = useState("");
  const [selectedRealm, setSelectedRealm] = useState("🌅 Nature's Morning");
  
  // Persistent Mode Selection across sessions
  const [mediaMode, setMediaMode] = useState(() => {
    return localStorage.getItem("admin_media_mode") || "video";
  });

  const [saving, setSaving] = useState(false);
  const [generatingMediaId, setGeneratingMediaId] = useState(null);
  const [snack, setSnack] = useState({ open: false, text: "", severity: "success" });

  // Audio Preview Player State for In-Queue & Lightbox
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const audioRef = useRef(null);

  // Cinema Lightbox Modal State
  const [cinemaModalOpen, setCinemaModalOpen] = useState(false);
  const [cinemaItem, setCinemaItem] = useState(null);

  // Real-Time Live Followers Tracking State
  const [liveFollowers, setLiveFollowers] = useState(null);
  const [hasFollowerIncremented, setHasFollowerIncremented] = useState(false);
  const [lastFollowerCheck, setLastFollowerCheck] = useState(null);

  // 60-Day Long-Lived Token Modal State
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [exchangingToken, setExchangingToken] = useState(false);
  const [longLivedResult, setLongLivedResult] = useState(null);

  // Autonomous Gemini Live Inspector Modal State
  const [flowInspectorOpen, setFlowInspectorOpen] = useState(false);
  const [flowInspectorSession, setFlowInspectorSession] = useState(null);
  const [runningFlowLiveId, setRunningFlowLiveId] = useState(null);

  const notify = (text, severity = "success") => setSnack({ open: true, text, severity });

  // Switch and Persist Media Mode immediately
  const handleSwitchMode = async (newMode) => {
    setMediaMode(newMode);
    localStorage.setItem("admin_media_mode", newMode);
    try {
      if (config) {
        await request("/config", "POST", {
          ...config,
          contentMode: newMode === "image" ? "post" : "reel",
        });
      }
      notify(`Mode set to 16:9 ${newMode === "image" ? "Image Post" : "Video Reel"} (Saved).`);
    } catch (_) {}
  };

  const load = useCallback(async () => {
    try {
      const response = await fetch(`${server}/api/instagram-agent/overview`, {
        headers: authHeaders(),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not load Instagram agent.");
      setData(payload);
      setConfig(payload.config);

      const savedMode = localStorage.getItem("admin_media_mode");
      if (!savedMode && payload.config?.contentMode === "post") {
        setMediaMode("image");
      }

      if (payload.account?.followers !== null && payload.account?.followers !== undefined) {
        setLiveFollowers(payload.account.followers);
      }
    } catch (error) {
      notify(error.message, "error");
    }
  }, []);

  // Poll live follower count every 12 seconds
  const fetchLiveFollowers = useCallback(async () => {
    try {
      const res = await fetch(`${server}/api/instagram-agent/live-followers`, {
        headers: authHeaders(),
      });
      if (res.ok) {
        const payload = await res.json();
        if (payload.followers !== null && payload.followers !== undefined) {
          setLiveFollowers((current) => {
            if (current !== null && payload.followers > current) {
              setHasFollowerIncremented(true);
              setTimeout(() => setHasFollowerIncremented(false), 8000);
            }
            return payload.followers;
          });
          setLastFollowerCheck(new Date().toLocaleTimeString());
        }
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(fetchLiveFollowers, 12000);
    return () => clearInterval(interval);
  }, [load, fetchLiveFollowers]);

  const request = async (path, method = "POST", body) => {
    const response = await fetch(`${server}/api/instagram-agent${path}`, {
      method,
      headers: authHeaders(),
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Request failed.");
    return payload;
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      const updatedConfig = {
        ...config,
        contentMode: mediaMode === "image" ? "post" : "reel",
      };
      const updated = await request("/config", "POST", updatedConfig);
      setConfig(updated);
      notify("Instagram configuration and 12-series daily loop settings saved.");
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const toggleAgent = async () => {
    setSaving(true);
    try {
      const action = config.running ? "/stop" : "/start";
      const updated = await request(action);
      setConfig(updated);
      notify(config.running ? "Instagram agent paused." : "Instagram agent started.");
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const generate = async (customTopic = null, customRealm = null, forcedType = null) => {
    setSaving(true);
    try {
      const topicToUse = customTopic || topic;
      const realmToUse = customRealm || selectedRealm;
      const targetType = forcedType || (mediaMode === "image" ? "post" : "reel");
      const created = await request("/content/generate", "POST", {
        topic: topicToUse,
        category: realmToUse,
        type: targetType,
      });
      notify(`AI generated 16:9 [${realmToUse}] ${targetType === "post" ? "Image" : "Video"}: "${created.topic}"`);
      setTopic("");
      await load();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateMedia = async (contentId, specificType = null) => {
    setGeneratingMediaId(contentId);
    const modeLabel = specificType === "post" || specificType === "image" ? "8K 16:9 Portrait Image" : "16:9 Portrait Reel";
    notify(`Fetching HD media from Pexels API & matched soundscape from Freesound API...`, "info");

    try {
      const payload = specificType ? { type: specificType } : {};
      const updated = await request(`/content/${contentId}/generate-media`, "POST", payload);
      notify(`Ready! Fetched HD 16:9 ${updated.type === "post" ? "Image" : "Reel"} for: ${updated.topic}!`);
      await load();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setGeneratingMediaId(null);
    }
  };

  // Toggle Audio Playback for Admin Preview
  const handleToggleAudio = (contentId, audioUrl) => {
    let cleanUrl = audioUrl;
    if (!cleanUrl || cleanUrl.includes("pixabay.com")) {
      cleanUrl = "https://res.cloudinary.com/dlsetxkjj/video/upload/v1788012256/instagram-agent/audio/ultimate_dreams_anthem.mp3";
    }

    if (playingAudioId === contentId) {
      if (audioRef.current) audioRef.current.pause();
      setPlayingAudioId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(cleanUrl);
      audio.onended = () => setPlayingAudioId(null);
      audio.play().catch(() => {
        // Fallback to primary Cloudinary anthem
        const fallbackAudio = new Audio("https://res.cloudinary.com/dlsetxkjj/video/upload/v1788012256/instagram-agent/audio/ultimate_dreams_anthem.mp3");
        fallbackAudio.onended = () => setPlayingAudioId(null);
        fallbackAudio.play().catch(() => notify("Click anywhere to allow audio playback in browser.", "info"));
        audioRef.current = fallbackAudio;
      });
      audioRef.current = audio;
      setPlayingAudioId(contentId);
    }
  };

  // Open Cinema Lightbox to view Image/Video directly from Gemini
  const openCinemaModal = (item) => {
    setCinemaItem(item);
    setCinemaModalOpen(true);
  };

  const closeCinemaModal = () => {
    setCinemaModalOpen(false);
    setCinemaItem(null);
  };

  // Poll live inspection steps while Live Flow modal is open
  useEffect(() => {
    if (!flowInspectorOpen) return;
    const sessionId = runningFlowLiveId || "latest";
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`${server}/api/instagram-agent/live-flow/${sessionId}`, {
          headers: authHeaders(),
        });
        if (res.ok) {
          const session = await res.json();
          setFlowInspectorSession(session);
        }
      } catch (_) {}
    }, 1000);

    return () => clearInterval(pollInterval);
  }, [runningFlowLiveId, flowInspectorOpen]);

  const openLiveFlowInspector = (contentId = null) => {
    if (contentId) setRunningFlowLiveId(contentId);
    setFlowInspectorOpen(true);
  };

  const publishNow = async (contentId) => {
    setSaving(true);
    try {
      const published = await request(`/content/${contentId}/publish`, "POST");
      notify(`Published ${published.type === "reel" ? "16:9 Video" : "16:9 Post"} to Instagram: ${published.topic}`);
      await load();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteContent = async (contentId) => {
    if (!window.confirm("Delete this draft permanently?")) return;
    try {
      await request(`/content/${contentId}`, "DELETE");
      notify("Content deleted.");
      await load();
    } catch (error) {
      notify(error.message, "error");
    }
  };

  const handleExchangeLongLivedToken = async () => {
    setExchangingToken(true);
    setTokenModalOpen(true);
    try {
      const res = await request("/exchange-token", "POST");
      setLongLivedResult(res);
      notify("Generated 60-Day Long-Lived Token!");
      await load();
    } catch (error) {
      notify(error.message, "error");
      setLongLivedResult({ error: error.message });
    } finally {
      setExchangingToken(false);
    }
  };

  const handleTestPexelsAndAudio = async () => {
    try {
      notify("Testing Pexels 16:9 HD Media & Freesound Audio APIs...", "info");
      const pRes = await request("/pexels/test", "POST", {
        topic: "mountain sunrise mist",
        realm: "🌅 Nature's Morning",
        type: mediaMode === "image" ? "post" : "reel",
        orientation: "portrait",
      });
      const fRes = await request("/freesound/test", "POST", {
        topic: "mountain sunrise mist",
        realm: "🌅 Nature's Morning",
        soundscape: "birds morning ambient",
      });
      notify(`✅ Success! Pexels HD ${pRes.type} & Freesound Audio connected!`, "success");
    } catch (err) {
      notify(`Test Notice: ${err.message}`, "error");
    }
  };

  if (!data || !config) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress sx={{ color: "#09090b" }} />
      </Box>
    );
  }

  const { account, accountError, content, activities } = data;
  const set = (key, value) => setConfig((previous) => ({ ...previous, [key]: value }));
  const currentFollowersDisplay = liveFollowers !== null ? liveFollowers : (account?.followers_count ?? null);

  return (
    <Box sx={{ maxWidth: 1120, mx: "auto", pb: 6, color: "#09090b" }}>
      {/* ── TOP HEADER (CLEAN LIGHT DESIGN) ── */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          flexWrap: "wrap",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              fontWeight: 800,
              color: "#71717a",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            Autonomous Growth Engine · 12-Series Nature & Earth Studio
          </Typography>
          <Typography sx={{ ...titleStyle, fontSize: { xs: 24, sm: 30 }, mt: 0.3 }}>
            Instagram Nature Studio & Growth Agent
          </Typography>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#71717a", fontSize: 13, mt: 0.5 }}>
            Automated daily 12-series rotation generating unique 16:9 images and videos with matching nature background music.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AutoAwesomeIcon fontSize="small" />}
            onClick={handleTestPexelsAndAudio}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              color: "#09090b",
              borderColor: "#d4d4d8",
              fontWeight: 700,
              bgcolor: "#ffffff",
              "&:hover": { bgcolor: "#f4f4f5", borderColor: "#09090b" },
            }}
          >
            Test Pexels & Audio
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon fontSize="small" />}
            onClick={load}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              color: "#09090b",
              borderColor: "#d4d4d8",
              fontWeight: 700,
              bgcolor: "#ffffff",
              "&:hover": { bgcolor: "#f4f4f5", borderColor: "#09090b" },
            }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<VpnKeyIcon fontSize="small" />}
            onClick={handleExchangeLongLivedToken}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              bgcolor: "#09090b",
              color: "#ffffff",
              fontWeight: 700,
              "&:hover": { bgcolor: "#27272a" },
            }}
          >
            60-Day Token
          </Button>
        </Box>
      </Box>

      {/* ── REAL-TIME LIVE FOLLOWER & STATS (INDIVIDUAL WHITE BOXES) ── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
          gap: 2,
          mb: 3,
        }}
      >
        {/* Box 1: Live Followers */}
        <Paper sx={{ ...whiteCard, p: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#22c55e",
                  boxShadow: "0 0 8px rgba(34, 197, 94, 0.6)",
                  animation: "pulse 1.8s infinite",
                  "@keyframes pulse": {
                    "0%": { opacity: 0.4 },
                    "50%": { opacity: 1 },
                    "100%": { opacity: 0.4 },
                  },
                }}
              />
              <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Live Followers
              </Typography>
            </Box>
            <PeopleAltOutlinedIcon sx={{ color: "#71717a", fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 32, fontWeight: 900, color: "#09090b", lineHeight: 1.1 }}>
            {currentFollowersDisplay !== null ? Number(currentFollowersDisplay).toLocaleString() : "..."}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#71717a", mt: 0.8 }}>
            {account?.username ? `@${account.username}` : "Instagram Active"} {lastFollowerCheck && `· ${lastFollowerCheck}`}
          </Typography>
        </Paper>

        {/* Box 2: 24H Reach */}
        <Paper sx={{ ...whiteCard, p: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              24H Reach
            </Typography>
            <TrendingUpIcon sx={{ color: "#71717a", fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 32, fontWeight: 900, color: "#09090b", lineHeight: 1.1 }}>
            {account?.reach !== null && account?.reach !== undefined ? Number(account.reach).toLocaleString() : "Active"}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#71717a", mt: 0.8 }}>
            Estimated unique audience reach
          </Typography>
        </Paper>

        {/* Box 3: Total Posts */}
        <Paper sx={{ ...whiteCard, p: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Total Media
            </Typography>
            <MovieCreationIcon sx={{ color: "#71717a", fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 32, fontWeight: 900, color: "#09090b", lineHeight: 1.1 }}>
            {account?.mediaCount !== null && account?.mediaCount !== undefined ? account.mediaCount : (account?.media_count || 0)}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#71717a", mt: 0.8 }}>
            Published reels & photos
          </Typography>
        </Paper>

        {/* Box 4: Agent Scheduler Status */}
        <Paper sx={{ ...whiteCard, p: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              12-Series Loop
            </Typography>
            <LoopIcon sx={{ color: "#71717a", fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 24, fontWeight: 800, color: config.running ? "#16a34a" : "#71717a", lineHeight: 1.2 }}>
            {config.running ? "Looping Daily" : "Paused"}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#71717a", mt: 0.8 }}>
            Daily {mediaMode === "image" ? "Image" : "Video"} at {config.dailyPostTime || "07:00"} IST
          </Typography>
        </Paper>
      </Box>

      {accountError && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: "12px", border: "1px solid #e4e4e7" }}>
          {accountError}
        </Alert>
      )}

      {/* ── 12 NATURE SERIES STUDIO GRID WITH PERSISTENT ADMIN IMAGE VS VIDEO SELECTOR ── */}
      <Paper sx={{ ...whiteCard, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1.5 }}>
          <Box>
            <Typography sx={{ ...titleStyle, fontSize: 18 }}>
              12 Nature & Earth Series Studio
            </Typography>
            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#71717a", fontSize: 13 }}>
              Select series or let autonomous daily scheduler rotate through all 12 series with tailored background music:
            </Typography>
          </Box>

          {/* Persistent Admin Image vs Video Mode Switcher */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: "#f4f4f5", p: 0.5, borderRadius: "10px", border: "1px solid #e4e4e7" }}>
            <Button
              size="small"
              startIcon={<ImageIcon fontSize="small" />}
              onClick={() => handleSwitchMode("image")}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontSize: 12,
                fontWeight: 700,
                px: 2,
                py: 0.6,
                bgcolor: mediaMode === "image" ? "#09090b" : "transparent",
                color: mediaMode === "image" ? "#ffffff" : "#71717a",
                "&:hover": { bgcolor: mediaMode === "image" ? "#27272a" : "#e4e4e7" },
              }}
            >
              🖼️ 16:9 Image Mode {mediaMode === "image" && "✓"}
            </Button>
            <Button
              size="small"
              startIcon={<MovieCreationIcon fontSize="small" />}
              onClick={() => handleSwitchMode("video")}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontSize: 12,
                fontWeight: 700,
                px: 2,
                py: 0.6,
                bgcolor: mediaMode === "video" ? "#09090b" : "transparent",
                color: mediaMode === "video" ? "#ffffff" : "#71717a",
                "&:hover": { bgcolor: mediaMode === "video" ? "#27272a" : "#e4e4e7" },
              }}
            >
              🎬 16:9 Video Mode {mediaMode === "video" && "✓"}
            </Button>
          </Box>
        </Box>

        {/* 12 Series Grid */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }, gap: 1.5 }}>
          {NATURE_REALMS.map((r) => (
            <Paper
              key={r.id}
              onClick={() => {
                setSelectedRealm(r.realm);
                generate(null, r.realm, mediaMode === "image" ? "post" : "reel");
              }}
              sx={{
                p: 2,
                borderRadius: "12px",
                border: selectedRealm === r.realm ? "1.5px solid #09090b" : "1px solid #e4e4e7",
                bgcolor: selectedRealm === r.realm ? "#f4f4f5" : "#ffffff",
                cursor: "pointer",
                transition: "all 0.15s ease",
                "&:hover": {
                  bgcolor: "#f4f4f5",
                  borderColor: "#09090b",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.8 }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 13.5, color: "#09090b" }}>
                  {r.title}
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: "#71717a", lineHeight: 1.4 }}>
                {r.sample}
              </Typography>
              <Box sx={{ mt: 1.2, display: "flex", justifyContent: "flex-end" }}>
                <Chip
                  label={mediaMode === "image" ? "Generate Image" : "Generate Video"}
                  size="small"
                  sx={{ bgcolor: "#09090b", color: "#ffffff", fontWeight: 700, fontSize: 9.5, height: 19 }}
                />
              </Box>
            </Paper>
          ))}
        </Box>

        <Divider sx={{ my: 2.5, borderColor: "#f4f4f5" }} />

        {/* Custom Prompt Generator */}
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
          <TextField
            label="Custom Nature Scene / Story"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Bengal Tiger walking through rain-washed jungle at sunrise"
            sx={{ ...field, flex: 1, minWidth: 260 }}
          />
          <FormControl sx={{ ...field, minWidth: 220 }}>
            <InputLabel>Nature Series</InputLabel>
            <Select
              label="Nature Series"
              value={selectedRealm}
              onChange={(e) => setSelectedRealm(e.target.value)}
            >
              {NATURE_REALMS.map((r) => (
                <MenuItem key={r.id} value={r.realm}>
                  {r.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={mediaMode === "image" ? <ImageIcon fontSize="small" /> : <AutoAwesomeIcon fontSize="small" />}
            onClick={() => generate(null, null, mediaMode === "image" ? "post" : "reel")}
            disabled={saving}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              bgcolor: "#09090b",
              color: "#ffffff",
              fontWeight: 700,
              px: 3,
              py: 1.3,
              "&:hover": { bgcolor: "#27272a" },
            }}
          >
            {mediaMode === "image" ? "Generate 16:9 Image" : "Generate 16:9 Video"}
          </Button>
        </Box>
      </Paper>

      {/* ── DAILY SCHEDULER SETTINGS (WHITE BOX) ── */}
      <Paper sx={{ ...whiteCard, mb: 3 }}>
        <Typography sx={{ ...titleStyle, fontSize: 18, mb: 0.5 }}>12-Series Daily Rotational Scheduler</Typography>
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#71717a", fontSize: 13, mb: 2 }}>
          Autonomous daily cycle: 🌅 Morning ➔ 🌄 Sunset ➔ 🦌 Wildlife ➔ 🌲 Forests ➔ 🌊 Ocean ➔ 🌧️ Rain ➔ 🌌 Night ➔ 🦋 Tiny Wonders ➔ 🏔️ Mountains ➔ 🍂 Seasons ➔ 🐘 World Wildlife ➔ 🌍 One Planet (Forever Unique).
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr 1fr" }, gap: 2 }}>
          <TextField
            label="Niche Focus"
            value={config.niche || "4K Nature & Earth Cinematography, Relaxation & Visual Serenity"}
            onChange={(e) => set("niche", e.target.value)}
            sx={field}
            fullWidth
          />
          <FormControl sx={field} fullWidth>
            <InputLabel>Default Post Format</InputLabel>
            <Select
              label="Default Post Format"
              value={mediaMode}
              onChange={(e) => handleSwitchMode(e.target.value)}
            >
              <MenuItem value="video">🎬 16:9 Video Reel (with Music)</MenuItem>
              <MenuItem value="image">🖼️ 16:9 4K Nature Image (with Music)</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Daily Post Time (IST) ⏰"
            value={config.dailyPostTime || "07:00"}
            onChange={(e) => set("dailyPostTime", e.target.value)}
            placeholder="e.g. 07:00 or 18:00"
            helperText="Automatic daily post time"
            sx={field}
            fullWidth
          />
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, mt: 2 }}>
          <TextField
            label="Pexels API Key (for 1080p/4K HD 16:9 Portrait Videos & Photos)"
            type="password"
            value={config.pexelsApiKey || ""}
            onChange={(e) => set("pexelsApiKey", e.target.value)}
            placeholder="Enter Pexels API Key"
            sx={field}
            fullWidth
          />
          <TextField
            label="Freesound API Key (for Matching Background Soundscapes)"
            type="password"
            value={config.freesoundApiKey || ""}
            onChange={(e) => set("freesoundApiKey", e.target.value)}
            placeholder="Enter Freesound API Key"
            sx={field}
            fullWidth
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1.2, mt: 2.5, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            onClick={saveConfig}
            disabled={saving}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              borderColor: "#d4d4d8",
              color: "#09090b",
              fontWeight: 700,
            }}
          >
            Save Settings
          </Button>
          <Button
            variant="contained"
            onClick={toggleAgent}
            disabled={saving}
            startIcon={config.running ? <StopIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              bgcolor: config.running ? "#ef4444" : "#09090b",
              color: "#ffffff",
              fontWeight: 700,
              "&:hover": { bgcolor: config.running ? "#dc2626" : "#27272a" },
            }}
          >
            {config.running ? "Pause Scheduler" : "Start 12-Series Loop"}
          </Button>
        </Box>
      </Paper>

      {/* ── CONTENT QUEUE WITH AUDIO PREVIEW & MEDIA ACTIONS ── */}
      <Paper sx={{ ...whiteCard, mb: 3 }}>
        <Typography sx={{ ...titleStyle, fontSize: 18, mb: 2 }}>Content Queue & Media Items</Typography>
        {content.length === 0 ? (
          <Typography sx={{ color: "#71717a", fontSize: 13 }}>
            No drafts yet. Click any Nature Series above to generate your first 16:9 nature creation!
          </Typography>
        ) : (
          content.map((item) => {
            const isVideoItem = item.type === "reel" || item.assetUrl?.toLowerCase().endsWith(".mp4") || item.assetUrl?.toLowerCase().includes("/video/upload/");
            const audioTrackUrl = item.audioTrack?.audioUrl || "https://res.cloudinary.com/dlsetxkjj/video/upload/v1788012256/instagram-agent/audio/ultimate_dreams_anthem.mp3";
            const isPlayingThis = playingAudioId === item._id;

            return (
              <Box
                key={item._id}
                sx={{
                  borderTop: "1px solid #f4f4f5",
                  pt: 3,
                  mt: 3,
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "380px 1fr" },
                  gap: 2.5,
                }}
              >
                {/* 16:9 Media Preview Container (Clickable for Instant Audio / Video Playback) */}
                <Box
                  onClick={() => item.assetUrl ? openCinemaModal(item) : null}
                  sx={{
                    width: "100%",
                    aspectRatio: "16 / 9",
                    borderRadius: "12px",
                    overflow: "hidden",
                    bgcolor: "#000000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: isPlayingThis ? "2px solid #22c55e" : "1px solid #27272a",
                    position: "relative",
                    cursor: item.assetUrl ? "pointer" : "default",
                    transition: "all 0.2s ease",
                    "&:hover": item.assetUrl ? {
                      transform: "scale(1.01)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    } : {},
                  }}
                >
                  {item.assetUrl ? (
                    isVideoItem ? (
                      <video
                        src={item.assetUrl}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        controls
                        loop
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
                        <img
                          src={item.assetUrl}
                          alt={item.topic}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                        {/* Play Music Overlay for Image */}
                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            bgcolor: isPlayingThis ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.15)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: isPlayingThis ? 1 : 0.85,
                            transition: "opacity 0.2s ease",
                            "&:hover": { opacity: 1 },
                          }}
                        >
                          <Box
                            sx={{
                              width: 44,
                              height: 44,
                              borderRadius: "50%",
                              bgcolor: isPlayingThis ? "#22c55e" : "rgba(0,0,0,0.7)",
                              color: "#ffffff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backdropFilter: "blur(4px)",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                            }}
                          >
                            {isPlayingThis ? <PauseIcon /> : <PlayArrowIcon />}
                          </Box>
                        </Box>
                      </Box>
                    )
                  ) : item.mediaGenerationStatus === "generating" || generatingMediaId === item._id ? (
                    <Box sx={{ textAlign: "center", p: 2 }}>
                      <CircularProgress size={28} sx={{ color: "#ffffff" }} />
                      <Typography sx={{ fontSize: 11, color: "#a1a1aa", mt: 1 }}>Fetching 16:9 {item.type === "post" ? "Image" : "Reel"} via Pexels & Freesound APIs...</Typography>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: "center", p: 2 }}>
                      {item.type === "post" ? (
                        <ImageIcon sx={{ color: "#52525b", fontSize: 36 }} />
                      ) : (
                        <MovieCreationIcon sx={{ color: "#52525b", fontSize: 36 }} />
                      )}
                      <Typography sx={{ fontSize: 11, color: "#71717a", mt: 0.5 }}>No Media Fetched</Typography>
                    </Box>
                  )}
                  
                  {/* Aspect & Audio Badges */}
                  <Chip
                    icon={isVideoItem ? <MusicNoteIcon style={{ color: "#ffffff", fontSize: 12 }} /> : <ImageIcon style={{ color: "#ffffff", fontSize: 12 }} />}
                    label={isVideoItem ? "16:9 Portrait Reel + Sound" : "16:9 Portrait Post + Sound"}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      bgcolor: "rgba(0,0,0,0.85)",
                      color: "#ffffff",
                      fontSize: 9,
                      fontWeight: 700,
                      height: 20,
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  />

                  {item.assetUrl && (
                    <Chip
                      icon={<FullscreenIcon style={{ color: "#ffffff", fontSize: 12 }} />}
                      label="View Full"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "rgba(0,0,0,0.85)",
                        color: "#ffffff",
                        fontSize: 9,
                        fontWeight: 700,
                        height: 20,
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                    />
                  )}
                </Box>

                {/* Details & Action Controls */}
                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                        <Chip
                          label={item.status === "published" ? "Published" : item.status === "ready" ? "Ready" : "Draft"}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            bgcolor: item.status === "published" ? "#09090b" : item.status === "ready" ? "#27272a" : "#f4f4f5",
                            color: item.status === "draft" ? "#09090b" : "#ffffff",
                            fontSize: 11,
                          }}
                        />
                        <Chip
                          label={item.themeCategory || "Nature Series"}
                          size="small"
                          sx={{ bgcolor: "#f4f4f5", color: "#09090b", fontWeight: 700, fontSize: 11 }}
                        />
                        <Chip
                          label={item.type === "post" ? "🖼️ Image Post" : "🎬 Video Reel"}
                          size="small"
                          sx={{ bgcolor: "#fafafa", border: "1px solid #e4e4e7", color: "#09090b", fontWeight: 700, fontSize: 11 }}
                        />
                        {item.pexelsPhotographer && (
                          <Chip
                            label={`📸 ${item.pexelsPhotographer}`}
                            size="small"
                            sx={{ bgcolor: "#f4f4f5", color: "#71717a", fontSize: 10 }}
                          />
                        )}
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => deleteContent(item._id)}
                        sx={{ color: "#71717a", "&:hover": { color: "#ef4444" } }}
                        title="Delete draft"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 16, mt: 1.2 }}>
                      {item.topic}
                    </Typography>

                    {/* Freesound Matched Soundscape & Media Direction */}
                    <Box
                      sx={{
                        p: 1.25,
                        bgcolor: "#fafafa",
                        borderRadius: "8px",
                        border: "1px solid #e4e4e7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <AutoAwesomeIcon sx={{ fontSize: 16, color: "#22c55e" }} />
                        <Box>
                          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#09090b" }}>
                            🎵 Matched Freesound Background Audio
                          </Typography>
                          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#71717a" }}>
                            {item.freesoundTitle || item.soundscape || item.trendingAudioSuggestion || "Curated specifically for this scene"}
                          </Typography>
                        </Box>
                      </Box>
                      {item.assetUrl && (
                        <Button
                          size="small"
                          startIcon={<VisibilityIcon fontSize="small" />}
                          onClick={(e) => {
                            e.stopPropagation();
                            openCinemaModal(item);
                          }}
                          sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#09090b",
                            bgcolor: "#ffffff",
                            border: "1px solid #d4d4d8",
                            "&:hover": { bgcolor: "#f4f4f5" },
                          }}
                        >
                          Cinema Preview
                        </Button>
                      )}
                    </Box>

                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", whiteSpace: "pre-wrap", fontSize: 13, mt: 1, color: "#3f3f46", lineHeight: 1.5 }}>
                      {item.caption}
                    </Typography>

                    {item.hashtags?.length > 0 && (
                      <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#71717a", fontSize: 12, mt: 0.8 }}>
                        {item.hashtags.join(" ")}
                      </Typography>
                    )}
                  </Box>

                  {/* ── Action Panel with Image and Video Generation Options ── */}
                  <Box
                    sx={{
                      mt: 2,
                      p: 1.5,
                      borderRadius: "10px",
                      bgcolor: "#fafafa",
                      border: "1px solid #e4e4e7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 1.5,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AutoAwesomeIcon sx={{ color: "#09090b", fontSize: 16 }} />
                      <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "#09090b" }}>
                        {item.assetUrl
                          ? `16:9 ${isVideoItem ? "Video Ready with Song" : "4K Image Ready with Song"}`
                          : item.mediaGenerationStatus === "generating" || generatingMediaId === item._id
                          ? "Gemini is rendering creation..."
                          : item.mediaGenerationError
                          ? `Status: ${item.mediaGenerationError}`
                          : "Ready to render with Gemini"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityIcon fontSize="small" />}
                        onClick={() => openLiveFlowInspector(item._id)}
                        sx={{ borderRadius: "8px", textTransform: "none", fontSize: 11, fontWeight: 700, color: "#09090b", borderColor: "#d4d4d8" }}
                      >
                        Live Flow
                      </Button>
                      
                      {/* Admin Image or Video Choice */}
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<ImageIcon fontSize="small" />}
                        onClick={() => handleGenerateMedia(item._id, "post")}
                        disabled={generatingMediaId === item._id || saving}
                        sx={{ borderRadius: "8px", textTransform: "none", fontSize: 11, fontWeight: 700, color: "#09090b", borderColor: "#d4d4d8" }}
                      >
                        {item.assetUrl && !isVideoItem ? "Regen Image" : "16:9 Image"}
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<MovieCreationIcon fontSize="small" />}
                        onClick={() => handleGenerateMedia(item._id, "reel")}
                        disabled={generatingMediaId === item._id || saving}
                        sx={{ borderRadius: "8px", textTransform: "none", fontSize: 11, fontWeight: 700, color: "#09090b", borderColor: "#d4d4d8" }}
                      >
                        {item.assetUrl && isVideoItem ? "Regen Video" : "16:9 Video"}
                      </Button>

                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => publishNow(item._id)}
                        disabled={!item.assetUrl || saving}
                        sx={{ borderRadius: "8px", textTransform: "none", fontSize: 11, fontWeight: 700, bgcolor: "#09090b", color: "#ffffff", "&:hover": { bgcolor: "#27272a" } }}
                      >
                        Publish Now
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
      </Paper>

      {/* ── CINEMA FULL PREVIEW MODAL (IMAGE/VIDEO + AUDIO SIMULTANEOUSLY) ── */}
      <Dialog
        open={cinemaModalOpen}
        onClose={closeCinemaModal}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", bgcolor: "#09090b", color: "#ffffff" } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #27272a" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AutoAwesomeIcon sx={{ color: "#22c55e", fontSize: 20 }} />
            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 16 }}>
              16:9 Cinema Preview · {cinemaItem?.type === "reel" ? "Animated Reel + Audio" : "Photorealistic Image + Audio"}
            </Typography>
          </Box>
          <IconButton onClick={closeCinemaModal} size="small" sx={{ color: "#a1a1aa" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2.5 }}>
          {cinemaItem && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* 16:9 Full Viewport Display */}
              <Box
                sx={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  borderRadius: "12px",
                  overflow: "hidden",
                  bgcolor: "#000000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #27272a",
                }}
              >
                {cinemaItem.type === "reel" || cinemaItem.assetUrl?.toLowerCase().endsWith(".mp4") ? (
                  <video
                    src={cinemaItem.assetUrl}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    controls
                    autoPlay
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={cinemaItem.assetUrl}
                    alt={cinemaItem.topic}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                )}
              </Box>

              {/* Gemini Creation Info Bar */}
              <Box sx={{ p: 2, bgcolor: "#18181b", borderRadius: "10px", border: "1px solid #27272a", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1.5 }}>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: 14, color: "#ffffff" }}>
                    {cinemaItem.soundscape || cinemaItem.trendingAudioSuggestion || "Gemini Native Creation"}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#a1a1aa", mt: 0.3 }}>
                    Series: {cinemaItem.themeCategory} · High-Fidelity 16:9 Format
                  </Typography>
                </Box>
              </Box>

              {/* Caption */}
              <Box sx={{ p: 2, bgcolor: "#18181b", borderRadius: "10px", border: "1px solid #27272a" }}>
                <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#ffffff", mb: 0.5 }}>
                  {cinemaItem.topic}
                </Typography>
                <Typography sx={{ fontSize: 13, color: "#d4d4d8", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                  {cinemaItem.caption}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #27272a" }}>
          <Button onClick={closeCinemaModal} sx={{ color: "#a1a1aa", textTransform: "none" }}>
            Close
          </Button>
          {cinemaItem && (
            <Button
              variant="contained"
              onClick={() => {
                publishNow(cinemaItem._id);
                closeCinemaModal();
              }}
              sx={{ bgcolor: "#ffffff", color: "#09090b", fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: "#e4e4e7" } }}
            >
              Publish to Instagram Now
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* ── RECENT AUDIT LOG (WHITE BOX) ── */}
      <Paper sx={whiteCard}>
        <Typography sx={{ ...titleStyle, fontSize: 18, mb: 2 }}>Agent Audit Log</Typography>
        {activities.length === 0 ? (
          <Typography sx={{ color: "#71717a", fontSize: 13 }}>No recent activity logged.</Typography>
        ) : (
          activities.slice(0, 6).map((act) => (
            <Box key={act._id} sx={{ py: 1, borderBottom: "1px solid #f4f4f5" }}>
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#09090b" }}>
                {act.description}
              </Typography>
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#a1a1aa" }}>
                {new Date(act.createdAt).toLocaleString()} · {act.action}
              </Typography>
            </Box>
          ))
        )}
      </Paper>

      {/* ── LIVE FLOW INSPECTOR MODAL WITH REAL-TIME BROWSER PREVIEW ── */}
      <Dialog
        open={flowInspectorOpen}
        onClose={() => setFlowInspectorOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: "14px", border: "1px solid #e4e4e7" } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: flowInspectorSession?.status === "running" ? "#22c55e" : "#09090b",
                animation: flowInspectorSession?.status === "running" ? "pulse 1.5s infinite" : "none",
                "@keyframes pulse": {
                  "0%": { opacity: 0.3 },
                  "50%": { opacity: 1 },
                  "100%": { opacity: 0.3 },
                },
              }}
            />
            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 16 }}>
              Gemini Live Flow Inspector ({flowInspectorSession?.mediaType === "image" ? "16:9 Image" : "16:9 Video"})
            </Typography>
          </Box>
          <IconButton onClick={() => setFlowInspectorOpen(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 2.5 }}>
          {flowInspectorSession ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Prompt Info Card */}
              <Box sx={{ p: 1.8, bgcolor: "#fafafa", borderRadius: "10px", border: "1px solid #e4e4e7" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 11, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Active Prompt Sent to Gemini
                  </Typography>
                  <Chip
                    label={flowInspectorSession.mediaType === "image" ? "🖼️ Image Mode" : "🎬 Video Mode"}
                    size="small"
                    sx={{ bgcolor: "#09090b", color: "#ffffff", fontWeight: 700, fontSize: 10, height: 20 }}
                  />
                </Box>
                <Typography sx={{ fontWeight: 600, fontSize: 13, color: "#09090b", mt: 0.4 }}>
                  "{flowInspectorSession.prompt}"
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                  <Chip
                    label={`Status: ${flowInspectorSession.status?.toUpperCase() || "RUNNING"}`}
                    size="small"
                    sx={{
                      bgcolor: flowInspectorSession.status === "completed" ? "#09090b" : flowInspectorSession.status === "failed" ? "#ef4444" : "#22c55e",
                      color: "#ffffff",
                      fontWeight: 800,
                      fontSize: 10,
                      height: 20,
                    }}
                  />
                  {flowInspectorSession.startedAt && (
                    <Typography sx={{ fontSize: 11, color: "#71717a" }}>
                      Started: {new Date(flowInspectorSession.startedAt).toLocaleTimeString()}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Real-Time Browser Viewport Screen */}
              {flowInspectorSession.lastScreenshot && (
                <Box sx={{ borderRadius: "10px", overflow: "hidden", border: "1px solid #18181b", bgcolor: "#000000" }}>
                  <Box sx={{ p: 1, bgcolor: "#18181b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#ffffff", letterSpacing: "0.5px" }}>
                      🔴 LIVE CHROMIUM VIEWPORT SCREENSHOT
                    </Typography>
                    <Typography sx={{ fontSize: 10, color: "#a1a1aa" }}>Live Feed</Typography>
                  </Box>
                  <img
                    src={flowInspectorSession.lastScreenshot}
                    alt="Live Gemini Browser Screen"
                    style={{ width: "100%", maxHeight: 340, objectFit: "contain", display: "block" }}
                  />
                </Box>
              )}

              {/* Live Flow Steps Timeline */}
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 12, color: "#71717a", textTransform: "uppercase", mb: 1 }}>
                  Live Execution Steps ({flowInspectorSession.steps?.length || 0})
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {flowInspectorSession.steps?.map((st, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        p: 1.5,
                        bgcolor: idx === flowInspectorSession.steps.length - 1 ? "#ffffff" : "#fafafa",
                        borderRadius: "8px",
                        border: idx === flowInspectorSession.steps.length - 1 ? "1.5px solid #09090b" : "1px solid #e4e4e7",
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#09090b" }}>{st.step}</Typography>
                        <Typography sx={{ fontSize: 11, color: "#71717a" }}>{st.timestamp}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 12, color: "#52525b", mt: 0.3 }}>{st.detail}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Error Alert if failed */}
              {flowInspectorSession.error && (
                <Alert severity="error" sx={{ borderRadius: "8px" }}>
                  {flowInspectorSession.error}
                </Alert>
              )}
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", py: 5 }}>
              <CircularProgress size={28} sx={{ color: "#09090b" }} />
              <Typography sx={{ mt: 1.5, fontSize: 12, color: "#71717a" }}>Waiting for active Gemini live flow...</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setFlowInspectorOpen(false)} sx={{ textTransform: "none", color: "#09090b", fontWeight: 700 }}>
            Close
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
