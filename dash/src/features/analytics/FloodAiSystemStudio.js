// dash/src/features/analytics/FloodAiSystemStudio.js
// Complete Step-by-Step Interactive Deep Dive into Flood Assist AI (project-main)
// Covers Stages 0-9 (316,616-pt CFD Dataset, Ingestion, Hydrodynamic Profiling, cKDTree IDW R²=0.98853,
// 80x30 Grid Quantization, Shallow-Water Physics, 36-State Basin Registry, Express/LLM Orchestration, React Voice UI & Live Simulator)

import React, { useState } from "react";
import {
  Box, Typography, Grid, Card, CardContent, Tabs, Tab, Chip,
  TextField, InputAdornment, Accordion, AccordionSummary, AccordionDetails,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Alert, Slider, FormControl, InputLabel, Select, MenuItem,
  RadioGroup, FormControlLabel, Radio
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StorageIcon from "@mui/icons-material/Storage";
import LayersIcon from "@mui/icons-material/Layers";
import TimelineIcon from "@mui/icons-material/Timeline";
import MemoryIcon from "@mui/icons-material/Memory";
import GridOnIcon from "@mui/icons-material/GridOn";
import SpeedIcon from "@mui/icons-material/Speed";
import PublicIcon from "@mui/icons-material/Public";
import ApiIcon from "@mui/icons-material/Api";
import WebIcon from "@mui/icons-material/Web";
import QuizIcon from "@mui/icons-material/Quiz";
import CodeIcon from "@mui/icons-material/Code";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import SmartToyIcon from "@mui/icons-material/SmartToy";

import { Chart as ChartJS, registerables } from "chart.js";
import { Bar, Line } from "react-chartjs-2";

import {
  FLOOD_OVERVIEW, CFD_COLUMNS, RAW_CFD_SAMPLES, CFD_SCENARIOS_13,
  STREAMWISE_PROFILE_25, EVALUATION_METRICS_TABLE, SAMPLE_BASINS,
  FLOOD_QUIZZES, FLOOD_INTERVIEW_QA
} from "./floodProjectData";
import FloodMentorChatWidget from "./FloodMentorChatWidget";

ChartJS.register(...registerables);

// ═════════════════════════════════════════════════════════════════════════════
// REUSABLE EDUCATIONAL UI COMPONENTS
// ═════════════════════════════════════════════════════════════════════════════

const CodeBlock = ({ title, file, code }) => (
  <Box sx={{ my: 2, borderRadius: "12px", overflow: "hidden", border: "1px solid #1e293b", background: "#0f172a" }}>
    <Box sx={{ px: 2, py: 1, background: "#1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: "#5eead4", display: "flex", alignItems: "center", gap: 0.8 }}>
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
  <Box sx={{ my: 2, p: 2.2, borderRadius: "12px", background: "#f0fdfa", border: "1px solid #99f6e4" }}>
    <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#0f766e", textTransform: "uppercase", letterSpacing: "0.8px", mb: 1 }}>
      📐 {title}
    </Typography>
    <Box sx={{ p: 1.5, borderRadius: "8px", background: "#ffffff", border: "1px solid #ccfbf1", fontFamily: "'Fira Code', monospace", fontSize: 13.2, fontWeight: 700, color: "#134e4a", overflowX: "auto" }}>
      {formula}
    </Box>
    {breakdown.length > 0 && (
      <Box sx={{ mt: 1.2, display: "flex", flexDirection: "column", gap: 0.4 }}>
        {breakdown.map((b, i) => (
          <Typography key={i} sx={{ fontSize: 11.5, color: "#115e59" }}>
            • <strong>{b.sym}</strong>: {b.desc}
          </Typography>
        ))}
      </Box>
    )}
  </Box>
);

const EasyAnalogy = ({ title = "Understand Like a Beginner (Zero-Jargon Intuition)", text }) => (
  <Box sx={{ my: 2, p: 2.2, borderRadius: "14px", background: "linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)", border: "1px solid #a5f3fc" }}>
    <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#0e7490", mb: 0.6, display: "flex", alignItems: "center", gap: 0.8 }}>
      <LightbulbIcon sx={{ fontSize: 18, color: "#0891b2" }} /> {title}
    </Typography>
    <Typography sx={{ fontSize: 13, color: "#164e63", lineHeight: 1.65 }}>{text}</Typography>
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
          <strong>Important Engineering Note:</strong> {w}
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
          <Box sx={{ flex: 1, p: 1.4, borderRadius: "10px", background: "#fff", border: `1.5px solid ${s.color || "#0f766e"}`, textAlign: "center", minWidth: 115 }}>
            <Typography sx={{ fontSize: 10, fontWeight: 800, color: s.color || "#0d9488", textTransform: "uppercase" }}>Step {i + 1}</Typography>
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
const FloodAiSystemStudio = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [mentorOpen, setMentorOpen] = useState(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({});

  // Interactive Hydrodynamic Simulator State (replicates floodPredictor.js exact math!)
  const [simDistanceKm, setSimDistanceKm] = useState(5.0);
  const [simRainfallMm, setSimRainfallMm] = useState(50);
  const [simDamRelease, setSimDamRelease] = useState(0);
  const [simDischargeBase, setSimDischargeBase] = useState(1.2);
  const [simDepthM, setSimDepthM] = useState(0.68);
  const [simStateName, setSimStateName] = useState("Bihar");

  // Replicate floodPredictor.js formulas verbatim on frontend for instant educational feedback
  const simQueryX = +(FLOOD_OVERVIEW.xMin + (Math.min(Math.max(0.1, simDistanceKm), 50.0) / 50.0) * FLOOD_OVERVIEW.xRange).toFixed(3);
  const simIx = Math.min(79, Math.max(0, Math.round(((simQueryX - FLOOD_OVERVIEW.xMin) / FLOOD_OVERVIEW.xRange) * 79)));
  // Sample realistic slice velocity near simQueryX from actual 25 streamwise slices
  const closestSlice = STREAMWISE_PROFILE_25.reduce((best, cur) =>
    Math.abs(cur.x - simQueryX) < Math.abs(best.x - simQueryX) ? cur : best, STREAMWISE_PROFILE_25[0]
  );
  const simQScale = +(Math.max(0.2, simDischargeBase) + (simRainfallMm / 100.0) * 0.6 + (simDamRelease / 500.0) * 0.5).toFixed(3);
  const simQFactor = Math.pow(simQScale, 0.4);
  const simBaseV = closestSlice.meanV;
  const simScaledV = +(simBaseV * simQFactor).toFixed(4);
  const simEffH = +(Math.max(0.2, simDepthM) * Math.pow(simQScale, 0.3)).toFixed(3);
  const simCelerity = +(Math.sqrt(9.81 * simEffH) + 1.2 * Math.max(0.1, simScaledV)).toFixed(3);
  const simArrivalMin = +((Math.max(50, simDistanceKm * 1000) / simCelerity) / 60.0).toFixed(2);
  const simHazard = +(simScaledV * (simEffH + 0.5)).toFixed(3);
  const simRiskTier =
    simHazard < 0.75 ? "Low" : simHazard < 1.25 ? "Moderate" : simHazard < 2.0 ? "High" : "Critical / Flash Flood";
  const selectedBasin = SAMPLE_BASINS.find((b) => b.state === simStateName) || SAMPLE_BASINS[0];

  const TABS = [
    { label: "0. Architecture & 316k CFD", icon: <StorageIcon sx={{ fontSize: 17 }} /> },
    { label: "1. Ingestion & Parser", icon: <LayersIcon sx={{ fontSize: 17 }} /> },
    { label: "2. Hydrodynamic Profiling", icon: <TimelineIcon sx={{ fontSize: 17 }} /> },
    { label: "3. Spatial ML (cKDTree IDW)", icon: <MemoryIcon sx={{ fontSize: 17 }} /> },
    { label: "4. 80×30 Grid & Speedup", icon: <GridOnIcon sx={{ fontSize: 17 }} /> },
    { label: "5. Wave Physics & DEFRA", icon: <SpeedIcon sx={{ fontSize: 17 }} /> },
    { label: "6. 36-State Basin Registry", icon: <PublicIcon sx={{ fontSize: 17 }} /> },
    { label: "7. Express API & LLM", icon: <ApiIcon sx={{ fontSize: 17 }} /> },
    { label: "8. React UI & 8-Lang Voice", icon: <WebIcon sx={{ fontSize: 17 }} /> },
    { label: "9. Simulator, Quiz & Q&A", icon: <QuizIcon sx={{ fontSize: 17 }} /> },
  ];

  const matchesSearch = (text) => {
    if (!searchTerm.trim()) return false;
    return text.toLowerCase().includes(searchTerm.toLowerCase());
  };

  return (
    <Box sx={{ fontFamily: "'DM Sans', sans-serif", color: "#1a1a2e", pb: 8 }}>
      {/* ── HERO HEADER BANNER ── */}
      <Box sx={{ background: "linear-gradient(135deg, #0f172a 0%, #134e4a 55%, #0f766e 100%)", borderRadius: "20px", p: { xs: 2.5, md: 4 }, color: "#fff", mb: 3, boxShadow: "0 10px 30px rgba(15,23,42,0.18)" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ maxWidth: 820 }}>
            <Chip label="CFD PHYSICS + SPATIAL ML + FULL-STACK LLM PLATFORM • ONE STAGE AT A TIME" size="small" sx={{ background: "rgba(94,234,212,0.18)", color: "#5eead4", fontWeight: 800, fontSize: 10.5, letterSpacing: "0.8px", mb: 1.2 }} />
            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: { xs: 22, md: 30 }, letterSpacing: "-0.4px", mb: 1 }}>
              Flood Assist AI — Hydrodynamic CFD & Safety System (A-to-Z Deep Dive)
            </Typography>
            <Typography sx={{ fontSize: 13.5, color: "#cbd5e1", lineHeight: 1.65, mb: 2.5 }}>
              Master every equation, fluid simulation file, ML spatial tree, quantized JSON grid, physics wave scaling formula, Express intent router, and React voice streaming pipeline inside <strong>project-main</strong> — backed by <strong>316,616 real CFD velocity field cells</strong> across 13 regimes (<strong>R² = 0.98853</strong>).
            </Typography>
          </Box>

          <Box sx={{ width: { xs: "100%", sm: 270 } }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Jump to concept (e.g. cKDTree, DEFRA, bilinear, dotenv)..."
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
                  "&:hover fieldset": { borderColor: "#5eead4" },
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              startIcon={<SmartToyIcon />}
              onClick={() => setMentorOpen(true)}
              sx={{
                mt: 1.2,
                textTransform: "none",
                fontWeight: 800,
                fontSize: 12,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #14b8a6 0%, #5eead4 100%)",
                color: "#0f172a",
                "&:hover": { background: "#99f6e4" },
              }}
            >
              Ask Flood AI Mentor (Knows Stage {activeStep})
            </Button>
          </Box>
        </Box>

        {/* Project Vital KPI Strip */}
        <Grid container spacing={1.5}>
          {[
            { k: "CFD Training Mesh", v: "316,616 pts", sub: "13 Hydrodynamic Regimes" },
            { k: "Spatial Accuracy", v: "0.98853 R²", sub: "RMSE 0.04245 · MAE 0.01681" },
            { k: "Peak Surge Zone", v: "2.1958 m/s", sub: "Hydraulic jump x = 6.5..8.5m" },
            { k: "Node Inference Grid", v: "80 × 30 Grid", sub: "2,400 cells (< 1ms lookup)" },
            { k: "Regional Coverage", v: "36 States/UTs", sub: "Indus, Ganga, Brahmaputra..." },
            { k: "Voice + LLM Stack", v: "8 Languages", sub: "OpenRouter / Ollama + React 18" },
          ].map((stat, i) => (
            <Grid item xs={6} sm={4} md={2} key={i}>
              <Box sx={{ p: 1.4, borderRadius: "12px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <Typography sx={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>{stat.k}</Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#5eead4", my: 0.2 }}>{stat.v}</Typography>
                <Typography sx={{ fontSize: 10, color: "#cbd5e1" }}>{stat.sub}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Quick Search Jump Pills */}
        {searchTerm.trim() && (
          <Box sx={{ mt: 2, p: 1.5, background: "rgba(15,23,42,0.7)", borderRadius: "10px", display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
            <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>Quick match tabs:</Typography>
            {[
              { tab: 0, keys: "cfd 316616 13 regimes velocity cellnumber coordinate architecture" },
              { tab: 1, keys: "ingestion parse_scenario scientific notation underscore bug csv float32" },
              { tab: 2, keys: "profile 25 slice hydraulic jump surge zone 2.1958 y_plane 0.03 0.30" },
              { tab: 3, keys: "ckdtree idw inverse distance weighting r2 0.98853 permutation 80/20 split" },
              { tab: 4, keys: "predictor_grid 80x30 2400 quantization bilinear interpolation math.round lookup" },
              { tab: 5, keys: "physics manning q^0.4 celerity sqrt(g*h) arrival time defra hazard index" },
              { tab: 6, keys: "36 states indian river basin kosi ganga brahmaputra dam ndrf seoc flooddata" },
              { tab: 7, keys: "express server chat predict ratelimit intent regex dotenv openrouter ollama" },
              { tab: 8, keys: "react vite app chatwindow voice speech api typewriter markdown localstorage" },
              { tab: 9, keys: "simulator calculator quiz interview defense limitations" },
            ].filter((item) => matchesSearch(item.keys)).map((m) => (
              <Button key={m.tab} size="small" variant="contained" onClick={() => setActiveStep(m.tab)} sx={{ fontSize: 11, textTransform: "none", background: "#0d9488" }}>
                Open {TABS[m.tab].label}
              </Button>
            ))}
          </Box>
        )}
      </Box>

      {/* ── STAGE NAVIGATION TABS ── */}
      <Box sx={{ borderBottom: "1px solid #e2e8f0", mb: 3, background: "#fff", borderRadius: "12px", px: 1 }}>
        <Tabs
          value={activeStep}
          onChange={(_, v) => setActiveStep(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTabs-indicator": { backgroundColor: "#0f766e", height: 3, borderRadius: "3px" },
            "& .MuiTab-root": { fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12.2, textTransform: "none", color: "#64748b", minHeight: 48, "&.Mui-selected": { color: "#0f766e" } },
          }}
        >
          {TABS.map((t, i) => (
            <Tab key={i} icon={t.icon} iconPosition="start" label={t.label} />
          ))}
        </Tabs>
      </Box>

      {/* ═══════════════════════════════════════════════════════════════════
          STAGE 0: ARCHITECTURE & 316K CFD DATASET
         ═══════════════════════════════════════════════════════════════════ */}
      {activeStep === 0 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 22, mb: 1 }}>
            Stage 0 — Project Architecture & The 316,616-Point CFD Dataset
          </Typography>
          <EasyAnalogy
            text="Real flood physics software (like ANSYS Fluent) takes hours to simulate water speed across thousands of points in a river channel. Flood Assist AI solves this by recording 316,616 real CFD simulation points upfront across 13 different flood scenarios (narrow bottlenecks, wide valleys, light & heavy discharges), training a blazing-fast spatial ML model (R² = 0.98853), compressing it into a lightweight 80×30 Node.js lookup grid, and coupling it with shallow-water wave equations + 36 Indian river basin emergency protocols!"
          />

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 14.5, mb: 1 }}>📁 Complete Repository Layout</Typography>
                  <CodeBlock
                    title="Dual-Runtime Python Offline Trainer + Node/React Live Platform"
                    file="project-main/"
                    code={`project-main/
 ├── back/
 │    ├── data/
 │    │    ├── dataset/            # 13 CFD ASCII/CSV regimes (316,616 total cells!)
 │    │    │    ├── 0.5_3_60/      # Q=0.5, W=3m, T=60s (y=0.03m & y=0.30m)
 │    │    │    ├── 1.5_3_30_20%/  # 20% channel constriction (V_max = 2.1958 m/s!)
 │    │    │    ├── 1.5_3_30_40%/  # 40% channel constriction choking regime
 │    │    │    ├── 1_3_30/, 1_3_60/, Velocity_0-8.0_*
 │    │    └── floodData.js        # All 36 Indian States/UTs basins, dams & helplines
 │    ├── ml/
 │    │    ├── train_model.py      # Ingest -> cKDTree IDW CV -> 80×30 Grid Export
 │    │    ├── predict.py          # Python CLI predictor with bilinear interpolation
 │    │    ├── predictor_grid.json # Exported 2,400-cell spatial lookup lattice
 │    │    ├── model_metadata.json # Validation R², 13 scenario stats & 25 X-slices
 │    │    └── trained_model.pkl   # Serialized Python regressor object
 │    ├── src/
 │    │    ├── ml/floodPredictor.js # < 1ms Node.js predictor + Manning & DEFRA physics
 │    │    ├── llm.js               # OpenRouter / Local Ollama provider switcher
 │    │    └── systemPrompt.js      # Physics + Basin + 4-part ChatGPT formatter
 │    └── server.js                 # Express API (/chat, /predict, /states, /health)
 └── front/                         # React 18 Vite UI + 8-language Voice + ML Cards`}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 14.5, mb: 0.5 }}>📊 Data Volume Across All 13 CFD Simulation Regimes</Typography>
                  <Typography sx={{ fontSize: 11.8, color: "#64748b", mb: 1.5 }}>
                    Every bar is an actual simulation file inside <code>back/data/dataset/</code>, totaling <strong>316,616 cells</strong> (largest single file: <code>1_3_30</code> with <strong>43,221 points</strong>!).
                  </Typography>
                  <Box sx={{ height: 320 }}>
                    <Bar
                      data={{
                        labels: CFD_SCENARIOS_13.map((s) => s.file.replace("Velocity_0-8.00_", "").replace("Velocity_0-8.0_", "").replace("\\Velocity_0-8.0", "/").replace("\\velocity_0-8.0", "/")),
                        datasets: [{ label: "CFD Mesh Cells", data: CFD_SCENARIOS_13.map((s) => s.samples), backgroundColor: "#0d9488", borderRadius: 5 }],
                      }}
                      options={{ indexAxis: "y", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Typography sx={{ fontWeight: 800, fontSize: 16, mb: 1 }}>🔬 Understanding All 8 Raw Columns & Sample CFD Rows</Typography>
          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            {CFD_COLUMNS.map((c, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card sx={{ height: "100%", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <CardContent sx={{ p: 1.6 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: 12, fontFamily: "monospace", color: "#0f766e" }}>{c.name}</Typography>
                      <Chip label={c.type} size="small" sx={{ height: 18, fontSize: 9.5 }} />
                    </Box>
                    <Typography sx={{ fontSize: 11.2, color: "#475569" }}>{c.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "12px" }}>
            <Table size="small">
              <TableHead sx={{ background: "#0f172a" }}>
                <TableRow>
                  {["Source File", "cell#", "x (m)", "y (m)", "z (m)", "V mag (m/s)", "Vx", "Vy", "Vz"].map((h) => (
                    <TableCell key={h} sx={{ color: "#fff", fontWeight: 700, fontSize: 11 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {RAW_CFD_SAMPLES.map((r, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700 }}>{r.file}</TableCell>
                    <TableCell sx={{ fontSize: 11.5 }}>{r.cell}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: 11.5 }}>{r.x}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: 11.5 }}>{r.y}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: 11.5 }}>{r.z}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace", fontWeight: 800, color: "#0d9488", fontSize: 11.5 }}>{r.v}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: 11.5 }}>{r.vx}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: 11.5 }}>{r.vy}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: 11.5 }}>{r.vz}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          STAGE 1: DATA INGESTION & FILENAME PARSER
         ═══════════════════════════════════════════════════════════════════ */}
      {activeStep === 1 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 22, mb: 1 }}>
            Stage 1 — CFD Data Ingestion & Scenario Metadata Parser (train_model.py)
          </Typography>
          <EasyAnalogy
            text="Notice something clever about the raw files in back/data/dataset/: there are NO discharge or constriction columns inside the numbers! Instead, engineers encode the experiment setup right inside the filename (like '1.5_3_30_20%\\velocity_0-8.0.03'). So train_model.py acts like a smart librarian reading both the folder label AND parsing scientific-notation numbers like 4.568016052E+00!"
          />

          <FlowDiagram
            steps={[
              { label: "os.walk(DATASET_DIR)", sub: "Finds 13 raw CFD files", color: "#0f172a" },
              { label: "Filter Extensions", sub: "Skips .json, .pkl, dotfiles", color: "#0284c7" },
              { label: "parse_scenario()", sub: "Extracts Q, W, T, Constr%, y", color: "#0d9488" },
              { label: "Delimiter Detect", sub: "sep=',' if ',' else whitespace", color: "#7c3aed" },
              { label: "parts[1:8] Slice", sub: "Drops cellnumber -> float32[7]", color: "#16a34a" },
              { label: "np.vstack()", sub: "Master array (316616, 7)", color: "#dc2626" },
            ]}
          />

          <CodeBlock
            title="Actual Ingestion & Scenario Parser Inside train_model.py"
            file="back/ml/train_model.py"
            code={`def parse_scenario(rel_path):
    q, w, dur, c, y_plane = 1.0, 3.0, 30.0, 0.0, 0.03
    path_lower = rel_path.lower()
    if "20%" in path_lower: c = 20.0
    elif "40%" in path_lower: c = 40.0
    if "0.5_3_60" in path_lower or "0.5 3 60" in path_lower: q, w, dur = 0.5, 3.0, 60.0
    # ... (matches 1.5 1.5 30, 1.5 4.5 30, 1_3_30, 1_3_60, etc.)
    if "0.3" in os.path.basename(path_lower) and "0.03" not in os.path.basename(path_lower):
        y_plane = 0.30

# Inside train_and_export():
with open(p, "r", errors="ignore") as f_obj:
    header = f_obj.readline()
    sep = "," if "," in header else None
    for line in f_obj:
        parts = [float(x.strip()) for x in (line.split(",") if sep else line.split())]
        pts.append(parts[1:8]) # Strictly drops parts[0] (cellnumber)!`}
          />

          <InterviewCritiqueBox
            answer="train_and_export() walks the 13 CFD regimes recursively, detects CSV vs multi-whitespace Fluent ASCII delimiters dynamically, converts scientific notation into compact float32 NumPy matrices, drops cellnumber via parts[1:8], and parses experimental metadata (Q, channel width, duration, constriction %, y-plane) from file paths."
            warnings={[
              "FANTASTIC INTERVIEW CATCH! Look at file 9 & 10 in model_metadata.json: '1.5_3_30_20%\\velocity_0-8.0.03' uses UNDERSCORES ('1.5_3_30'), whereas parse_scenario line 57 only checked SPACES ('1.5 3 30')! As a result, constriction_pct=20.0 matched accurately, while discharge_q stayed at default 1.0 instead of 1.5! Normalizing underscores/spaces fixes this bug instantly."
            ]}
          />
        </Box>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          STAGE 2: HYDRODYNAMIC STREAMWISE PROFILING (25 SLICES)
         ═══════════════════════════════════════════════════════════════════ */}
      {activeStep === 2 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 22, mb: 1 }}>
            Stage 2 — Exploratory Hydrodynamic Profiling Along All 25 Channel Slices
          </Typography>
          <EasyAnalogy
            text="Imagine walking down an 18.25-meter model river reach from upstream (x = -6.25m) to downstream (x = +12.00m), measuring water velocity every 73 cm (25 slices). Right near x = 6.5m to 8.5m, water hits a constriction / hydraulic jump — exploding in speed to 2.1958 m/s! That spatial velocity curve teaches engineers exactly where embankments risk bursting."
          />

          <Card sx={{ borderRadius: "16px", border: "1px solid #e2e8f0", mb: 3 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 14.5, mb: 0.5 }}>🌊 Longitudinal Velocity & Peak Surge Profile (25 Streamwise X-Slices)</Typography>
              <Typography sx={{ fontSize: 11.8, color: "#64748b", mb: 2 }}>
                Watch Mean Velocity (teal) surge around <strong>x = 7.985 m</strong> (<strong>1.2227 m/s</strong>, Peak <strong>2.1958 m/s</strong>, Celerity <strong>4.269 m/s</strong> — High Hazard)! Also notice why <code>y=0.03m</code> vs <code>y=0.30m</code> behaves differently in the 13-regime table below!
              </Typography>
              <Box sx={{ height: 270 }}>
                <Line
                  data={{
                    labels: STREAMWISE_PROFILE_25.map((s) => `${s.x}m`),
                    datasets: [
                      { label: "Max Velocity (m/s)", data: STREAMWISE_PROFILE_25.map((s) => s.maxV), borderColor: "#dc2626", backgroundColor: "rgba(220,38,38,0.08)", fill: true, tension: 0.3 },
                      { label: "Mean Velocity (m/s)", data: STREAMWISE_PROFILE_25.map((s) => s.meanV), borderColor: "#0d9488", tension: 0.3 },
                    ],
                  }}
                  options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 2.4 } } }}
                />
              </Box>
            </CardContent>
          </Card>

          <Typography sx={{ fontWeight: 800, fontSize: 16, mb: 1 }}>📋 Complete 13-Regime Hydrodynamic Breakdown (From model_metadata.json)</Typography>
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "12px" }}>
            <Table size="small">
              <TableHead sx={{ background: "#0f172a" }}>
                <TableRow>
                  {["CFD Regime File", "Q", "W (m)", "Constr %", "y-plane", "Samples", "Mean V", "Max V", "Val R²", "Val RMSE"].map((h) => (
                    <TableCell key={h} sx={{ color: "#fff", fontWeight: 700, fontSize: 10.5 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {CFD_SCENARIOS_13.map((s, i) => (
                  <TableRow key={i} sx={{ background: s.vMax > 2.18 ? "#fef2f2" : "#fff" }}>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700 }}>{s.file}</TableCell>
                    <TableCell sx={{ fontSize: 11 }}>{s.q}</TableCell>
                    <TableCell sx={{ fontSize: 11 }}>{s.width}</TableCell>
                    <TableCell sx={{ fontSize: 11 }}>{s.constr}%</TableCell>
                    <TableCell sx={{ fontSize: 11 }}>{s.y}m</TableCell>
                    <TableCell sx={{ fontSize: 11 }}>{s.samples.toLocaleString()}</TableCell>
                    <TableCell sx={{ fontSize: 11 }}>{s.vMean} m/s</TableCell>
                    <TableCell sx={{ fontSize: 11, fontWeight: 800, color: s.vMax > 2.18 ? "#dc2626" : "#0f172a" }}>{s.vMax} m/s</TableCell>
                    <TableCell sx={{ fontSize: 11, fontWeight: 800, color: "#0d9488" }}>{s.r2}</TableCell>
                    <TableCell sx={{ fontSize: 11 }}>{s.rmse}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          STAGE 3: SPATIAL ML TRAINING (cKDTree k=4 IDW)
         ═══════════════════════════════════════════════════════════════════ */}
      {activeStep === 3 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 22, mb: 1 }}>
            Stage 3 — Spatial ML Training: SciPy cKDTree + Inverse Distance Weighting (R² = 0.98853)
          </Typography>
          <EasyAnalogy
            text="Fluid velocity inside a turbulent river constriction curves wildly up and down — a straight-line regression would miss those peaks badly. Instead, imagine placing all 80% training CFD cells into a 3D crystal map (a cKDTree). When asked to predict velocity at ANY new test point (x, y, z), the tree finds the 4 physically closest training neighbors in microseconds and computes an Inverse-Distance Weighted (IDW) average: closer neighbors get louder votes!"
          />

          <FormulaBox
            title="k = 4 Inverse Distance Weighting (IDW) Spatial Regression Formula"
            formula="w_j = 1 / max(d_j, 1e-6)   |   W_j = w_j / Σ_{m=1..4}(w_m)   |   V_pred = Σ_{j=1..4}( W_j * V_train[j] )"
            breakdown={[
              { sym: "80/20 Random Permutation", desc: "For every regime: perm = np.random.permutation(n), 80% builds cKDTree(x, y, z), 20% unseen coordinates evaluate prediction error." },
              { sym: "1e-6 Guard", desc: "Prevents zero-division infinity error if a query coordinate lands identically atop a training mesh point." },
              { sym: "Sample-Weighted Total R²", desc: "Aggregates each file's R² weighted by its test sample size -> Overall Weighted R² = 0.98853, RMSE = 0.04245 m/s, MAE = 0.01681 m/s!" },
            ]}
          />

          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 13.5, mb: 1 }}>Per-Regime 80/20 cKDTree IDW Validation R²</Typography>
                  <Box sx={{ height: 270 }}>
                    <Bar
                      data={{
                        labels: CFD_SCENARIOS_13.map((s) => s.file.replace("Velocity_0-8.00_", "").replace("Velocity_0-8.0_", "").replace("\\Velocity_0-8.0", "/").replace("\\velocity_0-8.0", "/")),
                        datasets: [{ label: "Validation R²", data: CFD_SCENARIOS_13.map((s) => s.r2), backgroundColor: CFD_SCENARIOS_13.map((s) => (s.r2 > 0.99 ? "#0d9488" : "#f59e0b")), borderRadius: 5 }],
                      }}
                      options={{ indexAxis: "y", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { min: 0.95, max: 1.0 } } }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "14px" }}>
                <Table size="small">
                  <TableHead sx={{ background: "#0f172a" }}>
                    <TableRow>
                      {["Target Variable", "R²", "RMSE", "MAE", "How Computed in Code"].map((h) => (
                        <TableCell key={h} sx={{ color: "#fff", fontWeight: 700, fontSize: 11 }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {EVALUATION_METRICS_TABLE.map((m, i) => (
                      <TableRow key={i} sx={{ background: i === 0 ? "#f0fdfa" : "#fff" }}>
                        <TableCell sx={{ fontWeight: 800, fontSize: 12 }}>{m.target}</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: "#0d9488", fontSize: 12 }}>{m.r2}</TableCell>
                        <TableCell sx={{ fontSize: 11.5 }}>{m.rmse}</TableCell>
                        <TableCell sx={{ fontSize: 11.5 }}>{m.mae}</TableCell>
                        <TableCell sx={{ fontSize: 11, color: "#475569" }}>{m.method}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>

          <InterviewCritiqueBox
            answer="Each of the 13 CFD datasets undergoes an 80/20 split where SciPy's spatial cKDTree indexes 3D coordinates (x, y, z) and predicts test velocities using k=4 Inverse Distance Weighting. Sample-weighted validation achieves R² = 0.98853 (RMSE 0.04245 m/s) across 316,616 points."
            warnings={[
              "CRITICAL CODE CRITIQUE: In train_model.py lines 387–401, only velocity-magnitude (te[:, 3]) has its true R²/RMSE/MAE calculated! The Vx, Vy, and Vz metrics in model_metadata.json apply heuristic scaling factors (*0.999, *0.985, *0.991) rather than computing separate vector-component test errors."
            ]}
          />
        </Box>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          STAGE 4: 80x30 GRID QUANTIZATION & NODE.JS INFERENCE ENGINE
         ═══════════════════════════════════════════════════════════════════ */}
      {activeStep === 4 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 22, mb: 1 }}>
            Stage 4 — Compressing 316,616 Points Into an 80×30 Grid (Sub-Millisecond Node Inference)
          </Typography>
          <EasyAnalogy
            text="Our backend server runs on Node.js Express — it cannot easily unpickle Python objects or run SciPy KD-Trees every time someone chats! So Python pre-crunches all 316,616 heavy CFD points into an 80 × 30 miniature digital checkerboard (2,400 squares in predictor_grid.json). Now Node.js needs ZERO Python at runtime: it takes just ONE array multiplication (iz * 80 + ix) in under 1 millisecond!"
          />

          <FlowDiagram
            steps={[
              { label: "316,616 Points", sub: "Full CFD master_arr", color: "#0f172a" },
              { label: "Quantize Bins", sub: "nx=80 (dx=0.23m), nz=30 (dz=0.028m)", color: "#0284c7" },
              { label: "Cell Average", sub: "grid_sum / grid_cnt per bin", color: "#0d9488" },
              { label: "Gap Fill", sub: "Nearest observed Euclidean cell", color: "#7c3aed" },
              { label: "Export JSON", sub: "predictor_grid.json (2,400 cells)", color: "#ea580c" },
              { label: "Runtime Lookup", sub: "Py: Bilinear | Node: O(1) Snap", color: "#16a34a" },
            ]}
          />

          <CodeBlock
            title="Python Bilinear Interpolation (predict.py) vs Node.js O(1) Snap (floodPredictor.js)"
            file="train_model.py vs back/src/ml/floodPredictor.js"
            code={`# ── 1. PYTHON (MultiScenarioHydrodynamicRegressor): Continuous Bilinear Blend ──
qx = np.clip(((cx - x_min) / (x_max - x_min)) * (nx - 1), 0, nx - 1)
qz = np.clip(((cz - z_min) / (z_max - z_min)) * (nz - 1), 0, nz - 1)
# Blends 4 neighboring grid corners using fractional distances wx = qx - x0, wz = qz - z0!

// ── 2. NODE.JS (back/src/ml/floodPredictor.js): Sub-Millisecond O(1) Lookup ──
queryX = stats.x_min + (Math.min(km, 50.0) / 50.0) * stats.x_range; // Maps 0..50 km onto flume
const ix = Math.min(nx - 1, Math.max(0, Math.round(((clampedX - x_min) / (x_max - x_min)) * (nx - 1))));
const iz = Math.min(nz - 1, Math.max(0, Math.round(((clampedZ - z_min) / (z_max - z_min)) * (nz - 1))));
const cell = values[iz * nx + ix]; // -> Instant [v, vx, vy, vz] lookup!`}
          />

          <InterviewCritiqueBox
            answer="To bridge offline Python training and real-time Node.js inference without spawning child Python processes per chat turn, train_model.py rasterizes all 316,616 cells onto an 80×30 mean lattice (filling sparse corners via nearest-neighbor) and writes predictor_grid.json. While Python predict.py applies 4-corner bilinear interpolation, Node.js uses O(1) index snapping for sub-millisecond chat responsiveness."
            warnings={[
              "Notice a second important distinction: grid quantization averages across all 13 scenarios into a single 2D (x, z) lattice! Scenario variations (Q, rainfall, dam release) are then applied analytically via Manning's Q^0.4 power law rather than 5D interpolation."
            ]}
          />
        </Box>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          STAGE 5: OPEN-CHANNEL PHYSICS & DEFRA HAZARD RATING
         ═══════════════════════════════════════════════════════════════════ */}
      {activeStep === 5 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 22, mb: 1 }}>
            Stage 5 — Shallow-Water Physics & DEFRA Flood Hazard Index (floodPredictor.js)
          </Typography>
          <EasyAnalogy
            text="A flood wave actually travels FASTER than the water particles inside it! Think of pushing one domino at the start of a line: the ripple races forward while individual dominoes barely shift. That's why we compute Wave Celerity (c = √(g·h) + 1.2·V) — adding gravity-ripple speed plus flowing water push — to forecast exact arrival minutes and DEFRA human-danger scores!"
          />

          <FormulaBox
            title="The 5 Chained Hydrodynamic Equations Inside predictHydrodynamics()"
            formula={`1. Weather Modifier:   qScale = dischargeScale + (rainfallMm / 100)×0.6 + (damRelease / 500)×0.5
2. Manning Scaling:    V_scaled = V_base × (qScale ^ 0.4)   |   h_eff = h_nom × (qScale ^ 0.3)
3. Wave Celerity:      c = √(9.81 × h_eff) + 1.2 × max(0.1, V_scaled)
4. Arrival Time (s):   T = (distanceKm × 1000) / c
5. DEFRA Hazard Index: H = V_scaled × (h_eff + 0.5)`}
            breakdown={[
              { sym: "README Worked Check", desc: "Inputs: distanceKm=5.0, rainfallMm=50, dischargeScale=1.2 => qScale = 1.2 + (0.5×0.6) = 1.50 => V=0.17 m/s, h=0.76 m => c = √(9.81×0.76) + 1.2(0.17) = 2.93 m/s => T = 5000 / 2.93 = 1,706s ≈ 28.4 minutes!" },
              { sym: "DEFRA Hazard Tiers", desc: "H < 0.75 (Low) | 0.75–1.25 (Moderate: cars lose traction) | 1.25–2.0 (High: SUVs swept) | >= 2.0 (Critical / Flash Flood torrent)." },
            ]}
          />

          <Grid container spacing={2} sx={{ mt: 1 }}>
            {[
              { tier: "Low Hazard", range: "H < 0.75", bg: "#dcfce7", col: "#166534", desc: "Shallow water movement. Safe for adults with caution; secure ground equipment." },
              { tier: "Moderate Hazard", range: "0.75 ≤ H < 1.25", bg: "#fef9c3", col: "#854d0e", desc: "Hazardous to children, elderly, and standard cars (30 cm water can float vehicles!)." },
              { tier: "High Hazard", range: "1.25 ≤ H < 2.0", bg: "#ffedd5", col: "#9a3412", desc: "Sweeps SUVs away and damages masonry boundary walls. Evacuate to elevated shelters." },
              { tier: "Critical / Flash Flood", range: "H ≥ 2.0", bg: "#fee2e2", col: "#991b1b", desc: "Violent flood torrent. Immediate vertical evacuation to upper concrete floors + NDRF!" },
            ].map((h, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card sx={{ height: "100%", borderRadius: "12px", background: h.bg, border: `1px solid ${h.col}33` }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: 13.5, color: h.col }}>{h.tier}</Typography>
                    <Chip label={h.range} size="small" sx={{ my: 0.8, fontWeight: 800, fontSize: 10, background: "#fff", color: h.col }} />
                    <Typography sx={{ fontSize: 11.5, color: "#1e293b" }}>{h.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          STAGE 6: 36-STATE BASIN REGISTRY
         ═══════════════════════════════════════════════════════════════════ */}
      {activeStep === 6 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 22, mb: 1 }}>
            Stage 6 — Universal 36-State Basin Intelligence & 3-Tier Entity Resolver (floodData.js)
          </Typography>
          <EasyAnalogy
            text="Notice the README explicitly states: 'All manually added dummy placeholder data has been removed.' Instead, back/data/floodData.js catalogs EVERY SINGLE Indian State and Union Territory (36 total!) with its exact river basin, dams/barrages, flood season, physical drivers (Himalayan GLOFs, Nepal snowmelt, DVC dam releases, tidal locks), and official emergency helplines (SEOC 1070, NDRF 1078, Ambulance 108/112)!"
          />

          <FlowDiagram
            steps={[
              { label: "User Region Query", sub: "e.g. 'Bihar' or 'Kosi'", color: "#0f172a" },
              { label: "Tier 1: State Match", sub: "Matches all 36 State keys", color: "#0284c7" },
              { label: "Tier 2: River Keyword", sub: "Scans majorRivers arrays!", color: "#0d9488" },
              { label: "Tier 3: Global Fallback", sub: "getUniversalFloodGuidance()", color: "#7c3aed" },
            ]}
          />

          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "12px", mt: 2 }}>
            <Table size="small">
              <TableHead sx={{ background: "#0f172a" }}>
                <TableRow>
                  {["State / UT", "Basin System", "Major Rivers", "Peak Season", "Key Dams / Barrages", "Primary Flood Drivers"].map((h) => (
                    <TableCell key={h} sx={{ color: "#fff", fontWeight: 700, fontSize: 11 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {SAMPLE_BASINS.map((b) => (
                  <TableRow key={b.state}>
                    <TableCell sx={{ fontWeight: 800, fontSize: 12, color: "#0f766e" }}>{b.state}</TableCell>
                    <TableCell sx={{ fontSize: 11.5 }}>{b.basin}</TableCell>
                    <TableCell sx={{ fontSize: 11.5 }}>{b.rivers}</TableCell>
                    <TableCell sx={{ fontSize: 11 }}>{b.season}</TableCell>
                    <TableCell sx={{ fontSize: 11 }}>{b.dams}</TableCell>
                    <TableCell sx={{ fontSize: 11, color: "#475569" }}>{b.drivers}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          STAGE 7: EXPRESS BACKEND, INTENT ROUTER & LLM SWITCH
         ═══════════════════════════════════════════════════════════════════ */}
      {activeStep === 7 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 22, mb: 1 }}>
            Stage 7 — Express Server, Regex Intent Extraction & LLM Switch (server.js + llm.js)
          </Typography>
          <EasyAnalogy
            text="How does the chatbot avoid hallucinating fake flood arrival times? When you type 'I live 5 km downstream and it rained 50mm, when will flood arrive?', server.js intercepts your text BEFORE calling the LLM! It regex-extracts 5 km + 50 mm, executes predictHydrodynamics() in Node.js, injects the EXACT calculated arrival (~28 mins) & DEFRA hazard straight into buildSystemPrompt(), and commands the LLM to format the answer using a strict 4-step safety structure!"
          />

          <CodeBlock
            title="Live Hybrid ML + LLM Pipeline & Crucial ESM dotenv Pattern"
            file="back/server.js & back/src/llm.js"
            code={`// 1. Sliding-Window Rate Limiter: 40 req/min per IP (resets after 60,000 ms)
// 2. Hybrid ML Intent Interceptor inside POST /api/chat:
function detectPredictionIntent(message) {
  const isPredictive = ["predict", "arrival", "reach", "velocity", "wave", "forecast", "dam release"]
    .some(k => message.toLowerCase().includes(k));
  if (!isPredictive) return null;
  // Regex extracts km / meters (default 5.0 km) + rainfall (mm/cm)
  return predictHydrodynamics({ distanceKm, rainfallMm });
}
const systemPrompt = buildSystemPrompt({ state, language, predictionContext });
const reply = await callLLM([ { role: "system", content: systemPrompt }, ...history.slice(-12), { role: "user", content: message } ]);

// 3. Inside back/src/llm.js (CRITICAL ES MODULE ORDERING FIX!):
dotenv.config(); // MUST run here because static ESM imports evaluate BEFORE server.js executes!
const PROVIDER = (process.env.LLM_PROVIDER || "openrouter").toLowerCase();
// Supports OpenRouter (meta-llama/llama-3.3-70b-instruct:free, temp=0.4) OR local Ollama (llama3.2)`}
          />

          <InterviewCritiqueBox
            answer="server.js combines deterministic hydrodynamic ML telemetry with cloud/local LLMs via a retrieval-style intent hook: POST /api/chat runs regex entity extraction on predictive questions, computes velocity/celerity/arrival via floodPredictor.js, grounds the prompt with the user's state basin + helplines + mandatory 4-part Markdown format, and dispatches via llm.js's interchangeable OpenRouter/Ollama wrapper."
            warnings={[
              "Three sharp nuances to point out: (1) llm.js loads dotenv locally to avoid ES module import hoisting issues; (2) detectPredictionIntent regex (\\d+)\\s*(?:m|meters?) could misread 'm' abbreviations; (3) rainfall regex parses both '50 mm' and '5 cm' but forwards the raw number as rainfallMm without ×10 cm conversion."
            ]}
          />
        </Box>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          STAGE 8: REACT 18 FRONTEND, 8-LANGUAGE VOICE & TYPEWRITER STREAM
         ═══════════════════════════════════════════════════════════════════ */}
      {activeStep === 8 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 22, mb: 1 }}>
            Stage 8 — React 18 Vite Frontend, 8-Language Voice Input & Live ML Cards
          </Typography>
          <EasyAnalogy
            text="In a flood emergency, someone might not want to type in English! The React 18 + Vite frontend remembers your State & preferred Indian language in localStorage (flood-assist-prefs), lets you speak into your microphone using Web Speech API across 8 regional locales (Hindi, Bengali, Marathi, Tamil, Telugu, Gujarati, Punjabi, English), shows a color-coded ML Telemetry Card immediately when a forecast runs, and animates replies with a ChatGPT typewriter rhythm!"
          />

          <Grid container spacing={2.5} sx={{ mt: 1 }}>
            {[
              { file: "front/src/App.jsx", title: "State & Conversation Persistence", desc: "Manages 'flood-assist-prefs' & 'flood-assist-conversations' in localStorage; routes to Onboarding first if user hasn't picked state/language yet." },
              { file: "ChatWindow.jsx (Lines 5-120)", title: "8-Language Browser Voice Input", desc: "Wraps SpeechRecognition across en-IN, hi-IN, bn-IN, mr-IN, ta-IN, te-IN, gu-IN, pa-IN with live pulse indicator & interim transcript typing." },
              { file: "ChatWindow.jsx (Lines 56-79)", title: "Typewriter Stream & ML Cards", desc: "Streams 8 chars every 18ms for latest assistant turn, mounts embedded ML Prediction Card (Arrival Time, Velocity, Celerity, Flow Depth, Risk Badge), and parses Markdown cleanly!" },
            ].map((item, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card sx={{ height: "100%", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <CardContent sx={{ p: 2 }}>
                    <Chip label={item.file} size="small" sx={{ fontFamily: "monospace", fontSize: 10, mb: 1, background: "#f0fdfa", color: "#0f766e" }} />
                    <Typography sx={{ fontWeight: 800, fontSize: 13.5, mb: 0.6 }}>{item.title}</Typography>
                    <Typography sx={{ fontSize: 12, color: "#475569" }}>{item.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          STAGE 9: LIVE PHYSICS + ML SIMULATOR, QUIZZES & INTERVIEW Q&A
         ═══════════════════════════════════════════════════════════════════ */}
      {activeStep === 9 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 22, mb: 1 }}>
            Stage 9 — Interactive Flood Physics Simulator, Self-Check Quizzes & Interview Bank
          </Typography>

          {/* Interactive Flood Predictor Simulator matching floodPredictor.js */}
          <Card sx={{ borderRadius: "16px", border: "1px solid #99f6e4", mb: 4, background: "#f0fdfa" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 16, color: "#0f766e", mb: 1 }}>🎛️ Live Hydrodynamic Physics & 80×30 Grid Simulator (Replicating floodPredictor.js)</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small" sx={{ background: "#fff" }}>
                        <InputLabel>Select River Basin / State</InputLabel>
                        <Select value={simStateName} label="Select River Basin / State" onChange={(e) => setSimStateName(e.target.value)}>
                          {SAMPLE_BASINS.map((b) => <MenuItem key={b.state} value={b.state}>{b.state} — {b.basin}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: 11.5, fontWeight: 700 }}>Distance Upstream: {simDistanceKm} km</Typography>
                      <Slider min={0.5} max={50} step={0.5} value={simDistanceKm} onChange={(_, v) => setSimDistanceKm(v)} />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: 11.5, fontWeight: 700 }}>Rainfall Intensity: {simRainfallMm} mm</Typography>
                      <Slider min={0} max={250} step={5} value={simRainfallMm} onChange={(_, v) => setSimRainfallMm(v)} />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: 11.5, fontWeight: 700 }}>Dam Release: {simDamRelease} m³/s</Typography>
                      <Slider min={0} max={1500} step={50} value={simDamRelease} onChange={(_, v) => setSimDamRelease(v)} />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: 11.5, fontWeight: 700 }}>Channel Depth (h): {simDepthM} m | Base Q: {simDischargeBase}x</Typography>
                      <Slider min={0.3} max={4.0} step={0.1} value={simDepthM} onChange={(_, v) => setSimDepthM(v)} />
                      <Slider min={0.5} max={2.0} step={0.1} value={simDischargeBase} onChange={(_, v) => setSimDischargeBase(v)} />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2.2, background: "#fff", borderRadius: "14px", border: "1px solid #cbd5e1" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.2 }}>
                      <Box>
                        <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: "#64748b" }}>DEFRA FLOOD HAZARD INDEX (H)</Typography>
                        <Typography sx={{ fontSize: 28, fontWeight: 800, color: simHazard >= 1.25 ? "#dc2626" : "#0d9488" }}>{simHazard}</Typography>
                      </Box>
                      <Chip label={simRiskTier} sx={{ fontWeight: 800, background: simHazard >= 1.25 ? "#fee2e2" : "#ccfbf1", color: simHazard >= 1.25 ? "#991b1b" : "#115e59" }} />
                    </Box>
                    <Typography sx={{ fontSize: 11.5, fontFamily: "monospace", color: "#334155", mb: 1 }}>
                      Grid Lookup: x={simQueryX}m (cell ix={simIx}/79) → V_base={simBaseV} m/s → qScale={simQScale}x
                    </Typography>
                    <Grid container spacing={1} sx={{ mb: 1.2 }}>
                      {[
                        { l: "Scaled Velocity (V)", v: `${simScaledV} m/s` },
                        { l: "Effective Depth (h)", v: `${simEffH} m` },
                        { l: "Wave Celerity (c)", v: `${simCelerity} m/s` },
                        { l: "Est. Arrival Time", v: `${simArrivalMin} mins` },
                      ].map((stat, idx) => (
                        <Grid item xs={6} key={idx}>
                          <Box sx={{ p: 1, background: "#f8fafc", borderRadius: "8px" }}>
                            <Typography sx={{ fontSize: 10, color: "#64748b", fontWeight: 700 }}>{stat.l}</Typography>
                            <Typography sx={{ fontSize: 13.5, fontWeight: 800, color: "#0f172a" }}>{stat.v}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                    <Alert severity="info" sx={{ fontSize: 11.2 }}>
                      <strong>{selectedBasin.state}:</strong> {selectedBasin.rivers} | Key Structures: {selectedBasin.dams} | SEOC: 1070 / NDRF: 1078
                    </Alert>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Quizzes */}
          <Typography sx={{ fontWeight: 800, fontSize: 18, mb: 1.5 }}>✅ Check Your Understanding Across Flood Assist AI</Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {FLOOD_QUIZZES.map((quiz, idx) => {
              const selected = quizAnswers[idx];
              return (
                <Grid item xs={12} md={6} key={idx}>
                  <Card sx={{ height: "100%", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                    <CardContent sx={{ p: 2 }}>
                      <Chip label={quiz.pipeline} size="small" sx={{ fontSize: 10, fontWeight: 700, mb: 1, background: "#ccfbf1", color: "#115e59" }} />
                      <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 1 }}>{quiz.q}</Typography>
                      <RadioGroup value={selected ?? ""} onChange={(e) => setQuizAnswers({ ...quizAnswers, [idx]: Number(e.target.value) })}>
                        {quiz.options.map((opt, oIdx) => (
                          <FormControlLabel key={oIdx} value={oIdx} control={<Radio size="small" />} label={<Typography sx={{ fontSize: 12 }}>{opt}</Typography>} />
                        ))}
                      </RadioGroup>
                      {selected !== undefined && (
                        <Alert severity={selected === quiz.answer ? "success" : "error"} sx={{ mt: 1, fontSize: 11.5 }}>
                          <strong>{selected === quiz.answer ? "Correct! " : "Review again: "}</strong>{quiz.explanation}
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Interview Q&A Bank */}
          <Typography sx={{ fontWeight: 800, fontSize: 18, mb: 1.5 }}>🎤 Technical Interview Defense Bank</Typography>
          {FLOOD_INTERVIEW_QA.map((qa, i) => (
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

      {/* ── SEQUENTIAL STAGE STEPPER ── */}
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
          sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px", background: "#0f766e" }}
        >
          {activeStep < TABS.length - 1 ? `Next: ${TABS[activeStep + 1].label}` : "Completed!"}
        </Button>
      </Box>

      {/* Step-Aware Flood AI Mentor Assistant */}
      <FloodMentorChatWidget
        activeStep={activeStep}
        stepLabel={TABS[activeStep]?.label || "Stage 0"}
        open={mentorOpen}
        setOpen={setMentorOpen}
      />
    </Box>
  );
};

export default FloodAiSystemStudio;
