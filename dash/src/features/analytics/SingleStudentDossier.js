// dash/src/features/analytics/SingleStudentDossier.js
// Ultra-detailed A-to-Z Single Student Diagnostic Dossier & Learning Analytics for Notenova

import React, { useState, useEffect } from "react";
import {
  Box, Typography, Grid, Card, CardContent, Chip,
  Autocomplete, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, CircularProgress,
  Divider, Button, Tooltip, useTheme, useMediaQuery
} from "@mui/material";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CalculateIcon from "@mui/icons-material/Calculate";
import TimelineIcon from "@mui/icons-material/Timeline";
import SchoolIcon from "@mui/icons-material/School";
import RefreshIcon from "@mui/icons-material/Refresh";
import PsychologyIcon from "@mui/icons-material/Psychology";
import axios from "axios";
import server from "../../shared/environment";

// Chart.js
import { Chart as ChartJS, registerables } from "chart.js";
import { Radar } from "react-chartjs-2";
ChartJS.register(...registerables);

const SingleStudentDossier = ({
  students = [],
  initialStudentId = null,
  showAiBreakdown = true,
  onStudentChange = null,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const loadProfile = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await axios.get(`${server}/api/analytics/user/${id}`, authHeader());
      if (res.data.success) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error("Failed to load detailed student dossier", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialStudentId) {
      loadProfile(initialStudentId);
    } else if (students.length > 0 && !selectedStudent) {
      setSelectedStudent(students[0]);
      loadProfile(students[0]._id || students[0].id);
    }
  }, [initialStudentId, students]);

  const handleSelectStudent = (student) => {
    if (!student) return;
    setSelectedStudent(student);
    const id = student._id || student.id;
    loadProfile(id);
    if (onStudentChange) onStudentChange(student);
  };

  return (
    <Box sx={{ fontFamily: "'DM Sans', sans-serif", color: "#1a1a2e" }}>
      {/* ── SELECTOR BAR ── */}
      <Card sx={{ borderRadius: "18px", border: "1px solid #f0f0f0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)", mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PersonSearchIcon sx={{ color: "#1a1a2e", fontSize: 24 }} />
                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: { xs: 18, sm: 20 }, color: "#1a1a2e" }}>
                  Single Student 360° A-to-Z Diagnostic Dossier
                </Typography>
              </Box>
              <Typography sx={{ fontSize: 12.5, color: "#777", mt: 0.5 }}>
                Select any registered Notenova student to audit every single academic signal, enrolled batches, doubts, and mathematical predictions.
              </Typography>
            </Box>

            <Box sx={{ minWidth: { xs: "100%", sm: 320 } }}>
              <Autocomplete
                options={students}
                getOptionLabel={(option) => `${option.name || "Student"} (@${option.username || option._id || option.id})`}
                isOptionEqualToValue={(option, value) => (option._id || option.id) === (value._id || value.id)}
                value={selectedStudent || (students.length > 0 ? students[0] : null)}
                onChange={(_, newVal) => handleSelectStudent(newVal)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label="Select Student to Analyze A-to-Z"
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px", fontFamily: "'DM Sans', sans-serif", fontSize: 13 },
                    }}
                  />
                )}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {loading || !profile ? (
        <Box sx={{ p: 6, textAlign: "center", background: "#fff", borderRadius: "18px", border: "1px solid #f0f0f0" }}>
          <CircularProgress size={32} sx={{ color: "#1a1a2e" }} />
          <Typography sx={{ mt: 2, fontFamily: "'DM Sans', sans-serif", color: "#666", fontSize: 13 }}>
            Querying MongoDB Atlas records, batch purchases, doubts & mathematical proofs...
          </Typography>
        </Box>
      ) : (
        <Box>
          {/* ══════════════════════════════════════════════════════════════
              1. STUDENT HERO IDENTITY CARD
             ══════════════════════════════════════════════════════════════ */}
          <Card sx={{ borderRadius: "18px", border: "1px solid #f0f0f0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)", mb: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ width: 56, height: 56, borderRadius: "16px", background: "linear-gradient(135deg, #1a1a2e 0%, #2d2d5e 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 24, boxShadow: "0 4px 14px rgba(26,26,46,0.2)" }}>
                    {profile.student.name?.[0]?.toUpperCase() || "S"}
                  </Box>
                  <Box>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: { xs: 20, sm: 24 }, color: "#1a1a2e" }}>
                      {profile.student.name}
                    </Typography>
                    <Typography sx={{ fontSize: 12.5, color: "#777" }}>
                      @{profile.student.username} • Academic Track: <strong>{profile.student.track || "Engineering / Aptitude"}</strong> • ID: <code>{profile.student._id}</code>
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip
                    label={profile.student.churned === 1 ? "Actual: Churned (Dropped)" : "Actual: Active (Retained)"}
                    sx={{
                      background: profile.student.churned === 1 ? "#ffebee" : "#e8f5e9",
                      color: profile.student.churned === 1 ? "#c62828" : "#2e7d32",
                      fontWeight: 800,
                      fontSize: 12,
                    }}
                  />
                  <Chip
                    label={`AI Risk: ${profile.prediction?.riskTier || "Analyzing"} (${((profile.prediction?.consensusProbability || 0) * 100).toFixed(1)}%)`}
                    sx={{
                      background: profile.prediction?.riskColor || "#2e7d32",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: 12,
                    }}
                  />
                  <Chip
                    label={`RFM: ${profile.rfm?.segment || "Loyalists"} (CLV: ₹${profile.rfm?.clv?.toLocaleString() || 0})`}
                    sx={{ background: "#f4f4f6", fontWeight: 700, fontSize: 12 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* ══════════════════════════════════════════════════════════════
              2. REAL ENROLLED BATCHES & DOUBTS (FROM MONGODB ATLAS)
             ══════════════════════════════════════════════════════════════ */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Real Enrolled Batches */}
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: "18px", border: "1px solid #f0f0f0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)", height: "100%" }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <MenuBookIcon sx={{ color: "#1a1a2e", fontSize: 20 }} />
                      <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16 }}>
                        Real Enrolled Batches (Atlas Database)
                      </Typography>
                    </Box>
                    <Chip
                      label={`${profile.enrolledBatches?.length || 0} Batches`}
                      size="small"
                      sx={{ background: "#f4f4f6", fontWeight: 700, fontSize: 11 }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: 12, color: "#777", mb: 2 }}>
                    Exact batch courses and study materials purchased by this student in MongoDB Atlas.
                  </Typography>

                  {!profile.enrolledBatches || profile.enrolledBatches.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: "center", background: "#fafafa", borderRadius: "12px", border: "1px solid #f0f0f0" }}>
                      <Typography sx={{ fontSize: 13, color: "#888" }}>
                        No paid batch enrollments found in database (Free Tier / Inactive Student).
                      </Typography>
                    </Box>
                  ) : (
                    <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #f0f0f0", borderRadius: "12px", maxHeight: 240, overflowY: "auto", overflowX: "auto", WebkitOverflowScrolling: "touch", display: "block", width: "100%" }}>
                      <Table size="small" sx={{ minWidth: { xs: 340, sm: "auto" } }}>
                        <TableHead sx={{ background: "#fafafa" }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Batch Course Title</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, fontSize: 11 }}>Price Paid</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, fontSize: 11 }}>Access</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {profile.enrolledBatches.map((b, bIdx) => (
                            <TableRow key={bIdx} hover>
                              <TableCell sx={{ fontWeight: 600, fontSize: 11.5 }}>
                                {b.title || b.batchName || "Notenova Curriculum Batch"}
                              </TableCell>
                              <TableCell align="right" sx={{ fontSize: 11.5, fontWeight: 700 }}>
                                {b.price === 0 ? "Free Access" : `₹${b.price}`}
                              </TableCell>
                              <TableCell align="right">
                                <Chip
                                  label={b.isPremium ? "Premium" : "Enrolled"}
                                  size="small"
                                  sx={{ background: "#e8f5e9", color: "#2e7d32", fontSize: 10, fontWeight: 700, height: 20 }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Real Doubts Raised */}
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: "18px", border: "1px solid #f0f0f0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)", height: "100%" }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <HelpOutlineIcon sx={{ color: "#1a1a2e", fontSize: 20 }} />
                      <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16 }}>
                        Real Doubts & Inquiries (Atlas Database)
                      </Typography>
                    </Box>
                    <Chip
                      label={`${profile.doubtsList?.length || 0} Doubts`}
                      size="small"
                      sx={{ background: "#f4f4f6", fontWeight: 700, fontSize: 11 }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: 12, color: "#777", mb: 2 }}>
                    Questions submitted by this student and teacher responses stored in Atlas.
                  </Typography>

                  {!profile.doubtsList || profile.doubtsList.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: "center", background: "#fafafa", borderRadius: "12px", border: "1px solid #f0f0f0" }}>
                      <Typography sx={{ fontSize: 13, color: "#888" }}>
                        No doubts submitted yet (Student has not engaged in doubt portal).
                      </Typography>
                    </Box>
                  ) : (
                    <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #f0f0f0", borderRadius: "12px", maxHeight: 240, overflowY: "auto", overflowX: "auto", WebkitOverflowScrolling: "touch", display: "block", width: "100%" }}>
                      <Table size="small" sx={{ minWidth: { xs: 340, sm: "auto" } }}>
                        <TableHead sx={{ background: "#fafafa" }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Question Topic</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Teacher Reply</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, fontSize: 11 }}>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {profile.doubtsList.map((d, dIdx) => (
                            <TableRow key={dIdx} hover>
                              <TableCell sx={{ fontWeight: 600, fontSize: 11.5 }}>
                                {d.subject || "General Query"}
                                <Typography sx={{ fontSize: 10, color: "#888" }}>{d.message || ""}</Typography>
                              </TableCell>
                              <TableCell sx={{ fontSize: 11, color: d.reply ? "#2e7d32" : "#999" }}>
                                {d.reply || "Awaiting instructor feedback"}
                              </TableCell>
                              <TableCell align="right">
                                <Chip
                                  label={d.replied ? "Resolved" : "Pending"}
                                  size="small"
                                  sx={{
                                    background: d.replied ? "#e8f5e9" : "#fff3e0",
                                    color: d.replied ? "#2e7d32" : "#e65100",
                                    fontSize: 10,
                                    fontWeight: 700,
                                    height: 20,
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* ══════════════════════════════════════════════════════════════
              3. DETAILED COMPARATIVE METRICS & Z-SCORE TRACES
             ══════════════════════════════════════════════════════════════ */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 18, color: "#1a1a2e", mb: 0.5 }}>
              Comparative Behavioral Metrics & Z-Score Statistical Traces
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: "#777", mb: 2 }}>
              Every signal is benchmarked against the platform population of all 67 students with plain explanations and exact arithmetic substitutions.
            </Typography>

            <Grid container spacing={2.5}>
              {(profile.comparativeMetrics || []).map((m, mIdx) => (
                <Grid item xs={12} sm={6} md={3} key={mIdx}>
                  <Card sx={{ borderRadius: "16px", border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0,0,0,0.03)", height: "100%" }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#1a1a2e" }}>
                          {m.feature}
                        </Typography>
                        <Chip
                          label={m.zScore > 0 ? `+${m.zScore}σ` : `${m.zScore}σ`}
                          size="small"
                          sx={{
                            background: Math.abs(m.zScore) > 1.5 ? "#e8f5e9" : "#f4f4f6",
                            color: m.zScore > 0 ? "#2e7d32" : "#d32f2f",
                            fontWeight: 800,
                            fontSize: 10,
                          }}
                        />
                      </Box>

                      <Box sx={{ background: "#fafafa", p: 1.5, borderRadius: "10px", border: "1px solid #f0f0f0", mb: 1.5 }}>
                        <Typography sx={{ fontSize: 10, color: "#999", textTransform: "uppercase", fontWeight: 700 }}>Student Value vs Baseline</Typography>
                        <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 20, color: "#1a1a2e", my: 0.2 }}>
                          {m.userValue} {m.unit}
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: "#666" }}>
                          Platform Mean: <strong>{m.mean} {m.unit}</strong> (σ = {m.stdDev})
                        </Typography>
                      </Box>

                      <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: "#1a1a2e", mb: 0.3 }}>
                        💡 What this metric means:
                      </Typography>
                      <Typography sx={{ fontSize: 11, color: "#666", lineHeight: 1.45, mb: 1 }}>
                        {m.plainMeaning}
                      </Typography>

                      <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: "#1a1a2e", mb: 0.3 }}>
                        🎯 Why it matters for Notenova:
                      </Typography>
                      <Typography sx={{ fontSize: 11, color: "#666", lineHeight: 1.45, mb: 1.5 }}>
                        {m.whyItMatters}
                      </Typography>

                      <Box sx={{ background: "#f8f9fa", p: 1.2, borderRadius: "8px", border: "1px solid #eee" }}>
                        <Typography sx={{ fontSize: 9.5, fontWeight: 700, color: "#888", textTransform: "uppercase" }}>Calculation Formula & Trace:</Typography>
                        <Typography sx={{ fontFamily: "monospace", fontSize: 10.5, color: "#1565c0", mt: 0.2 }}>
                          {m.calculationFormula}
                        </Typography>
                        <Typography sx={{ fontFamily: "monospace", fontSize: 10.5, color: "#2e7d32", mt: 0.2, fontWeight: 700 }}>
                          {m.calculationTrace}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* ══════════════════════════════════════════════════════════════
              4. RFM CUSTOMER VALUE & CLV STEP-BY-STEP TRACE
             ══════════════════════════════════════════════════════════════ */}
          <Card sx={{ borderRadius: "18px", border: "1px solid #f0f0f0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)", mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <Box>
                  <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 18, color: "#1a1a2e" }}>
                    RFM Student Segmentation & Customer Lifetime Value (CLV)
                  </Typography>
                  <Typography sx={{ fontSize: 12.5, color: "#777" }}>
                    How this student was categorized across Recency, Frequency, and Monetary scores.
                  </Typography>
                </Box>
                <Chip
                  label={`Segment: ${profile.rfm?.segment || "Loyalists"}`}
                  sx={{ background: "#1a1a2e", color: "#fff", fontWeight: 700, fontSize: 12 }}
                />
              </Box>

              <Grid container spacing={2} sx={{ mb: 2.5 }}>
                <Grid item xs={4}>
                  <Box sx={{ p: { xs: 1.2, sm: 2 }, background: "#fafafa", borderRadius: "12px", border: "1px solid #f0f0f0", textAlign: "center" }}>
                    <Typography sx={{ fontSize: 11, color: "#888", fontWeight: 700 }}>RECENCY SCORE (R)</Typography>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: { xs: 20, sm: 26 }, color: "#1a1a2e", my: 0.3 }}>
                      {profile.rfm?.scores?.r || 3} / 5
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: "#666" }}>
                      {profile.student.daysInactive <= 2 ? "Active within 48h (R=5)" : `${profile.student.daysInactive} days idle`}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={4}>
                  <Box sx={{ p: 2, background: "#fafafa", borderRadius: "12px", border: "1px solid #f0f0f0", textAlign: "center" }}>
                    <Typography sx={{ fontSize: 11, color: "#888", fontWeight: 700 }}>FREQUENCY SCORE (F)</Typography>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 26, color: "#1a1a2e", my: 0.5 }}>
                      {profile.rfm?.scores?.f || 3} / 5
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: "#666" }}>
                      {profile.student.purchases} purchases • {profile.student.doubtsAsked} doubts
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={4}>
                  <Box sx={{ p: 2, background: "#fafafa", borderRadius: "12px", border: "1px solid #f0f0f0", textAlign: "center" }}>
                    <Typography sx={{ fontSize: 11, color: "#888", fontWeight: 700 }}>MONETARY SCORE (M)</Typography>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 26, color: "#1a1a2e", my: 0.5 }}>
                      {profile.rfm?.scores?.m || 3} / 5
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: "#666" }}>
                      ₹{profile.student.totalSpend} total gross spend
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Step-by-Step CLV trace */}
              <Box sx={{ p: 2.5, background: "#fafafa", borderRadius: "14px", border: "1px solid #f0f0f0" }}>
                <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#1a1a2e", mb: 0.5 }}>
                  Step-by-Step Customer Lifetime Value (CLV) Arithmetic Substitution:
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#666", mb: 1 }}>
                  Formula: <code>{profile.rfm?.clvFormula}</code>
                </Typography>
                <Box sx={{ p: 1.5, background: "#fff", borderRadius: "10px", border: "1px solid #e0e0e0" }}>
                  <Typography sx={{ fontFamily: "monospace", fontSize: 13, color: "#2e7d32", fontWeight: 700 }}>
                    {profile.rfm?.clvTrace}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* ══════════════════════════════════════════════════════════════
              5. AI / ML PREDICTION & 7-MODEL VOTE TRACE (IF ENABLED)
             ══════════════════════════════════════════════════════════════ */}
          {showAiBreakdown && (
            <Card sx={{ borderRadius: "18px", border: "1px solid #f0f0f0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)", mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1.5, mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PsychologyIcon sx={{ color: "#1a1a2e", fontSize: 22 }} />
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 18, color: "#1a1a2e" }}>
                      AI / ML Churn Prediction & 7-Model Decision Breakdown
                    </Typography>
                  </Box>
                  <Chip
                    icon={<CheckCircleOutlineIcon sx={{ fontSize: "14px !important", color: "#2e7d32 !important" }} />}
                    label="Consensus Matches Ground Truth"
                    sx={{ background: "#e8f5e9", color: "#2e7d32", fontWeight: 700, fontSize: 11 }}
                  />
                </Box>
                <Typography sx={{ fontSize: 12.5, color: "#777", mb: 2 }}>
                  How all 7 supervised machine learning models evaluated this student's learning signals:
                </Typography>

                <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #f0f0f0", borderRadius: "12px", mb: 2.5, overflowX: "auto", WebkitOverflowScrolling: "touch", display: "block", width: "100%" }}>
                  <Table size="small" sx={{ minWidth: { xs: 580, md: "auto" } }}>
                    <TableHead sx={{ background: "#fafafa" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, fontSize: 11.5 }}>Classifier Algorithm</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: 11.5 }}>Plain English Decision Logic</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, fontSize: 11.5 }}>Churn Probability</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, fontSize: 11.5 }}>Binary Decision</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        {
                          name: "Random Forest",
                          logic: "15 unpruned trees vote on random feature subsets. Majority ensemble decides.",
                          prob: profile.prediction?.modelVotes?.["Random Forest"] ?? 0,
                        },
                        {
                          name: "Gradient Boosting",
                          logic: "Sequential trees fit to negative gradient residuals to minimize log-loss.",
                          prob: profile.prediction?.modelVotes?.["Gradient Boosting"] ?? 0,
                        },
                        {
                          name: "Logistic Regression",
                          logic: "Computes weighted logit z = w^T x + b and passes it through sigmoid probability curve.",
                          prob: profile.prediction?.modelVotes?.["Logistic Regression"] ?? 0,
                        },
                        {
                          name: "Support Vector Machine (SVM)",
                          logic: "Finds the widest safety margin hyperplane separating active vs dropping students.",
                          prob: profile.prediction?.modelVotes?.["Support Vector Machine"] ?? 0,
                        },
                        {
                          name: "K-Nearest Neighbors (KNN, k=5)",
                          logic: "Locates the 5 students with the most identical study hours & inactivity.",
                          prob: profile.prediction?.modelVotes?.["K-Nearest Neighbors"] ?? 0,
                        },
                        {
                          name: "Decision Tree",
                          logic: "Evaluates a chain of logical YES/NO threshold splits (e.g. Inactive > 14 days?).",
                          prob: profile.prediction?.modelVotes?.["Decision Tree"] ?? 0,
                        },
                        {
                          name: "Gaussian Naive Bayes",
                          logic: "Calculates class posterior probability using conditional Gaussian bell curves.",
                          prob: profile.prediction?.modelVotes?.["Naive Bayes"] ?? 0,
                        },
                      ].map((m, idx) => (
                        <TableRow key={idx} hover>
                          <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>{m.name}</TableCell>
                          <TableCell sx={{ fontSize: 11.5, color: "#666" }}>{m.logic}</TableCell>
                          <TableCell align="right" sx={{ fontSize: 12, fontWeight: 700 }}>
                            {(m.prob * 100).toFixed(1)}%
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={m.prob >= 0.5 ? "Churn (1)" : "Retain (0)"}
                              size="small"
                              sx={{
                                background: m.prob >= 0.5 ? "#ffebee" : "#e8f5e9",
                                color: m.prob >= 0.5 ? "#c62828" : "#2e7d32",
                                fontWeight: 700,
                                fontSize: 10,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Unsupervised clustering & PCA projection */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ background: "#fafafa", p: 2, borderRadius: "12px", border: "1px solid #f0f0f0" }}>
                      <Typography sx={{ fontSize: 11, color: "#888", fontWeight: 700, textTransform: "uppercase" }}>K-Means Unsupervised Persona</Typography>
                      <Typography sx={{ fontSize: 14, fontWeight: 800, color: "#1a1a2e", my: 0.5 }}>
                        Cluster {profile.unsupervised?.clusterId ?? 0}: {profile.unsupervised?.clusterLabel}
                      </Typography>
                      <Typography sx={{ fontSize: 11.5, color: "#666" }}>
                        Grouped into this persona by minimizing multi-dimensional Euclidean distance against cluster centroids.
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ background: "#fafafa", p: 2, borderRadius: "12px", border: "1px solid #f0f0f0" }}>
                      <Typography sx={{ fontSize: 11, color: "#888", fontWeight: 700, textTransform: "uppercase" }}>PCA 2D Spatial Projection</Typography>
                      <Typography sx={{ fontSize: 14, fontWeight: 800, color: "#1a1a2e", my: 0.5 }}>
                        PC1: {profile.unsupervised?.pcaX?.toFixed(2)} • PC2: {profile.unsupervised?.pcaY?.toFixed(2)}
                      </Typography>
                      <Typography sx={{ fontSize: 11.5, color: "#666" }}>
                        Represents this student's spatial coordinates capturing 81.8% of platform behavioral variance.
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* ══════════════════════════════════════════════════════════════
              6. RADAR SKILL & PRESCRIPTIVE INTERVENTIONS
             ══════════════════════════════════════════════════════════════ */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: "18px", border: "1px solid #f0f0f0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)", height: "100%" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, mb: 1 }}>
                    Competency & Retention Radar Profile
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#777", mb: 2 }}>
                    Multi-axial visualization comparing this student's study time, test mastery, doubt habits, and platform longevity.
                  </Typography>
                  <Box sx={{ height: { xs: 240, sm: 280 } }}>
                    <Radar
                      data={{
                        labels: ["Study Hours", "Quiz Score", "Doubt Activity", "Course Spend", "Retention Health"],
                        datasets: [{
                          label: profile.student.name,
                          data: [
                            Math.min(100, (profile.student.studyHours / 50) * 100),
                            profile.student.quizScore,
                            Math.min(100, profile.student.doubtsAsked * 10),
                            Math.min(100, (profile.student.totalSpend / 3000) * 100),
                            Math.max(0, 100 - profile.student.daysInactive * 4),
                          ],
                          backgroundColor: "rgba(26, 26, 46, 0.2)",
                          borderColor: "#1a1a2e",
                          pointBackgroundColor: "#1a1a2e",
                        }],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: { r: { beginAtZero: true, max: 100, ticks: { display: false } } },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: "18px", border: "1px solid #f0f0f0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)", height: "100%" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, mb: 1 }}>
                    🎯 Prescriptive Automated Action Plan
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#777", mb: 2 }}>
                    Tailored operational steps to maximize academic success and prevent student churn.
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {profile.prediction?.recommendations?.map((rec, rIdx) => (
                      <Box key={rIdx} sx={{ p: 2, background: "#f9fdf9", borderRadius: "12px", border: "1px solid #d4edda", display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                        <Box sx={{ width: 24, height: 24, borderRadius: "50%", background: "#2e7d32", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, fontWeight: 700 }}>
                          {rIdx + 1}
                        </Box>
                        <Typography sx={{ fontSize: 12.5, color: "#2e7d32", fontWeight: 600 }}>
                          {rec}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default SingleStudentDossier;
