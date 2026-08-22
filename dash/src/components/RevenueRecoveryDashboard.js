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
import axios from "axios";
import server from "../environment";

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

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
  const [loading, setLoading] = useState(false);

  const [selectedSignal, setSelectedSignal] = useState(null);
  const [auditActions, setAuditActions] = useState([]);
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
      const res = await axios.get(`${BASE}/signals`, { ...authHeader(), params });
      setSignals(res.data);
    } catch (err) { console.error("Failed to fetch signals", err); }
  }, [statusFilter, sourceFilter]);

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

  const runAgent = async (signalId, simulateFailure = false) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE}/signals/${signalId}/process`,
        { simulateFailure },
        authHeader()
      );
      const gateDecision = res.data.actionLog.gate.decision;
      showSnack(
        simulateFailure
          ? "Simulated failure run complete — check the audit trail for the graceful-failure log."
          : `Agent decision: ${gateDecision.toUpperCase()}`,
        gateDecision === "blocked" ? "warning" : "success"
      );
      refreshAll();
      if (selectedSignal && selectedSignal._id === signalId) {
        openDetail(signalId);
      }
    } catch (err) {
      showSnack(err.response?.data?.error || "Failed to run agent", "error");
    } finally {
      setLoading(false);
    }
  };

  const approveSignal = async (signalId) => {
    try {
      await axios.post(`${BASE}/signals/${signalId}/approve`, {}, authHeader());
      showSnack("Approved — status moved to recovering.");
      refreshAll();
    } catch (err) {
      showSnack("Failed to approve", "error");
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
      `}</style>

      <Fade in timeout={500}>
        <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>

          {/* ── Page header ── */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 4 }}>
            <Box>
              <Typography sx={{ fontFamily: font, fontWeight: 800, fontSize: 11, color: "#aaa", letterSpacing: "2px", textTransform: "uppercase", mb: 0.5 }}>
                Autonomous Agent
              </Typography>
              <Typography sx={{ fontFamily: display, fontWeight: 800, fontSize: { xs: 26, sm: 32 }, color: "#1a1a2e", lineHeight: 1.1, letterSpacing: "-1px" }}>
                Revenue Recovery
              </Typography>
              <Typography sx={{ fontFamily: font, fontSize: 14, color: "#aaa", mt: 0.8 }}>
                Detects failed payments, decides a recovery action, and asks for approval when it's unsure.
              </Typography>
            </Box>
            <IconButton onClick={refreshAll} sx={{
              width: 42, height: 42, borderRadius: "13px", background: "#1a1a2e",
              "&:hover": { background: "#2d2d4e" },
            }}>
              <RefreshIcon sx={{ color: "#fff", fontSize: 20 }} />
            </IconButton>
          </Box>

          {/* ── METRICS STRIP ── */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <MetricCard label="Revenue Recovered" value={metrics ? `₹${metrics.revenueRecoveredRupees.toLocaleString()}` : "…"} tag="Total" emphasis font={font} display={display} />
            <MetricCard label="Open" value={metrics?.counts.open ?? "…"} tag="Signals" font={font} display={display} />
            <MetricCard label="Recovering" value={metrics?.counts.recovering ?? "…"} tag="In progress" font={font} display={display} />
            <MetricCard label="Recovered" value={metrics?.counts.recovered ?? "…"} tag="Resolved" font={font} display={display} />
            <MetricCard label="Escalated" value={metrics?.counts.escalated ?? "…"} tag="Needs eyes" font={font} display={display} />
            <MetricCard label="Lost" value={metrics?.counts.lost ?? "…"} tag="Closed" font={font} display={display} />
          </Grid>

          {/* ── APPROVAL QUEUE ── */}
          {approvalQueue.length > 0 && (
            <Box className="rr-card" sx={{ mb: 3, background: "#fff", border: "1px solid #1a1a2e", borderRadius: "20px", p: { xs: 3, sm: 3.5 }, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: "11px", background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <GavelIcon sx={{ color: "#fff", fontSize: 18 }} />
                </Box>
                <Typography sx={{ fontFamily: display, fontWeight: 700, fontSize: 17, color: "#1a1a2e", letterSpacing: "-0.3px" }}>
                  Needs Human Approval
                </Typography>
                <Box sx={{ px: 1.2, py: 0.3, borderRadius: "8px", background: "#1a1a2e" }}>
                  <Typography sx={{ fontFamily: font, fontWeight: 700, fontSize: 11, color: "#fff" }}>{approvalQueue.length}</Typography>
                </Box>
              </Box>
              <Typography sx={{ fontFamily: font, fontSize: 13, color: "#aaa", mb: 2, ml: "51px" }}>
                These signals were gated — the amount or rule exceeded what the agent is allowed to auto-approve.
              </Typography>

              {approvalQueue.map((s) => (
                <Box key={s._id} className="rr-row" sx={{
                  display: "flex", alignItems: "center", gap: 2, p: 1.6, mb: 1,
                  border: "1px solid #f0f0f0", borderRadius: "14px", transition: "background 0.15s ease",
                  flexWrap: "wrap",
                }}>
                  <Typography sx={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: "#1a1a2e", minWidth: 140 }}>
                    {s.customerName}
                  </Typography>
                  <Typography sx={{ fontFamily: font, fontSize: 13, color: "#555", minWidth: 100 }}>
                    ₹{(s.amount / 100).toLocaleString()}
                  </Typography>
                  <Box sx={{ px: 1.1, py: 0.3, borderRadius: "8px", background: "#f4f4f6" }}>
                    <Typography sx={{ fontFamily: font, fontSize: 11, fontWeight: 600, color: "#888" }}>{s.source}</Typography>
                  </Box>
                  <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
                    <Button size="small" onClick={() => openDetail(s._id)} sx={ghostBtnSx}>View</Button>
                    <Button size="small" variant="contained" onClick={() => approveSignal(s._id)} sx={{ ...primaryBtnSx, px: 2.2, py: 0.8 }}>
                      Approve
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* ── POLICY BOUNDS ── */}
          {policy && (
            <Box className="rr-card" sx={{ mb: 3, background: "#fff", border: "1px solid #f0f0f0", borderRadius: "20px", p: { xs: 3, sm: 3.5 }, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: "11px", background: "#f4f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <GavelIcon sx={{ color: "#1a1a2e", fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: display, fontWeight: 700, fontSize: 17, color: "#1a1a2e", letterSpacing: "-0.3px" }}>
                    Policy Bounds
                  </Typography>
                  <Typography sx={{ fontFamily: font, fontSize: 12, color: "#aaa" }}>Live-tunable guardrails for the agent</Typography>
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

          {/* ── LIVE SIGNAL FEED ── */}
          <Box className="rr-card" sx={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "20px", p: { xs: 3, sm: 3.5 }, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <Box sx={{ display: "flex", gap: 2, mb: 2.5, alignItems: "center", flexWrap: "wrap" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mr: "auto" }}>
                <Box sx={{ width: 36, height: 36, borderRadius: "11px", background: "#f4f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ReceiptLongIcon sx={{ color: "#1a1a2e", fontSize: 18 }} />
                </Box>
                <Typography sx={{ fontFamily: display, fontWeight: 700, fontSize: 17, color: "#1a1a2e", letterSpacing: "-0.3px" }}>
                  Live Signal Feed
                </Typography>
              </Box>
              <FormControl size="small" sx={{ minWidth: 140, ...inputSx }}>
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)} sx={{ borderRadius: "14px", fontFamily: font, fontSize: 13 }}>
                  <MenuItem value="">All</MenuItem>
                  {["open", "recovering", "recovered", "lost", "escalated"].map((s) => (
                    <MenuItem key={s} value={s} sx={{ fontFamily: font, fontSize: 13 }}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 170, ...inputSx }}>
                <InputLabel>Source</InputLabel>
                <Select value={sourceFilter} label="Source" onChange={(e) => setSourceFilter(e.target.value)} sx={{ borderRadius: "14px", fontFamily: font, fontSize: 13 }}>
                  <MenuItem value="">All</MenuItem>
                  {["payment_failure", "checkout_dropoff", "subscription_failure", "mandate_failure", "overdue_receivable"].map((s) => (
                    <MenuItem key={s} value={s} sx={{ fontFamily: font, fontSize: 13 }}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: "16px", border: "1px solid #f0f0f0", boxShadow: "none" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ "& th": { fontFamily: font, fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: "0.8px", textTransform: "uppercase", borderBottom: "1px solid #f0f0f0", background: "#fafafc" } }}>
                    <TableCell>Customer</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Attempts</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {signals.map((s) => (
                    <TableRow key={s._id} className="rr-row" sx={{ "& td": { fontFamily: font, fontSize: 13, color: "#333", borderBottom: "1px solid #f4f4f6" }, transition: "background 0.15s ease" }}>
                      <TableCell sx={{ fontWeight: 600, color: "#1a1a2e !important" }}>{s.customerName || "—"}</TableCell>
                      <TableCell>₹{(s.amount / 100).toLocaleString()}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "inline-block", px: 1, py: 0.25, borderRadius: "8px", background: "#f4f4f6", fontSize: 11, fontWeight: 600, color: "#888" }}>
                          {s.source}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: "#888 !important" }}>{s.failureReason}</TableCell>
                      <TableCell>{s.attempts}</TableCell>
                      <TableCell><StatusChip status={s.status} /></TableCell>
                      <TableCell align="right">
                        <Tooltip title="Run the agent on this signal">
                          <Button size="small" startIcon={<BoltIcon sx={{ fontSize: 15 }} />} onClick={() => runAgent(s._id)} disabled={loading} sx={{ ...primaryBtnSx, px: 1.4, py: 0.5, mr: 0.5 }}>
                            Run
                          </Button>
                        </Tooltip>
                        <Tooltip title="Demo the graceful-failure path (simulates a Razorpay timeout)">
                          <Button size="small" onClick={() => runAgent(s._id, true)} disabled={loading} sx={{ ...ghostBtnSx, px: 1.4, py: 0.5, mr: 0.5, border: "1px solid #e0e0e0" }}>
                            Simulate Fail
                          </Button>
                        </Tooltip>
                        <Button size="small" onClick={() => openDetail(s._id)} sx={{ ...ghostBtnSx, px: 1.4, py: 0.5 }}>Audit Trail</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {signals.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 5, border: "none" }}>
                        <CheckCircleOutlineIcon sx={{ fontSize: 40, color: "#e0e0e0", mb: 1 }} />
                        <Typography sx={{ fontFamily: font, fontSize: 14, color: "#ccc" }}>No signals yet — run the seed script.</Typography>
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
          Audit Trail — {selectedSignal?.customerName}
          <IconButton onClick={() => setDetailOpen(false)} sx={{ ml: "auto", color: "#ccc" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {selectedSignal && (
            <Box sx={{ mb: 2.5, display: "flex", gap: 3, flexWrap: "wrap", alignItems: "center" }}>
              <Typography sx={{ fontFamily: font, fontSize: 13, color: "#555" }}>
                Amount <b style={{ color: "#1a1a2e" }}>₹{(selectedSignal.amount / 100).toLocaleString()}</b>
              </Typography>
              <Typography sx={{ fontFamily: font, fontSize: 13, color: "#555" }}>
                Source <b style={{ color: "#1a1a2e" }}>{selectedSignal.source}</b>
              </Typography>
              <StatusChip status={selectedSignal.status} />
            </Box>
          )}
          <Divider sx={{ mb: 2.5, borderColor: "#f0f0f0" }} />
          {auditActions.length === 0 && (
            <Box sx={{ textAlign: "center", py: 5 }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 44, color: "#e0e0e0", mb: 1 }} />
              <Typography sx={{ fontFamily: font, fontSize: 14, color: "#ccc" }}>
                No agent runs yet for this signal — click "Run" on the feed.
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
                  Run #{i + 1}
                </Typography>
                <Typography sx={{ fontFamily: font, fontSize: 12, color: "#aaa" }}>
                  {new Date(a.createdAt).toLocaleString()}
                </Typography>
                {a.simulatedFailure && (
                  <Box sx={{ px: 1.1, py: 0.25, borderRadius: "8px", background: "#1a1a2e" }}>
                    <Typography sx={{ fontFamily: font, fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: "0.5px" }}>
                      SIMULATED FAILURE
                    </Typography>
                  </Box>
                )}
              </Box>

              <Typography sx={{ fontFamily: font, fontSize: 13, color: "#333", mb: 0.5 }}>
                <b>Reasoning (Claude):</b> {a.reasoning.explanation}
              </Typography>
              <Typography sx={{ fontFamily: font, fontSize: 12, color: "#888", mb: 1.2 }}>
                Root cause: {a.reasoning.rootCause} · Confidence: {(a.reasoning.confidence * 100).toFixed(0)}%
              </Typography>

              <Typography sx={{ fontFamily: font, fontSize: 13, color: "#333", mb: 1.2 }}>
                <b>Proposed action:</b> {a.proposedAction.type} {JSON.stringify(a.proposedAction.params)}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 0.5 }}>
                <Typography sx={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>Gate decision:</Typography>
                <GateChip decision={a.gate.decision} />
                {a.gate.ruleTriggered && (
                  <Typography sx={{ fontFamily: font, fontSize: 11, color: "#aaa" }}>rule: {a.gate.ruleTriggered}</Typography>
                )}
              </Box>
              <Typography sx={{ fontFamily: font, fontSize: 12, color: "#888" }}>{a.gate.explanation}</Typography>

              {a.execution?.attempted && (
                <Box sx={{ mt: 1.2, display: "flex", alignItems: "center", gap: 1 }}>
                  {a.execution.success
                    ? <CheckCircleIcon sx={{ fontSize: 16, color: "#1a1a2e" }} />
                    : <WarningAmberIcon sx={{ fontSize: 16, color: "#1a1a2e" }} />}
                  <Typography sx={{ fontFamily: font, fontSize: 13, color: "#333" }}>
                    Execution: {a.execution.success ? "success" : `failed — ${a.execution.error}`}
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