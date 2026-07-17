import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardActions, Button, Typography, Grid, IconButton, CircularProgress } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DownloadIcon from '@mui/icons-material/Download';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || "https://storee-6wri.onrender.com";

const formatLabel = (key) => ({
  mindmap: 'Mindmap', shortNotes: 'Short Notes', completeNotes: 'Complete Notes', video: 'Video',
}[key] || key);

const getLabelDescription = (key) => ({
  mindmap: 'Visual summary and mindmap for this chapter.',
  shortNotes: 'Concise notes and key points of this chapter.',
  completeNotes: 'Full chapter notes with detailed explanation and examples.',
  video: 'Revise Concepts in Minutes (COMING SOON ...)',
}[key] || '');

const NotesChapterDetail = () => {
  const { subjectSlug, chapterSlug } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapter = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/notes/chapters/single?subject=${encodeURIComponent(subjectSlug)}&chapter=${encodeURIComponent(chapterSlug)}`);
        if (!res.ok) throw new Error('not found');
        const data = await res.json();
        setChapter(data);
      } catch (err) {
        console.error('Failed to fetch chapter:', err);
      } finally {
        setLoading(false);
      }
    };
    if (subjectSlug && chapterSlug) fetchChapter();
  }, [subjectSlug, chapterSlug]);

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
        <Typography variant="h6" color="error" textAlign="center">Chapter not found.</Typography>
      </Box>
    );
  }

  const links = {
    mindmap: { pdf: chapter.mindmapUrl },
    shortNotes: { pdf: chapter.shortNotesUrl },
    completeNotes: { pdf: chapter.completeNotesUrl },
    video: { url: chapter.videoUrl },
  };

  const subjectTitle = subjectSlug.charAt(0).toUpperCase() + subjectSlug.slice(1);

  return (
    <Box p={4} display="flex" justifyContent="center" sx={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      <Card sx={{ width: "95vw", maxWidth: 1100, borderRadius: 4, boxShadow: "0 4px 8px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.15)", p: 4 }}>
        <CardContent>
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
                    borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": { transform: "scale(1.02)", boxShadow: "0 6px 24px rgba(0, 0, 0, 0.15)" },
                    height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>{formatLabel(label)}</Typography>
                    <Typography variant="body2" color="text.secondary">{getLabelDescription(label)}</Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                    {label === 'video' ? (
                      <Button
                        variant="contained" color="primary" fullWidth
                        disabled={!link.url}
                        component={link.url ? 'a' : 'button'}
                        href={link.url || undefined}
                        target={link.url ? '_blank' : undefined}
                        rel={link.url ? 'noopener noreferrer' : undefined}
                      >
                        {link.url ? 'Play Video' : 'Play Video'}
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="contained" color="primary" fullWidth
                          disabled={!link.pdf}
                          component={link.pdf ? 'a' : 'button'}
                          href={link.pdf || undefined}
                          target={link.pdf ? '_blank' : undefined}
                          rel={link.pdf ? 'noopener noreferrer' : undefined}
                        >
                          Open PDF
                        </Button>
                        <IconButton
                          href={link.pdf || undefined}
                          download
                          disabled={!link.pdf}
                          sx={{ ml: 1, bgcolor: "#fff", border: "1px solid #ccc", "&:hover": { bgcolor: "#f0f0f0" } }}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NotesChapterDetail;