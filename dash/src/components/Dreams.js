import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import server from "../environment";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import MusicOffIcon from "@mui/icons-material/MusicOff";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SONG_PATH = "/images/songs/song.mp3";
const CATEGORY  = "videos";

const isVideo = (url = "") =>
  /\.(mp4|mov|webm|avi|mkv)$/i.test(url) ||
  (url.includes("/video/upload/") && !url.toLowerCase().endsWith(".gif"));

  export default function Dreams({ onBack }) {
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
  const [ratio,        setRatio]        = useState(null);
  const [activeId, setActiveId] = useState(null);

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

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

  const tryPlayMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || musicOn) return;
    audio.play()
      .then(() => setMusicOn(true))
      .catch(() => {
        const resume = () => {
          audio.play()
            .then(() => setMusicOn(true))
            .catch(() => {});
          document.removeEventListener("touchstart", resume);
          document.removeEventListener("click",      resume);
        };
        document.addEventListener("touchstart", resume, { once: true });
        document.addEventListener("click",      resume, { once: true });
      });
  }, [musicOn]);

  useEffect(() => {
    fetchMedia();

    const audio = new Audio(SONG_PATH);
    audio.loop   = true;
    audio.volume = 0.6;
    audioRef.current = audio;

    const t = setTimeout(tryPlayMusic, 400);

    return () => {
      clearTimeout(t);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const handleFileSelect = (file) => {
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setSelectedFile(file);
    setUploadError("");
  };

  const handleUpload = async () => {
    if (!selectedFile || !ratio) return;

    const formData = new FormData();
    formData.append("title",    selectedFile.name.replace(/\.[^.]+$/, "") || "media");
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

      const res = await axios.get(`${server}/api/resources`, authHeader());
      const all = Array.isArray(res.data) ? res.data : [];
      const newest = all
        .filter((r) => r.category === CATEGORY)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
      if (newest?._id) {
        localStorage.setItem(`ratio_${newest._id}`, ratio);
      }

      closeDialog();
      await fetchMedia();
    } catch (err) {
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

  const handleDelete = async (id) => {
    if (!window.confirm("Remove from wall?")) return;
    try {
      await axios.delete(`${server}/api/resources/${id}`, authHeader());
      localStorage.removeItem(`ratio_${id}`);
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
    setRatio(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setDragOver(false);
  };

  const step = !selectedFile ? 1 : !ratio ? 2 : 3;


  const handleVideoPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setMusicOn(false);
  }, []);
  
  const handleVideoStop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play()
      .then(() => setMusicOn(true))
      .catch(() => {});
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 }, // prevents accidental drags on tap
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 6 }, // hold 200ms to start drag on mobile
    })
  );

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
  };
  
  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over || active.id === over.id) return;
    setMedia((prev) => {
      const oldIndex = prev.findIndex((m) => m._id === active.id);
      const newIndex = prev.findIndex((m) => m._id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };
  
  return (
    <div className="vp-fullscreen">
    <style>{STYLES}</style>  
      {/* Floating Back Button */}
      <button
        onClick={() => onBack && onBack()}
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 9999,
          width: 38,
          height: 38,
          borderRadius: "12px",
          background: "rgba(10,10,10,0.85)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          fontSize: 18,
          lineHeight: 1,
        }}
      >
        ‹
      </button>
  
      {/* Music toggle */}

      {/* Music toggle */}
      <button
        style={s.musicBtn}
        className="vp-music-btn"
        onClick={toggleMusic}
        title={musicOn ? "Pause music" : "Play music"}
      >
        {musicOn
          ? <MusicNoteIcon style={{ fontSize: 17 }} />
          : <MusicOffIcon  style={{ fontSize: 17, opacity: 0.35 }} />}
      </button>

      {/* Loading */}
      {loading && (
        <div style={s.centerFill}>
          <div className="vp-spin" />
        </div>
      )}

      {/* ── Beautiful empty state ── */}
      {!loading && media.length === 0 && (
        <div style={s.emptyWrap}>
          <div className="vp-orb vp-orb1" />
          <div className="vp-orb vp-orb2" />
          <div className="vp-orb vp-orb3" />
          <div className="vp-grid" />

          <div style={s.emptyInner}>
            <div className="vp-ring-wrap">
              <div className="vp-ring vp-ring-outer" />
              <div className="vp-ring vp-ring-mid" />
              <div className="vp-ring vp-ring-inner" />
              <div className="vp-plus-icon" onClick={() => setDialogOpen(true)}>
                <AddIcon style={{ fontSize: 32, color: "rgba(255,255,255,0.9)" }} />
              </div>
            </div>

            <p style={s.emptyHead}>YOUR WALL AWAITS</p>
            <p style={s.emptySub}>
              Drop your first image, video or GIF<br />to bring this space to life.
            </p>

            <button
              style={s.emptyBtn}
              className="vp-empty-btn"
              onClick={() => setDialogOpen(true)}
            >
              <AddIcon style={{ fontSize: 15, marginRight: 8 }} />
              ADD FIRST MEDIA
            </button>

            <div className="vp-pills">
              <span className="vp-pill vp-pill1">VIDEO</span>
              <span className="vp-pill vp-pill2">IMAGE</span>
              <span className="vp-pill vp-pill3">GIF</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Wall ── */}
      {!loading && media.length > 0 && (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={media.map((m) => m._id)}
          strategy={rectSortingStrategy}
        >
          <div style={s.wall} className="vp-masonry">
            {media.map((item, i) => (
              <SortableCard
                key={item._id}
                item={item}
                index={i}
                onDelete={() => handleDelete(item._id)}
                onVideoPlay={handleVideoPlay}
                onVideoStop={handleVideoStop}
              />
            ))}

            {/* Add card */}
            <div style={s.addCard} className="vp-add-card" onClick={() => setDialogOpen(true)}>
              <div className="vp-add-icon">
                <AddIcon style={{ fontSize: 26 }} />
              </div>
              <span style={s.addText}>ADD MEDIA</span>
            </div>
          </div>
        </SortableContext>

        {/* Ghost card shown while dragging */}
        <DragOverlay>
          {activeId ? (() => {
            const item = media.find((m) => m._id === activeId);
            return item ? (
              <div style={{ opacity: 0.85, borderRadius: 10, overflow: "hidden" }}>
                <MediaCard item={item} index={0} />
              </div>
            ) : null;
          })() : null}
        </DragOverlay>
      </DndContext>
    )}

      {/* ── Upload Dialog ── */}
      {dialogOpen && ReactDOM.createPortal(
        <div style={s.overlay} onClick={closeDialog}>
          <div style={s.dialog} onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div style={s.dialogHeader}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={s.dialogTitle}>
                  {step === 1 && "STEP 1 — CHOOSE FILE"}
                  {step === 2 && "STEP 2 — CHOOSE RATIO"}
                  {step === 3 && "STEP 3 — CONFIRM"}
                </span>
                <div style={{ display: "flex", gap: 5 }}>
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      style={{
                        width: n <= step ? 20 : 6,
                        height: 5,
                        borderRadius: 3,
                        background: n <= step ? "#7c3aed" : "#1a1a1a",
                        transition: "all 0.35s cubic-bezier(0.23,1,0.32,1)",
                      }}
                    />
                  ))}
                </div>
              </div>
              {!uploading && (
                <button style={s.closeBtn} onClick={closeDialog}>✕</button>
              )}
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <div
                style={{ ...s.dropZone, ...(dragOver ? s.dropActive : {}) }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFileSelect(e.dataTransfer.files[0]);
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  style={{ display: "none" }}
                  accept="image/*,video/*,.gif"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                />
                <div style={s.dropHint}>
                  <div className="vp-drop-icon">
                    <AddIcon style={{ fontSize: 36, color: "rgba(124,58,237,0.7)" }} />
                  </div>
                  <p style={s.dropText}>Drop image · video · GIF here</p>
                  <p style={s.dropSub}>or tap to browse</p>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <p style={{ margin: 0, fontSize: 11, color: "#444", letterSpacing: "0.5px" }}>
                  How should this appear on the wall?
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  {[
                    { r: "9/16",  label: "9 : 16",  sub: "Portrait · Reels",    w: 52 },
                    { r: "16/9",  label: "16 : 9",  sub: "Landscape · Videos",  w: 94 },
                    { r: "1/1",   label: "1 : 1",   sub: "Square · Posts",      w: 64 },
                  ].map(({ r, label, sub, w }) => (
                    <button
                      key={r}
                      style={{ ...s.ratioBtn, ...(ratio === r ? s.ratioBtnActive : {}) }}
                      onClick={() => setRatio(r)}
                    >
                      <div style={{ ...s.ratioPreview, aspectRatio: r, width: w }} />
                      <span style={s.ratioLabel}>{label}</span>
                      <span style={s.ratioSub}>{sub}</span>
                    </button>
                  ))}
                </div>
                <button style={s.backBtn} onClick={() => setSelectedFile(null)}>
                  ← Back
                </button>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{
                  width: "100%", aspectRatio: ratio, overflow: "hidden",
                  borderRadius: 10, background: "#050505", maxHeight: 300,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "1px solid #1a1a1a",
                }}>
                  {selectedFile?.type.startsWith("video") ? (
                    <video
                      src={previewUrl}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      muted autoPlay loop playsInline
                    />
                  ) : (
                    <img
                      src={previewUrl}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      alt="preview"
                    />
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{
                    margin: 0, fontSize: 11, color: "#444", maxWidth: "70%",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {selectedFile?.name}
                  </p>
                  <span style={s.ratioBadge}>{ratio.replace("/", " : ")}</span>
                </div>

                <button style={s.backBtn} onClick={() => setRatio(null)}>
                  ← Change ratio
                </button>

                {uploadError && (
                  <div style={s.errorBox}>
                    <span style={{ fontWeight: 700 }}>Upload failed:</span> {uploadError}
                  </div>
                )}

                {uploading && (
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={s.progressTrack}>
                      <div style={{ ...s.progressBar, width: `${uploadPct}%` }} />
                    </div>
                    <p style={s.progressTxt}>{uploadPct}%</p>
                  </div>
                )}

                {!uploading && (
                  <button
                    style={s.uploadBtn}
                    className="vp-upload-btn"
                    onClick={handleUpload}
                  >
                    ADD TO WALL
                  </button>
                )}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}


function SortableCard({ item, index, onDelete, onVideoPlay, onVideoStop }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 999 : "auto",
    touchAction: "none", // required for touch drag to work
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <MediaCard
        item={item}
        index={index}
        onDelete={onDelete}
        onVideoPlay={onVideoPlay}
        onVideoStop={onVideoStop}
      />
    </div>
  );
}



// ── Media Card ────────────────────────────────────────────────────────────────
function MediaCard({ item, onDelete, index, onVideoPlay, onVideoStop }) {
  const url       = item.fileUrl || item.resourceUrl || "";
  const cardRatio = item.ratio || localStorage.getItem(`ratio_${item._id}`) || "9/16";
  const isGif     = url.toLowerCase().endsWith(".gif");
  const isVid     = !isGif && isVideo(url);

  const [muted,   setMuted]   = useState(true);
  const [playing, setPlaying] = useState(false);
  const videoRef              = useRef(null);

  const badgeClass = cardRatio === "9/16" ? "vp-bp" : cardRatio === "16/9" ? "vp-bl" : "vp-bs";
  const badgeLabel = cardRatio === "9/16" ? "9:16"  : cardRatio === "16/9" ? "16:9"  : "1:1";
  const subLabel   = isGif ? "Animated · Loop" : isVid ? (cardRatio === "16/9" ? "Landscape" : "Portrait") : "Image";

  const handleMuteToggle = (e) => {
    e.stopPropagation();
    const newMuted = !muted;
    setMuted(newMuted);
    if (videoRef.current) videoRef.current.muted = newMuted;
    // When unmuting, treat as "playing with audio" → stop bg music
    if (!newMuted) onVideoPlay?.();
    else           onVideoStop?.();
  };

  const handleVideoClick = (e) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play();
      setPlaying(true);
      if (!muted) onVideoPlay?.();
    } else {
      vid.pause();
      setPlaying(false);
      onVideoStop?.();
    }
  };

  const handleVideoEnded = () => {
    setPlaying(false);
    onVideoStop?.();
  };

  return (
    <div
      className="vp-card"
      style={{ animationDelay: `${Math.min(index * 0.06, 0.5)}s` }}
    >
      {isVid ? (
        <video
          ref={videoRef}
          src={url}
          style={s.cardMedia}
          autoPlay
          loop
          muted={muted}
          playsInline
          onClick={handleVideoClick}
          onEnded={handleVideoEnded}
        />
      ) : (
        <img
          src={url}
          alt=""
          style={{ ...s.cardMedia, filter: isGif ? "none" : s.cardMedia.filter }}
          loading={isGif ? "eager" : "lazy"}
        />
      )}

      <div className="vp-card-overlay" />
      <div className="vp-corner-tl" />
      <div className="vp-corner-br" />

      <span className={`vp-badge ${badgeClass}`}>{badgeLabel}</span>

      {/* Mute / Unmute button — only for videos */}
      {isVid && (
        <button
          className="vp-mute-btn"
          title={muted ? "Unmute" : "Mute"}
          onClick={handleMuteToggle}
        >
          {muted ? "🔇" : "🔊"}
        </button>
      )}

      <div className="vp-card-label">
        <div className="vp-label-title">
          {item.title || (isGif ? "GIF" : isVid ? "Video" : "Image")}
        </div>
        <div className="vp-label-sub">{subLabel}</div>
      </div>

      <button
        className="vp-del-btn"
        title="Remove"
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
      >
        <DeleteOutlineIcon style={{ fontSize: 15 }} />
      </button>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  pg: {
    fontFamily: "'DM Sans', sans-serif",
  },

  musicBtn: {
    position: "fixed", bottom: 22, right: 22, zIndex: 500,
    width: 42, height: 42, borderRadius: "50%",
    background: "rgba(10,10,10,0.9)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
  },

  centerFill: {
    position: "fixed", inset: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "#000", zIndex: 5, pointerEvents: "none",
  },

  emptyWrap: {
    position: "fixed", inset: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "#000", overflow: "hidden", zIndex: 1,
  },

  emptyInner: {
    position: "relative", zIndex: 10,
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: 0,
    padding: "0 24px", textAlign: "center",
  },

  emptyHead: {
    margin: "28px 0 10px",
    fontSize: "clamp(18px, 5vw, 32px)",
    fontWeight: 800,
    letterSpacing: "4px",
    color: "rgba(255,255,255,0.08)",
  },

  emptySub: {
    margin: "0 0 28px",
    fontSize: "clamp(11px, 3vw, 13px)",
    color: "rgba(255,255,255,0.18)",
    letterSpacing: "0.5px",
    lineHeight: 1.7,
  },

  emptyBtn: {
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "13px 28px",
    background: "rgba(124,58,237,0.12)",
    border: "1px solid rgba(124,58,237,0.35)",
    borderRadius: 10,
    color: "rgba(124,58,237,0.9)",
    fontSize: 10, fontWeight: 800, letterSpacing: "2.5px",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },

  // Wall — masonry on desktop, single column on mobile (handled in CSS)
  wall: {
    columns: 3,
    columnGap: 2,
    padding: 2,
    background: "#000",
    width: "100%",
  },

  cardMedia: {
    width: "100%",
    display: "block",
    transition: "transform 0.6s cubic-bezier(0.23,1,0.32,1), filter 0.5s",
    filter: "brightness(0.88) saturate(1.1)",
  },

  addCard: {
    breakInside: "avoid",
    marginBottom: 3,
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    gap: 10,
    cursor: "pointer",
    background: "#020202",
    border: "1px dashed rgba(255,255,255,0.06)",
    height: 160,
    position: "relative", overflow: "hidden",
  },

  addText: {
    fontSize: 8, letterSpacing: "2.5px",
    color: "rgba(255,255,255,0.13)", fontWeight: 700,
  },

  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.94)", zIndex: 99999,
    display: "flex", alignItems: "center", justifyContent: "center",
  },

  dialog: {
    background: "#080808",
    border: "1px solid #1a1a1a",
    borderRadius: 16, padding: "24px",
    width: "min(480px, 92vw)",
    position: "relative",
    display: "flex", flexDirection: "column", gap: 16,
    maxHeight: "90vh", overflowY: "auto",
  },

  dialogHeader: {
    display: "flex", alignItems: "flex-start", justifyContent: "space-between",
  },
  dialogTitle: {
    fontSize: 9, fontWeight: 800, letterSpacing: "3px", color: "#444",
  },
  closeBtn: {
    background: "transparent", border: "none",
    color: "#333", fontSize: 18, cursor: "pointer",
    lineHeight: 1, padding: 0, flexShrink: 0,
  },

  dropZone: {
    border: "1px dashed #1a1a1a", borderRadius: 14,
    minHeight: 200,
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", overflow: "hidden",
    transition: "border-color 0.2s, background 0.2s",
    userSelect: "none",
  },
  dropActive: { borderColor: "rgba(124,58,237,0.5)", background: "#0c0c0c" },
  dropHint: {
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: 12, padding: "32px 24px",
  },
  dropText: { margin: 0, fontSize: 12, color: "#2a2a2a", letterSpacing: "1.5px" },
  dropSub:  { margin: 0, fontSize: 10, color: "#1a1a1a" },

  ratioBtn: {
    flex: 1, background: "#0e0e0e",
    border: "1px solid #1a1a1a",
    borderRadius: 12, padding: "14px 8px",
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: 10,
    cursor: "pointer",
    transition: "border-color 0.2s, background 0.2s",
  },
  ratioBtnActive: { border: "1px solid rgba(124,58,237,0.7)", background: "#100c1a" },
  ratioPreview: { background: "#2a2a2a", borderRadius: 3, flexShrink: 0 },
  ratioLabel:   { fontSize: 12, fontWeight: 800, color: "#fff", letterSpacing: "1px" },
  ratioSub:     { fontSize: 9, color: "#444", letterSpacing: "0.5px", textAlign: "center" },
  ratioBadge: {
    fontSize: 9, fontWeight: 800, letterSpacing: "2px",
    color: "#fff", background: "#1a1a1a",
    border: "1px solid #2a2a2a", borderRadius: 5,
    padding: "3px 9px",
  },

  backBtn: {
    background: "transparent", border: "none",
    color: "#333", fontSize: 11,
    cursor: "pointer", padding: 0, textAlign: "left",
    letterSpacing: "0.5px",
  },

  errorBox: {
    background: "#1a0000", border: "1px solid #3a0000",
    borderRadius: 8, padding: "10px 14px",
    fontSize: 11, color: "#ff6b6b", lineHeight: 1.6,
  },

  progressTrack: {
    flex: 1, height: 2, background: "#0e0e0e",
    borderRadius: 2, overflow: "hidden",
  },
  progressBar: {
    height: "100%", background: "#7c3aed",
    borderRadius: 2, transition: "width 0.3s",
  },
  progressTxt: {
    margin: 0, fontSize: 11, color: "#3a3a3a",
    minWidth: 30, textAlign: "right",
  },

  uploadBtn: {
    width: "100%", padding: "14px 0",
    background: "#7c3aed", color: "#fff",
    border: "none", borderRadius: 10,
    fontSize: 10, fontWeight: 800, letterSpacing: "3px",
    cursor: "pointer", transition: "background 0.2s",
    fontFamily: "'DM Sans', sans-serif",
  },
};

// ── CSS ───────────────────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;700;800&display=swap');


/* drag cursor */
.vp-card { cursor: grab; }
.vp-card:active { cursor: grabbing; }


/* mute button on video cards */
.vp-mute-btn {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 5;
  width: 30px;
  height: 30px;
  border-radius: 7px;
  background: rgba(0,0,0,0.6);
  border: 0.5px solid rgba(255,255,255,0.12);
  color: #fff;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}
.vp-mute-btn:hover {
  background: rgba(124,58,237,0.7);
}

/* always visible on mobile */
@media (max-width: 768px) {
  .vp-mute-btn { opacity: 1 !important; }
}

  
/* ── Spinner ── */
.vp-spin {
  width: 24px; height: 24px;
  border: 1.5px solid #111;
  border-top-color: #7c3aed;
  border-radius: 50%;
  animation: vp-spin 0.75s linear infinite;
}
@keyframes vp-spin { to { transform: rotate(360deg); } }

/* ── Empty state: ambient orbs ── */
.vp-orb {
  position: absolute; border-radius: 50%;
  pointer-events: none; filter: blur(80px);
}
.vp-orb1 {
  width: 55vw; height: 55vw; max-width: 400px; max-height: 400px;
  background: rgba(124,58,237,0.07);
  top: -10%; left: -10%;
  animation: vp-drift1 8s ease-in-out infinite alternate;
}
.vp-orb2 {
  width: 40vw; height: 40vw; max-width: 300px; max-height: 300px;
  background: rgba(6,182,212,0.05);
  bottom: 5%; right: -5%;
  animation: vp-drift2 10s ease-in-out infinite alternate;
}
.vp-orb3 {
  width: 30vw; height: 30vw; max-width: 220px; max-height: 220px;
  background: rgba(245,158,11,0.04);
  bottom: 30%; left: 30%;
  animation: vp-drift3 12s ease-in-out infinite alternate;
}
@keyframes vp-drift1 { from{transform:translate(0,0)} to{transform:translate(5%,8%)} }
@keyframes vp-drift2 { from{transform:translate(0,0)} to{transform:translate(-6%,-5%)} }
@keyframes vp-drift3 { from{transform:translate(0,0)} to{transform:translate(4%,-7%)} }

/* ── Animated grid ── */
.vp-grid {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
  background-size: 48px 48px;
  animation: vp-grid-fade 3s ease-in-out infinite alternate;
}
@keyframes vp-grid-fade {
  from { opacity: 0.5; }
  to   { opacity: 1; }
}

/* ── Ring animation ── */
.vp-ring-wrap {
  position: relative; width: 120px; height: 120px;
  display: flex; align-items: center; justify-content: center;
}
.vp-ring {
  position: absolute; border-radius: 50%;
  border: 1px solid transparent; pointer-events: none;
}
.vp-ring-outer {
  width: 120px; height: 120px;
  border-color: rgba(124,58,237,0.12);
  animation: vp-rotate 10s linear infinite;
}
.vp-ring-mid {
  width: 90px; height: 90px;
  border-color: rgba(6,182,212,0.1);
  animation: vp-rotate 7s linear infinite reverse;
}
.vp-ring-inner {
  width: 62px; height: 62px;
  border-color: rgba(124,58,237,0.2);
  animation: vp-rotate 4s linear infinite;
}
@keyframes vp-rotate { to { transform: rotate(360deg); } }

.vp-plus-icon {
  width: 56px; height: 56px; border-radius: 50%;
  background: rgba(124,58,237,0.12);
  border: 1px solid rgba(124,58,237,0.3);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; position: relative; z-index: 2;
  transition: background 0.3s, transform 0.4s;
}
.vp-plus-icon:hover {
  background: rgba(124,58,237,0.22);
  transform: scale(1.08) rotate(90deg);
}

/* ── Empty state floating pills ── */
.vp-pills {
  display: flex; gap: 8px; margin-top: 22px;
}
.vp-pill {
  font-size: 8px; font-weight: 800; letter-spacing: 2px;
  padding: 5px 12px; border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.12);
  animation: vp-pill-float 3s ease-in-out infinite;
}
.vp-pill1 { animation-delay: 0s; }
.vp-pill2 { animation-delay: 0.6s; }
.vp-pill3 { animation-delay: 1.2s; }
@keyframes vp-pill-float {
  0%,100% { transform: translateY(0); opacity: 0.8; }
  50%      { transform: translateY(-5px); opacity: 1; }
}

/* ── Empty btn hover ── */
.vp-empty-btn:hover {
  background: rgba(124,58,237,0.2) !important;
  border-color: rgba(124,58,237,0.6) !important;
}

/* ── Drop icon pulse ── */
.vp-drop-icon {
  width: 60px; height: 60px; border-radius: 50%;
  border: 1px dashed rgba(124,58,237,0.3);
  display: flex; align-items: center; justify-content: center;
  animation: vp-pulse 2.5s ease-in-out infinite;
}
@keyframes vp-pulse {
  0%,100% { border-color: rgba(124,58,237,0.3); transform: scale(1); }
  50%      { border-color: rgba(124,58,237,0.6); transform: scale(1.04); }
}

/* ── Masonry: 3 cols on desktop ── */
.vp-masonry { columns: 3; column-gap: 3px; padding: 3px; }

/* ── MOBILE: single full-width column ── */
@media (max-width: 768px) {
  .vp-masonry {
    columns: 1 !important;
    column-gap: 0 !important;
    padding: 0 !important;
    width: 100vw !important;        /* ADD THIS */
    margin-left: calc(-50vw + 50%) !important;  /* ADD THIS - breaks out of parent padding */  }

  /* Every card spans full width and shows full image at its chosen ratio */
  .vp-card {
    width: 100% !important;
    margin-bottom: 2px !important;
    break-inside: avoid;
  }

  /* Media fills full width and shows complete image using contain (no cropping) */
  .vp-card img,
  .vp-card video {
    width: 100% !important;
    height: auto !important;
    object-fit: contain !important;
    display: block !important;
    background: #000;
  }

  /* Add media card: full width on mobile too */
  .vp-add-card {
    width: 100% !important;
    margin-bottom: 2px !important;
    height: 100px !important;
  }

  /* Delete btn always visible on mobile (no hover) */
  .vp-del-btn {
    opacity: 1 !important;
    transform: scale(1) translateY(0) !important;
  }

  /* Card label always visible on mobile */
  .vp-card-label {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }

  /* Badge always visible on mobile */
  .vp-badge {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }

  /* Ring sizes for empty state on mobile */
  .vp-ring-wrap { width: 100px; height: 100px; }
  .vp-ring-outer { width: 100px; height: 100px; }
  .vp-ring-mid   { width: 74px;  height: 74px;  }
  .vp-ring-inner  { width: 50px;  height: 50px;  }
  .vp-plus-icon   { width: 46px;  height: 46px;  }
}

/* ── Media card (desktop) ── */
.vp-card {
  break-inside: avoid;
  margin-bottom: 3px;
  position: relative; overflow: hidden; cursor: pointer;
  background: #0a0a0a;
  border: 1px solid rgba(255,255,255,0.05);
  display: block; width: 100%;
  transform: translateZ(0);
  animation: vp-card-in 0.5s cubic-bezier(0.23,1,0.32,1) both;
  transition:
    transform 0.45s cubic-bezier(0.23,1,0.32,1),
    box-shadow 0.45s cubic-bezier(0.23,1,0.32,1),
    border-color 0.4s;
}
@keyframes vp-card-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* shimmer sweep */
.vp-card::before {
  content: ''; position: absolute; inset: 0; z-index: 3; pointer-events: none;
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%);
  background-size: 200% 100%; background-position: 200% 0;
  opacity: 0; transition: background-position 0s, opacity 0.2s;
}
.vp-card:hover::before {
  opacity: 1; background-position: -200% 0;
  transition: background-position 0.7s ease, opacity 0.2s;
}
.vp-card:hover {
  transform: scale(1.018) translateZ(0);
  border-color: rgba(124,58,237,0.4);
  box-shadow:
    0 0 0 1px rgba(124,58,237,0.2),
    0 0 24px rgba(124,58,237,0.12),
    inset 0 0 16px rgba(124,58,237,0.03);
  z-index: 10; position: relative;
}
.vp-card:hover img,
.vp-card:hover video {
  transform: scale(1.07);
  filter: brightness(1.05) saturate(1.3) contrast(1.04) !important;
}

/* overlay */
/* overlay */
.vp-card-overlay {
  position: absolute; inset: 0; z-index: 2; pointer-events: none;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.08) 35%, transparent 60%);
  opacity: 1;
}

/* corner accents */
.vp-corner-tl, .vp-corner-br {
  position: absolute; width: 20px; height: 20px;
  z-index: 4; pointer-events: none;
  opacity: 0; transition: opacity 0.3s;
}
.vp-corner-tl { top: 0; left: 0; }
.vp-corner-tl::before, .vp-corner-tl::after { content: ''; position: absolute; background: rgba(124,58,237,0.8); }
.vp-corner-tl::before { top:0; left:0; width:2px; height:14px; }
.vp-corner-tl::after  { top:0; left:0; width:14px; height:2px; }
.vp-corner-br { bottom: 0; right: 0; }
.vp-corner-br::before, .vp-corner-br::after { content: ''; position: absolute; background: rgba(6,182,212,0.8); }
.vp-corner-br::before { bottom:0; right:0; width:2px; height:14px; }
.vp-corner-br::after  { bottom:0; right:0; width:14px; height:2px; }
.vp-card:hover .vp-corner-tl,
.vp-card:hover .vp-corner-br { opacity: 1; }

/* badge */
/* badge */
.vp-badge {
  position: absolute; top: 8px; right: 8px; z-index: 4;
  background: rgba(0,0,0,0.55);
  border: 0.5px solid rgba(255,255,255,0.1);
  border-radius: 5px; padding: 3px 7px;
  font-size: 8px; font-weight: 800; letter-spacing: 1.5px;
  font-family: 'DM Sans', sans-serif;
  opacity: 1; transform: translateY(0);
}
.vp-bp { color: rgba(124,58,237,0.9); }
.vp-bl { color: rgba(6,182,212,0.9); }
.vp-bs { color: rgba(245,158,11,0.9); }

/* label */
/* label */
.vp-card-label {
  position: absolute; bottom: 0; left: 0; right: 0; z-index: 4;
  padding: 14px 10px 10px;
  transform: translateY(0); opacity: 1;
}
.vp-label-title {
  font-size: 10px; font-weight: 800; letter-spacing: 1.5px;
  color: #fff; text-transform: uppercase;
  text-shadow: 0 1px 6px rgba(0,0,0,0.9);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.vp-label-sub {
  font-size: 8px; font-weight: 400; letter-spacing: 1px;
  color: rgba(255,255,255,0.35); margin-top: 2px;
}

/* delete btn */
/* delete btn */
.vp-del-btn {
  position: absolute; bottom: 9px; right: 9px; z-index: 5;
  width: 28px; height: 28px; border-radius: 7px;
  background: rgba(0,0,0,0.6);
  border: 0.5px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.4);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  opacity: 1; transform: scale(1) translateY(0);
  transition: background 0.2s, color 0.2s;
}
.vp-del-btn:hover { background: rgba(160,0,0,0.75) !important; color: #fff !important; }

/* add card */
.vp-add-card::after {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(circle at center, rgba(124,58,237,0.06) 0%, transparent 70%);
  opacity: 0; transition: opacity 0.4s;
}
.vp-add-card:hover { border-color: rgba(124,58,237,0.3) !important; background: #050505 !important; }
.vp-add-card:hover::after { opacity: 1; }
.vp-add-icon {
  width: 42px; height: 42px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.07);
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.15);
  transition: border-color 0.3s, color 0.3s, transform 0.4s;
}
.vp-add-card:hover .vp-add-icon {
  border-color: rgba(124,58,237,0.5);
  color: rgba(124,58,237,0.8);
  transform: scale(1.08) rotate(90deg);
}

/* music btn */
.vp-music-btn:hover { border-color: rgba(255,255,255,0.2) !important; }

/* upload btn */
.vp-upload-btn:hover { background: #6d28d9 !important; }
`;