import mongoose from "mongoose";

// Immutable evidence for every AI-assisted commerce decision. No payment or
// price is changed by this model; it records what was suggested, gated, and
// confirmed so the merchant can inspect the entire decision trail.
const commerceAuditSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  eventType: {
    type: String,
    enum: ["recommendation_shown", "checkout_intent_created", "checkout_confirmed", "checkout_cancelled", "discount_requested", "payment_order_created", "payment_order_failed", "payment_verified"],
    required: true,
    index: true,
  },
  product: {
    id: { type: String, required: true },
    purchaseId: { type: String, required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    destination: { type: String, required: true },
  },
  reason: { type: String, default: "" },
  gate: {
    decision: { type: String, enum: ["approved", "blocked", "pending_confirmation", "pending_approval"], required: true },
    rule: { type: String, default: "" },
    explanation: { type: String, default: "" },
  },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

commerceAuditSchema.index({ createdAt: -1 });
export default mongoose.model("CommerceAudit", commerceAuditSchema);
