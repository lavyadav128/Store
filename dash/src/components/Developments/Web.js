import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  Grid,
  Collapse,
  Snackbar,
  Alert,
  Dialog,
  DialogContent,
  IconButton,
  useMediaQuery,
  Tabs,
  Tab,
  Paper,
  Divider,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const API_BASE = process.env.REACT_APP_API_URL || "https://note-vevp.onrender.com/";

// Cloudinary raw-file URLs don't honor the HTML `download` attribute for
// cross-origin requests unless the fl_attachment flag is present — this
// inserts it right after "/upload/" so the browser actually force-downloads
// instead of opening the PDF inline. Local (non-Cloudinary) URLs pass through
// unchanged.
function toDownloadUrl(url) {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  if (url.includes("/fl_attachment/")) return url; // already has it
  return url.replace("/upload/", "/upload/fl_attachment/");
}

const topics = [
  { name: "GitHub", slug: "github", subtopics: [] },
  { name: "SQL", slug: "sql", subtopics: [] },
  {
    name: "Frontend",
    slug: "frontend",
    subtopics: ["html", "css", "Javascript", "react"],
  },
  {
    name: "Backend",
    slug: "backend",
    subtopics: ["Node.js", "Express", "Authentication"],
  },
  {
    name: "theory",
    slug: "theory",
    subtopics: [
      "computer-networking",
      "object-oriented-programming",
      "dbms",
      "operating-system",
    ],
  },

];

const WebDevTopics = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // title (== the slug this page already computes, e.g. "github",
  // "frontend-css", "theory-dbms") -> Cloudinary fileUrl. Fetched once.
  // Cloud-only: if a title isn't found here, the file is treated as
  // not existing — there is no local fallback anymore.
  const [resourceMap, setResourceMap] = useState({});

  useEffect(() => {
    let cancelled = false;

    async function fetchFullstackResources() {
      try {
        const res = await fetch(`${API_BASE}/api/resources/fullstack`);
        if (!res.ok) return;
        const list = await res.json();
        if (cancelled) return;
        const map = {};
        for (const r of list) {
          if (r?.title && r?.fileUrl) map[r.title] = r.fileUrl;
        }
        setResourceMap(map);
      } catch {
        // network/API failure — resourceMap stays {} and everything just
        // falls back to local static paths below.
      }
    }

    fetchFullstackResources();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleBack = () => navigate(-1);
  const handleTabChange = (_, newValue) => setTabIndex(newValue);
  const handleToggleExpand = (slug) =>
    setExpandedTopic((prev) => (prev === slug ? null : slug));
  const handleSnackbarClose = () => setSnackbarOpen(false);
  const handleCloseModal = () => {
    setModalOpen(false);
    setPdfUrl(null);
  };

  const openPdfIfExists = (e, topicSlug, slug) => {
    e.preventDefault();
    const cloudUrl = resourceMap[slug];

    if (!cloudUrl) {
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      setSnackbarMessage("This PDF file does not exist yet.");
      setSnackbarOpen(true);
      return;
    }

    const viewerUrl = isMobile
      ? `https://docs.google.com/gview?embedded=true&url=${cloudUrl}`
      : cloudUrl;
    setPdfUrl(viewerUrl);
    setModalOpen(true);
  };

  const handleDownload = (topicSlug, slug) => {
    const cloudUrl = resourceMap[slug];

    if (!cloudUrl) {
      setSnackbarMessage("This PDF file does not exist yet.");
      setSnackbarOpen(true);
      return;
    }

    const a = document.createElement("a");
    a.href = toDownloadUrl(cloudUrl);
    a.download = `${slug}.pdf`;
    a.click();
  };

  const renderTopics = () => (
    <Grid container spacing={3} alignItems="flex-start">
      {topics.map((topic) => {
        const hasSubtopics = topic.subtopics.length > 0;
        return (
          <Grid item xs={12} sm={6} key={topic.slug}>
            <Card
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: "20px",
                boxShadow:
                  "0 4px 8px rgba(0, 0, 0, 0.12), 0 6px 20px rgba(25, 118, 210, 0.2)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow:
                    "0 8px 16px rgba(0, 0, 0, 0.15), 0 12px 32px rgba(25, 118, 210, 0.3)",
                },
                p: 2,
                display: "flex",
                flexDirection: "column",
                // Don't set fixed or 100% height here — allow natural growth
              }}
            >
              <Typography variant="h6" fontWeight={600} mb={1}>
                {topic.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {hasSubtopics
                  ? "This topic includes subtopics. Click to view them."
                  : "Click below to access the notes."}
              </Typography>
  
              {hasSubtopics ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleToggleExpand(topic.slug)}
                    sx={{ mb: 1 }}
                  >
                    {expandedTopic === topic.slug
                      ? "Hide Subtopics"
                      : "View Subtopics"}
                  </Button>
  
                  <Collapse
                    in={expandedTopic === topic.slug}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Box mt={1}>
                      {topic.subtopics.map((sub, index) => {
                        const subSlug = `${topic.slug}-${sub
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`;
                        return (
                          <Box
                            key={index}
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={1}
                          >
                            <Button
                              variant="outlined"
                              color="primary"
                              fullWidth
                              sx={{ textTransform: "none" }}
                              onClick={(e) =>
                                openPdfIfExists(e, topic.slug, subSlug)
                              }
                            >
                              {sub}
                            </Button>
                            <IconButton
                              onClick={() =>
                                handleDownload(topic.slug, subSlug)
                              }
                              size="small"
                              sx={{
                                bgcolor: "#f0f0f0",
                                "&:hover": { bgcolor: "#e0e0e0" },
                              }}
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        );
                      })}
                    </Box>
                  </Collapse>
                </>
              ) : (
                <Box display="flex" alignItems="center" gap={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={(e) =>
                      openPdfIfExists(e, topic.slug, topic.slug)
                    }
                  >
                    Open Notes
                  </Button>
                  <IconButton
                    onClick={() => handleDownload(topic.slug, topic.slug)}
                    size="small"
                    sx={{
                      bgcolor: "#f0f0f0",
                      "&:hover": { bgcolor: "#e0e0e0" },
                    }}
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
  
  

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        py: 0,
        px: 0,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "99%",
          maxWidth: "11000px",
          borderRadius: 4,
          p: { xs: 2, sm: 4, md: 6 },
          backgroundColor: "#ffffff",
        }}
      >
        <Box display="flex" justifyContent="flex-start">
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
        </Box>

        <Box display="flex" justifyContent="center" mb={4}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            centered
            sx={{
              "& .MuiTab-root": {
                fontWeight: 700,
                fontSize: "1rem",
                textTransform: "none",
                px: 3,
              },
              "& .MuiTabs-indicator": {
                backgroundColor: theme.palette.primary.main,
                height: 3,
              },
            }}
          >
            <Tab label="Web Development" />
            <Tab label="Practice Sheet" />
          </Tabs>
        </Box>

        {tabIndex === 0 && renderTopics()}

        {tabIndex === 1 && (
          <Box
            display="flex"
            justifyContent={isMobile ? "flex-start" : "center"}
            alignItems="center"
            minHeight={isMobile ? "auto" : "40vh"}
            px={isMobile ? 0 : 2}
          >
            <Card
              onClick={() => navigate("/wtopic")}
              sx={{
                p: isMobile ? 2 : 4,
                borderRadius: 4,
                boxShadow: 3,
                textAlign: "center",
                width: isMobile ? "100%" : 400,
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  boxShadow: 6,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Start Practice
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dive into curated Web Dev problems
              </Typography>
            </Card>
          </Box>
        )}

        <Divider sx={{ mt: 6, mb: 2 }} />
        <Typography variant="body2" textAlign="center" color="text.secondary">
        </Typography>
      </Paper>

      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        fullScreen
        PaperProps={{ sx: { backgroundColor: "#000", position: "relative" } }}
      >
        <IconButton
          onClick={handleCloseModal}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "#000",
            bgcolor: "#fff",
            "&:hover": { bgcolor: "#eee" },
            zIndex: 10,
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ p: 0, height: "100vh" }}>
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              width="100%"
              height="100%"
              style={{ border: "none" }}
              title="PDF Viewer"
            />
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WebDevTopics;