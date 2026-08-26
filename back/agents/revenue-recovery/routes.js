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

// Recovery signals reveal customer/payment information and are operated only
// by the merchant's admin account.
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
  
  if (signal.source === 'payment_failure' && signal.userId && signal.batchId) {
    const offer = await issueRecoveryOffer(signal, { approvedBy: "admin" });
    return res.json({
      success: true,
      signal,
      offerId: offer._id,
      discountPercent: offer.discountPercent,
    });
  }

  signal.status = 'recovering';
  await signal.save();
  res.json({ success: true, signal, message: 'Signal approved and moved to recovery workflow.' });
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
  res.json({ success: true, signal, message: 'Promise to pay marked as fulfilled & recovered!' });
});

/**
 * 1-Click Razorpay Buildathon Demo Scenario Seeder
 * Populates realistic test signals across all 5 competition directions
 */
router.post('/seed-demo', async (req, res) => {
  try {
    const demoSignals = [
      {
        source: 'payment_failure',
        amount: 499900, // ₹4,999
        customerName: 'Aarav Sharma',
        customerEmail: 'aarav.sharma@example.com',
        customerPhone: '+919876543210',
        failureReason: 'BAD_REQUEST_ERROR: 3D Secure OTP verification timeout by issuing bank (HDFC Bank)',
        status: 'open',
        attempts: 1,
        language: 'hinglish',
        batchTitle: 'IIT JEE Advanced Super Batch 2026',
        batchId: 'iit-jee-adv-2026',
      },
      {
        source: 'checkout_dropoff',
        amount: 299900, // ₹2,999
        customerName: 'Priya Patel',
        customerEmail: 'priya.patel@example.com',
        customerPhone: '+919823456789',
        failureReason: 'Checkout closed before payment details were submitted',
        status: 'open',
        attempts: 0,
        language: 'hinglish',
        batchTitle: 'Full-Stack Web & AI Engineering',
        batchId: 'web-dev-2026',
      },
      {
        source: 'subscription_failure',
        amount: 149900, // ₹1,499
        customerName: 'Rohan Mehta',
        customerEmail: 'rohan.mehta@example.com',
        customerPhone: '+919812345678',
        failureReason: 'Recurring autopay debit failed: INSUFFICIENT_FUNDS in customer account',
        status: 'open',
        attempts: 2,
        language: 'hinglish',
        batchTitle: 'Monthly Premium Mentorship & Test Series',
        batchId: 'mentorship-monthly',
      },
      {
        source: 'overdue_receivable',
        amount: 4500000, // ₹45,000
        customerName: 'Vikram Malhotra',
        customerEmail: 'accounts@techcorp-innovations.in',
        customerPhone: '+919898989898',
        failureReason: 'Corporate training invoice 14 days overdue',
        status: 'open',
        attempts: 1,
        language: 'en',
        invoiceDetails: {
          invoiceNumber: 'INV-2026-0842',
          companyName: 'TechCorp Innovations Pvt Ltd',
          dueDate: new Date(Date.now() - 14 * 86400000),
          daysOverdue: 14,
          paymentTerms: 'Net 15',
          contactDesignation: 'Head of Accounts',
        },
      },
      {
        source: 'mandate_failure',
        amount: 199900, // ₹1,999
        customerName: 'Ananya Verma',
        customerEmail: 'ananya.v@example.com',
        customerPhone: '+919765432109',
        failureReason: 'UPI Autopay mandate execution declined by NPCI/Bank switch',
        status: 'open',
        attempts: 1,
        language: 'hinglish',
        mandateDetails: {
          mandateId: 'umn_upi_autopay_9921',
          mandateType: 'upi_autopay',
          optimalRetryWindow: '08:30 AM - 10:30 AM IST (Tomorrow Morning)',
          salaryCycleDay: 1,
          nextScheduledRetry: new Date(Date.now() + 18 * 3600000),
        },
      },
    ];

    const created = await FailedPayment.insertMany(demoSignals);
    res.json({
      success: true,
      count: created.length,
      message: 'Successfully seeded 5 Razorpay Buildathon demo scenarios covering all tracks!',
      signals: created,
    });
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

  const promisedCount = await FailedPayment.countDocuments({ 'promiseToPay.promised': true, 'promiseToPay.fulfilled': false });

  res.json({
    counts: { open, recovering, recovered, lost, escalated, promised: promisedCount },
    revenueRecoveredRupees: revenueRecoveredPaise / 100,
  });
});

export default router;

