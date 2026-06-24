/**
 * AdminVideoSplitter.jsx — with AI Clip Detection (EasySlice-style)
 * Matches your existing AdminFileUpload MUI design system exactly.
 */

import React, { useState, useRef } from "react";
import {
  Box, Typography, Button, TextField, MenuItem,
  Select, InputLabel, FormControl, IconButton,
  Dialog, DialogTitle, DialogContent, Fade,
  LinearProgress, useMediaQuery, useTheme, Chip,
} from "@mui/material";
import ContentCutIcon     from "@mui/icons-material/ContentCut";
import GridViewIcon       from "@mui/icons-material/GridView";
import AutoAwesomeIcon    from "@mui/icons-material/AutoAwesome";
import UploadFileIcon     from "@mui/icons-material/UploadFile";
import DownloadIcon       from "@mui/icons-material/Download";
import DeleteOutlineIcon  from "@mui/icons-material/DeleteOutline";
import CheckCircleIcon    from "@mui/icons-material/CheckCircle";
import CloseIcon          from "@mui/icons-material/Close";
import VideocamIcon       from "@mui/icons-material/Videocam";
import BoltIcon           from "@mui/icons-material/Bolt";
import EmojiEventsIcon    from "@mui/icons-material/EmojiEvents";
import axios              from "axios";
import server             from "../environment";

const API        = `${server}/api/video-splitter`;
const NAV_DARK   = "#1a1a2e";
const NAV_HOVER  = "#2d2d4e";
const BG_CHIP    = "#f4f4f6";
const BORDER_COL = "#f0f0f0";
const TEXT_MUTED = "#aaa";
const TEXT_BODY  = "#555";
const FONT_BODY  = "'DM Sans', sans-serif";
const FONT_DISP  = "'Playfair Display', serif";
const PURPLE     = "#7c3aed";
const PURPLE_BG  = "rgba(124,58,237,0.08)";
const PURPLE_BOR = "rgba(124,58,237,0.2)";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px", fontFamily: FONT_BODY,
    "& fieldset": { borderColor: "#e8e8e8" },
    "&.Mui-focused fieldset": { borderColor: NAV_DARK },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: NAV_DARK },
};

const primaryBtn = {
  background: NAV_DARK, borderRadius: "14px",
  fontFamily: FONT_BODY, fontWeight: 700, fontSize: 14,
  py: 1.4, textTransform: "none", boxShadow: "none", width: "100%",
  "&:hover": { background: NAV_HOVER, boxShadow: "0 8px 24px rgba(26,26,46,0.25)" },
  "&:disabled": { background: "#ccc" },
};

const MODES = [
  { id: "ai",        label: "AI Viral Clips",     icon: <BoltIcon sx={{ fontSize: 18 }} />,          desc: "Auto-detect top moments" },
  { id: "reels",     label: "Split into Reels",   icon: <ContentCutIcon sx={{ fontSize: 18 }} />,    desc: "Divide by clip duration" },
  { id: "parts",     label: "Split into Parts",   icon: <GridViewIcon sx={{ fontSize: 18 }} />,      desc: "Divide into N equal parts" },
  { id: "summarize", label: "Smart Summary",      icon: <AutoAwesomeIcon sx={{ fontSize: 18 }} />,   desc: "Compress to a shorter clip" },
];

const CONTENT_TYPES = [
  { value: "educational",    label: "📚 Educational" },
  { value: "motivational",   label: "🔥 Motivational" },
  { value: "coding",         label: "💻 Coding / Tech" },
  { value: "entertainment",  label: "🎭 Entertainment" },
  { value: "podcast",        label: "🎙️ Podcast / Interview" },
  { value: "general",        label: "🌐 General" },
];

const CLIP_LENGTHS = [
  { value: "ai_decide", label: "🤖 AI Decides (30–120s)" },
  { value: "30",        label: "30 seconds" },
  { value: "60",        label: "60 seconds" },
  { value: "90",        label: "90 seconds" },
  { value: "120",       label: "2 minutes" },
];

const REEL_PRESETS    = [15, 30, 60, 90];
const PART_PRESETS    = [2, 3, 5, 10];
const SUMMARY_PRESETS = [
  { label: "1 min", value: 60 },
  { label: "2 min", value: 120 },
  { label: "3 min", value: 180 },
  { label: "5 min", value: 300 },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function AdminVideoSplitter() {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const fileInputRef = useRef();

  // Upload
  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploadTab,    setUploadTab]    = useState("file");
  const [videoFile,    setVideoFile]    = useState(null);
  const [uploadInfo,   setUploadInfo]   = useState(null);
  const [uploading,    setUploading]    = useState(false);
  const [uploadPct,    setUploadPct]    = useState(0);
  const [youtubeUrl,   setYoutubeUrl]   = useState("");
  const [urlLoading,   setUrlLoading]   = useState(false);

  // Mode & settings
  const [mode,            setMode]            = useState("ai");
  const [clipDuration,    setClipDuration]    = useState(30);
  const [partsCount,      setPartsCount]      = useState(3);
  const [summaryDuration, setSummaryDuration] = useState(120);

  // AI-specific
  const [contentType,  setContentType]  = useState("general");
  const [clipLength,   setClipLength]   = useState("ai_decide");
  const [clipCount,    setClipCount]    = useState(5);

  // Processing
  const [processing, setProcessing] = useState(false);
  const [procPct,    setProcPct]    = useState(0);
  const [procStage,  setProcStage]  = useState("");
  const [results,    setResults]    = useState(null);
  const [error,      setError]      = useState(null);

  const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

  const fmtSec = (s) => {
    s = Math.round(s);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    const r = s % 60;
    return r ? `${m}m ${r}s` : `${m}m`;
  };

  // ── Upload file ─────────────────────────────────────────────────────────────
  const handleVideoSelect = async (file) => {
    if (!file) return;
    setVideoFile(file);
    setUploadInfo(null);
    setResults(null);
    setError(null);
    setUploading(true);
    setUploadPct(0);
    const fd = new FormData();
    fd.append("video", file);
    try {
      const res = await axios.post(`${API}/upload`, fd, {
        headers: { ...authHeaders(), "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => setUploadPct(Math.round((e.loaded * 100) / e.total)),
      });
      setUploadInfo(res.data);
      setUploadDialog(false);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // ── Upload via YouTube URL ──────────────────────────────────────────────────
  const handleUrlUpload = async () => {
    if (!youtubeUrl) return;
    setUrlLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `${API}/upload-url`,
        { url: youtubeUrl },
        { headers: authHeaders() }
      );
      setUploadInfo(res.data);
      setVideoFile({ name: res.data.originalName });
      setYoutubeUrl("");
      setUploadDialog(false);
    } catch (err) {
      setError(err?.response?.data?.error || "Could not fetch video.");
    } finally {
      setUrlLoading(false);
    }
  };

  // ── Process ─────────────────────────────────────────────────────────────────
  const handleProcess = async () => {
    if (!uploadInfo) return;
    setProcessing(true);
    setResults(null);
    setError(null);
    setProcPct(5);
    setProcStage(mode === "ai" ? "Extracting audio…" : "Processing…");

    // AI mode stages
    let stageInterval;
    if (mode === "ai") {
      const stages = [
        [8,  "Extracting audio from video…"],
        [20, "Transcribing speech (faster-whisper)…"],
        [55, "GPT-4o analysing transcript for viral moments…"],
        [80, "Cutting HD clips with FFmpeg…"],
        [92, "Finalising clips…"],
      ];
      let si = 0;
      stageInterval = setInterval(() => {
        if (si < stages.length) {
          setProcPct(stages[si][0]);
          setProcStage(stages[si][1]);
          si++;
        }
      }, 8000);
    } else {
      stageInterval = setInterval(
        () => setProcPct((p) => Math.min(p + 5, 88)),
        1000
      );
    }

    try {
      let res;
      if (mode === "ai") {
        res = await axios.post(
          `${API}/ai-clips`,
          {
            publicId:    uploadInfo.publicId,
            url:         uploadInfo.url,
            clipLength,
            contentType,
            clipCount,
          },
          { headers: authHeaders(), timeout: 15 * 60 * 1000 }
        );
      } else if (mode === "reels") {
        res = await axios.post(
          `${API}/split/reels`,
          {
            publicId:    uploadInfo.publicId,
            url:         uploadInfo.url,
            clipDuration,
          },
          { headers: authHeaders() }
        );
      } else if (mode === "parts") {
        res = await axios.post(
          `${API}/split/parts`,
          {
            publicId:    uploadInfo.publicId,
            url:         uploadInfo.url,
            parts:       partsCount,
          },
          { headers: authHeaders() }
        );
      } else {
        res = await axios.post(
          `${API}/split/summarize`,
          {
            publicId:        uploadInfo.publicId,
            url:             uploadInfo.url,
            targetDuration:  summaryDuration,
          },
          { headers: authHeaders() }
        );
      }

      clearInterval(stageInterval);
      setProcPct(100);
      setProcStage("Done!");
      setResults({ mode, ...res.data });
    } catch (err) {
      clearInterval(stageInterval);
      setError(err?.response?.data?.error || "Processing failed. Try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleRemove = async () => {
    if (uploadInfo) {
      await axios.delete(`${API}/upload/${uploadInfo.filename}`, { headers: authHeaders() }).catch(() => {});
    }
    setVideoFile(null);
    setUploadInfo(null);
    setResults(null);
    setError(null);
    setProcPct(0);
    setProcStage("");
  };

  const downloadAll = () => {
    const clips = results?.clips || [];
    clips.forEach((clip, i) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = clip.url;
        a.download = clip.filename;
        a.click();
      }, i * 400);
    });
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');`}</style>

      <Fade in timeout={500}>
        <Box>

          {/* ── Header ── */}
          <Box sx={{ mb: { xs: 3, sm: 4 }, display: "flex", alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Typography sx={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 800,
                color: TEXT_MUTED, letterSpacing: "2px", textTransform: "uppercase", mb: 0.5 }}>
                Admin Panel
              </Typography>
              <Typography sx={{ fontFamily: FONT_DISP, fontWeight: 800,
                fontSize: { xs: 22, sm: 30 }, color: NAV_DARK, letterSpacing: "-1px" }}>
                Video Splitter
              </Typography>
              <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_MUTED, mt: 0.5 }}>
                AI-powered viral clip detection • HD quality • Full audio preserved
              </Typography>
            </Box>
            <Button variant="contained" startIcon={<UploadFileIcon />}
              onClick={() => setUploadDialog(true)} fullWidth={isMobile}
              sx={{ ...primaryBtn, width: isMobile ? "100%" : "auto", py: 1.4, px: 3 }}>
              {uploadInfo ? "Change Video" : "Upload Video"}
            </Button>
          </Box>

          {/* ── Body ── */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: { xs: 2, sm: 3 }, alignItems: "start" }}>

            {/* ── LEFT ── */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

              {/* Video status */}
              <Box sx={{ background: "#fff", border: `1px solid ${uploadInfo ? "#c8f7d4" : BORDER_COL}`,
                borderRadius: "16px", p: { xs: 2, sm: 2.5 }, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                {!uploadInfo && !uploading ? (
                  <Box onClick={() => setUploadDialog(true)} sx={{
                    border: "2px dashed #e8e8e8", borderRadius: "12px", p: 3,
                    textAlign: "center", cursor: "pointer",
                    "&:hover": { borderColor: NAV_DARK, background: "#fafafa" }, transition: "all 0.2s",
                  }}>
                    <VideocamIcon sx={{ fontSize: 36, color: "#ccc", mb: 1 }} />
                    <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_MUTED }}>
                      No video selected — click Upload Video
                    </Typography>
                  </Box>
                ) : uploading ? (
                  <Box>
                    <Typography sx={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 14, color: NAV_DARK, mb: 0.5 }}>
                      Uploading…
                    </Typography>
                    <LinearProgress variant="determinate" value={uploadPct}
                      sx={{ borderRadius: 4, mb: 0.5, "& .MuiLinearProgress-bar": { background: NAV_DARK } }} />
                    <Typography sx={{ fontFamily: FONT_BODY, fontSize: 11, color: TEXT_MUTED }}>{uploadPct}%</Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: "11px", background: "#f0fdf4",
                        display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CheckCircleIcon sx={{ fontSize: 20, color: "#22c55e" }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 14, color: NAV_DARK,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          maxWidth: { xs: 180, sm: 240 } }}>
                          {videoFile?.name}
                        </Typography>
                        <Typography sx={{ fontFamily: FONT_BODY, fontSize: 11, color: TEXT_MUTED, mt: 0.2 }}>
                          Duration: {uploadInfo?.durationFormatted} · Ready
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton onClick={handleRemove} size="small"
                      sx={{ color: "#ccc", borderRadius: "8px", p: 0.6,
                        "&:hover": { color: "#e53935", background: "#fff0f0" } }}>
                      <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                )}
              </Box>

              {/* Mode selector */}
              <Box sx={{ background: "#fff", border: `1px solid ${BORDER_COL}`, borderRadius: "16px",
                p: { xs: 2, sm: 2.5 }, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <Typography sx={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 800,
                  color: TEXT_MUTED, letterSpacing: "2px", textTransform: "uppercase", mb: 1.5 }}>
                  Mode
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {MODES.map((m) => (
                    <Box key={m.id} onClick={() => { setMode(m.id); setResults(null); setError(null); }} sx={{
                      display: "flex", alignItems: "center", gap: 1.5,
                      p: "10px 14px", borderRadius: "12px", cursor: "pointer",
                      border: `1.5px solid ${mode === m.id ? (m.id === "ai" ? PURPLE : NAV_DARK) : BORDER_COL}`,
                      background: mode === m.id ? (m.id === "ai" ? PURPLE : NAV_DARK) : "#fff",
                      color: mode === m.id ? "#fff" : NAV_DARK,
                      transition: "all 0.18s",
                      "&:hover": { background: mode === m.id ? (m.id === "ai" ? "#6d28d9" : NAV_HOVER) : BG_CHIP },
                    }}>
                      {m.icon}
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                          <Typography sx={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>
                            {m.label}
                          </Typography>
                          {m.id === "ai" && (
                            <Box sx={{ px: 0.8, py: 0.1, borderRadius: "6px",
                              background: mode === "ai" ? "rgba(255,255,255,0.25)" : PURPLE_BG,
                              border: `1px solid ${mode === "ai" ? "rgba(255,255,255,0.3)" : PURPLE_BOR}` }}>
                              <Typography sx={{ fontSize: 9, fontWeight: 800, fontFamily: FONT_BODY,
                                color: mode === "ai" ? "#fff" : PURPLE, letterSpacing: "0.5px" }}>
                                AI
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        <Typography sx={{ fontFamily: FONT_BODY, fontSize: 11,
                          color: mode === m.id ? "rgba(255,255,255,0.65)" : TEXT_MUTED }}>
                          {m.desc}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Settings */}
              <Box sx={{ background: "#fff", border: `1px solid ${mode === "ai" ? PURPLE_BOR : BORDER_COL}`,
                borderRadius: "16px", p: { xs: 2, sm: 2.5 }, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <Typography sx={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 800,
                  color: mode === "ai" ? PURPLE : TEXT_MUTED,
                  letterSpacing: "2px", textTransform: "uppercase", mb: 1.5 }}>
                  {mode === "ai" ? "⚡ AI Settings" : "Settings"}
                </Typography>

                {/* ── AI mode settings ── */}
                {mode === "ai" && (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                    {/* Content type — asked every time */}
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ fontFamily: FONT_BODY }}>What type of content is this?</InputLabel>
                      <Select value={contentType} label="What type of content is this?"
                        onChange={(e) => setContentType(e.target.value)}
                        sx={{ borderRadius: "14px", fontFamily: FONT_BODY,
                          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e8e8e8" },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: PURPLE } }}>
                        {CONTENT_TYPES.map((c) => (
                          <MenuItem key={c.value} value={c.value} sx={{ fontFamily: FONT_BODY }}>{c.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Clip length — asked every time */}
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ fontFamily: FONT_BODY }}>How long should each clip be?</InputLabel>
                      <Select value={clipLength} label="How long should each clip be?"
                        onChange={(e) => setClipLength(e.target.value)}
                        sx={{ borderRadius: "14px", fontFamily: FONT_BODY,
                          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e8e8e8" },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: PURPLE } }}>
                        {CLIP_LENGTHS.map((c) => (
                          <MenuItem key={c.value} value={c.value} sx={{ fontFamily: FONT_BODY }}>{c.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Number of clips */}
                    <Box>
                      <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_BODY, fontWeight: 600, mb: 1 }}>
                        How many clips to generate?
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {[3, 5, 7, 10].map((n) => (
                          <Chip key={n} label={n} onClick={() => setClipCount(n)} sx={{
                            fontFamily: FONT_BODY, fontWeight: 700, fontSize: 12,
                            borderRadius: "8px", cursor: "pointer",
                            background: clipCount === n ? PURPLE : BG_CHIP,
                            color: clipCount === n ? "#fff" : TEXT_BODY,
                            "&:hover": { background: clipCount === n ? "#6d28d9" : "#e8e8e8" },
                          }} />
                        ))}
                      </Box>
                    </Box>

                    <Box sx={{ p: 1.5, borderRadius: "10px", background: PURPLE_BG, border: `1px solid ${PURPLE_BOR}` }}>
                      <Typography sx={{ fontFamily: FONT_BODY, fontSize: 12, color: PURPLE, lineHeight: 1.5 }}>
                        🤖 AI will transcribe the video, find the most viral moments for <strong>{contentType}</strong> content, and cut <strong>{clipCount} HD clips</strong> automatically.
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* ── Reels settings ── */}
                {mode === "reels" && (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_BODY, fontWeight: 600 }}>Clip Duration</Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {REEL_PRESETS.map((s) => (
                        <Chip key={s} label={`${s}s`} onClick={() => setClipDuration(s)} sx={{
                          fontFamily: FONT_BODY, fontWeight: 700, fontSize: 12, borderRadius: "8px", cursor: "pointer",
                          background: clipDuration === s ? NAV_DARK : BG_CHIP,
                          color: clipDuration === s ? "#fff" : TEXT_BODY,
                          "&:hover": { background: clipDuration === s ? NAV_HOVER : "#e8e8e8" },
                        }} />
                      ))}
                    </Box>
                    <TextField label="Custom seconds" type="number" size="small" value={clipDuration}
                      onChange={(e) => setClipDuration(Math.max(5, parseInt(e.target.value) || 5))}
                      inputProps={{ min: 5, max: 3600 }} sx={{ ...fieldSx, maxWidth: 160 }} />
                    {uploadInfo && (
                      <Typography sx={{ fontFamily: FONT_BODY, fontSize: 12, color: PURPLE }}>
                        → Will create ~{Math.ceil(uploadInfo.duration / clipDuration)} clips
                      </Typography>
                    )}
                  </Box>
                )}

                {/* ── Parts settings ── */}
                {mode === "parts" && (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_BODY, fontWeight: 600 }}>Number of Parts</Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {PART_PRESETS.map((n) => (
                        <Chip key={n} label={`${n} parts`} onClick={() => setPartsCount(n)} sx={{
                          fontFamily: FONT_BODY, fontWeight: 700, fontSize: 12, borderRadius: "8px", cursor: "pointer",
                          background: partsCount === n ? NAV_DARK : BG_CHIP,
                          color: partsCount === n ? "#fff" : TEXT_BODY,
                          "&:hover": { background: partsCount === n ? NAV_HOVER : "#e8e8e8" },
                        }} />
                      ))}
                    </Box>
                    <TextField label="Custom count" type="number" size="small" value={partsCount}
                      onChange={(e) => setPartsCount(Math.max(2, parseInt(e.target.value) || 2))}
                      inputProps={{ min: 2, max: 100 }} sx={{ ...fieldSx, maxWidth: 160 }} />
                    {uploadInfo && (
                      <Typography sx={{ fontFamily: FONT_BODY, fontSize: 12, color: PURPLE }}>
                        → Each clip: {fmtSec(uploadInfo.duration / partsCount)}
                      </Typography>
                    )}
                  </Box>
                )}

                {/* ── Summarize settings ── */}
                {mode === "summarize" && (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_BODY, fontWeight: 600 }}>Target Summary Length</Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {SUMMARY_PRESETS.map(({ label, value }) => (
                        <Chip key={value} label={label} onClick={() => setSummaryDuration(value)} sx={{
                          fontFamily: FONT_BODY, fontWeight: 700, fontSize: 12, borderRadius: "8px", cursor: "pointer",
                          background: summaryDuration === value ? NAV_DARK : BG_CHIP,
                          color: summaryDuration === value ? "#fff" : TEXT_BODY,
                          "&:hover": { background: summaryDuration === value ? NAV_HOVER : "#e8e8e8" },
                        }} />
                      ))}
                    </Box>
                    <TextField label="Custom (seconds)" type="number" size="small" value={summaryDuration}
                      onChange={(e) => setSummaryDuration(Math.max(10, parseInt(e.target.value) || 10))}
                      inputProps={{ min: 10, max: 3600 }} sx={{ ...fieldSx, maxWidth: 160 }} />
                  </Box>
                )}
              </Box>

              {/* Process button */}
              <Button variant="contained" onClick={handleProcess}
                disabled={!uploadInfo || processing} sx={primaryBtn}>
                {processing ? procStage || "Processing…"
                  : mode === "ai"        ? `⚡ Generate ${clipCount} AI Viral Clips`
                  : mode === "reels"     ? `✂️ Split into Reels`
                  : mode === "parts"     ? `📐 Split into ${partsCount} Parts`
                  : "✨ Generate Summary"}
              </Button>

              {processing && (
                <LinearProgress variant={procPct > 0 ? "determinate" : "indeterminate"} value={procPct}
                  sx={{ borderRadius: 4, mt: -1,
                    "& .MuiLinearProgress-bar": { background: mode === "ai" ? PURPLE : NAV_DARK } }} />
              )}

              {error && (
                <Box sx={{ p: 2, borderRadius: "12px", background: "#fff5f5", border: "1px solid #fecaca" }}>
                  <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13, color: "#dc2626" }}>{error}</Typography>
                </Box>
              )}
            </Box>

            {/* ── RIGHT: Results ── */}
            <Box>
              {!results && !processing && (
                <Box sx={{ background: "#fff", border: `1px solid ${BORDER_COL}`, borderRadius: "16px",
                  p: 4, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", minHeight: 320,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1 }}>
                  <BoltIcon sx={{ fontSize: 40, color: "#e0e0e0" }} />
                  <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_MUTED }}>
                    AI-generated clips will appear here
                  </Typography>
                  <Typography sx={{ fontFamily: FONT_BODY, fontSize: 12, color: "#ccc" }}>
                    Upload a video and hit Generate
                  </Typography>
                </Box>
              )}

              {processing && (
                <Box sx={{ background: "#fff", border: `1px solid ${PURPLE_BOR}`, borderRadius: "16px",
                  p: 4, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", minHeight: 320,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: "50%",
                    border: `3px solid ${BG_CHIP}`, borderTopColor: mode === "ai" ? PURPLE : NAV_DARK,
                    animation: "vs-spin 0.8s linear infinite" }} />
                  <style>{`@keyframes vs-spin{to{transform:rotate(360deg)}}`}</style>
                  <Typography sx={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 14,
                    color: mode === "ai" ? PURPLE : NAV_DARK }}>
                    {procStage || "Processing…"}
                  </Typography>
                  <Box sx={{ width: "80%", height: 4, borderRadius: 2, background: BG_CHIP, overflow: "hidden" }}>
                    <Box sx={{ height: "100%", width: `${procPct}%`,
                      background: mode === "ai" ? PURPLE : NAV_DARK, transition: "width 1s ease", borderRadius: 2 }} />
                  </Box>
                  <Typography sx={{ fontFamily: FONT_BODY, fontSize: 11, color: TEXT_MUTED }}>
                    {mode === "ai" ? "This takes 2–5 minutes for long videos" : "HD quality · Audio preserved"}
                  </Typography>
                </Box>
              )}

              {/* ── AI Clips results ── */}
              {results?.mode === "ai" && results.clips && (
                <Box sx={{ background: "#fff", border: `1px solid ${PURPLE_BOR}`, borderRadius: "16px",
                  p: { xs: 2, sm: 2.5 }, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                    <Box>
                      <Typography sx={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 800,
                        color: PURPLE, letterSpacing: "2px", textTransform: "uppercase" }}>
                        ⚡ {results.totalClips} AI Clips Ready
                      </Typography>
                      <Typography sx={{ fontFamily: FONT_BODY, fontSize: 11, color: TEXT_MUTED, mt: 0.3 }}>
                        {results.contentType} · {results.clipLength === "ai_decide" ? "AI-decided length" : `${results.clipLength}s each`}
                      </Typography>
                    </Box>
                    <Button size="small" startIcon={<DownloadIcon sx={{ fontSize: 14 }} />}
                      onClick={downloadAll} sx={{
                        fontFamily: FONT_BODY, fontWeight: 700, fontSize: 12,
                        textTransform: "none", color: PURPLE, borderRadius: "8px",
                        border: `1px solid ${PURPLE_BOR}`, px: 1.5, py: 0.5,
                        "&:hover": { background: PURPLE_BG },
                      }}>
                      Download All
                    </Button>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5,
                    maxHeight: { xs: 500, sm: 600 }, overflowY: "auto", pr: 0.5,
                    "&::-webkit-scrollbar": { width: 4 },
                    "&::-webkit-scrollbar-thumb": { background: "#e8e8e8", borderRadius: 2 } }}>
                    {results.clips.map((clip) => (
                      <Box key={clip.index} sx={{
                        borderRadius: "14px", border: `1px solid ${PURPLE_BOR}`,
                        background: PURPLE_BG, overflow: "hidden",
                      }}>
                        {/* Clip header */}
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                          p: "12px 14px", borderBottom: `1px solid ${PURPLE_BOR}` }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                            <Box sx={{ width: 28, height: 28, borderRadius: "8px", background: PURPLE,
                              display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <EmojiEventsIcon sx={{ fontSize: 14, color: "#fff" }} />
                            </Box>
                            <Box>
                              <Typography sx={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 13, color: NAV_DARK }}>
                                #{clip.rank} · {clip.title}
                              </Typography>
                              <Typography sx={{ fontFamily: FONT_BODY, fontSize: 11, color: TEXT_MUTED }}>
                                {clip.startTime} → {clip.endTime} · {clip.duration}
                              </Typography>
                            </Box>
                          </Box>
                          <IconButton component="a" href={clip.url} download={clip.filename}
                            target="_blank" size="small"
                            sx={{ color: PURPLE, borderRadius: "8px", p: 0.6,
                              "&:hover": { background: "rgba(124,58,237,0.15)" } }}>
                            <DownloadIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                        {/* AI insight */}
                        <Box sx={{ p: "10px 14px" }}>
                          <Typography sx={{ fontFamily: FONT_BODY, fontSize: 11, color: PURPLE, fontWeight: 700, mb: 0.3 }}>
                            🎯 Hook
                          </Typography>
                          <Typography sx={{ fontFamily: FONT_BODY, fontSize: 12, color: TEXT_BODY, mb: 0.8 }}>
                            "{clip.hook}"
                          </Typography>
                          <Typography sx={{ fontFamily: FONT_BODY, fontSize: 11, color: TEXT_MUTED }}>
                            {clip.reason}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* ── Summary result ── */}
              {results?.mode === "summarize" && results.summary && (
                <Box sx={{ background: "#fff", border: `1px solid ${BORDER_COL}`, borderRadius: "16px",
                  p: { xs: 2, sm: 2.5 }, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <Typography sx={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 800,
                    color: TEXT_MUTED, letterSpacing: "2px", textTransform: "uppercase", mb: 2 }}>
                    Summary Ready
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                    p: 2, borderRadius: "12px", background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: "11px", background: "#dcfce7",
                        display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CheckCircleIcon sx={{ fontSize: 20, color: "#22c55e" }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 14, color: NAV_DARK }}>
                          summary.mp4
                        </Typography>
                        <Typography sx={{ fontFamily: FONT_BODY, fontSize: 11, color: TEXT_MUTED }}>
                          {results.summary.originalDuration} → {results.summary.summaryDuration}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton component="a" href={results.summary.url} download="summary.mp4" target="_blank"
                      sx={{ color: TEXT_MUTED, borderRadius: "8px", p: 0.8,
                        "&:hover": { color: NAV_DARK, background: BG_CHIP } }}>
                      <DownloadIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                </Box>
              )}

              {/* ── Reels / Parts results ── */}
              {results && (results.mode === "reels" || results.mode === "parts") && results.clips && (
                <Box sx={{ background: "#fff", border: `1px solid ${BORDER_COL}`, borderRadius: "16px",
                  p: { xs: 2, sm: 2.5 }, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                    <Typography sx={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 800,
                      color: TEXT_MUTED, letterSpacing: "2px", textTransform: "uppercase" }}>
                      {results.totalClips} Clips Ready
                    </Typography>
                    <Button size="small" startIcon={<DownloadIcon sx={{ fontSize: 14 }} />}
                      onClick={downloadAll} sx={{
                        fontFamily: FONT_BODY, fontWeight: 700, fontSize: 12, textTransform: "none",
                        color: NAV_DARK, borderRadius: "8px", border: "1px solid #e8e8e8", px: 1.5, py: 0.5,
                        "&:hover": { background: BG_CHIP },
                      }}>
                      Download All
                    </Button>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1,
                    maxHeight: { xs: 360, sm: 500 }, overflowY: "auto", pr: 0.5,
                    "&::-webkit-scrollbar": { width: 4 },
                    "&::-webkit-scrollbar-thumb": { background: "#e8e8e8", borderRadius: 2 } }}>
                    {results.clips.map((clip) => (
                      <Box key={clip.index} sx={{ display: "flex", alignItems: "center",
                        justifyContent: "space-between", p: "10px 14px", borderRadius: "12px",
                        border: `1px solid ${BORDER_COL}`, "&:hover": { background: BG_CHIP }, transition: "background 0.15s" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Box sx={{ width: 28, height: 28, borderRadius: "8px", background: NAV_DARK,
                            display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Typography sx={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 800, color: "#fff" }}>
                              {String(clip.index).padStart(2, "0")}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography sx={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 13, color: NAV_DARK }}>
                              {clip.filename}
                            </Typography>
                            <Typography sx={{ fontFamily: FONT_BODY, fontSize: 11, color: TEXT_MUTED }}>
                              Start {clip.startTime} · {clip.duration}
                            </Typography>
                          </Box>
                        </Box>
                        <IconButton component="a" href={clip.url} download={clip.filename} target="_blank" size="small"
                          sx={{ color: TEXT_MUTED, borderRadius: "8px", p: 0.6,
                            "&:hover": { color: NAV_DARK, background: "#e8e8e8" } }}>
                          <DownloadIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Fade>

      {/* ── Upload Dialog ── */}
      <Dialog open={uploadDialog} onClose={() => !uploading && !urlLoading && setUploadDialog(false)}
        maxWidth="sm" fullWidth fullScreen={isMobile}
        PaperProps={{ sx: { borderRadius: { xs: 0, sm: "20px" }, fontFamily: FONT_BODY,
          boxShadow: "0 32px 80px rgba(0,0,0,0.15)", m: { xs: 0, sm: 2 } } }}>
        <DialogTitle sx={{ fontFamily: FONT_DISP, fontWeight: 800, fontSize: { xs: 18, sm: 20 },
          color: NAV_DARK, borderBottom: `1px solid ${BORDER_COL}`, pb: 1.5,
          display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          Upload Video
          {isMobile && (
            <IconButton onClick={() => setUploadDialog(false)} size="small" sx={{ color: TEXT_MUTED }}>
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>

        <DialogContent sx={{ p: { xs: 2, sm: 3 }, display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}>

          {/* Tab switcher */}
          <Box sx={{ display: "flex", background: BG_CHIP, borderRadius: "12px", p: "4px", gap: "4px" }}>
            {["file", "url"].map((t) => (
              <Box key={t} onClick={() => setUploadTab(t)} sx={{
                flex: 1, textAlign: "center", py: 1, borderRadius: "10px", cursor: "pointer",
                background: uploadTab === t ? "#fff" : "transparent",
                boxShadow: uploadTab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.18s",
              }}>
                <Typography sx={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 13, color: NAV_DARK }}>
                  {t === "file" ? "📁 Upload File" : "🔗 YouTube / URL"}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* File tab */}
          {uploadTab === "file" && (
            <>
              <Box component="label" sx={{
                border: `2px dashed ${videoFile ? NAV_DARK : "#e8e8e8"}`, borderRadius: "14px",
                p: { xs: 3, sm: 4 }, textAlign: "center", cursor: "pointer",
                "&:hover": { borderColor: NAV_DARK, background: "#fafafa" }, transition: "all 0.2s",
                minHeight: 140, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                <input ref={fileInputRef} type="file" hidden accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files[0])} />
                <VideocamIcon sx={{ fontSize: 36, color: videoFile ? NAV_DARK : "#ccc", mb: 1 }} />
                <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13,
                  fontWeight: videoFile ? 700 : 400, color: videoFile ? NAV_DARK : TEXT_MUTED }}>
                  {videoFile ? videoFile.name : "Click to choose a video file"}
                </Typography>
                <Typography sx={{ fontFamily: FONT_BODY, fontSize: 11, color: TEXT_MUTED, mt: 0.5 }}>
                  MP4, MOV, MKV, AVI, WebM — up to 5 GB
                </Typography>
              </Box>
              {uploading && (
                <Box>
                  <Typography sx={{ fontFamily: FONT_BODY, fontSize: 12, color: TEXT_MUTED, mb: 0.8 }}>
                    Uploading… {uploadPct}%
                  </Typography>
                  <LinearProgress variant="determinate" value={uploadPct}
                    sx={{ borderRadius: 4, "& .MuiLinearProgress-bar": { background: NAV_DARK } }} />
                </Box>
              )}
              <Button variant="contained" onClick={() => videoFile && handleVideoSelect(videoFile)}
                disabled={!videoFile || uploading} sx={primaryBtn}>
                {uploading ? `Uploading ${uploadPct}%…` : "Upload & Analyse"}
              </Button>
            </>
          )}

          {/* URL tab */}
          {uploadTab === "url" && (
            <>
              <TextField label="YouTube / Video URL" fullWidth value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..." sx={fieldSx} />
              <Typography sx={{ fontFamily: FONT_BODY, fontSize: 12, color: TEXT_MUTED }}>
                Supports YouTube and most public video URLs. The video downloads to your server first — this may take 1–2 minutes.
              </Typography>
              {urlLoading && (
                <Box>
                  <Typography sx={{ fontFamily: FONT_BODY, fontSize: 12, color: TEXT_MUTED, mb: 0.8 }}>
                    Downloading video… please wait
                  </Typography>
                  <LinearProgress sx={{ borderRadius: 4, "& .MuiLinearProgress-bar": { background: NAV_DARK } }} />
                </Box>
              )}
              <Button variant="contained" onClick={handleUrlUpload}
                disabled={!youtubeUrl || urlLoading} sx={primaryBtn}>
                {urlLoading ? "Downloading…" : "Fetch & Analyse"}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}