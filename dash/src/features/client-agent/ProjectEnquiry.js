import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
  Chip,
  Fade,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SendIcon from "@mui/icons-material/Send";
import { useParams } from "react-router-dom";
import server from "../../shared/environment";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#ffffff",
  },
  "& .MuiInputLabel-root": {
    fontFamily: "'DM Sans', sans-serif",
  },
};

export default function ProjectEnquiry() {
  const { slug } = useParams();
  const [info, setInfo] = useState({
    businessName: "Project Studio",
    services: ["Websites", "Web apps", "AI automation"],
  });
  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    clientType: "",
    requirement: "",
    budget: "",
    deadline: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  useEffect(() => {
    fetch(`${server}/api/client-agent/public/enquiry/${slug || "project-enquiry"}`)
      .then(async (res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (data && data.businessName) {
          setInfo(data);
        }
      })
      .catch(() => {
        // Safe default fallback
      });
  }, [slug]);

  const set = (key, value) => setForm((old) => ({ ...old, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${server}/api/client-agent/public/enquiry/${slug || "project-enquiry"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Failed to submit enquiry.");

      setSubmitted(true);
      setMessage(body.message || "Thank you! Your project requirements have been received.");
      setMessageType("success");
    } catch (error) {
      setMessage(error.message || "Could not send the enquiry. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: 2, sm: 4, md: 6 },
        background: "linear-gradient(180deg, #f8f9fa 0%, #edf0f5 100%)",
        display: "grid",
        placeItems: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 780,
          p: { xs: 3, sm: 5 },
          borderRadius: "24px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
          backgroundColor: "#ffffff",
        }}
      >
        {submitted ? (
          <Fade in timeout={500}>
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CheckCircleIcon sx={{ fontSize: 68, color: "#16a34a", mb: 2 }} />
              <Typography
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: { xs: 26, sm: 32 },
                  fontWeight: 800,
                  color: "#0f172a",
                  mb: 1.5,
                }}
              >
                Enquiry Submitted Successfully!
              </Typography>
              <Typography sx={{ color: "#475569", fontSize: 15, maxWidth: 540, mx: "auto", mb: 3 }}>
                Our autonomous AI agent and engineering team have received your project details. We will analyze your requirements and reach out with a detailed proposal and live prototype soon.
              </Typography>
              <Chip
                label="Status: Under Review by Studio Admin"
                sx={{
                  bgcolor: "#f1f5f9",
                  fontWeight: 700,
                  color: "#0f172a",
                  px: 1.5,
                  py: 2,
                }}
              />
            </Box>
          </Fade>
        ) : (
          <form onSubmit={submit}>
            <Box sx={{ mb: 3.5 }}>
              <Typography
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: { xs: 28, sm: 36 },
                  fontWeight: 800,
                  color: "#0f172a",
                  letterSpacing: "-0.5px",
                }}
              >
                {info?.businessName || "Project Studio"}
              </Typography>
              <Typography sx={{ color: "#64748b", mt: 1, fontSize: 14.5, lineHeight: 1.6 }}>
                Submit your project requirements below. Our autonomous AI engineering team will structure your roadmap, design interactive mockups, and prepare your project proposal.
              </Typography>
            </Box>

            {message && (
              <Alert severity={messageType} sx={{ mb: 3, borderRadius: "12px" }}>
                {message}
              </Alert>
            )}

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.2 }}>
              <TextField
                required
                label="Business / Organisation Name"
                placeholder="e.g. Acme Innovations"
                value={form.businessName}
                onChange={(e) => set("businessName", e.target.value)}
                sx={fieldSx}
              />
              <TextField
                label="Contact Person Name"
                placeholder="e.g. John Doe"
                value={form.contactName}
                onChange={(e) => set("contactName", e.target.value)}
                sx={fieldSx}
              />
              <TextField
                required
                label="Work Email"
                type="email"
                placeholder="contact@yourcompany.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                sx={fieldSx}
              />
              <TextField
                label="Phone / WhatsApp Number"
                placeholder="+91 9876543210"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                sx={fieldSx}
              />
              <TextField
                label="Current Website / Reference (Optional)"
                placeholder="https://example.com"
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
                sx={fieldSx}
              />
              <TextField
                label="Project Type"
                placeholder="Website, SaaS Web App, AI Automation, Mobile App…"
                value={form.clientType}
                onChange={(e) => set("clientType", e.target.value)}
                sx={fieldSx}
              />
              <TextField
                required
                multiline
                minRows={5}
                label="Detailed Project Requirements"
                placeholder="Describe your goals, key features, target audience, preferred technologies, or existing systems to integrate…"
                value={form.requirement}
                onChange={(e) => set("requirement", e.target.value)}
                sx={{ ...fieldSx, gridColumn: { sm: "span 2" } }}
              />
              <TextField
                label="Target Budget (₹ INR)"
                type="number"
                placeholder="e.g. 25000"
                value={form.budget}
                onChange={(e) => set("budget", e.target.value)}
                sx={fieldSx}
              />
              <TextField
                label="Target Launch Deadline"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={form.deadline}
                onChange={(e) => set("deadline", e.target.value)}
                sx={fieldSx}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
              sx={{
                mt: 3.5,
                width: "100%",
                py: 1.5,
                borderRadius: "12px",
                bgcolor: "#0f172a",
                color: "#ffffff",
                textTransform: "none",
                fontSize: 15,
                fontWeight: 700,
                boxShadow: "0 4px 14px rgba(15, 23, 42, 0.2)",
                "&:hover": {
                  bgcolor: "#1e293b",
                },
              }}
            >
              {loading ? "Submitting Requirements…" : "Submit Project Requirements"}
            </Button>
          </form>
        )}
      </Paper>
    </Box>
  );
}
