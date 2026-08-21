// RevenueRecoveryDashboard.js
// ─────────────────────────────────────────────────────────────
// Dashboard for the Revenue Recovery agent (Razorpay Buildathon build).
// Same conventions as AdminDashboard.js: MUI components, `server` from
// environment.js, Bearer token auth from localStorage.
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Typography, Grid, Card, CardContent, Chip, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, TextField, MenuItem, Select, FormControl, InputLabel,
  Divider, CircularProgress, Tooltip, IconButton,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import BoltIcon from "@mui/icons-material/Bolt";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import server from "../environment";

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const STATUS_COLORS = {
  open: "default",
  recovering: "info",
  recovered: "success",
  lost: "error",
  escalated: "warning",
};

const GATE_COLORS = {
  approved: "success",
  blocked: "error",
  pending_approval: "warning",
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

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          🤖 AI Revenue Recovery Agent
        </Typography>
        <IconButton onClick={refreshAll}><RefreshIcon /></IconButton>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <MetricCard label="Revenue Recovered" value={metrics ? `₹${metrics.revenueRecoveredRupees.toLocaleString()}` : "…"} color="success.main" />
        <MetricCard label="Open" value={metrics?.counts.open ?? "…"} />
        <MetricCard label="Recovering" value={metrics?.counts.recovering ?? "…"} color="info.main" />
        <MetricCard label="Recovered" value={metrics?.counts.recovered ?? "…"} color="success.main" />
        <MetricCard label="Escalated" value={metrics?.counts.escalated ?? "…"} color="warning.main" />
        <MetricCard label="Lost" value={metrics?.counts.lost ?? "…"} color="error.main" />
      </Grid>

      {approvalQueue.length > 0 && (
        <Card sx={{ mb: 3, border: "1px solid", borderColor: "warning.main" }}>
          <CardContent>
            <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <WarningAmberIcon color="warning" /> Needs Human Approval ({approvalQueue.length})
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              These signals were gated — the amount or rule exceeded what the agent is allowed to auto-approve.
            </Typography>
            <Table size="small">
              <TableBody>
                {approvalQueue.map((s) => (
                  <TableRow key={s._id}>
                    <TableCell>{s.customerName}</TableCell>
                    <TableCell>₹{(s.amount / 100).toLocaleString()}</TableCell>
                    <TableCell>{s.source}</TableCell>
                    <TableCell align="right">
                      <Button size="small" onClick={() => openDetail(s._id)}>View</Button>
                      <Button size="small" variant="contained" color="warning" onClick={() => approveSignal(s._id)}>
                        Approve
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {policy && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>⚖️ Policy Bounds (live-tunable)</Typography>
            <Grid container spacing={2}>
              <PolicyField label="Max retries" value={policy.maxRetries} onSave={(v) => updatePolicyField("maxRetries", Number(v))} />
              <PolicyField label="Retry cooldown (min)" value={policy.retryCooldownMinutes} onSave={(v) => updatePolicyField("retryCooldownMinutes", Number(v))} />
              <PolicyField label="Max discount %" value={policy.maxDiscountPercent} onSave={(v) => updatePolicyField("maxDiscountPercent", Number(v))} />
              <PolicyField label="Auto-approve ceiling (₹)" value={policy.autoApproveMaxAmount / 100} onSave={(v) => updatePolicyField("autoApproveMaxAmount", Number(v) * 100)} />
            </Grid>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
            <Typography variant="h6">Live Signal Feed</Typography>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                {["open", "recovering", "recovered", "lost", "escalated"].map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Source</InputLabel>
              <Select value={sourceFilter} label="Source" onChange={(e) => setSourceFilter(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                {["payment_failure", "checkout_dropoff", "subscription_failure", "mandate_failure", "overdue_receivable"].map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
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
                  <TableRow key={s._id} hover>
                    <TableCell>{s.customerName || "—"}</TableCell>
                    <TableCell>₹{(s.amount / 100).toLocaleString()}</TableCell>
                    <TableCell>{s.source}</TableCell>
                    <TableCell>{s.failureReason}</TableCell>
                    <TableCell>{s.attempts}</TableCell>
                    <TableCell>
                      <Chip size="small" label={s.status} color={STATUS_COLORS[s.status] || "default"} />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Run the agent on this signal">
                        <Button size="small" startIcon={<BoltIcon />} onClick={() => runAgent(s._id)} disabled={loading}>
                          Run
                        </Button>
                      </Tooltip>
                      <Tooltip title="Demo the graceful-failure path (simulates a Razorpay timeout)">
                        <Button size="small" color="error" onClick={() => runAgent(s._id, true)} disabled={loading}>
                          Simulate Fail
                        </Button>
                      </Tooltip>
                      <Button size="small" onClick={() => openDetail(s._id)}>Audit Trail</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {signals.length === 0 && (
                  <TableRow><TableCell colSpan={7} align="center">No signals yet — run the seed script.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Audit Trail — {selectedSignal?.customerName}</DialogTitle>
        <DialogContent dividers>
          {selectedSignal && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2">Amount: ₹{(selectedSignal.amount / 100).toLocaleString()}</Typography>
              <Typography variant="body2">Source: {selectedSignal.source}</Typography>
              <Typography variant="body2">Status: <Chip size="small" label={selectedSignal.status} color={STATUS_COLORS[selectedSignal.status]} /></Typography>
            </Box>
          )}
          <Divider sx={{ mb: 2 }} />
          {auditActions.length === 0 && (
            <Typography color="text.secondary">No agent runs yet for this signal — click "Run" on the feed.</Typography>
          )}
          {auditActions.map((a, i) => (
            <Card key={a._id} variant="outlined" sx={{ mb: 2, borderColor: a.simulatedFailure ? "error.main" : undefined }}>
              <CardContent>
                <Typography variant="subtitle2">
                  Run #{i + 1} — {new Date(a.createdAt).toLocaleString()}
                  {a.simulatedFailure && <Chip size="small" label="SIMULATED FAILURE" color="error" sx={{ ml: 1 }} />}
                </Typography>

                <Typography variant="body2" sx={{ mt: 1 }}><b>Reasoning (Claude):</b> {a.reasoning.explanation}</Typography>
                <Typography variant="body2">Root cause: {a.reasoning.rootCause} · Confidence: {(a.reasoning.confidence * 100).toFixed(0)}%</Typography>

                <Typography variant="body2" sx={{ mt: 1 }}><b>Proposed action:</b> {a.proposedAction.type} {JSON.stringify(a.proposedAction.params)}</Typography>

                <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
                  <b>Gate decision:</b>
                  <Chip size="small" label={a.gate.decision} color={GATE_COLORS[a.gate.decision]} />
                  {a.gate.ruleTriggered && <Typography variant="caption">rule: {a.gate.ruleTriggered}</Typography>}
                </Box>
                <Typography variant="body2" color="text.secondary">{a.gate.explanation}</Typography>

                {a.execution?.attempted && (
                  <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
                    {a.execution.success
                      ? <CheckCircleIcon color="success" fontSize="small" />
                      : <WarningAmberIcon color="error" fontSize="small" />}
                    <Typography variant="body2">
                      Execution: {a.execution.success ? "success" : `failed — ${a.execution.error}`}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>

      {loading && (
        <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
          <CircularProgress size={28} />
        </Box>
      )}
    </Box>
  );
};

const MetricCard = ({ label, value, color }) => (
  <Grid item xs={6} md={2}>
    <Card variant="outlined">
      <CardContent>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="h6" sx={{ color: color || "text.primary" }}>{value}</Typography>
      </CardContent>
    </Card>
  </Grid>
);

const PolicyField = ({ label, value, onSave }) => {
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
      />
    </Grid>
  );
};

export default RevenueRecoveryDashboard;