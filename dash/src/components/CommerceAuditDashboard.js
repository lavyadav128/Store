import React, { useCallback, useEffect, useState } from "react";
import { Alert, Box, Button, Chip, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import server from "../environment";

const CommerceAuditDashboard = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${server}/api/commerce/audit`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to load audit trail");
      setItems(data);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  return <Box sx={{ maxWidth: 1280, mx: "auto", p: { xs: 2, md: 4 } }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, gap: 2 }}>
      <Box><Typography variant="h4" fontWeight={800}>AI Commerce Audit Trail</Typography><Typography color="text.secondary">Every recommendation, confirmation, payment-order attempt, and policy gate.</Typography></Box>
      <Button onClick={load} startIcon={<RefreshIcon />} variant="outlined">Refresh</Button>
    </Box>
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    {loading ? <Box sx={{ textAlign: "center", py: 8 }}><CircularProgress /></Box> : <TableContainer component={Paper} elevation={2}>
      <Table size="small"><TableHead><TableRow><TableCell>Time</TableCell><TableCell>Event</TableCell><TableCell>Product</TableCell><TableCell>Live price</TableCell><TableCell>Decision</TableCell><TableCell>Reason / policy</TableCell></TableRow></TableHead>
        <TableBody>{items.map((item) => <TableRow key={item._id}><TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell><TableCell>{item.eventType.replaceAll("_", " ")}</TableCell><TableCell>{item.product.title}<br /><small>{item.product.type}</small></TableCell><TableCell>{item.product.price === 0 ? "FREE" : `₹${item.product.price}`}</TableCell><TableCell><Chip size="small" label={item.gate.decision.replaceAll("_", " ")} color={item.gate.decision === "approved" ? "success" : item.gate.decision === "blocked" ? "error" : "warning"} /></TableCell><TableCell>{item.gate.explanation || item.reason}</TableCell></TableRow>)}
          {!items.length && <TableRow><TableCell colSpan={6} align="center">No commerce events yet. Use guided selling or checkout to create auditable events.</TableCell></TableRow>}
        </TableBody></Table>
    </TableContainer>}
  </Box>;
};
export default CommerceAuditDashboard;
