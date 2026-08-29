import React, { useCallback, useEffect, useState } from "react";
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
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import CloseIcon from "@mui/icons-material/Close";
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

const THEME_PILLARS = [
  { id: "career", title: "Career & Success", speaker: "Steve Jobs / APJ Kalam", emoji: "🚀", sample: "Love What You Do & Build What Matters" },
  { id: "strength", title: "Strength & Resilience", speaker: "David Goggins / Marcus Aurelius", emoji: "🛡️", sample: "Callous Your Mind & Never Quit" },
  { id: "health", title: "Health & Vitality", speaker: "Jim Rohn / Hippocrates", emoji: "🌿", sample: "Take Care of Your Body; It's Your Temple" },
  { id: "life", title: "Life & How to Live", speaker: "Rumi / Lao Tzu / Seneca", emoji: "🌌", sample: "The Universe is Inside You; Flow Like Water" },
  { id: "discipline", title: "Discipline & Habits", speaker: "James Clear / Bruce Lee", emoji: "⚡", sample: "The Power of 1% Daily Consistency" },
];

export default function InstagramGrowthAgent() {
  const [data, setData] = useState(null);
  const [config, setConfig] = useState(null);
  const [topic, setTopic] = useState("");
  const [draftType, setDraftType] = useState("post");
  const [selectedCategory, setSelectedCategory] = useState("Career & Success");
  const [saving, setSaving] = useState(false);
  const [generatingMediaId, setGeneratingMediaId] = useState(null);
  const [snack, setSnack] = useState({ open: false, text: "", severity: "success" });

  // Music Catalog State
  const [availableTracks, setAvailableTracks] = useState([]);
  const [musicModalOpen, setMusicModalOpen] = useState(false);
  const [selectedContentForAudio, setSelectedContentForAudio] = useState(null);

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

      // Load free audio catalog
      const audioRes = await fetch(`${server}/api/instagram-agent/audio/tracks`, {
        headers: authHeaders(),
      });
      if (audioRes.ok) {
        const tracks = await audioRes.json();
        setAvailableTracks(tracks);
      }
    } catch (error) {
      notify(error.message, "error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
    try {
      setSaving(true);
      const updated = await request("/config", "PUT", config);
      setConfig(updated);
      notify("Instagram daily strategy saved.");
      await load();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const setRunning = async (running) => {
    try {
      setSaving(true);
      await request(running ? "/start" : "/stop");
      notify(
        running
          ? `Agent started! It will generate unique quotes and post daily at ${config?.dailyPostTime || "07:00"} IST.`
          : "Agent stopped."
      );
      await load();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const generate = async (customTopic = null, customCategory = null) => {
    try {
      setSaving(true);
      const chosenTopic = typeof customTopic === "string" ? customTopic : topic;
      const chosenCategory = customCategory || selectedCategory;
      await request("/content/generate", "POST", {
        topic: chosenTopic,
        type: draftType,
        category: chosenCategory,
      });
      setTopic("");
      notify("Unique daily quote drafted with contextual 9:16 visual & action lessons!");
      await load();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const generateMedia = async (content) => {
    try {
      setGeneratingMediaId(content._id);
      await request(`/content/${content._id}/generate-media`);
      notify("Google Gemini 9:16 contextual visual generated & uploaded to Cloudinary.");
      await load();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setGeneratingMediaId(null);
    }
  };

  const watchGoogleGeminiLive = async (item) => {
    if (!item?._id) return;
    let pollInterval = null;
    try {
      setRunningFlowLiveId(item._id);
      setFlowInspectorOpen(true);
      setFlowInspectorSession({
        status: "running",
        prompt: item.creativeBrief || item.topic,
        steps: [
          { step: "1. Launch Browser", detail: "Starting Chromium with persistent Google Gemini profile...", timestamp: new Date().toLocaleTimeString() }
        ]
      });

      pollInterval = setInterval(async () => {
        try {
          const sessionData = await request(`/gemini-session/${item._id}`, "GET");
          if (sessionData?.steps) {
            setFlowInspectorSession(sessionData);
          }
        } catch {}
      }, 2000);

      const data = await request(`/content/${item._id}/run-gemini-live`, "POST");
      if (data?.session) {
        setFlowInspectorSession(data.session);
      }
      notify("⚡ Google Gemini creation completed and attached!");
      await load();
    } catch (err) {
      notify(err.message, "error");
    } finally {
      if (pollInterval) clearInterval(pollInterval);
      setRunningFlowLiveId(null);
    }
  };

  const updateContent = async (content, updates) => {
    try {
      await request(`/content/${content._id}`, "PATCH", updates);
      await load();
    } catch (error) {
      notify(error.message, "error");
    }
  };

  const deleteContent = async (contentId) => {
    if (!window.confirm("Are you sure you want to delete this post permanently?")) return;
    try {
      setSaving(true);
      await request(`/content/${contentId}`, "DELETE");
      notify("Post deleted successfully.");
      await load();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const attachAudioTrack = async (contentId, trackId) => {
    try {
      await request(`/content/${contentId}/attach-audio`, "POST", { trackId });
      notify("Royalty-free audio track attached!");
      setMusicModalOpen(false);
      await load();
    } catch (error) {
      notify(error.message, "error");
    }
  };

  const publish = async (content) => {
    try {
      setSaving(true);
      await request(`/content/${content._id}/publish`);
      notify("Content published to Instagram!");
      await load();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleExchangeLongLivedToken = async () => {
    setTokenModalOpen(true);
    setExchangingToken(true);
    setLongLivedResult(null);
    try {
      const res = await request("/token/exchange-long-lived", "POST");
      setLongLivedResult(res);
      notify("Successfully generated 60-day Long-Lived Token!");
    } catch (err) {
      notify(`Token exchange: ${err.message}`, "error");
      setLongLivedResult({ error: err.message });
    } finally {
      setExchangingToken(false);
    }
  };

  const handleOpenGeminiLogin = async () => {
    try {
      await request("/open-gemini-login-window", "POST");
      notify("Google Gemini Login Window launched! Please sign in on your screen.");
    } catch (err) {
      notify(`Login launch error: ${err.message}`, "error");
    }
  };

  if (!data || !config)
    return (
      <Box sx={{ p: 4, display: "flex", gap: 2, alignItems: "center" }}>
        <CircularProgress size={24} />
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif" }}>Loading Instagram Growth Agent…</Typography>
      </Box>
    );

  const { account, accountError, content, activities, apiConfigured } = data;
  const set = (key, value) => setConfig((previous) => ({ ...previous, [key]: value }));

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", pb: 4 }}>
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
              color: "#999",
              letterSpacing: "1.5px",
            }}
          >
            OFFICIAL META GRAPH API · AUTONOMOUS AGENT
          </Typography>
          <Typography sx={{ ...title, fontSize: { xs: 26, sm: 32 }, mt: 0.4 }}>
            Daily Motivational Quotes & Growth Agent
          </Typography>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#777", mt: 0.6 }}>
            Autonomous daily quotes (Life, Career, Strength, Health & Discipline), Gemini 9:16 context visuals, and automatic Instagram publishing.
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
            🔑 Open Gemini Login Window
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

      {/* Account Status Card */}
      <Paper sx={{ ...card, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <InstagramIcon sx={{ fontSize: 36, color: "#E1306C" }} />
            <Box>
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 16 }}>
                {account?.username ? `@${account.username}` : "Instagram Professional Account"}
              </Typography>
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#777" }}>
                {account?.followers_count !== undefined
                  ? `${account.followers_count.toLocaleString()} Followers · ${account.media_count || 0} Posts`
                  : apiConfigured
                  ? "Connected & Authorized"
                  : "Environment Token Configured"}
              </Typography>
            </Box>
          </Box>
          <Chip
            icon={apiConfigured ? <CheckCircleIcon /> : <ErrorOutlineIcon />}
            label={apiConfigured ? "Meta Connected" : "Token Required"}
            color={apiConfigured ? "success" : "warning"}
            size="small"
            sx={{ fontWeight: 700 }}
          />
        </Box>
        {accountError && (
          <Alert severity="warning" sx={{ mt: 2, borderRadius: "12px" }}>
            {accountError}
          </Alert>
        )}
      </Paper>

      {/* Automation Strategy & Scheduler Settings */}
      <Paper sx={{ ...card, mb: 3 }}>
        <Typography sx={{ ...title, fontSize: 18, mb: 0.5 }}>⚙️ Daily Publishing Schedule & Strategy</Typography>
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#777", fontSize: 13, mb: 2.5 }}>
          The agent automatically drafts a 100% unique quote every morning, creates matching 9:16 visuals with Gemini, and publishes to Instagram at your chosen time.
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
          <TextField
            label="Niche Focus"
            value={config.niche || "Daily Motivation, Career, Strength & Life Wisdom"}
            onChange={(e) => set("niche", e.target.value)}
            sx={field}
            fullWidth
          />
          <TextField
            label="Daily Fixed Post Time (IST) ⏰"
            value={config.dailyPostTime || "07:00"}
            onChange={(e) => set("dailyPostTime", e.target.value)}
            placeholder="e.g. 07:00 (7:00 AM IST) or 18:00 (6:00 PM IST)"
            helperText="Autonomous agent generates & publishes 1 unique quote post daily at this fixed time"
            sx={field}
            fullWidth
          />
          <FormControl sx={field} fullWidth>
            <InputLabel>Content Mode</InputLabel>
            <Select
              label="Content Mode"
              value={config.contentMode || "both"}
              onChange={(e) => set("contentMode", e.target.value)}
            >
              <MenuItem value="post">Posts (9:16 Vertical Visual + Quote)</MenuItem>
              <MenuItem value="reel">Reels (Scripted Video + Quote)</MenuItem>
              <MenuItem value="both">Posts & Reels Alternating</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Daily Posts Count"
            type="number"
            value={config.postsPerDay || 1}
            onChange={(e) => set("postsPerDay", Number(e.target.value))}
            inputProps={{ min: 1, max: 3 }}
            helperText="Recommended: 1 post per day for maximum organic reach"
            sx={field}
            fullWidth
          />
        </Box>

        {/* ── AUDIENCE GROWTH LEARNER INTELLIGENCE ── */}
        <Box sx={{ mt: 3, p: 2.5, borderRadius: "14px", background: "#fbfbfd", border: "1px solid #eef" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1, flexWrap: "wrap", gap: 1 }}>
            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: "#1a1a2e", display: "flex", alignItems: "center", gap: 1 }}>
              🎯 AI Audience Growth Learner: <span style={{ color: "#7928ca", fontWeight: 800 }}>{config.topAudienceCategory || "Career & Success"}</span>
            </Typography>
            <Chip label="Self-Optimizing on Likes, Saves & Reach" size="small" sx={{ bgcolor: "#efe7ff", color: "#6200ee", fontWeight: 700, fontSize: 11 }} />
          </Box>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "#666", lineHeight: 1.5 }}>
            The AI automatically analyzes which quote themes your followers engage with most (likes, comments, views & saves) and prioritizes generating more of your audience's favorite categories.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.2, mt: 2.5, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            onClick={saveConfig}
            disabled={saving}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              color: "#1a1a2e",
              borderColor: "#1a1a2e",
              fontWeight: 700,
            }}
          >
            Save Schedule
          </Button>
          <Button
            variant="contained"
            startIcon={config.running ? <StopIcon /> : <PlayArrowIcon />}
            disabled={saving}
            onClick={() => setRunning(!config.running)}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              bgcolor: config.running ? "#8a2d2d" : "#1a1a2e",
              fontWeight: 700,
            }}
          >
            {config.running ? "Stop Agent" : "Start Autonomous Agent"}
          </Button>
        </Box>
      </Paper>

      {/* ── 5 PILLARS MOTIVATIONAL QUOTES STUDIO ── */}
      <Paper sx={{ ...card, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1, flexWrap: "wrap", gap: 1 }}>
          <Box>
            <Typography sx={{ ...title, fontSize: 18, mb: 0.5 }}>🔥 1-Click Quote & Visual Generator (5 Life Pillars)</Typography>
            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#777", fontSize: 13 }}>
              Select any pillar to instantly draft a 100% unique quote with author attribution, Hindi meaning, 3 action lessons, and context-matching 9:16 visual prompt.
            </Typography>
          </Box>
        </Box>

        {/* 5 Pillar Quick Buttons */}
        <Box sx={{ display: "flex", gap: 1, overflowX: "auto", py: 1.5, mb: 2, "&::-webkit-scrollbar": { height: 6 }, "&::-webkit-scrollbar-thumb": { background: "#ddd", borderRadius: 3 } }}>
          {THEME_PILLARS.map((pillar) => (
            <Chip
              key={pillar.id}
              icon={<span>{pillar.emoji}</span>}
              label={`${pillar.title} (${pillar.speaker})`}
              onClick={() => {
                setSelectedCategory(pillar.title);
                generate(null, pillar.title);
              }}
              sx={{
                p: 1.8,
                borderRadius: "12px",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: 12,
                cursor: "pointer",
                background: selectedCategory === pillar.title ? "#ede9fe" : "#f7f7f9",
                border: `1px solid ${selectedCategory === pillar.title ? "#7c3aed" : "#e8e8ed"}`,
                color: selectedCategory === pillar.title ? "#6d28d9" : "#1a1a2e",
                "&:hover": { background: "#ececf5" },
              }}
            />
          ))}
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <TextField
            label="Custom Topic / Keyword (Optional)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Overcoming Fear of Failure, Morning Habits, Silent Execution"
            sx={{ ...field, flex: 1, minWidth: 240 }}
          />
          <FormControl sx={{ ...field, minWidth: 180 }}>
            <InputLabel>Category Pillar</InputLabel>
            <Select
              label="Category Pillar"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="Career & Success">🚀 Career & Success</MenuItem>
              <MenuItem value="Strength & Resilience">🛡️ Strength & Resilience</MenuItem>
              <MenuItem value="Health & Vitality">🌿 Health & Vitality</MenuItem>
              <MenuItem value="Life & How to Live">🌌 Life & How to Live</MenuItem>
              <MenuItem value="Discipline & Habits">⚡ Discipline & Habits</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ ...field, minWidth: 110 }}>
            <InputLabel>Format</InputLabel>
            <Select
              label="Format"
              value={draftType}
              onChange={(e) => setDraftType(e.target.value)}
            >
              <MenuItem value="post">Post</MenuItem>
              <MenuItem value="reel">Reel</MenuItem>
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
              background: "linear-gradient(135deg, #1a1a2e 0%, #4338ca 100%)",
              color: "#fff",
              fontWeight: 800,
              px: 3,
              py: 1.2,
              boxShadow: "0 4px 14px rgba(67, 56, 202, 0.35)",
              "&:hover": {
                background: "linear-gradient(135deg, #111122 0%, #3730a3 100%)",
              },
            }}
          >
            ⚡ Generate Unique Quote
          </Button>
        </Box>
      </Paper>

      {/* Content Queue */}
      <Paper sx={{ ...card, mb: 3 }}>
        <Typography sx={{ ...title, fontSize: 18, mb: 2 }}>Content Queue & Daily Drafts</Typography>
        {content.length === 0 ? (
          <Typography sx={{ color: "#888" }}>
            No drafts yet. Click any pillar above to generate your first unique motivational quote!
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
                gridTemplateColumns: { xs: "1fr", sm: "170px 1fr" },
                gap: 2.5,
              }}
            >
              {/* 9:16 Vertical Visual Thumbnail */}
              <Box
                sx={{
                  width: "100%",
                  height: 240,
                  borderRadius: "14px",
                  overflow: "hidden",
                  bgcolor: "#f5f5f7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #eee",
                  position: "relative",
                }}
              >
                {item.assetUrl ? (
                  item.type === "reel" && item.assetSource === "ai_video" ? (
                    <video
                      src={item.assetUrl}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      controls
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
                    <CircularProgress size={24} />
                    <Typography sx={{ fontSize: 10, color: "#777", mt: 1 }}>Generating in Gemini...</Typography>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center", p: 1 }}>
                    <ImageNotSupportedIcon sx={{ color: "#bbb", fontSize: 32 }} />
                    <Typography sx={{ fontSize: 10, color: "#999", mt: 0.5 }}>No Media</Typography>
                  </Box>
                )}
                <Chip
                  label="Google Gemini (9:16)"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 6,
                    left: 6,
                    bgcolor: "rgba(0,0,0,0.75)",
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 700,
                    height: 20,
                  }}
                />
              </Box>

              {/* Post Details & Controls */}
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                      label={`${item.type} · ${item.status}`}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        bgcolor: item.status === "published" ? "#2e7d32" : item.status === "ready" ? "#15803d" : "#1a1a2e",
                        color: "#fff",
                      }}
                    />
                    <Chip
                      label={item.themeCategory || "Career & Success"}
                      size="small"
                      sx={{ bgcolor: "#ede9fe", color: "#6d28d9", fontWeight: 700, fontSize: 11 }}
                    />
                    {item.speaker && (
                      <Chip
                        label={`— ${item.speaker}`}
                        size="small"
                        sx={{ bgcolor: "#e0f2fe", color: "#0369a1", fontWeight: 700, fontSize: 11 }}
                      />
                    )}
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

                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 15, mt: 1 }}>
                  {item.topic}
                </Typography>

                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", whiteSpace: "pre-wrap", fontSize: 13, mt: 1, color: "#333" }}>
                  {item.caption}
                </Typography>

                {item.hashtags?.length > 0 && (
                  <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#0077b5", fontSize: 12, mt: 0.8 }}>
                    {item.hashtags.join(" ")}
                  </Typography>
                )}

                {/* ── AUTONOMOUS Google Gemini Engine Status ── */}
                <Box
                  sx={{
                    mt: 1.5,
                    p: 1.5,
                    borderRadius: "12px",
                    bgcolor: "#f0f4ff",
                    border: "1px solid #d0e0fc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Box>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#1a1a2e" }}>
                      ✨ Google Gemini 9:16 Visual Creator (Zero Fallback)
                    </Typography>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#555" }}>
                      {item.assetUrl
                        ? "✅ Visual rendered in Gemini & uploaded to Cloudinary"
                        : "Ready to launch Gemini browser automation to create matching 9:16 background visual"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      disabled={runningFlowLiveId === item._id || generatingMediaId === item._id}
                      onClick={() => watchGoogleGeminiLive(item)}
                      sx={{
                        borderRadius: "8px",
                        textTransform: "none",
                        fontSize: 11,
                        fontWeight: 700,
                        bgcolor: "#1a1a2e",
                        color: "#fff",
                        "&:hover": { bgcolor: "#2a2a3e" },
                      }}
                    >
                      {runningFlowLiveId === item._id ? "Creating..." : "⚡ Create with Gemini"}
                    </Button>
                  </Box>
                </Box>

                {/* Bottom Actions */}
                <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    size="small"
                    disabled={saving || !item.assetUrl}
                    onClick={() => publish(item)}
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      bgcolor: "#1a1a2e",
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    Publish to Instagram Now
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<MusicNoteIcon />}
                    onClick={() => {
                      setSelectedContentForAudio(item._id);
                      setMusicModalOpen(true);
                    }}
                    sx={{ borderRadius: "10px", textTransform: "none", fontSize: 12 }}
                  >
                    {item.audioTrack?.title ? `🎵 ${item.audioTrack.title}` : "Attach Audio"}
                  </Button>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Paper>

      {/* ── LIVE GOOGLE GEMINI INSPECTOR MODAL ── */}
      <Dialog
        open={flowInspectorOpen}
        onClose={() => setFlowInspectorOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px" } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AutoAwesomeIcon sx={{ color: "#7c3aed" }} />
            <Typography sx={{ ...title, fontSize: 18 }}>Google Gemini Autonomous Creation</Typography>
          </Box>
          <IconButton size="small" onClick={() => setFlowInspectorOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#666", mb: 2 }}>
            Prompt: <b>{flowInspectorSession?.prompt || "Creating 9:16 contextual background..."}</b>
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {flowInspectorSession?.steps?.map((st, idx) => (
              <Box
                key={idx}
                sx={{
                  p: 1.5,
                  borderRadius: "10px",
                  bgcolor: "#f8f9fa",
                  border: "1px solid #e9ecef",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>
                    {st.step}
                  </Typography>
                  <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#666" }}>
                    {st.detail}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 11, color: "#999" }}>{st.timestamp || ""}</Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setFlowInspectorOpen(false)} sx={{ borderRadius: "10px", textTransform: "none" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── MUSIC CATALOG MODAL ── */}
      <Dialog
        open={musicModalOpen}
        onClose={() => setMusicModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px" } }}
      >
        <DialogTitle sx={{ ...title, fontSize: 18 }}>Select Royalty-Free Audio Track</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {availableTracks.map((track) => (
              <Box
                key={track.id}
                sx={{
                  p: 1.5,
                  borderRadius: "12px",
                  border: "1px solid #e0e0e0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  "&:hover": { bgcolor: "#f9f9f9" },
                }}
              >
                <Box>
                  <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14 }}>
                    🎵 {track.title}
                  </Typography>
                  <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#777" }}>
                    {track.genre} · {track.duration}s · {track.artist}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => attachAudioTrack(selectedContentForAudio, track.id)}
                  sx={{ borderRadius: "8px", textTransform: "none", fontSize: 12 }}
                >
                  Select
                </Button>
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>

      {/* ── LONG-LIVED TOKEN MODAL ── */}
      <Dialog
        open={tokenModalOpen}
        onClose={() => setTokenModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px" } }}
      >
        <DialogTitle sx={{ ...title, fontSize: 18 }}>Meta 60-Day Long-Lived Access Token</DialogTitle>
        <DialogContent dividers>
          {exchangingToken ? (
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", py: 2 }}>
              <CircularProgress size={24} />
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif" }}>Exchanging token with Meta Graph API…</Typography>
            </Box>
          ) : longLivedResult?.longLivedToken ? (
            <Box>
              <Alert severity="success" sx={{ mb: 2, borderRadius: "12px" }}>
                60-Day Long-Lived Token generated successfully! (Expires in ~{longLivedResult.expiresInDays} days)
              </Alert>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={longLivedResult.longLivedToken}
                InputProps={{ readOnly: true }}
                sx={field}
              />
              <Button
                variant="outlined"
                startIcon={<ContentCopyIcon />}
                onClick={() => {
                  navigator.clipboard.writeText(longLivedResult.longLivedToken);
                  notify("Token copied to clipboard!");
                }}
                sx={{ mt: 1.5, borderRadius: "10px", textTransform: "none" }}
              >
                Copy Token
              </Button>
            </Box>
          ) : (
            <Alert severity="error" sx={{ borderRadius: "12px" }}>
              {longLivedResult?.error || "Could not generate long-lived token. Ensure META_ACCESS_TOKEN is valid."}
            </Alert>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
        message={snack.text}
      />
    </Box>
  );
}
