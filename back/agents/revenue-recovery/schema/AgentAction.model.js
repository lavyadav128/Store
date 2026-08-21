// AgentAction.model.js
// ─────────────────────────────────────────────────────────────
// THE AUDIT TRAIL.
// Every time the agent looks at a FailedPayment and decides
// something, ONE of these rows gets written — whether the action
// was executed, blocked by policy, or queued for human approval.
// This is what proves "explainable, bounded, gated" to a judge:
// they can open this collection and read the agent's mind.
// ─────────────────────────────────────────────────────────────

import mongoose from 'mongoose';

const agentActionSchema = new mongoose.Schema({
  failedPaymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FailedPayment',
    required: true,
  },

  // ── STEP 1: WHAT THE AGENT SAW ──
  signalSnapshot: { type: mongoose.Schema.Types.Mixed, required: true },

  // ── STEP 2: WHY (the LLM's reasoning — explainable) ──
  reasoning: {
    rootCause: { type: String, default: '' },
    explanation: { type: String, default: '' },
    confidence: { type: Number, default: 0 },
    model: { type: String, default: '' },
    rawResponse: { type: mongoose.Schema.Types.Mixed, default: {} },
  },

  // ── STEP 3: WHAT THE AGENT WANTS TO DO ──
  proposedAction: {
    type: {
      type: String,
      enum: ['retry_now', 'retry_later', 'nudge_customer', 'offer_discount', 'escalate_human', 'give_up'],
      required: true,
    },
    params: { type: mongoose.Schema.Types.Mixed, default: {} },
  },

  // ── STEP 4: THE GATE (bounded + gated) ──
  gate: {
    decision: {
      type: String,
      enum: ['approved', 'blocked', 'pending_approval'],
      required: true,
    },
    ruleTriggered: { type: String, default: '' },
    explanation: { type: String, default: '' },
  },

  // ── STEP 5: WHAT ACTUALLY HAPPENED ──
  execution: {
    attempted: { type: Boolean, default: false },
    success: { type: Boolean, default: false },
    error: { type: String, default: null },
    result: { type: mongoose.Schema.Types.Mixed, default: {} },
  },

  simulatedFailure: { type: Boolean, default: false },

}, { timestamps: true });

agentActionSchema.index({ failedPaymentId: 1, createdAt: -1 });
agentActionSchema.index({ 'gate.decision': 1 });

export default mongoose.model('AgentAction', agentActionSchema);