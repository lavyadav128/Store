// RevenueRecoveryDashboard.js
// ─────────────────────────────────────────────────────────────
// Dashboard for the Revenue Recovery agent (Razorpay Buildathon build).
// Restyled to match AdminDashboard.js's black & white visual language —
// same fonts, cards, spacing rhythm. No functional changes.
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Typography, Grid, Card, CardContent, Chip, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, TextField, MenuItem, Select, FormControl, InputLabel,
  Divider, CircularProgress, Tooltip, IconButton, Fade,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import BoltIcon from "@mui/icons-material/Bolt";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import GavelIcon from "@mui/icons-material/Gavel";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import HandshakeIcon from "@mui/icons-material/Handshake";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import axios from "axios";
import server from "../../shared/environment";

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const SOURCE_LABELS = {
  payment_failure:      "Payment Degradation",
  checkout_dropoff:     "Checkout Drop-off",
  subscription_failure: "Subscription Failed",
  overdue_receivable:   "B2B Overdue Invoice",
  mandate_failure:      "UPI Mandate Sequencer",
};

// ── Monochrome status system ──
// Every status/gate state maps to a shade of black/grey plus a
// distinguishing dot or icon, instead of MUI's success/error/warning colors.
const STATUS_STYLE = {
  open:        { bg: "#f4f4f6", fg: "#555",    dot: "#aaa" },
  recovering:  { bg: "#eef0f4", fg: "#1a1a2e", dot: "#5b5b78" },
  recovered:   { bg: "#1a1a2e", fg: "#fff",    dot: "#fff" },
  lost:        { bg: "#fff",    fg: "#999",    dot: "#ccc", border: "#e0e0e0", strike: true },
  escalated:   { bg: "#1a1a2e", fg: "#fff",    dot: "#fff", pulse: true },
};

const GATE_STYLE = {
  approved:         { bg: "#1a1a2e", fg: "#fff" },
  blocked:          { bg: "#fff", fg: "#1a1a2e", border: "#1a1a2e" },
  pending_approval: { bg: "#f4f4f6", fg: "#555" },
};

const BASE = `${server}/api/agent/revenue-recovery`;

const RevenueRecoveryDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [signals, setSignals] = useState([]);
  const [approvalQueue, setApprovalQueue] = useState([]);
  const [policy, setPolicy] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [promisedOnly, setPromisedOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const [selectedSignal, setSelectedSignal] = useState(null);
  const [auditActions, setAuditActions] = useState([]);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [selectedVoiceScript, setSelectedVoiceScript] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);

  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const showSnack = (message, severity = "success") => setSnack({ open: true, message, severity });

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE}/metrics`, authHeader());
      setMetrics(res.data);
    } catch (err) { console.error("Failed to fetch metrics", err); }
  }, []);

  const fetchSignals = useCallback(async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (sourceFilter) params.source = sourceFilter;
      if (promisedOnly) params.promisedOnly = "true";
      const res = await axios.get(`${BASE}/signals`, { ...authHeader(), params });
      setSignals(res.data);
    } catch (err) { console.error("Failed to fetch signals", err); }
  }, [statusFilter, sourceFilter, promisedOnly]);

  const fetchApprovalQueue = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE}/approval-queue`, authHeader());
      setApprovalQueue(res.data);
    } catch (err) { console.error("Failed to fetch approval queue", err); }
  }, []);

  const fetchPolicy = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE}/policy`, authHeader());
      setPolicy(res.data);
    } catch (err) { console.error("Failed to fetch policy", err); }
  }, []);

  const refreshAll = useCallback(() => {
    fetchMetrics();
    fetchSignals();
    fetchApprovalQueue();
    fetchPolicy();
  }, [fetchMetrics, fetchSignals, fetchApprovalQueue, fetchPolicy]);

  useEffect(() => { refreshAll(); }, [refreshAll]);

  const runAgent = async (signalId) => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE}/signals/${signalId}/process`, {}, authHeader());
      const gateDecision = res.data.actionLog.gate.decision;
      showSnack(`Agent execution complete — Gate: ${gateDecision.toUpperCase()}`, gateDecision === "blocked" ? "warning" : "success");
      refreshAll();
      if (selectedSignal && selectedSignal._id === signalId) {
        openDetail(signalId);
      }
    } catch (err) {
      showSnack(err.response?.data?.error || "Could not run recovery agent.", "error");
    } finally {
      setLoading(false);
    }
  };

  const approveSignal = async (signalId) => {
    try {
      const res = await axios.post(`${BASE}/signals/${signalId}/approve`, {}, authHeader());
      showSnack(`Approved — Recovery intervention issued to customer notification centre.`);
      refreshAll();
    } catch (err) {
      showSnack("Failed to approve", "error");
    }
  };

  const fulfillPromise = async (signalId) => {
    try {
      await axios.post(`${BASE}/signals/${signalId}/promise-to-pay/fulfill`, {}, authHeader());
      showSnack("Promise-to-pay marked as fulfilled & recovered! 🎉");
      refreshAll();
    } catch (err) {
      showSnack("Failed to fulfill promise", "error");
    }
  };

  const deleteSignal = async (signalId) => {
    try {
      await axios.delete(`${BASE}/signals/${signalId}`, authHeader());
      showSnack("Signal deleted successfully.");
      refreshAll();
    } catch (err) {
      showSnack("Failed to delete signal", "error");
    }
  };

  const clearAllSignals = async () => {
    if (!window.confirm("Are you sure you want to clear all recovery signals?")) return;
    try {
      await axios.delete(`${BASE}/signals`, authHeader());
      showSnack("All signals and audit trails cleared.");
      refreshAll();
    } catch (err) {
      showSnack("Failed to clear signals", "error");
    }
  };

  const seedDemoScenarios = async () => {
    setSeeding(true);
    try {
      const res = await axios.post(`${BASE}/seed-demo`, {}, authHeader());
      showSnack(`Seeded ${res.data.count} Razorpay Buildathon demo scenarios across all 5 tracks!`);
      refreshAll();
    } catch (err) {
      showSnack("Failed to seed demo signals", "error");
    } finally {
      setSeeding(false);
    }
  };

  const openDetail = async (signalId) => {
    try {
      const res = await axios.get(`${BASE}/signals/${signalId}`, authHeader());
      setSelectedSignal(res.data.signal);
      setAuditActions(res.data.actions);
      setDetailOpen(true);
    } catch (err) {
      showSnack("Failed to load audit trail", "error");
    }
  };

  const openVoiceScript = (script, customerName) => {
    setSelectedVoiceScript(script);
    setSelectedSignal((prev) => ({ ...prev, customerName }));
    setVoiceModalOpen(true);
  };

  const updatePolicyField = async (field, value) => {
    try {
      const res = await axios.patch(`${BASE}/policy`, { [field]: value }, authHeader());
      setPolicy(res.data);
      showSnack("Policy updated.");
    } catch (err) {
      showSnack("Failed to update policy", "error");
    }
  };

  const font = "'DM Sans', sans-serif";
  const display = "'Playfair Display', serif";

  const StatusChip = ({ status }) => {
    const s = STATUS_STYLE[status] || STATUS_STYLE.open;
    return (
      <Box sx={{
        display: "inline-flex", alignItems: "center", gap: 0.7,
        px: 1.3, py: 0.4, borderRadius: "30px",
        background: s.bg, border: s.border ? `1px solid ${s.border}` : "none",
      }}>
        <Box sx={{
          width: 6, height: 6, borderRadius: "50%", background: s.dot,
          animation: s.pulse ? "pulse 1.4s infinite" : "none",
        }} />
        <Typography sx={{
          fontFamily: font, fontSize: 11, fontWeight: 700, color: s.fg,
          letterSpacing: "0.3px", textTransform: "capitalize",
          textDecoration: s.strike ? "line-through" : "none",
        }}>
          {status}
        </Typography>
      </Box>
    );
  };

  const GateChip = ({ decision }) => {
    const g = GATE_STYLE[decision] || GATE_STYLE.pending_approval;
    return (
      <Box sx={{
        display: "inline-flex", alignItems: "center", px: 1.3, py: 0.35, borderRadius: "8px",
        background: g.bg, border: g.border ? `1px solid ${g.border}` : "none",
      }}>
        <Typography sx={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: g.fg, letterSpacing: "0.4px", textTransform: "uppercase" }}>
          {decision.replace("_", " ")}
        </Typography>
      </Box>
    );
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "14px", fontFamily: font, fontSize: 14,
      "& fieldset": { borderColor: "#e8e8e8" },
      "&:hover fieldset": { borderColor: "#c0c0c0" },
      "&.Mui-focused fieldset": { borderColor: "#1a1a2e" },
    },
    "& .MuiInputLabel-root": { fontFamily: font, fontSize: 14 },
    "& .MuiInputLabel-root.Mui-focused": { color: "#1a1a2e" },
  };

  const primaryBtnSx = {
    background: "#1a1a2e", borderRadius: "12px", fontFamily: font, fontWeight: 700,
    fontSize: 13, textTransform: "none", boxShadow: "none",
    "&:hover": { background: "#2d2d4e", boxShadow: "0 8px 24px rgba(26,26,46,0.25)" },
    "&:disabled": { background: "#ccc", color: "#fff" },
    transition: "all 0.2s ease",
  };

  const ghostBtnSx = {
    borderRadius: "12px", fontFamily: font, fontWeight: 700, fontSize: 13,
    textTransform: "none", color: "#555",
    "&:hover": { background: "#f4f4f6" },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        .rr-card { transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease !important; }
        .rr-card:hover { transform: translateY(-4px) !important; box-shadow: 0 18px 48px rgba(0,0,0,0.10) !important; }
        .rr-row:hover { background: #fafafc !important; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @media (max-width: 600px) {
          .rr-feed-table .MuiTableHead { display: none; }
          .rr-feed-table .MuiTable, .rr-feed-table .MuiTableBody { display: block; }
          .rr-feed-table .MuiTableRow { display: grid; grid-template-columns: 1fr 1fr; gap: 0; padding: 10px 12px; border-bottom: 1px solid #ececf0; }
          .rr-feed-table .MuiTableCell { display: flex; flex-direction: column; align-items: flex-start; gap: 3px; padding: 7px 5px !important; border: 0; min-width: 0; overflow-wrap: anywhere; }
          .rr-feed-table .MuiTableCell::before { content: attr(data-label); color: #999; font-size: 10px; font-weight: 700; letter-spacing: .55px; text-transform: uppercase; }
          .rr-feed-table .rr-actions { grid-column: 1 / -1; align-items: stretch; }
          .rr-feed-table .rr-actions > * { width: 100%; margin: 3px 0 !important; }
        }
      `}</style>

      <Fade in timeout={500}>
        <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1240, mx: "auto" }}>

          {/* ── Page header ── */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 3.5, flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <Typography sx={{ fontFamily: font, fontWeight: 800, fontSize: 11, color: "#aaa", letterSpacing: "2px", textTransform: "uppercase" }}>
                  Razorpay Buildathon Track
                </Typography>
                <Chip size="small" label="AI Revenue Recovery" sx={{ bgcolor: "#0f172a", color: "#fff", fontWeight: 700, fontSize: 10, height: 22 }} />
              </Box>
              <Typography sx={{ fontFamily: display, fontWeight: 800, fontSize: { xs: 26, sm: 34 }, color: "#1a1a2e", lineHeight: 1.1, letterSpacing: "-1px" }}>
                AI Revenue Recovery Agent
              </Typography>
              <Typography sx={{ fontFamily: font, fontSize: 14, color: "#64748b", mt: 0.8 }}>
                Autonomous bounded recovery workflow: payment failures, checkout drop-offs, subscriptions, B2B invoices & UPI mandate sequencers.
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <Button
                variant="outlined"
                startIcon={<DeleteOutlineIcon sx={{ fontSize: 17 }} />}
                onClick={clearAllSignals}
                sx={{
                  borderColor: "#e2e8f0",
                  color: "#ef4444",
                  fontFamily: font,
                  fontWeight: 700,
                  fontSize: 13,
                  borderRadius: "13px",
                  px: 2.2,
                  py: 1.1,
                  textTransform: "none",
                  "&:hover": { borderColor: "#fca5a5", bgcolor: "#fef2f2" },
                }}
              >
                Clear All Signals
              </Button>
              <IconButton onClick={refreshAll} sx={{
                width: 42, height: 42, borderRadius: "13px", background: "#1a1a2e",
                "&:hover": { background: "#2d2d4e" },
              }}>
                <RefreshIcon sx={{ color: "#fff", fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>

          {/* ── METRICS STRIP ── */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <MetricCard label="Revenue Recovered" value={metrics ? `₹${(metrics.totalRecoveredRupees ?? metrics.revenueRecoveredRupees ?? 0).toLocaleString('en-IN')}` : "…"} tag="Total Won Back" emphasis font={font} display={display} />
            <MetricCard label="Net Margin" value={metrics ? `₹${(metrics.netRecoveredMarginRupees ?? 0).toLocaleString('en-IN')}` : "…"} tag="After Discounts" font={font} display={display} />
            <MetricCard label="Active Signals" value={metrics?.counts?.open ?? "…"} tag="Open" font={font} display={display} />
            <MetricCard label="In Recovery" value={metrics?.counts?.recovering ?? "…"} tag="Automated Nudges" font={font} display={display} />
            <MetricCard label="Needs Approval" value={metrics?.counts?.escalated ?? "…"} tag="Gated Queue" font={font} display={display} />
            <MetricCard label="Resolved" value={metrics?.counts?.recovered ?? "…"} tag="Settled" font={font} display={display} />
          </Grid>

          {/* ── APPROVAL QUEUE (HUMAN-IN-THE-LOOP GOVERNANCE) ── */}
          {approvalQueue.length > 0 && (
            <Box className="rr-card" sx={{ mb: 3, background: "#fff", border: "1px solid #1a1a2e", borderRadius: "20px", p: { xs: 2.5, sm: 3.5 }, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: "11px", background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <GavelIcon sx={{ color: "#fff", fontSize: 18 }} />
                </Box>
                <Typography sx={{ fontFamily: display, fontWeight: 700, fontSize: 18, color: "#1a1a2e", letterSpacing: "-0.3px" }}>
                  Human-in-the-Loop Approval Queue
                </Typography>
                <Box sx={{ px: 1.2, py: 0.3, borderRadius: "8px", background: "#1a1a2e" }}>
                  <Typography sx={{ fontFamily: font, fontWeight: 700, fontSize: 11, color: "#fff" }}>{approvalQueue.length} Pending</Typography>
                </Box>
              </Box>
              <Typography sx={{ fontFamily: font, fontSize: 13, color: "#64748b", mb: 2, ml: "51px" }}>
                These interventions exceeded policy thresholds (auto-approve ceiling or high discount) and require explicit merchant authorization.
              </Typography>

              {approvalQueue.map((s) => (
                <Box key={s._id} className="rr-row" sx={{
                  display: "flex", alignItems: "center", gap: 2, p: 1.6, mb: 1,
                  border: "1px solid #f0f0f0", borderRadius: "14px", transition: "background 0.15s ease",
                  flexWrap: "wrap",
                }}>
                  <Typography sx={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: "#1a1a2e", minWidth: { xs: "100%", sm: 160 } }}>
                    {s.customerName || "Customer"}
                  </Typography>
                  <Typography sx={{ fontFamily: font, fontSize: 13, color: "#0f172a", fontWeight: 700, minWidth: 100 }}>
                    ₹{(s.amount / 100).toLocaleString('en-IN')}
                  </Typography>
                  <Box sx={{ px: 1.1, py: 0.3, borderRadius: "8px", background: "#f4f4f6" }}>
                    <Typography sx={{ fontFamily: font, fontSize: 11, fontWeight: 600, color: "#64748b" }}>
                      {SOURCE_LABELS[s.source] || s.source}
                    </Typography>
                  </Box>
                  <Box sx={{ ml: { xs: 0, sm: "auto" }, width: { xs: "100%", sm: "auto" }, display: "flex", gap: 1 }}>
                    <Button size="small" onClick={() => openDetail(s._id)} sx={ghostBtnSx}>Audit Trail</Button>
                    <Button size="small" variant="contained" onClick={() => approveSignal(s._id)} sx={{ ...primaryBtnSx, px: 2.2, py: 0.8 }}>
                      Authorize Action
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* ── POLICY BOUNDS (GOVERNANCE GUARDRAILS) ── */}
          {policy && (
            <Box className="rr-card" sx={{ mb: 3, background: "#fff", border: "1px solid #f0f0f0", borderRadius: "20px", p: { xs: 2.5, sm: 3.5 }, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: "11px", background: "#f4f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <GavelIcon sx={{ color: "#1a1a2e", fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: display, fontWeight: 700, fontSize: 17, color: "#1a1a2e", letterSpacing: "-0.3px" }}>
                    Policy Bounds & Hard Guardrails
                  </Typography>
                  <Typography sx={{ fontFamily: font, fontSize: 12, color: "#64748b" }}>Deterministic ceilings that the AI is hard-coded never to exceed</Typography>
                </Box>
              </Box>
              <Grid container spacing={2}>
                <PolicyField label="Max retries" value={policy.maxRetries} onSave={(v) => updatePolicyField("maxRetries", Number(v))} inputSx={inputSx} font={font} />
                <PolicyField label="Retry cooldown (min)" value={policy.retryCooldownMinutes} onSave={(v) => updatePolicyField("retryCooldownMinutes", Number(v))} inputSx={inputSx} font={font} />
                <PolicyField label="Max discount %" value={policy.maxDiscountPercent} onSave={(v) => updatePolicyField("maxDiscountPercent", Number(v))} inputSx={inputSx} font={font} />
                <PolicyField label="Auto-approve ceiling (₹)" value={policy.autoApproveMaxAmount / 100} onSave={(v) => updatePolicyField("autoApproveMaxAmount", Number(v) * 100)} inputSx={inputSx} font={font} />
              </Grid>
            </Box>
          )}

          {/* ── LIVE SIGNAL FEED & PROMISE TRACKER ── */}
          <Box className="rr-card" sx={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "20px", p: { xs: 2.5, sm: 3.5 }, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <Box sx={{ display: "flex", gap: 2, mb: 2.5, alignItems: "center", flexWrap: "wrap" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mr: "auto" }}>
                <Box sx={{ width: 36, height: 36, borderRadius: "11px", background: "#f4f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ReceiptLongIcon sx={{ color: "#1a1a2e", fontSize: 18 }} />
                </Box>
                <Typography sx={{ fontFamily: display, fontWeight: 700, fontSize: 18, color: "#1a1a2e", letterSpacing: "-0.3px" }}>
                  Omni-Channel Signal Stream
                </Typography>
              </Box>

              <Button
                size="small"
                variant={promisedOnly ? "contained" : "outlined"}
                startIcon={<HandshakeIcon sx={{ fontSize: 16 }} />}
                onClick={() => setPromisedOnly(!promisedOnly)}
                sx={{
                  borderRadius: "12px",
                  fontFamily: font,
                  fontWeight: 700,
                  fontSize: 12,
                  textTransform: "none",
                  bgcolor: promisedOnly ? "#0f172a" : "transparent",
                  color: promisedOnly ? "#fff" : "#0f172a",
                  borderColor: "#0f172a",
                  "&:hover": { bgcolor: promisedOnly ? "#1e293b" : "#f1f5f9" },
                }}
              >
                Promise-to-Pay Only
              </Button>

              {signals.length > 0 && (
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />}
                  onClick={clearAllSignals}
                  sx={{
                    borderRadius: "12px",
                    fontFamily: font,
                    fontWeight: 700,
                    fontSize: 12,
                    textTransform: "none",
                    borderColor: "#e11d48",
                    color: "#e11d48",
                    "&:hover": { bgcolor: "#ffe4e6", borderColor: "#e11d48" },
                  }}
                >
                  Clear All Signals
                </Button>
              )}

              <FormControl size="small" sx={{ minWidth: 130, ...inputSx }}>
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)} sx={{ borderRadius: "14px", fontFamily: font, fontSize: 13 }}>
                  <MenuItem value="">All Statuses</MenuItem>
                  {["open", "recovering", "recovered", "lost", "escalated"].map((s) => (
                    <MenuItem key={s} value={s} sx={{ fontFamily: font, fontSize: 13 }}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 190, ...inputSx }}>
                <InputLabel>Signal Track</InputLabel>
                <Select value={sourceFilter} label="Signal Track" onChange={(e) => setSourceFilter(e.target.value)} sx={{ borderRadius: "14px", fontFamily: font, fontSize: 13 }}>
                  <MenuItem value="">All 5 Tracks</MenuItem>
                  {Object.entries(SOURCE_LABELS).map(([k, v]) => (
                    <MenuItem key={k} value={k} sx={{ fontFamily: font, fontSize: 13 }}>{v}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <TableContainer className="rr-feed-table" component={Paper} variant="outlined" sx={{ borderRadius: "16px", border: "1px solid #f0f0f0", boxShadow: "none" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ "& th": { fontFamily: font, fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.8px", textTransform: "uppercase", borderBottom: "1px solid #f0f0f0", background: "#fafafc" } }}>
                    <TableCell>Customer / Entity</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Track & Context</TableCell>
                    <TableCell>Diagnosis</TableCell>
                    <TableCell>Commitment</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {signals.map((s) => (
                    <TableRow key={s._id} className="rr-row" sx={{ "& td": { fontFamily: font, fontSize: 13, color: "#333", borderBottom: "1px solid #f4f4f6" }, transition: "background 0.15s ease" }}>
                      <TableCell data-label="Customer" sx={{ fontWeight: 600, color: "#1a1a2e !important" }}>
                        {s.customerName || "Customer"}
                        {s.invoiceDetails?.invoiceNumber && (
                          <Typography sx={{ fontSize: 10, color: "#64748b", fontFamily: font }}>
                            Inv: {s.invoiceDetails.invoiceNumber}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell data-label="Amount" sx={{ fontWeight: 700 }}>
                        ₹{(s.amount / 100).toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell data-label="Track">
                        <Box sx={{ display: "inline-block", px: 1, py: 0.25, borderRadius: "8px", background: "#f1f5f9", fontSize: 11, fontWeight: 600, color: "#475569" }}>
                          {SOURCE_LABELS[s.source] || s.source}
                        </Box>
                        {s.mandateDetails?.optimalRetryWindow && (
                          <Typography sx={{ fontSize: 10, color: "#16a34a", fontWeight: 700, mt: 0.3 }}>
                            ⏱️ {s.mandateDetails.optimalRetryWindow}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell data-label="Diagnosis" sx={{ color: "#64748b !important", maxWidth: 220 }}>
                        {s.failureReason}
                      </TableCell>
                      <TableCell data-label="Commitment">
                        {s.promiseToPay?.promised ? (
                          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                            <Chip
                              size="small"
                              label={s.promiseToPay.fulfilled ? "Fulfilled ✅" : `Due: ${new Date(s.promiseToPay.promisedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`}
                              sx={{
                                bgcolor: s.promiseToPay.fulfilled ? "#16a34a" : "#0f172a",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: 10,
                                height: 22,
                              }}
                            />
                            {!s.promiseToPay.fulfilled && (
                              <Tooltip title="Mark Promise as Fulfilled">
                                <IconButton size="small" onClick={() => fulfillPromise(s._id)}>
                                  <CheckCircleIcon sx={{ fontSize: 16, color: "#16a34a" }} />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        ) : (
                          <Typography sx={{ fontSize: 11, color: "#cbd5e1" }}>None</Typography>
                        )}
                      </TableCell>
                      <TableCell data-label="Status"><StatusChip status={s.status} /></TableCell>
                      <TableCell data-label="Actions" className="rr-actions" align="right">
                        <Tooltip title="Run AI Diagnostic & Bounded Execution">
                          <Button size="small" startIcon={<BoltIcon sx={{ fontSize: 15 }} />} onClick={() => runAgent(s._id)} disabled={loading} sx={{ ...primaryBtnSx, px: 1.4, py: 0.5, mr: 0.5 }}>
                            Execute
                          </Button>
                        </Tooltip>
                        <Tooltip title="View Hinglish Voice Script">
                          <IconButton size="small" onClick={() => openVoiceScript(s.voiceScript, s.customerName)} sx={{ mr: 0.5 }}>
                            <RecordVoiceOverIcon sx={{ fontSize: 17, color: "#0f172a" }} />
                          </IconButton>
                        </Tooltip>
                        <Button size="small" onClick={() => openDetail(s._id)} sx={{ ...ghostBtnSx, px: 1.2, py: 0.5, mr: 0.5 }}>Audit</Button>
                        <Tooltip title="Delete Signal">
                          <IconButton size="small" onClick={() => deleteSignal(s._id)} sx={{ color: "#ef4444", "&:hover": { bgcolor: "#fee2e2" } }}>
                            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {signals.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6, border: "none" }}>
                        <CheckCircleOutlineIcon sx={{ fontSize: 44, color: "#e2e8f0", mb: 1 }} />
                        <Typography sx={{ fontFamily: font, fontSize: 14, color: "#94a3b8" }}>
                          No active signals in this filter view. Click "Seed 5-Track Demo" above to generate realistic test scenarios.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Fade>

      {/* ── AUDIT TRAIL MODAL ── */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: "20px", fontFamily: font, boxShadow: "0 32px 80px rgba(0,0,0,0.15)" } }}>
        <DialogTitle sx={{
          fontFamily: display, fontWeight: 800, fontSize: 20, color: "#1a1a2e",
          pb: 1.5, borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 1.5,
        }}>
          <Box sx={{ width: 36, height: 36, borderRadius: "11px", background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <ReceiptLongIcon sx={{ color: "#fff", fontSize: 18 }} />
          </Box>
          Audit Trail & Reasoning Chain — {selectedSignal?.customerName}
          <IconButton onClick={() => setDetailOpen(false)} sx={{ ml: "auto", color: "#ccc" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {selectedSignal && (
            <Box sx={{ mb: 2.5, display: "flex", gap: 3, flexWrap: "wrap", alignItems: "center" }}>
              <Typography sx={{ fontFamily: font, fontSize: 13, color: "#555" }}>
                Amount: <b style={{ color: "#1a1a2e" }}>₹{(selectedSignal.amount / 100).toLocaleString('en-IN')}</b>
              </Typography>
              <Typography sx={{ fontFamily: font, fontSize: 13, color: "#555" }}>
                Track: <b style={{ color: "#1a1a2e" }}>{SOURCE_LABELS[selectedSignal.source] || selectedSignal.source}</b>
              </Typography>
              <StatusChip status={selectedSignal.status} />
              {selectedSignal.promiseToPay?.promised && (
                <Chip
                  size="small"
                  label={`Promise: ${new Date(selectedSignal.promiseToPay.promisedDate).toLocaleDateString('en-IN')}`}
                  sx={{ bgcolor: "#0f172a", color: "#fff", fontWeight: 700, fontSize: 11 }}
                />
              )}
            </Box>
          )}

          {selectedSignal?.voiceScript && (
            <Paper elevation={0} sx={{ p: 2, mb: 2.5, borderRadius: "14px", bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <Typography sx={{ fontFamily: font, fontWeight: 700, fontSize: 12, color: "#0f172a", mb: 0.5, display: "flex", alignItems: "center", gap: 1 }}>
                <RecordVoiceOverIcon sx={{ fontSize: 16 }} /> Bilingual IVR Voice Script (Indian Context):
              </Typography>
              <Typography sx={{ fontFamily: font, fontSize: 13, color: "#334155", fontStyle: "italic", whiteSpace: "pre-line" }}>
                {selectedSignal.voiceScript}
              </Typography>
            </Paper>
          )}

          <Divider sx={{ mb: 2.5, borderColor: "#f0f0f0" }} />

          {auditActions.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 40, color: "#cbd5e1", mb: 1 }} />
              <Typography sx={{ fontFamily: font, fontSize: 14, color: "#94a3b8" }}>
                No executions recorded yet. Click "Execute" on the feed to run the autonomous reasoning loop.
              </Typography>
            </Box>
          )}

          {auditActions.map((a, i) => (
            <Box key={a._id} sx={{
              mb: 2, p: 2.5, background: "#fff",
              border: `1px solid ${a.simulatedFailure ? "#1a1a2e" : "#f0f0f0"}`,
              borderRadius: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5, flexWrap: "wrap" }}>
                <Typography sx={{ fontFamily: font, fontWeight: 700, fontSize: 13, color: "#1a1a2e" }}>
                  Execution Step #{i + 1}
                </Typography>
                <Typography sx={{ fontFamily: font, fontSize: 12, color: "#aaa" }}>
                  {new Date(a.createdAt).toLocaleString()}
                </Typography>
              </Box>

              <Typography sx={{ fontFamily: font, fontSize: 13, color: "#333", mb: 0.5 }}>
                <b>AI Diagnosis & Reasoning:</b> {a.reasoning.explanation}
              </Typography>
              <Typography sx={{ fontFamily: font, fontSize: 12, color: "#888", mb: 1.2 }}>
                Root cause: <code>{a.reasoning.rootCause}</code> · Confidence: {(a.reasoning.confidence * 100).toFixed(0)}% · Model: {a.reasoning.model || 'groq:llama-3.3-70b'}
              </Typography>

              <Typography sx={{ fontFamily: font, fontSize: 13, color: "#333", mb: 1.2 }}>
                <b>Proposed Intervention:</b> <code>{a.proposedAction.type}</code> {JSON.stringify(a.proposedAction.params)}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 0.5 }}>
                <Typography sx={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>Policy Gate Decision:</Typography>
                <GateChip decision={a.gate.decision} />
                {a.gate.ruleTriggered && (
                  <Typography sx={{ fontFamily: font, fontSize: 11, color: "#aaa" }}>rule: {a.gate.ruleTriggered}</Typography>
                )}
              </Box>
              <Typography sx={{ fontFamily: font, fontSize: 12, color: "#888" }}>{a.gate.explanation}</Typography>

              {a.execution?.attempted && (
                <Box sx={{ mt: 1.2, display: "flex", alignItems: "center", gap: 1 }}>
                  {a.execution.success
                    ? <CheckCircleIcon sx={{ fontSize: 16, color: "#16a34a" }} />
                    : <WarningAmberIcon sx={{ fontSize: 16, color: "#e11d48" }} />}
                  <Typography sx={{ fontFamily: font, fontSize: 13, color: "#333" }}>
                    Execution: {a.execution.success ? "Success" : `Failed — ${a.execution.error}`}
                  </Typography>
                </Box>
              )}
            </Box>
          ))}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDetailOpen(false)} sx={ghostBtnSx}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ── VOICE SCRIPT PREVIEW MODAL ── */}
      <Dialog open={voiceModalOpen} onClose={() => setVoiceModalOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: "20px", fontFamily: font, p: 1 } }}>
        <DialogTitle sx={{ fontFamily: display, fontWeight: 800, fontSize: 18, color: "#0f172a", display: "flex", alignItems: "center", gap: 1 }}>
          <RecordVoiceOverIcon sx={{ color: "#0f172a" }} />
          Bilingual IVR Voice Script Preview
        </DialogTitle>
        <DialogContent dividers sx={{ py: 2.5 }}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <Typography sx={{ fontFamily: font, fontSize: 13.5, color: "#1e293b", lineHeight: 1.7, whiteSpace: "pre-line" }}>
              {selectedVoiceScript || "No script generated yet."}
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVoiceModalOpen(false)} sx={ghostBtnSx}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert
          icon={false}
          sx={{
            fontFamily: font, borderRadius: "12px", fontSize: 13, fontWeight: 600,
            background: "#1a1a2e", color: "#fff",
            border: snack.severity === "error" || snack.severity === "warning" ? "1px solid #fff" : "none",
            "& .MuiAlert-message": { fontFamily: font },
          }}
        >
          {snack.message}
        </Alert>
      </Snackbar>

      {loading && (
        <Box sx={{
          position: "fixed", bottom: 24, right: 24, width: 44, height: 44, borderRadius: "50%",
          background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
        }}>
          <CircularProgress size={20} sx={{ color: "#fff" }} />
        </Box>
      )}
    </>
  );
};

const MetricCard = ({ label, value, tag, emphasis, font, display }) => (
  <Grid item xs={6} md={2}>
    <Box className="rr-card" sx={{
      background: emphasis ? "#1a1a2e" : "#fff",
      border: emphasis ? "1px solid #1a1a2e" : "1px solid #f0f0f0",
      borderRadius: "16px", p: 2.2, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", height: "100%",
    }}>
      <Typography sx={{
        fontFamily: font, fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", mb: 0.5,
        color: emphasis ? "rgba(255,255,255,0.5)" : "#ccc",
      }}>
        {tag}
      </Typography>
      <Typography sx={{
        fontFamily: display, fontWeight: 800, fontSize: 22, lineHeight: 1.15,
        color: emphasis ? "#fff" : "#1a1a2e",
      }}>
        {value}
      </Typography>
      <Typography sx={{
        fontFamily: font, fontSize: 12, mt: 0.5,
        color: emphasis ? "rgba(255,255,255,0.7)" : "#aaa",
      }}>
        {label}
      </Typography>
    </Box>
  </Grid>
);

const PolicyField = ({ label, value, onSave, inputSx, font }) => {
  const [local, setLocal] = useState(value);
  useEffect(() => setLocal(value), [value]);
  return (
    <Grid item xs={6} md={3}>
      <TextField
        label={label}
        type="number"
        size="small"
        fullWidth
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => { if (Number(local) !== value) onSave(local); }}
        sx={inputSx}
      />
    </Grid>
  );
};

export default RevenueRecoveryDashboard;
