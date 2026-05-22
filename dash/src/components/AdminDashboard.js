import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import axios from "axios";
import server from "../environment";
import { useLocation } from "react-router-dom";

const AdminDashboard = () => {
  /* ---------------- EXISTING STATES ---------------- */
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState(null);
  const [users, setUsers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [sending, setSending] = useState(false);

  /* ---------------- DOUBT STATES ---------------- */
  const [doubts, setDoubts] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [openDoubts, setOpenDoubts] = useState(false);

  const location = useLocation();

  /* ---------------------------------------------------
     🔒 HARD DISABLE BACK BUTTON
  --------------------------------------------------- */
  useEffect(() => {
    if (location.pathname === "/admin-dashboard") {
      window.history.pushState(null, "", window.location.href);
      const blockBack = () => {
        window.history.pushState(null, "", window.location.href);
      };
      window.addEventListener("popstate", blockBack);
      return () => window.removeEventListener("popstate", blockBack);
    }
  }, [location.pathname]);

  /* ---------------------------------------------------
     👥 FETCH USERS
  --------------------------------------------------- */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${server}/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(res.data.users || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  /* ---------------------------------------------------
     ✉️ SEND ADMIN MESSAGE
  --------------------------------------------------- */
  const sendMessage = async () => {
    if (!message.trim()) return;
    setSending(true);

    try {
      await axios.post(
        `${server}/api/admin/send-message`,
        {
          text: message,
          toUsername: username || null,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSnackbarOpen(true);
      setMessage("");
      setUsername(null);
    } catch (err) {
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  /* ---------------------------------------------------
     📩 FETCH USER DOUBTS
  --------------------------------------------------- */
  const fetchDoubts = async () => {
    try {
      const res = await axios.get(`${server}/api/admin/doubts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setDoubts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch doubts", err);
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, []);

  /* ---------------------------------------------------
     📨 REPLY TO DOUBT
  --------------------------------------------------- */
  const sendReply = async (id) => {
    if (!replyText[id]) return;

    try {
      await axios.post(
        `${server}/api/admin/reply-doubt/${id}`,
        { reply: replyText[id] },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setReplyText((prev) => ({ ...prev, [id]: "" }));
      fetchDoubts();
    } catch (err) {
      alert("Failed to send reply");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ fontWeight: 700 }}
      >
        Admin Dashboard
      </Typography>

      {/* ================= MAIN ROW ================= */}
      <Box
        sx={{
          display: "flex",
          gap: 4,
          alignItems: "stretch",
          flexDirection: { xs: "column", md: "row" }, // ✅ RESPONSIVE FIX
        }}
      >
        {/* ================= SEND MESSAGE CARD ================= */}
        <Card
          sx={{
            flex: 1,
            p: 2,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 0 18px rgba(25,118,210,0.5)",
              transform: "scale(1.02)",
            },
          }}
        >
          <CardContent>
            <Typography variant="h6">Send Message to Users</Typography>

            <TextField
              fullWidth
              label="Message"
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ mt: 2 }}
            />

            <Autocomplete
              options={users.map((u) => u.username)}
              value={username}
              onChange={(e, val) => setUsername(val)}
              renderInput={(params) => (
                <TextField {...params} label="Select Username (optional)" />
              )}
              sx={{ mt: 2 }}
            />

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              onClick={sendMessage}
              disabled={sending}
            >
              {sending ? "Sending..." : "Send Message"}
            </Button>
          </CardContent>
        </Card>

        {/* ================= USER DOUBTS ENTRY ================= */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            border: "1px dashed #1976d2",
            borderRadius: 2,
            p: 3,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 0 18px rgba(25,118,210,0.5)",
              transform: "scale(1.02)",
            },
          }}
        >
          <Typography variant="h6" gutterBottom>
            User Doubts
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2, px: 5, py: 1.5 }}
            onClick={() => setOpenDoubts(true)}
          >
            View Messages
          </Button>
        </Box>
      </Box>

      {/* ================= DOUBTS MODAL ================= */}
      <Dialog
        open={openDoubts}
        onClose={() => setOpenDoubts(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>User Doubts</DialogTitle>
        <DialogContent dividers>
          {doubts.length === 0 ? (
            <Typography>No doubts yet</Typography>
          ) : (
            doubts.map((d) => (
              <Card key={d._id} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography>
                    <b>User:</b> {d.username}
                  </Typography>
                  <Typography>
                    <b>Subject:</b> {d.subject}
                  </Typography>
                  <Typography sx={{ my: 1 }}>{d.message}</Typography>

                  {d.replied ? (
                    <Typography color="green">✔ Replied</Typography>
                  ) : (
                    <>
                      <TextField
                        fullWidth
                        placeholder="Write reply..."
                        value={replyText[d._id] || ""}
                        onChange={(e) =>
                          setReplyText({
                            ...replyText,
                            [d._id]: e.target.value,
                          })
                        }
                        sx={{ mt: 2 }}
                      />
                      <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={() => sendReply(d._id)}
                      >
                        Send Reply
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success">Message sent successfully!</Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;
