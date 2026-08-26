// webhook.js
// Must be mounted in index.js BEFORE app.use(express.json()).

import express from 'express';
import crypto from 'crypto';

import FailedPayment from './schema/FailedPayment.model.js';
import PaymentAttempt from './schema/PaymentAttempt.model.js';
import { User } from '../../schema/user.model.js';
import { processSignal } from './services/orchestrator.js';
import AgentAction from "./schema/AgentAction.model.js";
import { getPolicy } from "./services/policyService.js";
import { issueRecoveryOffer } from "./services/recoveryOfferService.js";

const router = express.Router();

router.post(
  '/webhook/razorpay',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    try {
      const signature = req.headers['x-razorpay-signature'];
      const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

      if (!secret) {
        console.error('RAZORPAY_WEBHOOK_SECRET is not set');

        return res.status(500).json({
          error: 'Webhook not configured'
        });
      }

      // Verify Razorpay signature using RAW request body
      const expected = crypto
        .createHmac('sha256', secret)
        .update(req.body)
        .digest('hex');

      if (signature !== expected) {
        return res.status(400).json({
          error: 'Invalid webhook signature'
        });
      }

      const payload = JSON.parse(
        req.body.toString()
      );

      // 1. PAYMENT FAILURE EVENTS (payment.failed, subscription failure, mandate retry)
      if (payload.event === 'payment.failed' || payload.event === 'subscription.charged_failed') {
        const p = payload.payload?.payment?.entity || payload.payload?.subscription?.entity || {};

        if (!p.order_id && !p.id) {
          return res.status(400).json({ error: 'Missing Razorpay order or payment ID' });
        }

        const paymentAttempt = await PaymentAttempt.findOne({
          $or: [{ razorpayOrderId: p.order_id }, { razorpayPaymentId: p.id }],
        });

        const customer = paymentAttempt?.userId
          ? await User.findById(paymentAttempt.userId).select('name username phone').lean()
          : null;

        const existingSignal = await FailedPayment.findOne({ razorpayPaymentId: p.id });
        let signal = existingSignal;
        if (!signal) {
          signal = await FailedPayment.create({
            source: payload.event.includes('subscription') ? 'subscription_failure' : 'payment_failure',
            userId: paymentAttempt?.userId || null,
            batchId: paymentAttempt?.batchId || null,
            batchTitle: paymentAttempt?.batchTitle || null,
            paymentAttemptId: paymentAttempt?._id || null,
            razorpayOrderId: p.order_id || null,
            razorpayPaymentId: p.id || null,
            amount: p.amount || 0,
            currency: p.currency || 'INR',
            customerName: paymentAttempt?.customerName || customer?.name || customer?.username || 'Customer',
            customerEmail: paymentAttempt?.customerEmail || customer?.username || p.email || '',
            customerPhone: paymentAttempt?.customerPhone || customer?.phone || p.contact || '',
            failureReason: p.error_reason || p.error_code || 'gateway_declined',
            status: 'open',
            rawPayload: p,
          });
        }

        if (paymentAttempt) {
          paymentAttempt.status = 'failed';
          paymentAttempt.razorpayPaymentId = p.id;
          paymentAttempt.failureReason = p.error_reason || p.error_code || 'gateway_declined';
          await paymentAttempt.save();
        }

        // ISSUE #1 SOLVED: Run LLM Agent Reasoning & Policy Gate on real webhook failure signal
        try {
          await processSignal(signal);
        } catch (agentErr) {
          console.error('[Webhook] LLM Agent processing error:', agentErr.message);
        }
      }

      // 2. PAYMENT RECOVERY SUCCESS EVENTS (payment.captured, order.paid, subscription.charged)
      if (payload.event === 'payment.captured' || payload.event === 'order.paid' || payload.event === 'subscription.charged') {
        const p = payload.payload?.payment?.entity || payload.payload?.order?.entity || {};
        const orderId = p.order_id || p.id;

        if (orderId) {
          const matchingSignal = await FailedPayment.findOne({
            $or: [{ razorpayOrderId: orderId }, { razorpayPaymentId: p.id }, { status: { $in: ['open', 'recovering', 'escalated'] } }],
          }).sort({ createdAt: -1 });

          if (matchingSignal) {
            matchingSignal.status = 'recovered';
            matchingSignal.recoveredAt = new Date();
            matchingSignal.recoveredAmountPaise = p.amount || matchingSignal.amount;
            matchingSignal.recoveryChannel = 'razorpay_webhook';
            await matchingSignal.save();
            console.log(`🎉 [Webhook] Recovery Attributed! Signal ${matchingSignal._id} marked RECOVERED (₹${(matchingSignal.recoveredAmountPaise / 100).toLocaleString('en-IN')})`);
          }
        }
      }

      return res.status(200).json({ received: true });
    } catch (error) {
      console.error('Razorpay webhook error:', error);
      return res.status(500).json({ error: 'Webhook processing failed' });
    }
  }
);

export default router;
