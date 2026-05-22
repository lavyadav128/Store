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
              : 'Notification',
          message: n.text,
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

    // Optional: Polling every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [username]);

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
                  backgroundColor: notif.isNew ? '#fff4e5' : '#f9f9ff',
                  p: isMobile ? 1 : 2,
                  transition: '0.3s',
                  '&:hover': { boxShadow: 8 },
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {notif.title}
                    {notif.isNew && (
                      <Chip
                        label="New"
                        color="error"
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ my: 1 }}
                  >
                    {notif.message}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {formatDate(notif.timestamp)}
                  </Typography>
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
