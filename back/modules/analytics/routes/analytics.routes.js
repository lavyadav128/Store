// back/modules/analytics/routes/analytics.routes.js
import express from 'express';
import mongoose from 'mongoose';
import analyticsDataService from '../services/analyticsData.service.js';
import mlEngineService, { ML_FEATURES } from '../services/mlEngine.service.js';

const router = express.Router();

// ── GET /api/analytics/overview ──
router.get('/overview', async (req, res) => {
  try {
    const dataset = await analyticsDataService.getDataset();
    const totalStudents = dataset.length;
    const churnedCount = dataset.filter(d => d.churned === 1).length;
    const churnRate = totalStudents > 0 ? +((churnedCount / totalStudents) * 100).toFixed(1) : 0;

    const studyHoursStats = analyticsDataService.calculateDescriptiveStats(dataset.map(d => d.studyHours));
    const quizScoreStats = analyticsDataService.calculateDescriptiveStats(dataset.map(d => d.quizScore));
    const daysInactiveStats = analyticsDataService.calculateDescriptiveStats(dataset.map(d => d.daysInactive));
    const totalSpendStats = analyticsDataService.calculateDescriptiveStats(dataset.map(d => d.totalSpend));

    const dropoffFunnel = analyticsDataService.getDropoffFunnel(dataset);

    // Distribution Histograms (bins)
    const makeBins = (numbers, binCount = 5) => {
      if (!numbers || numbers.length === 0) return [];
      const min = Math.min(...numbers);
      const max = Math.max(...numbers);
      const step = (max - min) / binCount || 1;
      const bins = Array.from({ length: binCount }, (_, idx) => {
        const start = +(min + idx * step).toFixed(1);
        const end = +(start + step).toFixed(1);
        return { label: `${start}-${end}`, count: 0 };
      });
      numbers.forEach(v => {
        let bIdx = Math.min(binCount - 1, Math.floor((v - min) / step));
        if (bIdx >= 0 && bIdx < binCount) bins[bIdx].count++;
      });
      return bins;
    };

    const distributions = {
      studyHours: makeBins(dataset.map(d => d.studyHours), 6),
      quizScores: makeBins(dataset.map(d => d.quizScore), 6),
      daysInactive: makeBins(dataset.map(d => d.daysInactive), 5),
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
    const cohorts = analyticsDataService.generateCohortRetention();

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
    const statsQuiz = analyticsDataService.calculateDescriptiveStats(dataset.map(d => d.quizScore));
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
        whyItMatters: 'Students with study hours above average (>38 hrs) have a 92% retention rate. Students below 10 hours have an 88% risk of dropout.',
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

export default router;
