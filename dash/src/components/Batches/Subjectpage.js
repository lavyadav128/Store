import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useState, useEffect } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "https://storee-6wri.onrender.com";

// NOTE: chaptersData is no longer exported from this file — chapters now
// come from the API. ChapterDetail.js has been updated accordingly to stop
// importing it and fetch the chapter (for videoUrl) directly instead.

const SubjectPage = () => {
  const { classId, subject } = useParams();
  const formattedSubject =
    subject.toLowerCase().includes("semester") && !subject.includes("(")
      ? `semester(${subject.replace(/\D/g, "")})`
      : subject;

  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/api/chapters?batchId=${encodeURIComponent(classId)}&subject=${encodeURIComponent(formattedSubject)}`
        );
        const data = await res.json();
        setChapters(data);
      } catch (err) {
        console.error("Failed to fetch chapters:", err);
      } finally {
        setLoading(false);
      }
    };
    if (classId && formattedSubject) fetchChapters();
  }, [classId, formattedSubject]);

  const subjectFormatted = subject.charAt(0).toUpperCase() + subject.slice(1);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isPremium = location.pathname.includes("/premium");
  const isRevision = location.pathname.includes("/revision");
  const isCollege = location.pathname.includes("/college");

  const handleBack = () => {
    navigate(-1);
  };

  const Content = (
    <>
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

      <Typography
        variant="h4"
        gutterBottom
        textAlign="center"
        sx={{ fontWeight: 700, mb: 4 }}
      >
        {subjectFormatted}
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : chapters.length === 0 ? (
        <Typography color="error" textAlign="center">
          No chapters found for this subject.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {chapters.map((chapter) => (
            <Grid item xs={12} sm={6} md={3} key={chapter.title}>
              <Link
                to={
                  isRevision
                    ? `/revision/${classId}/${subject}/${chapter.title}`
                    : isCollege
                    ? `/college/${classId}/${subject}/${chapter.title}`
                    : `/${isPremium ? "premium/class" : "class"}/${classId}/${subject}/${chapter.title}`
                }
                style={{ textDecoration: "none" }}
              >
                <Card
                  sx={{
                    height: { xs: 60, sm: 80, md: 100 },
                    minHeight: 100,
                    borderRadius: 3,
                    boxShadow:
                      "0 4px 12px rgba(25, 118, 210, 0.15), 0 6px 20px rgba(25, 118, 210, 0.25)",
                    transition: "transform 0.2s ease, boxShadow 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow:
                        "0 10px 25px rgba(25, 118, 210, 0.3), 0 12px 30px rgba(25, 118, 210, 0.4)",
                      backgroundColor: "#f9f9f9",
                    },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CardContent sx={{ py: 2 }}>
                    <Typography
                      variant="subtitle1"
                      align="center"
                      sx={{
                        textTransform: "capitalize",
                        fontWeight: 600,
                        color: "#333",
                      }}
                    >
                      {chapter.title.replace(/-/g, " ")}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );

  return (
    <Box p={isMobile ? 2 : 4} sx={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      {isMobile ? (
        <Box>{Content}</Box>
      ) : (
        <Box display="flex" justifyContent="center">
          <Card
            sx={{
              width: "100vw",
              maxWidth: 12000,
              borderRadius: 4,
              boxShadow:
                "0 4px 8px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.15)",
              p: 4,
              backgroundColor: "#ffffff",
            }}
          >
            {Content}
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default SubjectPage;