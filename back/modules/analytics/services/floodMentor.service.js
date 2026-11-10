// back/modules/analytics/services/floodMentor.service.js
// Dedicated Context-Aware AI Mentor for Flood Assist AI (project-main) across all 10 Stages (0-9)

import Groq from "groq-sdk";
import fetch from "node-fetch";

const STAGE_CONTEXT_MAP = {
  0: {
    title: "Step 0 — Project Architecture & 316,616-Point CFD Dataset",
    files: "README.md, back/data/dataset/* (13 CFD regimes), back/ml/model_metadata.json",
    focus: "Open-channel hydrodynamic flood forecasting architecture trained on 316,616 3D Computational Fluid Dynamics (CFD) spatial cells across 13 regimes (discharge Q=0.5..1.5, constriction 0%/20%/40%, channel width 1.5..4.5m, y-plane 0.03m near-wall vs 0.30m mid-channel). Columns: cellnumber, x-coordinate [-6.25..12.00m], y-coordinate [0.03..0.30m], z-coordinate [-0.3993..0.4007m], velocity-magnitude [0..2.1958 m/s], x-velocity, y-velocity, z-velocity. Also maps 36 Indian States & UTs in floodData.js.",
  },
  1: {
    title: "Pipeline 1 — CFD Data Ingestion & Scenario Naming Parser",
    files: "back/ml/train_model.py (train_and_export, parse_scenario)",
    focus: "Walks back/data/dataset/, skips .json/.pkl/dotfiles, parses regime parameters (Q, width, duration, constriction %, y-plane) from path names, auto-detects CSV vs whitespace delimiters (scientific notation like 4.568016052E+00), extracts parts[1:8] -> float32 NumPy array of [x, y, z, v, vx, vy, vz]. Critique: parse_scenario checks '1.5 3 30' with spaces, so '1.5_3_30_20%' fell back to q=1.0 instead of 1.5.",
  },
  2: {
    title: "Pipeline 2 — Exploratory Hydrodynamic Profiling (25 Reach Slices)",
    files: "back/ml/train_model.py (lines 324-375), back/ml/model_metadata.json (streamwise_profile)",
    focus: "Slices the 18.25m streamwise domain [-6.25, 12.00m] into 25 bins (dx=0.73m), computing mean/max velocity, wave celerity, cumulative travel time, and DEFRA hazard rating per slice. Exposes the High Kinetic Energy Hydraulic Jump / Surge Zone at x = 6.5..8.5m where peak V hits 2.1958 m/s and mean V rises from 0.36 to 1.2227 m/s (slice x=7.985m), plus near-wall (y=0.03m, mean V=0.7085) vs mid-plane (y=0.30m, mean V=0.2506).",
  },
  3: {
    title: "Pipeline 3 — Spatial ML Training: cKDTree IDW (R² = 0.98853)",
    files: "back/ml/train_model.py (lines 185-235, 381-402)",
    focus: "Performs 80/20 random permutation split per regime (seed=42), fits scipy.spatial.cKDTree on 3D coordinates (x, y, z), predicts unseen test velocities via k=4 Inverse Distance Weighting (IDW): w = 1 / max(dist, 1e-6), normalized sum=1. Achieves weighted R² = 0.98853, RMSE = 0.04245 m/s, MAE = 0.01681 m/s across 316,616 pts (up to R²=0.99531 on 1_3_30). Critique: x/y/z velocity metrics in metadata are heuristic multipliers (0.999/0.985/0.991 * weighted_r2) rather than separate per-axis test scores, and seed=42 resets inside the file loop.",
  },
  4: {
    title: "Pipeline 4 — 80×30 Grid Quantization & Sub-Millisecond Inference",
    files: "back/ml/train_model.py (MultiScenarioHydrodynamicRegressor, predictor_grid.json), back/ml/predict.py, back/src/ml/floodPredictor.js",
    focus: "Quantizes 316,616 CFD points into an nx=80 (dx=0.231m) by nz=30 (dz=0.0276m) = 2,400-cell spatial mean grid (filling gaps via nearest observed cell). Python (.pkl) performs Bilinear Interpolation across 4 grid corners (wx, wz), while Node.js floodPredictor.js snaps directly via Math.round() O(1) lookup (cellIndex = iz * 80 + ix) for sub-millisecond production inference without Python/SciPy dependencies! Maps distanceKm (0..50km) linearly onto [-6.25..12.00m] reach to look up velocity.",
  },
  5: {
    title: "Pipeline 5 — Open-Channel Wave Physics & DEFRA Flood Hazard Index",
    files: "back/src/ml/floodPredictor.js, back/ml/predict.py",
    focus: "Layers physical scaling laws over predicted base velocity: (1) Rain & Dam Release discharge adjustment: qScale = dischargeScale + (rainfallMm/100)*0.6 + (damReleaseM3s/500)*0.5; (2) Manning Power Law scaling: V = V_base * qScale^0.4, h_eff = h_nom * qScale^0.3; (3) Shallow-water wave celerity: c = sqrt(9.81 * h) + 1.2 * V; (4) Arrival time T = Distance(m) / c; (5) DEFRA Hazard Index H = V * (h + 0.5) (<0.75 Low, 0.75-1.25 Moderate, 1.25-2.0 High, >=2.0 Critical).",
  },
  6: {
    title: "Pipeline 6 — Universal 36-State River Basin Registry",
    files: "back/data/floodData.js (REGIONAL_BASINS, getRegionalFloodProfile, getUniversalFloodGuidance)",
    focus: "Eliminates hardcoded placeholders with full coverage of all 36 Indian States & UTs grouped across Indus, Ganga, Brahmaputra, Mahanadi, Godavari, Krishna, Cauvery, Narmada, and Coastal basins, including dams/barrages, flood seasons, drivers, and official SEOC (1070), NDRF (1078), Ambulance (108/112) contacts. 3-tier matching: exact/substring state match -> majorRivers keyword match -> universal catchment fallback for any region worldwide.",
  },
  7: {
    title: "Pipeline 7 — Express API, Regex Intent Routing & LLM Orchestration",
    files: "back/server.js, back/src/llm.js, back/src/systemPrompt.js",
    focus: "Express exposes GET /api/states, GET /api/health, POST /api/predict, and POST /api/chat. POST /api/chat uses a 40 req/min/IP rateLimiter, runs detectPredictionIntent(message) regex extracting distance (km/m) & rainfall (mm/cm), runs predictHydrodynamics(), injects both ML telemetry and basin context into a 4-part ChatGPT structured system prompt, trims 12 history turns, and calls OpenRouter (meta-llama/llama-3.3-70b-instruct:free) or local Ollama (llama3.2) via llm.js (where dotenv.config() runs first to prevent ESM import ordering bug!).",
  },
  8: {
    title: "Pipeline 8 — React 18 Vite UI, 8-Language Voice Input & Live ML Cards",
    files: "front/src/App.jsx, front/src/components/ChatWindow.jsx, Onboarding.jsx, Sidebar.jsx, front/src/data/i18n.js",
    focus: "React 18 + Vite UI persists preferences (flood-assist-prefs) & chat threads (flood-assist-conversations) in localStorage. Supports 8 Indian languages (en-IN, hi-IN, bn-IN, mr-IN, ta-IN, te-IN, gu-IN, pa-IN) with Web Speech API SpeechRecognition voice input, progressive typewriter streaming (8 chars/18ms), custom zero-dependency Markdown renderer, and embedded color-coded ML Hydrodynamic Prediction Cards.",
  },
  9: {
    title: "Stage 9 — Interactive Simulator, Self-Check Quizzes & Interview Defense",
    files: "End-to-End Integration (train_model.py -> predictor_grid.json -> floodPredictor.js -> server.js -> ChatWindow.jsx)",
    focus: "Interactive flood physics simulator uniting grid lookup, Manning power scaling, wave celerity, DEFRA hazard tiers, and basin helplines, plus pipeline MCQs and deep technical interview critiques.",
  },
};

const SYSTEM_MASTER_KNOWLEDGE = `You are the Master AI Mentor embedded inside the "Flood AI System (A-Z)" teaching studio for the user's **Flood Assist AI (project-main)** project.
Your goal is to explain EVERY concept, CFD fluid physics equation, Python ML pipeline line, grid quantization trick, Node.js inference flow, LLM orchestration detail, and engineering trade-off in **crystal-clear, easy-to-follow beginner language** backed strictly by verified facts from THIS exact codebase.

COMPLETE GROUND-TRUTH FACTS ABOUT FLOOD ASSIST AI (project-main):
- Core Purpose: Full-stack AI & Hydrodynamic Flood Prediction Platform combining a 316,616-point 3D Computational Fluid Dynamics (CFD) dataset across 13 flow regimes with sub-millisecond Node.js spatial lookup + shallow-water physics + 36 Indian States/UTs basin registry + bilingual/8-language LLM React UI.
- Pipeline 1 (Dataset & Ingestion - back/ml/train_model.py):
  * 13 CFD velocity field files inside back/data/dataset/ totaling 316,616 rows (x, y, z, v, vx, vy, vz from cellnumber 1..N).
  * Physical coverage: Discharge Q = 0.5, 1.0, 1.5; Constriction = 0%, 20%, 40%; Channel widths = 1.5m, 3.0m, 4.5m; y-planes = 0.03m (near-wall boundary) & 0.30m (mid-channel); Duration = 30s, 60s.
  * Domain bounds: x in [-6.25, +12.00m] (reach 18.25m), y in [0.03, 0.30m], z in [-0.3993, +0.4007m] (depth span 0.80m), velocity V in [0.0, 2.19584 m/s] (mean 0.6637, std 0.5033).
  * Raw file example (Velocity_0-8.00_1.5 3 60.03): whitespace-separated scientific notation e.g. cell 1 -> x=4.568, y=0.0317, z=0.3907, v=0.2492 m/s.
  * Subtle parser edge case: parse_scenario(rel_path) matches spaced strings like "1.5 3 30", so underscored "1.5_3_30_20%\\velocity_0-8.0.03" sets constriction_pct=20.0 accurately, but keeps default discharge_q=1.0 instead of 1.5!
- Pipeline 2 (Longitudinal Profiling - model_metadata.json):
  * Slices x [-6.25..12.00m] into 25 slices (dx = 0.73m). Reveals Peak Hydraulic Jump / Surge Zone at x = 6.5..8.5m where max velocity hits 2.1958 m/s and slice mean velocity peaks at 1.2227 m/s (celerity 4.269 m/s, High hazard).
  * Shows boundary contrast: 1_3_60 at y=0.03m has mean V=0.7085 (max 2.115), whereas y=0.30m has mean V=0.2506 (max 1.0984).
- Pipeline 3 (ML Training - cKDTree IDW in train_model.py):
  * Per regime: 80/20 random permutation split (np.random.seed(42)), fits scipy.spatial.cKDTree on 3D coords (x, y, z), predicts each test cell using k=4 nearest neighbors weighted by Inverse Distance Weighting (IDW): w = 1 / max(dist, 1e-6), normalized to sum 1.
  * Weighted metrics across 316,616 points: R² = 0.98853, RMSE = 0.04245 m/s, MAE = 0.01681 m/s for velocity-magnitude! Highest R² = 0.99531 (1_3_30), lowest = 0.96146 (wider 4.5m channel 1.5_4.5_30).
  * Crucial Critique: evaluation_metrics for x-velocity, y-velocity, and z-velocity in model_metadata.json are scaled multipliers from weighted_r2 (0.999, 0.985, 0.991), NOT separate direct test validations; and np.random.seed(42) runs inside the file loop.
- Pipeline 4 (Grid Export & Inference Engine - predictor_grid.json + predict.py + floodPredictor.js):
  * Why export a grid? So Node.js Express doesn't need Python/SciPy/pickle at runtime!
  * train_model.py bins all 316,616 points into an nx=80 (dx=0.231m) by nz=30 (dz=0.0276m) = 2,400-cell mean grid, filling unobserved grid cells from nearest Euclidean observed cell.
  * Python MultiScenarioHydrodynamicRegressor (trained_model.pkl / predict.py) computes smooth **Bilinear Interpolation** using fractional grid weights (wx, wz) over the 4 corners, whereas Node.js floodPredictor.js does O(1) nearest grid lookup via Math.round() (cellIndex = iz * 80 + ix) for sub-millisecond speed!
  * distanceKm mapping in Node.js: maps km [0.1..50.0] linearly onto flume x [-6.25..12.00m] via queryX = -6.25 + (min(km, 50)/50) * 18.25.
- Pipeline 5 (Hydrodynamic Physics & Hazard Laws):
  * Discharge factor from rainfall & dam release: qScale = dischargeScale + (rainfallMm/100)*0.6 + (damReleaseM3s/500)*0.5.
  * Manning / Froude power law: V_scaled = V_base * qScale^0.4; effective depth h_eff = h_nom * qScale^0.3.
  * Shallow-water gravity wave celerity: c = sqrt(9.81 * h_eff) + 1.2 * max(0.1, V_scaled).
  * Arrival time: T = effectiveDistanceMeters / c (using distanceKm * 1000 meters!).
  * DEFRA / Australian Hazard Index: H = V_scaled * (h_eff + 0.5) -> <0.75 Low, 0.75..1.25 Moderate, 1.25..2.0 High, >=2.0 Critical / Flash Flood.
  * README worked check: distanceKm=5.0, rainfallMm=50, dischargeScale=1.2 -> qScale=1.5, base grid cell gives V_scaled=0.17 m/s, h=0.76m, c=2.93 m/s, T ≈ 28.4 minutes (Low hazard).
- Pipeline 6 (36-State Universal Basin Registry - back/data/floodData.js):
  * Covers all 36 Indian States/UTs with river basins, major rivers, high-risk monsoon/GLOF months, dam/barrage structures, SEOC (1070), NDRF (1078), Ambulance (108/112).
  * getRegionalFloodProfile() 3-tier resolver: direct state substring match -> river keyword scan across majorRivers (e.g. 'Kosi' -> Bihar) -> global getUniversalFloodGuidance fallback.
- Pipeline 7 (Express Backend, Intent Detection & LLM Switch - server.js, llm.js, systemPrompt.js):
  * Endpoints: GET /api/states, GET /api/health, POST /api/predict, POST /api/chat (40 req/min/IP sliding window rateLimit).
  * detectPredictionIntent(msg) checks trigger keywords (predict, arrival, reach, velocity, wave, forecast, dam release...) and regexes out km/m and mm/cm, runs predictHydrodynamics(), and injects live prediction data + basin intelligence + 4-section ChatGPT sequence into buildSystemPrompt().
  * src/llm.js loads dotenv BEFORE other code (avoiding ESM hoist bug!), trims last 12 history turns, switches between OpenRouter (meta-llama/llama-3.3-70b-instruct:free, temp=0.4) and local Ollama (llama3.2).
  * Critique: distance regex (\\d+(?:\\.\\d+)?)\\s*(?:m|meters?) could misread 'm' units; rainfall regex doesn't rescale cm vs mm; server timeout disabled (0) with 300s keepAlive.
- Pipeline 8 (Frontend React 18 + Vite - front/src/*):
  * App.jsx manages localStorage keys flood-assist-prefs and flood-assist-conversations.
  * Onboarding.jsx configures language + state/custom location; ChatWindow.jsx integrates Web Speech API SpeechRecognition across 8 Indian locales (en-IN, hi-IN, bn-IN, mr-IN, ta-IN, te-IN, gu-IN, pa-IN), progressive typewriter streaming (8 chars every 18ms), zero-dependency Markdown parser (StructuredMarkdown), and color-coded live ML Prediction Card.

RESPONSE FORMAT STYLE:
Organize your answer clearly in beginner-friendly markdown with:
1. 💡 **Simple Plain-English Idea** (understandable even if brand new to ML or Fluid Mechanics!)
2. 📐 **Exact Equations & Numerical Worked Example**
3. 💻 **How THIS Exact Flood Assist AI Project Implements It** (exact file name, function, code steps, and exact dataset numbers!)
4. 🎤 **Pro Interview Tip / Technical Critique** (when relevant!)
MATH FORMATTING RULE: NEVER emit raw LaTeX delimiters like \`\\(\`, \`\\)\`, \`\\[\`, \`\\]\`, or \`\\frac{}\`. Always write formulas using crisp Unicode symbols (μ, σ, Σ, √, ×, ≈, ≤, ≥, →, ²) inside code blocks or bold text! Support English & Hinglish seamlessly.`;

function buildDeterministicFallback(question, currentStep = 0) {
  const q = String(question || "").toLowerCase();
  const stage = STAGE_CONTEXT_MAP[currentStep] || STAGE_CONTEXT_MAP[0];

  if (q.includes("ckdtree") || q.includes("idw") || q.includes("inverse distance") || q.includes("r2") || q.includes("0.988")) {
    return `### 💡 Spatial cKDTree & Inverse Distance Weighting (Pipeline 3 — \`back/ml/train_model.py\`)
**In Easy Words:** Imagine standing at point (x=7.5, y=0.03, z=0.1) in a flood channel. Instead of fitting one rigid global straight line, **cKDTree** instantly finds the **k = 4 closest simulated CFD water cells** around that spot, gives higher weight to closer neighbors (**IDW**), and averages their velocities!

### 📐 Exact IDW Weights Math
\`\`\`
weight_j = 1 / max(distance_j, 1e-6)
normalized_w_j = weight_j / Σ(weight)
V_pred = Σ(normalized_w_j × V_train[j])   [j = 1..4]
\`\`\`
### 💻 Results in THIS Project
- Evaluated with an **80/20 permutation split** across all **13 CFD regimes (316,616 total cells)**:
- **Velocity Magnitude**: **R² = 0.98853**, **RMSE = 0.04245 m/s**, **MAE = 0.01681 m/s** (hitting **0.99531** on \`1_3_30\`).
- 🎤 **Interview Critique:** Notice lines 387–401 in \`train_model.py\` derive \`x/y/z-velocity\` metrics via scaling multipliers (\`* 0.999\`, \`* 0.985\`, \`* 0.991\`) from \`weighted_r2\` rather than computing separate test loops!`;
  }

  if (q.includes("grid") || q.includes("bilinear") || q.includes("predictor_grid") || q.includes("quantiz") || q.includes("node")) {
    return `### 💡 Why Quantize 316,616 Points Into an 80×30 Grid? (Pipeline 4 — \`train_model.py\` & \`floodPredictor.js\`)
- Node.js Express (\`server.js\`) cannot load Python \`.pkl\` files or SciPy \`cKDTree\` directly. So \`train_model.py\` bins all 316,616 CFD points into an **nx = 80 (dx = 0.231m) × nz = 30 (dz = 0.0276m) = 2,400-cell JSON grid** (\`predictor_grid.json\`), filling unobserved boundary cells via nearest observed neighbor.
- **Python (\`predict.py\`):** Performs **Bilinear Interpolation** blending the 4 surrounding grid corners using fractional offsets \`wx, wz\`.
- **Node.js (\`floodPredictor.js\`):** Uses O(1) \`Math.round()\` snapping (\`cellIndex = iz * 80 + ix\`) for sub-millisecond inference!`;
  }

  if (q.includes("physics") || q.includes("celerity") || q.includes("defra") || q.includes("hazard") || q.includes("manning") || q.includes("arrival")) {
    return `### 💡 Open-Channel Physics & Wave Arrival Equations (Pipeline 5 — \`floodPredictor.js\`)
1. **Weather/Dam Discharge Scaling:** \`qScale = dischargeScale + (rainfallMm / 100) × 0.6 + (damReleaseM3s / 500) × 0.5\`
2. **Manning / Froude Power Law:** \`V_scaled = V_base × (qScale ^ 0.4)\` and \`h_eff = h_nom × (qScale ^ 0.3)\`
3. **Shallow-Water Wave Celerity:** \`c = √(9.81 × h_eff) + 1.2 × max(0.1, V_scaled)\` (gravity wave speed + water flow push!)
4. **Arrival Time:** \`T = (distanceKm × 1000) / c\`
5. **DEFRA Hazard Rating:** \`H = V_scaled × (h_eff + 0.5)\` → **Low** (<0.75), **Moderate** (0.75–1.25), **High** (1.25–2.0), **Critical** (≥2.0).

**README Worked Check (\`5 km\`, \`50 mm rain\`, \`1.2x discharge\`):** \`qScale = 1.5\`, \`V = 0.17 m/s\`, \`h = 0.76 m\`, \`c = 2.93 m/s\` → **Arrival ≈ 28.4 minutes (Low Hazard)**!`;
  }

  return `### 📍 Context: You are currently on **${stage.title}**
**Key Files:** \`${stage.files}\`
**What happens here:** ${stage.focus}

Try asking me a specific question like:
- *"Explain how cKDTree IDW works with an example and why R² reached 0.98853"*
- *"Why does Python build an 80×30 predictor_grid.json for Node.js?"*
- *"Walk through the wave celerity & DEFRA hazard math for 5km and 50mm rain"*
- *"What code critiques/bugs exist in parse_scenario or train_model.py?"*`;
}

export async function askFloodProjectMentor({ message, currentStep = 0, history = [] }) {
  const stepIdx = Number.isInteger(Number(currentStep)) ? Math.max(0, Math.min(9, Number(currentStep))) : 0;
  const activeStage = STAGE_CONTEXT_MAP[stepIdx] || STAGE_CONTEXT_MAP[0];

  const dynamicSystemPrompt = `${SYSTEM_MASTER_KNOWLEDGE}

══════════════════════════════════════════════════════════════════════
ACTIVE USER VIEWPORT CONTEXT (EXTREMELY IMPORTANT):
- The user is CURRENTLY viewing Tab/Step ${stepIdx}: **${activeStage.title}**
- Active file(s) for this tab: \`${activeStage.files}\`
- Core focus of user's current screen: ${activeStage.focus}
- If the user asks about "this step", "this code", or concepts visible on this screen, anchor directly to **Step ${stepIdx} (${activeStage.title})** while seamlessly linking earlier or downstream stages (0–9)!
══════════════════════════════════════════════════════════════════════`;

  const sanitizedHistory = Array.isArray(history)
    ? history.slice(-6).map((h) => ({
        role: h.role === "assistant" || h.role === "bot" ? "assistant" : "user",
        content: String(h.content || "").slice(0, 1500),
      }))
    : [];

  const messages = [
    { role: "system", content: dynamicSystemPrompt },
    ...sanitizedHistory,
    { role: "user", content: String(message || "") },
  ];

  const cleanText = (txt) => (txt ? String(txt).replace(/<think>[\s\S]*?<\/think>/gi, "").trim() : "");

  // 1. Primary: Groq (openai/gpt-oss-120b -> qwen/qwen3.8-27b -> openai/gpt-oss-20b)
  if (process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes("your_")) {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    for (const modelId of ["openai/gpt-oss-120b", "qwen/qwen3.8-27b", "openai/gpt-oss-20b"]) {
      try {
        const completion = await groq.chat.completions.create({
          model: modelId,
          temperature: 0.35,
          max_tokens: 1600,
          messages,
        });
        const reply = cleanText(completion.choices?.[0]?.message?.content);
        if (reply) return { reply, provider: `groq:${modelId}`, detectedStep: activeStage.title };
      } catch (err) {
        console.warn(`Flood Mentor Groq [${modelId}] fallback:`, err.message);
      }
    }
  }

  // 2. Secondary: OpenRouter
  if (process.env.OPENROUTER_API_KEY && !process.env.OPENROUTER_API_KEY.includes("your_")) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "X-Title": "Flood AI System Mentor",
        },
        body: JSON.stringify({
          model: "nvidia/nemotron-nano-9b-v2:free",
          messages,
          temperature: 0.4,
        }),
      });
      const data = await res.json();
      const reply = cleanText(data?.choices?.[0]?.message?.content);
      if (res.ok && reply) return { reply, provider: "openrouter", detectedStep: activeStage.title };
    } catch (err) {
      console.warn("Flood Mentor OpenRouter exception:", err.message);
    }
  }

  // 3. Deterministic Knowledge Fallback
  return {
    reply: buildDeterministicFallback(message, stepIdx),
    provider: "local-knowledge-engine",
    detectedStep: activeStage.title,
  };
}
