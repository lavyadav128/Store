import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import server from '../environment';

// ─────────────────────────────────────────────────────────────
// ChaptersPage — /class/:batchId/:subjectSlug
// Fetches all chapters for this batch+subject and renders the
// chapter grid. Matches the existing look: light-blue tinted
// rounded cards, bold centered chapter titles, 4-per-row grid.
// ─────────────────────────────────────────────────────────────
const ChaptersPage = () => {
  const { batchId, subjectSlug } = useParams();
  const navigate = useNavigate();

  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await fetch(
          `${server}/api/chapters?batchId=${encodeURIComponent(batchId)}&subject=${encodeURIComponent(subjectSlug)}`
        );
        const data = await res.json();
        setChapters(data);
      } catch (err) {
        console.error('Failed to fetch chapters:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChapters();
  }, [batchId, subjectSlug]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const subjectTitle = subjectSlug
    ? subjectSlug.charAt(0).toUpperCase() + subjectSlug.slice(1)
    : '';

  return (
    <Box sx={{ maxWidth: 1300, mx: 'auto', px: 3, py: 5 }}>
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

      <Typography variant="h3" sx={{ fontWeight: 800, textAlign: 'center', mb: 6, color: '#111' }}>
        {subjectTitle}
      </Typography>

      {chapters.length === 0 ? (
        <Typography sx={{ textAlign: 'center', color: '#999' }}>
          No chapters have been added for this subject yet.
        </Typography>
      ) : (
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 3,
        }}>
          {chapters.map((ch) => (
            <Box
              key={ch._id}
              onClick={() => navigate(`/class/${batchId}/${subjectSlug}/${ch.slug}`)}
              sx={{
                py: 4, px: 2, borderRadius: '16px', textAlign: 'center', cursor: 'pointer',
                background: '#eef2fb', transition: 'all 0.2s ease',
                boxShadow: '0 1px 6px rgba(0,0,0,0.03)',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 10px 24px rgba(0,0,0,0.08)' },
              }}
            >
              <Typography sx={{ fontWeight: 800, fontSize: 16.5, color: '#111' }}>
                {ch.title}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ChaptersPage;