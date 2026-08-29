import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Card, CardContent, Typography, Button,
  CircularProgress, Alert, Chip, Divider, TextField, Avatar,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LockIcon from '@mui/icons-material/Lock';
import axios from 'axios';
import server from '../../shared/environment';

const PublicDiscountCheckout = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [offerData, setOfferData] = useState(null);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        setLoading(true);
        const headers = {};
        const localToken = localStorage.getItem('token');
        if (localToken) headers.Authorization = `Bearer ${localToken}`;

        const res = await axios.get(`${server}/api/recovery-offers/public/${offerId}`, { headers });
        if (res.data.success) {
          setOfferData(res.data);
          const localUser = JSON.parse(localStorage.getItem('user') || '{}');
          setEmail(res.data.customerEmail || localStorage.getItem('username') || '');
          setName(res.data.customerName || localUser.name || 'Learner');
        } else {
          setError(res.data.message || 'Offer not found or expired');
        }
      } catch (err) {
        console.error('Fetch recovery offer error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load recovery discount offer.');
      } finally {
        setLoading(false);
      }
    };
    if (offerId) fetchOffer();
  }, [offerId]);

  const handlePayNow = async () => {
    try {
      setPaying(true);
      setError('');
      if (!email.trim()) {
        setError('Please enter your email address to receive course access.');
        setPaying(false);
        return;
      }

      const headers = {};
      const localToken = localStorage.getItem('token');
      if (localToken) headers.Authorization = `Bearer ${localToken}`;

      // 1. Create order
      const orderRes = await axios.post(`${server}/api/recovery-offers/public/${offerId}/create-order`, {}, { headers });
      const order = orderRes.data;


      if (!window.Razorpay) {
        throw new Error('Payment gateway SDK did not load. Please refresh the page and try again.');
      }

      // 2. Open Razorpay Modal
      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: 'EduPortal AI',
        description: `${order.discountPercent}% Special Recovery Discount for ${order.title}`,
        order_id: order.id,
        prefill: {
          name: name || 'Student',
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
            const destination = verifyRes.data.destination || (verifyRes.data.batchId ? `/class/${verifyRes.data.batchId}` : '/batches');
            setTimeout(() => {
              navigate(destination);
            }, 2000);
          } catch (vErr) {
            setError(vErr.response?.data?.message || 'Payment verification failed.');
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
          confirm_close: true,
        },
        theme: { color: '#1a1a2e' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not launch payment modal.');
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <CircularProgress size={48} sx={{ color: '#1a1a2e', mb: 2 }} />
        <Typography variant="body1" sx={{ color: '#666' }}>Loading your special discount offer…</Typography>
      </Box>
    );
  }

  if (error && !offerData) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ borderRadius: 3, mb: 3 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate('/')} sx={{ textTransform: 'none' }}>
          Return to Home
        </Button>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Card sx={{ borderRadius: 4, p: 4, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}>
          <CheckCircleIcon sx={{ fontSize: 72, color: '#2e7d32', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#1a1a2e' }}>
            Enrollment Confirmed! 🎉
          </Typography>
          <Typography variant="body1" sx={{ color: '#555', mb: 3 }}>
            Your payment was successful and your recovery discount has been applied. Redirecting to your active batches…
          </Typography>
          <CircularProgress size={24} sx={{ color: '#1a1a2e' }} />
        </Card>
      </Container>
    );
  }

  const { batch, discountPercent, originalPriceRupees, discountedPriceRupees } = offerData;

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 6 } }}>
      <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.12)', border: '1px solid #e0e0e0' }}>
        <Box sx={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d5e 100%)', color: '#fff', p: 3, textAlign: 'center' }}>
          <Chip
            icon={<LocalOfferIcon sx={{ fontSize: '16px !important', color: '#fff !important' }} />}
            label={`${discountPercent}% Recovery Discount Activated`}
            sx={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, mb: 1.5 }}
          />
          <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>
            Special One-Time Enrollment Offer
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
            Complete your purchase to secure your batch seat immediately
          </Typography>
        </Box>

        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar src={batch.imageUrl} variant="rounded" sx={{ width: 64, height: 64, borderRadius: 2 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', lineHeight: 1.2 }}>
                {batch.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {batch.category}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ background: '#f8f9fa', p: 2.5, borderRadius: 3, mb: 3, border: '1px solid #eee' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Original Price:</Typography>
              <Typography variant="body2" sx={{ textDecoration: 'line-through', color: '#888' }}>
                ₹{originalPriceRupees.toLocaleString('en-IN')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Special Recovery Discount ({discountPercent}%):</Typography>
              <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                -₹{(originalPriceRupees - discountedPriceRupees).toLocaleString('en-IN')}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1a1a2e' }}>Payable Amount:</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a1a2e' }}>
                ₹{discountedPriceRupees.toLocaleString('en-IN')}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <TextField
              label="Your Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Email Address for Access"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              size="small"
              required
              helperText="Your course login details will be associated with this email"
            />
          </Box>

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handlePayNow}
            disabled={paying}
            sx={{
              py: 1.5,
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              color: '#fff',
              fontWeight: 800,
              fontSize: 16,
              borderRadius: 3,
              textTransform: 'none',
              boxShadow: '0 8px 24px rgba(17,153,142,0.3)',
              '&:hover': { background: 'linear-gradient(135deg, #0e8076 0%, #2ecc71 100%)' },
            }}
          >
            {paying ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LockIcon sx={{ fontSize: 18 }} />
                Pay ₹{discountedPriceRupees.toLocaleString('en-IN')} Securely via Razorpay
              </Box>
            )}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PublicDiscountCheckout;
