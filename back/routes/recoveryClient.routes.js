import express from 'express';
import auth from '../controller/authh.js';
import PaymentAttempt from '../agents/revenue-recovery/schema/PaymentAttempt.model.js';
import FailedPayment from '../agents/revenue-recovery/schema/FailedPayment.model.js';
import { User } from '../schema/user.model.js';
import { issueRecoveryOffer } from '../agents/revenue-recovery/services/recoveryOfferService.js';
import { getPolicy } from '../agents/revenue-recovery/services/policyService.js';
import RecoveryOffer from '../agents/revenue-recovery/schema/RecoveryOffer.model.js';

const router = express.Router();

// Browser-side fallback for local Test Mode & immediate checkout failure handling.
// If amount <= ₹5,000, immediately generates a discounted recovery offer, triggers WhatsApp,
// and returns the offer to show an instant popup.
// If amount > ₹5,000, places the signal in 'escalated' status for mandatory Human / Admin Approval
// before any discount offer or message is sent.
router.post('/payment-failed', auth, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, reason } = req.body || {};
    const attempt = await PaymentAttempt.findOne({ razorpayOrderId, userId: req.user._id });
    if (!attempt) return res.status(404).json({ error: 'Matching payment attempt not found' });

    const duplicateFilters = [{ razorpayOrderId }];
    if (razorpayPaymentId) duplicateFilters.push({ razorpayPaymentId });
    let signal = await FailedPayment.findOne({ $or: duplicateFilters });

    const user = await User.findById(req.user._id).select('name username phone').lean();
    attempt.status = 'failed';
    attempt.razorpayPaymentId = razorpayPaymentId || attempt.razorpayPaymentId;
    attempt.failureReason = reason || 'payment_failed';
    await attempt.save();

    const signalAmountPaise = Math.round(Number(attempt.amount) * 100);

    if (!signal) {
      signal = await FailedPayment.create({
        source: 'payment_failure',
        status: 'escalated',
        userId: req.user._id,
        batchId: attempt.batchId,
        batchTitle: attempt.batchTitle,
        paymentAttemptId: attempt._id,
        razorpayOrderId,
        razorpayPaymentId: razorpayPaymentId || null,
        amount: signalAmountPaise,
        currency: attempt.currency || 'INR',
        customerName: user?.name || user?.username || '',
        customerEmail: user?.username || '',
        customerPhone: user?.phone || '',
        failureReason: reason || 'payment_failed',
        rawPayload: { source: 'checkout_client_fallback' },
      });
    }

    const policy = await getPolicy();
    const autoApproveCeiling = Number(policy.autoApproveMaxAmount || 500000); // 500000 paise = ₹5,000

    // Check if amount requires Human Admin Approval (> ₹5,000)
    if (signal.amount > autoApproveCeiling) {
      signal.status = 'escalated';
      await signal.save();

      return res.status(200).json({
        success: true,
        signal,
        requiresApproval: true,
        message: `High-value payment (₹${(signal.amount / 100).toLocaleString('en-IN')}) requires admin approval before discount offer can be dispatched. Routed to approval queue.`,
      });
    }

    // Auto-approve payments <= ₹5,000: Issue recovery discount offer (in-app notification + WhatsApp nudge)
    const offer = await issueRecoveryOffer(signal, { approvedBy: 'auto_recovery_agent' });

    const origRupees = Math.round(signal.amount / 100);
    const discPercent = offer.discountPercent || 15;
    const discRupees = Math.round(origRupees * (1 - discPercent / 100));

    res.status(201).json({
      success: true,
      signal,
      requiresApproval: false,
      offer: {
        id: String(offer._id),
        offerId: String(offer._id),
        batchId: signal.batchId,
        batchTitle: signal.batchTitle || attempt.batchTitle || 'Course Batch',
        discountPercent: discPercent,
        originalPriceRupees: origRupees,
        discountedPriceRupees: discRupees,
        checkoutUrl: `/pay-discount/${offer._id}`,
        expiresAt: offer.expiresAt,
      },
    });
  } catch (err) {
    console.error('Payment failed recovery handler error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

export default router;

