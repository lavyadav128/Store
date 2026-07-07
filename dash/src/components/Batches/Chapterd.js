import { useParams, useNavigate, useLocation } from "react-router-dom";
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
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useState, useEffect, useRef } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import { chaptersData } from "./Subjectpage";

// Backend base URL — your resources router is mounted at /api/resources
const API_BASE = "https://note-vevp.onrender.com";

// Maps your Mongoose `category` enum values (used as URL segments in
// GET /api/resources/:category) to the labels this component renders.
const CATEGORY_TO_LABEL = {
  mindmap: "mindmap",
  shortnotes: "shortNotes",
  completenotes: "completeNotes",
};

// Cloudinary raw/upload URLs don't force a download via the `download`
// attribute cross-origin — inserting fl_attachment makes Cloudinary send
// the right Content-Disposition header so the browser actually downloads
// instead of just navigating to the PDF.
function toDownloadUrl(url) {
  if (!url) return url;
  return url.includes("/upload/")
    ? url.replace("/upload/", "/upload/fl_attachment/")
    : url;
}

const ChapterDetail = () => {
  const { classId, subject, slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:600px)');
  const isPremium = location.pathname.includes("/premium");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [viewerContent, setViewerContent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef(null);

  // Resolved Cloudinary links for this chapter, keyed by label
  // (mindmap / shortNotes / completeNotes / video), e.g.
  // { completeNotes: { pdf: "https://res.cloudinary.com/.../slug.pdf" }, ... }
  const [pdfLinks, setPdfLinks] = useState({});
  const [loadingResources, setLoadingResources] = useState(true);

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

  const chapterVideoUrl =
    chaptersData[classId]?.[subject]?.find((ch) => ch.title === slug)?.videoUrl || null;

  // Which Cloudinary categories this classId needs, mirroring the old
  // hardcoded pdfLinks shape.
  const categoriesForClass =
    classId === "14"
      ? ["completenotes"]
      : classId === "10" || classId === "1"
      ? ["shortnotes", "completenotes"]
      : ["mindmap", "shortnotes", "completenotes"];

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;

    async function loadResources() {
      setLoadingResources(true);
      try {
        const responses = await Promise.all(
          categoriesForClass.map((cat) =>
            fetch(`${API_BASE}/api/resources/${cat}`).then((res) => {
              if (!res.ok) throw new Error(`Failed to fetch ${cat}`);
              return res.json();
            })
          )
        );

        if (!isMounted) return;

        const built = {};

        categoriesForClass.forEach((cat, i) => {
          const docsForThisChapter = responses[i].filter(
            (r) => r.title === slug
          );
          const labelKey = CATEGORY_TO_LABEL[cat];

          if (cat === "shortnotes") {
            // pdf and mp3 live as separate Resource docs under the same
            // title + category, so distinguish them by fileType.
            const pdfDoc = docsForThisChapter.find(
              (d) => d.fileType === "application/pdf"
            );
            const audioDoc = docsForThisChapter.find((d) =>
              d.fileType?.startsWith("audio")
            );
            built[labelKey] = {
              pdf: pdfDoc?.fileUrl || null,
              audio: audioDoc?.fileUrl || null,
            };
          } else {
            const doc = docsForThisChapter[0];
            built[labelKey] = { pdf: doc?.fileUrl || null };
          }
        });

        built.video = { url: chapterVideoUrl };

        setPdfLinks(built);
      } catch (err) {
        console.error("Error loading chapter resources:", err);
        if (isMounted) {
          setSnackbarMessage("Could not load chapter resources. Please try again.");
          setSnackbarOpen(true);
        }
      } finally {
        if (isMounted) setLoadingResources(false);
      }
    }

    loadResources();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, slug]);

  const handleBack = () => {
    navigate(-1);
  };

  const openPdfIfExists = async (e, linkObj, label) => {
    e.preventDefault();
    try {
      if (label === "video") {
        if (!linkObj.url) {
          setSnackbarMessage("Video coming soon.");
          setSnackbarOpen(true);
          return;
        }

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
              embedUrl = `https://www.youtube.com/embed/videoseries?list=${urlObj.searchParams.get("list")}`;
            }
          }
        } catch (err) {
          console.error("Invalid video URL:", err);
          setSnackbarMessage("Invalid video link.");
          setSnackbarOpen(true);
          return;
        }

        setViewerContent(
          <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#000", p: 2 }}>
            <Box sx={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 2, overflow: "hidden" }}>
              <iframe
                src={embedUrl}
                title="Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                frameBorder="0"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
              ></iframe>
            </Box>
          </Box>
        );
        setModalOpen(true);
        return;
      }

      // Non-video: linkObj.pdf is either a full Cloudinary secure_url,
      // or null if that resource hasn't been uploaded for this chapter yet.
      if (!linkObj.pdf) {
        setSnackbarMessage("This file does not exist yet.");
        setSnackbarOpen(true);
        return;
      }

      const audioUrl = label === "shortNotes" ? linkObj.audio : null;

      setViewerContent(
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "#f9f9f9" }}>
          <Box sx={{ flex: 1, overflow: "auto", WebkitOverflowScrolling: "touch", p: 1 }}>
            <iframe
              src={
                isMobile
                  ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(linkObj.pdf)}`
                  : linkObj.pdf
              }
              title="PDF Viewer"
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </Box>
          {audioUrl && (
            <Box sx={{ p: 1, bgcolor: "#fff", borderTop: "1px solid #ddd" }}>
              <audio controls autoPlay style={{ width: "100%", maxHeight: "40px" }}>
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </Box>
          )}
        </Box>
      );
      setModalOpen(true);
    } catch (error) {
      console.error("Viewer open error:", error);
      setSnackbarMessage("Error opening the file.");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);
  const handleModalClose = () => {
    setModalOpen(false);
    setViewerContent(null);
  };

  if (!slug) {
    return (
      <Box p={3}>
        <Typography variant="h6" color="error" textAlign="center">
          Please select a chapter first.
        </Typography>
      </Box>
    );
  }

  const formattedSubject = subject ? subject.charAt(0).toUpperCase() + subject.slice(1) : "";
  const formattedChapter = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

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
        {formattedSubject}
      </Typography>
      <Typography variant="h5" textAlign="center" sx={{ fontWeight: 600, mb: 4 }}>
        Chapter: {formattedChapter}
      </Typography>

      {loadingResources ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {Object.entries(pdfLinks).map(([label, link]) => (
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
                    onClick={(e) => openPdfIfExists(e, link, label)}
                  >
                    {label === "video" ? "Play Video" : "Open PDF"}
                  </Button>
                  {label !== "video" && link.pdf && (
                    <IconButton
                      href={toDownloadUrl(link.pdf)}
                      download
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
      )}
    </CardContent>
  );

  return (
    <Box p={4} display="flex" justifyContent="center">
      {isMobile ? (
        <Box sx={{ width: "100%" }}>{content}</Box>
      ) : (
        <Card sx={{ width: "95vw", maxWidth: 8000, borderRadius: 4, boxShadow: "0 4px 8px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.15)", p: 4 }}>
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

      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const formatLabel = (key) => {
  switch (key) {
    case "mindmap": return "Mindmap";
    case "shortNotes": return "Short Notes";
    case "completeNotes": return "Complete Notes";
    case "oneShotNotes": return "One Shot Notes";
    case "video": return "Video";
    default: return key;
  }
};

const getLabelDescription = (key) => {
  switch (key) {
    case "mindmap": return "Visual summary and mindmap for this chapter.";
    case "shortNotes": return "Concise notes and key points of this chapter.";
    case "completeNotes": return "Full chapter notes with detailed explanation and examples.";
    case "oneShotNotes": return "Quick revision notes for a one-shot recap before exams.";
    case "video": return "Revise Concepts in Minutes  (COMING SOON ...)";
    default: return "";
  }
};

export default ChapterDetail;