import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LaunchIcon from "@mui/icons-material/Launch";
import CodeIcon from "@mui/icons-material/Code";
import DownloadIcon from "@mui/icons-material/Download";
import server from "../../shared/environment";

function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export default function ProjectPayment() {
  const { code } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const load = async () => {
    if (!code) {
      setMessage("Payment code is missing in the URL. Please use a valid payment link.");
      setMessageType("error");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${server}/api/client-agent/public/payment/${code}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Payment link is unavailable or expired.");
      setProject(body);
    } catch (e) {
      setMessage(e.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [code]);

  const pay = async () => {
    try {
      setPaying(true);
      await loadRazorpay();

      const res = await fetch(`${server}/api/client-agent/public/payment/${code}/create-order`, {
        method: "POST",
      });
      const order = await res.json();
      if (!res.ok) throw new Error(order.error || "Failed to initialize payment.");

      const options = {
        key: order.key,
        amount: order.amount, // in paise
        currency: order.currency || "INR",
        name: "Project Studio",
        description: order.title,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${server}/api/client-agent/public/payment/${code}/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const done = await verifyRes.json();
            if (!verifyRes.ok) {
              setMessage(done.error || "Payment verification failed.");
              setMessageType("error");
              return;
            }

            setMessage(done.message || "Payment verified successfully! Deliverables unlocked.");
            setMessageType("success");
            await load();
          } catch (verErr) {
            setMessage(verErr.message);
            setMessageType("error");
          }
        },
        modal: {
          ondismiss: async () => {
            fetch(`${server}/api/client-agent/public/payment/${code}/record-failure`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                error: { description: "User closed checkout modal without completing payment" },
                razorpay_order_id: order.id,
              }),
            }).catch(() => {});
          },
        },
        theme: {
          color: "#1a1a2e",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on("payment.failed", async (failedRes) => {
        const errorMsg = failedRes.error?.description || "Transaction cancelled or declined.";
        setMessage(`Payment failed: ${errorMsg}`);
        setMessageType("error");

        // Forward to Revenue Recovery Agent
        fetch(`${server}/api/client-agent/public/payment/${code}/record-failure`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            error: failedRes.error,
            razorpay_order_id: order.id,
            razorpay_payment_id: failedRes.error?.metadata?.payment_id,
          }),
        }).catch(() => {});
      });
      razorpayInstance.open();
    } catch (e) {
      setMessage(e.message || "Could not open secure checkout.");
      setMessageType("error");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", bgcolor: "#f8f9fa" }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={36} sx={{ color: "#1a1a2e" }} />
          <Typography sx={{ mt: 2, fontFamily: "'DM Sans', sans-serif" }}>Loading secure project portal…</Typography>
        </Box>
      </Box>
    );
  }

  const isDelivered = project && ["paid", "delivered"].includes(project.status);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa", display: "grid", placeItems: "center", p: { xs: 2, sm: 4 } }}>
      <Paper
        sx={{
          width: "100%",
          maxWidth: 760,
          p: { xs: 3, sm: 5 },
          borderRadius: "24px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
          border: "1px solid #f0f0f0",
          bgcolor: "#ffffff",
        }}
      >
        {/* Header Badge */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1, mb: 2 }}>
          <Chip
            icon={<LockIcon sx={{ fontSize: 14 }} />}
            label="Razorpay Secure Portal"
            size="small"
            sx={{ bgcolor: "#f1f1f4", color: "#1a1a2e", fontWeight: 700 }}
          />
          {project && (
            <Typography sx={{ fontSize: 12, color: "#888", fontWeight: 600 }}>
              Project Code: <strong>{project.projectCode}</strong>
            </Typography>
          )}
        </Box>

        <Typography
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 800,
            fontSize: { xs: 24, sm: 30 },
            color: "#1a1a2e",
          }}
        >
          {isDelivered ? "Project Delivery & Deliverables" : "Secure Project Payment"}
        </Typography>

        {message && (
          <Alert sx={{ mt: 2.5, borderRadius: "12px" }} severity={messageType}>
            {message}
          </Alert>
        )}

        {project && (
          <Box sx={{ mt: 3 }}>
            {/* Unlocked Delivery Section (When Paid) */}
            {isDelivered ? (
              <Box>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    bgcolor: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <CheckCircleIcon sx={{ color: "#16a34a", fontSize: 32 }} />
                    <Box>
                      <Typography sx={{ fontWeight: 800, color: "#166534", fontSize: 17 }}>
                        Payment Verified & Deliverables Unlocked
                      </Typography>
                      <Typography sx={{ fontSize: 13, color: "#15803d" }}>
                        Thank you for your payment! Your project is complete, tested, and ready to use below.
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Typography sx={{ fontWeight: 800, fontSize: 19, color: "#1a1a2e", mb: 1.5 }}>
                  {project.title}
                </Typography>

                {/* Embedded Live Preview */}
                <Box sx={{ mb: 3, border: "1px solid #e2e8f0", borderRadius: "14px", overflow: "hidden", height: 320, bgcolor: "#fff" }}>
                  <Box sx={{ px: 2, py: 1, bgcolor: "#f8fafc", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#ef4444" }} />
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#f59e0b" }} />
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#10b981" }} />
                    <Typography sx={{ fontSize: 11, color: "#64748b", fontFamily: "monospace", ml: 1 }}>
                      Live Interactive Application Preview
                    </Typography>
                  </Box>
                  <iframe
                    src={`${server}/api/client-agent/public/preview/${project.projectCode}`}
                    title="Live App Preview"
                    style={{ width: "100%", height: "calc(100% - 33px)", border: "none" }}
                  />
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<LaunchIcon />}
                    href={`${server}/api/client-agent/public/preview/${project.projectCode}`}
                    target="_blank"
                    sx={{
                      py: 1.5,
                      borderRadius: "12px",
                      bgcolor: "#1a1a2e",
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    Open Live App in Full Tab
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    href={`${server}/api/client-agent/public/download/${project.projectCode}`}
                    target="_blank"
                    sx={{
                      py: 1.5,
                      borderRadius: "12px",
                      bgcolor: "#4338ca",
                      "&:hover": { bgcolor: "#3730a3" },
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    Download Source Code (.zip)
                  </Button>
                </Box>

                {project.repositoryUrl && !project.repositoryUrl.includes("/download/") && (
                  <Button
                    variant="outlined"
                    startIcon={<CodeIcon />}
                    href={project.repositoryUrl}
                    target="_blank"
                    fullWidth
                    sx={{
                      mt: 1.5,
                      py: 1.3,
                      borderRadius: "12px",
                      borderColor: "#1a1a2e",
                      color: "#1a1a2e",
                      textTransform: "none",
                      fontWeight: 700,
                    }}
                  >
                    Access GitHub Code Repository
                  </Button>
                )}

                {project.testSummary && (
                  <Box sx={{ mt: 3, p: 2.5, bgcolor: "#f8f9fa", borderRadius: "14px", border: "1px solid #eee" }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#166534", mb: 1 }}>
                      Verified Quality & QA Summary:
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "#333", whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
                      {project.testSummary}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography sx={{ fontSize: 13, color: "#777" }}>
                    Paid Amount: <strong>₹{Number(project.amount).toLocaleString()}</strong>
                  </Typography>
                  <Chip label="Status: Delivered & Verified" size="small" sx={{ bgcolor: "#166534", color: "#fff", fontWeight: 700 }} />
                </Box>
              </Box>
            ) : (
              /* Payment Checkout View (When Unpaid) */
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: 18, color: "#1a1a2e" }}>
                  {project.title}
                </Typography>

                <Box
                  sx={{
                    my: 2.5,
                    p: 2.5,
                    borderRadius: "14px",
                    bgcolor: "#f8f9fa",
                    borderLeft: "4px solid #1a1a2e",
                  }}
                >
                  <Typography sx={{ fontSize: 12, color: "#888", textTransform: "uppercase", fontWeight: 700 }}>
                    Total Amount Due
                  </Typography>
                  <Typography sx={{ fontSize: 32, fontWeight: 800, color: "#1a1a2e", mt: 0.5 }}>
                    ₹{Number(project.amount).toLocaleString()}
                  </Typography>
                </Box>

                {project.scope && (
                  <Box sx={{ mb: 3 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#555", mb: 0.5 }}>
                      Approved Project Scope & Deliverables:
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: "#444",
                        whiteSpace: "pre-wrap",
                        maxHeight: 180,
                        overflowY: "auto",
                        p: 1.5,
                        bgcolor: "#fafafa",
                        borderRadius: "10px",
                        border: "1px solid #eee",
                      }}
                    >
                      {project.scope}
                    </Typography>
                  </Box>
                )}

                <Button
                  onClick={pay}
                  disabled={paying || project.status !== "payment_requested"}
                  variant="contained"
                  fullWidth
                  sx={{
                    py: 1.8,
                    borderRadius: "14px",
                    bgcolor: "#1a1a2e",
                    textTransform: "none",
                    fontWeight: 800,
                    fontSize: 16,
                    "&:hover": { bgcolor: "#2d2d4e" },
                  }}
                >
                  {paying ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : `Pay ₹${Number(project.amount).toLocaleString()} Securely with Razorpay`}
                </Button>

                <Typography sx={{ textAlign: "center", fontSize: 12, color: "#999", mt: 2 }}>
                  🔒 Payments are secured with Razorpay 256-bit encryption. Project deliverables & source code (.zip) unlock immediately upon verification.
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
