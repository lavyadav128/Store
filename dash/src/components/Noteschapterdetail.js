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
  IconButton,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import DownloadIcon from "@mui/icons-material/Download";

const API_BASE = process.env.REACT_APP_API_URL || "https://storee-6wri.onrender.com";

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
  const [viewerContent, setViewerContent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef(null);

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
          )}`
        );
        if (!res.ok) throw new Error("not found");
        const data = await res.json();
        setChapter(data);
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
  const handleModalClose = () => {
    setModalOpen(false);
    setViewerContent(null);
  };

  const openPdfIfExists = async (e, linkObj, label) => {
    e.preventDefault();

    if (loading) {
      setSnackbarMessage("Loading, please try again in a moment...");
      setSnackbarOpen(true);
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
          setSnackbarMessage("Invalid video link.");
          setSnackbarOpen(true);
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
        setSnackbarMessage("This PDF file does not exist yet.");
        setSnackbarOpen(true);
        return;
      }

      setViewerContent(
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "#f9f9f9" }}>
          <Box sx={{ flex: 1, overflow: "auto", WebkitOverflowScrolling: "touch", p: 1 }}>
            <iframe
              src={
                isMobile
                  ? `https://docs.google.com/gview?embedded=true&url=${linkObj.pdf}`
                  : linkObj.pdf
              }
              title="PDF Viewer"
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </Box>
        </Box>
      );
      setModalOpen(true);
    } catch (error) {
      console.error("Viewer open error:", error);
      setSnackbarMessage("Error checking the files.");
      setSnackbarOpen(true);
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NotesChapterDetail;