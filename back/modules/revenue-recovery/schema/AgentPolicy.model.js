// AgentPolicy.model.js
// ─────────────────────────────────────────────────────────────
// The BOUNDS. Singleton document. The LLM never sees or edits this.
// gateService.js reads it on every decision and hard-enforces it.
// This separation (LLM proposes → code enforces) IS the
// "bounded and gated" story.
// ─────────────────────────────────────────────────────────────

import mongoose from 'mongoose';

const agentPolicySchema = new mongoose.Schema({
  key: { type: String, default: 'default', unique: true },

  maxRetries: { type: Number, default: 3 },
  retryCooldownMinutes: { type: Number, default: 30 },

  maxDiscountPercent: { type: Number, default: 10 },

  autoApproveMaxAmount: { type: Number, default: 500000 }, // ₹5,000 in paise

  allowedActions: {
    type: [String],
    default: [
      'retry_now',
      'retry_later',
      'nudge_customer',
      'offer_discount',
      'schedule_mandate',
      'chase_invoice',
      'escalate_human',
      'give_up',
    ],
  },

  maxConsecutiveFailuresBeforeEscalation: { type: Number, default: 2 },

}, { timestamps: true });

export default mongoose.model('AgentPolicy', agentPolicySchema);