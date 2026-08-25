import { User } from "../schema/user.model.js";
import Purchase from "../schema/purchase.model.js";
import PaymentAttempt from "../agents/revenue-recovery/schema/PaymentAttempt.model.js";
import FailedPayment from "../agents/revenue-recovery/schema/FailedPayment.model.js";
import { getCommerceContext } from "../agents/revenue-recovery/services/commerceContext.js";
import RecoveryOffer from "../agents/revenue-recovery/schema/RecoveryOffer.model.js";

const INTEREST_PATTERNS = [
  ["Class 9", /class\s*9|ninth|9th/i],
  ["Class 10", /class\s*10|tenth|10th/i],
  ["Class 11", /class\s*11|eleventh|11th/i],
  ["Class 12", /class\s*12|twelfth|12th/i],
  ["PCM", /\bpcm\b|physics.*chemistry.*math/i],
  ["PCB", /\bpcb\b|physics.*chemistry.*biology/i],
  ["IIT JEE", /\bjee\b|iit|jee main|jee advanced/i],
  ["NEET", /\bneet\b|medical entrance|aiims/i],
  ["DSA & Coding", /\bdsa\b|data structures|algorithms|coding|python|javascript|cpp|c\+\+/i],
  ["Web Development", /web development|frontend|backend|full ?stack|react|node/i],
  ["CBSE Boards", /cbse|board exam|ncert/i],
];

export function extractInterests(text = "") {
  return INTEREST_PATTERNS.filter(([, pattern]) => pattern.test(text)).map(([label]) => label);
}

export async function recordStudentInterests(userId, text) {
  if (!userId) return;
  const interests = extractInterests(text);
  if (interests.length) await User.findByIdAndUpdate(userId, { $addToSet: { chatInterests: { $each: interests } } });
}

function formatFailureReason(reason = "") {
  const r = String(reason).toLowerCase();
  if (/insufficient|balance|low_funds/i.test(r)) return "Declined by bank due to insufficient account balance.";
  if (/expired|card/i.test(r)) return "Card validity expired or incorrect card details were entered.";
  if (/otp|timeout|auth|declined_by_bank/i.test(r)) return "3D Secure OTP verification timed out or was declined by the issuing bank.";
  if (/cancelled|drop|closed|dismissed/i.test(r)) return "Checkout was cancelled or closed before completing payment.";
  return reason || "Transaction was interrupted before completion.";
}

function recoveryExplanation(signal) {
  if (signal.status === "escalated") return "Waiting for an academic advisor/admin to approve a special resolution.";
  if (signal.status === "recovering") return "An automated recovery workflow with a retry link is active.";
  if (signal.status === "recovered") return "The payment issue was resolved and marked recovered.";
  if (signal.status === "lost") return "The checkout was closed. You can start a fresh checkout anytime from the batch page.";
  return "Payment attempt was recorded as failed. The system can provide a retry link or assistance.";
}

// Rebuilt on every chat message for real-time fresh personal and commerce data
export async function getStudentAssistantContext(userId) {
  if (!userId) {
    const commerce = await getCommerceContext(null);
    return {
      authenticated: false,
      learner: { name: "Guest Learner", goal: "Explore Courses", interests: [] },
      ownedProducts: [],
      availableProducts: commerce.availableProducts,
      recentPaymentAttempts: [],
      recentPaymentFailures: [],
      recoveryCases: [],
      activeRecoveryOffers: [],
    };
  }

  const user = await User.findById(userId).select("name username phone chatOnboardingGoal chatInterests role purchasedBatches").lean();

  const [commerce, attempts, signals, offers] = await Promise.all([
    getCommerceContext(userId),
    PaymentAttempt.find({
      $or: [
        { userId },
        ...(user?.username ? [{ customerEmail: user.username }] : []),
        ...(user?.phone ? [{ customerPhone: user.phone }] : []),
      ],
    })
      .sort({ createdAt: -1 })
      .limit(8)
      .select("batchId batchTitle amount currency status failureReason razorpayOrderId createdAt updatedAt")
      .lean(),
    FailedPayment.find({
      $or: [
        { userId },
        ...(user?.username ? [{ customerEmail: user.username }] : []),
        ...(user?.phone ? [{ customerPhone: user.phone }] : []),
      ],
    })
      .sort({ updatedAt: -1 })
      .limit(8)
      .select("batchId batchTitle amount currency source failureReason status attempts razorpayOrderId createdAt updatedAt")
      .lean(),
    RecoveryOffer.find({ userId, status: { $in: ["approved", "order_created"] }, expiresAt: { $gt: new Date() } })
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  return {
    authenticated: true,
    learner: {
      id: String(user?._id || ""),
      name: user?.name || "Student",
      email: user?.username || "",
      phone: user?.phone || "",
      goal: user?.chatOnboardingGoal || "Excel in Studies & Competitive Exams",
      interests: user?.chatInterests || [],
    },
    ownedProducts: commerce.ownedProducts,
    availableProducts: commerce.availableProducts,
    recentPaymentAttempts: attempts.map((attempt) => ({
      batchId: attempt.batchId,
      title: attempt.batchTitle,
      amountInRupees: attempt.amount ? (attempt.amount > 1000 ? Math.round(attempt.amount / 100) : attempt.amount) : 0,
      status: attempt.status,
      failureReason: formatFailureReason(attempt.failureReason),
      date: attempt.createdAt ? new Date(attempt.createdAt).toLocaleString() : "",
    })),
    recentPaymentFailures: signals.map((signal) => ({
      batchId: signal.batchId,
      title: signal.batchTitle,
      amountInRupees: signal.amount ? Math.round(signal.amount / 100) : 0,
      failureReason: formatFailureReason(signal.failureReason),
      rawReason: signal.failureReason,
      status: signal.status,
      explanation: recoveryExplanation(signal),
      date: signal.updatedAt ? new Date(signal.updatedAt).toLocaleString() : "",
    })),
    activeRecoveryOffers: offers.map((offer) => ({
      batchId: offer.batchId,
      discountPercent: offer.discountPercent,
      expiresAt: offer.expiresAt,
    })),
  };
}

export function buildPaymentStatusReply(message, personal) {
  if (!personal.authenticated || !/\b(payment|refund|failed|failure|declined|not paid|transaction|recovery|discount|coupon)\b/i.test(message)) {
    return null;
  }

  const latestFailure = personal.recentPaymentFailures?.[0];
  const latestAttempt = personal.recentPaymentAttempts?.[0];

  if (!latestFailure && !latestAttempt) {
    return `### 💳 Payment & Account Status

I checked your live transaction history and **did not find any failed or pending payments** on your account. All your active purchases are working properly!

💡 **Next Steps:**
- If you just initiated a new checkout, please allow a few moments for the bank confirmation to sync.
- If you wish to enroll in a new batch, explore our active catalog anytime.

Would you like help choosing a course or checking access to an existing batch?`;
  }

  if (latestFailure) {
    const title = latestFailure.title || "your selected batch";
    const amount = latestFailure.amountInRupees ? `₹${latestFailure.amountInRupees}` : "the course fee";
    const offer = personal.activeRecoveryOffers?.find((o) => o.batchId === latestFailure.batchId);
    const offerSection = offer
      ? `\n\n### 🎁 Exclusive Recovery Offer Active!\n- **Discount:** **${offer.discountPercent}% OFF** has been credited to your account.\n- **Claim Link:** [Open Notifications & Claim](/dashboard?view=notifications)`
      : "";

    return `### 🔍 Live Payment Diagnostic Summary

Here is the exact real-time diagnostic report for your recent payment attempt:

| Parameter | Details |
| :--- | :--- |
| **Course / Batch** | **${title}** |
| **Amount Attempted** | **${amount}** |
| **Payment Status** | 🔴 **Failed / Declined** |
| **Primary Root Cause** | ${latestFailure.failureReason} |
| **System Diagnosis** | ${latestFailure.explanation} |

### 🛠️ Recommended Action Steps
1. **Try an Alternative Method:** If card OTP timed out, try paying via **UPI (Google Pay / PhonePe / Paytm)** or **NetBanking** for instant confirmation.
2. **Restart Checkout Safely:** You can safely re-attempt checkout directly from the batch page.${offerSection}

💡 **Pro Tip:** Your card details and payment gateway are 100% secure via Razorpay 256-bit SSL encryption.

Would you like me to guide you through retrying or help you choose the best payment method?`;
  }

  if (latestAttempt.status === "paid") {
    return `### ✅ Payment Confirmation

Good news! Your latest payment for **${latestAttempt.title}** (₹${latestAttempt.amountInRupees}) is confirmed as **PAID**.

- **Access Status:** Unlocked & Active
- **Lectures & Notes:** Ready to view on your dashboard

Would you like me to recommend a study roadmap for this batch?`;
  }

  return `### ⏳ Pending Checkout Status

Your recent transaction for **${latestAttempt.title}** is currently in **${latestAttempt.status}** state.

- If you were **not charged**, you can safely restart checkout from the batch page.
- If money was deducted, it will either settle within 15 minutes or automatically reverse to your bank within 3-5 business days.

Would you like further assistance with this transaction?`;
}
