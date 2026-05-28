


import React, { useState, useContext } from "react";
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
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { makeAuthenticatedRequest } from "./makeauth";
import server from "../environment";
import { AuthContext } from "../contexts/AuthContext";

const DoubtPage = () => {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    contact: "",
  });

  const [loading, setLoading] = useState(false);
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const auth = useContext(AuthContext);

  // ✅ SAFE USERNAME FETCH (FIX)
  const username =
    auth?.getUsername?.() ||
    localStorage.getItem("username") ||
    "";

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ BLOCK BAD REQUEST
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
    <Box sx={{ px: isMobile ? 2 : 4, py: 3 }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        align="center"
        gutterBottom
        fontWeight="bold"
      >
        <HelpOutlineIcon sx={{ mr: 1 }} />
        Ask a Doubt
      </Typography>

      <Paper
        elevation={4}
        sx={{
          maxWidth: 600,
          mx: "auto",
          p: isMobile ? 2 : 4,
          mt: 4,
          borderRadius: 3,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={isMobile ? 2 : 3}>
            <Grid item xs={12}>
              <TextField
                label="Subject"
                name="subject"
                fullWidth
                required
                value={formData.subject}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Your Doubt / Issue"
                name="message"
                multiline
                rows={4}
                fullWidth
                required
                value={formData.message}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Your Email or Phone (optional)"
                name="contact"
                fullWidth
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
              >
                {loading ? "Submitting..." : "Submit Doubt"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* SUCCESS */}
      <Snackbar
        open={successSnackbar}
        autoHideDuration={4000}
        onClose={() => setSuccessSnackbar(false)}
      >
        <Alert severity="success">Doubt submitted successfully!</Alert>
      </Snackbar>

      {/* ERROR */}
      <Snackbar
        open={errorSnackbar}
        autoHideDuration={4000}
        onClose={() => setErrorSnackbar(false)}
      >
        <Alert severity="error">
          Failed to submit doubt. Please try again.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DoubtPage;
