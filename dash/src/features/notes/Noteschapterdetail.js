import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Grid,
  Snackbar,
  Alert,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import DownloadIcon from "@mui/icons-material/Download";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";

const API_BASE = process.env.REACT_APP_API_URL || "https://storee-6wri.onrender.com";
// Cloudinary upload happens on the backend (it already has CLOUDINARY_CLOUD_NAME,
// CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in its .env), so the frontend only
// ever talks to our own API below — no Cloudinary keys live in the browser.

const formatLabel = (key) => {
  switch (key) {
    case "mindmap": return "Mindmap";
    case "shortNotes": return "Short Notes";
    case "completeNotes": return "Complete Notes";
    case "video": return "Video";
    default: return key;
  }
};

const getLabelDescription = (key) => {
  switch (key) {
    case "mindmap": return "Visual summary and mindmap for this chapter.";
    case "shortNotes": return "Concise notes and key points of this chapter.";
    case "completeNotes": return "Full chapter notes with detailed explanation and examples.";
    case "video": return "Revise Concepts in Minutes  (COMING SOON ...)";
    default: return "";
  }
};

const NotesChapterDetail = () => {
  const { batchSlug, subjectSlug, chapterSlug } = useParams();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("warning");
  const [viewerContent, setViewerContent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef(null);

  // ---- Personal note state ----
  const [noteText, setNoteText] = useState("");       // saved note text (from server)
  const [noteUrl, setNoteUrl] = useState("");          // cloudinary url of saved note
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");      // text currently being edited
  const [savingNote, setSavingNote] = useState(false);
  const [deletingNote, setDeletingNote] = useState(false);

  // Prevent ctrl+scroll zoom / pinch gestures, same as ChapterDetail
  useEffect(() => {
    const wheelHandler = (e) => {
      if (e.ctrlKey) e.preventDefault();
    };
    const gestureStartHandler = (e) => {
      e.preventDefault();
    };
    window.addEventListener("wheel", wheelHandler, { passive: false });
    window.addEventListener("gesturestart", gestureStartHandler);
    return () => {
      window.removeEventListener("wheel", wheelHandler);
      window.removeEventListener("gesturestart", gestureStartHandler);
    };
  }, []);

  useEffect(() => {
    const fetchChapter = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/api/notes/chapters/single?batch=${encodeURIComponent(
            batchSlug
          )}&subject=${encodeURIComponent(subjectSlug)}&chapter=${encodeURIComponent(
            chapterSlug
          )}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` } }
        );
        if (!res.ok) throw new Error("not found");
        const data = await res.json();
        setChapter(data);
        // Chapter document is expected to (optionally) carry the saved note
        setNoteText(data.myNoteText || "");
        setNoteUrl(data.myNoteUrl || "");
      } catch (err) {
        console.error("Failed to fetch chapter:", err);
        setChapter(null);
      } finally {
        setLoading(false);
      }
    };
    if (batchSlug && subjectSlug && chapterSlug) fetchChapter();
  }, [batchSlug, subjectSlug, chapterSlug]);

  const handleBack = () => navigate(-1);
  const handleSnackbarClose = () => setSnackbarOpen(false);
  const showSnackbar = (message, severity = "warning") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setViewerContent(null);
  };

  // ---- Note dialog handlers ----
  const openNoteDialog = () => {
    setNoteDraft(noteText || "");
    setNoteDialogOpen(true);
  };
  const closeNoteDialog = () => {
    if (savingNote || deletingNote) return;
    setNoteDialogOpen(false);
  };

  const saveNote = async () => {
    const trimmed = noteDraft.trim();
    if (!trimmed) {
      showSnackbar("Note can't be empty.", "warning");
      return;
    }
    setSavingNote(true);
    try {
      // Backend receives the raw text, uploads it to Cloudinary itself
      // (using its own CLOUDINARY_* env vars) and returns the saved copy.
      const saveRes = await fetch(`${API_BASE}/api/notes/chapters/note`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
        body: JSON.stringify({
          batch: batchSlug,
          subject: subjectSlug,
          chapter: chapterSlug,
          noteText: trimmed,
        }),
      });
      if (!saveRes.ok) throw new Error("Failed to save note");
      const saved = await saveRes.json();

      setNoteText(saved.noteText ?? trimmed);
      setNoteUrl(saved.noteUrl ?? "");
      setNoteDialogOpen(false);
      showSnackbar("Note saved.", "success");
    } catch (err) {
      console.error("Save note error:", err);
      showSnackbar("Could not save your note. Please try again.", "error");
    } finally {
      setSavingNote(false);
    }
  };

  const deleteNote = async () => {
    setDeletingNote(true);
    try {
      const res = await fetch(`${API_BASE}/api/notes/chapters/note`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
        body: JSON.stringify({
          batch: batchSlug,
          subject: subjectSlug,
          chapter: chapterSlug,
        }),
      });
      if (!res.ok) throw new Error("Failed to delete note");

      setNoteText("");
      setNoteUrl("");
      setNoteDraft("");
      setNoteDialogOpen(false);
      showSnackbar("Note deleted.", "success");
    } catch (err) {
      console.error("Delete note error:", err);
      showSnackbar("Could not delete your note. Please try again.", "error");
    } finally {
      setDeletingNote(false);
    }
  };

  const openPdfIfExists = async (e, linkObj, label) => {
    e.preventDefault();

    if (loading) {
      showSnackbar("Loading, please try again in a moment...", "warning");
      return;
    }

    try {
      if (label === "video" && linkObj.url) {
        let embedUrl = linkObj.url;
        try {
          const urlObj = new URL(linkObj.url);
          if (urlObj.hostname === "youtu.be") {
            embedUrl = `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`;
          } else if (urlObj.hostname.includes("youtube.com")) {
            if (urlObj.pathname.startsWith("/live/")) {
              embedUrl = `https://www.youtube.com/embed/${urlObj.pathname.split("/")[2]}`;
            } else if (urlObj.searchParams.get("v")) {
              embedUrl = `https://www.youtube.com/embed/${urlObj.searchParams.get("v")}`;
            } else if (urlObj.pathname.startsWith("/shorts/")) {
              embedUrl = `https://www.youtube.com/embed/${urlObj.pathname.split("/")[2]}`;
            } else if (urlObj.pathname.startsWith("/playlist")) {
              embedUrl = `https://www.youtube.com/embed/videoseries?list=${urlObj.searchParams.get(
                "list"
              )}`;
            }
          }
        } catch (err) {
          console.error("Invalid video URL:", err);
          showSnackbar("Invalid video link.", "warning");
          return;
        }
        setViewerContent(
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#000",
              p: 2,
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                paddingTop: "56.25%",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <iframe
                src={embedUrl}
                title="Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                frameBorder="0"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              ></iframe>
            </Box>
          </Box>
        );
        setModalOpen(true);
        return;
      }

      if (!linkObj.pdf) {
        showSnackbar("This PDF file does not exist yet.", "warning");
        return;
      }

      setViewerContent(
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "#f9f9f9" }}>
          <Box sx={{ flex: 1, overflow: "auto", WebkitOverflowScrolling: "touch", p: 1 }}>
          <iframe
            src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(linkObj.pdf)}`}
            title="PDF Viewer"
            style={{ width: "100%", height: "100%", border: "none" }}
          />
          </Box>
        </Box>
      );
      setModalOpen(true);
    } catch (error) {
      console.error("Viewer open error:", error);
      showSnackbar("Error checking the files.", "warning");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!chapter) {
    return (
      <Box p={3}>
        <Typography variant="h6" color="error" textAlign="center">
          Chapter not found.
        </Typography>
      </Box>
    );
  }

  const links = {
    mindmap: { pdf: chapter.mindmapUrl },
    shortNotes: { pdf: chapter.shortNotesUrl },
    completeNotes: { pdf: chapter.completeNotesUrl },
    video: { url: chapter.videoUrl },
  };

  const subjectTitle = subjectSlug
    ? subjectSlug.charAt(0).toUpperCase() + subjectSlug.slice(1)
    : "";

  const hasNote = Boolean(noteText);

  const content = (
    <CardContent>
      <Button
        onClick={handleBack}
        startIcon={<ArrowBackIosNewIcon />}
        sx={{
          mb: 3,
          backgroundColor: "#fff",
          color: "#333",
          border: "1px solid #ddd",
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 600,
          px: 2.5,
          py: 1,
          boxShadow: 1,
          "&:hover": {
            backgroundColor: "#f5f5f5",
            boxShadow: 2,
          },
        }}
      >
        Back
      </Button>

      <Typography variant="h4" textAlign="center" sx={{ fontWeight: 700, mb: 1 }}>
        {subjectTitle}
      </Typography>

      {/* "My Note" circular action, sits above the chapter title */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 1.5 }}>
        <Tooltip title={hasNote ? "View / edit your note" : "Add a note"}>
          <IconButton
            onClick={openNoteDialog}
            sx={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              bgcolor: "#fff",
              color: "#333",
              border: "1px solid #ddd",
              boxShadow: 1,
              "&:hover": {
                backgroundColor: "#f5f5f5",
                boxShadow: 2,
              },
            }}
          >
            {hasNote ? <EditNoteIcon /> : <NoteAddIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      <Typography variant="h5" textAlign="center" sx={{ fontWeight: 600, mb: 4 }}>
        Chapter: {chapter.title}
      </Typography>

      <Grid container spacing={3}>
        {Object.entries(links).map(([label, link]) => (
          <Grid item xs={12} sm={6} key={label}>
            <Card
              sx={{
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: "0 6px 24px rgba(0, 0, 0, 0.15)",
                },
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {formatLabel(label)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {getLabelDescription(label)}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  onClick={(e) => openPdfIfExists(e, link, label)}
                >
                  {loading ? "Loading..." : label === "video" ? "Play Video" : "Open PDF"}
                </Button>
                {label !== "video" && (
                  <IconButton
                    href={link.pdf || undefined}
                    download
                    disabled={!link.pdf}
                    sx={{
                      ml: 1,
                      bgcolor: "#fff",
                      border: "1px solid #ccc",
                      "&:hover": { bgcolor: "#f0f0f0" },
                    }}
                  >
                    <DownloadIcon />
                  </IconButton>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </CardContent>
  );

  return (
    <Box p={4} display="flex" justifyContent="center">
      {isMobile ? (
        <Box sx={{ width: "100%" }}>{content}</Box>
      ) : (
        <Card
          sx={{
            width: "95vw",
            maxWidth: 8000,
            borderRadius: 4,
            boxShadow: "0 4px 8px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.15)",
            p: 4,
          }}
        >
          {content}
        </Card>
      )}

      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box
          ref={modalRef}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "#000",
            overflow: "hidden",
            zIndex: 1300,
          }}
        >
          <IconButton
            onClick={handleModalClose}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              backgroundColor: "#fff",
              boxShadow: 3,
              zIndex: 1000,
              "&:hover": { backgroundColor: "#eee" },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ width: "100%", height: "100%" }}>{viewerContent}</Box>
        </Box>
      </Modal>

      {/* My Note dialog */}
      {/* CHANGED: fullScreen + full-viewport PaperProps so this dialog covers
          the entire screen edge-to-edge on both PC and mobile. */}
      <Dialog
        open={noteDialogOpen}
        onClose={closeNoteDialog}
        fullScreen
        PaperProps={{
          sx: {
            borderRadius: 0,
            width: "100vw",
            height: "100vh",
            maxWidth: "100vw",
            maxHeight: "100vh",
            m: 0,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {hasNote ? "Your Note" : "Add a Note"}
          <IconButton
            onClick={closeNoteDialog}
            disabled={savingNote || deletingNote}
            aria-label="Close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <TextField
            autoFocus
            fullWidth
            multiline
            placeholder="Write your note for this chapter..."
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            disabled={savingNote || deletingNote}
            sx={{
              mt: 1,
              flex: 1,
              display: "flex",
              "& .MuiInputBase-root": {
                height: "100%",
                alignItems: "flex-start",
              },
              "& .MuiInputBase-inputMultiline": {
                height: "100% !important",
                overflowY: "auto !important",
              },
            }}
          />
          {noteUrl && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              Last saved copy stored securely in the cloud.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {hasNote && (
            <Button
              onClick={deleteNote}
              color="error"
              startIcon={<DeleteIcon />}
              disabled={savingNote || deletingNote}
              sx={{ mr: "auto", textTransform: "none" }}
            >
              {deletingNote ? "Deleting..." : "Delete"}
            </Button>
          )}
          <Button
            onClick={closeNoteDialog}
            disabled={savingNote || deletingNote}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={saveNote}
            variant="contained"
            disabled={savingNote || deletingNote}
            sx={{ textTransform: "none" }}
          >
            {savingNote ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NotesChapterDetail;
