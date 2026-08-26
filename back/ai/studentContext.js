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

function parsePromiseDate(text = "") {
  const t = text.toLowerCase();
  const now = new Date();

  if (/today|aaj/i.test(t)) {
    return new Date(now.getTime() + 6 * 3600000);
  }
  if (/tomorrow|kal/i.test(t)) {
    return new Date(now.getTime() + 24 * 3600000);
  }
  if (/day after tomorrow|parson|parso/i.test(t)) {
    return new Date(now.getTime() + 48 * 3600000);
  }
  if (/next week|agle hafte/i.test(t)) {
    return new Date(now.getTime() + 7 * 86400000);
  }
  if (/friday|shukrawar/i.test(t)) {
    const d = new Date();
    d.setDate(d.getDate() + ((5 + 7 - d.getDay()) % 7 || 7));
    return d;
  }
  if (/monday|somwar/i.test(t)) {
    const d = new Date();
    d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7 || 7));
    return d;
  }
  if (/month end|mahine ke end|30th|31st/i.test(t)) {
    const d = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return d;
  }

  // Check for specific day numbers like "28th", "29 aug", "1st"
  const dayMatch = t.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s*(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?\b/i);
  if (dayMatch) {
    const day = parseInt(dayMatch[1], 10);
    if (day >= 1 && day <= 31) {
      const d = new Date();
      d.setDate(day);
      if (d < now) d.setMonth(d.getMonth() + 1);
      return d;
    }
  }

  // Default fallback: 3 days from now
  return new Date(now.getTime() + 3 * 86400000);
}

export async function handlePromiseToPayInChat(userId, message) {
  if (!userId) return null;
  const isPromise = /\b(pay (later|tomorrow|on|next|by|after)|kal (pay|dunga|karunga)|main.*pay karunga|will pay|promise.*pay|paise.*dunga)\b/i.test(message);
  if (!isPromise) return null;

  const latestSignal = await FailedPayment.findOne({ userId, status: { $in: ['open', 'recovering', 'escalated'] } }).sort({ updatedAt: -1 });
  if (!latestSignal) return null;

  const promisedDate = parsePromiseDate(message);
  latestSignal.promiseToPay = {
    promised: true,
    promisedDate,
    fulfilled: false,
    note: `Committed via AI Chatbot: "${message.slice(0, 100)}"`,
    recordedFrom: 'chatbot',
  };
  await latestSignal.save();

  const formattedDate = promisedDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
  const amountStr = latestSignal.amount ? `₹${Math.round(latestSignal.amount / 100).toLocaleString('en-IN')}` : 'your batch fee';

  return `### 🤝 Payment Commitment Confirmed & Snoozed!

Thank you for confirming! I have **registered your promise-to-pay** in our system:

| Parameter | Commitment Details |
| :--- | :--- |
| **Course / Batch** | **${latestSignal.batchTitle || 'Selected Course'}** |
| **Pending Amount** | **${amountStr}** |
| **Promised Payment Date** | 🗓️ **${formattedDate}** |
| **Automated Alerts** | 🔕 **Snoozed until ${formattedDate}** |
| **Seat Status** | 🔒 **Temporarily Reserved for You** |

💡 **What happens next?**
- Your batch seat will remain on hold for you until **${formattedDate}**.
- We have paused automated reminders so you won't be disturbed.
- When you're ready to complete the payment, you can simply revisit the course page or use any instant UPI app.

Would you like me to share study materials or syllabus previews while your seat is reserved?`;
}

export function buildPaymentStatusReply(message, personal) {
  if (!personal.authenticated || !/\b(payment|refund|failed|failure|declined|not paid|transaction|recovery|discount|coupon|paisa|paise)\b/i.test(message)) {
    return null;
  }

  const latestFailure = personal.recentPaymentFailures?.[0];
  const latestAttempt = personal.recentPaymentAttempts?.[0];

  if (!latestFailure && !latestAttempt) {
    return `### 💳 Live Payment & Account Status

I checked your live transaction record and **did not find any failed or pending payments** on your account. All your transactions are in good standing!

💡 **Helpful Options:**
- If you recently started a checkout, please allow a few moments for the bank confirmation to sync.
- If you're looking for our course catalog or batch pricing, let me know which subject or exam you are targeting!

Would you like help exploring our active batches?`;
  }

  if (latestFailure) {
    const title = latestFailure.title || "your selected batch";
    const amount = latestFailure.amountInRupees ? `₹${latestFailure.amountInRupees.toLocaleString('en-IN')}` : "the course fee";
    const offer = personal.activeRecoveryOffers?.find((o) => o.batchId === latestFailure.batchId);
    const offerSection = offer
      ? `\n\n### 🎁 Special Recovery Offer Activated!\n- **Discount:** **${offer.discountPercent}% OFF** has been credited to your account.\n- **Claim & Enroll:** [👉 Open Notifications to Redeem](/dashboard?view=notifications)`
      : "";

    return `### 🔍 Live Payment Diagnostic Summary

Here is the exact real-time diagnostic report for your recent transaction:

| Parameter | Details |
| :--- | :--- |
| **Course / Batch** | **${title}** |
| **Attempted Amount** | **${amount}** |
| **Payment Gateway Status** | 🔴 **Declined / Interrupted** |
| **Primary Root Cause** | ${latestFailure.failureReason} |
| **System Diagnosis** | ${latestFailure.explanation} |

### 🛠️ Recommended Action Steps
1. **Try Instant UPI (Recommended):** If card OTP timed out, pay via **Google Pay / PhonePe / Paytm UPI** for zero-friction confirmation.
2. **Safe 1-Click Re-attempt:** You can safely restart checkout with 256-bit Razorpay bank security.${offerSection}

💡 **Need to Pay Later?** Just reply *"I will pay tomorrow"* or *"I will pay on Friday"*, and I will reserve your seat and pause reminders!

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

