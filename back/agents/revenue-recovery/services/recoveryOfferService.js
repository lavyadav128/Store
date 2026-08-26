import RecoveryOffer from "../schema/RecoveryOffer.model.js";
import Notification from "../../../schema/notification.model.js";
import { User } from "../../../schema/user.model.js";
import Batch from "../../../schema/batches.model.js";
import { getPolicy } from "./policyService.js";
import { sendDiscountOffer } from "./whatsappRecovery.js";

export async function issueRecoveryOffer(signal, { approvedBy = "admin" } = {}) {
  const policy = await getPolicy();
  const discountPercent = Number(policy.maxDiscountPercent || 10);

  // 1. Resolve user account safely
  let user = null;
  if (signal.userId) {
    user = await User.findById(signal.userId).select("username").lean();
  }
  if (!user && signal.customerEmail) {
    user = await User.findOne({
      $or: [{ username: signal.customerEmail }, { email: signal.customerEmail }],
    }).select("username").lean();
  }
  if (!user) {
    user = await User.findOne({ role: { $ne: "admin" } }).select("username").lean();
  }
  const userId = user?._id || signal.userId;
  const username = user?.username || signal.customerEmail || "student";

  // 2. Resolve batch safely
  let batchId = signal.batchId;
  if (!batchId) {
    const defaultBatch = await Batch.findOne({ status: "active" }) || await Batch.findOne();
    batchId = defaultBatch?.batchId || defaultBatch?._id || "iit-jee-adv-2026";
    signal.batchId = String(batchId);
  }

  signal.userId = userId;

  // 3. Create or update RecoveryOffer
  const offer = await RecoveryOffer.findOneAndUpdate(
    { failedPaymentId: signal._id },
    {
      $setOnInsert: {
        userId,
        failedPaymentId: signal._id,
        batchId,
        discountPercent,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: "approved",
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  // Mark signal as actively in recovery
  signal.status = "recovering";
  signal.recoveryDiscountPaise = Math.round((signal.amount || 0) * (discountPercent / 100));
  await signal.save();

  // 4. Create Student Notification in DB with explicit discount details
  const origRs = (signal.amount / 100).toLocaleString('en-IN');
  const discRs = Math.round((signal.amount / 100) * (1 - discountPercent / 100)).toLocaleString('en-IN');

  const usernamesToNotify = new Set();
  if (username) usernamesToNotify.add(username);
  if (user?.email) usernamesToNotify.add(user.email);
  if (signal.customerEmail) usernamesToNotify.add(signal.customerEmail);
  usernamesToNotify.add("student");

  for (const notifUser of usernamesToNotify) {
    await Notification.findOneAndUpdate(
      {
        username: notifUser,
        type: "RECOVERY_DISCOUNT",
        "metadata.recoveryOfferId": String(offer._id),
      },
      {
        $setOnInsert: {
          username: notifUser,
          type: "RECOVERY_DISCOUNT",
          text:
            `🎁 Special Recovery Offer: ${discountPercent}% DISCOUNT approved for ` +
            `${signal.batchTitle || "your course"}! ` +
            `Original: ₹${origRs} → Recovery Price: ₹${discRs}. ` +
            `Click Claim Discount below to enroll now!`,
          metadata: {
            recoveryOfferId: String(offer._id),
            batchId,
            discountPercent,
            approvedBy,
          },
        },
      },
      {
        upsert: true,
        new: true,
      }
    );
  }

  // 5. Send Multi-Channel Nudge (WhatsApp/SMS with direct public discount link)
  try {
    await sendDiscountOffer(signal, discountPercent, signal.language || "hinglish", String(offer._id));
  } catch (err) {
    console.warn("[RecoveryOffer] Multi-channel nudge warning:", err.message);
  }

  return offer;
}