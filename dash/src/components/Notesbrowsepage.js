import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, CardMedia, Typography, Button, CardActions,
  Box, Chip, Stack, useMediaQuery, useTheme, CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { makeAuthenticatedRequest } from './makeauth';
import server from '../environment';

const NotesBrowsePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchaseInfo, setPurchaseInfo] = useState({});

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await fetch(`${server}/api/notes/batches`);
        const data = await res.json();
        setBatches(data);
      } catch (err) {
        console.error('Failed to fetch note batches:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const data = await makeAuthenticatedRequest(`${server}/api/user-purchases`);
        const info = {};
        data.forEach((p) => { info[p.classId] = p; });
        setPurchaseInfo(info);
      } catch (err) {
        console.error('Failed to fetch purchases:', err.message);
      }
    };
    fetchPurchases();
  }, []);

  const handleBuy = async (batch) => {
    const token = localStorage.getItem('token');
    if (!token) { alert('Please login first'); return; }

    const purchasePayload = {
      classId: batch.slug, batchTitle: batch.title, price: batch.price,
      imageUrl: batch.imageUrl, description: batch.description,
    };

    if (batch.price === 0) {
      try {
        await makeAuthenticatedRequest(`${server}/api/save-purchase`, 'POST', purchasePayload);
        setPurchaseInfo((prev) => ({ ...prev, [batch.slug]: { expiryDate: new Date().toISOString() } }));
        navigate(`/notes/${batch.slug}`);
      } catch (err) {
        alert(err.message || 'Failed to grant access.');
      }
      return;
    }

    try {
      const orderRes = await makeAuthenticatedRequest(`${server}/api/create-order`, 'POST', {
        amount: batch.price,
        receipt: `receipt_${batch.slug}_${Date.now()}`,
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_LIVE_KEY,
        amount: batch.price * 100,
        currency: 'INR',
        name: 'Atom Classes',
        description: `Payment for ${batch.title}`,
        order_id: orderRes.id,
        handler: async function () {
          try {
            await makeAuthenticatedRequest(`${server}/api/save-purchase`, 'POST', purchasePayload);
            setPurchaseInfo((prev) => ({ ...prev, [batch.slug]: { expiryDate: new Date().toISOString() } }));
            navigate(`/notes/${batch.slug}`);
          } catch (err) {
            alert(err.message || 'Error saving your purchase.');
          }
        },
        prefill: { name: '', email: '', contact: '' },
        notes: { batchId: batch.slug },
        theme: { color: '#1976d2' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Payment initialization failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, py: isMobile ? 2 : 0, px: isMobile ? 1.5 : 5 }}>
      <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700} mb={4} textAlign="center" color="primary">
        Notes
      </Typography>

      <Box sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'center' : 'flex-start',
        justifyContent: isMobile ? 'center' : 'flex-start',
        overflowX: isMobile ? 'hidden' : 'auto',
        overflowY: isMobile ? 'auto' : 'hidden',
        gap: 3, pb: 2, px: isMobile ? 0.5 : 1,
        scrollSnapType: isMobile ? 'none' : 'x mandatory',
        '&::-webkit-scrollbar': { height: 8 },
        '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: 4 },
      }}>
        {batches.map((batch) => {
          const isPurchased = !!purchaseInfo[batch.slug];
          const expiryDate = purchaseInfo[batch.slug]?.expiryDate ? new Date(purchaseInfo[batch.slug].expiryDate) : null;

          return (
            <Box key={batch.slug} sx={{
              flex: '0 0 auto',
              scrollSnapAlign: isMobile ? 'none' : 'start',
              display: 'flex', justifyContent: 'center',
              width: isMobile ? '100%' : 'auto', px: 0,
            }}>
              <Card sx={{
                width: 330, borderRadius: 4, overflow: 'hidden', boxShadow: 6,
                display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: 12 },
              }}>
                <CardMedia component="img" height="220" image={batch.imageUrl} alt={batch.title}
                  sx={{ objectFit: 'cover', borderBottom: '1px solid #eee' }} />

                <CardContent sx={{ px: 3, pt: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{batch.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ minHeight: 48 }}>{batch.description}</Typography>

                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                    <Chip
                      label={batch.price === 0 ? 'FREE' : `₹${batch.price}`}
                      color={batch.price === 0 ? 'success' : 'warning'}
                      sx={{ fontWeight: 'bold', px: 1.5 }}
                    />
                    {isPurchased && <Chip label="Purchased" color="primary" size="small" />}
                  </Stack>

                  <Box sx={{ minHeight: 24, mt: 1, display: 'flex', alignItems: 'center' }}>
                    {isPurchased && expiryDate && (
                      <Typography variant="caption" sx={{ color: 'gray', fontWeight: 600 }}>
                        Expires on: {expiryDate.toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>
                </CardContent>

                <CardActions sx={{ px: 3, pb: 3, pt: 0, mt: 'auto' }}>
                  <Button
                    variant="contained" fullWidth
                    onClick={() => (isPurchased ? navigate(`/notes/${batch.slug}`) : handleBuy(batch))}
                    sx={{ fontWeight: 600, borderRadius: 2, textTransform: 'none' }}
                  >
                    {isPurchased ? 'Study' : 'Buy Now'}
                  </Button>
                </CardActions>
              </Card>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default NotesBrowsePage;