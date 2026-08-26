import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, CardMedia, Typography, Button, CardActions,
  Box, Chip, Stack, useMediaQuery, useTheme, CircularProgress,
  Dialog, DialogContent, DialogActions, IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useNavigate } from 'react-router-dom';
import { makeAuthenticatedRequest } from './makeauth';
import server from '../environment';
import { reportCheckoutFailure } from '../recoveryClient';

const NotesBrowsePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchaseInfo, setPurchaseInfo] = useState({});

  // Explore dialog state
  const [exploreBatch, setExploreBatch] = useState(null);

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
        batchId: batch.slug,
        batchTitle: batch.title,
      });

      let paymentDone = false;
      const options = {
        key: orderRes.key || process.env.REACT_APP_RAZORPAY_LIVE_KEY,
        amount: orderRes.amount,
        currency: 'INR',
        name: 'Atom Classes',
        description: `Payment for ${batch.title}`,
        order_id: orderRes.id,
        handler: async function (response) {
          paymentDone = true;
          try {
            await makeAuthenticatedRequest(`${server}/api/save-purchase`, 'POST', {
              ...purchasePayload,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setPurchaseInfo((prev) => ({ ...prev, [batch.slug]: { expiryDate: new Date().toISOString() } }));
            navigate(`/notes/${batch.slug}`);
          } catch (err) {
            alert(err.message || 'Error saving your purchase.');
          }
        },
        prefill: { name: '', email: '', contact: '' },
        notes: { batchId: batch.slug },
        theme: { color: '#1a1a2e' },
        modal: {
          confirm_close: true,
          handleback: true,
          ondismiss: () => {
            if (!paymentDone) {
              reportCheckoutFailure(orderRes.id, { error: { reason: 'checkout_dismissed_before_completion' } });
            }
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => reportCheckoutFailure(orderRes.id, response));
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

                <CardActions sx={{ px: 3, pb: 3, pt: 0, mt: 'auto', gap: 1 }}>
                  <Button
                    variant="outlined" fullWidth
                    onClick={() => setExploreBatch(batch)}
                    startIcon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
                    sx={{ fontWeight: 600, borderRadius: 2, textTransform: 'none' }}
                  >
                    Explore
                  </Button>
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

      {/* ── EXPLORE DIALOG ── */}
      <Dialog
        open={!!exploreBatch} onClose={() => setExploreBatch(null)}
        maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: '22px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.2)' } }}
      >
        {exploreBatch && (
          <>
            <Box sx={{ position: 'relative', height: 130 }}>
              {exploreBatch.imageUrl ? (
                <Box component="img" src={exploreBatch.imageUrl} alt={exploreBatch.title}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Box sx={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)' }} />
              )}
              <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(26,26,46,0.1) 0%, rgba(26,26,46,0.9) 100%)' }} />
              <IconButton onClick={() => setExploreBatch(null)} size="small"
                sx={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.9)', '&:hover': { background: '#fff' } }}>
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <Box sx={{ position: 'absolute', left: 18, bottom: 12, right: 18 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 20, color: '#fff' }}>
                  {exploreBatch.title}
                </Typography>
                <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', mt: 0.3 }}>
                  What you'll get in this batch
                </Typography>
              </Box>
            </Box>

            <DialogContent sx={{ p: 3 }}>
              {Array.isArray(exploreBatch.whatYouLearn) && exploreBatch.whatYouLearn.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.6 }}>
                  {exploreBatch.whatYouLearn.map((item, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                      <CheckCircleIcon sx={{ fontSize: 19, color: '#43a047', mt: '1px', flexShrink: 0 }} />
                      <Typography sx={{ fontSize: 14, color: '#333', lineHeight: 1.5 }}>
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <VisibilityIcon sx={{ fontSize: 32, color: '#e0e0e0', mb: 1 }} />
                  <Typography sx={{ fontSize: 13, color: '#aaa' }}>
                    No features added yet for this batch.
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2.5, pt: 0 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  const b = exploreBatch;
                  setExploreBatch(null);
                  const isPurchased = !!purchaseInfo[b.slug];
                  isPurchased ? navigate(`/notes/${b.slug}`) : handleBuy(b);
                }}
                sx={{ fontWeight: 700, borderRadius: 2, textTransform: 'none', py: 1.3 }}
              >
                {purchaseInfo[exploreBatch.slug] ? 'Study Now' : 'Buy Now'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default NotesBrowsePage;
