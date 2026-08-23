// routes.js
// Mounted at /api/agent/revenue-recovery in index.js (see instructions).

import express from 'express';
import FailedPayment from './schema/FailedPayment.model.js';
import AgentAction from './schema/AgentAction.model.js';
import { processSignal } from './services/orchestrator.js';
import { getPolicy, updatePolicy } from './services/policyService.js';
import { confirmPromiseToPay } from './services/actionService.js';
import auth from '../../controller/authh.js';
import requireAdmin from '../../middleware/requireAdmin.js';
// import RecoveryOffer from './schema/RecoveryOffer.model.js';
// import Notification from '../../schema/notification.model.js';
// import { User } from '../../schema/user.model.js';
import { issueRecoveryOffer } from "./services/recoveryOfferService.js";

const router = express.Router();

// Recovery signals reveal customer/payment information and are operated only
// by the merchant's admin account. Frontend route guards alone are not enough.
router.use(auth, requireAdmin);

router.get('/signals', async (req, res) => {
  const { status, source } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (source) filter.source = source;
  const signals = await FailedPayment.find(filter)
    .populate('userId', 'name username')
    .sort({ createdAt: -1 })
    .limit(200);
  // Older signals may predate customer fields on PaymentAttempt. Enrich their
  // response from the linked user so the admin dashboard never shows a blank
  // customer when the platform knows who initiated the checkout.
  res.json(signals.map((signal) => {
    const item = signal.toObject();
    if (!item.customerName && item.userId) {
      item.customerName = item.userId.name || item.userId.username || '';
    }
    return item;
  }));
});

router.get('/signals/:id', async (req, res) => {
  const signal = await FailedPayment.findById(req.params.id);
  if (!signal) return res.status(404).json({ error: 'Not found' });
  const actions = await AgentAction.find({ failedPaymentId: signal._id }).sort({ createdAt: 1 });
  res.json({ signal, actions });
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
  if (signal.source !== 'payment_failure' || !signal.userId || !signal.batchId) {
    return res.status(400).json({ error: 'A linked payment-failure signal is required to create a student recovery offer.' });
  }
  const offer = await issueRecoveryOffer(signal, {
    approvedBy: "admin",
  });
  
  res.json({
    success: true,
    signal,
    offerId: offer._id,
    discountPercent: offer.discountPercent,
  });
});

router.post('/signals/:id/promise-to-pay', async (req, res) => {
  const { promisedDate } = req.body;
  const signal = await FailedPayment.findById(req.params.id);
  if (!signal) return res.status(404).json({ error: 'Not found' });

  signal.promiseToPay = { promised: true, promisedDate, fulfilled: false };
  await signal.save();
  await confirmPromiseToPay(signal, promisedDate);
  res.json({ success: true, signal });
});

router.get('/policy', async (req, res) => {
  res.json(await getPolicy());
});

router.patch('/policy', async (req, res) => {
  res.json(await updatePolicy(req.body));
});

router.get('/metrics', async (req, res) => {
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
