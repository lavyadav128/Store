import RecoveryOffer from "../schema/RecoveryOffer.model.js";
import Notification from "../../../schema/notification.model.js";
import { User } from "../../../schema/user.model.js";
import { getPolicy } from "./policyService.js";

export async function issueRecoveryOffer(signal, { approvedBy = "admin" } = {}) {
  if (
    signal.source !== "payment_failure" ||
    !signal.userId ||
    !signal.batchId
  ) {
    throw new Error(
      "A linked student payment-failure signal is required to create a recovery offer."
    );
  }

  const policy = await getPolicy();
  const discountPercent = Number(policy.maxDiscountPercent || 10);

  const user = await User.findById(signal.userId)
    .select("username")
    .lean();

  if (!user) {
    throw new Error("Student account not found.");
  }

  const offer = await RecoveryOffer.findOneAndUpdate(
    { failedPaymentId: signal._id },
    {
      $setOnInsert: {
        userId: signal.userId,
        failedPaymentId: signal._id,
        batchId: signal.batchId,
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

  // An approved offer means the case is actively being recovered.
  if (offer.status === "approved" || offer.status === "order_created") {
    signal.status = "recovering";
    await signal.save();
  }

  await Notification.findOneAndUpdate(
    {
      username: user.username,
      type: "RECOVERY_DISCOUNT",
      "metadata.recoveryOfferId": String(offer._id),
    },
    {
      $setOnInsert: {
        username: user.username,
        type: "RECOVERY_DISCOUNT",
        text:
          `Your ${discountPercent}% recovery discount has been approved for ` +
          `${signal.batchTitle || "your batch"}. ` +
          `Open Notifications to claim your one-time retry offer within 24 hours.`,
        metadata: {
          recoveryOfferId: String(offer._id),
          batchId: signal.batchId,
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

  return offer;
}