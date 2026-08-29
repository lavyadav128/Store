import React, { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  Paper,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import flashData from "./rdata";

const PracticePageOneScreen = () => {
  const { classId, subject, chapterSlug } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const flashPoints = flashData?.[classId]?.[subject]?.[chapterSlug] || [];
  const chapterTitle = (chapterSlug || "").replace(/-/g, " ").toUpperCase();
  const containerRef = useRef(null);

  const [pdfUrl, setPdfUrl] = useState(null);
  const [generating, setGenerating] = useState(false);

  const exportPdf = async () => {
    if (!containerRef.current) return;
    try {
      setGenerating(true);

      const canvas = await html2canvas(containerRef.current, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "pt", [canvas.width, canvas.height]);
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);

      setGenerating(false);
    } catch (err) {
      console.error("PDF generation error:", err);
      setGenerating(false);
    }
  };

  const closePdfOverlay = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setPdfUrl(null);
  };

  // MOBILE VIEW
  if (isMobile) {
    return (
      <Box p={0} sx={{ minHeight: "100vh", backgroundColor: "#f9f9fb" }}>
        {/* Mobile Header */}
        <Box
          sx={{
            p: 2,
            backgroundColor: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Button
              onClick={() => navigate(-1)}
              startIcon={<ArrowBackIosNewIcon />}
              sx={{ color: "#000", fontWeight: "bold" }}
            >
              Back
            </Button>
          </Box>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              color: "#000",
              fontSize: "1rem",
              textAlign: "center",
            }}
          >
            {chapterTitle}
          </Typography>
        </Box>

        {/* Mobile Content */}
        <Box sx={{ p: 2 }}>
          {flashPoints.map((topic) => (
            <Paper
              key={topic.slno}
              sx={{
                p: 2,
                mb: 2,
                background: "linear-gradient(135deg, #ffffff, #f0f4ff)",
                borderRadius: "16px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
              }}
            >
              <Typography
                fontWeight="bold"
                sx={{ mb: 1, color: "#4f46e5", fontSize: "1rem" }}
              >
                🔹 {topic.slno}. {topic.title}
              </Typography>
              {topic.points.map((pt, i) => (
                <Typography
                  key={i}
                  sx={{
                    mb: 0.5,
                    fontSize: "0.9rem",
                    color: "#333",
                    lineHeight: 1.4,
                  }}
                >
                  • {pt}
                </Typography>
              ))}
            </Paper>
          ))}
        </Box>

        {/* PDF Overlay */}
        {pdfUrl && (
          <Box
            sx={{
              position: "fixed",
              inset: 0,
              bgcolor: "rgba(0,0,0,0.92)",
              zIndex: 99999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton
              onClick={closePdfOverlay}
              sx={{
                position: "fixed",
                top: 12,
                right: 12,
                zIndex: 100000,
                bgcolor: "rgba(255,255,255,0.9)",
              }}
              aria-label="Close PDF"
            >
              <CloseIcon />
            </IconButton>

            <Box sx={{ width: "100%", height: "100%" }}>
              <iframe
                title="exported-pdf"
                src={pdfUrl}
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            </Box>
          </Box>
        )}
      </Box>
    );
  }

  // DESKTOP VIEW
  const total = flashPoints.length || 1;
  const cols = Math.ceil(Math.sqrt(total));
  const rows = Math.ceil(total / cols);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          backgroundColor: "#f0f4ff",
          color: "#000",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIosNewIcon />}
          sx={{ color: "#000", fontWeight: "bold" }}
        >
          Back
        </Button>
        <Typography variant="h6" fontWeight="bold">
          {chapterTitle}
        </Typography>
        <Button
          variant="contained"
          onClick={exportPdf}
          startIcon={<DownloadIcon />}
          sx={{ backgroundColor: "#fff", color: "#4f46e5" }}
          disabled={generating}
        >
          {generating ? "Generating..." : "Export PDF"}
        </Button>
      </Box>

      {/* Content Grid */}
      <Box
        ref={containerRef}
        sx={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: 1,
          padding: 1,
          backgroundColor: "#f5f7fa",
        }}
      >
        {flashPoints.map((topic, index) => (
          <Paper
            key={index}
            sx={{
              p: 1,
              backgroundColor: "#f0f4ff",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              overflow: "auto",
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ fontSize: "0.9rem" }}
            >
              🔹 {topic.slno}. {topic.title}
            </Typography>
            {topic.points.map((pt, idx) => (
              <Typography key={idx} variant="body2" sx={{ fontSize: "0.8rem" }}>
                • {pt}
              </Typography>
            ))}
          </Paper>
        ))}
      </Box>

      {/* PDF Overlay */}
      {pdfUrl && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.92)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            onClick={closePdfOverlay}
            sx={{
              position: "fixed",
              top: 12,
              right: 12,
              zIndex: 100000,
              bgcolor: "rgba(255,255,255,0.95)",
            }}
            aria-label="Close PDF"
          >
            <CloseIcon />
          </IconButton>

          <Box sx={{ width: "100%", height: "100%" }}>
            <iframe
              title="exported-pdf"
              src={pdfUrl}
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PracticePageOneScreen;
