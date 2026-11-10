// dash/src/features/analytics/floodProjectData.js
// Exact verified data, CFD benchmarks, streamwise reach slice profiles, physics parameters,
// sample raw CFD cells, quizzes, and interview Q&A from Flood Assist AI (project-main).

export const FLOOD_OVERVIEW = {
  totalPoints: 316616,
  totalRegimes: 13,
  xMin: -6.25,
  xMax: 12.0,
  xRange: 18.25,
  yMin: 0.03,
  yMax: 0.30,
  zMin: -0.3993,
  zMax: 0.4007,
  zRange: 0.80,
  vMin: 0.0,
  vMax: 2.19584,
  vMean: 0.6637,
  vStd: 0.5033,
  weightedR2: 0.98853,
  weightedRMSE: 0.04245,
  weightedMAE: 0.01681,
  gridNx: 80,
  gridNz: 30,
  gridDx: 0.23101,
  gridDz: 0.02759,
  statesCovered: 36,
};

export const CFD_COLUMNS = [
  { name: "cellnumber", type: "int (dropped)", desc: "Mesh cell ID index (1 to N). Sliced away by parts[1:8] so geometry IDs never enter ML." },
  { name: "x-coordinate", type: "float32 (m)", desc: "Streamwise downstream distance along flume reach [-6.25 m to +12.00 m] (18.25 m total span)." },
  { name: "y-coordinate", type: "float32 (m)", desc: "Transverse height plane above channel floor: 0.03 m (near-wall boundary) vs 0.30 m (mid-depth)." },
  { name: "z-coordinate", type: "float32 (m)", desc: "Cross-channel lateral/depth span [-0.3993 m to +0.4007 m] (0.80 m span)." },
  { name: "velocity-magnitude", type: "float32 (m/s) ★", desc: "Primary target V = √(Vx² + Vy² + Vz²), peaking at 2.19584 m/s in hydraulic surge zone." },
  { name: "x-velocity", type: "float32 (m/s)", desc: "Downstream longitudinal velocity component Vx along river direction." },
  { name: "y-velocity", type: "float32 (m/s)", desc: "Cross-stream / wall-normal velocity component Vy." },
  { name: "z-velocity", type: "float32 (m/s)", desc: "Vertical / spanwise velocity component Vz (turbulent upwelling/downwelling)." },
];

export const RAW_CFD_SAMPLES = [
  { file: "Velocity_0-8.00_1.5 3 60.03", cell: 1, x: "4.5680", y: "0.0317", z: "0.3907", v: "0.2492", vx: "-0.2484", vy: "0.0190", vz: "0.0002" },
  { file: "Velocity_0-8.00_1.5 3 60.03", cell: 2, x: "4.5680", y: "0.0317", z: "0.3706", v: "0.2672", vx: "-0.2661", vy: "0.0241", vz: "-0.0013" },
  { file: "0.5_3_60/Velocity_0-8.00.03", cell: 1, x: "-1.0984", y: "0.0300", z: "-0.3926", v: "0.0632", vx: "0.0632", vy: "-0.0002", vz: "-0.0002" },
  { file: "0.5_3_60/Velocity_0-8.00.03", cell: 6, x: "-1.0185", y: "0.0300", z: "-0.3525", v: "0.2583", vx: "0.2583", vy: "-0.0021", vz: "-0.0004" },
];

export const CFD_SCENARIOS_13 = [
  { file: "Velocity_0-8.00_1.5 3 60.03", q: 1.5, width: 3.0, dur: 60, constr: 0, y: 0.03, samples: 21642, vMax: 2.1150, vMean: 0.7085, r2: 0.99366, rmse: 0.03993 },
  { file: "Velocity_0-8.0_0.5 3 30.03", q: 0.5, width: 3.0, dur: 30, constr: 0, y: 0.03, samples: 21743, vMax: 1.8331, vMean: 0.7775, r2: 0.99368, rmse: 0.03658 },
  { file: "Velocity_0-8.0_1.5 1.5 30.03", q: 1.5, width: 1.5, dur: 30, constr: 0, y: 0.03, samples: 21348, vMax: 2.1332, vMean: 0.6757, r2: 0.99288, rmse: 0.03871 },
  { file: "Velocity_0-8.0_1.5 3 30.03", q: 1.5, width: 3.0, dur: 30, constr: 0, y: 0.03, samples: 21293, vMax: 2.1852, vMean: 0.7209, r2: 0.99357, rmse: 0.04044 },
  { file: "Velocity_0-8.0_1.5 4.5 30.03", q: 1.5, width: 4.5, dur: 30, constr: 0, y: 0.03, samples: 25020, vMax: 2.1526, vMean: 0.6487, r2: 0.96146, rmse: 0.10272 },
  { file: "velocity_0-8.0_1.5 3.03", q: 1.5, width: 3.0, dur: 30, constr: 0, y: 0.03, samples: 21688, vMax: 2.0738, vMean: 0.7035, r2: 0.99419, rmse: 0.03980 },
  { file: "0.5_3_60\\Velocity_0-8.00.03", q: 0.5, width: 3.0, dur: 60, constr: 0, y: 0.03, samples: 21654, vMax: 1.8908, vMean: 0.7593, r2: 0.99471, rmse: 0.03467 },
  { file: "0.5_3_60\\Velocity_0-8.00.3", q: 0.5, width: 3.0, dur: 60, constr: 0, y: 0.30, samples: 23566, vMax: 0.9379, vMean: 0.2302, r2: 0.96642, rmse: 0.03161 },
  { file: "1.5_3_30_20%\\velocity_0-8.0.03", q: 1.0, width: 3.0, dur: 30, constr: 20, y: 0.03, samples: 29678, vMax: 2.1958, vMean: 0.8020, r2: 0.99340, rmse: 0.04299 },
  { file: "1.5_3_30_40%\\Velocity0-8.0.03", q: 1.0, width: 3.0, dur: 30, constr: 40, y: 0.03, samples: 20299, vMax: 2.1088, vMean: 0.6782, r2: 0.98786, rmse: 0.04452 },
  { file: "1_3_30\\Velocity_0-8.0.03", q: 1.0, width: 3.0, dur: 30, constr: 0, y: 0.03, samples: 43221, vMax: 2.0720, vMean: 0.8308, r2: 0.99531, rmse: 0.03785 },
  { file: "1_3_60\\Velocity_0-8.00.03", q: 1.0, width: 3.0, dur: 60, constr: 0, y: 0.03, samples: 21642, vMax: 2.1150, vMean: 0.7085, r2: 0.99366, rmse: 0.03993 },
  { file: "1_3_60\\Velocity_0-8.00.3", q: 1.0, width: 3.0, dur: 60, constr: 0, y: 0.30, samples: 23822, vMax: 1.0984, vMean: 0.2506, r2: 0.98783, rmse: 0.02042 },
];

export const STREAMWISE_PROFILE_25 = [
  { x: -5.885, meanV: 0.0163, maxV: 0.0784, celerity: 2.821, cumSec: 0.26, hazard: "Low" },
  { x: -5.155, meanV: 0.0508, maxV: 0.1750, celerity: 2.862, cumSec: 0.51, hazard: "Low" },
  { x: -4.425, meanV: 0.0950, maxV: 0.2555, celerity: 2.915, cumSec: 0.76, hazard: "Low" },
  { x: -3.695, meanV: 0.1453, maxV: 0.3393, celerity: 2.976, cumSec: 1.01, hazard: "Low" },
  { x: -2.965, meanV: 0.2001, maxV: 0.4157, celerity: 3.042, cumSec: 1.25, hazard: "Low" },
  { x: -2.235, meanV: 0.2563, maxV: 0.4935, celerity: 3.109, cumSec: 1.48, hazard: "Low" },
  { x: -1.505, meanV: 0.3165, maxV: 0.5721, celerity: 3.181, cumSec: 1.71, hazard: "Low" },
  { x: -0.775, meanV: 0.3799, maxV: 0.6537, celerity: 3.257, cumSec: 1.94, hazard: "Low" },
  { x: -0.045, meanV: 0.4473, maxV: 0.7424, celerity: 3.338, cumSec: 2.16, hazard: "Low" },
  { x: 0.685, meanV: 0.5060, maxV: 0.8257, celerity: 3.409, cumSec: 2.37, hazard: "Low" },
  { x: 1.415, meanV: 0.5662, maxV: 0.9117, celerity: 3.481, cumSec: 2.58, hazard: "Low" },
  { x: 2.145, meanV: 0.5927, maxV: 0.9971, celerity: 3.513, cumSec: 2.79, hazard: "Moderate" },
  { x: 2.875, meanV: 0.6407, maxV: 1.0782, celerity: 3.570, cumSec: 2.99, hazard: "Moderate" },
  { x: 3.605, meanV: 0.6665, maxV: 1.1124, celerity: 3.601, cumSec: 3.20, hazard: "Moderate" },
  { x: 4.335, meanV: 0.4865, maxV: 1.1558, celerity: 3.385, cumSec: 3.41, hazard: "Low" },
  { x: 5.065, meanV: 0.3290, maxV: 1.2227, celerity: 3.196, cumSec: 3.64, hazard: "Low" },
  { x: 5.795, meanV: 0.3601, maxV: 2.1434, celerity: 3.234, cumSec: 3.87, hazard: "Low" },
  { x: 6.525, meanV: 0.3668, maxV: 2.1526, celerity: 3.242, cumSec: 4.09, hazard: "Low" },
  { x: 7.255, meanV: 0.7912, maxV: 2.1516, celerity: 3.751, cumSec: 4.29, hazard: "Moderate" },
  { x: 7.985, meanV: 1.2227, maxV: 2.1958, celerity: 4.269, cumSec: 4.46, hazard: "High" },
  { x: 8.715, meanV: 1.0526, maxV: 2.1029, celerity: 4.065, cumSec: 4.64, hazard: "High" },
  { x: 9.445, meanV: 0.5959, maxV: 2.1332, celerity: 3.516, cumSec: 4.84, hazard: "Moderate" },
  { x: 10.175, meanV: 0.6611, maxV: 1.5926, celerity: 3.595, cumSec: 5.05, hazard: "Moderate" },
  { x: 10.905, meanV: 1.0471, maxV: 1.6874, celerity: 4.058, cumSec: 5.23, hazard: "High" },
  { x: 11.635, meanV: 0.9619, maxV: 1.4850, celerity: 3.956, cumSec: 5.41, hazard: "High" },
];

export const EVALUATION_METRICS_TABLE = [
  { target: "Velocity Magnitude (V)", r2: 0.98853, rmse: 0.04245, mae: 0.01681, method: "Genuine Weighted 80/20 cKDTree IDW (k=4)" },
  { target: "Streamwise Velocity (Vx)", r2: 0.98754, rmse: 0.04288, mae: 0.01698, method: "Derived scale factor (*0.999 / *1.01) from V metric" },
  { target: "Transverse Velocity (Vy)", r2: 0.97370, rmse: 0.01486, mae: 0.00588, method: "Derived scale factor (*0.985 / *0.35) from V metric" },
  { target: "Vertical Velocity (Vz)", r2: 0.97963, rmse: 0.02335, mae: 0.00925, method: "Derived scale factor (*0.991 / *0.55) from V metric" },
];

export const SAMPLE_BASINS = [
  { state: "Bihar", basin: "Lower-Middle Ganga Basin", rivers: "Ganga, Kosi, Gandak, Bagmati, Son", season: "July to October", dams: "Kosi Barrage (Birpur), Valmiki Gandak Barrage, Indrapuri Barrage", drivers: "Transboundary runoff from Nepal Himalayas, Kosi avulsion/siltation, Ganga backwater" },
  { state: "Assam", basin: "Brahmaputra & Barak River Basins", rivers: "Brahmaputra, Barak, Dhansiri, Subansiri, Kopili", season: "May to September", dams: "Kopili Dam, Doyang Dam, Subansiri Lower Project", drivers: "Assam-Meghalaya extreme monsoon, sediment-choked shallow beds, multi-wave breaching" },
  { state: "Himachal Pradesh", basin: "Indus Basin (Satluj, Beas, Ravi, Chenab)", rivers: "Satluj, Beas, Ravi, Chenab, Yamuna, Parvati", season: "July to September", dams: "Bhakra Dam, Pong Dam, Pandoh Dam, Chamera Dam", drivers: "High-gradient flash floods, cloudbursts, landslide dam outbursts (GLOFs)" },
  { state: "West Bengal", basin: "Ganga-Brahmaputra Delta & Damodar Valley", rivers: "Bhagirathi-Hooghly, Damodar, Teesta, Torsa", season: "June to October", dams: "Farakka Barrage, Durgapur Barrage, Maithon & Panchet (DVC)", drivers: "Simultaneous rainfall + DVC releases, Bay of Bengal cyclones, Sundarbans tidal lock" },
  { state: "Odisha", basin: "Mahanadi, Brahmani & Baitarani Basins", rivers: "Mahanadi, Brahmani, Baitarani, Subarnarekha", season: "July to October", dams: "Hirakud Dam, Rengali Dam, Mandira Dam", drivers: "Upper Mahanadi (Chhattisgarh) rainfall + peak coastal storm surge delta breaches" },
  { state: "Delhi", basin: "Yamuna Floodplain Sub-basin", rivers: "Yamuna, Najafgarh Drain, Shahdara Drain", season: "July to September", dams: "Wazirabad Barrage, ITO Barrage, Okhla Barrage (upstream: Hathnikund)", drivers: "Hathnikund barrage releases, stormwater drain backflow, floodplain encroachment" },
];

export const FLOOD_QUIZZES = [
  {
    pipeline: "Pipeline 1 (Data Ingestion)",
    q: "What bug exists in parse_scenario(rel_path) for '1.5_3_30_20%\\velocity_0-8.0.03'?",
    options: [
      "It crashes because of the % sign",
      "Because 'elif \"1.5 3 30\"' checks for spaces instead of underscores, discharge_q fell back to default 1.0 instead of 1.5 (even though constriction_pct=20.0 matched!)",
      "It skips the file completely"
    ],
    answer: 1,
    explanation: "String matching checked spaces ('1.5 3 30') while the folder name used underscores ('1.5_3_30_20%'), leaving discharge_q as default 1.0!"
  },
  {
    pipeline: "Pipeline 3 (cKDTree Spatial Regressor)",
    q: "How does train_model.py predict velocity at an unseen test coordinate (x, y, z) using k=4 Inverse Distance Weighting?",
    options: [
      "It fits a global polynomial degree-4 curve",
      "It queries the 4 closest training points via cKDTree, weights each by 1 / max(dist, 1e-6), normalizes weights to 1, and takes the weighted mean velocity",
      "It averages all 316,616 points equally"
    ],
    answer: 1,
    explanation: "IDW ensures closer CFD mesh neighbors dominate the local interpolation while capping distance at 1e-6 prevents division by zero!"
  },
  {
    pipeline: "Pipeline 4 (Deployment Grid)",
    q: "Why did the developer export an 80×30 predictor_grid.json instead of running Python's trained_model.pkl inside Node.js?",
    options: [
      "Because JSON grids allow Node.js (floodPredictor.js) to run O(1) sub-millisecond cell lookups without booting Python or loading SciPy cKDTree!",
      "Because pickle files cannot hold floating point numbers",
      "Because 316,616 points are too inaccurate"
    ],
    answer: 0,
    explanation: "Quantizing to 2,400 spatial cells decouples heavy offline Python training from ultra-fast Node.js Express runtime serving!"
  },
  {
    pipeline: "Pipeline 5 (Hydrodynamic Physics)",
    q: "Which open-channel physics equations convert base velocity into future arrival time & hazard rating?",
    options: [
      "Newton's Second Law & Ideal Gas Law",
      "Manning Power Law (V ~ Q^0.4), Shallow-Water Wave Celerity (c = √(g·h) + 1.2·V), T = Dist / c, and DEFRA Hazard H = V·(h + 0.5)",
      "Softmax & Cross-Entropy"
    ],
    answer: 1,
    explanation: "Wave celerity c combines gravity wave propagation √(g·h) with bulk advection 1.2·V before classifying DEFRA hazard thresholds (<0.75, 1.25, 2.0)!"
  },
  {
    pipeline: "Pipeline 6 & 7 (Basin & Backend API)",
    q: "Why does back/src/llm.js call dotenv.config() at the top instead of relying solely on server.js calling dotenv.config()?",
    options: [
      "Because in ES Modules (import), imported modules execute BEFORE server.js's body runs, so process.env.LLM_PROVIDER would otherwise read undefined!",
      "Because Node.js deletes .env after 5 seconds",
      "To speed up rate limiting"
    ],
    answer: 0,
    explanation: "ES module imports are evaluated top-down prior to the importing module's statements — classic Node ESM gotcha explicitly solved in llm.js!"
  },
  {
    pipeline: "Pipeline 8 (Frontend UI)",
    q: "How does ChatWindow.jsx deliver its UX without requiring heavy third-party chat libraries?",
    options: [
      "It sends emails to an admin",
      "It combines Web Speech API across 8 Indian locales (en-IN to pa-IN), an 18ms typewriter chunk timer, a custom Markdown parser, and embedded Live Prediction Cards",
      "It uses an iframe to Streamlit"
    ],
    answer: 1,
    explanation: "Every chat turn handles browser voice capture, real-time ML telemetry card injection, typewriter animation, and markdown formatting natively in React!"
  },
];

export const FLOOD_INTERVIEW_QA = [
  {
    q: "1. Explain the end-to-end architecture of Flood Assist AI (`project-main`).",
    a: "It is a dual-runtime AI + Physics flood forecasting assistant. Offline Python (back/ml/train_model.py) ingests 316,616 3D Computational Fluid Dynamics (CFD) points across 13 open-channel regimes, validates spatial prediction using 80/20 splits and SciPy cKDTree k=4 Inverse Distance Weighting (achieving weighted R² = 0.98853, RMSE = 0.04245 m/s), and exports an 80×30 quantized spatial grid (predictor_grid.json) + reach statistics (model_metadata.json). Online, Express (server.js) uses regex intent extraction to invoke sub-millisecond Grid Lookup + Manning Discharge Scaling + Shallow-Water Wave Celerity + DEFRA Hazard scoring in Node.js (floodPredictor.js), merges it with a 36-State river basin registry (floodData.js), instructs OpenRouter/Ollama to respond in a structured 4-step safety plan (systemPrompt.js), and renders live prediction cards + 8-language voice UI in React 18 Vite (ChatWindow.jsx)."
  },
  {
    q: "2. Why did you choose spatial cKDTree IDW & 80×30 grid quantization instead of a deep neural network or plain linear regression?",
    a: "A 3D CFD velocity field contains nonlinear boundary layers, constrictions, and a sharp hydraulic jump surge (up to 2.1958 m/s around x = 6.5–8.5m) that linear regression cannot model accurately. Meanwhile, querying a spatial k-d tree (cKDTree k=4 IDW) honors exact fluid simulation physics with R² = 0.98853 and zero gradient descent instability. Quantizing into a 2,400-cell (80×30) JSON grid lets the production Node.js server answer in under 1 millisecond without any Python/SciPy microservice overhead!"
  },
  {
    q: "3. Compare how Python (`MultiScenarioHydrodynamicRegressor` in `predict.py`) and Node.js (`floodPredictor.js`) compute velocity from the 80×30 grid.",
    a: "Python's regressor performs continuous Bilinear Interpolation across the 4 nearest surrounding grid corners using fractional offsets (wx, wz), yielding smoother transitions between cells. In contrast, Node.js snaps directly via Math.round() (cellIndex = iz * nx + ix) for minimal O(1) CPU work during real-time API calls. Both then apply Manning's open-channel power law (Q^0.4)."
  },
  {
    q: "4. Walk through all physical equations connecting ML velocity to Arrival Time and Flood Hazard.",
    a: "First, rainfall and dam releases adjust discharge multiplier qScale = dischargeScale + (rainfallMm/100)*0.6 + (damReleaseM3s/500)*0.5. Second, Manning power scaling yields V = V_base * qScale^0.4 and effective depth h = h_nom * qScale^0.3. Third, shallow-water wave celerity combines gravity speed & advection: c = √(9.81 * h) + 1.2 * max(0.1, V). Fourth, Arrival Time = (distanceKm * 1000) / c. Finally, DEFRA Hazard Index H = V * (h + 0.5) classifies risk into Low (<0.75), Moderate (0.75–1.25), High (1.25–2.0), or Critical (>=2.0)."
  },
  {
    q: "5. What honest engineering limitations / bugs would you fix in `project-main` before scaling to real satellite deployment?",
    a: "Four super insightful fixes: (1) In train_model.py, evaluation metrics for Vx, Vy, Vz are derived heuristic multiples of velocity-magnitude rather than independently validated targets; (2) In parse_scenario(), '1.5_3_30_20%' uses underscores so space-matching left discharge_q as 1.0 instead of 1.5; (3) Node's floodPredictor.js maps 0–50 km rivers onto an 18.25m lab flume linearly to sample velocity (a dimensionless proxy rather than true DEM terrain elevation); (4) In server.js, detectPredictionIntent()'s meter regex and cm-vs-mm rainfall parsing should be tightened, and Node grid lookup could use Python's bilinear interpolation."
  },
];
