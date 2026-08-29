import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const API_BASE = process.env.REACT_APP_API_URL || "https://storee-6wri.onrender.com";

const NotesChaptersPage = () => {
  const { batchSlug, subjectSlug } = useParams();
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/notes/chapters?batch=${encodeURIComponent(batchSlug)}&subject=${encodeURIComponent(subjectSlug)}`);
        const data = await res.json();
        setChapters(data);
      } catch (err) {
        console.error('Failed to fetch chapters:', err);
      } finally {
        setLoading(false);
      }
    };
    if (batchSlug && subjectSlug) fetchChapters();
  }, [batchSlug, subjectSlug]);

  const subjectTitle = subjectSlug ? subjectSlug.charAt(0).toUpperCase() + subjectSlug.slice(1) : '';

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
        {subjectTitle}
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
            <Grid item xs={12} sm={6} md={3} key={chapter._id}>
              <Link
                to={`/notes/${batchSlug}/${subjectSlug}/${chapter.slug}`}
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
                      {chapter.title}
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

export default NotesChaptersPage;