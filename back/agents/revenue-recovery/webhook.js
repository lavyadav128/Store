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
          status: 'open',

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

        // Auto-process a real failure only once. The gate decides:
        // <= ₹5,000: AI-approved bounded recovery action
        // > ₹5,000: escalated for human approval.
        // Re-check open cases on webhook retry. This makes auto approval safe if
        // a temporary database/notification error occurred during the first attempt.
        if (signal.status === "open") {
          const policy = await getPolicy();

          const canAutoApprove =
            signal.amount <= policy.autoApproveMaxAmount &&
            signal.source === "payment_failure" &&
            signal.userId &&
            signal.batchId;

          if (canAutoApprove) {
            const offer = await issueRecoveryOffer(signal, {
              approvedBy: "policy_engine",
            });

            await AgentAction.create({
              failedPaymentId: signal._id,
              signalSnapshot: signal.toObject(),
              reasoning: {
                rootCause: signal.failureReason || "payment_failed",
                explanation:
                  "The failed amount is at or below the configured ₹5,000 automatic approval ceiling. A bounded discount retry offer was created.",
                confidence: 1,
                model: "policy-engine",
                rawResponse: {
                  amountPaise: signal.amount,
                  autoApproveMaxAmount: policy.autoApproveMaxAmount,
                },
              },
              proposedAction: {
                type: "offer_discount",
                params: {
                  discountPercent: offer.discountPercent,
                },
              },
              gate: {
                decision: "approved",
                ruleTriggered: "amount_at_or_below_auto_approve_ceiling",
                explanation:
                  "Automatically approved by the configured recovery policy.",
              },
              execution: {
                attempted: true,
                success: true,
                error: null,
                result: {
                  recoveryOfferId: String(offer._id),
                  approvedBy: "policy_engine",
                },
              },
            });
          } else {
            signal.status = "escalated";
            await signal.save();

            await AgentAction.create({
              failedPaymentId: signal._id,
              signalSnapshot: signal.toObject(),
              reasoning: {
                rootCause: signal.failureReason || "payment_failed",
                explanation:
                  "The amount exceeds the automatic approval ceiling or the payment is not safely linked to a student and batch.",
                confidence: 1,
                model: "policy-engine",
                rawResponse: {
                  amountPaise: signal.amount,
                  autoApproveMaxAmount: policy.autoApproveMaxAmount,
                },
              },
              proposedAction: {
                type: "escalate_human",
                params: {},
              },
              gate: {
                decision: "pending_approval",
                ruleTriggered: "amount_above_auto_approve_ceiling",
                explanation:
                  "Human approval is required before a recovery offer can be sent.",
              },
              execution: {
                attempted: false,
                success: false,
                error: null,
                result: {},
              },
            });
          }
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
