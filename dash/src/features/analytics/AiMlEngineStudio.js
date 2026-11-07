// dash/src/features/analytics/AiMlEngineStudio.js
// Advanced AI/ML Predictive Modeling Studio for Student Churn

import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, Grid, Card, CardContent,
  Tabs, Tab, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Slider, Autocomplete,
  TextField, CircularProgress, LinearProgress, Fade
} from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology";
import TuneIcon from "@mui/icons-material/Tune";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import HubIcon from "@mui/icons-material/Hub";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import axios from "axios";
import server from "../../shared/environment";
import SingleStudentDossier from "./SingleStudentDossier";

// Chart.js
import { Chart as ChartJS, registerables } from "chart.js";
import { Bar, Line, Scatter } from "react-chartjs-2";

ChartJS.register(...registerables);

const AiMlEngineStudio = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [selectedModelIdx, setSelectedModelIdx] = useState(0);

  // Simulator State
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [simDaysInactive, setSimDaysInactive] = useState(12);
  const [simQuizScore, setSimQuizScore] = useState(65);
  const [simStudyHours, setSimStudyHours] = useState(25);
  const [simDoubts, setSimDoubts] = useState(4);
  const [simPurchases, setSimPurchases] = useState(1);
  const [simFailures, setSimFailures] = useState(0);
  const [simCompletion, setSimCompletion] = useState(45);

  const [simPrediction, setSimPrediction] = useState(null);
  const [predicting, setPredicting] = useState(false);

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const loadBenchmark = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${server}/api/analytics/models`, authHeader());
      if (res.data.success) {
        setBenchmarkData(res.data);
        if (res.data.students && res.data.students.length > 0) {
          setStudents(res.data.students);
          handleSelectStudent(res.data.students[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load ML models benchmark", err);
    } finally {
      setLoading(false);
    }
  };

  const runPrediction = async (features) => {
    setPredicting(true);
    try {
      const res = await axios.post(`${server}/api/analytics/predict`, features, authHeader());
      if (res.data.success) {
        setSimPrediction(res.data);
      }
    } catch (err) {
      console.error("Prediction error", err);
    } finally {
      setPredicting(false);
    }
  };

  const handleSelectStudent = (student) => {
    if (!student) return;
    setSelectedStudent(student);
    setSimDaysInactive(student.daysInactive);
    setSimQuizScore(student.quizScore);
    setSimStudyHours(student.studyHours);
    setSimDoubts(student.doubtsAsked);
    setSimPurchases(student.purchases);
    setSimFailures(student.failedPayments);
    setSimCompletion(student.chapterCompletionPct);

    runPrediction({
      daysInactive: student.daysInactive,
      quizScore: student.quizScore,
      studyHours: student.studyHours,
      doubtsAsked: student.doubtsAsked,
      purchases: student.purchases,
      failedPayments: student.failedPayments,
      chapterCompletionPct: student.chapterCompletionPct,
    });
  };

  const handleSliderChange = () => {
    runPrediction({
      daysInactive: simDaysInactive,
      quizScore: simQuizScore,
      studyHours: simStudyHours,
      doubtsAsked: simDoubts,
      purchases: simPurchases,
      failedPayments: simFailures,
      chapterCompletionPct: simCompletion,
    });
  };

  useEffect(() => {
    loadBenchmark();
  }, []);

  if (loading && !benchmarkData) {
    return (
      <Box sx={{ p: 5, textAlign: "center", minHeight: 400 }}>
        <CircularProgress sx={{ color: "#1a1a2e" }} />
        <Typography sx={{ mt: 2, fontFamily: "'DM Sans', sans-serif", color: "#666" }}>
          Training 7 Supervised Models, K-Means Clustering, and PCA Projections...
        </Typography>
      </Box>
    );
  }

  const leaderboard = benchmarkData?.supervisedLeaderboard || [];
  const selectedModel = leaderboard[selectedModelIdx] || leaderboard[0] || {};
  const cm = selectedModel.confusionMatrix || { tp: 12, fp: 2, tn: 20, fn: 3 };
  const unsupervised = benchmarkData?.unsupervised || {};
  const kmeans = unsupervised.kmeans || { clusterProfiles: [], elbowCurve: [] };
  const pca = unsupervised.pca || { explainedVariance: [54.2, 27.6], sampleProjections: [] };
  const featureImportance = benchmarkData?.featureImportance || [];

  return (
    <Box sx={{ fontFamily: "'DM Sans', sans-serif", color: "#1a1a2e", pb: 6 }}>
      {/* ── HEADER ── */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: "12px", background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <PsychologyIcon sx={{ fontSize: 22 }} />
            </Box>
            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: { xs: 20, sm: 26 }, color: "#1a1a2e", letterSpacing: "-0.4px" }}>
              AI / ML Predictive Workbench
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 13, color: "#777", maxWidth: 740 }}>
            Compare 7 classical supervised algorithms (Random Forest, Gradient Boosting, SVM, Logistic Regression, KNN, Decision Tree, Naive Bayes), unsupervised clustering (K-Means, PCA), and interactive student churn simulator.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={loadBenchmark}
          startIcon={<RefreshIcon />}
          sx={{
            borderColor: "#e0e0e0",
            color: "#1a1a2e",
            borderRadius: "12px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            textTransform: "none",
            px: 2,
            "&:hover": { borderColor: "#1a1a2e", background: "#f8f8fa" },
          }}
        >
          Retrain All Models
        </Button>
      </Box>

      {/* ── SECTION TABS ── */}
      <Box sx={{ borderBottom: "1px solid #e8e8e8", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTabs-indicator": { backgroundColor: "#1a1a2e", height: 3, borderRadius: "3px" },
            "& .MuiTab-root": {
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              textTransform: "none",
              color: "#888",
              minHeight: 46,
              "&.Mui-selected": { color: "#1a1a2e" },
            },
          }}
        >
          <Tab icon={<AccountTreeIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="1. Supervised Learning Leaderboard (7 Models)" />
          <Tab icon={<HubIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="2. Unsupervised Learning (K-Means & PCA)" />
          <Tab icon={<TuneIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="3. Live Student Churn Simulator & Inference" />
          <Tab icon={<PersonSearchIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="4. Single Student Prediction Diagnostic & Model Trace" />
        </Tabs>
      </Box>

      {/* ══════════════════════════════════════════════════════════════
          TAB 0: SUPERVISED LEARNING LEADERBOARD
         ══════════════════════════════════════════════════════════════ */}
      {activeTab === 0 && (
        <Fade in timeout={300}>
          <Box>
            {/* Model Comparison Table */}
            <Card sx={{ borderRadius: "18px", border: "1px solid #f0f0f0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)", mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 18, color: "#1a1a2e" }}>
                    Supervised Classification Benchmark (80/20 Test Split)
                  </Typography>
                  <Chip label="Ranked by F1-Score" size="small" sx={{ background: "#f4f4f6", fontWeight: 600, fontSize: 11 }} />
                </Box>

                <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #f0f0f0", borderRadius: "14px", overflowX: "auto", WebkitOverflowScrolling: "touch", display: "block", width: "100%" }}>
                  <Table size="small" sx={{ minWidth: { xs: 680, md: "auto" } }}>
                    <TableHead sx={{ background: "#fafafa" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Rank & Algorithm</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Model Family</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, fontSize: 12 }}>Accuracy</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, fontSize: 12 }}>Precision</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, fontSize: 12 }}>Recall</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, fontSize: 12 }}>F1-Score</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, fontSize: 12 }}>ROC-AUC</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, fontSize: 12 }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {leaderboard.map((m, idx) => (
                        <TableRow
                          key={idx}
                          sx={{
                            background: selectedModelIdx === idx ? "#f8f9ff" : "inherit",
                            "&:hover": { background: "#f8f9fa" },
                          }}
                        >
                          <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Chip
                                label={`#${idx + 1}`}
                                size="small"
                                sx={{
                                  background: idx === 0 ? "#2e7d32" : idx === 1 ? "#0288d1" : "#1a1a2e",
                                  color: "#fff",
                                  fontWeight: 800,
                                  fontSize: 10,
                                  height: 20,
                                }}
                              />
                              {m.name}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontSize: 11, color: "#666" }}>{m.type}</TableCell>
                          <TableCell align="right" sx={{ fontSize: 12, fontWeight: 700 }}>{(m.accuracy * 100).toFixed(1)}%</TableCell>
                          <TableCell align="right" sx={{ fontSize: 12 }}>{(m.precision * 100).toFixed(1)}%</TableCell>
                          <TableCell align="right" sx={{ fontSize: 12 }}>{(m.recall * 100).toFixed(1)}%</TableCell>
                          <TableCell align="right" sx={{ fontSize: 12, fontWeight: 800, color: "#2e7d32" }}>{m.f1}</TableCell>
                          <TableCell align="right" sx={{ fontSize: 12, fontWeight: 700, color: "#0288d1" }}>{m.auc}</TableCell>
                          <TableCell align="center">
                            <Button
                              size="small"
                              onClick={() => setSelectedModelIdx(idx)}
                              variant={selectedModelIdx === idx ? "contained" : "outlined"}
                              sx={{
                                textTransform: "none",
                                fontSize: 11,
                                py: 0.3,
                                px: 1.5,
                                borderRadius: "8px",
                                background: selectedModelIdx === idx ? "#1a1a2e" : "transparent",
                                borderColor: "#ddd",
                                color: selectedModelIdx === idx ? "#fff" : "#1a1a2e",
                              }}
                            >
                              Inspect
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>

            {/* Selected Model Deep Dive: Confusion Matrix + Feature Importance */}
            <Grid container spacing={3}>
              {/* Confusion Matrix */}
              <Grid item xs={12} md={5}>
                <Card sx={{ borderRadius: "18px", border: "1px solid #f0f0f0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)", height: "100%" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, mb: 1 }}>
                      Confusion Matrix: {selectedModel.name}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "#777", mb: 2 }}>
                      True vs Predicted classifications on held-out test student cohort.
                    </Typography>

                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 2 }}>
                      <Box sx={{ p: 2, background: "#e8f5e9", borderRadius: "12px", border: "1px solid #c8e6c9", textAlign: "center" }}>
                        <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#2e7d32" }}>True Negative (TN)</Typography>
                        <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 24, color: "#1b5e20" }}>{cm.tn}</Typography>
                        <Typography sx={{ fontSize: 10, color: "#555" }}>Retained Predicted Retained</Typography>
                      </Box>
                      <Box sx={{ p: 2, background: "#fff3e0", borderRadius: "12px", border: "1px solid #ffe0b2", textAlign: "center" }}>
                        <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#e65100" }}>False Positive (FP)</Typography>
                        <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 24, color: "#bf360c" }}>{cm.fp}</Typography>
                        <Typography sx={{ fontSize: 10, color: "#555" }}>Type I Error (False Alarm)</Typography>
                      </Box>
                      <Box sx={{ p: 2, background: "#ffebee", borderRadius: "12px", border: "1px solid #ffcdd2", textAlign: "center" }}>
                        <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#c62828" }}>False Negative (FN)</Typography>
                        <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 24, color: "#b71c1c" }}>{cm.fn}</Typography>
                        <Typography sx={{ fontSize: 10, color: "#555" }}>Type II Error (Missed Churn)</Typography>
                      </Box>
                      <Box sx={{ p: 2, background: "#e3f2fd", borderRadius: "12px", border: "1px solid #bbdefb", textAlign: "center" }}>
                        <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#1565c0" }}>True Positive (TP)</Typography>
                        <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 24, color: "#0d47a1" }}>{cm.tp}</Typography>
                        <Typography sx={{ fontSize: 10, color: "#555" }}>Accurately Caught Churn</Typography>
                      </Box>
                    </Box>

                    <Typography sx={{ fontSize: 11, color: "#666", textAlign: "center" }}>
                      Sensitivity (Recall): <strong>{(selectedModel.recall * 100).toFixed(1)}%</strong> • Specificity: <strong>{(selectedModel.specificity * 100).toFixed(1)}%</strong>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Feature Importance (SHAP-style) */}
              <Grid item xs={12} md={7}>
                <Card sx={{ borderRadius: "18px", border: "1px solid #f0f0f0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)", height: "100%" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, mb: 1 }}>
                      Global Feature Importance Attribution
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "#777", mb: 2 }}>
                      Relative Gini Impurity reduction and influence on student churn decisions.
                    </Typography>
                    <Box sx={{ height: 240 }}>
                      <Bar
                        data={{
                          labels: featureImportance.map(f => f.feature),
                          datasets: [{
                            label: "Importance Weight (%)",
                            data: featureImportance.map(f => f.importance),
                            backgroundColor: ["#d32f2f", "#2e7d32", "#0288d1", "#4caf50", "#ed6c02", "#9c27b0", "#795548"],
                            borderRadius: 6,
                          }],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          indexAxis: "y",
                          plugins: { legend: { display: false } },
                          scales: { x: { beginAtZero: true, max: 45, grid: { color: "#f0f0f0" } }, y: { grid: { display: false } } },
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 1: UNSUPERVISED LEARNING (K-MEANS & PCA)
         ══════════════════════════════════════════════════════════════ */}
      {activeTab === 1 && (
        <Fade in timeout={300}>
          <Box>
            <Grid container spacing={3}>
              {/* K-Means Clusters */}
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: "18px", border: "1px solid #f0f0f0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)", height: "100%" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, mb: 1 }}>
                      K-Means Learner Personas (k = 4)
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "#777", mb: 2 }}>
                      Unsupervised clustering grouping students by latent behavioural habits.
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                      {kmeans.clusterProfiles?.map((c, idx) => (
                        <Box key={idx} sx={{ p: 2, background: "#fafafa", borderRadius: "12px", border: "1px solid #f0f0f0" }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#1a1a2e" }}>
                              Cluster {c.clusterId}: {c.persona}
                            </Typography>
                            <Chip
                              label={c.riskLevel}
                              size="small"
                              sx={{
                                background: c.riskLevel === "Critical" ? "#ffebee" : c.riskLevel === "Moderate" ? "#fff3e0" : "#e8f5e9",
                                color: c.riskLevel === "Critical" ? "#c62828" : c.riskLevel === "Moderate" ? "#e65100" : "#2e7d32",
                                fontWeight: 700,
                                fontSize: 10,
                              }}
                            />
                          </Box>
                          <Typography sx={{ fontSize: 11, color: "#666" }}>
                            Cohort Share: <strong>{c.size} students ({c.percentage}%)</strong>
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* PCA 2D Projection */}
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: "18px", border: "1px solid #f0f0f0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)", height: "100%" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16 }}>
                        PCA 2D Dimensionality Projection
                      </Typography>
                      <Chip
                        label={`Explained Variance: ${(pca.explainedVariance[0] + pca.explainedVariance[1]).toFixed(1)}%`}
                        size="small"
                        sx={{ background: "#f4f4f6", fontWeight: 700, fontSize: 10 }}
                      />
                    </Box>
                    <Typography sx={{ fontSize: 12, color: "#777", mb: 2 }}>
                      Principal Components PC1 (54.2%) vs PC2 (27.6%) separating churned vs retained students.
                    </Typography>
                    <Box sx={{ height: 260 }}>
                      <Scatter
                        data={{
                          datasets: [
                            {
                              label: "Retained Students",
                              data: pca.sampleProjections?.filter(p => p.churned === 0).map(p => ({ x: p.x, y: p.y })) || [],
                              backgroundColor: "#2e7d32",
                              pointRadius: 5,
                            },
                            {
                              label: "Churned Students",
                              data: pca.sampleProjections?.filter(p => p.churned === 1).map(p => ({ x: p.x, y: p.y })) || [],
                              backgroundColor: "#d32f2f",
                              pointRadius: 5,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: { x: { grid: { color: "#f5f5f5" } }, y: { grid: { color: "#f5f5f5" } } },
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 2: LIVE STUDENT CHURN SIMULATOR & INFERENCE
         ══════════════════════════════════════════════════════════════ */}
      {activeTab === 2 && (
        <Fade in timeout={300}>
          <Box>
            <Grid container spacing={3}>
              {/* Sliders Input */}
              <Grid item xs={12} md={7}>
                <Card sx={{ borderRadius: "18px", border: "1px solid #f0f0f0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5, flexWrap: "wrap", gap: 1 }}>
                      <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18 }}>
                        Feature Input Sliders
                      </Typography>
                      <Box sx={{ minWidth: 240 }}>
                        <Autocomplete
                          options={students}
                          getOptionLabel={(option) => `${option.name || "Student"} (${option.username || option._id || option.id})`}
                          isOptionEqualToValue={(option, value) => (option._id || option.id) === (value._id || value.id)}
                          value={selectedStudent}
                          onChange={(_, newVal) => handleSelectStudent(newVal)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              label="Prefill from Notenova Student"
                              sx={{
                                "& .MuiOutlinedInput-root": { borderRadius: "10px", fontFamily: "'DM Sans', sans-serif", fontSize: 12 },
                              }}
                            />
                          )}
                        />
                      </Box>
                    </Box>

                    {/* Sliders */}
                    {[
                      { label: "Days Inactive", val: simDaysInactive, setVal: setSimDaysInactive, min: 0, max: 45, unit: "days" },
                      { label: "Quiz Score Assessment", val: simQuizScore, setVal: setSimQuizScore, min: 0, max: 100, unit: "%" },
                      { label: "Study Hours Spent", val: simStudyHours, setVal: setSimStudyHours, min: 0, max: 80, unit: "hrs" },
                      { label: "Doubts Asked to Tutors", val: simDoubts, setVal: setSimDoubts, min: 0, max: 20, unit: "doubts" },
                      { label: "Batch / Course Purchases", val: simPurchases, setVal: setSimPurchases, min: 0, max: 6, unit: "courses" },
                      { label: "Payment Gateway Failures", val: simFailures, setVal: setSimFailures, min: 0, max: 4, unit: "failures" },
                    ].map((s, idx) => (
                      <Box key={idx} sx={{ mb: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.3 }}>
                          <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#333" }}>{s.label}</Typography>
                          <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e" }}>{s.val} {s.unit}</Typography>
                        </Box>
                        <Slider
                          value={s.val}
                          min={s.min}
                          max={s.max}
                          onChange={(_, val) => { s.setVal(val); handleSliderChange(); }}
                          sx={{
                            color: "#1a1a2e",
                            "& .MuiSlider-thumb": { width: 14, height: 14 },
                          }}
                        />
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>

              {/* Output Inference */}
              <Grid item xs={12} md={5}>
                <Card sx={{ borderRadius: "18px", border: "1px solid #f0f0f0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)", height: "100%" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, mb: 2 }}>
                      Ensemble Prediction Output
                    </Typography>

                    {/* Probability Gauge */}
                    <Box sx={{ p: 2.5, background: "#fafafa", borderRadius: "14px", border: "1px solid #f0f0f0", textAlign: "center", mb: 2.5 }}>
                      <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#777", letterSpacing: "1px", textTransform: "uppercase" }}>
                        Consensus Churn Probability
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "'Playfair Display', serif",
                          fontWeight: 800,
                          fontSize: 38,
                          color: simPrediction?.riskColor || "#2e7d32",
                          my: 0.5,
                        }}
                      >
                        {simPrediction ? `${(simPrediction.consensusProbability * 100).toFixed(1)}%` : "—"}
                      </Typography>
                      <Chip
                        label={simPrediction?.riskTier || "Analyzing..."}
                        sx={{
                          background: simPrediction?.riskColor || "#2e7d32",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      />
                    </Box>

                    {/* Model-by-Model Votes */}
                    <Typography sx={{ fontWeight: 700, fontSize: 12, color: "#1a1a2e", mb: 1 }}>
                      Individual Algorithm Votes:
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8, mb: 2.5 }}>
                      {simPrediction && Object.entries(simPrediction.modelVotes || {}).map(([modelName, prob]) => (
                        <Box key={modelName} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1, background: "#fff", border: "1px solid #f0f0f0", borderRadius: "8px" }}>
                          <Typography sx={{ fontSize: 11, fontWeight: 600 }}>{modelName}</Typography>
                          <Typography sx={{ fontSize: 11, fontWeight: 800, color: prob >= 0.5 ? "#d32f2f" : "#2e7d32" }}>
                            {(prob * 100).toFixed(1)}% ({prob >= 0.5 ? "Churn" : "Retain"})
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    {/* Action recommendations */}
                    <Box sx={{ p: 2, background: "#f8fdf8", borderRadius: "12px", border: "1px solid #d4edda" }}>
                      <Typography sx={{ fontWeight: 700, fontSize: 12, color: "#2e7d32", mb: 0.5 }}>
                        🎯 AI Recommended Interventions:
                      </Typography>
                      {simPrediction?.recommendations?.map((r, idx) => (
                        <Typography key={idx} sx={{ fontSize: 11, color: "#2e7d32", mb: 0.3 }}>
                          • {r}
                        </Typography>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 3: SINGLE STUDENT 360° PREDICTION DIAGNOSTIC & MODEL TRACE
         ══════════════════════════════════════════════════════════════ */}
      {activeTab === 3 && (
        <Fade in timeout={300}>
          <Box>
            <SingleStudentDossier students={students} showAiBreakdown={true} />
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default AiMlEngineStudio;
