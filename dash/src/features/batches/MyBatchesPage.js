import React, { useEffect, useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Button,
  CircularProgress,
  Alert,
  Fade,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { makeAuthenticatedRequest } from '../../shared/guards/makeauth';
import server from '../../shared/environment';

const MyBatchesPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  // Instant hydration from sessionStorage
  const [batches, setBatches] = useState(() => {
    try {
      const cached = sessionStorage.getItem('notenova_user_purchases');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(() => {
    try {
      const cached = sessionStorage.getItem('notenova_user_purchases');
      return !cached || JSON.parse(cached).length === 0;
    } catch {
      return true;
    }
  });

  const [error, setError] = useState(null);
  const [tab, setTab] = useState(0); // 0: Free, 1: Paid

  useEffect(() => {
    let isMounted = true;
    const fetchPurchasedBatches = async () => {
      try {
        const res = await makeAuthenticatedRequest(`${server}/api/user-purchases`);
        const responseData = Array.isArray(res) ? res : (res?.data || []);
        const safeBatches = Array.isArray(responseData) ? responseData : [];

        if (isMounted) {
          setBatches(safeBatches);
          try {
            sessionStorage.setItem('notenova_user_purchases', JSON.stringify(safeBatches));
          } catch {}
        }
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login');
        } else if (!sessionStorage.getItem('notenova_user_purchases')) {
          if (isMounted) setError('Failed to load your purchased batches. Please try again later.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPurchasedBatches();
    return () => { isMounted = false; };
  }, [navigate]);

  const renderBatchCard = (batch) => {
    const description = batch.description?.trim() || 'No description available.';
    const imageUrl = batch.imageUrl?.trim() || '/images/default.png';
    const expiryDate = batch.expiryDate ? new Date(batch.expiryDate) : null;
    const isPremium = batch.isPremium === true;

    let studyLink = '';
    if (batch.classId === 'dsa') {
      studyLink = '/dsa';
    } else if (batch.classId === 'web') {
      studyLink = '/web';
    } else {
      studyLink = isPremium
        ? `/premium/class/${batch.classId}`
        : `/class/${batch.classId}`;
    }

    return (
      <Grid item xs={12} sm={6} md={4} key={batch.classId || batch.title}>
        <Fade in timeout={400}>
          <Card
            sx={{
              borderRadius: '18px',
              overflow: 'hidden',
              boxShadow: '0 4px 18px rgba(0,0,0,0.06)',
              border: '1px solid #f0f0f4',
              backgroundColor: '#ffffff',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 28px rgba(0,0,0,0.11)',
              },
            }}
          >
            <CardMedia
              component="img"
              sx={{ height: { xs: 160, sm: 190 }, objectFit: 'cover' }}
              image={imageUrl}
              alt={batch.title}
            />
            <CardContent sx={{ p: { xs: 2, sm: 2.5 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "'Playfair Display', serif", fontSize: { xs: 16, sm: 18 }, color: '#1a1a2e', mb: 0.8 }}>
                {batch.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ minHeight: 38, fontSize: 13, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
                {description}
              </Typography>
              <Stack direction="row" spacing={1} mt={1.8} alignItems="center">
                <Chip
                  label={isPremium ? 'Premium Batch' : 'Active Batch'}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: 11,
                    backgroundColor: isPremium ? '#6c5ce7' : '#1a1a2e',
                    color: '#fff',
                    borderRadius: '8px',
                  }}
                />
                {batch.price > 0 && (
                  <Chip
                    label={`₹${batch.price}`}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 700, fontSize: 11, borderRadius: '8px', borderColor: '#27ae60', color: '#27ae60' }}
                  />
                )}
              </Stack>
              {expiryDate && (
                <Typography variant="caption" color="text.secondary" display="block" mt={1} sx={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Valid until: {expiryDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </Typography>
              )}
            </CardContent>
            <Box sx={{ px: { xs: 2, sm: 2.5 }, pb: { xs: 2, sm: 2.5 } }}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  fontWeight: 700,
                  borderRadius: '12px',
                  textTransform: 'none',
                  backgroundColor: '#1a1a2e',
                  fontFamily: "'DM Sans', sans-serif",
                  py: 1,
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#2d2d4e',
                    boxShadow: '0 6px 18px rgba(26,26,46,0.25)',
                  },
                }}
                onClick={() => navigate(studyLink)}
              >
                Go to Classroom →
              </Button>
            </Box>
          </Card>
        </Fade>
      </Grid>
    );
  };

  if (loading && batches.length === 0) {
    return (
      <Stack alignItems="center" justifyContent="center" py={10}>
        <CircularProgress size={36} sx={{ color: '#1a1a2e' }} />
        <Typography sx={{ mt: 2, fontSize: 14, color: '#888', fontFamily: "'DM Sans', sans-serif" }}>
          Loading your batches...
        </Typography>
      </Stack>
    );
  }

  if (error && batches.length === 0) {
    return (
      <Alert severity="error" sx={{ margin: '30px auto', maxWidth: 500, borderRadius: '12px' }}>
        {error}
      </Alert>
    );
  }

  const freeBatches = batches.filter((batch) => !batch.price || batch.price === 0);
  const paidBatches = batches.filter((batch) => batch.price && batch.price > 0);
  const displayBatches = tab === 0 ? freeBatches : paidBatches;

  return (
    <Box sx={{ px: { xs: 1, sm: 2, md: 3 }, py: { xs: 1, sm: 2 } }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: { xs: 22, sm: 28 }, color: '#1a1a2e' }}>
          My Enrolled Batches
        </Typography>
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#888', mt: 0.5 }}>
          Access your enrolled curriculum, lecture notes, and classroom materials
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(e, newVal) => setTab(newVal)}
          variant={isMobile ? 'fullWidth' : 'standard'}
          sx={{
            minHeight: 40,
            background: '#f4f4f6',
            p: 0.5,
            borderRadius: '12px',
            '& .MuiTabs-indicator': { display: 'none' },
            '& .MuiTab-root': {
              minHeight: 36,
              borderRadius: '9px',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              textTransform: 'none',
              color: '#666',
              transition: 'all 0.2s ease',
              '&.Mui-selected': {
                color: '#fff',
                backgroundColor: '#1a1a2e',
              },
            },
          }}
        >
          <Tab label={`Free Batches (${freeBatches.length})`} />
          <Tab label={`Paid Batches (${paidBatches.length})`} />
        </Tabs>
      </Box>

      {displayBatches.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6, px: 2, background: '#fafafa', borderRadius: '16px', border: '1px dashed #e0e0e0', maxWidth: 500, mx: 'auto' }}>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16, color: '#444', mb: 1 }}>
            No {tab === 0 ? 'free' : 'paid'} batches enrolled yet
          </Typography>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#888', mb: 2 }}>
            Explore available courses to start learning today.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate('/cou')}
            sx={{ borderRadius: '10px', textTransform: 'none', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, borderColor: '#1a1a2e', color: '#1a1a2e' }}
          >
            Explore Courses →
          </Button>
        </Box>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {displayBatches.map(renderBatchCard)}
        </Grid>
      )}
    </Box>
  );
};

export default MyBatchesPage;
