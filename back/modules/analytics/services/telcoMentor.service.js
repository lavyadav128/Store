// back/modules/analytics/services/telcoMentor.service.js
// Dedicated Context-Aware AI Mentor for AI-Powered-Customer-Intelligence-System (Telco Churn 10-Stage Deep Dive)

import Groq from "groq-sdk";
import fetch from "node-fetch";

const STAGE_CONTEXT_MAP = {
  0: {
    title: "Step 0 — Dataset & Architecture (0/8)",
    files: "data/raw/WA_Fn-UseC_-Telco-Customer-Churn.csv, run_pipeline.py, src/config.py, app.py",
    focus: "Business problem (predicting customer churn across 7,043 telecom rows × 21 raw columns), class imbalance (5,174 Stayed 73.46% vs 1,869 Left 26.54%), the 5 logical column groups (Demographics, Subscribed Services, Contract/Billing, Financials, Target Churn), actual sample customers (7590-VHVEG Stayed vs 9237-HQITU Left), why TotalCharges loaded as object (11 blanks), and why customerID is dropped before ML.",
  },
  1: {
    title: "Pipeline 1 — Data Ingestion (1/8)",
    files: "run_pipeline.py, src/data_loader.py (load_raw_dataset), src/config.py",
    focus: "Loading raw CSV into Pandas DataFrame raw_df (shape 7043 × 21). Three branches in load_raw_dataset(force_refresh=False): (1) Cached local CSV read via pd.read_csv(RAW_DATA_PATH), (2) 3 GitHub mirror downloads validated by 'Churn' column & len > 5000, (3) NumPy Seed-42 synthetic generator fallback. Does zero cleaning or scaling yet; reveals 11 whitespace blanks in TotalCharges forcing object dtype.",
  },
  2: {
    title: "Pipeline 2 — Exploratory Data Analysis (2/8)",
    files: "src/eda.py (compute_dataset_overview, compute_univariate_stats, compute_bivariate_analysis, compute_correlation_matrix)",
    focus: "Overview KPIs (26.54% churn, avg monthly $64.76, median $70.35, avg tenure 32.4m, revenue $16.06M, tc coerced & filled with 0 for reporting). Univariate stats (mean, std, Q25/Median/Q75, IQR, 1.5×IQR fences, skewness, 0 outliers detected). Bivariate Chi-Square & Cramér's V (Contract chi2=1184.60, p=5.86e-258, V=0.410; Month-to-month 42.71% churn vs Two-year 2.83%) + Welch's unequal-variance T-tests (churners avg tenure 17.98m vs retained 37.57m; monthly $74.44 vs $61.27). Pearson Correlation Matrix using pd.get_dummies(drop_first=True) on 5 categoricals + 3 numerics + Churn_Binary: Fiber optic +0.308, Electronic check +0.302, Two year -0.302, tenure -0.352.",
  },
  3: {
    title: "Pipeline 3 — Preprocessing & Feature Engineering (3/8)",
    files: "src/preprocessing.py (TelcoPreprocessor, prepare_data_splits)",
    focus: "clean_raw_data() deduplicates customerID and imputes 11 blank TotalCharges (e.g. 1371-DWPAZ tenure=0, bill=$56.05 -> $56.05) via MonthlyCharges * np.maximum(tenure, 1). engineer_features() creates TotalServices (0-8), StreamingBundle (0-2), SecurityTechSupport (0-2), MonthlyToTotalRatio (Monthly / (Total + 1e-5)), TenureCohort (pd.cut 4 buckets), and HighRiskPersonaFlag (M2M * Fiber * NoTech). Separates X & y (Yes->1/No->0, drops customerID/Churn). One-Hot Encodes 17 columns via pd.get_dummies(drop_first=True) -> 30 encoded/pass-through cols + StandardScaler on 8 numerical cols (including binary HighRiskPersonaFlag!) -> 38 features total. Stratified 80/20 split -> Train 5,634 (4,139/1,495), Test 1,409 (1,035/374). Saves preprocessor.joblib with .transform() aligning unseen rows via .reindex(columns=feature_names_in, fill_value=0.0). Critique: fit_transform(raw_df) ran BEFORE train_test_split() causing test-set scaler leakage.",
  },
  4: {
    title: "Pipeline 4 — Classification Arena & Ensemble (4/8)",
    files: "src/classification.py (get_model_definitions, ModelArena.train_and_evaluate_all)",
    focus: "Trains 9 individual models + 10th Soft Voting Ensemble over 5,634 × 38 features with 5-Fold StratifiedKFold CV (scoring F1 & ROC-AUC) and tests on 1,409 unseen rows. Benchmark: Voting Ensemble (Top 3: Logistic+RF+AdaBoost, ROC-AUC 0.8496, Acc 80.48%, CM [[940,95],[180,194]]), Logistic Regression (F1 0.5952, LogLoss 0.4119, ROC-AUC 0.8484), Random Forest (150 trees depth 8, ROC-AUC 0.8463), AdaBoost (0.8431), Gradient Boosting (0.8417), MLP (64,32 relu adam, 0.8402), Naive Bayes (highest recall 82.62%, Acc 69.62%), Decision Tree (depth 5, 0.8191), SVM (RBF, slowest 16s, 0.8050), KNN (k=15 distance, 0.8038). Critique: Top-3 chosen via test ROC-AUC instead of CV AUC.",
  },
  5: {
    title: "Pipeline 5 — Evaluation, Cost-Benefit Tuning & Explainability (5/8)",
    files: "src/evaluation.py, src/explainability.py, app.py",
    focus: "ROC Curve (0.8496) & PR Curve (avg precision 0.6690). Cost-Benefit Optimization sweeps 37 thresholds [0.05..0.95] using Net Value = (TP×$100) - (FP×$20) - (FN×$140): default t=0.50 misses 180 churners & loses -$7,700, while optimal t=0.15 catches 369/374 churners (FN=5) earning +$22,960 (+$30,660 net lift!). Bias-Variance curve across RF max_depth [2,4,6,8,12,16,20]: train error drops 0.2155->0.0020 while test error hits best 0.1994 at depth=6 then rises to 0.2122 (overfitting). Local explainability uses heuristic risk rules (+32% M2M, +24% tenure<=6, +18% Fiber No Tech, +12% E-Check, +14% Monthly>=80) and playbook rules — NOT true SHAP values!",
  },
  6: {
    title: "Pipeline 6 (Official Step 5/8) — Customer Segmentation & 3D PCA (6/8)",
    files: "src/clustering_pca.py (CustomerSegmentationPCA)",
    focus: "Unsupervised clustering (no Churn labels passed) on X_train (5,634 × 38): K-Means (K=4, n_init=10), Elbow & Silhouette over K=2..7 (Inertia 19697->14087 at K=4->11380 at K=7; Silhouette 0.2479 at K=4, 0.2530 at K=5), Agglomerative (ward linkage on 2,500 rows), DBSCAN (eps=2.5, min_samples=10 on 2,500 rows -> 0.64% noise). 2D & 3D PCA compresses 38D->3D (PC1 38.68%, PC2 17.13%, Top 10 = 85.12% cumulative variance). 4 Persona cards: Budget Minimalists, High-Risk Digital Streamers, Long-Term Loyal Anchors, Premium Enterprise Bundle. CRITICAL BUG: run_pipeline.py calls raw_df.iloc[:len(X_train)] on shuffled X_train indices, flattening persona means to ~32m tenure & ~26% churn; fix with raw_df.loc[X_train.index].",
  },
  7: {
    title: "Pipeline 7 (Official Step 6/8) — Regression Lab (7/8)",
    files: "src/regression.py (RegressionLab)",
    focus: "Predicts continuous TotalCharges after dropping 11 NaN rows (7,032 clean rows, TotalCharges removed from X -> 5,625 Train / 1,407 Test). 7 Regressors: Polynomial Degree-2 over [tenure, MonthlyCharges, TotalServices] (expanded to 9 terms including tenure*MonthlyCharges!) hits R²=0.9991 & MAE=$47.30; Multiple Linear hits R²=0.9294 MAE=$473.96; Ridge(alpha=1,100) shrinks weights smoothly without zeroing; Lasso(alpha=0.1,1.0) zeros 5 then 10 features via L1 diamond penalty; Simple Linear(tenure only) R²=0.6858 MAE=$877.36. Regularization path across 20 alphas in logspace(-2, 3). Critiques: predicts historical TotalCharges rather than future 12-mo CLV; app.py scatter uses proxy tenure*MonthlyCharges*0.99.",
  },
  8: {
    title: "Pipeline 8 (Steps 7/8 & 8/8) — Math Foundations, Q-Learning RL & Genetic Algorithm",
    files: "src/math_explainers.py, src/reinforcement_learning.py, src/genetic_algorithm.py",
    focus: "Math Foundations (7/8): Shannon Entropy H(S) & Gini impurity rank Contract #1 with Info Gain 0.1420 bits (OnlineSecurity 0.0933, TechSupport 0.0909); Scratch PCA linear algebra on 500×8 verifies Sigma*v1 == lambda1*v1 with error 1.33e-15 (PC1 50.70%, PC2 21.08%); Curse of Dimensionality adds noise 38->113 dims crashing Euclidean distance contrast (d_max-d_min)/d_min from 24.65 to 0.69. RL Q-Learning (8/8A): 12-State MDP (3 Risk × 2 Value × 2 Contract) × 5 Actions (Costs $0,$12,$7,$40,$5; Action 3 upgrades Contract->Annual & +60% retention boost), Bellman Q-update (alpha=0.1, gamma=0.90, eps 1.0->0.05) across 3,500 episodes yielding optimal policy (Annual Lock-in $40 for High-Value M2M, VIP Tech Support $5 for Annual/low-med risk). GA Optimizer (8/8B): 10 chromosomes × 5 generations tournament selection (k=3), uniform crossover, 0.25 mutation, elitism k=2 maximizing 3-Fold CV ROC-AUC -> optimal RF {n_estimators:60, max_depth:5, min_samples_split:2, min_samples_leaf:4, criterion:'entropy'} hitting 0.8495 CV AUC.",
  },
  9: {
    title: "Stage 9 — Live Customer Inference Simulator, Quizzes & Interview Defense",
    files: "app.py (Live Predictor), TelcoPreprocessor.transform(), models/*.joblib",
    focus: "Interactive end-to-end simulation uniting Stage 3 feature engineering (TotalServices, Ratio, TenureCohort, HighRiskPersonaFlag), Stage 4 probability inference, Stage 5 risk drivers + retention playbook, Stage 8 Q-Learning optimal offer, plus pipeline MCQs and interview defense.",
  },
};

const SYSTEM_MASTER_KNOWLEDGE = `You are the Master AI Mentor embedded inside the "Telco AI System (A-Z)" teaching page for the user's **AI-Powered-Customer-Intelligence-System** project.
Your mission is to teach EVERY concept, math formula, Python line, and implementation detail in **super simple, crystal-clear beginner-friendly language** ("Explain Like I'm New to AI/ML") WITH **exact numbers and code directly from THIS project**.

COMPLETE GROUND-TRUTH FACTS ABOUT THIS PROJECT (NEVER INVENT FAKE FILES OR FAKE METRICS):
- Dataset: Telco Customer Churn (data/raw/WA_Fn-UseC_-Telco-Customer-Churn.csv), 7,043 customer rows × 21 raw columns.
- Target distribution: 5,174 Stayed (73.46%, No -> 0) and 1,869 Churned (26.54%, Yes -> 1).
- Sample real rows: 7590-VHVEG (tenure=1, Month-to-month, DSL, $29.85, Churn=No), 9237-HQITU (tenure=2, Month-to-month, Fiber optic, TechSupport=No, Electronic check, $70.70, TotalCharges=151.65, Churn=Yes), 1371-DWPAZ (tenure=0, Monthly=56.05, TotalCharges=" " blank -> 11 such blank rows!).
- Pipeline 1 (src/data_loader.py): load_raw_dataset() checks cached CSV -> downloads from 3 GitHub mirrors validating 'Churn' in cols & len > 5000 -> NumPy seed=42 fallback. Loads raw_df(7043,21). Does NOT clean or scale.
- Pipeline 2 (src/eda.py):
  * compute_dataset_overview: coerces TotalCharges & fillna(0) ONLY inside EDA reporting ($16.06M revenue, avg Monthly $64.76, avg tenure 32.4m, 26.54% churn).
  * compute_univariate_stats: mean, std, quartiles Q25/Q50/Q75, IQR, 1.5*IQR fences (0 outliers in tenure/Monthly/Total), skewness (TotalCharges +0.963 right-skewed).
  * compute_bivariate_analysis: pd.crosstab + stats.chi2_contingency + Cramér's V -> Contract chi2=1184.60, p=5.86e-258, V=0.410 (Month-to-month 42.71% vs One year 11.27% vs Two year 2.83%); OnlineSecurity V=0.347; TechSupport V=0.343; InternetService V=0.322 (Fiber 41.89% churn); PaymentMethod V=0.303 (Electronic check 45.29% churn). Numerical Welch's T-test (equal_var=False): tenure churned mean 17.98m vs retained 37.57m (t=-34.82, p=1.2e-232); MonthlyCharges $74.44 vs $61.27. Note: code implements Welch's t-test, not Mann-Whitney U.
  * compute_correlation_matrix: converts Churn Yes/No->1/0, coerces TotalCharges->fillna(0), one-hot encodes ONLY 5 categorical columns (Contract, InternetService, PaymentMethod, PaperlessBilling, SeniorCitizen) via pd.get_dummies(..., drop_first=True, dtype=float), combines with tenure/MonthlyCharges/TotalCharges/Churn_Binary, runs .corr(method="pearson"). Exact r with Churn_Binary: InternetService_Fiber optic (+0.308), PaymentMethod_Electronic check (+0.302), MonthlyCharges (+0.193), PaperlessBilling_Yes (+0.192), Contract_One year (-0.178), TotalCharges (-0.198), InternetService_No (-0.228), Contract_Two year (-0.302), tenure (-0.352). Emphasize: Correlation != Causation!
- Pipeline 3 (src/preprocessing.py — TelcoPreprocessor):
  * clean_raw_data: drops duplicates by customerID (0 dups), coerces TotalCharges blanks -> imputes via MonthlyCharges * np.maximum(tenure, 1) (so 1371-DWPAZ gets $56.05).
  * engineer_features: adds TotalServices (0-8 'Yes' count), StreamingBundle (0-2), SecurityTechSupport (0-2), MonthlyToTotalRatio = MonthlyCharges / (TotalCharges + 1e-5), TenureCohort (pd.cut bins=[-1,12,24,48,72]), HighRiskPersonaFlag = is_m2m * is_fiber * no_tech. Total cols: 21 -> 26, drop ID/Churn -> 24 inputs.
  * Encoding & Scaling: pd.get_dummies(drop_first=True) -> 30 encoded cols (SeniorCitizen kept 0/1 unscaled) + StandardScaler Z=(X-mu)/sigma on 8 numerical cols (including HighRiskPersonaFlag -> 9237-HQITU becomes tenure -1.2367, Monthly +0.1974, HighRiskPersonaFlag +1.7092!). Total = 38 features.
  * Stratified Split: train_test_split(test_size=0.2, random_state=42, stratify=y) -> Train 5,634 (4,139/1,495), Test 1,409 (1,035/374). Saves preprocessor.joblib; transform() reuses training mean/std & aligns cols with .reindex(columns=feature_names_in, fill_value=0.0). Interview Critique: fit_transform(raw_df) ran before split -> minor scaler data leakage!
- Pipeline 4 (src/classification.py — ModelArena):
  * 5-Fold StratifiedKFold CV + fit on 5,634 train + eval on 1,409 test.
  * 9 base models + Soft Voting Ensemble (top 3 by ROC-AUC averaging probabilities): Voting Ensemble (ROC-AUC 0.8496, Acc 80.48%, Prec 67.13%, Rec 51.87%, F1 0.5852, CM [[940,95],[180,194]]), Logistic Regression (F1 0.5952, ROC-AUC 0.8484, LogLoss 0.4119), Random Forest (150 trees depth=8, AUC 0.8463), AdaBoost (0.8431), Gradient Boosting (0.8417), MLP (64,32, 0.8402), Naive Bayes (Recall 82.62%, Acc 69.62%, AUC 0.8224), Decision Tree (depth 5, AUC 0.8191), SVM RBF (slowest 16.0s, AUC 0.8050), KNN (k=15 distance, AUC 0.8038). Critique: top-3 ensemble selected on test ROC-AUC instead of validation CV.
- Pipeline 5 (src/evaluation.py + src/explainability.py):
  * ROC-AUC 0.8496, PR-AUC 0.6690. Cost-Benefit sweeps 37 thresholds [0.05..0.95] with Net = TP*100 - FP*20 - FN*140: default t=0.50 loses -$7,700 (FN=180), optimal t=0.15 earns +$22,960 (TP=369, FP=662, FN=5) -> +$30,660 added value!
  * Bias-Variance (RF depths [2,4,6,8,12,16,20]): Train error 0.2155->0.0020; Test error best at depth=6 (0.1994) then overfits at 16-20 (0.2122).
  * Local explainability uses heuristic rules (+32% M2M, +24% tenure<=6, +18% Fiber+NoTech, +12% E-Check, +14% Monthly>=80), NOT true SHAP! Playbook offers Annual upgrade 15% (-35%), VIP TechSupport (-18%), $15 Auto-Pay (-12%), Bundle (-15%).
- Pipeline 6 / Step 5/8 (src/clustering_pca.py):
  * Unsupervised K-Means (K=4), Elbow & Silhouette K=2..7 (Inertia 19697->14087->11380; Silhouette 0.2479 at K=4, 0.2530 at K=5), Agglomerative (ward on 2,500), DBSCAN (eps=2.5 on 2,500 -> 0.64% noise). PCA 38D->3D (PC1 38.68%, PC2 17.13%, PC3 8.59%, Top 10 = 85.12%). Critical Index Bug: raw_df.iloc[:len(X_train)] misaligned shuffled X_train indices, flattening persona means (~32m tenure, ~26% churn); fix via raw_df.loc[X_train.index].
- Pipeline 7 / Step 6/8 (src/regression.py):
  * 7,032 non-null TotalCharges rows (11 dropped), TotalCharges dropped from X, 80/20 split (5,625 Train / 1,407 Test). Poly Degree-2 over [tenure, MonthlyCharges, TotalServices] (9 terms capturing tenure*MonthlyCharges) hits R²=0.9991, MAE=$47.30, RMSE=$69.75! Multiple Linear R²=0.9294 (MAE=$473.96). Ridge(1, 100) keeps 0 zeroed coefs; Lasso(0.1) zeros 5 coefs, Lasso(1.0) zeros 10 coefs. Simple Linear(tenure) R²=0.6858. Critiques: historical TotalCharges != future CLV; app.py scatter uses proxy tenure*MonthlyCharges*0.99.
- Pipeline 8 / Steps 7/8 & 8/8:
  * Math (src/math_explainers.py): Contract tops Info Gain (0.1420 bits); Scratch PCA (500×8) verifies Sigma*v1==lambda1*v1 to error 1.33e-15 (PC1 50.70%, PC2 21.08%); Curse of Dimensionality (38->113 dims) crashes contrast ratio 24.65->0.69.
  * RL Q-Learning (src/reinforcement_learning.py): 12-state MDP × 5 actions ($0..$40), Bellman Q update (alpha=0.1, gamma=0.90, eps 1.0->0.05) across 3,500 episodes -> High-Value M2M chooses Action 3 ($40 Annual Lock-in, upgrading contract state), Annual Low/Med Risk chooses Action 4 ($5 VIP Tech Support).
  * Genetic Algorithm (src/genetic_algorithm.py): 10 chromosomes × 5 generations, 3-fold CV ROC-AUC fitness, Tournament selection k=3, Uniform crossover, 0.25 mutation, Elitism k=2 -> optimal RF {n_estimators:60, max_depth:5, min_samples_split:2, min_samples_leaf:4, criterion:'entropy'} achieving 0.8495 ROC-AUC.

RESPONSE FORMAT STYLE:
Organize your answer clearly in beginner-friendly markdown with:
1. 💡 **Simple Plain-English Idea** (understandable even if brand new to ML!)
2. 📐 **Formula & Quick Worked Example** (easy numbers)
3. 💻 **How THIS Exact Project Implements It** (file name, function, code steps, and exact dataset numbers from this project!)
4. 🎤 **Pro Interview Tip / Caveat** (if relevant)
Keep it warm, structured, clear, and directly aware of the user's current viewing tab! Support English & Hinglish seamlessly if user writes in Hinglish.`;

function buildDeterministicFallback(question, currentStep = 0) {
  const q = question.toLowerCase();
  const stage = STAGE_CONTEXT_MAP[currentStep] || STAGE_CONTEXT_MAP[0];

  if (q.includes("pearson") || q.includes("correlation") || q.includes("corr_matrix")) {
    return `### 💡 Pearson Correlation Coefficient (r) — Simple Explanation
**In Easy Words:** Pearson correlation measures whether two numerical columns move together in a straight line — from **-1.0** (perfect opposite move) to **+1.0** (perfect lockstep move), with **0.0** meaning no linear relationship.

### 📐 Formula & Quick Example
\`r = Σ[(x_i - mean_x)(y_i - mean_y)] / √[ Σ(x_i - mean_x)² × Σ(y_i - mean_y)² ]\`
- Suppose as \`tenure\` goes **UP** (1 mo → 60 mo), \`Churn\` goes **DOWN** (1 → 0). They move inversely → negative correlation (**-0.352**).
- Suppose when customers use **Fiber optic**, churn tends to be **higher** → positive correlation (**+0.308**).

### 💻 How THIS Project Implements It (\`src/eda.py\` → \`compute_correlation_matrix()\`)
1. Converts target \`Churn\` (\`"Yes"/"No"\`) into numeric \`Churn_Binary\` (\`1 / 0\`).
2. Converts \`TotalCharges\` strings using \`pd.to_numeric(..., errors="coerce").fillna(0)\`.
3. Text columns can't enter correlation math directly, so it runs \`pd.get_dummies(data[cols_to_encode], drop_first=True, dtype=float)\` on **5 categoricals**: \`Contract\`, \`InternetService\`, \`PaymentMethod\`, \`PaperlessBilling\`, \`SeniorCitizen\`.
4. Joins those dummy columns with \`["tenure", "MonthlyCharges", "TotalCharges", "Churn_Binary"]\` and calls \`analysis_df.corr(method="pearson")\`.

**Exact Project Results with \`Churn_Binary\`:**
- **\`InternetService_Fiber optic\`:** \`+0.308\` (strongest positive risk factor)
- **\`PaymentMethod_Electronic check\`:** \`+0.302\`
- **\`MonthlyCharges\`:** \`+0.193\`
- **\`Contract_Two year\`:** \`-0.302\`
- **\`tenure\`:** \`-0.352\` (strongest protective factor!)

🎤 **Interview Caveat:** *Correlation is NOT causation!* Also notice \`compute_correlation_matrix\` only one-hot encodes those 5 categorical columns rather than all 21 columns.`;
  }

  if (q.includes("chi") || q.includes("cramer") || q.includes("t-test") || q.includes("welch")) {
    return `### 💡 Chi-Square, Cramér's V & Welch's T-Test (Step 2 — \`src/eda.py\`)
- **Chi-Square (\`stats.chi2_contingency\`):** Checks if a categorical feature (like \`Contract\`) is statistically independent of \`Churn\`. \`Contract\` had Observed = 1,655 M2M churners vs Expected = 1,028.3 → **χ² = 1,184.60, p = 5.86 × 10⁻²⁵⁸**.
- **Cramér's V (0 to 1):** Since p-value easily becomes tiny on 7,043 rows, Cramér's V measures *strength*: **Contract (0.410)**, **OnlineSecurity (0.347)**, **TechSupport (0.343)**, **InternetService (0.322)**, **PaymentMethod (0.303)**.
- **Welch's T-Test (\`equal_var=False\`):** Compares numerical group means without assuming equal variances: churners average **17.98 mo** tenure vs **37.57 mo** retained (\`p = 1.20e-232\`), and **$74.44** monthly bill vs **$61.27** retained.`;
  }

  if (q.includes("preprocess") || q.includes("one-hot") || q.includes("scaler") || q.includes("leakage") || q.includes("feature")) {
    return `### 💡 Data Preprocessing & Feature Engineering (Step 3 — \`src/preprocessing.py\`)
1. **Smart Imputation:** Fixes the 11 blank \`TotalCharges\` via \`MonthlyCharges * np.maximum(tenure, 1)\` (e.g., customer \`1371-DWPAZ\` with \`tenure=0, bill=$56.05\` gets \`$56.05\`, unlike EDA's \`.fillna(0)\`).
2. **5 Engineered Features:** \`TotalServices\` (0–8), \`StreamingBundle\` (0–2), \`SecurityTechSupport\` (0–2), \`MonthlyToTotalRatio\` (\`Monthly / (Total + 1e-5)\`), \`TenureCohort\` (\`pd.cut\`), + \`HighRiskPersonaFlag\` (\`M2M * Fiber * NoTech\`).
3. **One-Hot (\`drop_first=True\`):** Produces 30 encoded/pass-through cols + 8 \`StandardScaler\` columns (\`Z = (X-μ)/σ\`) = **38 features**. Note: \`9237-HQITU\` becomes \`tenure=-1.2367, HighRiskPersonaFlag=+1.7092\`.
4. **Critique (Data Leakage):** \`fit_transform(raw_df)\` ran *before* the 80/20 stratified split (\`5,634 / 1,409\`), exposing StandardScaler to test stats. Always split first in strict production!`;
  }

  if (q.includes("threshold") || q.includes("cost") || q.includes("profit") || q.includes("voting") || q.includes("classification")) {
    return `### 💡 Classification & Cost-Benefit Optimization (Steps 4 & 5 — \`classification.py\` & \`evaluation.py\`)
- **Top Classifier:** Soft Voting Ensemble (averaging probabilities of Top 3: Logistic Regression, Random Forest, AdaBoost) achieved **0.8496 ROC-AUC**, **80.48% Accuracy**, **CM = \`[[940, 95], [180, 194]]\`**. Logistic Regression led F1 (**0.5952**).
- **Profit Turnaround:** Under configured costs (**+$100** saved TP, **-$20** unneeded offer FP, **-$140** missed churn FN), default threshold \`0.50\` misses 180 churners and **loses -$7,700**. Tuning down to **0.15** catches 369/374 churners (FN=5!) earning **+$22,960 profit (+$30,660 lift!)**.
- **Bias-Variance:** RF \`max_depth=6\` minimizes Test Error (**19.94%**); depths 16–20 overfit (Train error \`0.20%\`, Test climbs to \`21.22%\`).`;
  }

  if (q.includes("cluster") || q.includes("pca") || q.includes("kmeans") || q.includes("dbscan") || q.includes("bug")) {
    return `### 💡 Unsupervised Clustering & 3D PCA (Step 6 / Official 5/8 — \`src/clustering_pca.py\`)
- Runs **K-Means (K=4)**, **Elbow/Silhouette (K=2..7)**, **Agglomerative (ward)**, & **DBSCAN (\`eps=2.5\` → 0.64% noise)** on \`X_train\` without churn labels.
- **3D PCA:** Compresses 38 features → 3 visualization axes (**PC1 38.68%**, **PC2 17.13%**, **PC3 8.59%**; Top 10 = **85.12%** variance).
- **Crucial Code Bug:** \`run_pipeline.py\` passed \`raw_df.iloc[:len(X_train)]\` instead of \`raw_df.loc[X_train.index]\` — misaligning shuffled indices so all 4 personas averaged ~32m tenure & ~26% churn!`;
  }

  if (q.includes("regression") || q.includes("poly") || q.includes("ridge") || q.includes("lasso")) {
    return `### 💡 Numeric Regression Lab (Step 7 / Official 6/8 — \`src/regression.py\`)
- Drops 11 missing \`TotalCharges\` rows (**7,032 rows**), drops \`TotalCharges\` from inputs to prevent target leakage (**5,625 Train / 1,407 Test**).
- **Why Degree-2 Polynomial Wins (\`R² = 0.9991\`, \`MAE = $47.30\`):** \`TotalCharges ≈ tenure × MonthlyCharges\` is a multiplicative curve! Expanding \`[tenure, MonthlyCharges, TotalServices]\` into 9 quadratic/interaction terms captures \`tenure × MonthlyCharges\` directly (vs Multiple Linear \`R²=0.9294\`, Simple Linear \`0.6858\`).
- **Regularization:** Ridge shrinks weights without zeroing; Lasso zeroed **5 features at α=0.1** and **10 features at α=1.0**!`;
  }

  if (q.includes("rl") || q.includes("q-learn") || q.includes("bellman") || q.includes("genetic") || q.includes("entropy") || q.includes("curse")) {
    return `### 💡 Math Foundations, Q-Learning RL & Genetic Algorithm (Step 8 — Steps 7/8 & 8/8)
- **Information Gain:** \`Contract\` leads split ranking with **0.1420 bits**; Scratch PCA verifies \`Σ·v1 = λ1·v1\` with error **1.33e-15**; Curse of Dimensionality noise (**38 → 113 dims**) crashes distance contrast **24.65 → 0.69**.
- **RL Q-Learning (\`reinforcement_learning.py\`):** 12-State MDP × 5 Actions trained over **3,500 episodes** via Bellman update (\`α=0.1, γ=0.90, ε: 1.0→0.05\`). Learns to give **$40 Annual Lock-in** to High-Value M2M customers (upgrading Contract state & +60% boost) and cheap **$5 VIP Tech Support** to stable annual contracts.
- **Genetic Algorithm (\`genetic_algorithm.py\`):** Evolves Random Forest hyperparameters across 5 generations (10 chromosomes, Tournament k=3, Crossover, 0.25 Mutation, Elitism k=2) reaching **0.8495 CV ROC-AUC** with \`{n_estimators:60, max_depth:5, criterion:'entropy'}\`.`;
  }

  return `### 📍 Context: You are currently on **${stage.title}**
**Key Files:** \`${stage.files}\`
**What happens here:** ${stage.focus}

Try asking a specific question like:
- *"Explain Pearson correlation along with an example and how this project implements it"*
- *"Walk me through customer 9237-HQITU before and after preprocessing"*
- *"Why did threshold 0.15 earn +$30,660 more profit than 0.50?"*
- *"How does Q-Learning pick actions across the 12 states?"*`;
}

export async function askTelcoProjectMentor({ message, currentStep = 0, history = [] }) {
  const stepIdx = Number.isInteger(Number(currentStep)) ? Math.max(0, Math.min(9, Number(currentStep))) : 0;
  const activeStage = STAGE_CONTEXT_MAP[stepIdx] || STAGE_CONTEXT_MAP[0];

  const dynamicSystemPrompt = `${SYSTEM_MASTER_KNOWLEDGE}

══════════════════════════════════════════════════════════════════════
ACTIVE USER VIEWPORT CONTEXT (EXTREMELY IMPORTANT):
- The user is CURRENTLY viewing Tab/Step ${stepIdx}: **${activeStage.title}**
- Active Python file(s) for this tab: \`${activeStage.files}\`
- Core focus of user's current screen: ${activeStage.focus}
- If the user says "this step", "here", "this code", or asks about a concept in this tab, connect it directly to **Step ${stepIdx} (${activeStage.title})**. If they ask about any concept from Steps 0–9 (e.g., Pearson correlation while viewing another tab, or Q-Learning, or Data Leakage), answer thoroughly using the exact project code & numbers from that pipeline too!
- MATH FORMATTING RULE: NEVER emit raw LaTeX delimiters like \`\\(\`, \`\\)\`, \`\\[\`, or \`\\]\` or \`\\frac{}\`. Always write formulas using clean Unicode symbols (μ, σ, Σ, χ², λ, √, ×, ≈, ≤, ≥, α, γ, ε, ∈, →) inside monospace code blocks or bold text so they render cleanly in Markdown!
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

  // 1. Primary: Groq Available Reasoning Models (openai/gpt-oss-120b -> qwen/qwen3.8-27b -> openai/gpt-oss-20b)
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
        console.warn(`Telco Mentor Groq [${modelId}] fallback:`, err.message);
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
          "X-Title": "Telco AI/ML System Mentor",
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
      console.warn("Telco Mentor OpenRouter exception:", err.message);
    }
  }

  // 3. Deterministic Offline Knowledge Engine Fallback (Never fails!)
  return {
    reply: buildDeterministicFallback(message, stepIdx),
    provider: "local-knowledge-engine",
    detectedStep: activeStage.title,
  };
}
