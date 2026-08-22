// webhook.js
// Must be mounted in index.js BEFORE app.use(express.json()).

import express from 'express';
import crypto from 'crypto';

import FailedPayment from './schema/FailedPayment.model.js';
import PaymentAttempt from './schema/PaymentAttempt.model.js';
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

        // Create revenue-recovery signal
        const signal = await FailedPayment.create({
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
            paymentAttempt?.customerName || '',

          customerEmail:
            paymentAttempt?.customerEmail ||
            p.email ||
            '',

          customerPhone:
            paymentAttempt?.customerPhone ||
            p.contact ||
            '',

          failureReason:
            p.error_reason ||
            p.error_code ||
            'unknown',

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

        // Start AI Revenue Recovery Agent
        processSignal(signal._id).catch(
          (err) =>
            console.error(
              'Agent processing error:',
              err
            )
        );
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