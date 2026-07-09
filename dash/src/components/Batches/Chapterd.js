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
  useMediaQuery
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useState, useEffect, useRef } from "react";
import DownloadIcon from "@mui/icons-material/Download";
// NOTE: chaptersData import removed — Subjectpage.js no longer exports it.
// Video URL + which resource cards to show now come from the backend.

const API_BASE = process.env.REACT_APP_API_URL || "https://storee-6wri.onrender.com";

// UI label -> category value stored in MongoDB (unchanged, matches your
// existing Resource schema's category enum exactly)
const LABEL_TO_DB_CATEGORY = {
  shortNotes: "shortnotes",
  completeNotes: "completenotes",
  mindmap: "mindmap",
};

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

  // Holds the Cloudinary URLs fetched from the backend for this chapter's
  // slug, keyed by the same labels used in pdfLinks (shortNotes/completeNotes/mindmap).
  const [cloudUrls, setCloudUrls] = useState({});
  const [resourcesLoading, setResourcesLoading] = useState(true);

  // ── NEW: this chapter's videoUrl + the batch's resourceTypes toggles ──
  // Replaces the old chaptersData lookup + hardcoded classId branching.
  const [chapterVideoUrl, setChapterVideoUrl] = useState(null);
  const [resourceTypes, setResourceTypes] = useState({
    mindmap: true, shortNotes: true, completeNotes: true, video: true,
  });
  const [metaLoading, setMetaLoading] = useState(true);

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

  // ── fetch this chapter's videoUrl + the batch's resourceTypes ──
  useEffect(() => {
    let cancelled = false;

    async function fetchMeta() {
      setMetaLoading(true);
      try {
        const [chapterRes, batchRes] = await Promise.all([
          fetch(`${API_BASE}/api/chapters/single?batchId=${encodeURIComponent(classId)}&subject=${encodeURIComponent(subject)}&title=${encodeURIComponent(slug)}`),
          fetch(`${API_BASE}/api/batches/${classId}`),
        ]);

        if (!cancelled) {
          if (chapterRes.ok) {
            const chapterData = await chapterRes.json();
            setChapterVideoUrl(chapterData.videoUrl || null);
          }
          if (batchRes.ok) {
            const batchData = await batchRes.json();
            if (batchData.resourceTypes) setResourceTypes(batchData.resourceTypes);
          }
        }
      } catch (err) {
        console.error("Failed to fetch chapter/batch meta:", err);
      } finally {
        if (!cancelled) setMetaLoading(false);
      }
    }

    if (classId && subject && slug) fetchMeta();
    return () => { cancelled = true; };
  }, [classId, subject, slug]);

  useEffect(() => {
    let cancelled = false;

    async function fetchCloudLinks() {
      setResourcesLoading(true);
      const entries = await Promise.all(
        Object.entries(LABEL_TO_DB_CATEGORY).map(async ([label, dbCategory]) => {
          try {
            const res = await fetch(`${API_BASE}/api/resources/${dbCategory}`);
            if (!res.ok) return [label, null];
            const list = await res.json();
            const matches = list.filter((r) => r.title === slug);

            if (label === "shortNotes") {
              const pdfMatch = matches.find((r) => /\.pdf(\?|$)/i.test(r.fileUrl || ""));
              const audioMatch = matches.find((r) => /\.(mp3|wav|m4a)(\?|$)/i.test(r.fileUrl || ""));
              return [label, { pdf: pdfMatch?.fileUrl || null, audio: audioMatch?.fileUrl || null }];
            }
            return [label, matches[0]?.fileUrl || null];
          } catch {
            return [label, label === "shortNotes" ? { pdf: null, audio: null } : null];
          }
        })
      );
      if (!cancelled) {
        setCloudUrls(Object.fromEntries(entries));
        setResourcesLoading(false);
      }
    }

    if (slug) fetchCloudLinks();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // ── pdfLinks now built from resourceTypes flags instead of hardcoded
  // classId checks — works for ANY batch, including new custom ones ──
  const pdfLinks = {
    ...(resourceTypes.mindmap && {
      mindmap: { pdf: cloudUrls.mindmap || "" },
    }),
    ...(resourceTypes.shortNotes && {
      shortNotes: { pdf: cloudUrls.shortNotes?.pdf || "", audio: cloudUrls.shortNotes?.audio || "" },
    }),
    ...(resourceTypes.completeNotes && {
      completeNotes: { pdf: cloudUrls.completeNotes || "" },
    }),
    ...(resourceTypes.video && {
      video: { url: chapterVideoUrl },
    }),
  };

  const handleBack = () => {
    navigate(-1);
  };

  const openPdfIfExists = async (e, linkObj, label) => {
    e.preventDefault();

    if (resourcesLoading || metaLoading) {
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

      if (!linkObj.pdf) {
        setSnackbarMessage("This PDF file does not exist yet.");
        setSnackbarOpen(true);
        return;
      }

      let audioExists = false;
      if (label === "shortNotes" && linkObj.audio) {
        audioExists = true;
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
          {audioExists && (
            <Box sx={{ p: 1, bgcolor: "#fff", borderTop: "1px solid #ddd" }}>
              <audio controls autoPlay style={{ width: "100%", maxHeight: "40px" }}>
                <source src={linkObj.audio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </Box>
          )}
        </Box>
      );
      setModalOpen(true);
    } catch (error) {
      console.error("Viewer open error:", error);
      setSnackbarMessage("Error checking the files.");
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
                disabled={resourcesLoading || metaLoading}
                onClick={(e) => openPdfIfExists(e, link, label)}
              >
                {resourcesLoading || metaLoading ? "Loading..." : label === "video" ? "Play Video" : "Open PDF"}
              </Button>
                {label !== "video" && (
                  <IconButton
                    href={link.pdf}
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

export default ChapterDetail;