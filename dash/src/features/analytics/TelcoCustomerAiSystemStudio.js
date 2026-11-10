// dash/src/features/analytics/TelcoCustomerAiSystemStudio.js
// Complete Step-by-Step Interactive Deep Dive into AI-Powered-Customer-Intelligence-System-main
// Covers Step 0 through Pipeline 8 (Ingestion, EDA, Preprocessing, 10 Classifiers, Cost-Benefit/XAI, Clustering/PCA, Regression, Math/RL/GA)

import React, { useState } from "react";
import {
  Box, Typography, Grid, Card, CardContent, Tabs, Tab, Chip,
  TextField, InputAdornment, Accordion, AccordionSummary, AccordionDetails,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Alert, Divider, Slider, FormControl, InputLabel, Select, MenuItem,
  RadioGroup, FormControlLabel, Radio
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LayersIcon from "@mui/icons-material/Layers";
import StorageIcon from "@mui/icons-material/Storage";
import AssessmentIcon from "@mui/icons-material/Assessment";
import BuildIcon from "@mui/icons-material/Build";
import PsychologyIcon from "@mui/icons-material/Psychology";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import FunctionsIcon from "@mui/icons-material/Functions";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import QuizIcon from "@mui/icons-material/Quiz";
import CodeIcon from "@mui/icons-material/Code";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";

import { Chart as ChartJS, registerables } from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

import {
  DATASET_OVERVIEW, COLUMN_GROUPS, RAW_SAMPLE_CUSTOMERS, UNIVARIATE_NUM_STATS,
  BIVARIATE_CHI2_TOP5, WELCH_TTEST_RESULTS, CORRELATION_WITH_CHURN,
  CLASSIFICATION_BENCHMARK, COST_BENEFIT_DATA, BIAS_VARIANCE_CURVE,
  ELBOW_SILHOUETTE_DATA, CLUSTER_PERSONAS, PCA_SEGMENTATION_VARIANCE,
  REGRESSION_BENCHMARK, INFO_GAIN_RANKING, PCA_SCRATCH_MATH,
  CURSE_EXPERIMENT, RL_ACTIONS, RL_POLICY_TABLE, RL_REWARD_PROGRESSION,
  GA_EVOLUTION, INTERVIEW_QA_BANK, PIPELINE_QUIZZES
} from "./telcoProjectData";

ChartJS.register(...registerables);

// ═════════════════════════════════════════════════════════════════════════════
// REUSABLE EDUCATIONAL UI BUILDING BLOCKS
// ═════════════════════════════════════════════════════════════════════════════

const CodeBlock = ({ title, file, code }) => (
  <Box sx={{ my: 2, borderRadius: "12px", overflow: "hidden", border: "1px solid #1e293b", background: "#0f172a" }}>
    <Box sx={{ px: 2, py: 1, background: "#1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: "#38bdf8", display: "flex", alignItems: "center", gap: 0.8 }}>
        <CodeIcon sx={{ fontSize: 15 }} /> {title}
      </Typography>
      {file && <Chip label={file} size="small" sx={{ height: 20, fontSize: 10, fontFamily: "monospace", background: "#0f172a", color: "#94a3b8" }} />}
    </Box>
    <Box component="pre" sx={{ m: 0, p: 2, fontSize: 12, fontFamily: "'Fira Code', 'Courier New', monospace", color: "#e2e8f0", overflowX: "auto", lineHeight: 1.55 }}>
      {code}
    </Box>
  </Box>
);

const FormulaBox = ({ title, formula, breakdown = [] }) => (
  <Box sx={{ my: 2, p: 2.2, borderRadius: "12px", background: "#faf5ff", border: "1px solid #e9d5ff" }}>
    <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#7e22ce", textTransform: "uppercase", letterSpacing: "0.8px", mb: 1 }}>
      📐 {title}
    </Typography>
    <Box sx={{ p: 1.5, borderRadius: "8px", background: "#ffffff", border: "1px solid #f3e8ff", fontFamily: "'Fira Code', monospace", fontSize: 13.5, fontWeight: 700, color: "#581c87", overflowX: "auto" }}>
      {formula}
    </Box>
    {breakdown.length > 0 && (
      <Box sx={{ mt: 1.2, display: "flex", flexDirection: "column", gap: 0.4 }}>
        {breakdown.map((b, i) => (
          <Typography key={i} sx={{ fontSize: 11.5, color: "#4c1d95" }}>
            • <strong>{b.sym}</strong>: {b.desc}
          </Typography>
        ))}
      </Box>
    )}
  </Box>
);

const EasyAnalogy = ({ title = "Understand Like a Beginner (Zero-Jargon Analogy)", text }) => (
  <Box sx={{ my: 2, p: 2.2, borderRadius: "14px", background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)", border: "1px solid #bae6fd" }}>
    <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#0369a1", mb: 0.6, display: "flex", alignItems: "center", gap: 0.8 }}>
      <LightbulbIcon sx={{ fontSize: 18, color: "#0284c7" }} /> {title}
    </Typography>
    <Typography sx={{ fontSize: 13, color: "#0c4a6e", lineHeight: 1.65 }}>
      {text}
    </Typography>
  </Box>
);

const InterviewCritiqueBox = ({ answer, warnings = [] }) => (
  <Box sx={{ my: 2.5, p: 2.2, borderRadius: "14px", background: "#fffbeb", border: "1px solid #fde68a" }}>
    <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#92400e", mb: 1, display: "flex", alignItems: "center", gap: 0.8 }}>
      <WorkOutlineIcon sx={{ fontSize: 18, color: "#d97706" }} /> How To Answer in an Interview + Code Critiques
    </Typography>
    <Box sx={{ p: 1.5, background: "#fff", borderRadius: "10px", border: "1px solid #fef3c7", mb: warnings.length ? 1.5 : 0 }}>
      <Typography sx={{ fontSize: 12.5, color: "#1e293b", fontStyle: "italic", lineHeight: 1.6 }}>
        "{answer}"
      </Typography>
    </Box>
    {warnings.map((w, i) => (
      <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: 0.8, mt: 0.8 }}>
        <WarningAmberIcon sx={{ fontSize: 16, color: "#dc2626", mt: 0.2 }} />
        <Typography sx={{ fontSize: 11.8, color: "#7f1d1d", lineHeight: 1.5 }}>
          <strong>Important Distinction / Production Note:</strong> {w}
        </Typography>
      </Box>
    ))}
  </Box>
);

const FlowDiagram = ({ steps = [] }) => (
  <Box sx={{ my: 2, p: 2, borderRadius: "14px", background: "#f8fafc", border: "1px solid #e2e8f0", overflowX: "auto" }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 650 }}>
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <Box sx={{ flex: 1, p: 1.4, borderRadius: "10px", background: "#fff", border: `1.5px solid ${s.color || "#1a1a2e"}`, textAlign: "center", minWidth: 115 }}>
            <Typography sx={{ fontSize: 10, fontWeight: 800, color: s.color || "#0284c7", textTransform: "uppercase" }}>Step {i + 1}</Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#0f172a", my: 0.3 }}>{s.label}</Typography>
            <Typography sx={{ fontSize: 10.5, color: "#64748b" }}>{s.sub}</Typography>
          </Box>
          {i < steps.length - 1 && <ArrowForwardIcon sx={{ color: "#94a3b8", fontSize: 18, flexShrink: 0 }} />}
        </React.Fragment>
      ))}
    </Box>
  </Box>
);

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
const TelcoCustomerAiSystemStudio = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Interactive Quiz State
  const [quizAnswers, setQuizAnswers] = useState({});

  // Interactive Simulator State (Live Telco Customer)
  const [simContract, setSimContract] = useState("Month-to-month");
  const [simInternet, setSimInternet] = useState("Fiber optic");
  const [simTech, setSimTech] = useState("No");
  const [simPayment, setSimPayment] = useState("Electronic check");
  const [simTenure, setSimTenure] = useState(2);
  const [simMonthly, setSimMonthly] = useState(70.7);

  // Compute Simulated Telco Features & Predictions
  const simTotalCharges = +(simTenure * simMonthly).toFixed(2);
  const simRatio = +(simMonthly / (simTotalCharges + 0.00001)).toFixed(4);
  const simHighRisk = simContract === "Month-to-month" && simInternet === "Fiber optic" && simTech === "No" ? 1 : 0;
  const simCohort = simTenure <= 12 ? "0-1yr" : simTenure <= 24 ? "1-2yr" : simTenure <= 48 ? "2-4yr" : "4-6yr";
  // Logistic approximation calibrated to Telco drivers
  const simLogit =
    -0.8 +
    (simContract === "Month-to-month" ? 1.45 : simContract === "One year" ? -0.4 : -1.2) +
    (simInternet === "Fiber optic" ? 0.85 : simInternet === "No" ? -0.9 : 0) +
    (simTech === "No" && simInternet !== "No" ? 0.55 : -0.45) +
    (simPayment === "Electronic check" ? 0.55 : -0.2) +
    (simMonthly >= 80 ? 0.4 : 0) -
    0.045 * simTenure;
  const simProb = Math.min(0.97, Math.max(0.02, +(1 / (1 + Math.exp(-simLogit))).toFixed(4)));
  const simRiskTier = simProb >= 0.7 ? "CRITICAL" : simProb >= 0.45 ? "HIGH" : simProb >= 0.25 ? "MEDIUM" : "LOW";
  // Match to RL Q-Table State!
  const rlRiskIdx = simProb >= 0.5 ? 2 : simProb >= 0.25 ? 1 : 0;
  const rlValIdx = simMonthly >= 65 ? 1 : 0;
  const rlContractIdx = simContract === "Month-to-month" ? 0 : 1;
  const rlStateId = rlRiskIdx * 4 + rlValIdx * 2 + rlContractIdx;
  const matchedRlPolicy = RL_POLICY_TABLE.find((p) => p.state === rlStateId) || RL_POLICY_TABLE[0];

  const TABS = [
    { label: "0. Dataset & Overview", icon: <StorageIcon sx={{ fontSize: 17 }} /> },
    { label: "1. Data Ingestion", icon: <LayersIcon sx={{ fontSize: 17 }} /> },
    { label: "2. Exploratory EDA", icon: <AssessmentIcon sx={{ fontSize: 17 }} /> },
    { label: "3. Preprocessing & FE", icon: <BuildIcon sx={{ fontSize: 17 }} /> },
    { label: "4. Classification (10 Models)", icon: <PsychologyIcon sx={{ fontSize: 17 }} /> },
    { label: "5. Eval, Cost & XAI", icon: <TrendingUpIcon sx={{ fontSize: 17 }} /> },
    { label: "6. Clustering & 3D PCA", icon: <BubbleChartIcon sx={{ fontSize: 17 }} /> },
    { label: "7. Regression Lab", icon: <FunctionsIcon sx={{ fontSize: 17 }} /> },
    { label: "8. Math, RL & GA", icon: <AutoAwesomeIcon sx={{ fontSize: 17 }} /> },
    { label: "9. Simulator, Quiz & Q&A", icon: <QuizIcon sx={{ fontSize: 17 }} /> },
  ];

  // Filter helper for quick search across topics
  const matchesSearch = (text) => {
    if (!searchTerm.trim()) return false;
    return text.toLowerCase().includes(searchTerm.toLowerCase());
  };

  return (
    <Box sx={{ fontFamily: "'DM Sans', sans-serif", color: "#1a1a2e", pb: 8 }}>
      {/* ── HERO HEADER BANNER ── */}
      <Box sx={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #312e81 100%)", borderRadius: "20px", p: { xs: 2.5, md: 4 }, color: "#fff", mb: 3, boxShadow: "0 10px 30px rgba(15,23,42,0.18)" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ maxWidth: 820 }}>
            <Chip label="COMPLETE PROJECT MASTERCLASS • ONE PIPELINE AT A TIME" size="small" sx={{ background: "rgba(56,189,248,0.18)", color: "#38bdf8", fontWeight: 800, fontSize: 10.5, letterSpacing: "0.8px", mb: 1.2 }} />
            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: { xs: 22, md: 30 }, letterSpacing: "-0.4px", mb: 1 }}>
              AI-Powered Customer Intelligence System (A-to-Z Deep Dive)
            </Typography>
            <Typography sx={{ fontSize: 13.5, color: "#cbd5e1", lineHeight: 1.65, mb: 2.5 }}>
              Prepare to understand & defend <strong>every single line, mathematical formula, before-and-after customer transformation, and algorithm</strong> inside your uploaded project — from raw 7,043 Telco CSV rows all the way to 10 Classifiers, Cost-Benefit Profit Tuning (+$30,660), Clustering/PCA, Polynomial Regression (R²=0.9991), Q-Learning RL, and Genetic Algorithms.
            </Typography>
          </Box>
          <Box sx={{ width: { xs: "100%", sm: 270 } }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Jump to keyword (e.g. Cramer, SMOTE, Bellman, PCA)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#94a3b8", fontSize: 18 }} /></InputAdornment>,
              }}
              sx={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: "12px",
                "& .MuiOutlinedInput-root": {
                  color: "#fff", fontSize: 12,
                  "& fieldset": { borderColor: "rgba(255,255,255,0.22)" },
                  "&:hover fieldset": { borderColor: "#38bdf8" },
                },
              }}
            />
          </Box>
        </Box>

        {/* Project Vital KPI Strip */}
        <Grid container spacing={1.5}>
          {[
            { k: "Raw Dataset", v: "7,043 × 21", sub: "5,174 Stayed · 1,869 Left" },
            { k: "Prepared Features", v: "38 Inputs", sub: "5,634 Train · 1,409 Test" },
            { k: "Top Classifier", v: "0.8496 AUC", sub: "Soft Voting Ensemble (Top 3)" },
            { k: "Profit Optimization", v: "+$30,660 Lift", sub: "Threshold tuned 0.50 → 0.15" },
            { k: "Best Regressor", v: "0.9991 R²", sub: "Deg-2 Poly (MAE $47.30)" },
            { k: "RL + GA Search", v: "12 States · 5 Gen", sub: "Q-Learning + GA RF (0.8495)" },
          ].map((stat, i) => (
            <Grid item xs={6} sm={4} md={2} key={i}>
              <Box sx={{ p: 1.4, borderRadius: "12px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <Typography sx={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>{stat.k}</Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#38bdf8", my: 0.2 }}>{stat.v}</Typography>
                <Typography sx={{ fontSize: 10, color: "#cbd5e1" }}>{stat.sub}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Quick Search Jump Pills if searching */}
        {searchTerm.trim() && (
          <Box sx={{ mt: 2, p: 1.5, background: "rgba(15,23,42,0.7)", borderRadius: "10px", display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
            <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>Quick match tabs:</Typography>
            {[
              { tab: 0, keys: "dataset 7043 21 columns customerid churn binary totalcharges raw csv" },
              { tab: 1, keys: "ingestion data_loader read_csv mirror github synthetic fallback seed 42" },
              { tab: 2, keys: "eda overview univariate bivariate correlation chi2 cramer welch ttest skewness iqr" },
              { tab: 3, keys: "preprocessing feature engineering standardscaler impute totalservices highrisk onehot drop_first leakage split" },
              { tab: 4, keys: "classification random forest logistic xgboost adaboost gradient boosting mlp knn svm naive bayes voting kfold" },
              { tab: 5, keys: "evaluation roc pr auc cost benefit profit threshold 0.15 bias variance explainability playbook heuristic" },
              { tab: 6, keys: "clustering kmeans elbow silhouette agglomerative dbscan pca 3d loadings persona bug" },
              { tab: 7, keys: "regression linear polynomial ridge lasso regularization path mae rmse r2 adjusted totalcharges clv" },
              { tab: 8, keys: "math entropy gini information gain covariance eigen curse dimensionality rl q-learning bellman genetic algorithm" },
              { tab: 9, keys: "simulator quiz interview defense questions answers" },
            ].filter((item) => matchesSearch(item.keys)).map((m) => (
              <Button key={m.tab} size="small" variant="contained" onClick={() => setActiveStep(m.tab)} sx={{ fontSize: 11, textTransform: "none", background: "#0284c7" }}>
                Open {TABS[m.tab].label}
              </Button>
            ))}
          </Box>
        )}
      </Box>

      {/* ── PIPELINE STEPPER TABS (ONE PIPELINE AT A TIME) ── */}
      <Box sx={{ borderBottom: "1px solid #e2e8f0", mb: 3, background: "#fff", borderRadius: "12px", px: 1 }}>
        <Tabs
          value={activeStep}
          onChange={(_, v) => setActiveStep(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTabs-indicator": { backgroundColor: "#1e1b4b", height: 3, borderRadius: "3px" },
            "& .MuiTab-root": { fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12.2, textTransform: "none", color: "#64748b", minHeight: 48, "&.Mui-selected": { color: "#1e1b4b" } },
          }}
        >
          {TABS.map((t, i) => (
            <Tab key={i} icon={t.icon} iconPosition="start" label={t.label} />
          ))}
        </Tabs>
      </Box>

      {/* ═══════════════════════════════════════════════════════════════════
          STEP 0: PROJECT ARCHITECTURE & ACTUAL DATASET
         ═══════════════════════════════════════════════════════════════════ */}
      {activeStep === 0 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 22, mb: 1 }}>
            Step 0 — Project Architecture & Understanding All 21 Raw Columns
          </Typography>
          <EasyAnalogy
            text="Imagine you run Jio or Airtel with 7,043 subscribers. Every month, some customers leave ('Churn') because bills feel too high, fiber internet feels buggy without tech support, or they aren't locked into contracts. This project is an automated AI factory built in Python that reads raw Excel-like customer sheets, spots why customers leave, predicts WHO will leave next, groups customers into personas, predicts their total lifetime spending, and uses Reinforcement Learning + Genetics to choose the cheapest retention offer that saves the most money!"
          />

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: "100%", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 14.5, mb: 1 }}>🎯 Class Balance (Target Variable)</Typography>
                  <Typography sx={{ fontSize: 12, color: "#64748b", mb: 2 }}>
                    Out of <strong>7,043</strong> telecom customers: <strong>5,174 (73.46%)</strong> stayed, while <strong>1,869 (26.54%)</strong> left. Notice this ~3:1 imbalance!
                  </Typography>
                  <Box sx={{ height: 210 }}>
                    <Doughnut
                      data={{
                        labels: ["Stayed (Churn = No): 5,174 (73.46%)", "Left (Churn = Yes): 1,869 (26.54%)"],
                        datasets: [{ data: [5174, 1869], backgroundColor: ["#16a34a", "#dc2626"], borderWidth: 2 }],
                      }}
                      options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { font: { size: 11 } } } } }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card sx={{ height: "100%", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 14.5, mb: 1 }}>📁 Complete Project Folder & Execution Map</Typography>
                  <CodeBlock
                    title="Project Repository Layout"
                    file="AI-Powered-Customer-Intelligence-System-main/"
                    code={`AI-Powered-Customer-Intelligence-System/
 ├── run_pipeline.py                # Master Orchestrator: triggers all 8 pipelines & dumps artifacts
 ├── app.py                         # Streamlit Interactive Dashboard serving saved models & charts
 ├── data/
 │    ├── raw/WA_Fn-UseC_-Telco-Customer-Churn.csv    # Original 7,043 rows × 21 columns
 │    └── processed/
 │         ├── train.csv            # 5,634 rows × 39 cols (80% Stratified Train)
 │         └── test.csv             # 1,409 rows × 39 cols (20% Stratified Test)
 ├── models/                        # Pre-trained .joblib models + preprocessor + pipeline_artifacts.joblib
 └── src/
      ├── config.py                 # Global file paths & RANDOM_SEED = 42
      ├── data_loader.py            # Pipeline 1: CSV Cache -> Mirrors -> Synthetic Fallback
      ├── eda.py                    # Pipeline 2: Overview, Univariate, Chi2/T-test, Correlations
      ├── preprocessing.py          # Pipeline 3: Cleaning, 5 Engineered Features, One-Hot, Scaling
      ├── classification.py         # Pipeline 4: 9 Models + 5-Fold CV + Top-3 Soft Voting Ensemble
      ├── evaluation.py             # Pipeline 5: ROC/PR, Cost-Benefit Tuning, Bias-Variance
      ├── explainability.py         # Pipeline 5: Global Importance, Local Risk Rules & Playbook
      ├── clustering_pca.py         # Pipeline 6: KMeans, Elbow/Silhouette, Agglomerative, DBSCAN, 3D PCA
      ├── regression.py             # Pipeline 7: 7 Regressors predicting TotalCharges + Ridge/Lasso Paths
      ├── math_explainers.py        # Pipeline 8A: Entropy/IG, Scratch Eigen PCA, Curse of Dim
      ├── reinforcement_learning.py # Pipeline 8B: 12-State Q-Learning Retention Policy Simulator
      └── genetic_algorithm.py      # Pipeline 8C: Evolutionary Random Forest Hyperparameter Search`}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* All 21 Columns Breakdown */}
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 18, mb: 1.5 }}>
            Understanding All 21 Raw Columns (5 Logical Groups)
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {COLUMN_GROUPS.map((g, i) => (
              <Grid item xs={12} md={6} key={i}>
                <Card sx={{ height: "100%", borderRadius: "14px", border: `1px solid ${g.color}33` }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: 13.5, color: g.color, mb: 1.2 }}>{g.group}</Typography>
                    {g.cols.map((c, j) => (
                      <Box key={j} sx={{ py: 0.7, borderBottom: j < g.cols.length - 1 ? "1px dashed #e2e8f0" : "none" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography sx={{ fontWeight: 700, fontSize: 12, fontFamily: "monospace", color: "#0f172a" }}>{c.name}</Typography>
                          <Chip label={c.type} size="small" sx={{ height: 18, fontSize: 9.5, fontFamily: "monospace" }} />
                        </Box>
                        <Typography sx={{ fontSize: 11.5, color: "#475569", mt: 0.2 }}>{c.meaning}</Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Actual First 5 Rows */}
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 18, mb: 1 }}>
            Actual First 5 Rows From Your Dataset (One Row = One Customer)
          </Typography>
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "12px", mb: 2 }}>
            <Table size="small">
              <TableHead sx={{ background: "#f8fafc" }}>
                <TableRow>
                  {["customerID", "tenure", "Contract", "InternetService", "TechSupport", "Monthly ($)", "Total ($)", "Churn"].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 800, fontSize: 11.5 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {RAW_SAMPLE_CUSTOMERS.map((r) => (
                  <TableRow key={r.customerID} sx={{ background: r.Churn === "Yes" ? "#fef2f2" : "#fff" }}>
                    <TableCell sx={{ fontFamily: "monospace", fontWeight: 700, fontSize: 11.5 }}>{r.customerID}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{r.tenure} mo</TableCell>
                    <TableCell sx={{ fontSize: 11.5 }}>{r.Contract}</TableCell>
                    <TableCell sx={{ fontSize: 11.5 }}>{r.InternetService}</TableCell>
                    <TableCell sx={{ fontSize: 11.5 }}>{r.TechSupport}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>${r.MonthlyCharges}</TableCell>
                    <TableCell sx={{ fontSize: 12, fontFamily: "monospace" }}>${r.TotalCharges}</TableCell>
                    <TableCell>
                      <Chip label={r.Churn} size="small" sx={{ fontWeight: 800, fontSize: 10, background: r.Churn === "Yes" ? "#fee2e2" : "#dcfce7", color: r.Churn === "Yes" ? "#991b1b" : "#166534" }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Alert severity="info" sx={{ borderRadius: "12px" }}>
            <strong>Key Rule for ML:</strong> <code>customerID</code> identifies who the person is, NOT how they behave — we MUST drop it before training so the model never memorizes random IDs. <code>Churn</code> is our target variable <strong>y</strong>.
          </Alert>
        </Box>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          PIPELINE 1: DATA INGESTION
         ═══════════════════════════════════════════════════════════════════ */}
      {activeStep === 1 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 22, mb: 1 }}>
            Pipeline 1 of 8 — Data Ingestion (Loading the 7,043 × 21 Dataset)
          </Typography>
          <EasyAnalogy
            text="Think of Data Ingestion as opening your Excel workbook inside Python's memory. Before we can calculate a single average or train a single AI neuron, Python must safely locate the CSV file, read its 7,043 rows, guarantee it isn't corrupted, and turn it into a Pandas DataFrame — essentially a programmable Excel sheet inside Python."
          />

          <FlowDiagram
            steps={[
              { label: "run_pipeline.py", sub: "Calls load_raw_dataset()", color: "#1e1b4b" },
              { label: "Check Local CSV", sub: "RAW_DATA_PATH.exists()?", color: "#0284c7" },
              { label: "Branch 1 (Active)", sub: "pd.read_csv(RAW_DATA_PATH)", color: "#16a34a" },
              { label: "Branch 2 (Backup)", sub: "Download 3 GitHub Mirrors", color: "#ea580c" },
              { label: "Branch 3 (Fallback)", sub: "NumPy Seed-42 Generator", color: "#7c3aed" },
              { label: "raw_df Ready", sub: "Shape: (7043, 21)", color: "#0f172a" },
            ]}
          />

          <CodeBlock
            title="Step 1 Orchestration & Fallback Decision Logic"
            file="run_pipeline.py & src/data_loader.py"
            code={`# Inside run_pipeline.py
logger.info("[Step 1/8] Ingesting Telco Customer Churn Dataset...")
raw_df = load_raw_dataset()
logger.info(f"Loaded raw records: {raw_df.shape[0]} rows, {raw_df.shape[1]} columns.")
# Prints: Loaded raw records: 7043 rows, 21 columns.

# Inside src/data_loader.py
def load_raw_dataset(force_refresh=False):
    # Situation 1: Cached CSV already exists locally (This executes by default!)
    if RAW_DATA_PATH.exists() and not force_refresh:
        logger.info(f"Loading cached dataset from {RAW_DATA_PATH}")
        return pd.read_csv(RAW_DATA_PATH)

    # Situation 2: If missing, attempt downloading from 3 GitHub mirrors & validate
    for url in DATASET_URLS:
        # urllib.request.urlopen(req, timeout=8) -> download CSV
        df_check = pd.read_csv(RAW_DATA_PATH)
        if "Churn" in df_check.columns and len(df_check) > 5000:
            return df_check

    # Situation 3: All network downloads fail -> Reproducible Seed-42 Synthetic Fallback
    df = generate_synthetic_telco_data()
    df.to_csv(RAW_DATA_PATH, index=False)
    return df`}
          />

          <Typography sx={{ fontWeight: 800, fontSize: 15, mt: 2, mb: 1 }}>🔍 Crucial Dataset Quirks Discovered Right After Ingestion</Typography>
          <Grid container spacing={2}>
            {[
              { k: "raw_df.shape", v: "(7043, 21)", note: "7,043 customer rows × 21 attributes." },
              { k: "Duplicate customerIDs", v: "0 Duplicates", note: "Every single ID in this CSV is unique." },
              { k: "TotalCharges dtype", v: "object (String!)", note: "11 new customers (tenure=0) have whitespace ' ', forcing text storage!" },
              { k: "Does Ingestion Clean/Scale?", v: "NO!", note: "Ingestion ONLY loads raw data untouched; cleaning happens in Pipeline 3." },
            ].map((item, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card sx={{ height: "100%", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>{item.k}</Typography>
                    <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#0284c7", my: 0.4 }}>{item.v}</Typography>
                    <Typography sx={{ fontSize: 11.5, color: "#475569" }}>{item.note}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <InterviewCritiqueBox
            answer="I used Pandas inside a dedicated src/data_loader.py module to ingest the 7,043 × 21 Telco Churn CSV. It prioritizes a local cached file, falls back to three validated GitHub mirror downloads (checking len > 5000 and presence of 'Churn'), and finally provides a reproducible Seed-42 NumPy synthetic fallback so the pipeline can never crash offline."
            warnings={["Data Ingestion performs zero cleaning, encoding, or scaling — separating loading from transformation keeps raw_df pristine as a single source of truth."]}
          />
        </Box>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          PIPELINE 2: EXPLORATORY DATA ANALYSIS (EDA)
         ═══════════════════════════════════════════════════════════════════ */}
      {activeStep === 2 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 22, mb: 1 }}>
            Pipeline 2 of 8 — Exploratory Data Analysis (src/eda.py)
          </Typography>
          <EasyAnalogy
            text="A good doctor never prescribes surgery before checking your temperature, blood pressure, and X-rays. Similarly, EDA examines all 7,043 customers BEFORE touching AI: Who is leaving? Are Month-to-month contracts leaving more? How big is the monthly bill difference between leavers and stayers? Is that pattern real or just luck?"
          />

          <FlowDiagram
            steps={[
              { label: "1. Dataset Overview", sub: "compute_dataset_overview()", color: "#0284c7" },
              { label: "2. Univariate Stats", sub: "1 col at a time + 1.5xIQR", color: "#7c3aed" },
              { label: "3. Bivariate Tests", sub: "Chi-Square + Cramér V + T-Test", color: "#ea580c" },
              { label: "4. Correlation Matrix", sub: "One-Hot + Pearson r", color: "#16a34a" },
            ]}
          />

          {/* Step 2.1 & 2.2: Overview & Univariate */}
          <Typography sx={{ fontWeight: 800, fontSize: 16, mt: 2, mb: 1 }}>Step 2.1 & 2.2 — Dataset Overview & Univariate Statistics</Typography>
          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            {[
              { k: "Total Customers", v: DATASET_OVERVIEW.totalCustomers.toLocaleString() },
              { k: "Churn Rate", v: `${DATASET_OVERVIEW.churnRatePct}% (${DATASET_OVERVIEW.churnCount})` },
              { k: "Avg Monthly Bill", v: `$${DATASET_OVERVIEW.avgMonthlyCharges} (Med $${DATASET_OVERVIEW.medianMonthlyCharges})` },
              { k: "Avg Tenure", v: `${DATASET_OVERVIEW.avgTenureMonths} mo (Med ${DATASET_OVERVIEW.medianTenureMonths}m)` },
              { k: "Total Revenue", v: `$${(DATASET_OVERVIEW.totalRevenue / 1e6).toFixed(2)}M` },
              { k: "Blank Values Flagged", v: `${DATASET_OVERVIEW.missingTotalChargesCount} rows` },
            ].map((item, idx) => (
              <Grid item xs={6} sm={4} md={2} key={idx}>
                <Box sx={{ p: 1.3, borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>{item.k}</Typography>
                  <Typography sx={{ fontSize: 13.5, fontWeight: 800, color: "#0f172a" }}>{item.v}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Alert severity="warning" sx={{ mb: 2, borderRadius: "10px" }}>
            <strong>How EDA handles blank TotalCharges:</strong> <code>tc = pd.to_numeric(df["TotalCharges"], errors="coerce").fillna(0)</code> converts <code>" "</code> to <code>NaN</code> and fills with <code>0</code> inside reporting ONLY (<code>raw_df</code> stays untouched). Notice that Pipeline 3 uses a smarter imputation!
          </Alert>

          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "12px", mb: 3 }}>
            <Table size="small">
              <TableHead sx={{ background: "#f8fafc" }}>
                <TableRow>
                  {["Feature", "Mean", "Std Dev", "Min", "Q25 (25%)", "Median (50%)", "Q75 (75%)", "Max", "IQR (Q75-Q25)", "1.5×IQR Outlier Fences", "Skewness", "Outliers Found"].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 800, fontSize: 11 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {UNIVARIATE_NUM_STATS.map((u) => (
                  <TableRow key={u.col}>
                    <TableCell sx={{ fontWeight: 800, fontSize: 11.5 }}>{u.col}</TableCell>
                    <TableCell sx={{ fontSize: 11.5 }}>{u.mean}</TableCell>
                    <TableCell sx={{ fontSize: 11.5 }}>{u.std}</TableCell>
                    <TableCell sx={{ fontSize: 11.5 }}>{u.min}</TableCell>
                    <TableCell sx={{ fontSize: 11.5 }}>{u.q25}</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: "#0284c7", fontSize: 11.5 }}>{u.median}</TableCell>
                    <TableCell sx={{ fontSize: 11.5 }}>{u.q75}</TableCell>
                    <TableCell sx={{ fontSize: 11.5 }}>{u.max}</TableCell>
                    <TableCell sx={{ fontSize: 11.5 }}>{u.iqr}</TableCell>
                    <TableCell sx={{ fontSize: 11, fontFamily: "monospace" }}>[{u.lowerFence}, {u.upperFence}]</TableCell>
                    <TableCell sx={{ fontSize: 11.5 }}>{u.skew}</TableCell>
                    <TableCell><Chip label={u.outliers} size="small" sx={{ fontSize: 10, fontWeight: 700, background: "#dcfce7", color: "#166534" }} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Step 2.3: Bivariate Analysis + Charts */}
          <Typography sx={{ fontWeight: 800, fontSize: 16, mb: 1 }}>Step 2.3 — Bivariate Analysis: Categorical Chi-Square + Cramér's V + Welch's T-Test</Typography>
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 14, mb: 0.5 }}>Contract Type vs Actual Churn Rate (%)</Typography>
                  <Typography sx={{ fontSize: 11.5, color: "#64748b", mb: 1.5 }}>
                    Chi-Square = 1,184.60 | p-value = 5.86 × 10⁻²⁵⁸ | Cramér's V = <strong>0.410</strong> (Strongest Categorical Predictor)
                  </Typography>
                  <Box sx={{ height: 220 }}>
                    <Bar
                      data={{
                        labels: ["Month-to-month (3,875)", "One year (1,473)", "Two year (1,695)"],
                        datasets: [{
                          label: "Churn Rate (%)",
                          data: [42.71, 11.27, 2.83],
                          backgroundColor: ["#dc2626", "#f59e0b", "#16a34a"],
                          borderRadius: 8,
                        }],
                      }}
                      options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 50 } } }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 14, mb: 0.5 }}>Top 5 Categorical Drivers (Ranked by Cramér's V)</Typography>
                  <Typography sx={{ fontSize: 11.5, color: "#64748b", mb: 1.5 }}>
                    <strong>p-value</strong> checks if relationship exists; <strong>Cramér's V (0 to 1)</strong> measures HOW STRONG it is!
                  </Typography>
                  {BIVARIATE_CHI2_TOP5.map((row) => (
                    <Box key={row.feature} sx={{ py: 0.9, borderBottom: "1px dashed #e2e8f0" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ fontWeight: 800, fontSize: 12.5 }}>{row.feature}</Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Chip label={`χ² = ${row.chi2}`} size="small" sx={{ fontSize: 10, height: 20 }} />
                          <Chip label={`V = ${row.cramersV}`} size="small" sx={{ fontSize: 10, height: 20, fontWeight: 800, background: "#dbeafe", color: "#1e40af" }} />
                        </Box>
                      </Box>
                      <Typography sx={{ fontSize: 11, color: "#475569", mt: 0.3 }}>
                        {row.breakdown.map((b) => `${b.category}: ${b.churnRate}% churn`).join(" · ")}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <FormulaBox
            title="Chi-Square Independence Test & Cramér's V"
            formula="Expected E = (Row Total × Col Total) / Grand Total  |  χ² = Σ (O - E)² / E  |  Cramér's V = √( χ² / (n × (min(r, c) - 1)) )"
            breakdown={[
              { sym: "Contract Example", desc: "Month-to-month Expected E = (3875 × 1869) / 7043 = 1,028.3 churners. Actual Observed O = 1,655! That huge jump pushes χ² = 1,184.60." },
              { sym: "Welch's T-Test", desc: "Compares means of Churned (y=1) vs Retained (y=0) WITHOUT assuming equal group variances (equal_var=False)." },
            ]}
          />

          {/* Welch's T-Test Table */}
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "12px", mb: 3 }}>
            <Table size="small">
              <TableHead sx={{ background: "#f8fafc" }}>
                <TableRow>
                  {["Numerical Feature", "Churned Mean (y=1)", "Retained Mean (y=0)", "Welch T-Stat", "P-Value", "Business Insight"].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 800, fontSize: 11.5 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {WELCH_TTEST_RESULTS.map((w) => (
                  <TableRow key={w.feature}>
                    <TableCell sx={{ fontWeight: 800, fontSize: 12 }}>{w.feature}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#dc2626", fontSize: 12 }}>{w.churnedMean}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#16a34a", fontSize: 12 }}>{w.retainedMean}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: 12 }}>{w.tStat}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: 11.5 }}>{w.pValue}</TableCell>
                    <TableCell sx={{ fontSize: 11.5, color: "#475569" }}>{w.insight}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Step 2.4 Correlation */}
          <Card sx={{ borderRadius: "14px", border: "1px solid #e2e8f0", mb: 2 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 14.5, mb: 0.5 }}>Step 2.4 — Pearson Correlation With Churn (One-Hot Encoded 5 Categoricals + 3 Numerics)</Typography>
              <Typography sx={{ fontSize: 11.5, color: "#64748b", mb: 2 }}>
                Pearson <code>r ∈ [-1, +1]</code> requires numbers, so 5 categoricals (Contract, InternetService, PaymentMethod, PaperlessBilling, SeniorCitizen) are dummy-encoded via <code>pd.get_dummies(..., drop_first=True)</code>. Notice <strong>Fiber optic (+0.308)</strong> raises churn tendency while <strong>tenure (-0.352)</strong> and <strong>Two year (-0.302)</strong> sharply reduce it!
              </Typography>
              <Box sx={{ height: 260 }}>
                <Bar
                  data={{
                    labels: CORRELATION_WITH_CHURN.map((c) => c.feature),
                    datasets: [{
                      label: "Pearson r with Churn_Binary",
                      data: CORRELATION_WITH_CHURN.map((c) => c.r),
                      backgroundColor: CORRELATION_WITH_CHURN.map((c) => (c.r >= 0 ? "#dc2626" : "#16a34a")),
                      borderRadius: 6,
                    }],
                  }}
                  options={{ indexAxis: "y", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { min: -0.45, max: 0.45 } } }}
                />
              </Box>
            </CardContent>
          </Card>

          <InterviewCritiqueBox
            answer="My EDA suite computes overall KPIs (26.54% churn rate across 7,043 customers), univariate dispersion & IQR outlier fences, Chi-Square + Cramér's V for categorical associations (identifying Contract V=0.410 and OnlineSecurity V=0.347 as top drivers), Welch's unequal-variance T-tests for numerical separation (churners average 17.98 months tenure vs 37.57 retained), and Pearson correlations after One-Hot encoding."
            warnings={[
              "Correlation does NOT equal causation (e.g., Fiber optic users pay more & often have M2M contracts; Fiber itself doesn't automatically cause churn).",
              "Code uses Welch's T-test rather than the Mann-Whitney U test mentioned in the docstring, and runs EDA on all 7,043 rows before train/test splitting (safe only because EDA isn't used for automated feature selection)."
            ]}
          />
        </Box>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          PIPELINE 3: PREPROCESSING & FEATURE ENGINEERING
         ═══════════════════════════════════════════════════════════════════ */}
      {activeStep === 3 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 22, mb: 1 }}>
            Pipeline 3 of 8 — Data Preprocessing & Feature Engineering (src/preprocessing.py)
          </Typography>
          <EasyAnalogy
            text="Imagine 100 job resumes arriving in Word, PDF, handwritten notes, and missing phone numbers. Before judging candidates fairly, HR standardizes every resume onto one structured scorecard. TelcoPreprocessor does the exact same thing: it cleans dirty blanks, invents 5 smart new clues ('Feature Engineering'), translates text into 0/1 flags ('One-Hot Encoding'), scales numbers onto a level playing field ('StandardScaler'), and saves the rulebook (.joblib) for future customers!"
          />

          <FlowDiagram
            steps={[
              { label: "Raw Data", sub: "7,043 × 21", color: "#0f172a" },
              { label: "clean_raw_data()", sub: "Dedup ID + Impute 11 NaNs", color: "#0284c7" },
              { label: "engineer_features()", sub: "+5 smart cols (26 total)", color: "#7c3aed" },
              { label: "Separate X & y", sub: "Drop ID & Churn -> 24 inputs", color: "#ea580c" },
              { label: "One-Hot + Scale", sub: "30 encoded + 8 Z-scaled = 38", color: "#16a34a" },
              { label: "Stratified Split", sub: "5,634 Train / 1,409 Test", color: "#dc2626" },
            ]}
          />

          {/* Step 1: Smart Imputation vs EDA */}
          <FormulaBox
            title="Cleaning & Smart Domain Imputation (11 Blank TotalCharges)"
            formula="TotalCharges = pd.to_numeric(TotalCharges, errors='coerce')  ==>  NaN replaced with: MonthlyCharges * np.maximum(tenure, 1)"
            breakdown={[
              { sym: "Actual Example (1371-DWPAZ)", desc: "tenure = 0 months, MonthlyCharges = $56.05, Raw TotalCharges = ' ' (blank) -> Imputed TotalCharges = $56.05 × max(0, 1) = $56.05!" },
              { sym: "vs EDA", desc: "Remember: EDA used .fillna(0), whereas Preprocessing imputes MonthlyCharges * 1. Always mention this distinction in interviews!" },
            ]}
          />

          {/* Step 2: 5 Engineered Features */}
          <Typography sx={{ fontWeight: 800, fontSize: 16, mt: 2.5, mb: 1 }}>✨ The 5 Domain-Specific Engineered Features Explained</Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { name: "1. TotalServices (0–8)", formula: "Sum of (col == 'Yes') across 8 add-ons (Phone, MultiLines, Sec, Backup, DevProt, TechSupp, TV, Movies)", ex: "7590-VHVEG has OnlineBackup=Yes only → TotalServices = 1. 5575-GNVDE has 3 → 3." },
              { name: "2. StreamingBundle (0–2)", formula: "(StreamingTV == 'Yes') + (StreamingMovies == 'Yes')", ex: "Captures entertainment lock-in. Both Yes = 2, One Yes = 1, Neither = 0." },
              { name: "3. SecurityTechSupport (0–2)", formula: "(OnlineSecurity == 'Yes') + (TechSupport == 'Yes')", ex: "Measures protective/sticky support services. 7795-CFOCW has both → 2." },
              { name: "4. MonthlyToTotalRatio", formula: "MonthlyCharges / (TotalCharges + 1e-5)  [+1e-5 prevents divide-by-zero!]", ex: "New customer 7590-VHVEG: 29.85 / 29.85 = 1.00. Veteran 5575-GNVDE: 56.95 / 1889.50 = 0.0301." },
              { name: "5. TenureCohort (4 buckets)", formula: "pd.cut(tenure, bins=[-1,12,24,48,72], labels=['0-1yr','1-2yr','2-4yr','4-6yr'])", ex: "Discretizes continuous months into lifecycle cohorts (right-inclusive intervals)." },
              { name: "+ Interaction: HighRiskPersonaFlag", formula: "(Contract=='Month-to-month') * (Internet=='Fiber optic') * (TechSupport=='No')", ex: "Multiply 1×1×1 = 1 ONLY if all 3 risk factors collide! Customer 9237-HQITU = 1." },
            ].map((f, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Card sx={{ height: "100%", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: 13, color: "#1e1b4b", mb: 0.5 }}>{f.name}</Typography>
                    <Box sx={{ p: 1, background: "#f1f5f9", borderRadius: "6px", fontFamily: "monospace", fontSize: 10.5, mb: 0.8 }}>{f.formula}</Box>
                    <Typography sx={{ fontSize: 11.5, color: "#475569" }}>{f.ex}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Before & After Real Customer Table */}
          <Typography sx={{ fontWeight: 800, fontSize: 16, mb: 1 }}>🔬 Exact Before-and-After Transformation on Real Customers (From Saved preprocessor.joblib!)</Typography>
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "12px", mb: 3 }}>
            <Table size="small">
              <TableHead sx={{ background: "#0f172a" }}>
                <TableRow>
                  {["Customer", "Stage", "tenure", "Monthly ($)", "Total ($)", "TotalServices", "Ratio", "HighRiskFlag", "Active One-Hot Flags (out of 30)"].map((h) => (
                    <TableCell key={h} sx={{ color: "#fff", fontWeight: 700, fontSize: 11 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, fontSize: 11.5 }}>7590-VHVEG (Stayed)</TableCell>
                  <TableCell><Chip label="BEFORE (Raw)" size="small" sx={{ fontSize: 10 }} /></TableCell>
                  <TableCell>1</TableCell><TableCell>$29.85</TableCell><TableCell>$29.85</TableCell><TableCell>—</TableCell><TableCell>—</TableCell><TableCell>—</TableCell>
                  <TableCell sx={{ fontSize: 11 }}>DSL, Month-to-month, Partner=Yes</TableCell>
                </TableRow>
                <TableRow sx={{ background: "#f0fdf4" }}>
                  <TableCell sx={{ fontWeight: 800, fontSize: 11.5 }}>7590-VHVEG (Vector)</TableCell>
                  <TableCell><Chip label="AFTER (Scaled)" size="small" sx={{ fontSize: 10, background: "#bbf7d0", color: "#166534", fontWeight: 700 }} /></TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: 11.5 }}>-1.2774</TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: 11.5 }}>-1.1603</TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: 11.5 }}>-0.9927</TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: 11.5 }}>-1.1460</TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: 11.5 }}>+2.9697</TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: 11.5 }}>-0.5851</TableCell>
                  <TableCell sx={{ fontSize: 11 }}>Partner_Yes=1, OnlineBackup_Yes=1...</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, fontSize: 11.5 }}>9237-HQITU (Churned)</TableCell>
                  <TableCell><Chip label="BEFORE (Raw)" size="small" sx={{ fontSize: 10 }} /></TableCell>
                  <TableCell>2</TableCell><TableCell>$70.70</TableCell><TableCell>$151.65</TableCell><TableCell>—</TableCell><TableCell>—</TableCell><TableCell>—</TableCell>
                  <TableCell sx={{ fontSize: 11 }}>Fiber, Month-to-month, TechSupp=No</TableCell>
                </TableRow>
                <TableRow sx={{ background: "#fef2f2" }}>
                  <TableCell sx={{ fontWeight: 800, fontSize: 11.5 }}>9237-HQITU (Vector)</TableCell>
                  <TableCell><Chip label="AFTER (Scaled)" size="small" sx={{ fontSize: 10, background: "#fecaca", color: "#991b1b", fontWeight: 700 }} /></TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: 11.5 }}>-1.2367</TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: 11.5 }}>+0.1974</TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: 11.5 }}>-0.9389</TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: 11.5 }}>-1.1460</TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: 11.5 }}>+1.0850</TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: 11.5, fontWeight: 800, color: "#dc2626" }}>+1.7092</TableCell>
                  <TableCell sx={{ fontSize: 11 }}>PhoneService_Yes=1, Fiber optic=1...</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <CodeBlock
            title="fit_transform() vs transform() & Stratified Splitting"
            file="src/preprocessing.py"
            code={`# 1. During training: learns scaler (mu, sigma) & dummy schema on historical dataset
encoded_cats = pd.get_dummies(features[self.one_hot_columns], drop_first=True, dtype=float) # -> 30 columns
num_scaled   = self.scaler.fit_transform(features[self.numerical_cols])                   # -> 8 Z-scaled columns
X_transformed = pd.concat([num_df, encoded_cats], axis=1)                                 # -> 38 features!

# 2. Stratified Train/Test Split (preserves 26.54% churn ratio in BOTH sets!)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
) # -> Train: 5,634 (4,139 Stayed / 1,495 Left) | Test: 1,409 (1,035 Stayed / 374 Left)

# 3. For a SINGLE unseen live customer tomorrow: NEVER re-fit scaler! Align exact 38 columns:
num_scaled = self.scaler.transform(engineered[self.numerical_cols])
aligned = combined.reindex(columns=self.feature_names_in, fill_value=0.0)`}
          />

          <InterviewCritiqueBox
            answer="TelcoPreprocessor cleans the 11 blank TotalCharges via MonthlyCharges * max(tenure, 1), engineers 5 domain features (expanding 21 columns to 26), drops ID/target, one-hot encodes categoricals with drop_first=True to avoid the dummy variable trap (creating 30 columns), standardizes 8 numerics with StandardScaler (38 final features), saves the fitted pipeline to preprocessor.joblib, and stratifies an 80/20 split (5,634 train / 1,409 test)."
            warnings={[
              "CRITICAL LEAKAGE AUDIT: In run_pipeline.py, fit_transform(raw_df) runs BEFORE train_test_split(), meaning StandardScaler's mean & std saw the 1,409 test records! Best practice: split raw_df FIRST, fit_transform(raw_train), then transform(raw_test).",
              "Notice binary HighRiskPersonaFlag is in numerical_cols so it gets Z-scaled (-0.5851 / +1.7092), whereas SeniorCitizen passes through get_dummies() unscaled as 0/1!"
            ]}
          />
        </Box>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          PIPELINE 4: CLASSIFICATION ARENA (10 MODELS)
         ═══════════════════════════════════════════════════════════════════ */}
      {activeStep === 4 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 22, mb: 1 }}>
            Pipeline 4 of 8 — Classification Model Zoo & Soft Voting Ensemble (src/classification.py)
          </Typography>
          <EasyAnalogy
            text="Now the AI actually learns! We feed X_train (5,634 historical customers with 38 clues) and y_train (correct Stayed/Left answers) into 9 completely different machine learning brains — linear judges, decision trees, councils of 150 trees, neighbor-matchers, neural networks. We test each via 5-Fold Cross Validation, score them on 1,409 unseen test customers, then combine the Top 3 champions into a Soft Voting Ensemble!"
          />

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { name: "1. Logistic Regression", params: "C=1.0, solver='lbfgs', max_iter=1000", desc: "Computes weighted linear logit z, squashes through Sigmoid curve (0..1 probability). Top F1 (0.5952) & lowest Log Loss (0.4119)!" },
              { name: "2. Decision Tree", params: "max_depth=5, min_split=10, min_leaf=5", desc: "Learns human-readable if/else splitting questions. Capped at depth 5 to stop memorization (overfitting)." },
              { name: "3. Random Forest", params: "n_estimators=150, max_depth=8", desc: "Builds 150 independent trees on random bootstrap subsets & votes by majority. Strong ROC-AUC (0.8463)." },
              { name: "4. K-Nearest Neighbors (KNN)", params: "n_neighbors=15, weights='distance'", desc: "No training equation — finds 15 closest Euclidean neighbors in 38D space; closer neighbors get stronger votes." },
              { name: "5. Support Vector Machine", params: "C=1.0, kernel='rbf', probability=True", desc: "Builds maximum-margin curved RBF highway separating classes. Slowest to train (16.0s!)." },
              { name: "6. Naive Bayes (Gaussian)", params: "GaussianNB()", desc: "Applies Bayes' theorem assuming bell curves & feature independence. Fastest (0.14s) & highest raw Recall (82.62%!) though low precision." },
              { name: "7. AdaBoost", params: "n_estimators=100, lr=0.8", desc: "100 sequential decision stumps; misclassified customers receive higher sample weights for the next stump." },
              { name: "8. Gradient Boosting", params: "n_estimators=120, lr=0.08, depth=4", desc: "Trains 120 trees sequentially where each tree explicitly predicts the residual errors of prior trees." },
              { name: "9. Neural Network (MLP)", params: "hidden=(64,32), relu, adam, early_stop", desc: "38 inputs → 64 ReLU neurons → 32 ReLU neurons → 1 Churn output, stops early if validation stalls." },
              { name: "10. Soft Voting Ensemble ★", params: "Top 3 by ROC-AUC, voting='soft'", desc: "Averages predicted probabilities (not hard 0/1 votes!) of top 3 models (Logistic + Random Forest + AdaBoost) → Highest ROC-AUC (0.8496)!" },
            ].map((m, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Card sx={{ height: "100%", borderRadius: "12px", border: i === 9 ? "2px solid #0284c7" : "1px solid #e2e8f0", background: i === 9 ? "#f0f9ff" : "#fff" }}>
                  <CardContent sx={{ p: 1.8 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: 13 }}>{m.name}</Typography>
                      <Chip label={m.params} size="small" sx={{ fontSize: 9.5, fontFamily: "monospace", height: 20 }} />
                    </Box>
                    <Typography sx={{ fontSize: 11.8, color: "#475569" }}>{m.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Actual 10-Model Leaderboard Table + Chart */}
          <Typography sx={{ fontWeight: 800, fontSize: 16, mb: 1 }}>⚔️ Actual Saved Model Benchmark Results on 1,409 Unseen Test Customers</Typography>
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={12} md={5}>
              <Card sx={{ height: "100%", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 13.5, mb: 1 }}>Test ROC-AUC Comparison Across All 10 Models</Typography>
                  <Box sx={{ height: 310 }}>
                    <Bar
                      data={{
                        labels: CLASSIFICATION_BENCHMARK.map((b) => b.algo.replace(" (Top 3)", "").replace("Support Vector Machine", "SVM").replace("K-Nearest Neighbors", "KNN")),
                        datasets: [{
                          label: "Test ROC-AUC",
                          data: CLASSIFICATION_BENCHMARK.map((b) => b.rocAuc),
                          backgroundColor: CLASSIFICATION_BENCHMARK.map((b) => (b.highlight ? "#0284c7" : "#334155")),
                          borderRadius: 6,
                        }],
                      }}
                      options={{ indexAxis: "y", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { min: 0.78, max: 0.86 } } }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={7}>
              <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "14px" }}>
                <Table size="small">
                  <TableHead sx={{ background: "#0f172a" }}>
                    <TableRow>
                      {["Algorithm", "Acc", "Prec", "Recall", "Spec", "F1", "ROC-AUC", "LogLoss", "Time"].map((h) => (
                        <TableCell key={h} sx={{ color: "#fff", fontWeight: 700, fontSize: 10.5 }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {CLASSIFICATION_BENCHMARK.map((r) => (
                      <TableRow key={r.algo} sx={{ background: r.highlight ? "#f0f9ff" : "#fff" }}>
                        <TableCell sx={{ fontWeight: r.highlight ? 800 : 600, fontSize: 11 }}>{r.algo}</TableCell>
                        <TableCell sx={{ fontSize: 11 }}>{(r.acc * 100).toFixed(1)}%</TableCell>
                        <TableCell sx={{ fontSize: 11 }}>{(r.prec * 100).toFixed(1)}%</TableCell>
                        <TableCell sx={{ fontSize: 11 }}>{(r.rec * 100).toFixed(1)}%</TableCell>
                        <TableCell sx={{ fontSize: 11 }}>{(r.spec * 100).toFixed(1)}%</TableCell>
                        <TableCell sx={{ fontSize: 11, fontWeight: 700 }}>{r.f1}</TableCell>
                        <TableCell sx={{ fontSize: 11.5, fontWeight: 800, color: "#0284c7" }}>{r.rocAuc}</TableCell>
                        <TableCell sx={{ fontSize: 11 }}>{r.logLoss}</TableCell>
                        <TableCell sx={{ fontSize: 11 }}>{r.time}s</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>

          <FormulaBox
            title="Confusion Matrix Worked Math for Top Model: Voting Ensemble (1,409 Test Customers)"
            formula="CM = [[TN=940, FP=95], [FN=180, TP=194]]  ==>  Total = 940 + 95 + 180 + 194 = 1,409"
            breakdown={[
              { sym: "Accuracy", desc: "(194 + 940) / 1409 = 80.48% correct overall." },
              { sym: "Precision", desc: "TP / (TP + FP) = 194 / (194 + 95) = 67.13% (When it yells Churn, 67% really leave)." },
              { sym: "Recall (Sensitivity)", desc: "TP / (TP + FN) = 194 / (194 + 180) = 51.87% (Caught 194 of 374 churners at 0.50 threshold — why Pipeline 5 tunes threshold to 0.15!)." },
              { sym: "Specificity", desc: "TN / (TN + FP) = 940 / (940 + 95) = 90.82% (Leaves loyal customers undisturbed)." },
            ]}
          />

          <InterviewCritiqueBox
            answer="I benchmarked 9 supervised algorithms inside ModelArena using 5-fold StratifiedKFold CV (scoring F1 and ROC-AUC) followed by full fit on 5,634 rows and unseen evaluation on 1,409 rows. Logistic Regression achieved strong linear generalization (F1 0.5952, ROC-AUC 0.8484), while a Soft Voting Ensemble of the top 3 models pushed ROC-AUC to 0.8496. All 10 models serialize via joblib."
            warnings={[
              "Top-3 ensemble models are chosen using test-set ROC-AUC rather than CV ROC-AUC — in strict production, model selection should only inspect CV validation metrics.",
              "VotingClassifier.fit(X_train, y_train) re-fits fresh clones of the top 3 estimators rather than reusing already-trained weights."
            ]}
          />
        </Box>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          PIPELINE 5: EVALUATION, COST-BENEFIT & EXPLAINABILITY
         ═══════════════════════════════════════════════════════════════════ */}
      {activeStep === 5 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 22, mb: 1 }}>
            Pipeline 5 — Evaluation, Profit-Optimal Thresholds & Retention AI (evaluation.py + explainability.py)
          </Typography>
          <EasyAnalogy
            text="Notice something shocking from Pipeline 4: at the default 0.50 cutoff, the Voting Ensemble missed 180 real churners! Why wait until you're 50% sure someone is quitting if sending a $20 discount saves a $140 loss? By sliding the threshold down from 0.50 to 0.15, Net Business Profit swings from -$7,700 LOSS to +$22,960 PROFIT (+$30,660 turnaround!)."
          />

          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {/* Cost-Benefit Profit Curve Chart */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 14, mb: 0.5 }}>💰 Cost-Benefit Net Profit Curve Across 37 Thresholds</Typography>
                  <Typography sx={{ fontSize: 11.5, color: "#64748b", mb: 1.5 }}>
                    Formula: <code>Net = (TP × $100) − (FP × $20) − (FN × $140)</code>. Peak: <strong>+$22,960 at t=0.15</strong> (TP=369, FP=662, FN=5)! Default t=0.50 loses <strong>-$7,700</strong>!
                  </Typography>
                  <Box sx={{ height: 240 }}>
                    <Line
                      data={{
                        labels: COST_BENEFIT_DATA.thresholds,
                        datasets: [{
                          label: "Net Business Value ($)",
                          data: COST_BENEFIT_DATA.netProfits,
                          borderColor: "#16a34a",
                          backgroundColor: "rgba(22,163,74,0.12)",
                          fill: true,
                          tension: 0.3,
                        }],
                      }}
                      options={{ responsive: true, maintainAspectRatio: false, scales: { x: { title: { display: true, text: "Decision Threshold" } }, y: { title: { display: true, text: "Net Value ($)" } } } }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Bias-Variance Chart */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 14, mb: 0.5 }}>⚖️ Bias-Variance Curve (Random Forest max_depth: 2 → 20)</Typography>
                  <Typography sx={{ fontSize: 11.5, color: "#64748b", mb: 1.5 }}>
                    Depth 2: Underfits (Train 21.6%, Test 22.2%). Depth 6: Sweet spot (Test Error drops to <strong>19.94%</strong>). Depth 16–20: Overfits badly (Train error drops to <strong>0.20%</strong> while Test Error climbs back up to <strong>21.22%</strong>)!
                  </Typography>
                  <Box sx={{ height: 240 }}>
                    <Line
                      data={{
                        labels: BIAS_VARIANCE_CURVE.depths.map((d) => `Depth ${d}`),
                        datasets: [
                          { label: "Training Error (Memorization)", data: BIAS_VARIANCE_CURVE.trainError, borderColor: "#0284c7", tension: 0.25 },
                          { label: "Test Error (Generalization)", data: BIAS_VARIANCE_CURVE.testError, borderColor: "#dc2626", tension: 0.25 },
                        ],
                      }}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Local Explainability & Retention Playbook Rules */}
          <Typography sx={{ fontWeight: 800, fontSize: 16, mb: 1 }}>🔎 Local Risk Rules vs Global Importance + Prescriptive Playbook (src/explainability.py)</Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", borderRadius: "12px", border: "1px solid #fecaca", background: "#fef2f2" }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 13.5, color: "#991b1b", mb: 1 }}>Risk Drivers (Pushing Toward Churn)</Typography>
                  {[
                    "Month-to-month Contract → +32% Churn Risk (CRITICAL: zero switching friction)",
                    "New Customer (tenure ≤ 6 months) → +24% Churn Risk (HIGH: steepest drop-off window)",
                    "Fiber optic + No TechSupport → +18% Churn Risk (HIGH: outage frustration)",
                    "Electronic check Payment → +12% Churn Risk (MEDIUM: manual non-auto renewal)",
                    "MonthlyCharges ≥ $80 → +14% Churn Risk (MEDIUM: price sensitivity)",
                  ].map((r, i) => <Typography key={i} sx={{ fontSize: 11.8, color: "#7f1d1d", mb: 0.5 }}>• {r}</Typography>)}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", borderRadius: "12px", border: "1px solid #bbf7d0", background: "#f0fdf4" }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 13.5, color: "#166534", mb: 1 }}>Protective Drivers & Prescriptive Playbook</Typography>
                  {[
                    "One/Two year Contract (-28%) · Tenure ≥ 36m (-22%) · TechSupport (-14%) · Auto-Pay (-12%)",
                    "Action 1 (M2M & p>0.35): Annual Contract Upgrade with 15% Discount (-35% est.)",
                    "Action 2 (No TechSupport): Complimentary 3-Month VIP Tech Support (-18% est.)",
                    "Action 3 (Non-Automatic Pay): $15 Auto-Pay Enrollment Bill Credit (-12% est.)",
                    "Action 4 (Monthly > $85): All-in-One Entertainment Value Bundle (-15% est.)",
                  ].map((r, i) => <Typography key={i} sx={{ fontSize: 11.8, color: "#14532d", mb: 0.5 }}>• {r}</Typography>)}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <InterviewCritiqueBox
            answer="Beyond ROC-AUC (0.8496) and PR-AUC (0.6690), I built a cost-sensitive decision optimizer sweeping 37 probability thresholds. Given asymmetric churn costs ($140 missed churn FN vs $20 retention offer FP and $100 saved TP), shifting threshold from 0.50 to 0.15 catches 369/374 churners and swings profit by +$30,660."
            warnings={[
              "CRITICAL CODE DISTINCTION: Local risk weights (+32%, +24%, +18%) and playbook reductions (-35%) are expert-defined heuristic rules, NOT mathematically decomposed SHAP values! Also notice global_importances on Voting Ensemble fell back to uniform 0.0263 weights because VotingClassifier lacked direct feature_importances_ at top level!"
            ]}
          />
        </Box>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          PIPELINE 6 (OFFICIAL 5/8): CLUSTERING & 3D PCA
         ═══════════════════════════════════════════════════════════════════ */}
      {activeStep === 6 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 22, mb: 1 }}>
            Pipeline 6 (Official Step 5/8) — Unsupervised Clustering & 3D PCA (src/clustering_pca.py)
          </Typography>
          <EasyAnalogy
            text="Now we hide the 'Churn' answer completely! We ask AI: 'Look at these 5,634 customers across 38 scaled behaviors and discover natural tribes!' K-Means drops 4 digital magnets that iteratively settle at the center of 4 customer tribes. Then, since human eyes can't plot 38 dimensions, PCA compresses all 38 features down to 3 visual coordinates (PC1, PC2, PC3) preserving 64.4% of variance for 3D Plotly scatter!"
          />

          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 14, mb: 0.5 }}>📉 Elbow Inertia & Silhouette Validation (K = 2 to 7)</Typography>
                  <Typography sx={{ fontSize: 11.5, color: "#64748b", mb: 1.5 }}>
                    Inertia falls smoothly from <strong>19,697 (K=2)</strong> to <strong>14,087 (K=4)</strong> and <strong>11,380 (K=7)</strong>. Silhouette peaks gently around <strong>0.2530 (K=5)</strong> and <strong>0.2479 (K=4)</strong>.
                  </Typography>
                  <Box sx={{ height: 220 }}>
                    <Bar
                      data={{
                        labels: ELBOW_SILHOUETTE_DATA.kValues.map((k) => `K = ${k}`),
                        datasets: [{ label: "K-Means Inertia (WCSS)", data: ELBOW_SILHOUETTE_DATA.inertias, backgroundColor: ["#94a3b8", "#94a3b8", "#0284c7", "#94a3b8", "#94a3b8", "#94a3b8"], borderRadius: 6 }],
                      }}
                      options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 14, mb: 0.5 }}>🌀 Full 38-Feature PCA Scree & Cumulative Variance</Typography>
                  <Typography sx={{ fontSize: 11.5, color: "#64748b", mb: 1.5 }}>
                    PC1 explains <strong>38.68%</strong>, PC2 adds <strong>17.13%</strong> (55.82%), PC3 reaches <strong>64.41%</strong>. Top 10 PCs retain <strong>85.12%</strong> of all 38 dimensions! DBSCAN (`eps=2.5`) flagged <strong>0.64%</strong> outliers.
                  </Typography>
                  <Box sx={{ height: 220 }}>
                    <Line
                      data={{
                        labels: PCA_SEGMENTATION_VARIANCE.components,
                        datasets: [
                          { label: "Individual Variance %", data: PCA_SEGMENTATION_VARIANCE.explained, borderColor: "#0284c7", tension: 0.2 },
                          { label: "Cumulative Variance %", data: PCA_SEGMENTATION_VARIANCE.cumulative, borderColor: "#7c3aed", tension: 0.2 },
                        ],
                      }}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* 4 Customer Personas Table + Bug Warning */}
          <Typography sx={{ fontWeight: 800, fontSize: 16, mb: 1 }}>👥 The 4 Extracted K-Means Personas (And a Crucial Code Bug!)</Typography>
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "12px", mb: 2 }}>
            <Table size="small">
              <TableHead sx={{ background: "#f8fafc" }}>
                <TableRow>
                  {["Cluster", "Persona Label", "Customers", "Share %", "Avg Tenure", "Avg Monthly", "Churn Rate"].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 800, fontSize: 11.5 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {CLUSTER_PERSONAS.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell sx={{ fontWeight: 800 }}>{p.id}</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>{p.name}</TableCell>
                    <TableCell>{p.size}</TableCell>
                    <TableCell>{p.sharePct}%</TableCell>
                    <TableCell>{p.avgTenure} mo</TableCell>
                    <TableCell>${p.avgMonthly}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#dc2626" }}>{p.churnRate}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <InterviewCritiqueBox
            answer="I applied K-Means (K=4), Agglomerative Clustering (Ward linkage on 2,500 rows), and DBSCAN density clustering (eps=2.5, identifying 0.64% noise) over the 38 scaled features, validated via Elbow Inertia and Silhouette analysis, then projected the space via 3D PCA preserving 64.4% variance in 3 axes."
            warnings={[
              "INTERVIEW-WINNING BUG CATCH! Look at the persona averages above: all 4 clusters suspiciously averaged ~32 months tenure & ~26% churn! WHY? Because run_pipeline.py called seg.fit_clustering(X_train, raw_df.iloc[:len(X_train)])! Since train_test_split() SHUFFLED X_train, its index did NOT match raw_df.iloc[:5634]! Fixing it with raw_df.loc[X_train.index] reveals dramatically sharper real segment differences!"
            ]}
          />
        </Box>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          PIPELINE 7 (OFFICIAL 6/8): REGRESSION LAB
         ═══════════════════════════════════════════════════════════════════ */}
      {activeStep === 7 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 22, mb: 1 }}>
            Pipeline 7 (Official Step 6/8) — Numeric Regression Lab (src/regression.py)
          </Typography>
          <EasyAnalogy
            text="Instead of Yes/No Churn, Regression predicts a continuous dollar number: TotalCharges! Notice how amazing math works: TotalCharges roughly equals tenure × MonthlyCharges. Ordinary straight-line regressions struggle (R²=0.686 simple, 0.929 multiple), but Degree-2 Polynomial Regression multiplies tenure × MonthlyCharges directly — skyrocketing R² to 0.9991 and slashing average dollar error from $474 down to just $47.30!"
          />

          <FlowDiagram
            steps={[
              { label: "Copy raw_df", sub: "Drop 11 NaN TotalCharges -> 7,032", color: "#0f172a" },
              { label: "Prevent Leakage", sub: "Drop TotalCharges from X inputs", color: "#dc2626" },
              { label: "80/20 Split", sub: "5,625 Train / 1,407 Test", color: "#0284c7" },
              { label: "7 Configurations", sub: "Linear, Poly-2, Ridge, Lasso", color: "#7c3aed" },
              { label: "Evaluate", sub: "MAE, MSE, RMSE, R², Adj R²", color: "#16a34a" },
            ]}
          />

          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "14px", mb: 3 }}>
            <Table size="small">
              <TableHead sx={{ background: "#0f172a" }}>
                <TableRow>
                  {["Regression Configuration", "R² Score", "Adjusted R²", "MAE ($)", "RMSE ($)", "MSE", "Zeroed Coefs (Feature Selection)"].map((h) => (
                    <TableCell key={h} sx={{ color: "#fff", fontWeight: 700, fontSize: 11 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {REGRESSION_BENCHMARK.map((r) => (
                  <TableRow key={r.model} sx={{ background: r.highlight ? "#ecfdf5" : "#fff" }}>
                    <TableCell sx={{ fontWeight: r.highlight ? 800 : 600, fontSize: 12 }}>{r.model}</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: r.highlight ? "#16a34a" : "#0284c7", fontSize: 12 }}>{r.r2}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{r.adjR2}</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>${r.mae}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>${r.rmse}</TableCell>
                    <TableCell sx={{ fontSize: 11.5, fontFamily: "monospace" }}>{r.mse.toLocaleString()}</TableCell>
                    <TableCell><Chip label={r.zeroed} size="small" sx={{ fontSize: 10, fontWeight: 700, background: r.zeroed > 0 ? "#fef3c7" : "#f1f5f9" }} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <FormulaBox
            title="L2 Ridge vs L1 Lasso Regularization (Why Lasso Zeroed 10 Features)"
            formula="Ridge (L2): Loss = MSE + α * Σ(β_j²)   |   Lasso (L1): Loss = MSE + α * Σ|β_j|"
            breakdown={[
              { sym: "Ridge (α=1 & α=100)", desc: "Shrinks large weights smoothly toward 0 without eliminating them (Zeroed Coefs = 0)." },
              { sym: "Lasso (α=0.1 & α=1.0)", desc: "Sharp diamond penalty drives useless feature coefficients to EXACTLY ZERO — automatically discarding 5 features at α=0.1 and 10 features at α=1.0!" },
            ]}
          />

          <InterviewCritiqueBox
            answer="I dropped 11 blank TotalCharges records (7,032 clean rows), removed TotalCharges from features to prevent leakage, and benchmarked 7 regressors. Degree-2 Polynomial expansion over [tenure, MonthlyCharges, TotalServices] (9 quadratic/interaction features) jumped R² to 0.9991 by capturing tenure × MonthlyCharges, while Lasso(alpha=1.0) performed automatic sparsity selection by zeroing 10 redundant features."
            warnings={[
              "Target TotalCharges is historical accumulated spend, NOT future 12-month CLV. Also note app.py's scatter visualization plots a heuristic tenure * MonthlyCharges * 0.99 proxy rather than calling reg_benchmark directly."
            ]}
          />
        </Box>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          PIPELINE 8 (OFFICIAL 7/8 & 8/8): MATH, Q-LEARNING RL & GA
         ═══════════════════════════════════════════════════════════════════ */}
      {activeStep === 8 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 22, mb: 1 }}>
            Pipeline 8 (Steps 7/8 & 8/8) — Math From Scratch, Q-Learning RL & Genetic Algorithms
          </Typography>

          {/* 7/8: Math Foundations */}
          <Typography sx={{ fontWeight: 800, fontSize: 17, mt: 1, mb: 1 }}>📐 Step 7/8 — Mathematical Foundations (src/math_explainers.py)</Typography>
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: "100%", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 13.5, mb: 1 }}>1. Shannon Information Gain Ranking</Typography>
                  <Box sx={{ height: 190 }}>
                    <Bar
                      data={{
                        labels: INFO_GAIN_RANKING.map((f) => f.feature),
                        datasets: [{ label: "Information Gain (bits)", data: INFO_GAIN_RANKING.map((f) => f.ig), backgroundColor: "#7c3aed", borderRadius: 6 }],
                      }}
                      options={{ indexAxis: "y", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: "100%", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 13.5, mb: 0.5 }}>2. PCA Eigen Algebra Verified (Error = {PCA_SCRATCH_MATH.verificationError})</Typography>
                  <Typography sx={{ fontSize: 11, color: "#64748b", mb: 1 }}>
                    On 500 rows × 8 numerics, Cov(Z) eigendecomposition confirms <code>Σ·v₁ = λ₁·v₁</code> to float64 precision! PC1 (50.70%) + PC2 (21.08%) = <strong>71.78%</strong>.
                  </Typography>
                  <Box sx={{ height: 170 }}>
                    <Bar
                      data={{
                        labels: ["PC1", "PC2", "PC3", "PC4", "PC5"],
                        datasets: [{ label: "Variance %", data: PCA_SCRATCH_MATH.explainedPct, backgroundColor: "#0284c7", borderRadius: 6 }],
                      }}
                      options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: "100%", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 13.5, mb: 0.5 }}>3. Curse of Dimensionality (Contrast Collapse)</Typography>
                  <Typography sx={{ fontSize: 11, color: "#64748b", mb: 1 }}>
                    Adding Gaussian noise dims (38 → 113) collapses relative distance contrast <code>(d_max−d_min)/d_min</code> from <strong>24.65</strong> to <strong>0.69</strong>!
                  </Typography>
                  <Box sx={{ height: 170 }}>
                    <Line
                      data={{
                        labels: CURSE_EXPERIMENT.dimensions,
                        datasets: [{ label: "Distance Contrast Ratio", data: CURSE_EXPERIMENT.contrastRatios, borderColor: "#dc2626", tension: 0.25 }],
                      }}
                      options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* 8/8 Part A: Q-Learning RL */}
          <Typography sx={{ fontWeight: 800, fontSize: 17, mb: 1 }}>🎮 Step 8/8 Part A — Reinforcement Learning: Q-Learning Retention Agent (src/reinforcement_learning.py)</Typography>
          <EasyAnalogy
            text="Supervised ML predicts WHO will leave; Reinforcement Learning learns WHAT OFFER TO GIVE THEM so the company earns maximum long-term profit! We built a 12-State telecom video game (3 Churn Risks × 2 Customer Value Tiers × 2 Contracts) with 5 Offer Actions ($0 No Incentive to $40 Annual Lock-in). Across 3,500 simulated episodes, the Q-Learning AI plays trial-and-error, gets penalized -$100 - cost if a customer churns, rewarded +(2×MonthlyVal) - cost if retained, and discovers a genius 12-state Q-Table!"
          />

          <FormulaBox
            title="Bellman Optimality Q-Table Update (α=0.1, γ=0.90, ε: 1.0 → 0.05)"
            formula="Q(s, a)  ←  Q(s, a) + α * [ reward + γ * max_a' Q(s', a') − Q(s, a) ]"
            breakdown={[
              { sym: "12 States", desc: "(Risk: Low/Med/High) × (Value: <$65 / $65+) × (Contract: M2M / Annual)" },
              { sym: "5 Actions", desc: "A0: No Incentive ($0) | A1: 15% Discount ($12, +28%) | A2: Streaming ($7, +22%) | A3: Annual Lock-in $40 Credit (+60% & upgrades Contract->Annual!) | A4: VIP TechSupport ($5, +32%)" },
            ]}
          />

          <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
            {RL_ACTIONS.map((act) => (
              <Grid item xs={12} sm={6} md={2.4} key={act.id}>
                <Card sx={{ height: "100%", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc" }}>
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography sx={{ fontSize: 10, fontWeight: 800, color: "#0284c7" }}>ACTION {act.id}</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#0f172a", my: 0.3 }}>{act.name}</Typography>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#16a34a" }}>Cost: ${act.cost} | Boost: {act.boost}</Typography>
                    <Typography sx={{ fontSize: 10.8, color: "#64748b", mt: 0.4 }}>{act.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={12} md={5}>
              <Card sx={{ height: "100%", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 13.5, mb: 1 }}>RL Agent Reward Convergence (3,500 Episodes)</Typography>
                  <Box sx={{ height: 260 }}>
                    <Line
                      data={{
                        labels: RL_REWARD_PROGRESSION.labels,
                        datasets: [{ label: "Rolling Avg Episode Reward", data: RL_REWARD_PROGRESSION.rewards, borderColor: "#16a34a", backgroundColor: "rgba(22,163,74,0.12)", fill: true, tension: 0.3 }],
                      }}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={7}>
              <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "14px", maxHeight: 330 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      {["State", "Churn Risk", "Value Tier", "Contract", "Learned Optimal Action ★", "Cost", "Q-Value"].map((h) => (
                        <TableCell key={h} sx={{ background: "#0f172a", color: "#fff", fontWeight: 700, fontSize: 10.5 }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {RL_POLICY_TABLE.map((row) => (
                      <TableRow key={row.state}>
                        <TableCell sx={{ fontWeight: 800, fontSize: 11 }}>S{row.state}</TableCell>
                        <TableCell sx={{ fontSize: 11 }}>{row.risk}</TableCell>
                        <TableCell sx={{ fontSize: 11 }}>{row.value}</TableCell>
                        <TableCell sx={{ fontSize: 11 }}>{row.contract}</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: 11, color: "#0284c7" }}>{row.action}</TableCell>
                        <TableCell sx={{ fontSize: 11 }}>{row.cost}</TableCell>
                        <TableCell sx={{ fontWeight: 800, fontSize: 11, color: "#16a34a" }}>{row.qVal}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* 8/8 Part B: Genetic Algorithm */}
          <Typography sx={{ fontWeight: 800, fontSize: 17, mb: 1 }}>🧬 Step 8/8 Part B — Genetic Algorithm Hyperparameter Optimizer (src/genetic_algorithm.py)</Typography>
          <EasyAnalogy
            text="Random Forest has 5 tuning knobs (n_estimators, max_depth, min_samples_split, min_samples_leaf, criterion) with 720+ combinations. Instead of brute-forcing every combo, Genetic Algorithm mimics Darwinian evolution! A 'Chromosome' is one hyperparameter combo. We spawn 10 random models, score them using 3-Fold CV ROC-AUC ('Fitness'), copy the top 2 unchanged ('Elitism'), pair strong parents via Tournament Selection, swap genes via Uniform Crossover, mutate 25% of genes, and evolve over 5 Generations!"
          />

          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 13.5, mb: 1 }}>5-Generation Fitness Evolution (3-Fold CV ROC-AUC)</Typography>
                  <Box sx={{ height: 210 }}>
                    <Line
                      data={{
                        labels: GA_EVOLUTION.generations.map((g) => `Generation ${g}`),
                        datasets: [
                          { label: "Best Fitness (Elite ROC-AUC)", data: GA_EVOLUTION.bestFitness, borderColor: "#7c3aed", tension: 0.2 },
                          { label: "Population Mean ROC-AUC", data: GA_EVOLUTION.meanFitness, borderColor: "#94a3b8", borderDash: [5, 5], tension: 0.2 },
                        ],
                      }}
                      options={{ responsive: true, maintainAspectRatio: false, scales: { y: { min: 0.835, max: 0.852 } } }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", borderRadius: "14px", border: "1px solid #e2e8f0", background: "#faf5ff" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 14.5, color: "#581c87", mb: 1 }}>🏆 Evolved Optimal Random Forest Chromosome (0.8495 AUC)</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                    {Object.entries(GA_EVOLUTION.bestGenes).map(([k, v]) => (
                      <Chip key={k} label={`${k} = ${v}`} sx={{ fontFamily: "monospace", fontWeight: 800, background: "#fff", border: "1px solid #d8b4fe", color: "#581c87" }} />
                    ))}
                  </Box>
                  <Typography sx={{ fontSize: 12, color: "#4c1d95", lineHeight: 1.6 }}>
                    Notice how population mean fitness climbed from <strong>0.8407</strong> in Gen 1 to <strong>0.8471</strong> by Gen 5 as weak hyperparameter combinations died off and elite genes (<code>max_depth=5</code>, <code>criterion='entropy'</code>) dominated the gene pool!
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          STEP 9: LIVE SIMULATOR, SELF-CHECK QUIZ & INTERVIEW Q&A
         ═══════════════════════════════════════════════════════════════════ */}
      {activeStep === 9 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 22, mb: 1 }}>
            Step 9 — Interactive Telco Customer Simulator, Quizzes & Interview Mastery
          </Typography>

          {/* Interactive Simulator connecting FE + Classification + RL + Playbook */}
          <Card sx={{ borderRadius: "16px", border: "1px solid #e2e8f0", mb: 4, background: "#f8fafc" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 16, mb: 1 }}>🎛️ End-to-End Live Inference & RL Policy Simulator (Simulating app.py)</Typography>
              <Typography sx={{ fontSize: 12, color: "#64748b", mb: 2 }}>
                Modify customer details below to watch Feature Engineering, Churn Probability, Heuristic Risk Drivers, and the Trained Q-Learning Action react simultaneously!
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Contract</InputLabel>
                        <Select value={simContract} label="Contract" onChange={(e) => setSimContract(e.target.value)}>
                          <MenuItem value="Month-to-month">Month-to-month</MenuItem>
                          <MenuItem value="One year">One year</MenuItem>
                          <MenuItem value="Two year">Two year</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>InternetService</InputLabel>
                        <Select value={simInternet} label="InternetService" onChange={(e) => setSimInternet(e.target.value)}>
                          <MenuItem value="Fiber optic">Fiber optic</MenuItem>
                          <MenuItem value="DSL">DSL</MenuItem>
                          <MenuItem value="No">No</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>TechSupport</InputLabel>
                        <Select value={simTech} label="TechSupport" onChange={(e) => setSimTech(e.target.value)}>
                          <MenuItem value="No">No</MenuItem>
                          <MenuItem value="Yes">Yes</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>PaymentMethod</InputLabel>
                        <Select value={simPayment} label="PaymentMethod" onChange={(e) => setSimPayment(e.target.value)}>
                          <MenuItem value="Electronic check">Electronic check</MenuItem>
                          <MenuItem value="Mailed check">Mailed check</MenuItem>
                          <MenuItem value="Credit card (automatic)">Credit card (automatic)</MenuItem>
                          <MenuItem value="Bank transfer (automatic)">Bank transfer (automatic)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: 11.5, fontWeight: 700 }}>Tenure: {simTenure} months</Typography>
                      <Slider min={1} max={72} value={simTenure} onChange={(_, v) => setSimTenure(v)} />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: 11.5, fontWeight: 700 }}>Monthly Bill: ${simMonthly}</Typography>
                      <Slider min={20} max={118} step={0.5} value={simMonthly} onChange={(_, v) => setSimMonthly(v)} />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2, background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                      <Box>
                        <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: "#64748b" }}>ESTIMATED CHURN RISK</Typography>
                        <Typography sx={{ fontSize: 28, fontWeight: 800, color: simProb >= 0.5 ? "#dc2626" : "#16a34a" }}>{(simProb * 100).toFixed(1)}%</Typography>
                      </Box>
                      <Chip label={`${simRiskTier} RISK`} sx={{ fontWeight: 800, background: simProb >= 0.5 ? "#fee2e2" : "#dcfce7", color: simProb >= 0.5 ? "#991b1b" : "#166534" }} />
                    </Box>
                    <Typography sx={{ fontSize: 11.5, fontFamily: "monospace", color: "#334155", mb: 1 }}>
                      Engineered: Cohort=<strong>{simCohort}</strong> | Total=${simTotalCharges} | Ratio={simRatio} | HighRiskFlag=<strong>{simHighRisk}</strong>
                    </Typography>
                    <Box sx={{ p: 1.5, background: "#eff6ff", borderRadius: "8px", border: "1px solid #bfdbfe" }}>
                      <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#1d4ed8" }}>🤖 Q-Learning Optimal Policy (State S{matchedRlPolicy.state}):</Typography>
                      <Typography sx={{ fontSize: 12.5, fontWeight: 800, color: "#0f172a" }}>{matchedRlPolicy.action}</Typography>
                      <Typography sx={{ fontSize: 11, color: "#475569" }}>Cost: {matchedRlPolicy.cost} | Expected Future Q-Value: +{matchedRlPolicy.qVal}</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Interactive MCQ Quiz */}
          <Typography sx={{ fontWeight: 800, fontSize: 18, mb: 1.5 }}>✅ Test Your Understanding Across All 8 Pipelines</Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {PIPELINE_QUIZZES.map((quiz, idx) => {
              const selected = quizAnswers[idx];
              return (
                <Grid item xs={12} md={6} key={idx}>
                  <Card sx={{ height: "100%", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                    <CardContent sx={{ p: 2 }}>
                      <Chip label={quiz.pipeline} size="small" sx={{ fontSize: 10, fontWeight: 700, mb: 1, background: "#eef2ff", color: "#3730a3" }} />
                      <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 1 }}>{quiz.q}</Typography>
                      <RadioGroup value={selected ?? ""} onChange={(e) => setQuizAnswers({ ...quizAnswers, [idx]: Number(e.target.value) })}>
                        {quiz.options.map((opt, oIdx) => (
                          <FormControlLabel key={oIdx} value={oIdx} control={<Radio size="small" />} label={<Typography sx={{ fontSize: 12 }}>{opt}</Typography>} />
                        ))}
                      </RadioGroup>
                      {selected !== undefined && (
                        <Alert severity={selected === quiz.answer ? "success" : "error"} sx={{ mt: 1, fontSize: 11.5 }}>
                          <strong>{selected === quiz.answer ? "Correct! " : "Not quite! "}</strong>{quiz.explanation}
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Master Interview Q&A Bank */}
          <Typography sx={{ fontWeight: 800, fontSize: 18, mb: 1.5 }}>🎤 Technical Interview Defense Bank</Typography>
          {INTERVIEW_QA_BANK.map((qa, i) => (
            <Accordion key={i} sx={{ mb: 1, borderRadius: "12px !important", border: "1px solid #e2e8f0", "&:before": { display: "none" } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a" }}>{qa.q}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
                <Typography sx={{ fontSize: 12.8, color: "#334155", lineHeight: 1.65 }}>{qa.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      {/* ── SEQUENTIAL STEP NAVIGATION ("ONE PIPELINE AT A TIME") ── */}
      <Box sx={{ mt: 4, pt: 2.5, borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1.5 }}>
        <Button
          variant="outlined"
          disabled={activeStep === 0}
          startIcon={<ArrowBackIcon />}
          onClick={() => { setActiveStep((s) => Math.max(0, s - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px" }}
        >
          {activeStep > 0 ? `Previous: ${TABS[activeStep - 1].label}` : "Start of Guide"}
        </Button>
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>
          Viewing Stage {activeStep + 1} of {TABS.length}
        </Typography>
        <Button
          variant="contained"
          disabled={activeStep === TABS.length - 1}
          endIcon={<ArrowForwardIcon />}
          onClick={() => { setActiveStep((s) => Math.min(TABS.length - 1, s + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px", background: "#1e1b4b" }}
        >
          {activeStep < TABS.length - 1 ? `Next: ${TABS[activeStep + 1].label}` : "Masterclass Completed!"}
        </Button>
      </Box>
    </Box>
  );
};

export default TelcoCustomerAiSystemStudio;
