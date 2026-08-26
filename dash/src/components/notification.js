import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Snackbar,
  Alert,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import axios from 'axios';
import server from '../environment';

// Format timestamp nicely
const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [popupNotif, setPopupNotif] = useState(null);
  const [open, setOpen] = useState(false);
  const [claiming, setClaiming] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Get username from localStorage
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!username) return;

      try {
        const res = await axios.get(`${server}/api/notifications/${username}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        // Map backend notifications to frontend-friendly structure
        const backendNotifications = res.data.map((n) => ({
          id: n._id,
          title:
            n.type === 'DOUBT_REPLY'
              ? 'Reply from Admin'
              : n.type === 'ADMIN_MESSAGE'
              ? 'Message from Admin'
              : n.type === 'RECOVERY_DISCOUNT'
              ? '🎁 Special Recovery Offer'
              : 'Notification',
          message: n.text,
          type: n.type,
          metadata: n.metadata || {},
          timestamp: n.createdAt,
          isNew: !n.isRead,
        }));

        setNotifications(backendNotifications);

        // Show popup for first unseen notification
        const seen = JSON.parse(localStorage.getItem('seenNotifIds')) || [];
        const unseen = backendNotifications.find(
          (notif) => notif.isNew && !seen.includes(notif.id)
        );

        if (unseen) {
          setPopupNotif(unseen);
          setOpen(true);
          localStorage.setItem(
            'seenNotifIds',
            JSON.stringify([...seen, unseen.id])
          );
        }
      } catch (err) {
        console.error('Failed to load notifications', err);
      }
    };

    fetchNotifications();

    const handleLiveReply = () => fetchNotifications();
    window.addEventListener('doubt-reply', handleLiveReply);
    
    const interval = setInterval(fetchNotifications, 30000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('doubt-reply', handleLiveReply);
    };
  }, [username]);

  const claimRecoveryOffer = async (offerId) => {
    try {
      setClaiming(offerId);
      const email = localStorage.getItem('username') || '';
      const userObj = JSON.parse(localStorage.getItem('user') || '{}');
      const name = userObj?.name || 'Learner';

      const res = await axios.post(`${server}/api/recovery-offers/public/${offerId}/create-order`);
      const order = res.data;
      if (!window.Razorpay) throw new Error('Payment gateway did not load. Refresh and try again.');

      const rzp = new window.Razorpay({
        key: order.key || process.env.REACT_APP_RAZORPAY_LIVE_KEY,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'NoteNova Academy',
        description: `${order.discountPercent || 15}% recovery discount for ${order.title}`,
        order_id: order.id,
        prefill: { name, email },
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
            const destination = verifyRes.data.destination || (order.classId ? `/class/${order.classId}` : '/batches');
            window.location.assign(destination);
          } catch (vErr) {
            alert(vErr.response?.data?.message || 'Payment verification failed.');
          }
        },
        modal: { ondismiss: () => setClaiming(null), confirm_close: true, handleback: true },
        theme: { color: '#1a1a2e' },
      });
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || err.message || 'Could not start recovery checkout.');
    } finally {
      setClaiming(null);
    }
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 4 }}>
      <Typography
        variant={isMobile ? 'h5' : 'h4'}
        align="center"
        gutterBottom
        sx={{ fontWeight: 700 }}
      >
        <NotificationsActiveIcon sx={{ mr: 1 }} />
        Notifications
      </Typography>

      <Divider sx={{ mb: isMobile ? 2 : 4 }} />

      {notifications.length === 0 ? (
        <Typography align="center" sx={{ mt: 6, color: 'text.secondary' }}>
          No notifications yet
        </Typography>
      ) : (
        <Grid container spacing={isMobile ? 2 : 3}>
          {notifications.map((notif) => (
            <Grid item xs={12} sm={6} md={4} key={notif.id}>
              <Card
                elevation={4}
                sx={{
                  borderRadius: 3,
                  backgroundColor: notif.type === 'RECOVERY_DISCOUNT' ? '#f4fbf7' : notif.isNew ? '#fff4e5' : '#f9f9ff',
                  border: notif.type === 'RECOVERY_DISCOUNT' ? '1px solid #c8e6c9' : 'none',
                  p: isMobile ? 1 : 2,
                  transition: '0.3s',
                  '&:hover': { boxShadow: 8 },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: notif.type === 'RECOVERY_DISCOUNT' ? '#2e7d32' : '#1a1a2e' }}>
                      {notif.title}
                    </Typography>
                    {notif.isNew && (
                      <Chip
                        label="New"
                        color="error"
                        size="small"
                      />
                    )}
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ my: 1 }}
                  >
                    {notif.message}
                  </Typography>

                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    {formatDate(notif.timestamp)}
                  </Typography>

                  {notif.type === 'RECOVERY_DISCOUNT' && notif.metadata.recoveryOfferId && (
                    <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          background: '#1a1a2e',
                          color: '#fff',
                          fontWeight: 700,
                          textTransform: 'none',
                          borderRadius: 2,
                          '&:hover': { background: '#2d2d5e' },
                        }}
                        disabled={claiming === notif.metadata.recoveryOfferId}
                        onClick={() => claimRecoveryOffer(notif.metadata.recoveryOfferId)}
                      >
                        {claiming === notif.metadata.recoveryOfferId
                          ? 'Opening Razorpay…'
                          : `Pay Discounted Price (${notif.metadata.discountPercent || 15}% OFF)`}
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ textTransform: 'none', borderRadius: 2, borderColor: '#ccc', color: '#555' }}
                        onClick={() => window.open(`/pay-discount/${notif.metadata.recoveryOfferId}`, '_blank')}
                      >
                        Open Direct Checkout Link ↗
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Popup Snackbar */}
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="info"
          variant="filled"
          sx={{ width: '100%' }}
        >
          📢 {popupNotif?.title} — {popupNotif?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NotificationsPage;
