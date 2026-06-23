/**
 * AdminVideoSplitter.jsx
 *
 * Drop this alongside AdminFileUpload.jsx — same MUI design system,
 * same fonts, same colour tokens. Import server from "../environment" just like
 * the rest of your admin pages.
 *
 * Usage:
 *   import AdminVideoSplitter from "./AdminVideoSplitter";
 *   // then render <AdminVideoSplitter /> in your admin routing
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
import axios              from "axios";
import server             from "../environment";

// ─── Constants ────────────────────────────────────────────────────────────────
const API = `${server}/api/video-splitter`;

const MODES = [
  {
    id:    "reels",
    label: "Split into Reels",
    icon:  <ContentCutIcon sx={{ fontSize: 18 }} />,
    desc:  "Divide by clip duration",
  },
  {
    id:    "parts",
    label: "Split into Parts",
    icon:  <GridViewIcon sx={{ fontSize: 18 }} />,
    desc:  "Divide into N equal parts",
  },
  {
    id:    "summarize",
    label: "Smart Summary",
    icon:  <AutoAwesomeIcon sx={{ fontSize: 18 }} />,
    desc:  "Compress to a shorter clip",
  },
];

const REEL_PRESETS = [15, 30, 60, 90];
const PART_PRESETS = [2, 3, 5, 10];
const SUMMARY_PRESETS = [
  { label: "1 min",  value: 60  },
  { label: "2 min",  value: 120 },
  { label: "3 min",  value: 180 },
  { label: "5 min",  value: 300 },
];

// ─── Shared style tokens (match your AdminFileUpload) ─────────────────────────
const NAV_DARK    = "#1a1a2e";
const NAV_HOVER   = "#2d2d4e";
const BG_CHIP     = "#f4f4f6";
const BORDER_COL  = "#f0f0f0";
const TEXT_MUTED  = "#aaa";
const TEXT_BODY   = "#555";
const FONT_BODY   = "'DM Sans', sans-serif";
const FONT_DISPLAY= "'Playfair Display', serif";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    fontFamily: FONT_BODY,
    "& fieldset": { borderColor: "#e8e8e8" },
    "&.Mui-focused fieldset": { borderColor: NAV_DARK },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: NAV_DARK },
};

const primaryBtn = (full) => ({
  background: NAV_DARK, borderRadius: "14px",
  fontFamily: FONT_BODY, fontWeight: 700, fontSize: 14,
  py: 1.4, px: full ? undefined : 3,
  textTransform: "none", boxShadow: "none",
  "&:hover": { background: NAV_HOVER, boxShadow: "0 8px 24px rgba(26,26,46,0.25)" },
  "&:disabled": { background: "#ccc" },
  ...(full ? { width: "100%" } : {}),
});

// ─────────────────────────────────────────────────────────────────────────────
export default function AdminVideoSplitter() {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Upload state
  const [uploadDialog, setUploadDialog] = useState(false);
  const [videoFile,    setVideoFile]    = useState(null);
  const [uploadInfo,   setUploadInfo]   = useState(null); // { filename, duration, durationFormatted }
  const [uploading,    setUploading]    = useState(false);
  const [uploadPct,    setUploadPct]    = useState(0);


  const [uploadTab, setUploadTab] = useState("file"); // "file" | "url"
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [urlUploading, setUrlUploading] = useState(false);

  // Mode + settings
  const [mode,            setMode]            = useState("reels");
  const [clipDuration,    setClipDuration]    = useState(30);
  const [partsCount,      setPartsCount]      = useState(3);
  const [summaryDuration, setSummaryDuration] = useState(120);

  // Processing
  const [processing,  setProcessing]  = useState(false);
  const [procPct,     setProcPct]     = useState(0);
  const [results,     setResults]     = useState(null);
  const [error,       setError]       = useState(null);

  const fileInputRef = useRef();

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

  const fmtSec = (s) => {
    s = Math.round(s);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    const r = s % 60;
    return r ? `${m}m ${r}s` : `${m}m`;
  };

  // ── Upload video ─────────────────────────────────────────────────────────────
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
      setError("Upload failed. Check the file and try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleUrlUpload = async () => {
    if (!youtubeUrl) return;
    setUrlUploading(true);
    setError(null);
    try {
      const res = await axios.post(
        `${API}/upload-url`,
        { url: youtubeUrl },
        { headers: authHeaders() }
      );
      setUploadInfo(res.data);
      setVideoFile({ name: res.data.originalName }); // fake file obj for display
      setYoutubeUrl("");
      setUploadDialog(false);
    } catch {
      setError("Could not fetch video. Make sure the URL is public.");
    } finally {
      setUrlUploading(false);
    }
  };

  // ── Process ──────────────────────────────────────────────────────────────────
  const handleProcess = async () => {
    if (!uploadInfo) return;
    setProcessing(true);
    setResults(null);
    setError(null);
    setProcPct(5);

    const ticker = setInterval(
      () => setProcPct((p) => Math.min(p + 4, 88)),
      1000
    );

    const payloads = {
      reels:     { url: `${API}/split/reels`,     body: { filename: uploadInfo.filename, clipDuration } },
      parts:     { url: `${API}/split/parts`,     body: { filename: uploadInfo.filename, parts: partsCount } },
      summarize: { url: `${API}/split/summarize`, body: { filename: uploadInfo.filename, targetDuration: summaryDuration } },
    };

    const { url, body } = payloads[mode];

    try {
      const res = await axios.post(url, body, { headers: authHeaders() });
      clearInterval(ticker);
      setProcPct(100);
      setResults({ mode, ...res.data });
    } catch (err) {
      clearInterval(ticker);
      setError(err?.response?.data?.error || "Processing failed. Try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleRemove = async () => {
    if (uploadInfo) {
      await axios
        .delete(`${API}/upload/${uploadInfo.filename}`, { headers: authHeaders() })
        .catch(() => {});
    }
    setVideoFile(null);
    setUploadInfo(null);
    setResults(null);
    setError(null);
    setProcPct(0);
  };

  const downloadAll = () => {
    if (!results?.clips) return;
    results.clips.forEach((clip, i) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = clip.url;
        a.download = clip.filename;
        a.click();
      }, i * 400);
    });
  };

  const currentMode = MODES.find((m) => m.id === mode);
  const estimatedClips =
    mode === "reels" && uploadInfo
      ? Math.ceil(uploadInfo.duration / clipDuration)
      : mode === "parts"
      ? partsCount
      : 1;

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');`}</style>

      <Fade in timeout={500}>
        <Box sx={{ px: { xs: 0, sm: 0 } }}>

          {/* ── Header (same structure as AdminFileUpload) ── */}
          <Box sx={{
            mb: { xs: 3, sm: 4 },
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}>
            <Box>
              <Typography sx={{
                fontFamily: FONT_BODY, fontSize: 11, fontWeight: 800,
                color: TEXT_MUTED, letterSpacing: "2px",
                textTransform: "uppercase", mb: 0.5,
              }}>
                Admin Panel
              </Typography>
              <Typography sx={{
                fontFamily: FONT_DISPLAY, fontWeight: 800,
                fontSize: { xs: 22, sm: 30 },
                color: NAV_DARK, letterSpacing: "-1px",
              }}>
                Video Splitter
              </Typography>
              <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_MUTED, mt: 0.5 }}>
                Split videos into reels, parts, or smart summaries — HD quality
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<UploadFileIcon />}
              onClick={() => setUploadDialog(true)}
              fullWidth={isMobile}
              sx={primaryBtn(isMobile)}
            >
              {uploadInfo ? "Change Video" : "Upload Video"}
            </Button>
          </Box>

          {/* ── Body: two-column on desktop, stacked on mobile ── */}
          <Box sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 2, sm: 3 },
            alignItems: "start",
          }}>

            {/* ── LEFT: video status + mode selector + settings ── */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

              {/* Video status card */}
              <Box sx={{
                background: "#fff",
                border: `1px solid ${uploadInfo ? "#c8f7d4" : BORDER_COL}`,
                borderRadius: "16px",
                p: { xs: 2, sm: 2.5 },
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}>
                {!uploadInfo && !uploading ? (
                  <Box
                    onClick={() => setUploadDialog(true)}
                    sx={{
                      border: "2px dashed #e8e8e8", borderRadius: "12px",
                      p: 3, textAlign: "center", cursor: "pointer",
                      "&:hover": { borderColor: NAV_DARK, background: "#fafafa" },
                      transition: "all 0.2s",
                    }}
                  >
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
                    <Typography sx={{ fontFamily: FONT_BODY, fontSize: 12, color: TEXT_MUTED, mb: 1 }}>
                      {videoFile?.name}
                    </Typography>
                    <LinearProgress
                      variant="determinate" value={uploadPct}
                      sx={{ borderRadius: 4, "& .MuiLinearProgress-bar": { background: NAV_DARK } }}
                    />
                    <Typography sx={{ fontFamily: FONT_BODY, fontSize: 11, color: TEXT_MUTED, mt: 0.5 }}>
                      {uploadPct}%
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box sx={{
                        width: 40, height: 40, borderRadius: "11px",
                        background: "#f0fdf4",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <CheckCircleIcon sx={{ fontSize: 20, color: "#22c55e" }} />
                      </Box>
                      <Box>
                        <Typography sx={{
                          fontFamily: FONT_BODY, fontWeight: 700, fontSize: 14,
                          color: NAV_DARK, lineHeight: 1.3,
                          overflow: "hidden", textOverflow: "ellipsis",
                          whiteSpace: "nowrap", maxWidth: { xs: 180, sm: 240 },
                        }}>
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
              <Box sx={{
                background: "#fff", border: `1px solid ${BORDER_COL}`,
                borderRadius: "16px", p: { xs: 2, sm: 2.5 },
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}>
                <Typography sx={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 800,
                  color: TEXT_MUTED, letterSpacing: "2px", textTransform: "uppercase", mb: 1.5 }}>
                  Mode
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {MODES.map((m) => (
                    <Box
                      key={m.id}
                      onClick={() => { setMode(m.id); setResults(null); setError(null); }}
                      sx={{
                        display: "flex", alignItems: "center", gap: 1.5,
                        p: "10px 14px", borderRadius: "12px", cursor: "pointer",
                        border: `1.5px solid ${mode === m.id ? NAV_DARK : "#f0f0f0"}`,
                        background: mode === m.id ? NAV_DARK : "#fff",
                        color: mode === m.id ? "#fff" : NAV_DARK,
                        transition: "all 0.18s",
                        "&:hover": {
                          background: mode === m.id ? NAV_HOVER : BG_CHIP,
                          borderColor: mode === m.id ? NAV_HOVER : "#ddd",
                        },
                      }}
                    >
                      {m.icon}
                      <Box>
                        <Typography sx={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>
                          {m.label}
                        </Typography>
                        <Typography sx={{ fontFamily: FONT_BODY, fontSize: 11,
                          color: mode === m.id ? "rgba(255,255,255,0.65)" : TEXT_MUTED }}>
                          {m.desc}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Settings card */}
              <Box sx={{
                background: "#fff", border: `1px solid ${BORDER_COL}`,
                borderRadius: "16px", p: { xs: 2, sm: 2.5 },
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}>
                <Typography sx={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 800,
                  color: TEXT_MUTED, letterSpacing: "2px", textTransform: "uppercase", mb: 1.5 }}>
                  Settings
                </Typography>

                {/* ── Reels settings ── */}
                {mode === "reels" && (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_BODY, fontWeight: 600 }}>
                      Clip Duration
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {REEL_PRESETS.map((s) => (
                        <Chip
                          key={s}
                          label={`${s}s`}
                          onClick={() => setClipDuration(s)}
                          sx={{
                            fontFamily: FONT_BODY, fontWeight: 700, fontSize: 12,
                            borderRadius: "8px", cursor: "pointer",
                            background: clipDuration === s ? NAV_DARK : BG_CHIP,
                            color: clipDuration === s ? "#fff" : TEXT_BODY,
                            "&:hover": { background: clipDuration === s ? NAV_HOVER : "#e8e8e8" },
                          }}
                        />
                      ))}
                    </Box>
                    <TextField
                      label="Custom seconds" type="number" size="small"
                      value={clipDuration}
                      onChange={(e) => setClipDuration(Math.max(5, parseInt(e.target.value) || 5))}
                      inputProps={{ min: 5, max: 3600 }}
                      sx={{ ...fieldSx, maxWidth: 160 }}
                    />
                    {uploadInfo && (
                      <Typography sx={{ fontFamily: FONT_BODY, fontSize: 12, color: "#7c3aed" }}>
                        → Will create ~{Math.ceil(uploadInfo.duration / clipDuration)} clips
                      </Typography>
                    )}
                  </Box>
                )}

                {/* ── Parts settings ── */}
                {mode === "parts" && (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_BODY, fontWeight: 600 }}>
                      Number of Parts
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {PART_PRESETS.map((n) => (
                        <Chip
                          key={n}
                          label={`${n} parts`}
                          onClick={() => setPartsCount(n)}
                          sx={{
                            fontFamily: FONT_BODY, fontWeight: 700, fontSize: 12,
                            borderRadius: "8px", cursor: "pointer",
                            background: partsCount === n ? NAV_DARK : BG_CHIP,
                            color: partsCount === n ? "#fff" : TEXT_BODY,
                            "&:hover": { background: partsCount === n ? NAV_HOVER : "#e8e8e8" },
                          }}
                        />
                      ))}
                    </Box>
                    <TextField
                      label="Custom count" type="number" size="small"
                      value={partsCount}
                      onChange={(e) => setPartsCount(Math.max(2, parseInt(e.target.value) || 2))}
                      inputProps={{ min: 2, max: 100 }}
                      sx={{ ...fieldSx, maxWidth: 160 }}
                    />
                    {uploadInfo && (
                      <Typography sx={{ fontFamily: FONT_BODY, fontSize: 12, color: "#7c3aed" }}>
                        → Each clip: {fmtSec(uploadInfo.duration / partsCount)}
                      </Typography>
                    )}
                  </Box>
                )}

                {/* ── Summarize settings ── */}
                {mode === "summarize" && (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_BODY, fontWeight: 600 }}>
                      Target Summary Length
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {SUMMARY_PRESETS.map(({ label, value }) => (
                        <Chip
                          key={value}
                          label={label}
                          onClick={() => setSummaryDuration(value)}
                          sx={{
                            fontFamily: FONT_BODY, fontWeight: 700, fontSize: 12,
                            borderRadius: "8px", cursor: "pointer",
                            background: summaryDuration === value ? NAV_DARK : BG_CHIP,
                            color: summaryDuration === value ? "#fff" : TEXT_BODY,
                            "&:hover": { background: summaryDuration === value ? NAV_HOVER : "#e8e8e8" },
                          }}
                        />
                      ))}
                    </Box>
                    <TextField
                      label="Custom (seconds)" type="number" size="small"
                      value={summaryDuration}
                      onChange={(e) => setSummaryDuration(Math.max(10, parseInt(e.target.value) || 10))}
                      inputProps={{ min: 10, max: 3600 }}
                      sx={{ ...fieldSx, maxWidth: 160 }}
                    />
                    <Typography sx={{ fontFamily: FONT_BODY, fontSize: 12, color: TEXT_MUTED }}>
                      Samples 10 moments evenly across the video, stitches into one HD clip.
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Process button */}
              <Button
                variant="contained"
                onClick={handleProcess}
                disabled={!uploadInfo || processing}
                fullWidth
                sx={primaryBtn(true)}
              >
                {processing
                  ? `Processing… ${procPct}%`
                  : mode === "reels"
                  ? `✂️ Split into ${uploadInfo ? estimatedClips + " " : ""}Reels`
                  : mode === "parts"
                  ? `📐 Split into ${partsCount} Parts`
                  : "✨ Generate Summary"}
              </Button>

              {processing && (
                <LinearProgress
                  variant="determinate" value={procPct}
                  sx={{ borderRadius: 4, mt: -1,
                    "& .MuiLinearProgress-bar": { background: NAV_DARK } }}
                />
              )}

              {error && (
                <Box sx={{
                  p: 2, borderRadius: "12px",
                  background: "#fff5f5", border: "1px solid #fecaca",
                }}>
                  <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13, color: "#dc2626" }}>
                    {error}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* ── RIGHT: results ── */}
            <Box>
              {!results && !processing && (
                <Box sx={{
                  background: "#fff", border: `1px solid ${BORDER_COL}`,
                  borderRadius: "16px", p: 4, textAlign: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)", minHeight: 320,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 1,
                }}>
                  <VideocamIcon sx={{ fontSize: 40, color: "#e0e0e0" }} />
                  <Typography sx={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_MUTED }}>
                    Processed clips will appear here
                  </Typography>
                </Box>
              )}

              {processing && (
                <Box sx={{
                  background: "#fff", border: `1px solid ${BORDER_COL}`,
                  borderRadius: "16px", p: 4, textAlign: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)", minHeight: 320,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 1.5,
                }}>
                  <Box sx={{
                    width: 48, height: 48, borderRadius: "50%",
                    border: `3px solid ${BG_CHIP}`,
                    borderTopColor: NAV_DARK,
                    animation: "vs-spin 0.8s linear infinite",
                  }} />
                  <style>{`@keyframes vs-spin{to{transform:rotate(360deg)}}`}</style>
                  <Typography sx={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 14, color: NAV_DARK }}>
                    Processing with FFmpeg…
                  </Typography>
                  <Typography sx={{ fontFamily: FONT_BODY, fontSize: 12, color: TEXT_MUTED }}>
                    HD quality · Audio preserved · Please wait
                  </Typography>
                </Box>
              )}

              {/* Summary result */}
              {results?.mode === "summarize" && results.summary && (
                <Box sx={{
                  background: "#fff", border: `1px solid ${BORDER_COL}`,
                  borderRadius: "16px", p: { xs: 2, sm: 2.5 },
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}>
                  <Typography sx={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 800,
                    color: TEXT_MUTED, letterSpacing: "2px", textTransform: "uppercase", mb: 2 }}>
                    Summary Ready
                  </Typography>

                  <Box sx={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    p: 2, borderRadius: "12px", background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                  }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box sx={{
                        width: 40, height: 40, borderRadius: "11px",
                        background: "#dcfce7", display: "flex",
                        alignItems: "center", justifyContent: "center",
                      }}>
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
                    <IconButton
                      component="a"
                      href={results.summary.url}
                      download="summary.mp4"
                      target="_blank"
                      sx={{ color: TEXT_MUTED, borderRadius: "8px", p: 0.8,
                        "&:hover": { color: NAV_DARK, background: BG_CHIP } }}
                    >
                      <DownloadIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                </Box>
              )}

              {/* Clips results (reels / parts) */}
              {results && (results.mode === "reels" || results.mode === "parts") && results.clips && (
                <Box sx={{
                  background: "#fff", border: `1px solid ${BORDER_COL}`,
                  borderRadius: "16px", p: { xs: 2, sm: 2.5 },
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                    <Typography sx={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 800,
                      color: TEXT_MUTED, letterSpacing: "2px", textTransform: "uppercase" }}>
                      {results.totalClips} Clips Ready
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<DownloadIcon sx={{ fontSize: 14 }} />}
                      onClick={downloadAll}
                      sx={{
                        fontFamily: FONT_BODY, fontWeight: 700, fontSize: 12,
                        textTransform: "none", color: NAV_DARK,
                        borderRadius: "8px", border: `1px solid #e8e8e8`,
                        px: 1.5, py: 0.5,
                        "&:hover": { background: BG_CHIP },
                      }}
                    >
                      Download All
                    </Button>
                  </Box>

                  <Box sx={{
                    display: "flex", flexDirection: "column", gap: 1,
                    maxHeight: { xs: 360, sm: 500 }, overflowY: "auto",
                    pr: 0.5,
                    "&::-webkit-scrollbar": { width: 4 },
                    "&::-webkit-scrollbar-track": { background: "transparent" },
                    "&::-webkit-scrollbar-thumb": { background: "#e8e8e8", borderRadius: 2 },
                  }}>
                    {results.clips.map((clip) => (
                      <Box key={clip.index} sx={{
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between",
                        p: "10px 14px", borderRadius: "12px",
                        border: `1px solid ${BORDER_COL}`,
                        "&:hover": { background: BG_CHIP },
                        transition: "background 0.15s",
                      }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Box sx={{
                            width: 28, height: 28, borderRadius: "8px",
                            background: NAV_DARK, display: "flex",
                            alignItems: "center", justifyContent: "center",
                          }}>
                            <Typography sx={{ fontFamily: FONT_BODY, fontSize: 11,
                              fontWeight: 800, color: "#fff" }}>
                              {String(clip.index).padStart(2, "0")}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography sx={{ fontFamily: FONT_BODY, fontWeight: 600,
                              fontSize: 13, color: NAV_DARK }}>
                              {clip.filename}
                            </Typography>
                            <Typography sx={{ fontFamily: FONT_BODY, fontSize: 11, color: TEXT_MUTED }}>
                              Start {clip.startTime} · {clip.duration}
                            </Typography>
                          </Box>
                        </Box>
                        <IconButton
                          component="a"
                          href={clip.url}
                          download={clip.filename}
                          target="_blank"
                          size="small"
                          sx={{ color: TEXT_MUTED, borderRadius: "8px", p: 0.6,
                            "&:hover": { color: NAV_DARK, background: "#e8e8e8" } }}
                        >
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

      {/* ── Upload Video Dialog (same style as your Upload File dialog) ── */}
      <Dialog
        open={uploadDialog}
        onClose={() => !uploading && setUploadDialog(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: "20px" },
            fontFamily: FONT_BODY,
            boxShadow: "0 32px 80px rgba(0,0,0,0.15)",
            m: { xs: 0, sm: 2 },
          },
        }}
      >
        <DialogTitle sx={{
          fontFamily: FONT_DISPLAY, fontWeight: 800,
          fontSize: { xs: 18, sm: 20 }, color: NAV_DARK,
          borderBottom: `1px solid ${BORDER_COL}`, pb: 1.5,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          Upload Video
          {isMobile && (
            <IconButton onClick={() => !uploading && setUploadDialog(false)}
              size="small" sx={{ color: TEXT_MUTED }}>
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>

        <DialogContent sx={{ p: { xs: 2, sm: 3 }, display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}>
        {/* Tab switcher */}
        <Box sx={{ display: "flex", background: BG_CHIP, borderRadius: "12px", p: "4px", gap: "4px" }}>
          {["file", "url"].map((t) => (
            <Box
              key={t}
              onClick={() => setUploadTab(t)}
              sx={{
                flex: 1, textAlign: "center", py: 1, borderRadius: "10px", cursor: "pointer",
                background: uploadTab === t ? "#fff" : "transparent",
                boxShadow: uploadTab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.18s",
              }}
            >
              <Typography sx={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 13, color: NAV_DARK }}>
                {t === "file" ? "📁 Upload File" : "🔗 YouTube URL"}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* File tab */}
        {uploadTab === "file" && (
          <>
            <Box component="label" sx={{
              border: `2px dashed ${videoFile ? NAV_DARK : "#e8e8e8"}`,
              borderRadius: "14px", p: { xs: 3, sm: 4 }, textAlign: "center",
              cursor: "pointer", transition: "all 0.2s",
              "&:hover": { borderColor: NAV_DARK, background: "#fafafa" },
              minHeight: 140, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
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

            <Button variant="contained"
              onClick={() => videoFile && handleVideoSelect(videoFile)}
              disabled={!videoFile || uploading} fullWidth sx={primaryBtn(true)}>
              {uploading ? `Uploading ${uploadPct}%…` : "Upload & Analyse"}
            </Button>
          </>
        )}

        {/* URL tab */}
        {uploadTab === "url" && (
          <>
            <TextField
              label="YouTube / Video URL" fullWidth value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              sx={fieldSx}
            />
            <Typography sx={{ fontFamily: FONT_BODY, fontSize: 12, color: TEXT_MUTED }}>
              Supports YouTube, Vimeo, and most public video URLs.
              The video will be downloaded to your server first.
            </Typography>

            {urlUploading && (
              <Box>
                <Typography sx={{ fontFamily: FONT_BODY, fontSize: 12, color: TEXT_MUTED, mb: 0.8 }}>
                  Downloading video… this may take a minute
                </Typography>
                <LinearProgress sx={{ borderRadius: 4,
                  "& .MuiLinearProgress-bar": { background: NAV_DARK } }} />
              </Box>
            )}

            <Button variant="contained"
              onClick={handleUrlUpload}
              disabled={!youtubeUrl || urlUploading} fullWidth sx={primaryBtn(true)}>
              {urlUploading ? "Downloading…" : "Fetch & Analyse"}
            </Button>
          </>
        )}

        </DialogContent>
      </Dialog>
    </>
  );
}