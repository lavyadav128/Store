// dash/src/features/analytics/telcoProjectData.js
// Exact verified data, metrics, code snippets, math breakdowns, and benchmarks
// extracted directly from AI-Powered-Customer-Intelligence-System-main.

export const DATASET_OVERVIEW = {
  totalCustomers: 7043,
  totalColumns: 21,
  churnCount: 1869,
  retainedCount: 5174,
  churnRatePct: 26.54,
  retainedRatePct: 73.46,
  avgMonthlyCharges: 64.76,
  medianMonthlyCharges: 70.35,
  avgTenureMonths: 32.4,
  medianTenureMonths: 29.0,
  totalRevenue: 16056168.7,
  avgTotalCharges: 2279.73,
  missingTotalChargesCount: 11,
  trainSize: 5634,
  trainStayed: 4139,
  trainLeft: 1495,
  testSize: 1409,
  testStayed: 1035,
  testLeft: 374,
  finalFeatureCount: 38,
};

export const COLUMN_GROUPS = [
  {
    group: "Group 1: Customer Identity & Demographics",
    color: "#0284c7",
    cols: [
      { name: "customerID", type: "object (string)", meaning: "Unique customer identifier (e.g. 7590-VHVEG). Dropped before ML training so model doesn't memorize IDs." },
      { name: "gender", type: "object (Male / Female)", meaning: "Customer gender." },
      { name: "SeniorCitizen", type: "int64 (0 or 1)", meaning: "1 = Senior Citizen, 0 = Non-senior." },
      { name: "Partner", type: "object (Yes / No)", meaning: "Whether the customer has a partner." },
      { name: "Dependents", type: "object (Yes / No)", meaning: "Whether the customer has dependents (family/children)." },
    ],
  },
  {
    group: "Group 2: Subscribed Telecom & Digital Services",
    color: "#7c3aed",
    cols: [
      { name: "PhoneService", type: "object (Yes / No)", meaning: "Has basic landline/phone service?" },
      { name: "MultipleLines", type: "object (Yes / No / No phone service)", meaning: "Has multiple phone lines?" },
      { name: "InternetService", type: "object (DSL / Fiber optic / No)", meaning: "Internet connection type (Fiber optic has 41.89% churn!)." },
      { name: "OnlineSecurity", type: "object (Yes / No / No internet)", meaning: "Online security add-on subscription." },
      { name: "OnlineBackup", type: "object (Yes / No / No internet)", meaning: "Cloud online backup add-on." },
      { name: "DeviceProtection", type: "object (Yes / No / No internet)", meaning: "Hardware device protection plan." },
      { name: "TechSupport", type: "object (Yes / No / No internet)", meaning: "24/7 Technical Support access (missing tech support spikes churn to 41.64%)." },
      { name: "StreamingTV", type: "object (Yes / No / No internet)", meaning: "Live streaming TV add-on." },
      { name: "StreamingMovies", type: "object (Yes / No / No internet)", meaning: "On-demand movie streaming add-on." },
    ],
  },
  {
    group: "Group 3: Contract & Billing",
    color: "#ea580c",
    cols: [
      { name: "Contract", type: "object (Month-to-month / One year / Two year)", meaning: "Billing commitment duration (#1 Churn Driver: M2M = 42.71% churn vs Two year = 2.83%)." },
      { name: "PaperlessBilling", type: "object (Yes / No)", meaning: "Uses digital paperless e-bills instead of physical mail." },
      { name: "PaymentMethod", type: "object (Electronic check / Mailed check / Bank transfer / Credit card)", meaning: "How customer pays monthly bill (Electronic check = 45.29% churn)." },
    ],
  },
  {
    group: "Group 4: Numerical Financial & Usage Telemetry",
    color: "#16a34a",
    cols: [
      { name: "tenure", type: "int64 (0 to 72 months)", meaning: "Months the customer has stayed with the telecom company." },
      { name: "MonthlyCharges", type: "float64 ($18.25 to $118.75)", meaning: "Current recurring monthly bill amount." },
      { name: "TotalCharges", type: "object -> float64 ($18.80 to $8,684.80)", meaning: "Cumulative revenue paid so far. Stored as 'object' due to 11 whitespace ' ' records!" },
    ],
  },
  {
    group: "Group 5: Prediction Target (Output Variable y)",
    color: "#dc2626",
    cols: [
      { name: "Churn", type: "object (Yes / No) -> 1 / 0", meaning: "Target label: Yes (1) = Customer left the company; No (0) = Stayed." },
    ],
  },
];

export const RAW_SAMPLE_CUSTOMERS = [
  { customerID: "7590-VHVEG", gender: "Female", tenure: 1, PhoneService: "No", InternetService: "DSL", OnlineSecurity: "No", OnlineBackup: "Yes", TechSupport: "No", Contract: "Month-to-month", PaymentMethod: "Electronic check", MonthlyCharges: 29.85, TotalCharges: "29.85", Churn: "No" },
  { customerID: "5575-GNVDE", gender: "Male", tenure: 34, PhoneService: "Yes", InternetService: "DSL", OnlineSecurity: "Yes", OnlineBackup: "No", TechSupport: "No", Contract: "One year", PaymentMethod: "Mailed check", MonthlyCharges: 56.95, TotalCharges: "1889.5", Churn: "No" },
  { customerID: "3668-QPYBK", gender: "Male", tenure: 2, PhoneService: "Yes", InternetService: "DSL", OnlineSecurity: "Yes", OnlineBackup: "Yes", TechSupport: "No", Contract: "Month-to-month", PaymentMethod: "Mailed check", MonthlyCharges: 53.85, TotalCharges: "108.15", Churn: "Yes" },
  { customerID: "7795-CFOCW", gender: "Male", tenure: 45, PhoneService: "No", InternetService: "DSL", OnlineSecurity: "Yes", OnlineBackup: "No", TechSupport: "Yes", Contract: "One year", PaymentMethod: "Bank transfer (automatic)", MonthlyCharges: 42.30, TotalCharges: "1840.75", Churn: "No" },
  { customerID: "9237-HQITU", gender: "Female", tenure: 2, PhoneService: "Yes", InternetService: "Fiber optic", OnlineSecurity: "No", OnlineBackup: "No", TechSupport: "No", Contract: "Month-to-month", PaymentMethod: "Electronic check", MonthlyCharges: 70.70, TotalCharges: "151.65", Churn: "Yes" },
];

export const UNIVARIATE_NUM_STATS = [
  { col: "tenure", mean: 32.37, std: 24.56, min: 0.0, q25: 9.0, median: 29.0, q75: 55.0, max: 72.0, iqr: 46.0, lowerFence: -60.0, upperFence: 124.0, skew: 0.240, outliers: 0, unit: "months" },
  { col: "MonthlyCharges", mean: 64.76, std: 30.09, min: 18.25, q25: 35.50, median: 70.35, q75: 89.85, max: 118.75, iqr: 54.35, lowerFence: -46.03, upperFence: 171.38, skew: -0.221, outliers: 0, unit: "$" },
  { col: "TotalCharges", mean: 2279.73, std: 2266.79, min: 0.0, q25: 398.55, median: 1394.55, q75: 3786.60, max: 8684.80, iqr: 3388.05, lowerFence: -4683.53, upperFence: 8868.68, skew: 0.963, outliers: 0, unit: "$" },
];

export const BIVARIATE_CHI2_TOP5 = [
  {
    feature: "Contract", chi2: 1184.60, pValue: "5.86 × 10⁻²⁵⁸", cramersV: 0.410,
    breakdown: [
      { category: "Month-to-month", total: 3875, churnRate: 42.71 },
      { category: "One year", total: 1473, churnRate: 11.27 },
      { category: "Two year", total: 1695, churnRate: 2.83 },
    ],
  },
  {
    feature: "OnlineSecurity", chi2: 850.00, pValue: "2.66 × 10⁻¹⁸⁵", cramersV: 0.347,
    breakdown: [
      { category: "No", total: 3498, churnRate: 41.77 },
      { category: "Yes", total: 2019, churnRate: 14.61 },
      { category: "No internet service", total: 1526, churnRate: 7.40 },
    ],
  },
  {
    feature: "TechSupport", chi2: 828.20, pValue: "1.44 × 10⁻¹⁸⁰", cramersV: 0.343,
    breakdown: [
      { category: "No", total: 3473, churnRate: 41.64 },
      { category: "Yes", total: 2044, churnRate: 15.17 },
      { category: "No internet service", total: 1526, churnRate: 7.40 },
    ],
  },
  {
    feature: "InternetService", chi2: 732.31, pValue: "9.57 × 10⁻¹⁶⁰", cramersV: 0.322,
    breakdown: [
      { category: "Fiber optic", total: 3096, churnRate: 41.89 },
      { category: "DSL", total: 2421, churnRate: 18.96 },
      { category: "No internet", total: 1526, churnRate: 7.40 },
    ],
  },
  {
    feature: "PaymentMethod", chi2: 648.14, pValue: "3.68 × 10⁻¹⁴⁰", cramersV: 0.303,
    breakdown: [
      { category: "Electronic check", total: 2365, churnRate: 45.29 },
      { category: "Mailed check", total: 1612, churnRate: 19.11 },
      { category: "Bank transfer (auto)", total: 1544, churnRate: 16.71 },
      { category: "Credit card (auto)", total: 1522, churnRate: 15.24 },
    ],
  },
];

export const WELCH_TTEST_RESULTS = [
  { feature: "tenure", tStat: -34.82, pValue: "1.20 × 10⁻²³²", churnedMean: "17.98 mo", retainedMean: "37.57 mo", insight: "Churned customers stayed less than half as long as retained customers." },
  { feature: "MonthlyCharges", tStat: +18.41, pValue: "8.59 × 10⁻⁷³", churnedMean: "$74.44", retainedMean: "$61.27", insight: "Higher monthly bills strongly correlate with elevated churn likelihood." },
  { feature: "TotalCharges_Clean", tStat: -18.71, pValue: "5.90 × 10⁻⁷⁵", churnedMean: "$1,531.80", retainedMean: "$2,549.91", insight: "Churned customers accumulated lower total billing due to earlier exit." },
];

export const CORRELATION_WITH_CHURN = [
  { feature: "InternetService_Fiber optic", r: 0.308, direction: "Positive (Risk)" },
  { feature: "PaymentMethod_Electronic check", r: 0.302, direction: "Positive (Risk)" },
  { feature: "MonthlyCharges", r: 0.193, direction: "Positive (Risk)" },
  { feature: "PaperlessBilling_Yes", r: 0.192, direction: "Positive (Risk)" },
  { feature: "SeniorCitizen", r: 0.151, direction: "Positive (Risk)" },
  { feature: "PaymentMethod_Mailed check", r: -0.092, direction: "Negative (Protective)" },
  { feature: "PaymentMethod_Credit card (auto)", r: -0.134, direction: "Negative (Protective)" },
  { feature: "Contract_One year", r: -0.178, direction: "Negative (Protective)" },
  { feature: "TotalCharges", r: -0.198, direction: "Negative (Protective)" },
  { feature: "InternetService_No", r: -0.228, direction: "Negative (Protective)" },
  { feature: "Contract_Two year", r: -0.302, direction: "Negative (Protective)" },
  { feature: "tenure", r: -0.352, direction: "Negative (Strongest Protective)" },
];

export const CLASSIFICATION_BENCHMARK = [
  { algo: "Voting Ensemble (Top 3)", acc: 0.8048, prec: 0.6713, rec: 0.5187, spec: 0.9082, f1: 0.5852, rocAuc: 0.8496, logLoss: 0.4362, cvF1: 0.5820, cvRoc: 0.8467, time: 0.712, cm: [[940, 95], [180, 194]], highlight: true },
  { algo: "Logistic Regression", acc: 0.8070, prec: 0.6711, rec: 0.5348, spec: 0.9053, f1: 0.5952, rocAuc: 0.8484, logLoss: 0.4119, cvF1: 0.5989, cvRoc: 0.8502, time: 5.387, cm: [[937, 98], [174, 200]] },
  { algo: "Random Forest", acc: 0.8027, prec: 0.6633, rec: 0.5214, spec: 0.9043, f1: 0.5838, rocAuc: 0.8463, logLoss: 0.4149, cvF1: 0.5759, cvRoc: 0.8463, time: 1.622, cm: [[936, 99], [179, 195]] },
  { algo: "AdaBoost", acc: 0.7921, prec: 0.6431, rec: 0.4866, spec: 0.9024, f1: 0.5540, rocAuc: 0.8431, logLoss: 0.5347, cvF1: 0.5712, cvRoc: 0.8436, time: 1.394, cm: [[934, 101], [192, 182]] },
  { algo: "Gradient Boosting", acc: 0.7949, prec: 0.6460, rec: 0.5027, spec: 0.9005, f1: 0.5654, rocAuc: 0.8417, logLoss: 0.4204, cvF1: 0.5782, cvRoc: 0.8455, time: 3.640, cm: [[932, 103], [186, 188]] },
  { algo: "Neural Network (MLP)", acc: 0.8020, prec: 0.6610, rec: 0.5214, spec: 0.9034, f1: 0.5830, rocAuc: 0.8402, logLoss: 0.4215, cvF1: 0.5703, cvRoc: 0.8409, time: 1.703, cm: [[935, 100], [179, 195]] },
  { algo: "Naive Bayes (Gaussian)", acc: 0.6962, prec: 0.4598, rec: 0.8262, spec: 0.6493, f1: 0.5908, rocAuc: 0.8224, logLoss: 2.9198, cvF1: 0.5984, cvRoc: 0.8273, time: 0.139, cm: [[672, 363], [65, 309]] },
  { algo: "Decision Tree", acc: 0.7928, prec: 0.6486, rec: 0.4786, spec: 0.9063, f1: 0.5508, rocAuc: 0.8191, logLoss: 0.5815, cvF1: 0.5461, cvRoc: 0.8197, time: 4.349, cm: [[938, 97], [195, 179]] },
  { algo: "Support Vector Machine (SVM)", acc: 0.7977, prec: 0.6551, rec: 0.5027, spec: 0.9043, f1: 0.5688, rocAuc: 0.8050, logLoss: 0.4575, cvF1: 0.5657, cvRoc: 0.7943, time: 16.007, cm: [[936, 99], [186, 188]] },
  { algo: "K-Nearest Neighbors (KNN)", acc: 0.7835, prec: 0.6102, rec: 0.5107, spec: 0.8821, f1: 0.5560, rocAuc: 0.8038, logLoss: 0.8647, cvF1: 0.5560, cvRoc: 0.8156, time: 0.296, cm: [[913, 122], [183, 191]] },
];

export const COST_BENEFIT_DATA = {
  thresholds: [0.05, 0.07, 0.1, 0.12, 0.15, 0.17, 0.2, 0.22, 0.25, 0.27, 0.3, 0.32, 0.35, 0.37, 0.4, 0.42, 0.45, 0.47, 0.5, 0.53, 0.55, 0.57, 0.6, 0.62, 0.65, 0.68, 0.7, 0.72, 0.75, 0.78, 0.8, 0.82, 0.85, 0.88, 0.9, 0.92, 0.95],
  netProfits: [16700, 17040, 19140, 21840, 22960, 22100, 22720, 20540, 19060, 16620, 15080, 13880, 11600, 9620, 7200, 2780, -440, -3600, -7700, -10740, -16460, -21080, -25920, -29360, -32820, -36820, -39620, -41240, -45020, -48080, -51400, -52120, -52360, -52360, -52360, -52360, -52360],
  f1Scores: [0.4195, 0.4236, 0.455, 0.496, 0.5253, 0.5487, 0.5794, 0.5918, 0.6093, 0.6118, 0.6183, 0.6301, 0.6329, 0.6396, 0.6377, 0.6263, 0.6146, 0.6043, 0.5852, 0.5687, 0.5219, 0.4855, 0.4338, 0.3936, 0.3487, 0.2901, 0.246, 0.2191, 0.1512, 0.0914, 0.0212, 0.0053, 0, 0, 0, 0, 0],
  optimalThreshold: 0.15,
  maxNetValue: 22960,
  defaultNetValue: -7700,
  addedValue: 30660,
  tpAtOptimal: 369,
  fpAtOptimal: 662,
  fnAtOptimal: 5,
};

export const BIAS_VARIANCE_CURVE = {
  depths: [2, 4, 6, 8, 12, 16, 20],
  trainError: [0.2155, 0.2039, 0.1848, 0.1599, 0.0614, 0.0046, 0.002],
  testError: [0.2221, 0.2072, 0.1994, 0.2023, 0.2023, 0.2122, 0.2122],
};

export const ELBOW_SILHOUETTE_DATA = {
  kValues: [2, 3, 4, 5, 6, 7],
  inertias: [19697.36, 16043.96, 14087.78, 12675.34, 12012.22, 11380.85],
  silhouettes: [0.2455, 0.2443, 0.2479, 0.2530, 0.2186, 0.2057],
};

export const CLUSTER_PERSONAS = [
  { id: 0, name: "Budget Minimalists", size: 1660, sharePct: 29.5, avgTenure: 32.2, avgMonthly: 65.44, avgTotal: 2298.56, churnRate: 24.40, contract: "Month-to-month", internet: "Fiber optic" },
  { id: 1, name: "High-Risk Digital Streamers", size: 1340, sharePct: 23.8, avgTenure: 32.4, avgMonthly: 65.65, avgTotal: 2296.90, churnRate: 27.54, contract: "Month-to-month", internet: "Fiber optic" },
  { id: 2, name: "Long-Term Loyal Anchors", size: 1214, sharePct: 21.5, avgTenure: 32.0, avgMonthly: 64.49, avgTotal: 2245.54, churnRate: 27.92, contract: "Month-to-month", internet: "Fiber optic" },
  { id: 3, name: "Premium Enterprise Bundle", size: 1420, sharePct: 25.2, avgTenure: 32.5, avgMonthly: 63.79, avgTotal: 2264.79, churnRate: 26.41, contract: "Month-to-month", internet: "Fiber optic" },
];

export const PCA_SEGMENTATION_VARIANCE = {
  components: ["PC1", "PC2", "PC3", "PC4", "PC5", "PC6", "PC7", "PC8", "PC9", "PC10"],
  explained: [38.68, 17.13, 8.59, 5.28, 4.46, 3.11, 2.32, 2.06, 1.82, 1.67],
  cumulative: [38.68, 55.82, 64.41, 69.69, 74.15, 77.26, 79.58, 81.63, 83.46, 85.12],
};

export const REGRESSION_BENCHMARK = [
  { model: "Polynomial Regression (Degree 2)", r2: 0.9991, adjR2: 0.9991, mae: 47.30, mse: 4864.95, rmse: 69.75, zeroed: 0, highlight: true },
  { model: "Multiple Linear Regression (38 feat)", r2: 0.9294, adjR2: 0.9275, mae: 473.96, mse: 364949.89, rmse: 604.11, zeroed: 0 },
  { model: "Ridge Regression (alpha = 1.0)", r2: 0.9293, adjR2: 0.9274, mae: 474.05, mse: 365123.12, rmse: 604.25, zeroed: 0 },
  { model: "Lasso Regression (alpha = 0.1)", r2: 0.9293, adjR2: 0.9274, mae: 474.03, mse: 365142.29, rmse: 604.27, zeroed: 5 },
  { model: "Lasso Regression (alpha = 1.0)", r2: 0.9289, adjR2: 0.9270, mae: 474.90, mse: 367219.29, rmse: 605.99, zeroed: 10 },
  { model: "Ridge Regression (alpha = 100.0)", r2: 0.9263, adjR2: 0.9243, mae: 484.30, mse: 380699.65, rmse: 617.01, zeroed: 0 },
  { model: "Simple Linear Regression (Tenure only)", r2: 0.6858, adjR2: 0.6855, mae: 877.36, mse: 1623839.40, rmse: 1274.30, zeroed: 0 },
];

export const INFO_GAIN_RANKING = [
  { feature: "Contract", ig: 0.1420, childEntropy: 0.6927, categories: 3 },
  { feature: "OnlineSecurity", ig: 0.0933, childEntropy: 0.7414, categories: 3 },
  { feature: "TechSupport", ig: 0.0909, childEntropy: 0.7438, categories: 3 },
  { feature: "InternetService", ig: 0.0802, childEntropy: 0.7546, categories: 3 },
  { feature: "PaymentMethod", ig: 0.0642, childEntropy: 0.7705, categories: 4 },
  { feature: "PaperlessBilling", ig: 0.0277, childEntropy: 0.8071, categories: 2 },
];

export const PCA_SCRATCH_MATH = {
  nSamples: 500,
  nFeatures: 8,
  features: ["tenure", "MonthlyCharges", "TotalCharges", "TotalServices", "StreamingBundle", "SecurityTechSupport", "MonthlyToTotalRatio", "HighRiskPersonaFlag"],
  eigenvalues: [4.0642, 1.6895, 0.9074, 0.5621, 0.4971],
  explainedPct: [50.70, 21.08, 11.32, 7.01, 6.20],
  cumulativePct: [50.70, 71.78, 83.10, 90.11, 96.31],
  pc1Vector: [-0.3729, -0.3655, -0.4529, -0.4587, -0.3559, -0.3058, 0.3014, 0.0272],
  pc2Vector: [-0.3195, 0.4621, -0.0700, 0.1027, 0.3063, -0.2851, 0.2287, 0.6645],
  verificationError: "1.33 × 10⁻¹⁵",
};

export const CURSE_EXPERIMENT = {
  dimensions: [38, 43, 53, 63, 73, 83, 93, 103, 113],
  contrastRatios: [24.6462, 4.0333, 2.3309, 1.3994, 1.4220, 1.0957, 0.9025, 0.8554, 0.6855],
  knnAccuracies: [75.0, 72.5, 70.0, 72.5, 74.5, 72.5, 76.5, 74.5, 75.0],
};

export const RL_ACTIONS = [
  { id: 0, name: "No Incentive (Standard Service)", cost: 0, boost: "0%", desc: "Zero cost. Used only when customer naturally stays without nudging." },
  { id: 1, name: "15% Monthly Bill Discount", cost: 12, boost: "+28%", desc: "Moderate monthly cost; reduces churn probability by 28%." },
  { id: 2, name: "Complimentary Premium Streaming Addon", cost: 7, boost: "+22%", desc: "Entertainment lock-in; boosts stickiness cheaply." },
  { id: 3, name: "Annual Contract Lock-in with $40 Credit", cost: 40, boost: "+60%", desc: "Highest upfront cost ($40), cuts churn by 60% AND converts Contract state from M2M -> Annual!" },
  { id: 4, name: "Dedicated VIP Tech Support Package", cost: 5, boost: "+32%", desc: "Highest ROI low-cost intervention ($5 cost for +32% retention boost)." },
];

export const RL_POLICY_TABLE = [
  { state: 0, risk: "Low Risk", value: "Standard (<$65)", contract: "Month-to-Month", action: "Annual Contract Lock-in ($40 Credit)", cost: "$40.0", qVal: 227.61 },
  { state: 1, risk: "Low Risk", value: "Standard (<$65)", contract: "Annual / 2-Year", action: "Dedicated VIP Tech Support Package", cost: "$5.0", qVal: 280.99 },
  { state: 2, risk: "Low Risk", value: "High Value ($65+)", contract: "Month-to-Month", action: "Annual Contract Lock-in ($40 Credit)", cost: "$40.0", qVal: 463.33 },
  { state: 3, risk: "Low Risk", value: "High Value ($65+)", contract: "Annual / 2-Year", action: "Dedicated VIP Tech Support Package", cost: "$5.0", qVal: 534.70 },
  { state: 4, risk: "Medium Risk", value: "Standard (<$65)", contract: "Month-to-Month", action: "15% Monthly Bill Discount", cost: "$12.0", qVal: 127.39 },
  { state: 5, risk: "Medium Risk", value: "Standard (<$65)", contract: "Annual / 2-Year", action: "Dedicated VIP Tech Support Package", cost: "$5.0", qVal: 151.68 },
  { state: 6, risk: "Medium Risk", value: "High Value ($65+)", contract: "Month-to-Month", action: "Annual Contract Lock-in ($40 Credit)", cost: "$40.0", qVal: 427.52 },
  { state: 7, risk: "Medium Risk", value: "High Value ($65+)", contract: "Annual / 2-Year", action: "Annual Contract Lock-in ($40 Credit)", cost: "$40.0", qVal: 449.53 },
  { state: 8, risk: "High Risk", value: "Standard (<$65)", contract: "Month-to-Month", action: "15% Monthly Bill Discount", cost: "$12.0", qVal: 9.44 },
  { state: 9, risk: "High Risk", value: "Standard (<$65)", contract: "Annual / 2-Year", action: "Annual Contract Lock-in ($40 Credit)", cost: "$40.0", qVal: 96.13 },
  { state: 10, risk: "High Risk", value: "High Value ($65+)", contract: "Month-to-Month", action: "Annual Contract Lock-in ($40 Credit)", cost: "$40.0", qVal: 219.55 },
  { state: 11, risk: "High Risk", value: "High Value ($65+)", contract: "Annual / 2-Year", action: "Annual Contract Lock-in ($40 Credit)", cost: "$40.0", qVal: 355.97 },
];

export const RL_REWARD_PROGRESSION = {
  labels: ["Ep 100", "Ep 500", "Ep 1000", "Ep 1500", "Ep 2000", "Ep 2500", "Ep 3000", "Ep 3500"],
  rewards: [338.31, 289.25, 317.84, 373.74, 398.12, 424.96, 458.93, 478.11],
};

export const GA_EVOLUTION = {
  generations: [1, 2, 3, 4, 5],
  bestFitness: [0.8475, 0.8495, 0.8495, 0.8495, 0.8495],
  meanFitness: [0.8407, 0.8397, 0.8451, 0.8468, 0.8471],
  bestGenes: {
    n_estimators: 60,
    max_depth: 5,
    min_samples_split: 2,
    min_samples_leaf: 4,
    criterion: "entropy",
  },
};

export const INTERVIEW_QA_BANK = [
  {
    q: "1. Explain the end-to-end architecture of your AI-Powered Customer Intelligence System.",
    a: "It is an 8-pipeline end-to-end ML system built on the 7,043-row Telco Customer Churn dataset. run_pipeline.py orchestrates Ingestion (src/data_loader.py with CSV cache + mirror download + NumPy Seed-42 fallback), EDA (src/eda.py), Preprocessing & Feature Engineering (src/preprocessing.py transforming 21 raw columns into 38 scaled/encoded features), Classification Arena (src/classification.py training 9 algorithms + Top-3 Soft Voting Ensemble achieving 0.8496 ROC-AUC), Cost-Benefit & Explainability (tuning probability threshold to 0.15 to add +$30,660 net value), Clustering & 3D PCA (K-Means/Agglomerative/DBSCAN), Numeric Regression (Polynomial Degree-2 achieving R²=0.9991), Math Foundations (Information Gain, PCA from scratch, Curse of Dimensionality), Q-Learning Retention Policy Simulator, and Genetic Algorithm Hyperparameter Optimizer. All artifacts serialize via joblib for instant serving in app.py."
  },
  {
    q: "2. How did you handle missing values in TotalCharges, and why did EDA and Preprocessing handle it differently?",
    a: "In raw CSV, TotalCharges has object dtype because 11 rows (all tenure=0 new customers) contain whitespace ' '. In EDA (src/eda.py), I coerced invalid text to NaN and filled with 0 using .fillna(0) purely for aggregate reporting without altering raw_df. In Preprocessing (src/preprocessing.py), I used domain-aware imputation: MonthlyCharges * np.maximum(tenure, 1), so a brand-new customer like 1371-DWPAZ (tenure=0, bill=$56.05) gets $56.05 imputed rather than 0, preventing distortion in financial ratios."
  },
  {
    q: "3. Explain all 5 engineered features you created and why they improve learning.",
    a: "(1) TotalServices: sums all 8 active 'Yes' add-on subscriptions into one service stickiness score. (2) StreamingBundle: counts StreamingTV + StreamingMovies (0..2). (3) SecurityTechSupport: combines OnlineSecurity + TechSupport (0..2) into a protection index. (4) MonthlyToTotalRatio: MonthlyCharges / (TotalCharges + 1e-5) capturing spending velocity vs accumulated history. (5) TenureCohort (0-1yr, 1-2yr, 2-4yr, 4-6yr via pd.cut) + HighRiskPersonaFlag (Month-to-month * Fiber optic * No TechSupport = binary interaction flag highlighting our highest-churn profile)."
  },
  {
    q: "4. Why did you use One-Hot Encoding with drop_first=True instead of Label Encoding?",
    a: "Label Encoding assigns arbitrary integers (e.g., Month-to-month=0, One year=1, Two year=2), falsely implying mathematical ordering/magnitude to linear models, KNN, and SVMs. One-Hot Encoding creates clean binary flags. Using drop_first=True prevents the Dummy Variable Trap (perfect multicollinearity where columns sum to 1), keeping linear regression and logistic regression matrix inversions stable while compressing dimensionality."
  },
  {
    q: "5. What is Data Leakage? Point out where leakage exists in this codebase and how you would fix it in production.",
    a: "Data leakage occurs when test-set statistics leak into training transformations, inflating evaluation scores. In src/preprocessing.py, fit_transform() is called on the full 7,043 rows before train_test_split(), meaning StandardScaler's mean/std saw the 1,409 test customers. Similarly, 5-fold CV runs on already-scaled data, and KMeans persona profiling uses raw_df.iloc[:len(X_train)] rather than raw_df.loc[X_train.index]. To fix in production: split raw data FIRST, wrap preprocessing inside a Scikit-Learn Pipeline fit only on X_train folds, and align personas via exact index lookup."
  },
  {
    q: "6. Why did tuning the threshold from 0.50 to 0.15 swing net business profit by +$30,660?",
    a: "Because business errors are asymmetric! Missing a churner (FN) costs $140, whereas sending a needless retention offer (FP) costs $20, and saving a customer yields +$100 benefit. At default 0.50 threshold, the Voting Ensemble missed 180 churners (FN), yielding a net loss of -$7,700. By sweeping thresholds [0.05..0.95], threshold 0.15 catches 369 of 374 churners (FN drops to just 5!), yielding +$22,960 profit."
  },
  {
    q: "7. Why did Degree-2 Polynomial Regression jump R² from 0.9294 (Multiple Linear) to 0.9991?",
    a: "Because customer TotalCharges approximately equals tenure × MonthlyCharges! Linear models only add weights linearly (w1*tenure + w2*MonthlyCharges), missing multiplicative relationships. Degree-2 PolynomialFeatures explicitly creates interaction terms (x1 * x2 = tenure * MonthlyCharges), allowing linear regression on expanded features to recover the near-exact billing formula (MAE plummeted from $473.96 to $47.30!). Note: it predicts historical TotalCharges rather than future expected CLV."
  },
  {
    q: "8. Explain how Q-Learning Reinforcement Learning & the Genetic Algorithm work in Pipeline 8.",
    a: "In src/reinforcement_learning.py, Q-Learning models customer retention as a 12-state Markov Decision Process (3 Risk × 2 Value × 2 Contract) across 5 retention actions (costing $0 to $40). Over 3,500 episodes using the Bellman equation and decaying epsilon-greedy exploration (1.0 -> 0.05), the agent learns that high-value M2M customers justify the $40 Annual Lock-in (upgrading their contract state permanently), while locked-in customers need only the $5 VIP Tech Support package. Separately, src/genetic_algorithm.py evolves Random Forest hyperparameters over 5 generations via Tournament Selection (k=3), Uniform Crossover, Mutation (0.25), and Elitism (top 2), discovering an optimal configuration (60 trees, max_depth=5, entropy criterion) hitting 0.8495 CV ROC-AUC."
  },
];

export const PIPELINE_QUIZZES = [
  {
    pipeline: "Pipeline 1 (Data Ingestion)",
    q: "Why did raw_df['TotalCharges'] show dtype 'object' instead of 'float64' immediately after pd.read_csv()?",
    options: [
      "Because all numbers in CSV files are strings until converted",
      "Because 11 rows had blank whitespace (' ') strings which forced Pandas to keep the entire column as object",
      "Because the company name was inside TotalCharges"
    ],
    answer: 1,
    explanation: "11 brand-new customers (tenure=0) had whitespace ' ' in TotalCharges, causing Pandas to type the entire column as object."
  },
  {
    pipeline: "Pipeline 2 (EDA)",
    q: "Contract vs Churn had Chi-Square = 1184.60, p = 5.86e-258, Cramér's V = 0.410. What does Cramér's V tell us that p-value does not?",
    options: [
      "Whether Contract causes Churn directly",
      "The exact dollar loss from churn",
      "The strength/magnitude of association (0 to 1), whereas p-value only measures statistical significance"
    ],
    answer: 2,
    explanation: "With large sample sizes (7,043 rows), tiny differences yield small p-values. Cramér's V (0.410) quantifies how strong the relationship actually is."
  },
  {
    pipeline: "Pipeline 3 (Preprocessing)",
    q: "When processing an unseen live customer tomorrow, what must you call on the saved TelcoPreprocessor?",
    options: [
      "preprocessor.fit_transform(new_customer) so it learns a fresh mean and std",
      "preprocessor.transform(new_customer) so it applies the exact training mean, std, and .reindex(fill_value=0) column alignment",
      "Drop all categorical columns manually"
    ],
    answer: 1,
    explanation: "You must NEVER re-fit StandardScaler on a single customer (std=0!). Always call .transform() to preserve training scaler parameters and the 38-column order."
  },
  {
    pipeline: "Pipeline 4 & 5 (Classification & Evaluation)",
    q: "Why did Logistic Regression achieve 0.5952 F1 and Voting Ensemble achieve 0.8496 ROC-AUC, yet default threshold 0.50 lost -$7,700?",
    options: [
      "Because missing a churner costs $140 (FN) while a retention offer costs $20 (FP), so waiting for 50% certainty missed 180 dropouts",
      "Because 0.50 threshold predicted 100% of customers as churn",
      "Because Accuracy was lower than 50%"
    ],
    answer: 0,
    explanation: "Due to asymmetric costs ($140 FN vs $20 FP), lowering threshold to 0.15 catches 369/374 churners and swings profit from -$7,700 to +$22,960!"
  },
  {
    pipeline: "Pipeline 6 & 7 (Clustering & Regression)",
    q: "Why did Degree-2 Polynomial Regression outperform Multiple Linear Regression (R² 0.9991 vs 0.9294) on predicting TotalCharges?",
    options: [
      "Because it used 1,000 trees",
      "Because Degree-2 expansion created the tenure × MonthlyCharges interaction term that mathematically approximates cumulative billing",
      "Because it used Lasso L1 penalty"
    ],
    answer: 1,
    explanation: "Cumulative TotalCharges is approximately tenure × MonthlyCharges — a multiplicative curve linear weights cannot capture without x1 * x2!"
  },
  {
    pipeline: "Pipeline 8 (RL & GA)",
    q: "In Q-Learning, why is 'Annual Contract Lock-in ($40 Credit)' recommended for High-Value Month-to-Month users even though it costs $40?",
    options: [
      "Because the agent ignores costs completely",
      "Because in the MDP, Action 3 reduces churn by 60% AND flips Contract state from Month-to-Month to Annual, maximizing long-term discounted reward gamma * max Q(s', a')",
      "Because all customers must upgrade to annual plans"
    ],
    answer: 1,
    explanation: "The Bellman equation optimizes long-term future LTV reward (gamma = 0.90), recognizing that locking a $95/mo customer into an annual contract saves hundreds in future revenue."
  },
];
