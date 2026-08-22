import { User } from "../schema/user.model.js";
import Purchase from "../schema/purchase.model.js";
import PaymentAttempt from "../agents/revenue-recovery/schema/PaymentAttempt.model.js";
import FailedPayment from "../agents/revenue-recovery/schema/FailedPayment.model.js";
import { getCommerceContext } from "../agents/revenue-recovery/services/commerceContext.js";
import RecoveryOffer from "../agents/revenue-recovery/schema/RecoveryOffer.model.js";

const INTEREST_PATTERNS = [
  ["Class 10", /class\s*10|tenth|10th/i],
  ["Class 11", /class\s*11|eleventh|11th/i],
  ["PCM", /\bpcm\b|physics.*chemistry.*math/i],
  ["PCB", /\bpcb\b|physics.*chemistry.*biology/i],
  ["IIT JEE", /\bjee\b|iit/i],
  ["NEET", /\bneet\b|medical entrance/i],
  ["DSA", /\bdsa\b|data structures|algorithms|coding interview/i],
  ["Web Development", /web development|frontend|backend|full ?stack/i],
];

export function extractInterests(text = "") {
  return INTEREST_PATTERNS.filter(([, pattern]) => pattern.test(text)).map(([label]) => label);
}

export async function recordStudentInterests(userId, text) {
  if (!userId) return;
  const interests = extractInterests(text);
  if (interests.length) await User.findByIdAndUpdate(userId, { $addToSet: { chatInterests: { $each: interests } } });
}

function recoveryExplanation(signal) {
  if (signal.status === "escalated") return "Waiting for an admin to approve the recovery action. No automated charge, refund, or enrolment has been made.";
  if (signal.status === "recovering") return "An approved recovery workflow is in progress. The next permitted action is recorded in its audit trail.";
  if (signal.status === "recovered") return "The recovery workflow is marked recovered. This does not by itself prove a new course purchase or a refund; payment/access records remain the source of truth.";
  if (signal.status === "lost") return "The recovery case was closed without recovery. The learner can start a new checkout if the batch remains available.";
  return "The case is open and awaiting the bounded recovery agent's next evaluation.";
}

// Rebuilt for every message, so the assistant has fresh personal data without
// training on private records or exposing data from another account.
export async function getStudentAssistantContext(userId) {
  if (!userId) return { authenticated: false };
  const [user, commerce, attempts, signals, offers] = await Promise.all([
    User.findById(userId).select("name username chatOnboardingGoal chatInterests").lean(),
    getCommerceContext(userId),
    PaymentAttempt.find({ userId }).sort({ createdAt: -1 }).limit(12)
      .select("batchId batchTitle amount currency status failureReason razorpayOrderId createdAt updatedAt").lean(),
    FailedPayment.find({ userId }).sort({ updatedAt: -1 }).limit(12)
      .select("batchId batchTitle amount currency source failureReason status attempts razorpayOrderId createdAt updatedAt").lean(),
    RecoveryOffer.find({ userId, status: { $in: ['approved', 'order_created'] }, expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 }).lean(),
  ]);

  return {
    authenticated: true,
    learner: {
      name: user?.name || "",
      goal: user?.chatOnboardingGoal || "",
      interests: user?.chatInterests || [],
    },
    ownedProducts: commerce.ownedProducts,
    availableProducts: commerce.availableProducts,
    recentPaymentAttempts: attempts.map((attempt) => ({
      batchId: attempt.batchId, title: attempt.batchTitle, amount: attempt.amount,
      currency: attempt.currency, status: attempt.status, failureReason: attempt.failureReason || "",
      createdAt: attempt.createdAt, updatedAt: attempt.updatedAt,
    })),
    recoveryCases: signals.map((signal) => ({
      batchId: signal.batchId, title: signal.batchTitle, amount: signal.amount,
      currency: signal.currency, source: signal.source, status: signal.status,
      attempts: signal.attempts, failureReason: signal.failureReason,
      updatedAt: signal.updatedAt, explanation: recoveryExplanation(signal),
    })),
    activeRecoveryOffers: offers.map((offer) => ({ batchId: offer.batchId, discountPercent: offer.discountPercent, status: offer.status, expiresAt: offer.expiresAt })),
  };
}

export function buildPaymentStatusReply(message, personal) {
  if (!personal.authenticated || !/\b(payment|refund|failed|failure|charged|recovery|cancelled|canceled|discount|offer|approve|approval)\b/i.test(message)) return null;
  const latestCase = personal.recoveryCases?.[0];
  const latestAttempt = personal.recentPaymentAttempts?.[0];
  if (!latestCase && !latestAttempt) return "I cannot see a recent payment attempt on your account. If you just tried, refresh in a moment; otherwise start checkout again from the batch page.";

  if (latestCase) {
    const title = latestCase.title || "your batch";
    const amount = latestCase.amount ? `₹${latestCase.amount}` : "the attempted amount";
    const offer = personal.activeRecoveryOffers?.find((item) => item.batchId === latestCase.batchId);
    const offerText = offer ? ` An approved **${offer.discountPercent}% discount** is available until ${new Date(offer.expiresAt).toLocaleString()}. [Open Notifications to claim it](/dashboard?view=notifications).` : '';
    return `For **${title}** (${amount}), I can see a **${latestCase.source}** recovery case. Its current status is **${latestCase.status}**. ${latestCase.explanation} Failure reason: ${latestCase.failureReason || "not supplied by Razorpay"}.${offerText}`;
  }

  if (latestAttempt.status === "paid") return `Your latest payment for **${latestAttempt.title}** is marked **paid**. Your course access should be available; refresh the batch page if it has not appeared yet.`;
  if (latestAttempt.status === "created" || latestAttempt.status === "attempted") return `Your latest payment for **${latestAttempt.title}** is **${latestAttempt.status}**, which means checkout was started but has not been confirmed as paid. You can safely retry from the batch page.`;
  return `Your latest payment for **${latestAttempt.title}** is marked **${latestAttempt.status}**. I will show its recovery status as soon as Razorpay sends the verified update.`;
}
