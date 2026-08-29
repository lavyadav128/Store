import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Chip,
  Divider,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { makeAuthenticatedRequest } from "../../shared/guards/makeauth";
import server from "../../shared/environment";

const DoubtPage = () => {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    contact: "",
  });

  const [loading, setLoading] = useState(false);
  const [myDoubts, setMyDoubts] = useState([]);
  const [fetchingDoubts, setFetchingDoubts] = useState(false);
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const username = localStorage.getItem("username") || "";

  const fetchMyDoubts = async () => {
    if (!username) return;
    setFetchingDoubts(true);
    try {
      const res = await makeAuthenticatedRequest(`${server}/api/my-doubts`, "GET");
      if (res.success && Array.isArray(res.doubts)) {
        setMyDoubts(res.doubts);
      }
    } catch (err) {
      console.error("Failed to load user doubts:", err);
    } finally {
      setFetchingDoubts(false);
    }
  };

  useEffect(() => {
    fetchMyDoubts();
    const handleReply = () => {
      fetchMyDoubts();
    };
    window.addEventListener("doubt-reply", handleReply);
    return () => window.removeEventListener("doubt-reply", handleReply);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username) {
      alert("User not logged in. Please login again.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        username,
      };

      const res = await makeAuthenticatedRequest(
        `${server}/api/submit-doubt`,
        "POST",
        payload
      );

      if (res.success) {
        setSuccessSnackbar(true);
        setFormData({ subject: "", message: "", contact: "" });
        fetchMyDoubts();
      } else {
        throw new Error("Submit failed");
      }
    } catch (err) {
      console.error("Submit doubt failed:", err);
      setErrorSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ px: isMobile ? 2 : 4, py: 3, maxWidth: 800, mx: "auto" }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        align="center"
        gutterBottom
        fontWeight="bold"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}
      >
        <HelpOutlineIcon sx={{ fontSize: isMobile ? 28 : 34 }} />
        Ask a Doubt
      </Typography>
      <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
        Have questions about courses, payments, or study materials? Ask our team directly.
      </Typography>

      <Paper
        elevation={2}
        sx={{
          p: isMobile ? 2.5 : 4,
          borderRadius: 3,
          border: "1px solid #f0f0f0",
          background: "#fff",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={isMobile ? 2 : 3}>
            <Grid item xs={12}>
              <TextField
                label="Subject / Topic"
                name="subject"
                fullWidth
                required
                placeholder="e.g. Physics Chapter 4 doubt, batch access issue"
                value={formData.subject}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Your Doubt / Question in Detail"
                name="message"
                multiline
                rows={4}
                fullWidth
                required
                placeholder="Describe your question or issue clearly..."
                value={formData.message}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Your Email or Phone (optional)"
                name="contact"
                fullWidth
                placeholder="Optional for quick callback"
                value={formData.contact}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  background: "#1a1a2e",
                  py: 1.4,
                  fontSize: 15,
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: 2,
                  "&:hover": { background: "#2d2d4e" },
                }}
              >
                {loading ? "Submitting Doubt..." : "Submit Doubt to Admin"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* MY SUBMITTED DOUBTS & REPLIES */}
      <Box sx={{ mt: 5 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            My Submitted Doubts ({myDoubts.length})
          </Typography>
          <Button size="small" onClick={fetchMyDoubts} disabled={fetchingDoubts} sx={{ textTransform: "none" }}>
            {fetchingDoubts ? "Refreshing..." : "Refresh Status"}
          </Button>
        </Box>

        {myDoubts.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3, border: "1px dashed #ddd", background: "#fafafa" }}>
            <Typography variant="body2" color="text.secondary">
              You haven't submitted any doubts yet. Fill out the form above to get help.
            </Typography>
          </Paper>
        ) : (
          myDoubts.map((d) => (
            <Paper key={d._id} sx={{ p: 2.5, mb: 2, borderRadius: 3, border: "1px solid #eee" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1, flexWrap: "wrap", gap: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#1a1a2e" }}>
                  {d.subject}
                </Typography>
                {d.replied ? (
                  <Chip
                    icon={<CheckCircleOutlineIcon sx={{ fontSize: "16px !important" }} />}
                    label="Replied by Admin"
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                ) : (
                  <Chip
                    icon={<AccessTimeIcon sx={{ fontSize: "16px !important" }} />}
                    label="Pending Reply"
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                )}
              </Box>

              <Typography variant="body2" color="text.primary" sx={{ mb: 1.5, whiteSpace: "pre-wrap" }}>
                {d.message}
              </Typography>

              {d.createdAt && (
                <Typography variant="caption" color="text.secondary">
                  Submitted on {new Date(d.createdAt).toLocaleDateString()} at {new Date(d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              )}

              {d.replied && d.reply && (
                <Box sx={{ mt: 2, p: 2, borderRadius: 2, background: "#f6faf6", border: "1px solid #d4edda" }}>
                  <Typography variant="caption" fontWeight="bold" color="success.main" sx={{ display: "block", mb: 0.5 }}>
                    Admin Response:
                  </Typography>
                  <Typography variant="body2" color="text.primary" sx={{ whiteSpace: "pre-wrap" }}>
                    {d.reply}
                  </Typography>
                </Box>
              )}
            </Paper>
          ))
        )}
      </Box>

      {/* SUCCESS */}
      <Snackbar
        open={successSnackbar}
        autoHideDuration={4000}
        onClose={() => setSuccessSnackbar(false)}
      >
        <Alert severity="success">Doubt submitted successfully! Admin will review it shortly.</Alert>
      </Snackbar>

      {/* ERROR */}
      <Snackbar
        open={errorSnackbar}
        autoHideDuration={4000}
        onClose={() => setErrorSnackbar(false)}
      >
        <Alert severity="error">
          Failed to submit doubt. Please check your connection and try again.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DoubtPage;
