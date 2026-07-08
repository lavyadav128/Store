import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, IconButton, CircularProgress, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { useNavigate, useParams } from 'react-router-dom';
import server from '../environment';

// ─────────────────────────────────────────────────────────────
// ChapterDetailPage — /class/:batchId/:subjectSlug/:chapterSlug
// Matches Image 3 exactly: 4 fixed resource cards (Mindmap, Short
// Notes, Complete Notes, Video). "Open PDF" / the download icon
// both link straight to the file URL — the browser's own PDF
// viewer takes over (Image 4), so no custom viewer is needed here.
// ─────────────────────────────────────────────────────────────

// ── one resource card (Mindmap / Short Notes / Complete Notes) ──
const PdfResourceCard = ({ title, description, url }) => (
  <Box sx={{
    p: 3.5, borderRadius: '16px', border: '1px solid #eee', background: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
  }}>
    <Typography sx={{ fontWeight: 800, fontSize: 18, mb: 0.8, color: '#111' }}>{title}</Typography>
    <Typography sx={{ color: '#888', fontSize: 14, mb: 2.5 }}>{description}</Typography>

    <Box sx={{ display: 'flex', gap: 1.2 }}>
      <Button
        component="a"
        href={url || undefined}
        target="_blank"
        rel="noopener noreferrer"
        disabled={!url}
        fullWidth
        variant="contained"
        sx={{
          background: '#1976d2', borderRadius: '10px', fontWeight: 700,
          textTransform: 'none', py: 1.1, boxShadow: 'none',
          '&:hover': { background: '#1565c0' },
        }}
      >
        Open PDF
      </Button>
      <Tooltip title={url ? 'Download' : 'Not available yet'}>
        <span>
          <IconButton
            component="a"
            href={url || undefined}
            download
            disabled={!url}
            sx={{
              border: '1px solid #ddd', borderRadius: '50%', width: 44, height: 44,
              color: '#555', '&:hover': { background: '#f4f4f6' },
            }}
          >
            <FileDownloadOutlinedIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  </Box>
);

// ── the Video card ──
const VideoResourceCard = ({ url, comingSoon }) => (
  <Box sx={{
    p: 3.5, borderRadius: '16px', border: '1px solid #eee', background: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
  }}>
    <Typography sx={{ fontWeight: 800, fontSize: 18, mb: 0.8, color: '#111' }}>Video</Typography>
    <Typography sx={{ color: '#888', fontSize: 14, mb: 2.5 }}>
      {comingSoon || !url ? 'Revise Concepts in Minutes (COMING SOON ...)' : 'Watch the video explanation of this chapter.'}
    </Typography>

    <Button
      component={comingSoon || !url ? 'button' : 'a'}
      href={!comingSoon && url ? url : undefined}
      target={!comingSoon && url ? '_blank' : undefined}
      rel={!comingSoon && url ? 'noopener noreferrer' : undefined}
      disabled={comingSoon || !url}
      fullWidth
      variant="contained"
      startIcon={<PlayCircleOutlineIcon />}
      sx={{
        background: '#1976d2', borderRadius: '10px', fontWeight: 700,
        textTransform: 'none', py: 1.1, boxShadow: 'none',
        '&:hover': { background: '#1565c0' },
      }}
    >
      Play Video
    </Button>
  </Box>
);

const ChapterDetailPage = () => {
  const { batchId, subjectSlug, chapterSlug } = useParams();
  const navigate = useNavigate();

  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const res = await fetch(
          `${server}/api/chapters/single?batchId=${encodeURIComponent(batchId)}&subject=${encodeURIComponent(subjectSlug)}&chapter=${encodeURIComponent(chapterSlug)}`
        );
        if (!res.ok) throw new Error('Chapter not found');
        const data = await res.json();
        setChapter(data);
      } catch (err) {
        console.error('Failed to fetch chapter:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChapter();
  }, [batchId, subjectSlug, chapterSlug]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!chapter) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography sx={{ color: '#999' }}>This chapter could not be found.</Typography>
      </Box>
    );
  }

  const subjectTitle = subjectSlug
    ? subjectSlug.charAt(0).toUpperCase() + subjectSlug.slice(1)
    : '';

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', px: 3, py: 5 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        variant="outlined"
        sx={{
          borderRadius: '12px', textTransform: 'none', fontWeight: 700,
          borderColor: '#e0e0e0', color: '#111', mb: 5,
          '&:hover': { borderColor: '#111', background: '#fafafa' },
        }}
      >
        Back
      </Button>

      <Typography variant="h3" sx={{ fontWeight: 800, textAlign: 'center', mb: 1, color: '#111' }}>
        {subjectTitle}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center', mb: 6, color: '#333' }}>
        Chapter: {chapter.title}
      </Typography>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        gap: 3,
      }}>
        <PdfResourceCard
          title="Mindmap"
          description="Visual summary and mindmap for this chapter."
          url={chapter.mindmapUrl}
        />
        <PdfResourceCard
          title="Short Notes"
          description="Concise notes and key points of this chapter."
          url={chapter.shortNotesUrl}
        />
        <PdfResourceCard
          title="Complete Notes"
          description="Full chapter notes with detailed explanation and examples."
          url={chapter.completeNotesUrl}
        />
        <VideoResourceCard url={chapter.videoUrl} comingSoon={chapter.videoComingSoon} />
      </Box>
    </Box>
  );
};

export default ChapterDetailPage;