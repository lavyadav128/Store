/**
 * VideosPage.jsx — Pure Black & White Media Wall
 * Upload/Delete/Fetch logic mirrors AdminFileUpload exactly (which works).
 * Only change from dreams: category = "videos"
 * Music: autoplays from /images/songs/song.mp3, stops on unmount
 * Delete button: always visible bottom-right on every card
 */

import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import server from "../environment";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import MusicOffIcon from "@mui/icons-material/MusicOff";

const SONG_PATH = "/images/songs/song.mp3";
const CATEGORY  = "videos";

const isVideo = (url = "") =>
  /\.(mp4|mov|webm|avi|mkv|gif)$/i.test(url) ||
  url.includes("/video/upload/");

export default function VideosPage() {
  const audioRef     = useRef(null);
  const fileInputRef = useRef(null);

  const [media,        setMedia]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [uploading,    setUploading]    = useState(false);
  const [uploadPct,    setUploadPct]    = useState(0);
  const [dialogOpen,   setDialogOpen]   = useState(false);
  const [dragOver,     setDragOver]     = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [musicOn,      setMusicOn]      = useState(false);
  const [previewUrl,   setPreviewUrl]   = useState(null);
  const [uploadError,  setUploadError]  = useState("");

  // ── Auth header — same as admin page ────────────────────────────────────
  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // ── Fetch: GET all resources, filter by category = "videos" ─────────────
  // Same approach as admin page (fetches /api/resources, then filters client-side)
  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${server}/api/resources`, authHeader());
      const all = Array.isArray(res.data) ? res.data : [];
      setMedia(all.filter((r) => r.category === CATEGORY));
    } catch (e) {
      console.error("Fetch error:", e?.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Music: autoplay on mount, stop on unmount ────────────────────────────
  useEffect(() => {
    fetchMedia();

    const audio = new Audio(SONG_PATH);
    audio.loop   = true;
    audio.volume = 0.6;
    audioRef.current = audio;

    audio.play()
      .then(() => setMusicOn(true))
      .catch(() => setMusicOn(false));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicOn) {
      audio.pause();
      setMusicOn(false);
    } else {
      audio.play().then(() => setMusicOn(true)).catch(console.error);
    }
  };

  // ── Preview URL cleanup ──────────────────────────────────────────────────
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const handleFileSelect = (file) => {
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setSelectedFile(file);
    setUploadError("");
  };

  // ── Upload — identical pattern to AdminFileUpload.handleUpload ───────────
  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("title",    selectedFile.name.replace(/\.[^.]+$/, "") || "video");
    formData.append("category", CATEGORY);
    formData.append("file",     selectedFile);

    setUploading(true);
    setUploadPct(0);
    setUploadError("");

    try {
      await axios.post(`${server}/api/resources/upload`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (e) =>
          setUploadPct(Math.round((e.loaded * 100) / e.total)),
      });
      closeDialog();
      await fetchMedia();
    } catch (err) {
      console.error("Upload error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unknown error";
      setUploadError(msg);
    } finally {
      setUploading(false);
      setUploadPct(0);
    }
  };

  // ── Delete — identical to admin page ────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Remove from wall?")) return;
    try {
      await axios.delete(`${server}/api/resources/${id}`, authHeader());
      setMedia((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert("Delete failed: " + (err?.response?.data?.message || err.message));
    }
  };

  const closeDialog = () => {
    if (uploading) return;
    setDialogOpen(false);
    setSelectedFile(null);
    setUploadError("");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setDragOver(false);
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={s.pg}>
      <style>{CSS}</style>

      {/* Music toggle */}
      <button style={s.musicBtn} className="d-music-btn" onClick={toggleMusic}
        title={musicOn ? "Pause music" : "Play music"}>
        {musicOn
          ? <MusicNoteIcon style={{ fontSize: 18 }} />
          : <MusicOffIcon  style={{ fontSize: 18, opacity: 0.4 }} />}
      </button>

      {/* Loading */}
      {loading && (
        <div style={s.centerFill}><div className="d-spin" /></div>
      )}

      {/* Empty state */}
      {!loading && media.length === 0 && (
        <div style={s.emptyHintWrap}>
          <p style={s.emptyBig}>YOUR WALL IS EMPTY.</p>
          <p style={s.emptySmall}>Click + to add your first image or video.</p>
        </div>
      )}

      {/* Wall grid */}
      {!loading && (
        <div style={s.wall}>
          {media.map((item) => (
            <MediaCard
              key={item._id}
              item={item}
              onDelete={() => handleDelete(item._id)}
            />
          ))}
          <div style={s.addCard} className="d-add" onClick={() => setDialogOpen(true)}>
            <AddIcon style={{ fontSize: 44, color: "#2a2a2a" }} />
          </div>
        </div>
      )}

      {/* Upload dialog — portal so admin layout never blocks it */}
      {dialogOpen && ReactDOM.createPortal(
        <div style={s.overlay} onClick={closeDialog}>
          <div style={s.dialog} onClick={(e) => e.stopPropagation()}>

            <div style={s.dialogHeader}>
              <span style={s.dialogTitle}>ADD TO WALL</span>
              {!uploading && (
                <button style={s.closeBtn} onClick={closeDialog}>✕</button>
              )}
            </div>

            {/* Drop zone */}
            <div
              style={{
                ...s.dropZone,
                ...(dragOver     ? s.dropActive   : {}),
                ...(selectedFile ? s.dropSelected : {}),
              }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault(); setDragOver(false);
                handleFileSelect(e.dataTransfer.files[0]);
              }}
              onClick={() => !selectedFile && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: "none" }}
                accept="image/*,video/*,.gif"
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />

              {selectedFile && previewUrl ? (
                <div style={s.previewWrap}>
                  {selectedFile.type.startsWith("video") ? (
                    <video src={previewUrl} style={s.previewMedia} muted autoPlay loop playsInline />
                  ) : (
                    <img src={previewUrl} style={s.previewMedia} alt="preview" />
                  )}
                  <button
                    style={s.changeBtn}
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  >
                    CHANGE
                  </button>
                  <p style={s.fileNameBadge}>{selectedFile.name}</p>
                </div>
              ) : (
                <div style={s.dropHint}>
                  <AddIcon style={{ fontSize: 40, color: "#2e2e2e" }} />
                  <p style={s.dropText}>Drop image · video · GIF here</p>
                  <p style={s.dropSub}>or click to browse</p>
                </div>
              )}
            </div>

            {/* Error */}
            {uploadError && (
              <div style={s.errorBox}>
                <span style={{ fontWeight: 700 }}>Upload failed:</span> {uploadError}
              </div>
            )}

            {/* Progress */}
            {uploading && (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={s.progressTrack}>
                  <div style={{ ...s.progressBar, width: `${uploadPct}%` }} />
                </div>
                <p style={s.progressTxt}>{uploadPct}%</p>
              </div>
            )}

            {/* Upload button */}
            {selectedFile && !uploading && (
              <button style={s.uploadBtn} className="d-upload-btn" onClick={handleUpload}>
                ADD TO WALL
              </button>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

// ── Media Card — delete button always visible ────────────────────────────────
function MediaCard({ item, onDelete }) {
  const url = item.fileUrl || item.resourceUrl || "";
  return (
    <div style={s.card} className="d-card">
      {isVideo(url) ? (
        <video src={url} style={s.cardMedia} autoPlay loop muted playsInline />
      ) : (
        <img src={url} alt="" style={s.cardMedia} loading="lazy" />
      )}
      <button
        style={s.deleteBtn}
        className="d-delete-btn"
        title="Remove"
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
      >
        <DeleteOutlineIcon style={{ fontSize: 18 }} />
      </button>
    </div>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const s = {
  pg:            { background: "#000", minHeight: "100vh", position: "relative", fontFamily: "'DM Sans',sans-serif" },
  musicBtn:      { position: "fixed", bottom: 24, right: 24, zIndex: 500, width: 44, height: 44, borderRadius: "50%", background: "#0a0a0a", border: "1px solid #1e1e1e", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  centerFill:    { position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#000", zIndex: 5, pointerEvents: "none" },
  emptyHintWrap: { position: "fixed", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 1 },
  emptyBig:      { margin: 0, fontSize: "clamp(24px,4vw,48px)", fontWeight: 800, letterSpacing: "-1px", color: "#111" },
  emptySmall:    { margin: "10px 0 0", fontSize: 11, color: "#1e1e1e", letterSpacing: "2.5px" },
  wall:          { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 3, padding: 3 },
  card:          { position: "relative", aspectRatio: "9/16", overflow: "hidden", background: "#050505" },
  cardMedia:     { width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(1) contrast(1.06)", transition: "filter 0.3s" },
  deleteBtn:     { position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,0.72)", border: "1px solid #2a2a2a", color: "#fff", borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10, transition: "background 0.2s, border-color 0.2s" },
  addCard:       { aspectRatio: "9/16", border: "1px dashed #111", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "#020202", transition: "border-color 0.2s, background 0.2s" },
  overlay:       { position: "fixed", inset: 0, background: "rgba(0,0,0,0.93)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center" },
  dialog:        { background: "#080808", border: "1px solid #1a1a1a", borderRadius: 16, padding: "24px", width: "min(460px,92vw)", position: "relative", display: "flex", flexDirection: "column", gap: 16 },
  dialogHeader:  { display: "flex", alignItems: "center", justifyContent: "space-between" },
  dialogTitle:   { fontSize: 11, fontWeight: 800, letterSpacing: "3px", color: "#333" },
  closeBtn:      { background: "transparent", border: "none", color: "#333", fontSize: 18, cursor: "pointer", lineHeight: 1, padding: 0 },
  dropZone:      { border: "1px dashed #1a1a1a", borderRadius: 12, minHeight: 240, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", transition: "border-color 0.2s, background 0.2s", userSelect: "none" },
  dropActive:    { borderColor: "#3a3a3a", background: "#0c0c0c" },
  dropSelected:  { border: "1px solid #1e1e1e", cursor: "default", padding: 0 },
  dropHint:      { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "32px 24px" },
  dropText:      { margin: 0, fontSize: 13, color: "#333", letterSpacing: "1.5px" },
  dropSub:       { margin: 0, fontSize: 11, color: "#1e1e1e" },
  previewWrap:   { width: "100%", position: "relative" },
  previewMedia:  { width: "100%", maxHeight: 280, objectFit: "cover", display: "block", borderRadius: 10, filter: "brightness(0.9) contrast(1.08)" },
  changeBtn:     { position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.75)", border: "1px solid #333", color: "#888", fontSize: 10, letterSpacing: "1.5px", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" },
  fileNameBadge: { position: "absolute", bottom: 8, left: 10, margin: 0, fontSize: 10, color: "#fff", background: "rgba(0,0,0,0.75)", padding: "3px 10px", borderRadius: 4, letterSpacing: "1px", maxWidth: "75%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  errorBox:      { background: "#1a0000", border: "1px solid #3a0000", borderRadius: 8, padding: "10px 14px", fontSize: 11, color: "#ff6b6b", letterSpacing: "0.5px", lineHeight: 1.5 },
  progressTrack: { flex: 1, height: 2, background: "#0e0e0e", borderRadius: 2, overflow: "hidden" },
  progressBar:   { height: "100%", background: "#fff", borderRadius: 2, transition: "width 0.3s" },
  progressTxt:   { margin: 0, fontSize: 11, color: "#3a3a3a", minWidth: 30, textAlign: "right" },
  uploadBtn:     { width: "100%", padding: "14px 0", background: "#fff", color: "#000", border: "none", borderRadius: 10, fontSize: 11, fontWeight: 800, letterSpacing: "3px", cursor: "pointer", transition: "background 0.2s", fontFamily: "'DM Sans',sans-serif" },
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700;800&display=swap');
.d-spin { width:26px;height:26px;border:1.5px solid #0e0e0e;border-top-color:#333;border-radius:50%;animation:dspin 0.8s linear infinite; }
@keyframes dspin { to { transform:rotate(360deg); } }
.d-card:hover video, .d-card:hover img { filter:brightness(1.1) contrast(1.12) !important; }
.d-delete-btn:hover { background:rgba(180,0,0,0.82) !important; border-color:#600 !important; }
.d-add:hover        { border-color:#252525 !important; background:#060606 !important; }
.d-music-btn:hover  { border-color:#333 !important; }
.d-upload-btn:hover { background:#d8d8d8 !important; }
`;