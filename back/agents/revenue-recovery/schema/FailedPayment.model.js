// FailedPayment.model.js
// ─────────────────────────────────────────────────────────────
// This represents ONE "revenue at risk" event — the trigger signal
// the agent reacts to. Despite the name "FailedPayment", it covers
// every example direction from the brief:
//   - payment_failure        (a Razorpay payment.failed webhook)
//   - checkout_dropoff       (order created, never paid)
//   - subscription_failure   (recurring/autopay debit failed)
//   - overdue_receivable     (a B2B invoice past its due date)
//   - mandate_failure        (UPI Autopay mandate retry needed)
// One shared model keeps the agent's reasoning/action pipeline
// identical across every "direction" — only the source differs.
// ─────────────────────────────────────────────────────────────

import mongoose from 'mongoose';

const failedPaymentSchema = new mongoose.Schema({
  // Which "example direction" this signal belongs to
  source: {
    type: String,
    enum: [
      'payment_failure',
      'checkout_dropoff',
      'subscription_failure',
      'overdue_receivable',
      'mandate_failure',
    ],
    required: true,
  },

  // Optional link to a real user in the platform (if known)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },

  // Razorpay identifiers — populated for real test-mode events,
  // left blank for seeded/synthetic overdue-receivable style signals
  razorpayOrderId: { type: String, default: null },
  razorpayPaymentId: { type: String, default: null },

  amount: { type: Number, required: true }, // in paise, like Razorpay itself
  currency: { type: String, default: 'INR' },

  customerName: { type: String, default: '' },
  customerEmail: { type: String, default: '' },
  customerPhone: { type: String, default: '' }, // used for WhatsApp nudges

  // Raw failure/decline reason — either from Razorpay's error payload
  // (e.g. "insufficient_funds", "card_expired") or synthetic for demo data
  failureReason: { type: String, default: 'unknown' },

  // Lifecycle status — the agent moves a signal through these states.
  // This alone is a big part of the audit story: you can always see
  // "where is this piece of at-risk revenue right now?"
  status: {
    type: String,
    enum: ['open', 'recovering', 'recovered', 'lost', 'escalated'],
    default: 'open',
  },

  attempts: { type: Number, default: 0 },

  // For promise-to-pay tracker direction
  promiseToPay: {
    promised: { type: Boolean, default: false },
    promisedDate: { type: Date, default: null },
    fulfilled: { type: Boolean, default: false },
  },

  // Raw payload as received (webhook body / seed generator) — kept for
  // traceability, never used directly in decisions (decisions go through
  // the reasoning + gate layer, logged separately in AgentAction)
  rawPayload: { type: mongoose.Schema.Types.Mixed, default: {} },

}, { timestamps: true });

failedPaymentSchema.index({ status: 1, createdAt: -1 });
failedPaymentSchema.index({ source: 1, status: 1 });
failedPaymentSchema.index({ razorpayPaymentId: 1 }, { sparse: true });

export default mongoose.model('FailedPayment', failedPaymentSchema);