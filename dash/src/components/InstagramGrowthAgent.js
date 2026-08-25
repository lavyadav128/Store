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
import server from "../environment";

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

export default function InstagramGrowthAgent() {
  const [data, setData] = useState(null);
  const [config, setConfig] = useState(null);
  const [topic, setTopic] = useState("");
  const [draftType, setDraftType] = useState("post");
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
      notify("Instagram agent settings saved.");
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
          ? "Agent started. It will draft daily content and publish ready items."
          : "Agent stopped."
      );
      await load();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const generate = async () => {
    try {
      setSaving(true);
      await request("/content/generate", "POST", { topic, type: draftType });
      setTopic("");
      notify("AI content draft created with FLUX.1 Ultra-HD visual and attached royalty-free audio!");
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
      notify("FLUX.1 Ultra-HD visual generated and uploaded to Cloudinary.");
      await load();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setGeneratingMediaId(null);
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
    if (!window.confirm("Are you sure you want to delete this post/reel permanently?")) return;
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

  const reviewPromotion = async (item, status) => {
    try {
      await request(`/promotions/${item._id}`, "PATCH", { status });
      notify(`Promotion request ${status}.`);
      await load();
    } catch (error) {
      notify(error.message, "error");
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

  if (!data || !config)
    return (
      <Box sx={{ p: 4, display: "flex", gap: 2, alignItems: "center" }}>
        <CircularProgress size={24} />
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif" }}>Loading Instagram Growth Agent…</Typography>
      </Box>
    );

  const { account, accountError, content, promotions, activities, apiConfigured } = data;
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
            OFFICIAL META API · ADMIN ONLY
          </Typography>
          <Typography sx={{ ...title, fontSize: { xs: 26, sm: 32 }, mt: 0.4 }}>
            Instagram Growth Agent & Media Studio
          </Typography>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#777", mt: 0.6 }}>
            FLUX.1 Ultra-HD visuals, royalty-free audio library, viral trending sound tagging, and autonomous Instagram publishing.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            onClick={handleExchangeLongLivedToken}
            startIcon={<VpnKeyIcon />}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              color: "#1a1a2e",
              fontWeight: 700,
              border: "1px solid #e0e0e0",
            }}
          >
            Get 60-Day Token
          </Button>
          <Button
            onClick={load}
            startIcon={<RefreshIcon />}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              color: "#1a1a2e",
              fontWeight: 700,
              border: "1px solid #e0e0e0",
            }}
          >
            Refresh live data
          </Button>
        </Box>
      </Box>

      {!apiConfigured && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: "14px" }}>
          Instagram is not connected yet. Add <code>META_ACCESS_TOKEN</code> to your backend environment variables to enable live metrics and publishing.
        </Alert>
      )}

      {accountError && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: "14px" }}>
          <strong>Meta API Diagnostic:</strong> {accountError}
          <br />
          <Typography sx={{ fontSize: 12, mt: 0.5, color: "#555" }}>
            💡 <em>Tip:</em> If you see [Code: 200], verify that your Meta App has <code>instagram_basic</code> and <code>pages_show_list</code> permissions enabled in Meta Developers Portal, or click "Get 60-Day Token" above.
          </Typography>
        </Alert>
      )}

      {account?.autoDetectedId && account.autoDetectedId !== process.env.INSTAGRAM_ACCOUNT_ID && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: "14px" }}>
          ✨ Auto-detected Instagram Account ID: <strong>{account.autoDetectedId}</strong> (@{account.username})
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
          gap: 2,
          mb: 3,
        }}
      >
        {[
          ["Followers", account.followers !== null ? account.followers : "—"],
          ["Reach", account.reach !== null ? account.reach : "—"],
          ["Engaged", account.engagement !== null ? account.engagement : "—"],
          ["Published Media", account.mediaCount !== null ? account.mediaCount : "—"],
        ].map(([label, value]) => (
          <Paper key={label} sx={card}>
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                color: "#999",
                textTransform: "uppercase",
                fontWeight: 800,
              }}
            >
              {label}
            </Typography>
            <Typography sx={{ ...title, fontSize: 26, mt: 0.3 }}>
              {Number.isFinite(value) ? Number(value).toLocaleString() : value}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Paper
        sx={{
          ...card,
          mb: 3,
          border: config.running ? "1px solid #1a1a2e" : "1px solid #f0f0f0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "12px",
              display: "grid",
              placeItems: "center",
              background: "#1a1a2e",
            }}
          >
            <InstagramIcon sx={{ color: "#fff" }} />
          </Box>
          <Box>
            <Typography sx={{ ...title, fontSize: 18 }}>Account Strategy & Controls</Typography>
            <Chip
              size="small"
              label={config.running ? "Running" : "Stopped"}
              sx={{
                mt: 0.4,
                fontWeight: 700,
                bgcolor: config.running ? "#1a1a2e" : "#f1f1f3",
                color: config.running ? "#fff" : "#555",
              }}
            />
          </Box>
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
          <TextField
            label="Niche *"
            value={config.niche}
            onChange={(e) => set("niche", e.target.value)}
            placeholder="e.g. JEE preparation and study skills"
            sx={field}
            fullWidth
          />
          <TextField
            label="Target audience"
            value={config.targetAudience}
            onChange={(e) => set("targetAudience", e.target.value)}
            placeholder="e.g. Class 11–12 JEE aspirants"
            sx={field}
            fullWidth
          />
          <TextField
            label="Brand voice"
            value={config.brandVoice}
            onChange={(e) => set("brandVoice", e.target.value)}
            sx={field}
            fullWidth
          />
          <FormControl fullWidth sx={field}>
            <InputLabel>Content mode</InputLabel>
            <Select
              label="Content mode"
              value={config.contentMode}
              onChange={(e) => set("contentMode", e.target.value)}
            >
              <MenuItem value="post">Posts</MenuItem>
              <MenuItem value="reel">Reels</MenuItem>
              <MenuItem value="both">Posts & Reels</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Daily drafts (1–3)"
            type="number"
            value={config.postsPerDay}
            onChange={(e) => set("postsPerDay", e.target.value)}
            inputProps={{ min: 1, max: 3 }}
            sx={field}
            fullWidth
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1, flexWrap: "wrap" }}>
            <Switch
              checked={config.autoReplyComments}
              onChange={(e) => set("autoReplyComments", e.target.checked)}
            />
            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
              Reply to comments
            </Typography>
            <Switch
              checked={config.autoReplyMessages}
              onChange={(e) => set("autoReplyMessages", e.target.checked)}
            />
            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
              Reply to DMs
            </Typography>
          </Box>
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
            Save strategy
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
            {config.running ? "Stop agent" : "Start agent"}
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ ...card, mb: 3 }}>
        <Typography sx={{ ...title, fontSize: 18, mb: 1 }}>AI Content Studio (FLUX.1 HD + Free Music)</Typography>
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#777", fontSize: 13, mb: 2 }}>
          Generates FLUX.1 Ultra-HD visuals, crafts relevant captions, attaches royalty-free audio tracks, and uploads directly to Cloudinary.
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <TextField
            label="Optional topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            sx={{ ...field, flex: 1, minWidth: 220 }}
          />
          <FormControl sx={{ ...field, minWidth: 130 }}>
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
            startIcon={<AutoAwesomeIcon />}
            onClick={generate}
            disabled={saving}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              bgcolor: "#1a1a2e",
              fontWeight: 700,
            }}
          >
            Create with FLUX.1 HD & Music
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ ...card, mb: 3 }}>
        <Typography sx={{ ...title, fontSize: 18, mb: 2 }}>Content Queue</Typography>
        {content.length === 0 ? (
          <Typography sx={{ color: "#888" }}>
            No drafts yet. Set your niche above and create your first draft.
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
                gridTemplateColumns: { xs: "1fr", sm: "160px 1fr" },
                gap: 2.5,
              }}
            >
              {/* Media Thumbnail Preview */}
              <Box
                sx={{
                  width: "100%",
                  height: 200,
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
                    <Typography sx={{ fontSize: 10, color: "#777", mt: 1 }}>Generating FLUX.1 HD...</Typography>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center", p: 1 }}>
                    <ImageNotSupportedIcon sx={{ color: "#bbb", fontSize: 32 }} />
                    <Typography sx={{ fontSize: 10, color: "#999", mt: 0.5 }}>No Media</Typography>
                  </Box>
                )}
                <Chip
                  label="FLUX.1 HD"
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

              {/* Post Details, Music & Controls */}
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label={`${item.type} · ${item.status}`}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        bgcolor: item.status === "published" ? "#2e7d32" : "#1a1a2e",
                        color: "#fff",
                      }}
                    />
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800 }}>
                      {item.topic}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {item.mediaGenerationError && (
                      <Typography sx={{ fontSize: 11, color: "#d32f2f", maxWidth: 280 }}>
                        {item.mediaGenerationError}
                      </Typography>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => deleteContent(item._id)}
                      sx={{ color: "#d32f2f" }}
                      title="Delete post permanently"
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", whiteSpace: "pre-wrap", fontSize: 13, mt: 1 }}>
                  {item.caption}
                </Typography>

                {item.hashtags?.length > 0 && (
                  <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#0077b5", fontSize: 12, mt: 0.5 }}>
                    {item.hashtags.join(" ")}
                  </Typography>
                )}

                {/* Attached Audio Track Card */}
                {item.audioTrack?.title && (
                  <Box
                    sx={{
                      mt: 1.5,
                      p: 1.5,
                      borderRadius: "12px",
                      bgcolor: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <MusicNoteIcon sx={{ color: "#4338ca", fontSize: 20 }} />
                      <Box>
                        <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e" }}>
                          🎵 {item.audioTrack.title}
                        </Typography>
                        <Typography sx={{ fontSize: 10, color: "#6c757d" }}>
                          {item.audioTrack.artist} · {item.audioTrack.genre}
                        </Typography>
                      </Box>
                    </Box>
                    {item.audioTrack.audioUrl && (
                      <audio controls src={item.audioTrack.audioUrl} style={{ height: 28, maxWidth: 220 }} />
                    )}
                  </Box>
                )}

                <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
                  <TextField
                    label="Public media URL"
                    defaultValue={item.assetUrl}
                    onBlur={(e) =>
                      e.target.value !== item.assetUrl &&
                      updateContent(item, {
                        assetUrl: e.target.value,
                        assetSource: "admin",
                        status: e.target.value ? "ready" : "draft",
                      })
                    }
                    sx={{ ...field, flex: 1, minWidth: 180 }}
                    size="small"
                  />
                  <Button
                    size="small"
                    startIcon={<MusicNoteIcon />}
                    onClick={() => {
                      setSelectedContentForAudio(item);
                      setMusicModalOpen(true);
                    }}
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 700,
                      border: "1px solid #ddd",
                      color: "#4338ca",
                    }}
                  >
                    Select Audio
                  </Button>
                  <Button
                    onClick={() => generateMedia(item)}
                    disabled={
                      saving ||
                      item.mediaGenerationStatus === "generating" ||
                      generatingMediaId === item._id ||
                      item.status === "published"
                    }
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 700,
                      border: "1px solid #ddd",
                    }}
                  >
                    {generatingMediaId === item._id ? "Generating FLUX.1..." : "Regenerate FLUX.1 HD"}
                  </Button>
                  <Button
                    onClick={() => publish(item)}
                    disabled={
                      saving ||
                      !item.assetUrl ||
                      !config.running ||
                      item.status === "published"
                    }
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      bgcolor: "#1a1a2e",
                      color: "#fff",
                      fontWeight: 700,
                      "&:hover": { bgcolor: "#2d2d4e" },
                    }}
                  >
                    Publish to Instagram
                  </Button>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Paper>

      {/* Select Royalty-Free Audio Track Dialog Modal */}
      <Dialog
        open={musicModalOpen}
        onClose={() => setMusicModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MusicNoteIcon sx={{ color: "#4338ca" }} />
            <Typography sx={{ ...title, fontSize: 20 }}>Royalty-Free Audio Library (100% Free)</Typography>
          </Box>
          <IconButton onClick={() => setMusicModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ fontSize: 13, color: "#666", mb: 2 }}>
            Select a royalty-free audio track for your Reel/Post. It will be attached and added to your post recommendations:
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {availableTracks.map((track) => (
              <Paper
                key={track.id}
                sx={{
                  p: 2,
                  borderRadius: "14px",
                  border: "1px solid #eee",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                  "&:hover": { bgcolor: "#f8f9fa" },
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: 14 }}>{track.title}</Typography>
                  <Typography sx={{ fontSize: 11, color: "#888" }}>
                    {track.artist} · <Chip label={track.genre} size="small" sx={{ fontSize: 10, height: 18 }} />
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <audio controls src={track.audioUrl} style={{ height: 30, maxWidth: 180 }} />
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => attachAudioTrack(selectedContentForAudio._id, track.id)}
                    sx={{ borderRadius: "8px", textTransform: "none", bgcolor: "#1a1a2e", fontWeight: 700 }}
                  >
                    Attach
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setMusicModalOpen(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Brand & Promotion / Activity Feeds */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
        <Paper sx={card}>
          <Typography sx={{ ...title, fontSize: 18, mb: 1 }}>Brand & Promotion Approval</Typography>
          <Typography sx={{ fontSize: 12, color: "#777", mb: 1.5 }}>
            The agent never accepts sponsorships or collaborations without your manual review.
          </Typography>
          {promotions.length === 0 ? (
            <Typography sx={{ color: "#888", fontSize: 13 }}>No promotion requests.</Typography>
          ) : (
            promotions.map((item) => (
              <Box key={item._id} sx={{ borderTop: "1px solid #eee", py: 1.4 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                  {item.senderName || item.senderId}{" "}
                  <Chip label={item.status} size="small" sx={{ ml: 0.8 }} />
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#666", mt: 0.5 }}>{item.message}</Typography>
                {item.status === "pending" && (
                  <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                    <Button onClick={() => reviewPromotion(item, "approved")} size="small" variant="outlined">
                      Approve
                    </Button>
                    <Button onClick={() => reviewPromotion(item, "declined")} size="small" color="inherit">
                      Decline
                    </Button>
                  </Box>
                )}
              </Box>
            ))
          )}
        </Paper>

        <Paper sx={card}>
          <Typography sx={{ ...title, fontSize: 18, mb: 1 }}>Agent Activity Feed</Typography>
          {activities.length === 0 ? (
            <Typography sx={{ color: "#888", fontSize: 13 }}>No agent activity yet.</Typography>
          ) : (
            activities.slice(0, 8).map((item) => (
              <Box key={item._id} sx={{ borderTop: "1px solid #eee", py: 1.15 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{item.message}</Typography>
                <Typography sx={{ fontSize: 11, color: "#999", mt: 0.3 }}>
                  {new Date(item.createdAt).toLocaleString()}
                </Typography>
              </Box>
            ))
          )}
        </Paper>
      </Box>

      {/* Long-Lived Token Exchange Dialog Modal */}
      <Dialog
        open={tokenModalOpen}
        onClose={() => setTokenModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
      >
        <DialogTitle sx={{ ...title, fontSize: 20 }}>Meta 60-Day Long-Lived Token</DialogTitle>
        <DialogContent dividers>
          {exchangingToken ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress size={32} sx={{ color: "#1a1a2e" }} />
              <Typography sx={{ mt: 1.5 }}>Exchanging token via Meta Graph API...</Typography>
            </Box>
          ) : longLivedResult?.error ? (
            <Alert severity="error">
              {longLivedResult.error}
              <br />
              <Typography sx={{ fontSize: 12, mt: 1 }}>
                Make sure <code>META_APP_SECRET</code> is set in your <code>.env</code> file.
              </Typography>
            </Alert>
          ) : longLivedResult?.longLivedToken ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Alert severity="success">
                ✅ Long-Lived Token Generated! (Expires in approx. {longLivedResult.expiresInDays} days)
              </Alert>
              <Typography sx={{ fontSize: 13 }}>
                Copy and paste this token into your <code>back/.env</code> as <code>META_ACCESS_TOKEN</code>:
              </Typography>
              <TextField
                multiline
                rows={3}
                value={longLivedResult.longLivedToken}
                InputProps={{ readOnly: true }}
                sx={field}
                fullWidth
              />
              <Button
                startIcon={<ContentCopyIcon />}
                onClick={() => {
                  navigator.clipboard.writeText(longLivedResult.longLivedToken);
                  notify("Long-lived token copied to clipboard!");
                }}
                variant="contained"
                sx={{ borderRadius: "10px", bgcolor: "#1a1a2e", textTransform: "none" }}
              >
                Copy Token
              </Button>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setTokenModalOpen(false)} sx={{ textTransform: "none" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={5000}
        onClose={() => setSnack((value) => ({ ...value, open: false }))}
      >
        <Alert severity={snack.severity} sx={{ borderRadius: "12px" }}>
          {snack.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}
