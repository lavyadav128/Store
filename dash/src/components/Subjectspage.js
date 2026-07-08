import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import server from '../environment';

// ─────────────────────────────────────────────────────────────
// SubjectsPage — /class/:batchId
// Fetches the batch (title + subjects[]) and renders one card per
// subject. Matches the existing look exactly: white rounded cards,
// bold subject name, grey description, "Back" pill button.
// ─────────────────────────────────────────────────────────────
const SubjectsPage = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();

  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const res = await fetch(`${server}/api/batches/${batchId}`);
        const data = await res.json();
        setBatch(data);
      } catch (err) {
        console.error('Failed to fetch batch:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBatch();
  }, [batchId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const subjects = batch?.subjects || [];

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

      <Typography variant="h3" sx={{ fontWeight: 800, textAlign: 'center', mb: 6, color: '#111' }}>
        Subjects
      </Typography>

      {subjects.length === 0 ? (
        <Typography sx={{ textAlign: 'center', color: '#999' }}>
          No subjects have been added for this class yet.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
          {subjects
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((subject) => (
              <Box
                key={subject.slug}
                onClick={() => navigate(`/class/${batchId}/${subject.slug}`)}
                sx={{
                  width: 420, maxWidth: '100%', p: 4, borderRadius: '18px',
                  border: '1px solid #eee', background: '#fff', cursor: 'pointer',
                  textAlign: 'center', transition: 'all 0.2s ease',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                  '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 28px rgba(0,0,0,0.08)' },
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, color: '#111' }}>
                  {subject.name}
                </Typography>
                <Typography sx={{ color: '#777', fontSize: 15 }}>
                  {subject.description}
                </Typography>
              </Box>
            ))}
        </Box>
      )}
    </Box>
  );
};

export default SubjectsPage;