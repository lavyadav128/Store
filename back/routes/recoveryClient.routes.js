import express from 'express';
import auth from '../controller/authh.js';
import PaymentAttempt from '../agents/revenue-recovery/schema/PaymentAttempt.model.js';
import FailedPayment from '../agents/revenue-recovery/schema/FailedPayment.model.js';
import { User } from '../schema/user.model.js';

const router = express.Router();

// Browser-side fallback for local Test Mode. Razorpay cannot call a localhost
// webhook directly, so Checkout's verified payment.failed event records the
// same admin-gated recovery signal. The server derives all sensitive details
// from the original PaymentAttempt; the browser cannot choose a user/amount.
router.post('/payment-failed', auth, async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, reason } = req.body || {};
  const attempt = await PaymentAttempt.findOne({ razorpayOrderId, userId: req.user._id });
  if (!attempt) return res.status(404).json({ error: 'Matching payment attempt not found' });
  const existing = await FailedPayment.findOne({ $or: [{ razorpayPaymentId: razorpayPaymentId || null }, { razorpayOrderId }] });
  if (existing) return res.json({ success: true, signal: existing, duplicate: true });
  const user = await User.findById(req.user._id).select('name username phone').lean();
  attempt.status = 'failed'; attempt.razorpayPaymentId = razorpayPaymentId || attempt.razorpayPaymentId; attempt.failureReason = reason || 'payment_failed'; await attempt.save();
  const signal = await FailedPayment.create({
    source: 'payment_failure', status: 'escalated', userId: req.user._id,
    batchId: attempt.batchId, batchTitle: attempt.batchTitle, paymentAttemptId: attempt._id,
    razorpayOrderId, razorpayPaymentId: razorpayPaymentId || null,
    amount: Math.round(Number(attempt.amount) * 100), currency: attempt.currency,
    customerName: user?.name || user?.username || '', customerEmail: user?.username || '', customerPhone: user?.phone || '',
    failureReason: reason || 'payment_failed', rawPayload: { source: 'checkout_client_fallback' },
  });
  res.status(201).json({ success: true, signal });
});

export default router;
