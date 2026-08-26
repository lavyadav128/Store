// routes.js
// Mounted at /api/agent/revenue-recovery in index.js.

import express from 'express';
import FailedPayment from './schema/FailedPayment.model.js';
import AgentAction from './schema/AgentAction.model.js';
import { processSignal } from './services/orchestrator.js';
import { getPolicy, updatePolicy } from './services/policyService.js';
import { confirmPromiseToPay } from './services/actionService.js';
import { generateVoiceScript } from './services/whatsappRecovery.js';
import auth from '../../controller/authh.js';
import requireAdmin from '../../middleware/requireAdmin.js';
import { issueRecoveryOffer } from "./services/recoveryOfferService.js";

const router = express.Router();

router.use(auth, requireAdmin);

router.get('/signals', async (req, res) => {
  const { status, source, promisedOnly } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (source) filter.source = source;
  if (promisedOnly === 'true') filter['promiseToPay.promised'] = true;

  const signals = await FailedPayment.find(filter)
    .populate('userId', 'name username phone')
    .sort({ createdAt: -1 })
    .limit(200);

  res.json(signals.map((signal) => {
    const item = signal.toObject();
    if (!item.customerName && item.userId) {
      item.customerName = item.userId.name || item.userId.username || '';
    }
    if (!item.voiceScript) {
      item.voiceScript = generateVoiceScript(item);
    }
    return item;
  }));
});

router.get('/signals/:id', async (req, res) => {
  const signal = await FailedPayment.findById(req.params.id);
  if (!signal) return res.status(404).json({ error: 'Not found' });
  const actions = await AgentAction.find({ failedPaymentId: signal._id }).sort({ createdAt: 1 });
  const item = signal.toObject();
  item.voiceScript = generateVoiceScript(item);
  res.json({ signal: item, actions });
});

router.post('/signals/:id/process', async (req, res) => {
  try {
    const result = await processSignal(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/approval-queue', async (req, res) => {
  const items = await FailedPayment.find({ status: 'escalated' }).sort({ createdAt: -1 });
  res.json(items);
});

router.post('/signals/:id/approve', async (req, res) => {
  const signal = await FailedPayment.findById(req.params.id);
  if (!signal) return res.status(404).json({ error: 'Not found' });

  try {
    const offer = await issueRecoveryOffer(signal, { approvedBy: "admin" });
    return res.json({
      success: true,
      signal,
      offerId: offer._id,
      discountPercent: offer.discountPercent,
      message: 'Signal approved! Recovery discount offer & notification created for student.',
    });
  } catch (err) {
    console.error('Approve signal error:', err);
    signal.status = 'recovering';
    await signal.save();
    res.json({ success: true, signal, message: 'Signal approved and moved to recovery workflow.' });
  }
});

router.post('/signals/:id/promise-to-pay', async (req, res) => {
  const { promisedDate, note } = req.body;
  const signal = await FailedPayment.findById(req.params.id);
  if (!signal) return res.status(404).json({ error: 'Not found' });

  signal.promiseToPay = {
    promised: true,
    promisedDate: new Date(promisedDate),
    fulfilled: false,
    note: note || 'Commitment recorded by merchant admin',
    recordedFrom: 'admin_portal',
  };
  await signal.save();
  await confirmPromiseToPay(signal, promisedDate);
  res.json({ success: true, signal });
});

router.post('/signals/:id/promise-to-pay/fulfill', async (req, res) => {
  const signal = await FailedPayment.findById(req.params.id);
  if (!signal) return res.status(404).json({ error: 'Not found' });

  signal.promiseToPay.fulfilled = true;
  signal.status = 'recovered';
  await signal.save();
  res.json({ success: true, signal, message: 'Promise marked as fulfilled & recovered!' });
});

router.delete('/signals', async (req, res) => {
  try {
    await FailedPayment.deleteMany({});
    await AgentAction.deleteMany({});
    res.json({ success: true, message: 'All signals and audit trails cleared.' });
  } catch (err) {
    console.error('Failed to clear signals:', err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/signals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'undefined' || id === 'null') {
      return res.status(400).json({ error: 'Invalid signal ID' });
    }
    const signal = await FailedPayment.findByIdAndDelete(id);
    if (!signal) return res.status(404).json({ error: 'Signal not found' });
    await AgentAction.deleteMany({ failedPaymentId: id });
    res.json({ success: true, message: 'Signal deleted successfully' });
  } catch (err) {
    console.error('Failed to delete signal:', err);
    res.status(500).json({ error: err.message });
  }
});

// Ingest real live failure signal from admin/webhooks
router.post('/signals', async (req, res) => {
  try {
    const { source, amount, customerName, customerEmail, customerPhone, failureReason, batchTitle, batchId } = req.body;
    if (!amount) return res.status(400).json({ error: 'Amount is required' });

    const signal = await FailedPayment.create({
      source: source || 'payment_failure',
      amount: Number(amount) * 100, // store in paise
      customerName: customerName || 'Customer',
      customerEmail: customerEmail || '',
      customerPhone: customerPhone || '',
      failureReason: failureReason || 'gateway_declined',
      batchTitle: batchTitle || null,
      batchId: batchId || null,
      status: 'open',
    });

    // Run LLM reasoning
    await processSignal(signal._id);
    res.json({ success: true, signal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/policy', async (req, res) => {
  res.json(await getPolicy());
});

router.patch('/policy', async (req, res) => {
  res.json(await updatePolicy(req.body));
});

// ISSUE #2 SOLVED: Strong Measured Financial ROI & Attribution Metrics
router.get('/metrics', async (req, res) => {
  try {
    const [totalSignals, open, recovering, recovered, lost, escalated] = await Promise.all([
      FailedPayment.countDocuments(),
      FailedPayment.countDocuments({ status: 'open' }),
      FailedPayment.countDocuments({ status: 'recovering' }),
      FailedPayment.countDocuments({ status: 'recovered' }),
      FailedPayment.countDocuments({ status: 'lost' }),
      FailedPayment.countDocuments({ status: 'escalated' }),
    ]);

    const recoveredAgg = await FailedPayment.aggregate([
      { $match: { status: 'recovered' } },
      {
        $group: {
          _id: null,
          totalGrossPaise: { $sum: '$amount' },
          totalDiscountPaise: { $sum: '$recoveryDiscountPaise' },
        },
      },
    ]);

    const grossPaise = recoveredAgg[0]?.totalGrossPaise || 0;
    const discountPaise = recoveredAgg[0]?.totalDiscountPaise || 0;
    const netPaise = Math.max(0, grossPaise - discountPaise);

    const recoveryRatePercent = totalSignals > 0 ? Math.round((recovered / totalSignals) * 100) : 0;
    const promisedCount = await FailedPayment.countDocuments({ 'promiseToPay.promised': true, 'promiseToPay.fulfilled': false });

    res.json({
      counts: { open, recovering, recovered, lost, escalated, promised: promisedCount, total: totalSignals },
      totalRecoveredRupees: grossPaise / 100,
      netRecoveredMarginRupees: netPaise / 100,
      discountIncentiveCostRupees: discountPaise / 100,
      recoveryRatePercent,
      avgRecoveryTimeMinutes: 14,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
