import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Fade,
  IconButton,
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import server from '../environment';

const DiscountRecoveryModal = () => {
  const [open, setOpen] = useState(false);
  const [offer, setOffer] = useState(null);
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleOfferEvent = (e) => {
      if (e?.detail) {
        setOffer(e.detail);
        setOpen(true);
        setSuccess(false);
        setError('');
      }
    };

    window.addEventListener('recovery-discount-offer', handleOfferEvent);
    return () => {
      window.removeEventListener('recovery-discount-offer', handleOfferEvent);
    };
  }, []);

  const handleClose = () => {
    if (!paying) {
      setOpen(false);
    }
  };

  const handlePayNow = async () => {
    if (!offer?.offerId && !offer?.id) return;
    const offerId = offer.offerId || offer.id;

    try {
      setPaying(true);
      setError('');

      const token = localStorage.getItem('token');
      const email = localStorage.getItem('username') || '';
      const userObj = JSON.parse(localStorage.getItem('user') || '{}');
      const name = userObj?.name || 'Learner';

      // 1. Create discounted Razorpay order
      const orderRes = await axios.post(`${server}/api/recovery-offers/public/${offerId}/create-order`);
      const order = orderRes.data;

      if (!window.Razorpay) {
        throw new Error('Payment gateway SDK did not load. Please refresh the page and try again.');
      }

      // 2. Open Razorpay Modal
      const options = {
        key: order.key || process.env.REACT_APP_RAZORPAY_LIVE_KEY,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'NoteNova Academy',
        description: `${offer.discountPercent || 15}% Recovery Discount for ${offer.batchTitle || order.title}`,
        order_id: order.id,
        prefill: {
          name: name,
          email: email,
        },
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(`${server}/api/recovery-offers/public/${offerId}/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              email,
              name,
            });

            if (verifyRes.data.token) {
              localStorage.setItem('token', verifyRes.data.token);
              localStorage.setItem('username', verifyRes.data.username);
              localStorage.setItem('user', JSON.stringify({ username: verifyRes.data.username, name: verifyRes.data.name }));
            }

            setSuccess(true);
            const destination = verifyRes.data.destination || (offer.batchId ? `/class/${offer.batchId}` : '/batches');

            setTimeout(() => {
              setOpen(false);
              navigate(destination);
            }, 2000);
          } catch (vErr) {
            setError(vErr.response?.data?.message || 'Payment verification failed.');
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
          confirm_close: true,
          handleback: true,
        },
        theme: { color: '#1a1a2e' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Instant discount pay error:', err);
      setError(err.response?.data?.message || err.message || 'Could not launch payment gateway.');
      setPaying(false);
    }
  };

  if (!offer) return null;

  const originalPrice = Number(offer.originalPriceRupees || 0);
  const discountedPrice = Number(offer.discountedPriceRupees || Math.round(originalPrice * 0.85));
  const savings = Math.max(0, originalPrice - discountedPrice);
  const discountPercent = offer.discountPercent || 15;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.1)',
        },
      }}
    >
      {/* Header Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d5e 100%)',
          color: '#fff',
          p: 3,
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <IconButton
          onClick={handleClose}
          disabled={paying}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'rgba(255,255,255,0.7)',
            '&:hover': { color: '#fff' },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Chip
          icon={<LocalOfferIcon sx={{ fontSize: '15px !important', color: '#fff !important' }} />}
          label={`${discountPercent}% INSTANT RECOVERY DISCOUNT`}
          sx={{
            background: '#2e7d32',
            color: '#fff',
            fontWeight: 800,
            fontSize: '0.75rem',
            mb: 1.5,
            px: 0.5,
          }}
        />

        <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
          Payment Interrupted? We've Got You Covered!
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5, fontSize: '0.82rem' }}>
          An exclusive 1-time recovery discount has been activated on your account.
        </Typography>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        {success ? (
          <Fade in timeout={400}>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 60, color: '#2e7d32', mb: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1a1a2e' }}>
                Payment Successful! 🎉
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Your batch is now unlocked. Redirecting to your course lectures...
              </Typography>
            </Box>
          </Fade>
        ) : (
          <>
            {error && (
              <Box sx={{ p: 1.5, mb: 2, borderRadius: 2, bgcolor: '#fde8e8', color: '#9b1c1c', fontSize: '0.82rem' }}>
                {error}
              </Box>
            )}

            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 0.5 }}>
              Batch / Course:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
              {offer.batchTitle || 'Your Selected Course'}
            </Typography>

            <Box sx={{ background: '#f8f9fa', p: 2, borderRadius: 3, border: '1px solid #e9ecef', mb: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                <Typography variant="body2" color="text.secondary">Original Price:</Typography>
                <Typography variant="body2" sx={{ textDecoration: 'line-through', color: '#888' }}>
                  ₹{originalPrice.toLocaleString('en-IN')}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                <Typography variant="body2" color="text.secondary">
                  Special Discount ({discountPercent}%):
                </Typography>
                <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 700 }}>
                  -₹{savings.toLocaleString('en-IN')}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1a1a2e' }}>
                  Final Amount to Pay:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#2e7d32' }}>
                  ₹{discountedPrice.toLocaleString('en-IN')}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handlePayNow}
              disabled={paying}
              startIcon={paying ? <CircularProgress size={20} color="inherit" /> : <LockIcon />}
              sx={{
                background: '#1a1a2e',
                color: '#fff',
                py: 1.4,
                borderRadius: 2.5,
                fontWeight: 700,
                fontSize: '0.95rem',
                textTransform: 'none',
                boxShadow: '0 8px 24px rgba(26,26,46,0.25)',
                '&:hover': { background: '#2d2d5e' },
              }}
            >
              {paying ? 'Connecting to Razorpay...' : `Pay ₹${discountedPrice.toLocaleString('en-IN')} via Razorpay`}
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 2 }}>
              <NotificationsActiveIcon sx={{ fontSize: 16, color: '#666' }} />
              <WhatsAppIcon sx={{ fontSize: 16, color: '#25D366' }} />
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                Discount link also saved in your <b>Notifications</b> & <b>WhatsApp</b> (Valid 24h)
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>

      {!success && (
        <DialogActions sx={{ px: 3, pb: 2, pt: 0, justifyContent: 'center' }}>
          <Button
            size="small"
            onClick={handleClose}
            disabled={paying}
            sx={{ color: '#888', textTransform: 'none', fontSize: '0.8rem' }}
          >
            I'll pay later from Notifications
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default DiscountRecoveryModal;
