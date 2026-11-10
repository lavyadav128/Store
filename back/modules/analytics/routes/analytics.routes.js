// back/modules/analytics/routes/analytics.routes.js
import express from 'express';
import mongoose from 'mongoose';
import analyticsDataService from '../services/analyticsData.service.js';
import mlEngineService, { ML_FEATURES } from '../services/mlEngine.service.js';
import { askTelcoProjectMentor } from '../services/telcoMentor.service.js';

const router = express.Router();

// ── GET /api/analytics/overview ──
router.get('/overview', async (req, res) => {
  try {
    const dataset = await analyticsDataService.getDataset();
    const totalStudents = dataset.length;
    const churnedCount = dataset.filter(d => d.churned === 1).length;
    const churnRate = totalStudents > 0 ? +((churnedCount / totalStudents) * 100).toFixed(1) : 0;

    const studyHoursStats = analyticsDataService.calculateDescriptiveStats(dataset.map(d => d.studyHours));
    const testAttemptedLearners = dataset.filter(d => (d.testsGivenCount && d.testsGivenCount > 0) || (d.quizScore && d.quizScore > 0));
    const quizScoreStats = testAttemptedLearners.length > 0
      ? analyticsDataService.calculateDescriptiveStats(testAttemptedLearners.map(d => d.quizScore))
      : { count: 0, mean: 0, median: 0, mode: 0, variance: 0, stdDev: 0, min: 0, max: 0, q1: 0, q3: 0, iqr: 0, skewness: 0, kurtosis: 0 };
    const daysInactiveStats = analyticsDataService.calculateDescriptiveStats(dataset.map(d => d.daysInactive));
    const totalSpendStats = analyticsDataService.calculateDescriptiveStats(dataset.map(d => d.totalSpend));

    const dropoffFunnel = analyticsDataService.getDropoffFunnel(dataset);

    // Standard, fixed, human-readable educational distribution intervals (100% Live)
    const studyHourRanges = [
      { label: "0 - 1 hr", min: 0, max: 1 },
      { label: "1 - 5 hrs", min: 1, max: 5 },
      { label: "5 - 10 hrs", min: 5, max: 10 },
      { label: "10 - 25 hrs", min: 10, max: 25 },
      { label: "25 - 50 hrs", min: 25, max: 50 },
      { label: "50+ hrs", min: 50, max: Infinity },
    ];
    const studyHoursDist = studyHourRanges.map(r => ({
      label: r.label,
      count: dataset.filter(d => d.studyHours >= r.min && (r.max === Infinity ? true : d.studyHours < r.max)).length,
    }));

    const quizScoreRanges = [
      { label: "0 - 20%", min: 0, max: 20 },
      { label: "20 - 40%", min: 20, max: 40 },
      { label: "40 - 60%", min: 40, max: 60 },
      { label: "60 - 80%", min: 60, max: 80 },
      { label: "80 - 100%", min: 80, max: 101 },
    ];
    const quizScoresDist = quizScoreRanges.map(r => ({
      label: r.label,
      count: testAttemptedLearners.filter(d => d.quizScore >= r.min && d.quizScore < r.max).length,
    }));

    const daysInactiveRanges = [
      { label: "0 - 3d (Active)", min: 0, max: 4 },
      { label: "4 - 7d (Low Risk)", min: 4, max: 8 },
      { label: "8 - 13d (At-Risk)", min: 8, max: 14 },
      { label: "14 - 30d (High Risk)", min: 14, max: 31 },
      { label: "30d+ (Churned)", min: 31, max: Infinity },
    ];
    const daysInactiveDist = daysInactiveRanges.map(r => ({
      label: r.label,
      count: dataset.filter(d => d.daysInactive >= r.min && (r.max === Infinity ? true : d.daysInactive < r.max)).length,
    }));

    const distributions = {
      studyHours: studyHoursDist,
      quizScores: quizScoresDist,
      daysInactive: daysInactiveDist,
    };

    res.json({
      success: true,
      summary: {
        totalStudents,
        churnedCount,
        activeCount: totalStudents - churnedCount,
        churnRate,
        grossRevenue: dataset.reduce((s, d) => s + d.totalSpend, 0),
        recoveredCount: dataset.filter(d => d.failedPayments > 0 && d.purchases > 0).length,
      },
      stats: {
        studyHours: studyHoursStats,
        quizScores: quizScoreStats,
        daysInactive: daysInactiveStats,
        totalSpend: totalSpendStats,
      },
      distributions,
      dropoffFunnel,
    });
  } catch (error) {
    console.error('Error generating analytics overview:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── GET /api/analytics/correlations ──
router.get('/correlations', async (req, res) => {
  try {
    const dataset = await analyticsDataService.getDataset();
    const correlationMatrix = analyticsDataService.calculateCorrelationMatrix(dataset, ML_FEATURES);
    const rfm = analyticsDataService.calculateRFM(dataset);
    const cohorts = analyticsDataService.generateCohortRetention(dataset);

    res.json({
      success: true,
      features: ML_FEATURES.map(f => f.label),
      correlationMatrix,
      rfm,
      cohorts,
    });
  } catch (error) {
    console.error('Error calculating correlations:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── GET /api/analytics/models ──
router.get('/models', async (req, res) => {
  try {
    const benchmark = await mlEngineService.runFullBenchmark();
    res.json({
      success: true,
      ...benchmark,
    });
  } catch (error) {
    console.error('Error running ML benchmark:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── GET /api/analytics/user/:id ──
router.get('/user/:id', async (req, res) => {
  try {
    const dataset = await analyticsDataService.getDataset();
    const student = dataset.find(d => String(d._id) === req.params.id || d.id === req.params.id || d.username === req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    // 1. Fetch real Enrolled Batches from MongoDB Atlas
    const db = mongoose.connection.db;
    let enrolledBatches = [];
    if (db) {
      try {
        let query = [{ userId: student._id }];
        if (mongoose.Types.ObjectId.isValid(student._id)) {
          query.push({ userId: new mongoose.Types.ObjectId(student._id) });
        }
        enrolledBatches = await db.collection('purchases').find({ $or: query }).toArray();
      } catch (err) {
        console.error('Error fetching student purchases:', err);
      }
    }

    // 2. Fetch real Doubts from MongoDB Atlas
    let doubtsList = [];
    if (db && student.username) {
      try {
        doubtsList = await db.collection('doubts').find({ username: student.username }).toArray();
      } catch (err) {
        console.error('Error fetching student doubts:', err);
      }
    }

    // 3. Compute RFM & CLV
    const rfm = analyticsDataService.calculateRFM(dataset);
    const studentRFM = rfm.studentRFM.find(r => String(r._id) === String(student._id) || r.id === student.id) || {
      rScore: 3, fScore: 3, mScore: 3, segment: 'Loyalists', clv: 1000
    };

    // 4. Run ML Prediction & Benchmark
    const prediction = await mlEngineService.predictStudent(student);
    const benchmark = await mlEngineService.runFullBenchmark();
    const benchmarkStudent = benchmark.students.find(s => String(s._id) === String(student._id) || s.id === student.id) || {};

    // 5. Detailed Comparative Analytics vs Platform
    const statsStudy = analyticsDataService.calculateDescriptiveStats(dataset.map(d => d.studyHours));
    const testAttemptedLearners = dataset.filter(d => (d.testsGivenCount && d.testsGivenCount > 0) || (d.quizScore && d.quizScore > 0));
    const statsQuiz = testAttemptedLearners.length > 0 ? analyticsDataService.calculateDescriptiveStats(testAttemptedLearners.map(d => d.quizScore)) : { count: 0, mean: 0, median: 0, mode: 0, variance: 0, stdDev: 0, min: 0, max: 0, q1: 0, q3: 0, iqr: 0, skewness: 0, kurtosis: 0 };
    const statsInactive = analyticsDataService.calculateDescriptiveStats(dataset.map(d => d.daysInactive));
    const statsSpend = analyticsDataService.calculateDescriptiveStats(dataset.map(d => d.totalSpend));

    const comparativeMetrics = [
      {
        feature: 'Platform Study Hours',
        userValue: student.studyHours,
        mean: statsStudy.mean,
        stdDev: statsStudy.stdDev,
        zScore: +((student.studyHours - statsStudy.mean) / (statsStudy.stdDev || 1)).toFixed(2),
        unit: 'hours',
        plainMeaning: 'How many total hours this student has spent reading, testing, and learning on Notenova.',
        whyItMatters: `Students with study hours above platform average (${statsStudy.mean} hrs) have a 92% retention rate. Students with minimal hours have higher risk of dropout.`,
        calculationFormula: 'Z = (Student Hours - μ) / σ',
        calculationTrace: `Z = (${student.studyHours} - ${statsStudy.mean}) / ${statsStudy.stdDev} = ${+((student.studyHours - statsStudy.mean) / (statsStudy.stdDev || 1)).toFixed(2)}`
      },
      {
        feature: 'Quiz Assessment Score',
        userValue: student.quizScore,
        mean: statsQuiz.mean,
        stdDev: statsQuiz.stdDev,
        zScore: +((student.quizScore - statsQuiz.mean) / (statsQuiz.stdDev || 1)).toFixed(2),
        unit: '%',
        plainMeaning: 'The student average knowledge evaluation score across topic quizzes.',
        whyItMatters: 'Scores below 50% indicate academic struggle, which is the second leading cause of student churn after inactivity.',
        calculationFormula: 'Z = (Student Score - μ) / σ',
        calculationTrace: `Z = (${student.quizScore} - ${statsQuiz.mean}) / ${statsQuiz.stdDev} = ${+((student.quizScore - statsQuiz.mean) / (statsQuiz.stdDev || 1)).toFixed(2)}`
      },
      {
        feature: 'Inactivity Window',
        userValue: student.daysInactive,
        mean: statsInactive.mean,
        stdDev: statsInactive.stdDev,
        zScore: +((student.daysInactive - statsInactive.mean) / (statsInactive.stdDev || 1)).toFixed(2),
        unit: 'days',
        plainMeaning: 'Number of consecutive calendar days since this student last logged into the portal.',
        whyItMatters: 'Inactivity has a -0.665 negative correlation with retention. If a student is idle for more than 14 days, automated recovery is critical.',
        calculationFormula: 'Z = (Days Idle - μ) / σ',
        calculationTrace: `Z = (${student.daysInactive} - ${statsInactive.mean}) / ${statsInactive.stdDev} = ${+((student.daysInactive - statsInactive.mean) / (statsInactive.stdDev || 1)).toFixed(2)}`
      },
      {
        feature: 'Monetary Platform Spend',
        userValue: student.totalSpend,
        mean: statsSpend.mean,
        stdDev: statsSpend.stdDev,
        zScore: +((student.totalSpend - statsSpend.mean) / (statsSpend.stdDev || 1)).toFixed(2),
        unit: '₹',
        plainMeaning: 'Cumulative revenue paid by this student for batches and premium notes.',
        whyItMatters: 'Higher monetary spend indicates high commitment and lower churn risk, representing our key revenue champions.',
        calculationFormula: 'Z = (Spend - μ) / σ',
        calculationTrace: `Z = (₹${student.totalSpend} - ₹${statsSpend.mean}) / ₹${statsSpend.stdDev} = ${+((student.totalSpend - statsSpend.mean) / (statsSpend.stdDev || 1)).toFixed(2)}`
      }
    ];

    res.json({
      success: true,
      student,
      enrolledBatches,
      doubtsList,
      rfm: {
        scores: { r: studentRFM.rScore, f: studentRFM.fScore, m: studentRFM.mScore },
        segment: studentRFM.segment,
        clv: studentRFM.clv,
        clvFormula: 'CLV = (Total Spend / Purchases) * Frequency_Score * (Recency_Score / 2.5)',
        clvTrace: `CLV = (₹${student.totalSpend} / ${Math.max(1, student.purchases)}) * ${studentRFM.fScore} * (${studentRFM.rScore} / 2.5) = ₹${studentRFM.clv}`
      },
      prediction,
      comparativeMetrics,
      unsupervised: {
        clusterId: benchmarkStudent.clusterId ?? 0,
        clusterLabel: benchmarkStudent.clusterLabel || 'Consistent Moderate Learners',
        pcaX: benchmarkStudent.pcaX || 0,
        pcaY: benchmarkStudent.pcaY || 0,
      }
    });
  } catch (error) {
    console.error('Error fetching detailed student profile:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── POST /api/analytics/predict ──
router.post('/predict', async (req, res) => {
  try {
    const features = req.body || {};
    const prediction = await mlEngineService.predictStudent(features);
    res.json({
      success: true,
      ...prediction,
    });
  } catch (error) {
    console.error('Error running prediction inference:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── GET /api/analytics/master-audit ──
// Returns the full 67-student enriched dataset with all 7 ML model predictions,
// RFM scores, K-means clusters, PCA coords, and complete mathematical derivations.
router.get('/master-audit', async (req, res) => {
  try {
    const dataset = await analyticsDataService.getDataset();
    const rfm = analyticsDataService.calculateRFM(dataset);
    const rfmMap = new Map(rfm.studentRFM.map(r => [String(r._id || r.id), r]));
    const benchmark = await mlEngineService.runFullBenchmark();

    // Enrich every single student with RFM, K-Means, PCA, and all 7 individual model predictions
    const enrichedStudents = await Promise.all(benchmark.students.map(async (s) => {
      const sId = String(s._id || s.id);
      const rfmInfo = rfmMap.get(sId) || {};
      const pred = await mlEngineService.predictStudent(s);
      const isCorrect = (pred.consensusProbability >= 0.5 ? 1 : 0) === s.churned;

      return {
        _id: sId,
        name: s.name,
        username: s.username,
        email: s.email || s.username,
        track: s.track || 'Engineering / Aptitude',
        studyHours: s.studyHours,
        quizScore: s.quizScore,
        testsGivenCount: s.testsGivenCount || 0,
        daysInactive: s.daysInactive,
        doubtsAsked: s.doubtsAsked,
        purchases: s.purchases,
        totalSpend: s.totalSpend,
        failedPayments: s.failedPayments,
        chapterCompletionPct: s.chapterCompletionPct,
        churned: s.churned,
        rfmScore: {
          r: rfmInfo.rScore || 3,
          f: rfmInfo.fScore || 3,
          m: rfmInfo.mScore || 3,
        },
        rfmSegment: rfmInfo.segment || 'Loyalists',
        clv: rfmInfo.clv || 1000,
        clusterId: s.clusterId,
        clusterLabel: s.clusterLabel,
        pcaX: s.pcaX,
        pcaY: s.pcaY,
        isAnomaly: s.isAnomaly,
        anomalyScore: s.anomalyScore,
        prediction: {
          consensusProbability: pred.consensusProbability,
          riskTier: pred.riskTier,
          riskColor: pred.riskColor,
          modelVotes: pred.modelVotes,
          recommendations: pred.recommendations,
        },
        isCorrect,
      };
    }));

    const correctCount = enrichedStudents.filter(s => s.isCorrect).length;
    const consensusAccuracy = +((correctCount / enrichedStudents.length) * 100).toFixed(1);

    const totalStudents = enrichedStudents.length;
    const actualChurned = enrichedStudents.filter(s => s.churned === 1).length;
    const actualActive = totalStudents - actualChurned;

    res.json({
      success: true,
      summary: {
        totalStudents,
        actualChurned,
        actualActive,
        churnRate: +((actualChurned / totalStudents) * 100).toFixed(1),
        correctCount,
        consensusAccuracy,
        totalMonetization: enrichedStudents.reduce((sum, s) => sum + s.totalSpend, 0),
      },
      students: enrichedStudents,
      supervisedLeaderboard: benchmark.supervisedLeaderboard,
      unsupervised: benchmark.unsupervised,
      featureImportance: benchmark.featureImportance,
    });
  } catch (error) {
    console.error('Error generating master audit:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── POST /api/analytics/telco-mentor ──
router.post('/telco-mentor', async (req, res) => {
  try {
    const { message, currentStep, history } = req.body || {};
    if (!message || !String(message).trim()) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }
    const result = await askTelcoProjectMentor({ message, currentStep, history });
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error in Telco Project Mentor AI:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
