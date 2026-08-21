// routes.js
// Mounted at /api/agent/revenue-recovery in index.js (see instructions).

import express from 'express';
import FailedPayment from './schema/FailedPayment.model.js';
import AgentAction from './schema/AgentAction.model.js';
import { processSignal } from './services/orchestrator.js';
import { getPolicy, updatePolicy } from './services/policyService.js';
import { confirmPromiseToPay } from './services/actionService.js';
import auth from '../../controller/authh.js';

const router = express.Router();

router.get('/signals', auth, async (req, res) => {
  const { status, source } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (source) filter.source = source;
  const signals = await FailedPayment.find(filter).sort({ createdAt: -1 }).limit(200);
  res.json(signals);
});

router.get('/signals/:id', auth, async (req, res) => {
  const signal = await FailedPayment.findById(req.params.id);
  if (!signal) return res.status(404).json({ error: 'Not found' });
  const actions = await AgentAction.find({ failedPaymentId: signal._id }).sort({ createdAt: 1 });
  res.json({ signal, actions });
});

router.post('/signals/:id/process', auth, async (req, res) => {
  try {
    const { simulateFailure } = req.body || {};
    const result = await processSignal(req.params.id, { simulateFailure: !!simulateFailure });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/approval-queue', auth, async (req, res) => {
  const items = await FailedPayment.find({ status: 'escalated' }).sort({ createdAt: -1 });
  res.json(items);
});

router.post('/signals/:id/approve', auth, async (req, res) => {
  const signal = await FailedPayment.findById(req.params.id);
  if (!signal) return res.status(404).json({ error: 'Not found' });
  signal.status = 'recovering';
  await signal.save();
  res.json({ success: true, signal });
});

router.post('/signals/:id/promise-to-pay', auth, async (req, res) => {
  const { promisedDate } = req.body;
  const signal = await FailedPayment.findById(req.params.id);
  if (!signal) return res.status(404).json({ error: 'Not found' });

  signal.promiseToPay = { promised: true, promisedDate, fulfilled: false };
  await signal.save();
  await confirmPromiseToPay(signal, promisedDate);
  res.json({ success: true, signal });
});

router.get('/policy', auth, async (req, res) => {
  res.json(await getPolicy());
});

router.patch('/policy', auth, async (req, res) => {
  res.json(await updatePolicy(req.body));
});

router.get('/metrics', auth, async (req, res) => {
  const [open, recovering, recovered, lost, escalated] = await Promise.all([
    FailedPayment.countDocuments({ status: 'open' }),
    FailedPayment.countDocuments({ status: 'recovering' }),
    FailedPayment.countDocuments({ status: 'recovered' }),
    FailedPayment.countDocuments({ status: 'lost' }),
    FailedPayment.countDocuments({ status: 'escalated' }),
  ]);

  const recoveredAgg = await FailedPayment.aggregate([
    { $match: { status: 'recovered' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const revenueRecoveredPaise = recoveredAgg[0]?.total || 0;

  res.json({
    counts: { open, recovering, recovered, lost, escalated },
    revenueRecoveredRupees: revenueRecoveredPaise / 100,
  });
});

// NOTE: the Razorpay webhook lives in webhook.js, not here — it needs the
// RAW request body for signature verification, so it must be mounted in
// index.js BEFORE the global express.json() middleware. See webhook.js.

export default router;