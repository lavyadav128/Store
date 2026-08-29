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
  
  batchId: {
    type: String,
    default: null,
  },
  
  batchTitle: {
    type: String,
    default: null,
  },
  
  paymentAttemptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PaymentAttempt",
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

  // Communication preferences & multi-channel metadata
  language: {
    type: String,
    enum: ['en', 'hinglish'],
    default: 'hinglish',
  },

  voiceScript: {
    type: String,
    default: null,
  },

  // B2B Receivables / Overdue Invoice fields
  invoiceDetails: {
    invoiceNumber: { type: String, default: null },
    companyName: { type: String, default: null },
    dueDate: { type: Date, default: null },
    daysOverdue: { type: Number, default: 0 },
    paymentTerms: { type: String, default: 'Net 15' },
    contactDesignation: { type: String, default: 'Finance Manager' },
  },

  // Mandate Retry Sequencer fields (UPI Autopay / e-NACH)
  mandateDetails: {
    mandateId: { type: String, default: null },
    mandateType: { type: String, enum: ['upi_autopay', 'e_mandate', 'nach', null], default: 'upi_autopay' },
    optimalRetryWindow: { type: String, default: '08:30 AM - 10:30 AM IST (Banking Opening Window)' },
    salaryCycleDay: { type: Number, default: 1 },
    nextScheduledRetry: { type: Date, default: null },
  },

  // For promise-to-pay tracker direction
  promiseToPay: {
    promised: { type: Boolean, default: false },
    promisedDate: { type: Date, default: null },
    fulfilled: { type: Boolean, default: false },
    note: { type: String, default: '' },
    recordedFrom: { type: String, enum: ['chatbot', 'whatsapp', 'admin_portal', 'voice', null], default: null },
  },

  // Scheduled execution timestamp for retry_later & mandate sequencer
  scheduledFor: { type: Date, default: null },

  // Precise financial recovery attribution
  recoveredAt: { type: Date, default: null },
  recoveredAmountPaise: { type: Number, default: 0 },
  recoveryDiscountPaise: { type: Number, default: 0 },
  recoveryChannel: { type: String, default: null },

  // Raw payload as received (webhook body / API payload)
  rawPayload: { type: mongoose.Schema.Types.Mixed, default: {} },

}, { timestamps: true });

failedPaymentSchema.index({ status: 1, createdAt: -1 });
failedPaymentSchema.index({ source: 1, status: 1 });
failedPaymentSchema.index({ razorpayPaymentId: 1 }, { sparse: true });

export default mongoose.model('FailedPayment', failedPaymentSchema);