import express from "express";
import auth from "../controller/authh.js";
import requireAdmin from "../middleware/requireAdmin.js";
import CommerceAudit from "../schema/CommerceAudit.model.js";
import { getCommerceContext } from "../agents/revenue-recovery/services/commerceContext.js";
import { getPolicy } from "../agents/revenue-recovery/services/policyService.js";

const router = express.Router();

function productSnapshot(product) {
  return { id: product.id, purchaseId: product.purchaseId, type: product.type, title: product.title, price: product.price, destination: product.destination };
}

async function findAvailableProduct(userId, productId) {
  const catalog = await getCommerceContext(userId);
  return catalog.availableProducts.find((product) => product.id === productId);
}

// The AI may propose a checkout, but it cannot open a payment flow itself.
// This creates a pending intent; a visible student confirmation is required.
router.post("/checkout-intents", auth, async (req, res) => {
  try {
    const product = await findAvailableProduct(req.user._id, req.body.productId);
    if (!product) return res.status(404).json({ error: "This product is unavailable or already owned." });
    const audit = await CommerceAudit.create({
      userId: req.user._id,
      eventType: "checkout_intent_created",
      product: productSnapshot(product),
      reason: req.body.reason || "Student selected an AI recommendation.",
      gate: { decision: "pending_confirmation", rule: "student_confirmation_required", explanation: "The student must explicitly confirm before entering the existing checkout flow." },
    });
    res.status(201).json({ intentId: audit._id, product: audit.product, gate: audit.gate });
  } catch (error) { res.status(500).json({ error: "Unable to create checkout intent" }); }
});

router.post("/checkout-intents/:id/confirm", auth, async (req, res) => {
  const audit = await CommerceAudit.findOne({ _id: req.params.id, userId: req.user._id, eventType: "checkout_intent_created" });
  if (!audit) return res.status(404).json({ error: "Checkout intent not found" });
  const freshProduct = await findAvailableProduct(req.user._id, audit.product.id);
  if (!freshProduct) return res.status(409).json({ error: "This batch is no longer available." });
  if (freshProduct.price !== audit.product.price) return res.status(409).json({ error: "The price changed. Please review the updated batch before checkout." });
  await CommerceAudit.create({ userId: req.user._id, eventType: "checkout_confirmed", product: productSnapshot(freshProduct), reason: audit.reason, gate: { decision: "approved", rule: "student_confirmed", explanation: "Student explicitly confirmed the live price and requested checkout." }, metadata: { intentId: audit._id } });
  res.json({ product: productSnapshot(freshProduct), destination: freshProduct.destination });
});

router.post("/checkout-intents/:id/cancel", auth, async (req, res) => {
  const audit = await CommerceAudit.findOne({ _id: req.params.id, userId: req.user._id, eventType: "checkout_intent_created" });
  if (!audit) return res.status(404).json({ error: "Checkout intent not found" });
  await CommerceAudit.create({ userId: req.user._id, eventType: "checkout_cancelled", product: audit.product, reason: audit.reason, gate: { decision: "blocked", rule: "student_cancelled", explanation: "Student cancelled before entering the payment flow." }, metadata: { intentId: audit._id } });
  res.json({ success: true });
});

// AI cannot alter a price. A discount request is only logged and either routed
// for human approval or blocked by the merchant's hard policy cap.
router.post("/discount-requests", auth, async (req, res) => {
  const product = await findAvailableProduct(req.user._id, req.body.productId);
  if (!product) return res.status(404).json({ error: "This product is unavailable or already owned." });
  const requestedPercent = Number(req.body.discountPercent);
  const policy = await getPolicy();
  const isValid = Number.isFinite(requestedPercent) && requestedPercent > 0 && requestedPercent <= policy.maxDiscountPercent;
  const gate = isValid
    ? { decision: "pending_approval", rule: "human_discount_approval_required", explanation: `A ${requestedPercent}% request is within the ${policy.maxDiscountPercent}% cap, but no price changes automatically.` }
    : { decision: "blocked", rule: "discount_policy_cap", explanation: `Discount requests must be above 0% and at most ${policy.maxDiscountPercent}%. No price was changed.` };
  const audit = await CommerceAudit.create({ userId: req.user._id, eventType: "discount_requested", product: productSnapshot(product), reason: "Student requested a discount through the AI commerce assistant.", gate, metadata: { requestedPercent } });
  res.status(isValid ? 202 : 400).json({ auditId: audit._id, gate });
});

router.get("/audit", auth, requireAdmin, async (req, res) => {
  const audits = await CommerceAudit.find().sort({ createdAt: -1 }).limit(200).lean();
  res.json(audits);
});

export { CommerceAudit };
export default router;
