import React, { useState, useRef, useCallback } from "react";
import {
  Box, Typography, Button, TextField, MenuItem,
  Select, InputLabel, FormControl, IconButton,
  Dialog, DialogTitle, DialogContent, Fade,
  LinearProgress, useMediaQuery, useTheme, Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DownloadIcon from "@mui/icons-material/Download";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import MergeIcon from "@mui/icons-material/Merge";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import axios from "axios";
import server from "../environment";

// ─── Backend base URL — same pattern as your existing code ───────────────────
// Your backend/server.js should run on port 3001 (or whatever you set)
const VIDEO_API = server; // reuse your existing server env variable

const RESOLUTION_OPTIONS = [
  { label: "HD 720p (recommended)", value: "1280:720" },
  { label: "Full HD 1080p", value: "1920:1080" },
  { label: "360p (faster)", value: "640:360" },
];

// ─── Small helpers ────────────────────────────────────────────────────────────
const fmtSize = (b) => {
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
};

const STEPS = [
  { id: "upload",  label: "Uploading clips" },
  { id: "norm",    label: "Normalizing" },
  { id: "stitch",  label: "Stitching" },
  { id: "finish",  label: "Finishing" },
];

// ─── Component ────────────────────────────────────────────────────────────────
const VideoMerger = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // clips: { id, file, filename, status:"idle"|"uploading"|"ready"|"error", progress, objUrl }
  const [clips, setClips]           = useState([]);
  const [outputName, setOutputName] = useState("merged_video");
  const [resolution, setResolution] = useState("1280:720");
  const [merging, setMerging]       = useState(false);
  const [mergeProgress, setMergeProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(null); // step id string
  const [resultUrl, setResultUrl]   = useState(null);
  const [resultFilename, setResultFilename] = useState("");
  const [resultOpen, setResultOpen] = useState(false);
  const [errorMsg, setErrorMsg]     = useState("");

  const dragSrc = useRef(null);
  const fileInputRef = useRef(null);
  const pollRef = useRef(null);

  // ── Upload a single clip to backend ────────────────────────────────────────
  const uploadClip = useCallback(async (clip) => {
    const fd = new FormData();
    fd.append("videos", clip.file);

    try {
      const res = await axios.post(`${VIDEO_API}/api/video-merge/upload`, fd, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / e.total);
          setClips((prev) =>
            prev.map((c) => (c.id === clip.id ? { ...c, progress: pct } : c))
          );
        },
      });
      const serverFilename = res.data.files[0].filename;
      setClips((prev) =>
        prev.map((c) =>
          c.id === clip.id ? { ...c, status: "ready", filename: serverFilename } : c
        )
      );
    } catch {
      setClips((prev) =>
        prev.map((c) => (c.id === clip.id ? { ...c, status: "error" } : c))
      );
    }
  }, []);

  // ── Add files ───────────────────────────────────────────────────────────────
  const handleFiles = useCallback(
    (files) => {
      const videos = [...files].filter((f) => f.type.startsWith("video/"));
      if (!videos.length) return;
      const newClips = videos.map((file) => ({
        id: Math.random().toString(36).slice(2),
        file,
        filename: null,
        status: "uploading",
        progress: 0,
        objUrl: URL.createObjectURL(file),
      }));
      setClips((prev) => {
        const next = [...prev, ...newClips];
        return next;
      });
      newClips.forEach((clip) => uploadClip(clip));
    },
    [uploadClip]
  );

  // ── Drag & drop on zone ─────────────────────────────────────────────────────
  const [dropping, setDropping] = useState(false);
  const onDragOver  = (e) => { e.preventDefault(); setDropping(true); };
  const onDragLeave = ()  => setDropping(false);
  const onDrop      = (e) => { e.preventDefault(); setDropping(false); handleFiles(e.dataTransfer.files); };

  // ── Remove clip ─────────────────────────────────────────────────────────────
  const removeClip = (id) => {
    const clip = clips.find((c) => c.id === id);
    if (clip?.filename) {
      axios
        .delete(`${VIDEO_API}/api/video-merge/file/${clip.filename}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .catch(() => {});
    }
    setClips((prev) => prev.filter((c) => c.id !== id));
  };

  // ── Card drag-to-reorder ────────────────────────────────────────────────────
  const onCardDragStart = (e, id) => { dragSrc.current = id; e.dataTransfer.effectAllowed = "move"; };
  const onCardDragOver  = (e) => e.preventDefault();
  const onCardDrop      = (e, toId) => {
    e.preventDefault();
    if (!dragSrc.current || dragSrc.current === toId) return;
    setClips((prev) => {
      const arr = [...prev];
      const fi = arr.findIndex((c) => c.id === dragSrc.current);
      const ti = arr.findIndex((c) => c.id === toId);
      const [moved] = arr.splice(fi, 1);
      arr.splice(ti, 0, moved);
      return arr;
    });
    dragSrc.current = null;
  };

  // ── Merge ───────────────────────────────────────────────────────────────────
  const startMerge = async () => {
    const readyClips = clips.filter((c) => c.status === "ready");
    if (readyClips.length < 2) return;
    setMerging(true);
    setMergeProgress(0);
    setErrorMsg("");
    setActiveStep("upload");

    try {
      const res = await axios.post(
        `${VIDEO_API}/api/video-merge/merge`,
        {
          filenames: readyClips.map((c) => c.filename),
          outputName: outputName || "merged_video",
          resolution,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const { jobId } = res.data;
      pollJob(jobId);
    } catch {
      setErrorMsg("Could not start merge. Is the backend running?");
      setMerging(false);
    }
  };

  const pollJob = (jobId) => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await axios.get(`${VIDEO_API}/api/video-merge/status/${jobId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const { status, progress, output, error } = res.data;

        setMergeProgress(progress);
        if (progress < 80)       setActiveStep("norm");
        else if (progress < 95)  setActiveStep("stitch");
        else                     setActiveStep("finish");

        if (status === "done") {
          clearInterval(pollRef.current);
          setActiveStep("done");
          setResultFilename(output);
          setResultUrl(`${VIDEO_API}/api/video-merge/outputs/${output}`);
          setResultOpen(true);
          setMerging(false);
        } else if (status === "error") {
          clearInterval(pollRef.current);
          setErrorMsg(error || "Merge failed.");
          setMerging(false);
        }
      } catch {
        clearInterval(pollRef.current);
        setErrorMsg("Lost connection to server.");
        setMerging(false);
      }
    }, 900);
  };

  // ── Reset ───────────────────────────────────────────────────────────────────
  const resetAll = () => {
    clips.forEach((c) => {
      if (c.filename)
        axios
          .delete(`${VIDEO_API}/api/video-merge/file/${c.filename}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          })
          .catch(() => {});
    });
    setClips([]);
    setResultUrl(null);
    setResultFilename("");
    setMergeProgress(0);
    setActiveStep(null);
    setErrorMsg("");
    setResultOpen(false);
  };

  const allReady  = clips.length >= 2 && clips.every((c) => c.status === "ready");
  const anyUpload = clips.some((c) => c.status === "uploading");

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');`}</style>

      <Fade in timeout={500}>
        <Box sx={{ px: { xs: 0, sm: 0 } }}>

          {/* ── Header ── */}
          <Box sx={{
            mb: { xs: 3, sm: 4 },
            display: "flex", alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between", flexWrap: "wrap", gap: 2,
          }}>
            <Box>
              <Typography sx={{
                fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 800,
                color: "#aaa", letterSpacing: "2px", textTransform: "uppercase", mb: 0.5,
              }}>
                Video Tools
              </Typography>
              <Typography sx={{
                fontFamily: "'Playfair Display', serif", fontWeight: 800,
                fontSize: { xs: 22, sm: 30 }, color: "#1a1a2e", letterSpacing: "-1px",
              }}>
                Video Merger
              </Typography>
              <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#aaa", mt: 0.5 }}>
                Stitch shorts, reels and scenes into one seamless video — zero black frames
              </Typography>
            </Box>

            {clips.length > 0 && (
              <Button
                variant="outlined"
                onClick={resetAll}
                disabled={merging}
                sx={{
                  borderRadius: "14px", fontFamily: "'DM Sans'", fontWeight: 700,
                  fontSize: 13, py: 1.2, px: 2.5, textTransform: "none",
                  borderColor: "#e8e8e8", color: "#888",
                  "&:hover": { borderColor: "#1a1a2e", color: "#1a1a2e", background: "transparent" },
                }}
              >
                Start over
              </Button>
            )}
          </Box>

          {/* ── Drop Zone ── */}
          <Box
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              border: `2px dashed ${dropping ? "#1a1a2e" : "#e8e8e8"}`,
              borderRadius: "18px",
              p: { xs: 3, sm: 4 },
              textAlign: "center",
              cursor: "pointer",
              background: dropping ? "#fafafa" : "#fff",
              transition: "all .2s ease",
              mb: 3,
              "&:hover": { borderColor: "#1a1a2e", background: "#fafafa" },
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              multiple
              hidden
              onChange={(e) => handleFiles(e.target.files)}
            />
            <Box sx={{
              width: 52, height: 52, borderRadius: "14px",
              background: "#f4f4f6",
              display: "flex", alignItems: "center", justifyContent: "center",
              mx: "auto", mb: 1.5,
            }}>
              <VideoFileIcon sx={{ fontSize: 26, color: "#1a1a2e" }} />
            </Box>
            <Typography sx={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 15, color: "#1a1a2e", mb: 0.5 }}>
              Drop video clips here
            </Typography>
            <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#aaa" }}>
              or <span style={{ color: "#1a1a2e", fontWeight: 700 }}>click to browse</span>
              &nbsp;· MP4, MOV, AVI, WebM · up to 500 MB each
            </Typography>
          </Box>

          {/* ── Clips list ── */}
          {clips.length > 0 && (
            <>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                <Typography sx={{
                  fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 800,
                  color: "#aaa", letterSpacing: "2px", textTransform: "uppercase",
                }}>
                  {clips.length} clip{clips.length !== 1 ? "s" : ""} — drag to reorder
                </Typography>
                {anyUpload && (
                  <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#aaa" }}>
                    Uploading…
                  </Typography>
                )}
              </Box>

              <Box sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(auto-fill, minmax(260px, 1fr))" },
                gap: { xs: 1.5, sm: 2 },
                mb: 3,
              }}>
                {clips.map((clip, idx) => (
                  <Box
                    key={clip.id}
                    draggable
                    onDragStart={(e) => onCardDragStart(e, clip.id)}
                    onDragOver={onCardDragOver}
                    onDrop={(e) => onCardDrop(e, clip.id)}
                    sx={{
                      background: "#fff",
                      border: "1px solid #f0f0f0",
                      borderRadius: "16px",
                      p: { xs: 2, sm: 2.5 },
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      display: "flex", flexDirection: "column", gap: 1.5,
                      cursor: "grab",
                      transition: "box-shadow .15s",
                      "&:active": { cursor: "grabbing" },
                      "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.08)" },
                    }}
                  >
                    {/* Clip header */}
                    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                        {/* Order badge */}
                        <Box sx={{
                          width: 40, height: 40, borderRadius: "11px",
                          background: "#f4f4f6",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, position: "relative",
                        }}>
                          <Typography sx={{
                            fontFamily: "'DM Sans'", fontWeight: 800,
                            fontSize: 15, color: "#1a1a2e",
                          }}>
                            {idx + 1}
                          </Typography>
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{
                            fontFamily: "'DM Sans'", fontWeight: 700,
                            fontSize: { xs: 13, sm: 14 }, color: "#1a1a2e", lineHeight: 1.3,
                            overflow: "hidden", textOverflow: "ellipsis",
                            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                          }}>
                            {clip.file.name}
                          </Typography>
                          <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#aaa", mt: 0.3 }}>
                            {fmtSize(clip.file.size)}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
                        <DragIndicatorIcon sx={{ fontSize: 16, color: "#ccc" }} />
                        <IconButton
                          onClick={() => removeClip(clip.id)}
                          size="small"
                          disabled={merging}
                          sx={{
                            color: "#ccc", borderRadius: "8px", p: 0.6,
                            "&:hover": { color: "#e53935", background: "#fff0f0" },
                          }}
                        >
                          <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Status row */}
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Box sx={{ px: 1.2, py: 0.3, borderRadius: "8px", background: "#f4f4f6" }}>
                        <Typography sx={{
                          fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 700,
                          color: clip.status === "ready" ? "#2e7d32"
                               : clip.status === "error" ? "#c62828"
                               : "#555",
                        }}>
                          {clip.status === "uploading" ? `Uploading ${clip.progress}%`
                           : clip.status === "ready"    ? "✓ Ready"
                           : clip.status === "error"    ? "Upload failed"
                           : "Waiting"}
                        </Typography>
                      </Box>
                      {/* Thumbnail preview */}
                      <Box
                        component="video"
                        src={clip.objUrl}
                        muted
                        preload="metadata"
                        sx={{
                          width: 60, height: 36, borderRadius: "8px",
                          objectFit: "cover", background: "#f4f4f6",
                          flexShrink: 0,
                        }}
                      />
                    </Box>

                    {/* Upload progress bar */}
                    {clip.status === "uploading" && (
                      <LinearProgress
                        variant="determinate"
                        value={clip.progress}
                        sx={{
                          borderRadius: "4px", height: 3,
                          backgroundColor: "#f0f0f0",
                          "& .MuiLinearProgress-bar": { background: "#1a1a2e" },
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Box>

              {/* ── Settings ── */}
              <Box sx={{
                background: "#fff", border: "1px solid #f0f0f0",
                borderRadius: "16px", p: { xs: 2, sm: 2.5 }, mb: 3,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}>
                <Typography sx={{
                  fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 800,
                  color: "#aaa", letterSpacing: "2px", textTransform: "uppercase", mb: 2,
                }}>
                  Output settings
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <TextField
                    label="Output filename"
                    value={outputName}
                    onChange={(e) => setOutputName(e.target.value)}
                    size="small"
                    sx={{
                      flex: 1, minWidth: 160,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "14px", fontFamily: "'DM Sans'",
                        "& fieldset": { borderColor: "#e8e8e8" },
                        "&.Mui-focused fieldset": { borderColor: "#1a1a2e" },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#1a1a2e" },
                    }}
                  />
                  <FormControl size="small" sx={{ flex: 1, minWidth: 160 }}>
                    <InputLabel sx={{ fontFamily: "'DM Sans'" }}>Resolution</InputLabel>
                    <Select
                      value={resolution}
                      label="Resolution"
                      onChange={(e) => setResolution(e.target.value)}
                      sx={{
                        borderRadius: "14px", fontFamily: "'DM Sans'",
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e8e8e8" },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1a1a2e" },
                      }}
                    >
                      {RESOLUTION_OPTIONS.map((o) => (
                        <MenuItem key={o.value} value={o.value} sx={{ fontFamily: "'DM Sans'" }}>
                          {o.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* ── Merge button ── */}
              <Button
                variant="contained"
                fullWidth
                disabled={!allReady || merging}
                onClick={startMerge}
                startIcon={<MergeIcon />}
                sx={{
                  background: "#1a1a2e", borderRadius: "14px",
                  fontFamily: "'DM Sans'", fontWeight: 700,
                  fontSize: { xs: 15, sm: 15 }, py: { xs: 1.8, sm: 1.6 },
                  textTransform: "none", boxShadow: "none",
                  "&:hover": { background: "#2d2d4e", boxShadow: "0 8px 24px rgba(26,26,46,0.25)" },
                  "&:disabled": { background: "#e8e8e8", color: "#aaa" },
                  mb: 2,
                }}
              >
                {merging
                  ? `Merging… ${mergeProgress}%`
                  : !allReady && anyUpload
                  ? "Waiting for uploads…"
                  : clips.length < 2
                  ? `Need ${2 - clips.length} more clip${clips.length === 1 ? "" : "s"}`
                  : `Merge ${clips.filter(c => c.status === "ready").length} clips seamlessly`}
              </Button>

              {/* ── Merge progress ── */}
              {merging && (
                <Box sx={{
                  background: "#fff", border: "1px solid #f0f0f0",
                  borderRadius: "16px", p: { xs: 2, sm: 2.5 }, mb: 3,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography sx={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 13, color: "#1a1a2e" }}>
                      Processing your clips…
                    </Typography>
                    <Typography sx={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 13, color: "#1a1a2e" }}>
                      {mergeProgress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={mergeProgress}
                    sx={{
                      borderRadius: "4px", height: 5, mb: 2,
                      backgroundColor: "#f0f0f0",
                      "& .MuiLinearProgress-bar": { background: "#1a1a2e" },
                    }}
                  />
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {STEPS.map((s) => {
                      const isDone = (
                        (s.id === "upload"  && ["norm","stitch","finish","done"].includes(activeStep)) ||
                        (s.id === "norm"    && ["stitch","finish","done"].includes(activeStep)) ||
                        (s.id === "stitch"  && ["finish","done"].includes(activeStep)) ||
                        (s.id === "finish"  && activeStep === "done")
                      );
                      const isActive = activeStep === s.id;
                      return (
                        <Box key={s.id} sx={{
                          display: "flex", alignItems: "center", gap: 0.6,
                          px: 1.2, py: 0.4, borderRadius: "8px",
                          background: isDone ? "#f0faf4" : isActive ? "#f4f4f6" : "#fafafa",
                          border: `1px solid ${isDone ? "#c8e6c9" : isActive ? "#1a1a2e" : "#f0f0f0"}`,
                          transition: "all .3s",
                        }}>
                          <Box sx={{
                            width: 6, height: 6, borderRadius: "50%",
                            background: isDone ? "#2e7d32" : isActive ? "#1a1a2e" : "#ccc",
                            flexShrink: 0,
                            ...(isActive && { animation: "pulse 1.2s infinite" }),
                          }} />
                          <Typography sx={{
                            fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 700,
                            color: isDone ? "#2e7d32" : isActive ? "#1a1a2e" : "#aaa",
                          }}>
                            {s.label}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}

              {/* ── Error ── */}
              {errorMsg && (
                <Box sx={{
                  background: "#fff8f8", border: "1px solid #ffcdd2",
                  borderRadius: "12px", px: 2, py: 1.5, mb: 2,
                }}>
                  <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#c62828", fontWeight: 600 }}>
                    {errorMsg}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Box>
      </Fade>

      {/* ── Result Modal ── */}
      <Dialog
        open={resultOpen}
        onClose={() => setResultOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: "20px" },
            fontFamily: "'DM Sans'",
            boxShadow: "0 32px 80px rgba(0,0,0,0.15)",
            m: { xs: 0, sm: 2 },
          },
        }}
      >
        <DialogTitle sx={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 800, fontSize: { xs: 18, sm: 20 },
          color: "#1a1a2e", borderBottom: "1px solid #f0f0f0",
          pb: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircleOutlineIcon sx={{ color: "#2e7d32", fontSize: 22 }} />
            Video Ready!
          </Box>
          <IconButton onClick={() => setResultOpen(false)} size="small" sx={{ color: "#aaa" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: { xs: 2, sm: 3 }, display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#aaa" }}>
            {clips.filter(c => c.status === "ready").length} clips merged into 1 seamless video
          </Typography>

          {/* Preview */}
          <Box
            component="video"
            src={resultUrl}
            controls
            sx={{
              width: "100%", borderRadius: "14px",
              background: "#000", maxHeight: 320,
            }}
          />

          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <Button
              component="a"
              href={resultUrl}
              download={resultFilename}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              startIcon={<DownloadIcon />}
              sx={{
                flex: 1, background: "#1a1a2e", borderRadius: "14px",
                fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 14,
                py: 1.4, textTransform: "none", boxShadow: "none",
                "&:hover": { background: "#2d2d4e" },
              }}
            >
              Download
            </Button>
            <Button
              onClick={() => { setResultOpen(false); resetAll(); }}
              variant="outlined"
              sx={{
                flex: 1, borderRadius: "14px", fontFamily: "'DM Sans'",
                fontWeight: 700, fontSize: 14, py: 1.4, textTransform: "none",
                borderColor: "#e8e8e8", color: "#888",
                "&:hover": { borderColor: "#1a1a2e", color: "#1a1a2e", background: "transparent" },
              }}
            >
              Merge new clips
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
    </>
  );
};

export default VideoMerger;
