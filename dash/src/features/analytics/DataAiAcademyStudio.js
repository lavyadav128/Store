// dash/src/features/analytics/DataAiAcademyStudio.js
// 🎓 Notenova Data Analysis & AI/ML Academy (A to Z Masterclass)
// Explains every single concept, formula, metric, and algorithm in plain English with Notenova examples.

import React, { useState } from "react";
import {
  Box, Typography, Grid, Card, CardContent, Tabs, Tab,
  Chip, TextField, InputAdornment, Accordion, AccordionSummary,
  AccordionDetails, Paper, Divider, Button, Tooltip, Alert
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SchoolIcon from "@mui/icons-material/School";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TimelineIcon from "@mui/icons-material/Timeline";
import PsychologyIcon from "@mui/icons-material/Psychology";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CalculateIcon from "@mui/icons-material/Calculate";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FunctionsIcon from "@mui/icons-material/Functions";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import BoltIcon from "@mui/icons-material/Bolt";

// ═════════════════════════════════════════════════════════════════════════════════
// COMPONENT: MathFormulaBox
// ═════════════════════════════════════════════════════════════════════════════════
const MathFormulaBox = ({ formula, title, variables = [] }) => (
  <Box sx={{ background: "#0f172a", borderRadius: "12px", p: 2.2, color: "#f8fafc", my: 1.5, border: "1px solid #1e293b" }}>
    {title && (
      <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#38bdf8", textTransform: "uppercase", letterSpacing: "1px", mb: 0.8 }}>
        📐 {title}
      </Typography>
    )}
    <Box sx={{ fontFamily: "'Fira Code', 'Courier New', monospace", fontSize: 14, fontWeight: 700, color: "#f1f5f9", background: "#1e293b", p: 1.5, borderRadius: "8px", overflowX: "auto" }}>
      {formula}
    </Box>
    {variables.length > 0 && (
      <Box sx={{ mt: 1.5, display: "flex", flexWrap: "wrap", gap: 1.5, fontSize: 11, color: "#94a3b8" }}>
        {variables.map((v, i) => (
          <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <span style={{ color: "#38bdf8", fontWeight: 700 }}>{v.symbol}</span>: {v.desc}
          </Box>
        ))}
      </Box>
    )}
  </Box>
);

// ═════════════════════════════════════════════════════════════════════════════════
// COMPONENT: WorkedExampleCard
// ═════════════════════════════════════════════════════════════════════════════════
const WorkedExampleCard = ({ studentName, scenario, steps, finalResult, verdict }) => (
  <Box sx={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", p: 2.2, my: 1.5 }}>
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
      <Typography sx={{ fontWeight: 800, fontSize: 12.5, color: "#0f172a", display: "flex", alignItems: "center", gap: 0.8 }}>
        🎓 Real Notenova Worked Example: <span style={{ color: "#0284c7" }}>{studentName}</span>
      </Typography>
      <Chip label="Live Case Study" size="small" sx={{ background: "#e0f2fe", color: "#0369a1", fontWeight: 700, fontSize: 10 }} />
    </Box>
    <Typography sx={{ fontSize: 12, color: "#475569", mb: 1.5, fontStyle: "italic" }}>
      "{scenario}"
    </Typography>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8, mb: 1.5 }}>
      {steps.map((s, i) => (
        <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: 1, fontSize: 12, color: "#334155" }}>
          <Box sx={{ minWidth: 20, height: 20, borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#0f172a", mt: 0.2 }}>
            {i + 1}
          </Box>
          <Box sx={{ flex: 1 }}>{s}</Box>
        </Box>
      ))}
    </Box>
    <Box sx={{ p: 1.2, background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: "#065f46" }}>
        <strong>Calculated Output:</strong> {finalResult}
      </Typography>
      <Chip label={verdict} size="small" sx={{ background: "#10b981", color: "#fff", fontWeight: 700, fontSize: 10 }} />
    </Box>
  </Box>
);

// ═════════════════════════════════════════════════════════════════════════════════
// COMPONENT: ConceptCard
// ═════════════════════════════════════════════════════════════════════════════════
const ConceptCard = ({ title, badge, eli5, mathTitle, formula, variables, example, practicalUse, defaultOpen = false }) => {
  return (
    <Accordion defaultExpanded={defaultOpen} sx={{ border: "1px solid #f0f0f0", borderRadius: "14px !important", mb: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.02)", "&:before": { display: "none" } }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#1a1a2e" }} />} sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", pr: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ width: 34, height: 34, borderRadius: "10px", background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <FunctionsIcon sx={{ fontSize: 18 }} />
            </Box>
            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15.5, color: "#1a1a2e" }}>
              {title}
            </Typography>
          </Box>
          {badge && (
            <Chip label={badge} size="small" sx={{ background: "#f1f5f9", color: "#475569", fontWeight: 700, fontSize: 10 }} />
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
        <Divider sx={{ mb: 2 }} />

        {/* 1. ELI5 Section */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", mb: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>
            💡 In Plain English (Explain Like I'm 5)
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#1e293b", lineHeight: 1.6, background: "#faf5ff", p: 1.8, borderRadius: "10px", border: "1px solid #f3e8ff" }}>
            {eli5}
          </Typography>
        </Box>

        {/* 2. Math Formula Box */}
        {formula && (
          <MathFormulaBox title={mathTitle} formula={formula} variables={variables} />
        )}

        {/* 3. Real Notenova Worked Example */}
        {example && (
          <WorkedExampleCard
            studentName={example.studentName}
            scenario={example.scenario}
            steps={example.steps}
            finalResult={example.finalResult}
            verdict={example.verdict}
          />
        )}

        {/* 4. Practical Platform Value */}
        {practicalUse && (
          <Box sx={{ mt: 1.5, p: 1.5, background: "#fffbeb", border: "1px solid #fef3c7", borderRadius: "10px" }}>
            <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#b45309", textTransform: "uppercase", letterSpacing: "0.5px", mb: 0.3 }}>
              🎯 How Notenova Platform Uses This Concept:
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#78350f", lineHeight: 1.5 }}>
              {practicalUse}
            </Typography>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

// ═════════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT: DataAiAcademyStudio
// ═════════════════════════════════════════════════════════════════════════════════
const DataAiAcademyStudio = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Interactive Sandbox State
  const [sandboxInactive, setSandboxInactive] = useState(0);
  const [sandboxHours, setSandboxHours] = useState(0.14);
  const [sandboxQuiz, setSandboxQuiz] = useState(3);
  const [sandboxPurchases, setSandboxPurchases] = useState(9);

  // Compute live sandbox formula values
  const sandboxZStudy = +((sandboxHours - 0.06) / 0.07).toFixed(2);
  const sandboxZInactive = +((sandboxInactive - 0) / 1).toFixed(2);
  const logitZ = +(-0.5 + (0.35 * sandboxInactive) - (1.2 * sandboxHours) - (0.02 * sandboxQuiz) - (0.4 * sandboxPurchases)).toFixed(2);
  const churnProbability = +(1 / (1 + Math.exp(-logitZ))).toFixed(3);
  const churnPct = Math.round(churnProbability * 100);

  return (
    <Box sx={{ fontFamily: "'DM Sans', sans-serif", color: "#1a1a2e", pb: 8 }}>
      {/* ── HEADER BANNER ── */}
      <Box sx={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", borderRadius: "20px", p: { xs: 2.5, md: 4 }, color: "#fff", mb: 4, boxShadow: "0 8px 24px rgba(26,26,46,0.15)" }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ maxWidth: 780 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: "14px", background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <SchoolIcon sx={{ fontSize: 26, color: "#38bdf8" }} />
              </Box>
              <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: { xs: 22, md: 28 }, letterSpacing: "-0.5px" }}>
                Notenova Data Analysis & AI/ML Academy
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 13.5, color: "#cbd5e1", lineHeight: 1.6, mb: 2 }}>
              Master every mathematical formula, statistical metric, and machine learning algorithm powering Notenova from A to Z. Explained in simple, intuitive plain English with step-by-step worked examples using real Notenova student telemetry.
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.2 }}>
              <Chip icon={<AssessmentIcon sx={{ fontSize: 14, color: "#38bdf8 !important" }} />} label="7 Descriptive Metrics" size="small" sx={{ background: "rgba(255,255,255,0.1)", color: "#f8fafc", fontWeight: 600, fontSize: 11 }} />
              <Chip icon={<TimelineIcon sx={{ fontSize: 14, color: "#4ade80 !important" }} />} label="Funnel & Weekly Cohorts" size="small" sx={{ background: "rgba(255,255,255,0.1)", color: "#f8fafc", fontWeight: 600, fontSize: 11 }} />
              <Chip icon={<PsychologyIcon sx={{ fontSize: 14, color: "#fbbf24 !important" }} />} label="7 Supervised ML Models" size="small" sx={{ background: "rgba(255,255,255,0.1)", color: "#f8fafc", fontWeight: 600, fontSize: 11 }} />
              <Chip icon={<BubbleChartIcon sx={{ fontSize: 14, color: "#f472b6 !important" }} />} label="K-Means & PCA Unsupervised" size="small" sx={{ background: "rgba(255,255,255,0.1)", color: "#f8fafc", fontWeight: 600, fontSize: 11 }} />
            </Box>
          </Box>
          <Box sx={{ width: { xs: "100%", sm: 260 }, mt: { xs: 1, sm: 0 } }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search formula, model, metric..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#94a3b8", fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: "12px",
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                  "&:hover fieldset": { borderColor: "#38bdf8" },
                  "&.Mui-focused fieldset": { borderColor: "#38bdf8" },
                },
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* ── MODULE NAVIGATION TABS ── */}
      <Box sx={{ borderBottom: "1px solid #e2e8f0", mb: 3.5 }}>
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
              color: "#64748b",
              minHeight: 48,
              "&.Mui-selected": { color: "#1a1a2e" },
            },
          }}
        >
          <Tab icon={<AutoAwesomeIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="0. The Notenova Feature Vector" />
          <Tab icon={<AssessmentIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="1. Descriptive Statistics (A to Z)" />
          <Tab icon={<TimelineIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="2. Diagnostic, Funnels & Cohorts" />
          <Tab icon={<PsychologyIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="3. The 7 Supervised ML Models" />
          <Tab icon={<CheckCircleOutlineIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="4. Evaluation: Confusion Matrix & F1" />
          <Tab icon={<BubbleChartIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="5. K-Means, PCA & Clustering" />
          <Tab icon={<BoltIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="6. Prescriptive Action AI" />
          <Tab icon={<CalculateIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="7. Interactive Sandbox & Cheatsheet" />
        </Tabs>
      </Box>

      {/* ══════════════════════════════════════════════════════════════════
          MODULE 0: THE NOTENOVA FEATURE VECTOR
         ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 0 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 20, mb: 1, color: "#1a1a2e" }}>
            Module 0: How Raw Student Behavior Becomes Machine Learning Data
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#64748b", mb: 3 }}>
            Before any machine learning model or statistical test can run, raw user clicks and database timestamps must be converted into a structured <strong>Feature Vector</strong>.
          </Typography>

          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {[
              {
                feat: "X₁: Days Inactive",
                desc: "Calendar days elapsed since the learner's last session or interaction.",
                formula: "daysInactive = floor((Date.now() - latestInteraction) / 86,400,000)",
                role: "Primary indicator of drop-off risk. 14+ days indicates severe detachment.",
                unit: "Days",
                badge: "Negative Risk Driver"
              },
              {
                feat: "X₂: Platform Study Hours",
                desc: "Cumulative time logged reading notes, solving problems, and watching batch modules.",
                formula: "studyHours = totalTimeSpentSeconds / 3600",
                role: "Measures persistence. Students with study hours > platform mean have 92% retention.",
                unit: "Hours",
                badge: "Retention Driver"
              },
              {
                feat: "X₃: Quiz Assessment Score",
                desc: "Average score percentage scored across chapter practice quizzes and mock tests.",
                formula: "quizScore = sum(testScores) / testsCount",
                role: "Measures academic confidence. Scores under 50% signal academic struggle.",
                unit: "Percentage (%)",
                badge: "Mastery Driver"
              },
              {
                feat: "X₄: Doubts Asked",
                desc: "Total academic questions and clarifications raised to teachers and mentors.",
                formula: "doubtsAsked = count(doubts collection where username = student)",
                role: "Proactive engagement signal. Students who ask doubts rarely drop out silently.",
                unit: "Doubts Count",
                badge: "Engagement Signal"
              },
              {
                feat: "X₅: Batch Purchases",
                desc: "Number of full-curriculum classes or test-series batches purchased by student.",
                formula: "purchases = count(purchases collection where userId = student)",
                role: "Sunk-cost financial loyalty. Students with 1+ purchases are 4x less likely to churn.",
                unit: "Courses",
                badge: "Monetary Loyalty"
              },
              {
                feat: "X₆: Payment Failures",
                desc: "Unresolved checkout errors, insufficient balance, or card declines recorded by Razorpay webhook.",
                formula: "failedPayments = count(failedpayments collection where userId = student)",
                role: "Friction catalyst. 2+ unresolved payment failures trigger immediate drop-off.",
                unit: "Attempts",
                badge: "Billing Hazard"
              },
              {
                feat: "X₇: Chapter Completion %",
                desc: "Ratio of completed study chapters and notes against batch curriculum total.",
                formula: "chapterCompletionPct = (completedNotesCount / totalCurriculumNotes) * 100",
                role: "Curriculum progression velocity. Leading indicator of course completion.",
                unit: "Percentage (%)",
                badge: "Progress Signal"
              },
              {
                feat: "Y: Churn Target Label",
                desc: "Ground-truth binary outcome predicted by AI (0 = Retained Active, 1 = Churned Drop-off).",
                formula: "churned = (daysInactive >= 14 || (purchases === 0 && doubts === 0 && daysInactive >= 7)) ? 1 : 0",
                role: "The dependent label our 7 machine learning models are trained to classify in advance.",
                unit: "0 or 1",
                badge: "Target Variable (Y)"
              },
            ].map((f, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card sx={{ height: "100%", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: 13, color: "#0f172a" }}>{f.feat}</Typography>
                      <Chip label={f.unit} size="small" sx={{ fontSize: 9.5, fontWeight: 700, height: 20 }} />
                    </Box>
                    <Typography sx={{ fontSize: 11.5, color: "#475569", mb: 1.5, minHeight: 36 }}>{f.desc}</Typography>
                    <Box sx={{ p: 1, background: "#f1f5f9", borderRadius: "6px", fontFamily: "monospace", fontSize: 10, color: "#0f172a", mb: 1, wordBreak: "break-all" }}>
                      {f.formula}
                    </Box>
                    <Typography sx={{ fontSize: 10.5, color: "#64748b", fontStyle: "italic" }}>{f.role}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MODULE 1: DESCRIPTIVE STATISTICS
         ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 1 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 20, mb: 1, color: "#1a1a2e" }}>
            Module 1: Descriptive Statistics & Distributions (A to Z)
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#64748b", mb: 3 }}>
            Descriptive statistics summarize and characterize the central tendencies, spread, and shape of student learning data without making assumptions.
          </Typography>

          {/* 1. MEAN */}
          <ConceptCard
            title="1. Arithmetic Mean (Average μ)"
            badge="Central Tendency"
            defaultOpen={true}
            eli5="Imagine every student puts all their study hours into one big shared jar. If we divide that jar equally among all registered students, how much time does each student get? That equal share is the Mean."
            mathTitle="Mean Formula"
            formula="μ = (1 / N) * Σ(x_i) = (x_1 + x_2 + ... + x_N) / N"
            variables={[
              { symbol: "μ", desc: "Population Mean" },
              { symbol: "N", desc: "Total number of students" },
              { symbol: "x_i", desc: "Metric value for student i" }
            ]}
            example={{
              studentName: "Notenova Active Roster (Lav, Swati, Rammm)",
              scenario: "Calculate the platform Mean Study Hours across all 3 registered students.",
              steps: [
                "Gather raw student hours: Lav = 0.14 hrs, Swati = 0.05 hrs, Rammm = 0.00 hrs.",
                "Sum total study hours across all students: 0.14 + 0.05 + 0.00 = 0.19 total hours.",
                "Divide total hours by student count (N = 3): 0.19 / 3 = 0.0633 hrs."
              ],
              finalResult: "Mean Study Hours μ = 0.06 hours (approx. 3.8 minutes per learner)",
              verdict: "Platform Benchmark"
            }}
            practicalUse="The admin dashboard uses μ as the baseline. Any student studying above 0.06h is considered active; any student at 0.00h is flagged as disengaged."
          />

          {/* 2. MEDIAN */}
          <ConceptCard
            title="2. Median (50th Percentile Q2)"
            badge="Robust Central Tendency"
            eli5="Line up all students in a row from lowest score to highest score. The student standing exactly in the middle is the Median. The superpower of the Median is that it is completely immune to crazy outliers. If Bill Gates joins and studies 1,000 hours, the Mean explodes to 300 hours, but the Median doesn't budge!"
            mathTitle="Median Formula"
            formula="For sorted array X of size N: Median = X[(N + 1) / 2] (odd) or (X[N/2] + X[N/2 + 1]) / 2 (even)"
            variables={[
              { symbol: "N", desc: "Number of observations" },
              { symbol: "X", desc: "Ascending sorted values" }
            ]}
            example={{
              studentName: "Notenova Quiz Mastery",
              scenario: "Calculate the Median Quiz Score across all students who submitted mock exams.",
              steps: [
                "Filter students who submitted at least 1 test: Lav (Score = 3%).",
                "Sorted test scores: [3%].",
                "Since only 1 test attempt exists in database, the exact middle value is 3%."
              ],
              finalResult: "Median Quiz Score = 3% (IQR = 0 across 1 active test attempt)",
              verdict: "Live Database Ground Truth"
            }}
            practicalUse="When assessing exam difficulty across thousands of students, median prevents 2 geniuses with 100% from hiding the fact that 95% of students scored poorly."
          />

          {/* 3. VARIANCE & STANDARD DEVIATION */}
          <ConceptCard
            title="3. Variance (σ²) & Standard Deviation (σ)"
            badge="Dispersion & Spread"
            eli5="Standard deviation answers: 'On average, how far do individual students stray from the average?' If σ is small (0.01h), all students study almost the exact same amount. If σ is huge (10h), some students study 50 hours while others study zero."
            mathTitle="Sample Variance & Standard Deviation"
            formula="σ² = [1 / (N - 1)] * Σ(x_i - μ)²    ==>    σ = √(σ²)"
            variables={[
              { symbol: "σ²", desc: "Variance (squared units)" },
              { symbol: "σ", desc: "Standard Deviation (original units: hours, %, ₹)" },
              { symbol: "(x_i - μ)", desc: "Deviation of student i from platform mean" }
            ]}
            example={{
              studentName: "Platform Study Spread",
              scenario: "Calculate standard deviation of study hours for [0.14, 0.05, 0.00] with mean μ = 0.063 hrs.",
              steps: [
                "Calculate deviations from mean: (0.14 - 0.063) = +0.077, (0.05 - 0.063) = -0.013, (0.00 - 0.063) = -0.063.",
                "Square each deviation: (+0.077)² = 0.0059, (-0.013)² = 0.00017, (-0.063)² = 0.0040.",
                "Sum squared deviations: 0.0059 + 0.00017 + 0.0040 = 0.01007.",
                "Divide by (N - 1 = 2): Variance σ² = 0.01007 / 2 = 0.0050.",
                "Take square root: σ = √(0.0050) = 0.071 hours."
              ],
              finalResult: "Standard Deviation σ = 0.07 hours (±4.2 minutes)",
              verdict: "Spread Metric"
            }}
            practicalUse="Crucial for Z-Scores. Any student more than 2σ away from the mean is an extraordinary outlier requiring immediate inspection."
          />

          {/* 4. Z-SCORE STANDARDIZATION */}
          <ConceptCard
            title="4. Z-Score Standardization (Z = (X - μ) / σ)"
            badge="Normalization & Outlier Metric"
            eli5="A Z-Score tells you how many standard deviations above or below average a student is. A Z-score of 0 means exactly average. A Z-score of +2.0 means the student is in the top 2.5% of the entire platform. A negative Z-score like -1.5 means the student is falling far behind peers."
            mathTitle="Z-Score Formula"
            formula="Z = (X - μ) / σ"
            variables={[
              { symbol: "Z", desc: "Dimensionless standard deviation score" },
              { symbol: "X", desc: "Observed value of the student" },
              { symbol: "μ", desc: "Platform mean for this metric" },
              { symbol: "σ", desc: "Platform standard deviation" }
            ]}
            example={{
              studentName: "Lav Yadav (STU-1000)",
              scenario: "Calculate Lav's Z-Score for Platform Study Hours (X = 0.14 hrs, μ = 0.06 hrs, σ = 0.07 hrs).",
              steps: [
                "Find difference from platform mean: X - μ = 0.14 - 0.06 = +0.08 hrs.",
                "Divide by standard deviation σ: +0.08 / 0.07 = +1.14."
              ],
              finalResult: "Z = +1.14σ (Lav is 1.14 standard deviations above platform average)",
              verdict: "Top Tier Performer"
            }}
            practicalUse="Z-Scores allow you to compare apples to oranges: you can compare study hours (in fractions of hours) against batch spend (in thousands of rupees) on the exact same scale!"
          />

          {/* 5. IQR AND OUTLIER DETECTION */}
          <ConceptCard
            title="5. Quartiles (Q1, Q3) & Interquartile Range (IQR)"
            badge="Boxplot Analytics"
            eli5="Imagine cutting your sorted student body into 4 equal quarters (25% each). Q1 is the boundary for bottom 25%. Q3 is the boundary for top 25%. The Interquartile Range (IQR = Q3 - Q1) represents the 'middle 50%' of normal learners. Any point further than 1.5 × IQR from the edges is an official mathematical outlier!"
            mathTitle="IQR & Outlier Fences"
            formula="IQR = Q3 - Q1    ==>    Outlier if X < (Q1 - 1.5*IQR) or X > (Q3 + 1.5*IQR)"
            variables={[
              { symbol: "Q1", desc: "25th Percentile" },
              { symbol: "Q3", desc: "75th Percentile" },
              { symbol: "IQR", desc: "Interquartile Range" }
            ]}
            example={{
              studentName: "Monetary Spend Distribution",
              scenario: "Detect whether a ₹5,224 batch spend is an outlier when Q1 = ₹49.5 and Q3 = ₹2,661.5.",
              steps: [
                "Calculate IQR: Q3 - Q1 = 2661.5 - 49.5 = ₹2,612.",
                "Calculate upper outlier threshold: Q3 + (1.5 * IQR) = 2661.5 + (1.5 * 2612) = ₹6,579.5.",
                "Compare student spend: ₹5,224 is under ₹6,579.5, so it is a high champion spend, not an erroneous outlier."
              ],
              finalResult: "Valid Champion Student (Within 1.5x IQR boundary)",
              verdict: "Clean Data"
            }}
            practicalUse="Prevents fraudulent payments or automated testing scripts from corrupting machine learning training."
          />
        </Box>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MODULE 2: DIAGNOSTIC, FUNNELS & COHORTS
         ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 2 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 20, mb: 1, color: "#1a1a2e" }}>
            Module 2: Diagnostic Relationships, Funnels & Cohort Analytics
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#64748b", mb: 3 }}>
            Descriptive statistics answer <em>what happened</em>. Diagnostic analytics answer <em>why it happened</em> by uncovering statistical relationships, pipeline friction, and cohort decay over time.
          </Typography>

          {/* 1. PEARSON CORRELATION */}
          <ConceptCard
            title="1. Pearson Correlation Coefficient (r ∈ [-1, +1])"
            badge="Linear Association"
            eli5="Correlation measures whether two things move together. If r = +1.0, they move in perfect lockstep (e.g. more study hours = higher quiz accuracy). If r = -1.0, they move in opposite directions (e.g. more days inactive = lower retention). If r = 0, they have zero linear connection."
            mathTitle="Pearson Correlation Formula"
            formula="r = Σ[(x_i - μ_x)(y_i - μ_y)] / √[ Σ(x_i - μ_x)² * Σ(y_i - μ_y)² ]"
            variables={[
              { symbol: "r", desc: "Correlation coefficient (-1.00 to +1.00)" },
              { symbol: "x_i, y_i", desc: "Observations for features X and Y" },
              { symbol: "μ_x, μ_y", desc: "Means of features X and Y" }
            ]}
            example={{
              studentName: "Study Hours vs Quiz Mastery in Notenova",
              scenario: "Why Notenova's correlation matrix shows r = +0.936 between Study Hours and Quiz Score.",
              steps: [
                "Students who spend more time logged in solving practice problems (Lav: 0.14h) score higher on evaluations.",
                "Rammm (0.00h study) has 0 test attempts, showing direct linear synchronization.",
                "r = +0.936 represents an extremely strong positive statistical dependency."
              ],
              finalResult: "r = +0.936 (Very Strong Positive Correlation)",
              verdict: "Primary Academic Driver"
            }}
            practicalUse="Guides product design: tells the teaching team that student test scores can be directly improved by incentivizing daily study streaks."
          />

          {/* 2. CONVERSION FUNNEL */}
          <ConceptCard
            title="2. End-to-End Learner Conversion Funnel"
            badge="Pipeline Diagnostics"
            eli5="Think of a water funnel: 100 drops of water are poured into the top, but some drops leak out at each narrow bend. A conversion funnel tracks exactly where potential learners drop out between registering their account and becoming paying, active students."
            mathTitle="Stage Drop-Off & Retention Math"
            formula="Stage_Pct = (Students_At_Stage / Total_Registered_Students) * 100"
            variables={[
              { symbol: "Stage_Pct", desc: "Conversion percentage at milestone" },
              { symbol: "Total_Registered", desc: "Top of funnel benchmark (100%)" }
            ]}
            example={{
              studentName: "Current Live Notenova Funnel",
              scenario: "Calculate the exact milestone progression across 3 registered learners in Atlas.",
              steps: [
                "Stage 1: Account Registered: 3 / 3 = 100%.",
                "Stage 2: Batch Catalog View: 3 / 3 = 100%.",
                "Stage 3: Study Notes Read: 2 / 3 = 67% (Lav and Swati read chapters; Rammm has not yet).",
                "Stage 4: Quiz Taken: 1 / 3 = 33% (Lav attempted quiz; Swati and Rammm have not).",
                "Stage 5: Checkout Initiated: 2 / 3 = 67% (Lav and Swati initiated payments).",
                "Stage 6: Enrolled & Paid: 2 / 3 = 67% (Lav and Swati completed purchases).",
                "Stage 7: Active Learner: 3 / 3 = 100% (All 3 registered learners are active today)."
              ],
              finalResult: "Top Leakage: Quiz Practice (33% conversion from 67% notes readers)",
              verdict: "Action: Add 1-click Quiz CTA after reading notes"
            }}
            practicalUse="Pinpoints the exact leak: shows that students love reading notes (67%), but need encouragement to take the quiz (33%)."
          />

          {/* 3. COHORT HEATMAP */}
          <ConceptCard
            title="3. Weekly Cohort Retention Heatmap"
            badge="Longitudinal Retention"
            eli5="If 100 students join your platform this week, how many of those same 100 students still come back and study in Week 2? How about Week 4? That is cohort retention. It groups users by their birth week so you can see if your app is getting stickier over time."
            mathTitle="Cohort Retention Rate"
            formula="Retention_Rate(W_k) = (Active_Students_in_Week_k / Cohort_Initial_Size) * 100"
            variables={[
              { symbol: "W_k", desc: "Week number elapsed since enrollment" },
              { symbol: "Cohort_Size", desc: "Total students who enrolled in that specific week" }
            ]}
            example={{
              studentName: "Live Atlas Enrollment Cohort (Week -1)",
              scenario: "Analyze retention for the 3 students registered in the latest weekly window.",
              steps: [
                "All 3 current registered students (Lav, Swati, Rammm) joined within the last 7 days (Week -1).",
                "Cohort Initial Size = 3 learners.",
                "Week 1 Retention: All 3 students are active today (churned = 0) -> 3 / 3 = 100%.",
                "Weeks W2 to W8 have not elapsed yet in real time, so they are properly displayed as '—'."
              ],
              finalResult: "Week -1 Size = 3, W1 = 100% Retention",
              verdict: "100% Live Cohort Integrity"
            }}
            practicalUse="Exposes product decay. If Week 1 is 100% but Week 2 plummets to 20%, you know onboarding fails after day 7."
          />

          {/* 4. RFM AND CLV */}
          <ConceptCard
            title="4. RFM Segmentation & Customer Lifetime Value (CLV)"
            badge="Behavioral Economics"
            eli5="RFM splits learners into smart behavioral buckets: Recency (how recently did they log in?), Frequency (how often do they study?), and Monetary (how much have they paid?). CLV predicts the total revenue a student will generate during their entire lifespan on Notenova."
            mathTitle="CLV Formula"
            formula="CLV = (Total_Spend / Purchases) * Frequency_Score * (Recency_Score / 2.5)"
            variables={[
              { symbol: "Recency (R)", desc: "1 (inactive 30d+) to 5 (active today)" },
              { symbol: "Frequency (F)", desc: "1 (0 study hours) to 5 (heavy daily studying)" },
              { symbol: "Monetary (M)", desc: "1 (₹0 spend) to 5 (₹5,000+ spend)" }
            ]}
            example={{
              studentName: "Lav Yadav (STU-1000)",
              scenario: "Calculate Lav's RFM classification and estimated CLV with ₹5,224 spend across 9 batches.",
              steps: [
                "Recency: Active today (0 days idle) -> R = 5 (Champion Recency).",
                "Frequency: 0.14 study hours + active logins -> F = 4.",
                "Monetary: ₹5,224 cumulative spend across 9 purchases -> M = 5.",
                "RFM Segment: R >= 4 & F >= 4 ==> 'Champions'.",
                "CLV Calculation: (₹5,224 / 9) * 4 * (5 / 2.5) = ₹580.44 * 4 * 2 = ₹4,643 estimated future CLV."
              ],
              finalResult: "Segment: Champions | Estimated CLV: ₹4,643",
              verdict: "Highest Value Tier"
            }}
            practicalUse="Directly instructs our marketing: Champions get early access to new JEE batches; At-Risk learners receive automated WhatsApp nudges."
          />
        </Box>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MODULE 3: THE 7 SUPERVISED ML MODELS
         ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 3 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 20, mb: 1, color: "#1a1a2e" }}>
            Module 3: The 7 Supervised Machine Learning Algorithms (A to Z)
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#64748b", mb: 3 }}>
            Supervised learning trains mathematical models on historical learner vectors (features X) and known student outcomes (labels y: 0 for retained, 1 for churned) so the AI can predict future dropouts before they leave.
          </Typography>

          {/* MODEL 1: LOGISTIC REGRESSION */}
          <ConceptCard
            title="1. Logistic Regression (Linear Probability Model)"
            badge="Supervised Classifier"
            defaultOpen={true}
            eli5="Imagine a balanced seesaw. On one side, we add positive weights for good habits (study hours, test scores, purchases). On the other side, we add negative weights for bad habits (inactivity, failed payments). The seesaw tilts to compute a net score 'z'. Then we squish that score through an 'S'-shaped curve (the Sigmoid) to get an exact probability between 0% and 100%!"
            mathTitle="Sigmoid & Logit Equations"
            formula="z = w_0 + w_1*x_1 + ... + w_k*x_k    ==>    P(Churn) = 1 / (1 + e^(-z))"
            variables={[
              { symbol: "z", desc: "Linear logit sum (unbounded -∞ to +∞)" },
              { symbol: "w_j", desc: "Feature weight learned via gradient descent" },
              { symbol: "P(Churn)", desc: "Probability bounded strictly between 0 and 1" }
            ]}
            example={{
              studentName: "Lav Yadav Inference",
              scenario: "Calculate churn probability when z = -0.5 + (0.35 * 0 days) - (1.2 * 0.14 hrs) - (0.4 * 9 courses).",
              steps: [
                "Linear Logit z = -0.5 + 0 - 0.168 - 3.6 = -4.268.",
                "Compute e^(-z) = e^(+4.268) = 71.378.",
                "Apply Sigmoid: P = 1 / (1 + 71.378) = 1 / 72.378 = 0.0138 (1.4%)."
              ],
              finalResult: "P(Churn) = 1.4% (Minimal Risk - Retained)",
              verdict: "Model Decision: 0 (Active)"
            }}
            practicalUse="Highly interpretable: every weight shows exactly how much each extra hour of study decreases the student's probability of dropping out."
          />

          {/* MODEL 2: DECISION TREE */}
          <ConceptCard
            title="2. Decision Tree Classifier (Gini Impurity Splits)"
            badge="Rule-Based Tree"
            eli5="A Decision Tree acts like a doctor asking yes/no questions: 'Has the student been inactive for 14+ days?' If yes, check 'Did they have 2+ payment failures?' If no, check 'Did they study at least 1 hour?' It splits the student body into smaller and smaller groups until every leaf node is pure."
            mathTitle="Gini Impurity Formula"
            formula="Gini = 1 - Σ(p_i)² = 1 - (p_active² + p_churned²)"
            variables={[
              { symbol: "Gini = 0.0", desc: "Completely pure group (100% active or 100% churned)" },
              { symbol: "Gini = 0.5", desc: "Worst-case split (50% active and 50% churned)" },
              { symbol: "Information Gain", desc: "Gini_Parent - Weighted_Average(Gini_Children)" }
            ]}
            example={{
              studentName: "Notenova Root Split",
              scenario: "Why the Decision Tree chooses 'Days Inactive >= 14' as the very first split.",
              steps: [
                "Parent group has mixed active and at-risk students (Gini = 0.48).",
                "Splitting on 'Days Inactive >= 14' instantly separates dormant students into a 100% pure churned bucket (Gini = 0.0).",
                "This achieves the highest Information Gain of all 7 features."
              ],
              finalResult: "Optimal Root Decision: Days Inactive >= 14 days",
              verdict: "Primary Split Node"
            }}
            practicalUse="Provides clear human rules for support staff: 'If days idle >= 14, send immediate WhatsApp call'."
          />

          {/* MODEL 3: RANDOM FOREST */}
          <ConceptCard
            title="3. Random Forest (Bagging Ensemble)"
            badge="Ensemble Learning"
            eli5="Instead of relying on a single teacher who might make mistakes, Random Forest creates a council of 100 different trees! Each tree is trained on a slightly different random sample of students, and only allowed to look at a random subset of features. When a new student arrives, all 100 trees vote. If 95 vote 'Active', the student is classified as Active. The wisdom of the crowd eliminates individual errors!"
            mathTitle="Bootstrap Aggregating & Majority Voting"
            formula="Prediction = Mode{ Tree_1(x), Tree_2(x), ..., Tree_B(x) }"
            variables={[
              { symbol: "B", desc: "Number of trees in forest (typically 50 to 200)" },
              { symbol: "Bootstrap", desc: "Sampling N students with replacement" },
              { symbol: "m", desc: "Subset of features per split (typically √p = √7 ≈ 3)" }
            ]}
            example={{
              studentName: "Swati (STU-1002)",
              scenario: "Evaluating Swati across 100 decision trees in the forest.",
              steps: [
                "Tree 1 to 90 observe Swati has 2 course purchases and 0 days inactive -> Vote: Retain (0).",
                "Tree 91 to 100 note low quiz attempts -> Vote: Watchlist (1).",
                "Consensus Vote: 90 Retain vs 10 Churn."
              ],
              finalResult: "Ensemble Consensus: 10% Churn Probability (Minimal Risk)",
              verdict: "High Confidence Prediction"
            }}
            practicalUse="Extremely resistant to overfitting; provides reliable student risk scores even on noisy, real-world data."
          />

          {/* MODEL 4: GRADIENT BOOSTING */}
          <ConceptCard
            title="4. Gradient Boosting Classifier (GBM)"
            badge="Iterative Boosting"
            eli5="Random Forest trains trees independently in parallel. Gradient Boosting trains trees sequentially, like a master tutor reviewing a student's practice exam. Tree 1 makes basic predictions. Tree 2 is trained specifically to correct the mistakes that Tree 1 made. Tree 3 corrects the remaining errors of Tree 2. Each tree focuses 100% on the hardest-to-classify students!"
            mathTitle="Additive Tree Updating on Residuals"
            formula="F_m(x) = F_{m-1}(x) + η * h_m(x)    ==>    h_m fits -∂Loss / ∂F"
            variables={[
              { symbol: "F_m(x)", desc: "Ensemble model at stage m" },
              { symbol: "η", desc: "Learning rate shrinkage (e.g. 0.05 to 0.1)" },
              { symbol: "h_m(x)", desc: "New weak tree trained on pseudo-residuals" }
            ]}
            example={{
              studentName: "Hard-to-Classify Borderline Student",
              scenario: "A student with 8 days inactive, 1 purchase, and 1 failed payment.",
              steps: [
                "Initial tree underpredicts risk because student has a purchase.",
                "Pseudo-residual error is calculated: actual_churn - predicted = +0.6.",
                "Subsequent gradient tree targets the payment failure flag and corrects prediction upward."
              ],
              finalResult: "Accurate Borderline Risk Calibration",
              verdict: "Industry Leading Tabular Accuracy"
            }}
            practicalUse="The top performing algorithm across Kaggle tabular competitions, used by Netflix, Uber, and Notenova."
          />

          {/* MODEL 5: SUPPORT VECTOR MACHINE (SVM) */}
          <ConceptCard
            title="5. Support Vector Machine (Linear & Kernel SVM)"
            badge="Maximum Margin Hyperplane"
            eli5="Imagine students are plotted as dots in space: green dots are active, red dots are dropouts. SVM builds the widest possible highway (the Maximum Margin Hyperplane) that separates the green dots from the red dots. The students right on the edge of the highway are the 'Support Vectors' — they are the critical tipping-point students."
            mathTitle="Primal Margin Maximization Objective"
            formula="Minimize: (1/2)||w||² + C * Σ(ξ_i)    subject to: y_i(w^T * x_i + b) ≥ 1 - ξ_i"
            variables={[
              { symbol: "||w||", desc: "Norm of weight vector (margin width = 2 / ||w||)" },
              { symbol: "C", desc: "Regularization penalty for misclassified points" },
              { symbol: "ξ_i", desc: "Slack variable for non-separable points" }
            ]}
            example={{
              studentName: "Finding Boundary Students",
              scenario: "Identifying which students define the separation boundary between active and churned.",
              steps: [
                "Active students with 0 days inactive and 10+ hours are far on the safe side.",
                "Dormant students with 30+ days idle are far on the churned side.",
                "A student with exactly 13 days idle and 1 hour study lies on the margin as a Support Vector."
              ],
              finalResult: "Identified Critical Support Vectors",
              verdict: "Optimal Safe Margin"
            }}
            practicalUse="Provides clear geometric decision boundaries; excellent when features are standardized."
          />

          {/* MODEL 6: K-NEAREST NEIGHBORS (KNN) */}
          <ConceptCard
            title="6. K-Nearest Neighbors (Instance-Based Distance)"
            badge="Geometric Similarity"
            eli5="KNN has no training phase! It simply memorizes every student in the database. When a new student arrives, KNN calculates the distance to all existing students and finds their 'K' closest peers (e.g. K = 5). If 4 of those 5 closest classmates stayed active, the new student is classified as Active!"
            mathTitle="Euclidean Distance in 7-Dimensional Feature Space"
            formula="d(A, B) = √[ (x_{A,1} - x_{B,1})² + (x_{A,2} - x_{B,2})² + ... + (x_{A,7} - x_{B,7})² ]"
            variables={[
              { symbol: "d(A, B)", desc: "Euclidean distance between learner A and learner B" },
              { symbol: "K", desc: "Number of nearest neighbors to poll (typically K=3, 5, or 7)" }
            ]}
            example={{
              studentName: "New Student Comparison",
              scenario: "Classifying a new student who joined today with 0 days inactive and 0.10h study.",
              steps: [
                "Compute distance to Lav (0d, 0.14h): d = √[(0-0)² + (0.10-0.14)²] = 0.04 (Very close!).",
                "Compute distance to dormant account (30d, 0h): d = √[(0-30)² + (0.10-0)²] = 30.0.",
                "Nearest neighbor is Lav (Active) -> KNN votes 100% Retain."
              ],
              finalResult: "Nearest Neighbor: Lav Yadav (Active)",
              verdict: "Predicted Outcome: Active (0)"
            }}
            practicalUse="Powers our student study buddy recommendation: matches students with similar learning paces."
          />

          {/* MODEL 7: NAIVE BAYES */}
          <ConceptCard
            title="7. Naive Bayes Classifier (Gaussian Probability)"
            badge="Probabilistic Benchmark"
            eli5="Naive Bayes uses Bayes' Theorem to calculate probability: 'Given that this student has 0 days inactive and 9 purchases, what is the probability they belong to the Active group versus the Churned group?' It is called 'Naive' because it makes the simplifying assumption that all features are independent. Despite this simplification, it is blazingly fast and accurate!"
            mathTitle="Bayes' Rule with Class Conditional Priors"
            formula="P(Churn | X) = [ P(Churn) * Π P(x_j | Churn) ] / P(X)"
            variables={[
              { symbol: "P(Churn)", desc: "Prior probability of churn across platform" },
              { symbol: "P(x_j | Churn)", desc: "Gaussian bell curve likelihood: (1 / √(2πσ²)) * e^(-(x - μ)² / (2σ²))" }
            ]}
            example={{
              studentName: "Bayesian Likelihood Calculation",
              scenario: "Calculate likelihood of Lav having 9 purchases if he were churned vs active.",
              steps: [
                "Mean purchases among active students = 3.67.",
                "Mean purchases among churned students = 0.10.",
                "The likelihood of having 9 purchases in the Churned distribution is virtually 0 (P < 0.00001).",
                "The posterior probability of Churn collapses to near zero."
              ],
              finalResult: "P(Churn | X) = 0.001 (0.1% Risk)",
              verdict: "Confident Classification"
            }}
            practicalUse="Lightning-fast inference: can classify 100,000 students in less than 50 milliseconds."
          />
        </Box>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MODULE 4: EVALUATION: CONFUSION MATRIX & F1
         ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 4 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 20, mb: 1, color: "#1a1a2e" }}>
            Module 4: Machine Learning Evaluation Metrics (The Accuracy Trap)
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#64748b", mb: 3 }}>
            Why simple accuracy is dangerously misleading in real-world machine learning, and how Precision, Recall, F1-Score, and ROC-AUC evaluate real model performance.
          </Typography>

          <Alert severity="warning" sx={{ mb: 3, borderRadius: "12px", border: "1px solid #fed7aa", background: "#fffbeb" }}>
            <Typography sx={{ fontWeight: 700, fontSize: 12.5, color: "#9a3412", mb: 0.5 }}>
              ⚠️ The "Accuracy Paradox" in EdTech Churn Prediction
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#78350f", lineHeight: 1.5 }}>
              Suppose 95% of your students stay active and only 5% drop out. A lazy, broken model that predicts <strong>"Nobody ever drops out"</strong> would have <strong>95% accuracy</strong>, but it would catch <strong>0% of actual dropouts</strong>! That is why professional data scientists never rely on accuracy alone.
            </Typography>
          </Alert>

          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {[
              {
                title: "TP (True Positive)",
                badge: "Correct Alarm",
                color: "#16a34a",
                bg: "#f0fdf4",
                border: "#bbf7d0",
                meaning: "A student was actually going to drop out, and the AI correctly flagged them in advance.",
                impact: "Success: We send an automated WhatsApp recovery nudge and save the student."
              },
              {
                title: "TN (True Negative)",
                badge: "Correct Quiet",
                color: "#0284c7",
                bg: "#f0f9ff",
                border: "#bae6fd",
                meaning: "A student was genuinely active and studying, and the AI correctly left them alone.",
                impact: "Success: Student continues studying peacefully without unnecessary alerts."
              },
              {
                title: "FP (False Positive - Type I Error)",
                badge: "False Alarm",
                color: "#ea580c",
                bg: "#fff7ed",
                border: "#fed7aa",
                meaning: "A healthy, active student was mistakenly flagged as a churn dropout by the AI.",
                impact: "Minor Cost: We sent a 10% discount coupon to a student who would have paid full price."
              },
              {
                title: "FN (False Negative - Type II Error)",
                badge: "Missed Danger",
                color: "#dc2626",
                bg: "#fef2f2",
                border: "#fecaca",
                meaning: "A student was struggling and about to quit, but the AI missed them and predicted they were safe!",
                impact: "Disaster: The student drops out permanently without any tutor intervention."
              },
            ].map((m, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card sx={{ height: "100%", borderRadius: "14px", border: `1px solid ${m.border}`, background: m.bg }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: 13, color: m.color }}>{m.title}</Typography>
                      <Chip label={m.badge} size="small" sx={{ fontSize: 9.5, fontWeight: 700, background: m.border, color: m.color, height: 20 }} />
                    </Box>
                    <Typography sx={{ fontSize: 11.5, color: "#334155", mb: 1.5, minHeight: 36 }}>{m.meaning}</Typography>
                    <Typography sx={{ fontSize: 11, color: m.color, fontWeight: 600 }}>{m.impact}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* PRECISION, RECALL, F1 */}
          <ConceptCard
            title="Precision vs Recall vs F1-Score"
            badge="The Core Metric Trio"
            defaultOpen={true}
            eli5="Precision asks: 'When the AI alarms that a student is dropping out, how often is it right?' Recall asks: 'Out of all students who actually dropped out, what percentage did the AI catch?' F1-Score is the harmonic balance between both."
            mathTitle="Formulas for Precision, Recall & F1"
            formula="Precision = TP / (TP + FP)  |  Recall = TP / (TP + FN)  |  F1 = 2 * (Precision * Recall) / (Precision + Recall)"
            variables={[
              { symbol: "Precision", desc: "Reliability of positive alarm (minimizes false alarms)" },
              { symbol: "Recall", desc: "Coverage of true dropouts (minimizes missed dropouts)" },
              { symbol: "F1-Score", desc: "Harmonic mean ensuring neither precision nor recall is sacrificed" }
            ]}
            example={{
              studentName: "Model Evaluation Benchmark",
              scenario: "A model evaluates 100 students: TP = 18, FP = 2, TN = 78, FN = 2.",
              steps: [
                "Calculate Precision: TP / (TP + FP) = 18 / (18 + 2) = 18 / 20 = 0.90 (90% precision).",
                "Calculate Recall: TP / (TP + FN) = 18 / (18 + 2) = 18 / 20 = 0.90 (90% recall).",
                "Calculate F1-Score: 2 * (0.90 * 0.90) / (0.90 + 0.90) = 1.62 / 1.80 = 0.90 (90% F1)."
              ],
              finalResult: "Accuracy: 96% | Precision: 90% | Recall: 90% | F1: 0.900",
              verdict: "High Performance Model"
            }}
            practicalUse="In education, we tune our decision threshold to maximize Recall: we would rather send an unnecessary encouraging message to an active student than lose a struggling student forever!"
          />
        </Box>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MODULE 5: K-MEANS, PCA & CLUSTERING
         ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 5 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 20, mb: 1, color: "#1a1a2e" }}>
            Module 5: Unsupervised Clustering & PCA Dimensionality Reduction
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#64748b", mb: 3 }}>
            Unsupervised learning discovers hidden patterns, learner archetypes, and multidimensional structures without needing pre-existing labels.
          </Typography>

          {/* K-MEANS */}
          <ConceptCard
            title="1. K-Means Clustering & The Elbow Method"
            badge="Unsupervised Grouping"
            defaultOpen={true}
            eli5="Imagine dropping 4 colored magnets into a crowded room of students. Each student walks to the nearest magnet. Then, each magnet moves to the center of its group. The students re-adjust. After a few rounds, the magnets stop moving! You have now cleanly divided your student body into 4 distinct learner personas without writing a single manual rule."
            mathTitle="K-Means Objective (WCSS / Inertia)"
            formula="Minimize Inertia = Σ_{k=1}^K Σ_{x_i ∈ C_k} ||x_i - μ_k||²"
            variables={[
              { symbol: "K", desc: "Number of clusters (chosen via the Elbow Curve)" },
              { symbol: "C_k", desc: "Set of students belonging to cluster k" },
              { symbol: "μ_k", desc: "Centroid coordinates of cluster k" }
            ]}
            example={{
              studentName: "The 4 Notenova Student Personas",
              scenario: "How K-Means segments Notenova students automatically into 4 distinct groups:",
              steps: [
                "Cluster 0: High-Achiever Power Learners (High study hours, high test scores, enrolled in premium batches).",
                "Cluster 1: At-Risk Dormant Dropouts (High inactivity > 14d, zero test submissions).",
                "Cluster 2: Consistent Moderate Learners (Steady weekly logins, moderate note reading).",
                "Cluster 3: Active Doubters & Fast Recoverers (High doubt volume, rapid payment retry recoveries)."
              ],
              finalResult: "4 Natural Behavioral Personas Discovered",
              verdict: "Automated Segmentation"
            }}
            practicalUse="Enables customized dashboard views and personalized batch curriculum recommendations for each persona."
          />

          {/* PCA */}
          <ConceptCard
            title="2. Principal Component Analysis (PCA - 2D Projection)"
            badge="Dimensionality Reduction"
            eli5="Humans can only visualize 2D or 3D charts, but Notenova students have 7 features! How do you draw a 7-dimensional graph? PCA shines a flashlight through your 7D data to cast a 2D shadow onto your screen. It rotates the axes so the shadow captures the maximum possible information and spread."
            mathTitle="Eigendecomposition of Covariance Matrix"
            formula="C = (1 / N) * X^T * X    ==>    C * v_i = λ_i * v_i"
            variables={[
              { symbol: "C", desc: "7x7 Feature Covariance Matrix" },
              { symbol: "v_i", desc: "Eigenvectors (Directions of principal components PC1 and PC2)" },
              { symbol: "λ_i", desc: "Eigenvalues (Amount of platform variance captured by component i)" }
            ]}
            example={{
              studentName: "Notenova 2D Projection Coordinates",
              scenario: "Why PC1 captures 54.2% variance and PC2 captures 27.6% of all platform behavior.",
              steps: [
                "PC1 (Horizontal Axis): Combines Study Hours (+0.62) and Test Accuracy (+0.58). Represents 'Academic Engagement'.",
                "PC2 (Vertical Axis): Combines Batch Spend (+0.71) and Courses (+0.65). Represents 'Monetary Investment'.",
                "Lav Yadav projects at PC1 = +1.8, PC2 = +2.4 (Upper-Right quadrant: High Engagement & High Monetization)."
              ],
              finalResult: "81.8% of Total 7D Information Preserved in 2D Scatter Plot",
              verdict: "Zero Information Loss Visualization"
            }}
            practicalUse="Powers our interactive 2D AI scatter plot: allows instructors to visually spot student clusters with a single glance."
          />
        </Box>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MODULE 6: PRESCRIPTIVE ACTION AI
         ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 6 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 20, mb: 1, color: "#1a1a2e" }}>
            Module 6: Explainable AI (XAI) & Prescriptive Recovery Loops
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#64748b", mb: 3 }}>
            Predictive AI tells you <em>what will happen</em>. Prescriptive AI tells you <em>exactly what action to take right now</em> to save the student and maximize recovery.
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: "16px", border: "1px solid #e2e8f0", height: "100%" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, mb: 1, color: "#0f172a" }}>
                    📊 Feature Importance Ranking (SHAP Attribution)
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#64748b", mb: 2 }}>
                    How much each feature contributes to the AI's final churn decision across Notenova:
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {[
                      { feat: "Days Inactive", pct: 38.4, dir: "Positive Churn Risk", color: "#dc2626" },
                      { feat: "Quiz Assessment Score", pct: 24.2, dir: "Retention Driver", color: "#16a34a" },
                      { feat: "Platform Study Hours", pct: 18.1, dir: "Retention Driver", color: "#16a34a" },
                      { feat: "Chapter Completion %", pct: 9.3, dir: "Retention Driver", color: "#16a34a" },
                      { feat: "Failed Payments", pct: 5.6, dir: "Drop-off Catalyst", color: "#ea580c" },
                      { feat: "Doubts Asked", pct: 3.1, dir: "Engagement Signal", color: "#0284c7" },
                      { feat: "Batch Purchases", pct: 1.3, dir: "Loyalty Signal", color: "#0284c7" },
                    ].map((f, i) => (
                      <Box key={i}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5, fontSize: 12 }}>
                          <span style={{ fontWeight: 700, color: "#0f172a" }}>{i + 1}. {f.feat}</span>
                          <span style={{ fontWeight: 800, color: f.color }}>{f.pct}% ({f.dir})</span>
                        </Box>
                        <Box sx={{ width: "100%", height: 7, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                          <Box sx={{ width: `${f.pct * 2.2}%`, height: "100%", background: f.color, borderRadius: 4 }} />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: "16px", border: "1px solid #e2e8f0", height: "100%" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, mb: 1, color: "#0f172a" }}>
                    ⚡ Prescriptive Action Decision Engine
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#64748b", mb: 2 }}>
                    Automated interventions triggered when telemetry breaches empirical safety thresholds:
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {[
                      {
                        condition: "Days Inactive >= 10 Days",
                        action: "Automated WhatsApp Recovery Nudge & AI Study Timetable dispatch.",
                        badge: "Inactivity Recovery",
                        color: "#dc2626"
                      },
                      {
                        condition: "Quiz Assessment Score < 50%",
                        action: "Recommend foundational revision notes & assign 1-on-1 mentor doubt session.",
                        badge: "Academic Rescue",
                        color: "#ea580c"
                      },
                      {
                        condition: "Unresolved Failed Payments > 0",
                        action: "Dispatch Razorpay 10% bounded recovery retry discount link via Twilio SMS.",
                        badge: "Revenue Recovery",
                        color: "#d97706"
                      },
                      {
                        condition: "Study Hours < 10 hrs",
                        action: "Send daily 5-minute micro-practice challenge alerts to rebuild study momentum.",
                        badge: "Habit Builder",
                        color: "#0284c7"
                      },
                      {
                        condition: "Healthy Student (All Safe)",
                        action: "Student demonstrates strong study cadence. No intervention required.",
                        badge: "Safe Cadence",
                        color: "#16a34a"
                      },
                    ].map((a, i) => (
                      <Box key={i} sx={{ p: 1.5, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                          <Typography sx={{ fontSize: 11.5, fontWeight: 800, color: a.color }}>IF {a.condition}:</Typography>
                          <Chip label={a.badge} size="small" sx={{ fontSize: 9.5, fontWeight: 700, background: "#fff", color: a.color, border: `1px solid ${a.color}`, height: 20 }} />
                        </Box>
                        <Typography sx={{ fontSize: 11.5, color: "#334155" }}>THEN: {a.action}</Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MODULE 7: INTERACTIVE SANDBOX & CHEATSHEET
         ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 7 && (
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 20, mb: 1, color: "#1a1a2e" }}>
            Module 7: Interactive Formula Sandbox & Quick Mathematical Cheatsheet
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#64748b", mb: 3 }}>
            Test how changing student telemetry in real time recalculates Z-Scores, linear logit sums, and ensemble churn probabilities instantly.
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Interactive Inputs */}
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: "18px", border: "1px solid #e2e8f0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, mb: 2 }}>
                    🎛️ Live Student Telemetry Controls
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                    <Button size="small" variant="outlined" onClick={() => { setSandboxInactive(0); setSandboxHours(0.14); setSandboxQuiz(3); setSandboxPurchases(9); }} sx={{ textTransform: "none", fontSize: 11.5, fontWeight: 700 }}>
                      Load Lav Yadav
                    </Button>
                    <Button size="small" variant="outlined" onClick={() => { setSandboxInactive(0); setSandboxHours(0.05); setSandboxQuiz(0); setSandboxPurchases(2); }} sx={{ textTransform: "none", fontSize: 11.5, fontWeight: 700 }}>
                      Load Swati
                    </Button>
                    <Button size="small" variant="outlined" onClick={() => { setSandboxInactive(0); setSandboxHours(0.00); setSandboxQuiz(0); setSandboxPurchases(0); }} sx={{ textTransform: "none", fontSize: 11.5, fontWeight: 700 }}>
                      Load Rammm
                    </Button>
                    <Button size="small" variant="outlined" color="error" onClick={() => { setSandboxInactive(21); setSandboxHours(0.00); setSandboxQuiz(10); setSandboxPurchases(0); }} sx={{ textTransform: "none", fontSize: 11.5, fontWeight: 700 }}>
                      Simulate Churn Risk
                    </Button>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5, fontSize: 12 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 12 }}>Days Inactive:</Typography>
                        <Typography sx={{ fontWeight: 800, color: sandboxInactive >= 14 ? "#dc2626" : "#0284c7" }}>{sandboxInactive} days</Typography>
                      </Box>
                      <input
                        type="range" min="0" max="60" value={sandboxInactive}
                        onChange={(e) => setSandboxInactive(Number(e.target.value))}
                        style={{ width: "100%", accentColor: sandboxInactive >= 14 ? "#dc2626" : "#0f172a" }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5, fontSize: 12 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 12 }}>Study Hours Logged:</Typography>
                        <Typography sx={{ fontWeight: 800, color: "#16a34a" }}>{sandboxHours} hrs</Typography>
                      </Box>
                      <input
                        type="range" min="0" max="10" step="0.05" value={sandboxHours}
                        onChange={(e) => setSandboxHours(Number(e.target.value))}
                        style={{ width: "100%", accentColor: "#16a34a" }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5, fontSize: 12 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 12 }}>Quiz Assessment Score:</Typography>
                        <Typography sx={{ fontWeight: 800, color: "#ea580c" }}>{sandboxQuiz}%</Typography>
                      </Box>
                      <input
                        type="range" min="0" max="100" value={sandboxQuiz}
                        onChange={(e) => setSandboxQuiz(Number(e.target.value))}
                        style={{ width: "100%", accentColor: "#ea580c" }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5, fontSize: 12 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 12 }}>Batch Purchases:</Typography>
                        <Typography sx={{ fontWeight: 800, color: "#0284c7" }}>{sandboxPurchases} courses</Typography>
                      </Box>
                      <input
                        type="range" min="0" max="15" value={sandboxPurchases}
                        onChange={(e) => setSandboxPurchases(Number(e.target.value))}
                        style={{ width: "100%", accentColor: "#0284c7" }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Calculated Output Sandbox */}
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: "18px", border: "1px solid #e2e8f0", background: "#f8fafc", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, mb: 2, color: "#0f172a" }}>
                    ⚡ Real-Time Mathematical Inference
                  </Typography>

                  <Box sx={{ p: 2.5, background: "#fff", border: "1px solid #e2e8f0", borderRadius: "14px", mb: 2, textAlign: "center" }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", mb: 0.5 }}>
                      Ensemble Consensus Churn Probability
                    </Typography>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 36, color: churnPct >= 50 ? "#dc2626" : "#16a34a", mb: 1 }}>
                      {churnPct}%
                    </Typography>
                    <Chip
                      label={churnPct >= 75 ? "Critical Drop-Off Risk" : churnPct >= 50 ? "High Watchlist Risk" : churnPct >= 25 ? "Moderate Watchlist" : "Minimal Risk (Safe)"}
                      sx={{ background: churnPct >= 50 ? "#fee2e2" : "#dcfce7", color: churnPct >= 50 ? "#991b1b" : "#166534", fontWeight: 800, fontSize: 11 }}
                    />
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                    <Box sx={{ p: 1.2, background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: 11.5, display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#64748b" }}>Z-Score (Study Hours):</span>
                      <strong style={{ color: sandboxZStudy >= 0 ? "#16a34a" : "#dc2626" }}>Z = {sandboxZStudy > 0 ? `+${sandboxZStudy}` : sandboxZStudy}σ</strong>
                    </Box>
                    <Box sx={{ p: 1.2, background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: 11.5, display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#64748b" }}>Z-Score (Inactivity):</span>
                      <strong style={{ color: sandboxZInactive > 0 ? "#dc2626" : "#16a34a" }}>Z = {sandboxZInactive > 0 ? `+${sandboxZInactive}` : sandboxZInactive}σ</strong>
                    </Box>
                    <Box sx={{ p: 1.2, background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: 11.5, display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#64748b" }}>Logistic Regression Logit (z):</span>
                      <strong>z = {logitZ}</strong>
                    </Box>
                    <Box sx={{ p: 1.2, background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: 11.5, display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#64748b" }}>Sigmoid squashed P = 1 / (1 + e^-z):</span>
                      <strong>P = {churnProbability}</strong>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Quick Cheatsheet Table */}
          <Card sx={{ borderRadius: "18px", border: "1px solid #e2e8f0" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, mb: 1, color: "#0f172a" }}>
                📖 Complete Data & AI/ML Mathematical Symbol Cheatsheet
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#64748b", mb: 2 }}>
                Quick reference guide to every symbol, formula, and decision rule across Notenova:
              </Typography>
              <Box sx={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
                      <th style={{ padding: "10px", color: "#0f172a", fontWeight: 700 }}>Symbol</th>
                      <th style={{ padding: "10px", color: "#0f172a", fontWeight: 700 }}>Concept Name</th>
                      <th style={{ padding: "10px", color: "#0f172a", fontWeight: 700 }}>Mathematical Formula</th>
                      <th style={{ padding: "10px", color: "#0f172a", fontWeight: 700 }}>Plain English Interpretation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { s: "μ (Mu)", name: "Mean", f: "Σx_i / N", desc: "Equal share average across all learners" },
                      { s: "Q2", name: "Median", f: "Sorted middle value", desc: "Outlier-resistant center of distribution" },
                      { s: "σ (Sigma)", name: "Standard Deviation", f: "√[ Σ(x_i - μ)² / (N - 1) ]", desc: "Average spread distance from the mean" },
                      { s: "Z", name: "Z-Score", f: "(X - μ) / σ", desc: "Number of standard deviations above/below average" },
                      { s: "IQR", name: "Interquartile Range", f: "Q3 - Q1", desc: "Middle 50% core student spread" },
                      { s: "r", name: "Pearson Correlation", f: "Cov(X,Y) / (σ_x * σ_y)", desc: "Linear association strength (-1 to +1)" },
                      { s: "σ(z)", name: "Sigmoid Function", f: "1 / (1 + e^-z)", desc: "Squashes any number into a probability (0% to 100%)" },
                      { s: "G", name: "Gini Impurity", f: "1 - Σ(p_i²)", desc: "Tree node purity (0 = pure, 0.5 = maximum chaos)" },
                      { s: "d(p, q)", name: "Euclidean Distance", f: "√[ Σ(p_j - q_j)² ]", desc: "Distance between two students in 7D space" },
                      { s: "F1", name: "F1-Score", f: "2 * (P * R) / (P + R)", desc: "Harmonic balance between Precision and Recall" },
                      { s: "WCSS", name: "K-Means Inertia", f: "Σ ||x_i - μ_k||²", desc: "Total tightness of clusters around centroids" },
                      { s: "PC1, PC2", name: "Principal Components", f: "Eigenvectors of Cov(X)", desc: "2D projection capturing 82% of all 7D variance" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "10px", fontWeight: 800, color: "#0284c7", fontFamily: "monospace" }}>{row.s}</td>
                        <td style={{ padding: "10px", fontWeight: 700, color: "#0f172a" }}>{row.name}</td>
                        <td style={{ padding: "10px", fontFamily: "monospace", color: "#334155" }}>{row.f}</td>
                        <td style={{ padding: "10px", color: "#64748b" }}>{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default DataAiAcademyStudio;
