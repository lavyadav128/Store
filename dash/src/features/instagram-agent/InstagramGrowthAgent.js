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
  TextField,
  Typography,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MovieCreationIcon from "@mui/icons-material/MovieCreation";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import WaterIcon from "@mui/icons-material/Water";
import ForestIcon from "@mui/icons-material/Forest";
import SpaIcon from "@mui/icons-material/Spa";
import LandscapeIcon from "@mui/icons-material/Landscape";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import server from "../../shared/environment";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Sleek Monochrome Card & Field Styling matching Store Website
const card = {
  borderRadius: "16px",
  border: "1px solid #e4e4e7",
  boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
  p: { xs: 2.5, sm: 3.5 },
  background: "#ffffff",
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
  { id: "celestial", title: "Celestial & Aurora", realm: "Celestial & Aurora", icon: <NightsStayIcon fontSize="small" />, sample: "Bioluminescent Aurora over Arctic Fjord & Milky Way Galaxy Core" },
  { id: "water", title: "Mystic Waterfalls & Ocean", realm: "Mystic Waters", icon: <WaterIcon fontSize="small" />, sample: "Emerald Jungle Waterfall Lagoon & Neon Bioluminescent Waves" },
  { id: "forest", title: "Ancient Forests & Zen", realm: "Ancient Forests", icon: <ForestIcon fontSize="small" />, sample: "Misty Giant Redwoods with God Rays & Kyoto Bamboo Fireflies" },
  { id: "blossom", title: "Blooming Wilds & Sakura", realm: "Blooming Wilds", icon: <SpaIcon fontSize="small" />, sample: "Pink Sakura Mountain Streams & Sunset Purple Lavender Valleys" },
  { id: "peaks", title: "Majestic Alpine Peaks", realm: "Majestic Peaks", icon: <LandscapeIcon fontSize="small" />, sample: "Golden Alpenglow Mountain Summits & Crystal Alpine Lakes" },
  { id: "ice", title: "Frozen Wonders & Ice Caves", realm: "Frozen Wonders", icon: <AcUnitIcon fontSize="small" />, sample: "Sapphire Glacial Ice Caves & Diamond Sunbeam Refractions" },
];

export default function InstagramGrowthAgent() {
  const [data, setData] = useState(null);
  const [config, setConfig] = useState(null);
  const [topic, setTopic] = useState("");
  const [selectedRealm, setSelectedRealm] = useState("Celestial & Aurora");
  const [saving, setSaving] = useState(false);
  const [generatingMediaId, setGeneratingMediaId] = useState(null);
  const [snack, setSnack] = useState({ open: false, text: "", severity: "success" });

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
      const updated = await request("/config", "POST", config);
      setConfig(updated);
      notify("Instagram configuration saved.");
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
      notify(`AI generated 8K Nature Reel: "${created.topic}"`);
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
    notify("Starting Google Gemini Live Flow...", "info");

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
      notify(`Published Reel to Instagram: ${published.topic}`);
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

  const handleOpenGeminiLogin = async () => {
    try {
      notify("Opening Chrome Gemini window on your screen...", "info");
      const res = await request("/gemini-login", "POST");
      notify(res.message || "Chrome opened! Sign in to Google, then close the browser.");
    } catch (err) {
      notify(err.message, "error");
    }
  };

  if (!data || !config) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress sx={{ color: "#09090b" }} />
      </Box>
    );
  }

  const { account, accountError, content, activities, apiConfigured } = data;
  const set = (key, value) => setConfig((previous) => ({ ...previous, [key]: value }));
  const currentFollowersDisplay = liveFollowers !== null ? liveFollowers : (account?.followers_count ?? null);

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", pb: 5, color: "#09090b" }}>
      {/* ── TOP HEADER (MONOCHROME MINIMALIST) ── */}
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
            Autonomous Growth Agent · 4K Nature Video Reels
          </Typography>
          <Typography sx={{ ...titleStyle, fontSize: { xs: 24, sm: 30 }, mt: 0.3 }}>
            Instagram Video Reels & Growth Engine
          </Typography>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#71717a", fontSize: 13, mt: 0.5 }}>
            Automated daily 8K animated nature video reels generated by Gemini with pure atmospheric soundscapes.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {/* Live Flow Button */}
          <Button
            variant="contained"
            size="small"
            startIcon={<VisibilityIcon fontSize="small" />}
            onClick={() => openLiveFlowInspector()}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              bgcolor: generatingMediaId ? "#22c55e" : "#09090b",
              color: "#ffffff",
              fontWeight: 700,
              "&:hover": { bgcolor: "#27272a" },
            }}
          >
            {generatingMediaId ? "🔴 Live Flow (Active)" : "👁️ Live Flow"}
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<VpnKeyIcon fontSize="small" />}
            onClick={handleOpenGeminiLogin}
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
            Gemini Login
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

      {/* ── REAL-TIME LIVE FOLLOWER COUNTER (BLACK & WHITE OBSIDIAN) ── */}
      <Paper
        sx={{
          borderRadius: "16px",
          border: "1px solid #18181b",
          p: { xs: 2.5, sm: 3.5 },
          mb: 3,
          background: "#09090b",
          color: "#ffffff",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
            gap: 3,
            alignItems: "center",
          }}
        >
          {/* Follower Count Display */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#ffffff",
                  boxShadow: "0 0 10px rgba(255,255,255,0.8)",
                  animation: "pulse 1.8s infinite",
                  "@keyframes pulse": {
                    "0%": { opacity: 0.4 },
                    "50%": { opacity: 1 },
                    "100%": { opacity: 0.4 },
                  },
                }}
              />
              <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "#a1a1aa", textTransform: "uppercase" }}>
                Live Instagram Followers
              </Typography>
              {hasFollowerIncremented && (
                <Chip
                  label="+New Follower"
                  size="small"
                  sx={{ bgcolor: "#ffffff", color: "#09090b", fontWeight: 800, fontSize: 10, height: 20 }}
                />
              )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5, my: 0.5 }}>
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 900,
                  fontSize: { xs: 38, sm: 50 },
                  letterSpacing: "-1.5px",
                  lineHeight: 1,
                  color: "#ffffff",
                }}
              >
                {currentFollowersDisplay !== null ? Number(currentFollowersDisplay).toLocaleString() : "..."}
              </Typography>
              <Typography sx={{ fontSize: 16, color: "#71717a", fontWeight: 600 }}>Followers</Typography>
            </Box>

            <Typography sx={{ fontSize: 12, color: "#71717a", mt: 0.5 }}>
              {account?.username ? `@${account.username}` : "Instagram Connected"} · {account?.media_count || 0} Posts {lastFollowerCheck && `· Updated ${lastFollowerCheck}`}
            </Typography>
          </Box>

          {/* Minimalist Metrics Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1.5,
              background: "#18181b",
              p: 2,
              borderRadius: "12px",
              border: "1px solid #27272a",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ fontSize: 10, color: "#71717a", fontWeight: 700, letterSpacing: "0.5px" }}>24H REACH</Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#ffffff", mt: 0.3 }}>
                {account?.reach !== null && account?.reach !== undefined ? account.reach.toLocaleString() : "Active"}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ fontSize: 10, color: "#71717a", fontWeight: 700, letterSpacing: "0.5px" }}>ENGAGEMENT</Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#ffffff", mt: 0.3 }}>
                {account?.engagement !== null && account?.engagement !== undefined ? `${account.engagement}%` : "High"}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ fontSize: 10, color: "#71717a", fontWeight: 700, letterSpacing: "0.5px" }}>AGENT</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: config.running ? "#ffffff" : "#a1a1aa", mt: 0.5 }}>
                {config.running ? "Running" : "Paused"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {accountError && (
          <Alert severity="warning" sx={{ mt: 2, borderRadius: "8px", bgcolor: "#18181b", color: "#f4f4f5", border: "1px solid #27272a" }}>
            {accountError}
          </Alert>
        )}
      </Paper>

      {/* ── 6 NATURE REEL STUDIOS (MONOCHROME MINIMALIST) ── */}
      <Paper sx={{ ...card, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1, flexWrap: "wrap", gap: 1 }}>
          <Typography sx={{ ...titleStyle, fontSize: 18 }}>
            Nature Video Studios (1-Click AI Generation)
          </Typography>
          <Chip label="Pure Video · No Quotes" size="small" sx={{ bgcolor: "#f4f4f5", color: "#09090b", fontWeight: 700, border: "1px solid #e4e4e7" }} />
        </Box>
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#71717a", fontSize: 13, mb: 2.5 }}>
          Click any Nature Realm to generate a 100% unique 8K animated nature video with matching background soundscape:
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" }, gap: 1.5 }}>
          {NATURE_REALMS.map((r) => (
            <Paper
              key={r.id}
              onClick={() => {
                setSelectedRealm(r.realm);
                generate(null, r.realm);
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
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.8 }}>
                <Box sx={{ color: "#09090b" }}>{r.icon}</Box>
                <Chip label="Create Reel" size="small" sx={{ bgcolor: "#09090b", color: "#ffffff", fontWeight: 700, fontSize: 10, height: 20 }} />
              </Box>
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, color: "#09090b" }}>
                {r.title}
              </Typography>
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#71717a", mt: 0.4, lineHeight: 1.4 }}>
                {r.sample}
              </Typography>
            </Paper>
          ))}
        </Box>

        <Divider sx={{ my: 2.5, borderColor: "#f4f4f5" }} />

        {/* Custom Prompt Generator */}
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
          <TextField
            label="Custom Nature Scene / Wonder"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Glowing Turquoise Glacial Lagoon, Autumn Birch Fog Stream"
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
                  {r.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AutoAwesomeIcon fontSize="small" />}
            onClick={() => generate()}
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
            Generate Nature Video
          </Button>
        </Box>
      </Paper>

      {/* ── DAILY SCHEDULER SETTINGS (MONOCHROME) ── */}
      <Paper sx={{ ...card, mb: 3 }}>
        <Typography sx={{ ...titleStyle, fontSize: 18, mb: 0.5 }}>Daily Publishing Schedule</Typography>
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#71717a", fontSize: 13, mb: 2 }}>
          Autonomous daily 8K nature video reels scheduled to publish automatically to your Instagram feed.
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
          <TextField
            label="Niche Focus"
            value={config.niche || "4K Nature & Earth Cinematography, Relaxation & Visual Serenity"}
            onChange={(e) => set("niche", e.target.value)}
            sx={field}
            fullWidth
          />
          <TextField
            label="Daily Post Time (IST) ⏰"
            value={config.dailyPostTime || "07:00"}
            onChange={(e) => set("dailyPostTime", e.target.value)}
            placeholder="e.g. 07:00 or 18:00"
            helperText="Agent automatically generates and posts 1 unique nature reel daily at this fixed time"
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
            {config.running ? "Pause Scheduler" : "Start Scheduler"}
          </Button>
        </Box>
      </Paper>

      {/* ── CONTENT QUEUE WITH DIRECT IN-CARD VIDEO PLAYER & LIVE FLOW ── */}
      <Paper sx={{ ...card, mb: 3 }}>
        <Typography sx={{ ...titleStyle, fontSize: 18, mb: 2 }}>Content Queue & Video Reels</Typography>
        {content.length === 0 ? (
          <Typography sx={{ color: "#71717a", fontSize: 13 }}>
            No drafts yet. Click any Nature Realm above to generate your first 8K nature video reel!
          </Typography>
        ) : (
          content.map((item) => (
            <Box
              key={item._id}
              sx={{
                borderTop: "1px solid #f4f4f5",
                pt: 3,
                mt: 3,
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "220px 1fr" },
                gap: 2.5,
              }}
            >
              {/* Direct Interactive HTML5 9:16 Video Player */}
              <Box
                sx={{
                  width: "100%",
                  height: 310,
                  borderRadius: "12px",
                  overflow: "hidden",
                  bgcolor: "#000000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #27272a",
                  position: "relative",
                }}
              >
                {item.assetUrl ? (
                  item.assetUrl.toLowerCase().endsWith(".mp4") || item.assetUrl.toLowerCase().includes("/video/upload/") ? (
                    <video
                      src={item.assetUrl}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      controls
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={item.assetUrl}
                      alt={item.topic}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  )
                ) : item.mediaGenerationStatus === "generating" || generatingMediaId === item._id ? (
                  <Box sx={{ textAlign: "center", p: 2 }}>
                    <CircularProgress size={28} sx={{ color: "#ffffff" }} />
                    <Typography sx={{ fontSize: 11, color: "#a1a1aa", mt: 1 }}>Rendering 8K Video in Gemini...</Typography>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center", p: 2 }}>
                    <MovieCreationIcon sx={{ color: "#52525b", fontSize: 36 }} />
                    <Typography sx={{ fontSize: 11, color: "#71717a", mt: 0.5 }}>No Video Generated</Typography>
                  </Box>
                )}
                <Chip
                  label="8K Reel (9:16)"
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
              </Box>

              {/* Reel Details & Publishing Actions */}
              <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                      <Chip
                        label={item.status === "published" ? "Published" : item.status === "ready" ? "Video Ready" : "Draft"}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: item.status === "published" ? "#09090b" : item.status === "ready" ? "#27272a" : "#f4f4f5",
                          color: item.status === "draft" ? "#09090b" : "#ffffff",
                          fontSize: 11,
                        }}
                      />
                      <Chip
                        label={item.themeCategory || "Nature Reel"}
                        size="small"
                        sx={{ bgcolor: "#f4f4f5", color: "#09090b", fontWeight: 700, fontSize: 11 }}
                      />
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

                  {/* Atmospheric Soundscape Badge */}
                  {item.trendingAudioSuggestion && (
                    <Box sx={{ mt: 0.8, display: "flex", alignItems: "center", gap: 0.8 }}>
                      <Chip
                        label={item.trendingAudioSuggestion}
                        size="small"
                        sx={{ bgcolor: "#fafafa", color: "#52525b", border: "1px solid #e4e4e7", fontWeight: 600, fontSize: 11 }}
                      />
                    </Box>
                  )}

                  <Typography sx={{ fontFamily: "'DM Sans', sans-serif", whiteSpace: "pre-wrap", fontSize: 13, mt: 1, color: "#3f3f46", lineHeight: 1.5 }}>
                    {item.caption}
                  </Typography>

                  {item.hashtags?.length > 0 && (
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#71717a", fontSize: 12, mt: 0.8 }}>
                      {item.hashtags.join(" ")}
                    </Typography>
                  )}
                </Box>

                {/* ── Action Panel ── */}
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
                        ? "8K Video Ready for Instagram"
                        : item.mediaGenerationStatus === "generating" || generatingMediaId === item._id
                        ? "Gemini is rendering video..."
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
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleGenerateMedia(item._id)}
                      disabled={generatingMediaId === item._id || saving}
                      sx={{ borderRadius: "8px", textTransform: "none", fontSize: 11, fontWeight: 700, color: "#09090b", borderColor: "#d4d4d8" }}
                    >
                      {item.assetUrl ? "Regenerate Video" : "Generate 8K Video"}
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => publishNow(item._id)}
                      disabled={!item.assetUrl || saving}
                      sx={{ borderRadius: "8px", textTransform: "none", fontSize: 11, fontWeight: 700, bgcolor: "#09090b", color: "#ffffff", "&:hover": { bgcolor: "#27272a" } }}
                    >
                      Publish Reel
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Paper>

      {/* ── RECENT AUDIT LOG (MONOCHROME) ── */}
      <Paper sx={card}>
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
              Gemini Live Flow Inspector
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
                <Typography sx={{ fontWeight: 700, fontSize: 11, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Active Prompt Sent to Gemini
                </Typography>
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

      {/* ── 60-DAY META TOKEN MODAL (MONOCHROME) ── */}
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
