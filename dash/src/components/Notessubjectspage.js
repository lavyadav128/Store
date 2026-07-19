import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || "https://storee-6wri.onrender.com";

const NotesSubjectsPage = () => {
  const { batchSlug } = useParams();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/notes/subjects?batch=${encodeURIComponent(batchSlug)}`);
        const data = await res.json();
        setSubjects(data);
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
      } finally {
        setLoading(false);
      }
    };
    if (batchSlug) fetchSubjects();
  }, [batchSlug]);

  return (
    <Box p={4} sx={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
        <Button
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIosNewIcon />}
          sx={{
            mb: 3, backgroundColor: "#fff", color: "#333", border: "1px solid #ddd",
            borderRadius: 2, textTransform: "none", fontWeight: 600, px: 2.5, py: 1, boxShadow: 1,
            "&:hover": { backgroundColor: "#f5f5f5", boxShadow: 2 },
          }}
        >
          Back
        </Button>

        <Typography variant="h4" textAlign="center" sx={{ fontWeight: 700, mb: 4 }}>
          Subjects
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : subjects.length === 0 ? (
          <Typography color="error" textAlign="center">No subjects available yet.</Typography>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
            {subjects.map((subject) => (
              <Box
                key={subject.slug}
                onClick={() => navigate(`/notes/${batchSlug}/${subject.slug}`)}
                sx={{
                  width: 420, maxWidth: "100%", p: 4, borderRadius: 3, cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)", backgroundColor: "#fff", textAlign: "center",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": { transform: "scale(1.03)", boxShadow: "0 6px 20px rgba(0,0,0,0.12)", backgroundColor: "#f9f9f9" },
                }}
              >
                <Typography variant="h6" sx={{ textTransform: "capitalize", fontWeight: 600, color: "#333" }}>
                  {subject.name}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, color: "#555" }}>
                  {subject.description}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default NotesSubjectsPage;