import React, { useCallback, useEffect, useState, useRef } from "react";
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
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LandscapeIcon from "@mui/icons-material/Landscape";
import ForestIcon from "@mui/icons-material/Forest";
import WaterIcon from "@mui/icons-material/Water";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import SpaIcon from "@mui/icons-material/Spa";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import server from "../../shared/environment";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const card = {
  borderRadius: "20px",
  border: "1px solid #f0f0f0",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  p: { xs: 2, sm: 3 },
  background: "#fff",
};

const title = {
  fontFamily: "'Playfair Display', serif",
  fontWeight: 800,
  color: "#1a1a2e",
};

const field = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "13px",
    fontFamily: "'DM Sans', sans-serif",
  },
  "& .MuiInputLabel-root": { fontFamily: "'DM Sans', sans-serif" },
};

const NATURE_REALMS = [
  { id: "celestial", title: "Celestial & Aurora", realm: "Celestial & Aurora", emoji: "🌌", icon: <NightsStayIcon />, sample: "Bioluminescent Aurora over Arctic Fjord & Milky Way Core", color: "#6366f1", bg: "#eef2ff" },
  { id: "water", title: "Mystic Waterfalls & Ocean", realm: "Mystic Waters", emoji: "🌊", icon: <WaterIcon />, sample: "Emerald Jungle Waterfall Lagoon & Glowing Blue Surf", color: "#06b6d4", bg: "#ecfeff" },
  { id: "forest", title: "Ancient Forests & Zen", realm: "Ancient Forests", emoji: "🌿", icon: <ForestIcon />, sample: "Misty Giant Redwoods with God Rays & Kyoto Bamboo Fireflies", color: "#10b981", bg: "#ecfdf5" },
  { id: "blossom", title: "Blooming Wilds & Sakura", realm: "Blooming Wilds", emoji: "🌸", icon: <SpaIcon />, sample: "Pink Sakura Mountain Stream & Purple Lavender Sunset", color: "#ec4899", bg: "#fdf2f8" },
  { id: "peaks", title: "Majestic Alpine Peaks", realm: "Majestic Peaks", emoji: "🏔️", icon: <LandscapeIcon />, sample: "Golden Hour Alpenglow Matterhorn & Crystal Reflection Lake", color: "#f59e0b", bg: "#fffbeb" },
  { id: "ice", title: "Frozen Wonders & Ice Caves", realm: "Frozen Wonders", emoji: "❄️", icon: <AcUnitIcon />, sample: "Sapphire Glacial Ice Cave & Sparkling Diamond Sunbeams", color: "#0284c7", bg: "#f0f9ff" },
];

export default function InstagramGrowthAgent() {
  const [data, setData] = useState(null);
  const [config, setConfig] = useState(null);
  const [topic, setTopic] = useState("");
  const [selectedRealm, setSelectedRealm] = useState("Celestial & Aurora");
  const [saving, setSaving] = useState(false);
  const [generatingMediaId, setGeneratingMediaId] = useState(null);
  const [snack, setSnack] = useState({ open: false, text: "", severity: "success" });

  // Live Followers Real-Time Polling State
  const [liveFollowers, setLiveFollowers] = useState(null);
  const [prevFollowers, setPrevFollowers] = useState(null);
  const [hasFollowerIncremented, setHasFollowerIncremented] = useState(false);
  const [lastFollowerCheck, setLastFollowerCheck] = useState(null);

  // Long-Lived Token Modal State
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [exchangingToken, setExchangingToken] = useState(false);
  const [longLivedResult, setLongLivedResult] = useState(null);

  // Live Google Gemini Autonomous Inspector State
  const [flowInspectorOpen, setFlowInspectorOpen] = useState(false);
  const [flowInspectorSession, setFlowInspectorSession] = useState(null);
  const [runningFlowLiveId, setRunningFlowLiveId] = useState(null);

  const notify = (text, severity = "success") => setSnack({ open: true, text, severity });

  const load = useCallback(async () => {
    try {
      const response = await fetch(`${server}/api/instagram-agent/overview`, {
        headers: authHeaders(),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not load Instagram agent.");
      setData(payload);
      setConfig(payload.config);

      if (payload.account?.followers !== null && payload.account?.followers !== undefined) {
        setLiveFollowers(payload.account.followers);
      }
    } catch (error) {
      notify(error.message, "error");
    }
  }, []);

  // Poll live followers count every 12 seconds in real-time
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
            setPrevFollowers(current);
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
      const updated = await request("/config", "POST", config);
      setConfig(updated);
      notify("Instagram growth configuration saved.");
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

  const generate = async (customTopic = null, customRealm = null) => {
    setSaving(true);
    try {
      const topicToUse = customTopic || topic;
      const realmToUse = customRealm || selectedRealm;
      const created = await request("/content/generate", "POST", {
        topic: topicToUse,
        category: realmToUse,
        type: "reel",
      });
      notify(`AI generated 8K Nature Reel [${realmToUse}]: "${created.topic}"`);
      setTopic("");
      await load();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateMedia = async (contentId) => {
    setGeneratingMediaId(contentId);
    setRunningFlowLiveId(contentId);
    setFlowInspectorOpen(true);
    notify("Starting Google Gemini to generate 8K Nature Video Reel...", "info");

    try {
      const updated = await request(`/content/${contentId}/generate-media`, "POST");
      notify(`Generated 8K Nature Video for: ${updated.topic}!`);
      await load();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setGeneratingMediaId(null);
      setRunningFlowLiveId(null);
    }
  };

  // Poll live inspection steps while Gemini is generating
  useEffect(() => {
    if (!runningFlowLiveId && !flowInspectorOpen) return;
    const sessionId = runningFlowLiveId || "live_session";
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`${server}/api/instagram-agent/google-flow/session/${sessionId}`, {
          headers: authHeaders(),
        });
        if (res.ok) {
          const session = await res.json();
          setFlowInspectorSession(session);
        }
      } catch (_) {}
    }, 1500);

    return () => clearInterval(pollInterval);
  }, [runningFlowLiveId, flowInspectorOpen]);

  const publishNow = async (contentId) => {
    setSaving(true);
    try {
      const published = await request(`/content/${contentId}/publish`, "POST");
      notify(`Published Nature Reel to Instagram: ${published.topic}`);
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
      notify("Successfully generated 60-Day Long-Lived Token!");
      await load();
    } catch (error) {
      notify(error.message, "error");
      setLongLivedResult({ error: error.message });
    } finally {
      setExchangingToken(false);
    }
  };

  const handleOpenGeminiLogin = async () => {
    try {
      notify("Opening Chrome Gemini window on your screen...", "info");
      const res = await request("/google-flow/open-login", "POST");
      notify(res.message || "Chrome opened! Sign in to Google, then close the browser.");
    } catch (err) {
      notify(err.message, "error");
    }
  };

  if (!data || !config) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const { account, accountError, content, activities, apiConfigured } = data;
  const set = (key, value) => setConfig((previous) => ({ ...previous, [key]: value }));

  const currentFollowersDisplay = liveFollowers !== null ? liveFollowers : (account?.followers_count ?? null);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", pb: 4 }}>
      {/* Top Header */}
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
              color: "#059669",
              letterSpacing: "1.5px",
            }}
          >
            4K NATURE & EARTH REELS · AUTONOMOUS AI AGENT
          </Typography>
          <Typography sx={{ ...title, fontSize: { xs: 26, sm: 32 }, mt: 0.4 }}>
            Daily Nature Reels & Growth Agent
          </Typography>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#666", mt: 0.6 }}>
            Autonomous daily 8K Nature video reels (Aurora, Waterfalls, Ancient Forests, Alpine Peaks), Gemini animations with matching soundscapes, and live follower tracking.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<VpnKeyIcon />}
            onClick={handleOpenGeminiLogin}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              color: "#6d28d9",
              borderColor: "#6d28d9",
              fontWeight: 700,
              bgcolor: "#f5f3ff",
              "&:hover": { bgcolor: "#ede9fe", borderColor: "#5b21b6" },
            }}
          >
            🔑 Open Gemini Login
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={load}
            sx={{ borderRadius: "10px", textTransform: "none", color: "#1a1a2e" }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<VpnKeyIcon />}
            onClick={handleExchangeLongLivedToken}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              bgcolor: "#1a1a2e",
              fontWeight: 700,
            }}
          >
            Get 60-Day Token
          </Button>
        </Box>
      </Box>

      {/* ── REAL-TIME LIVE FOLLOWER TRACKER & ACCOUNT BANNER ── */}
      <Paper
        sx={{
          ...card,
          mb: 3,
          background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
            gap: 3,
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Follower Counter Display */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: "#34d399",
                  boxShadow: "0 0 12px #34d399",
                  animation: "pulse 1.5s infinite",
                  "@keyframes pulse": {
                    "0%": { transform: "scale(0.95)", opacity: 0.8 },
                    "50%": { transform: "scale(1.3)", opacity: 1 },
                    "100%": { transform: "scale(0.95)", opacity: 0.8 },
                  },
                }}
              />
              <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: "1.5px", color: "#a7f3d0", textTransform: "uppercase" }}>
                Live Follower Counter (Auto-Updating)
              </Typography>
              {hasFollowerIncremented && (
                <Chip
                  label="🔥 +New Follower!"
                  size="small"
                  sx={{ bgcolor: "#fbbf24", color: "#78350f", fontWeight: 800, fontSize: 11, animation: "bounce 1s infinite" }}
                />
              )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5, my: 0.5 }}>
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 900,
                  fontSize: { xs: 38, sm: 54 },
                  letterSpacing: "-1px",
                  lineHeight: 1,
                }}
              >
                {currentFollowersDisplay !== null ? Number(currentFollowersDisplay).toLocaleString() : "..."}
              </Typography>
              <Typography sx={{ fontSize: 18, color: "#d1fae5", fontWeight: 600 }}>Followers</Typography>
            </Box>

            <Typography sx={{ fontSize: 13, color: "#a7f3d0", mt: 0.5 }}>
              {account?.username ? `@${account.username}` : "Instagram Professional Account"} · {account?.media_count || 0} Published Posts {lastFollowerCheck && `· Polled at ${lastFollowerCheck}`}
            </Typography>
          </Box>

          {/* Quick Metrics Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1.5,
              background: "rgba(0, 0, 0, 0.2)",
              backdropFilter: "blur(10px)",
              p: 2,
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ fontSize: 11, color: "#a7f3d0", fontWeight: 700 }}>24H REACH</Typography>
              <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#fff", mt: 0.2 }}>
                {account?.reach !== null && account?.reach !== undefined ? account.reach.toLocaleString() : "Active"}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ fontSize: 11, color: "#a7f3d0", fontWeight: 700 }}>ENGAGEMENT</Typography>
              <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#fff", mt: 0.2 }}>
                {account?.engagement !== null && account?.engagement !== undefined ? `${account.engagement}%` : "High"}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ fontSize: 11, color: "#a7f3d0", fontWeight: 700 }}>STATUS</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 800, color: config.running ? "#34d399" : "#fca5a5", mt: 0.4 }}>
                {config.running ? "🟢 Running" : "⏸️ Paused"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {accountError && (
          <Alert severity="warning" sx={{ mt: 2, borderRadius: "12px", bgcolor: "rgba(255,255,255,0.9)", color: "#111" }}>
            {accountError}
          </Alert>
        )}
      </Paper>

      {/* ── 6 VIRAL 4K NATURE REELS STUDIOS ── */}
      <Paper sx={{ ...card, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1, flexWrap: "wrap", gap: 1 }}>
          <Typography sx={{ ...title, fontSize: 19 }}>
            🌿 6 Viral 4K Nature Reels Studios (1-Click AI Generation)
          </Typography>
          <Chip label="100% Unique · Never Repeated" size="small" sx={{ bgcolor: "#ecfdf5", color: "#059669", fontWeight: 800 }} />
        </Box>
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#777", fontSize: 13, mb: 2.5 }}>
          Select any Nature Realm below to instantly generate a breathtaking 8K animated video reel with matching atmospheric audio soundscape:
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
          {NATURE_REALMS.map((r) => (
            <Paper
              key={r.id}
              onClick={() => {
                setSelectedRealm(r.realm);
                generate(null, r.realm);
              }}
              sx={{
                p: 2.5,
                borderRadius: "16px",
                border: selectedRealm === r.realm ? `2px solid ${r.color}` : "1px solid #eef",
                bgcolor: selectedRealm === r.realm ? r.bg : "#fff",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                  borderColor: r.color,
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography sx={{ fontSize: 24 }}>{r.emoji}</Typography>
                <Chip label="Generate Reel" size="small" sx={{ bgcolor: r.color, color: "#fff", fontWeight: 700, fontSize: 10 }} />
              </Box>
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 15, color: "#1a1a2e" }}>
                {r.title}
              </Typography>
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#666", mt: 0.5 }}>
                {r.sample}
              </Typography>
            </Paper>
          ))}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Custom Nature Reel Prompt Builder */}
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
          <TextField
            label="Custom Nature Scene / Wonder (Optional)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Glowing Turquoise Glacial Lagoon in Iceland, Autumn Birch River Fog"
            sx={{ ...field, flex: 1, minWidth: 260 }}
          />
          <FormControl sx={{ ...field, minWidth: 200 }}>
            <InputLabel>Nature Realm</InputLabel>
            <Select
              label="Nature Realm"
              value={selectedRealm}
              onChange={(e) => setSelectedRealm(e.target.value)}
            >
              {NATURE_REALMS.map((r) => (
                <MenuItem key={r.id} value={r.realm}>
                  {r.emoji} {r.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AutoAwesomeIcon sx={{ color: "#ffd700" }} />}
            onClick={() => generate()}
            disabled={saving}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              background: "linear-gradient(135deg, #065f46 0%, #047857 100%)",
              color: "#fff",
              fontWeight: 800,
              px: 3,
              py: 1.3,
              boxShadow: "0 4px 14px rgba(4, 120, 87, 0.35)",
              "&:hover": {
                background: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
              },
            }}
          >
            ⚡ Generate 8K Nature Reel
          </Button>
        </Box>
      </Paper>

      {/* ── AUTOMATION STRATEGY & SCHEDULER SETTINGS ── */}
      <Paper sx={{ ...card, mb: 3 }}>
        <Typography sx={{ ...title, fontSize: 18, mb: 0.5 }}>⚙️ Daily Publishing Schedule & Strategy</Typography>
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#777", fontSize: 13, mb: 2.5 }}>
          The autonomous agent automatically drafts a 100% unique Nature Reel every day with matching atmospheric soundscape, generates 9:16 animations with Gemini, and publishes to Instagram at your chosen time.
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
          <TextField
            label="Niche Focus"
            value={config.niche || "4K Nature, Earth Cinematography, Relaxation & Visual Serenity"}
            onChange={(e) => set("niche", e.target.value)}
            sx={field}
            fullWidth
          />
          <TextField
            label="Daily Fixed Post Time (IST) ⏰"
            value={config.dailyPostTime || "07:00"}
            onChange={(e) => set("dailyPostTime", e.target.value)}
            placeholder="e.g. 07:00 (7:00 AM IST) or 18:00 (6:00 PM IST)"
            helperText="Autonomous agent generates & publishes 1 unique nature reel daily at this fixed time"
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
              borderRadius: "12px",
              textTransform: "none",
              borderColor: "#1a1a2e",
              color: "#1a1a2e",
              fontWeight: 700,
            }}
          >
            Save Strategy
          </Button>
          <Button
            variant="contained"
            onClick={toggleAgent}
            disabled={saving}
            startIcon={config.running ? <StopIcon /> : <PlayArrowIcon />}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              bgcolor: config.running ? "#d32f2f" : "#059669",
              fontWeight: 800,
              "&:hover": { bgcolor: config.running ? "#b71c1c" : "#047857" },
            }}
          >
            {config.running ? "Pause Autonomous Scheduler" : "Start Autonomous Scheduler"}
          </Button>
        </Box>
      </Paper>

      {/* ── CONTENT QUEUE & DAILY NATURE REELS ── */}
      <Paper sx={{ ...card, mb: 3 }}>
        <Typography sx={{ ...title, fontSize: 18, mb: 2 }}>Content Queue & Daily Nature Reels</Typography>
        {content.length === 0 ? (
          <Typography sx={{ color: "#888" }}>
            No drafts yet. Click any Nature Realm above to generate your first 8K nature reel!
          </Typography>
        ) : (
          content.map((item) => (
            <Box
              key={item._id}
              sx={{
                borderTop: "1px solid #f0f0f0",
                pt: 2.5,
                mt: 2.5,
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "190px 1fr" },
                gap: 2.5,
              }}
            >
              {/* 9:16 Vertical Video / Visual Preview */}
              <Box
                sx={{
                  width: "100%",
                  height: 270,
                  borderRadius: "16px",
                  overflow: "hidden",
                  bgcolor: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #eee",
                  position: "relative",
                }}
              >
                {item.assetUrl ? (
                  item.assetUrl.toLowerCase().endsWith(".mp4") || item.type === "reel" ? (
                    <video
                      src={item.assetUrl}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      controls
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={item.assetUrl}
                      alt={item.topic}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  )
                ) : item.mediaGenerationStatus === "generating" || generatingMediaId === item._id ? (
                  <Box sx={{ textAlign: "center", p: 1 }}>
                    <CircularProgress size={26} sx={{ color: "#34d399" }} />
                    <Typography sx={{ fontSize: 11, color: "#fff", mt: 1 }}>Generating in Gemini...</Typography>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center", p: 1 }}>
                    <ImageNotSupportedIcon sx={{ color: "#666", fontSize: 36 }} />
                    <Typography sx={{ fontSize: 11, color: "#aaa", mt: 0.5 }}>No Media Generated</Typography>
                  </Box>
                )}
                <Chip
                  label="Gemini 8K Video (9:16)"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    bgcolor: "rgba(0,0,0,0.8)",
                    color: "#34d399",
                    fontSize: 9,
                    fontWeight: 800,
                    height: 22,
                  }}
                />
              </Box>

              {/* Reel Details & Publishing Actions */}
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                      label={`${item.type} · ${item.status}`}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        bgcolor: item.status === "published" ? "#059669" : item.status === "ready" ? "#0284c7" : "#1a1a2e",
                        color: "#fff",
                      }}
                    />
                    <Chip
                      label={item.themeCategory || "Celestial & Aurora"}
                      size="small"
                      sx={{ bgcolor: "#ecfdf5", color: "#065f46", fontWeight: 800, fontSize: 11 }}
                    />
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => deleteContent(item._id)}
                    sx={{ color: "#d32f2f" }}
                    title="Delete post permanently"
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 16, mt: 1 }}>
                  {item.topic}
                </Typography>

                {/* Soundscape & Script Badge */}
                {item.trendingAudioSuggestion && (
                  <Box sx={{ mt: 0.8, display: "flex", alignItems: "center", gap: 0.8 }}>
                    <Chip
                      label={item.trendingAudioSuggestion}
                      size="small"
                      sx={{ bgcolor: "#f0fdf4", color: "#15803d", fontWeight: 700, fontSize: 11 }}
                    />
                  </Box>
                )}

                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", whiteSpace: "pre-wrap", fontSize: 13, mt: 1, color: "#333" }}>
                  {item.caption}
                </Typography>

                {item.hashtags?.length > 0 && (
                  <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#0284c7", fontSize: 12, mt: 0.8 }}>
                    {item.hashtags.join(" ")}
                  </Typography>
                )}

                {/* ── AUTONOMOUS Google Gemini Engine Status ── */}
                <Box
                  sx={{
                    mt: 1.5,
                    p: 1.5,
                    borderRadius: "12px",
                    bgcolor: item.assetUrl ? "#f0fdf4" : item.mediaGenerationError ? "#fef2f2" : "#f5f5f7",
                    border: `1px solid ${item.assetUrl ? "#bbf7d0" : item.mediaGenerationError ? "#fecaca" : "#e5e5ea"}`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AutoAwesomeIcon sx={{ color: item.assetUrl ? "#16a34a" : "#0284c7", fontSize: 18 }} />
                      <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700 }}>
                        {item.assetUrl
                          ? "✨ 8K Nature Reel Generated by Gemini & Hosted on Cloudinary"
                          : item.mediaGenerationStatus === "generating" || generatingMediaId === item._id
                          ? "⏳ Gemini is rendering the animated video..."
                          : item.mediaGenerationError
                          ? `⚠️ Status: ${item.mediaGenerationError}`
                          : "Gemini 8K Video Generator Ready"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleGenerateMedia(item._id)}
                        disabled={generatingMediaId === item._id || saving}
                        sx={{ borderRadius: "8px", textTransform: "none", fontSize: 11, fontWeight: 700 }}
                      >
                        {item.assetUrl ? "Regenerate Video" : "Generate 8K Video with Gemini"}
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => publishNow(item._id)}
                        disabled={!item.assetUrl || saving}
                        sx={{ borderRadius: "8px", textTransform: "none", fontSize: 11, fontWeight: 700, bgcolor: "#059669" }}
                      >
                        Publish to Instagram Now
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Paper>

      {/* ── RECENT AGENT ACTIVITIES ── */}
      <Paper sx={card}>
        <Typography sx={{ ...title, fontSize: 18, mb: 2 }}>⚡ Live Agent Activity Audit Log</Typography>
        {activities.length === 0 ? (
          <Typography sx={{ color: "#888" }}>No recent activities logged.</Typography>
        ) : (
          activities.slice(0, 8).map((act) => (
            <Box key={act._id} sx={{ py: 1, borderBottom: "1px solid #f5f5f5" }}>
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>
                {act.description}
              </Typography>
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#999" }}>
                {new Date(act.createdAt).toLocaleString()} · {act.action}
              </Typography>
            </Box>
          ))
        )}
      </Paper>

      {/* ── GOOGLE GEMINI REAL-TIME INSPECTOR DIALOG ── */}
      <Dialog
        open={flowInspectorOpen}
        onClose={() => setFlowInspectorOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: "18px" } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AutoAwesomeIcon sx={{ color: "#059669" }} />
            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 17 }}>
              Google Gemini Autonomous Video Inspector
            </Typography>
          </Box>
          <IconButton onClick={() => setFlowInspectorOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {flowInspectorSession ? (
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#555", mb: 1 }}>
                Prompt: "{flowInspectorSession.prompt}"
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}>
                {flowInspectorSession.steps?.map((st, idx) => (
                  <Box key={idx} sx={{ p: 1.5, bgcolor: "#f9fafb", borderRadius: "10px", border: "1px solid #eee" }}>
                    <Typography sx={{ fontWeight: 800, fontSize: 13, color: "#111" }}>{st.step}</Typography>
                    <Typography sx={{ fontSize: 12, color: "#666" }}>{st.detail}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress size={32} sx={{ color: "#059669" }} />
              <Typography sx={{ mt: 2, fontSize: 13, color: "#666" }}>Initializing Gemini connection...</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFlowInspectorOpen(false)} sx={{ textTransform: "none" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── 60-DAY LONG LIVED TOKEN MODAL ── */}
      <Dialog
        open={tokenModalOpen}
        onClose={() => setTokenModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "18px" } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>60-Day Meta Long-Lived Token</DialogTitle>
        <DialogContent dividers>
          {exchangingToken ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress />
              <Typography sx={{ mt: 2, fontSize: 13 }}>Exchanging token with Meta Graph API...</Typography>
            </Box>
          ) : longLivedResult?.error ? (
            <Alert severity="error">{longLivedResult.error}</Alert>
          ) : longLivedResult?.longLivedToken ? (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                Token generated! Valid for ~{longLivedResult.expiresInDays} days.
              </Alert>
              <TextField
                label="Long-Lived Access Token"
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
          <Button onClick={() => setTokenModalOpen(false)} sx={{ textTransform: "none" }}>
            Done
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={snack.open}
        autoHideDuration={5000}
        onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snack.severity} sx={{ borderRadius: "12px" }}>
          {snack.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}
