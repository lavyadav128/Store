// webhook.js
// Must be mounted in index.js BEFORE app.use(express.json()).

import express from 'express';
import crypto from 'crypto';

import FailedPayment from './schema/FailedPayment.model.js';
import PaymentAttempt from './schema/PaymentAttempt.model.js';
import { User } from '../../schema/user.model.js';
import { processSignal } from './services/orchestrator.js';

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

      // We only handle failed payments here
      if (payload.event === 'payment.failed') {
        const p = payload.payload.payment.entity;

        if (!p.order_id) {
          console.error(
            'payment.failed webhook has no order_id'
          );

          return res.status(400).json({
            error: 'Missing Razorpay order ID'
          });
        }

        // Find the payment attempt created when
        // the student started checkout.
        const paymentAttempt =
          await PaymentAttempt.findOne({
            razorpayOrderId: p.order_id
          });

        // Older attempts did not contain customer details. Resolve them from
        // the linked account so the admin feed is useful for real payments.
        const customer = paymentAttempt?.userId
          ? await User.findById(paymentAttempt.userId).select('name username phone').lean()
          : null;

        // Razorpay retries webhook delivery until it receives a 2xx response.
        // Idempotently reuse a signal we have already processed for this payment
        // so duplicate deliveries can never produce duplicate customer nudges.
        const existingSignal = await FailedPayment.findOne({ razorpayPaymentId: p.id });
        let signal = existingSignal;
        if (!signal) signal = await FailedPayment.create({
          source: 'payment_failure',

          userId:
            paymentAttempt?.userId || null,

          batchId:
            paymentAttempt?.batchId || null,

          batchTitle:
            paymentAttempt?.batchTitle || null,

          paymentAttemptId:
            paymentAttempt?._id || null,

          razorpayOrderId:
            p.order_id,

          razorpayPaymentId:
            p.id,

          amount:
            p.amount,

          currency:
            p.currency,

          customerName:
            paymentAttempt?.customerName || customer?.name || customer?.username || '',

          customerEmail:
            paymentAttempt?.customerEmail ||
            customer?.username ||
            p.email ||
            '',

          customerPhone:
            paymentAttempt?.customerPhone ||
            customer?.phone ||
            p.contact ||
            '',

          failureReason:
            p.error_reason ||
            p.error_code ||
            'unknown',

          // Every real payment failure is held for admin review before an
          // incentive/retry offer can reach the student.
          status: 'escalated',

          rawPayload: p,
        });

        // Mark original payment attempt as failed
        if (paymentAttempt) {
          paymentAttempt.status = 'failed';

          paymentAttempt.razorpayPaymentId =
            p.id;

          paymentAttempt.failureReason =
            p.error_reason ||
            p.error_code ||
            'unknown';

          await paymentAttempt.save();
        }

        // Start recovery only for the first webhook delivery. Reprocessing a
        // duplicate delivery would duplicate actions and audit records.
        // The live payment failure is deliberately escalated immediately.
        // Admin approval, not an LLM call, is the authority that can issue a
        // discount offer. The admin can still run the agent for an auditable
        // explanation, but no student action happens without approval.
      }

      return res.status(200).json({
        received: true
      });

    } catch (error) {
      console.error(
        'Razorpay webhook error:',
        error
      );

      return res.status(500).json({
        error: 'Webhook processing failed'
      });
    }
  }
);

export default router;
