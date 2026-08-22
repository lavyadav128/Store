import Batch from "../schema/batches.model.js";
import Purchase from "../schema/purchase.model.js";

/**
 * Builds the commerce information that the chatbot
 * can safely use for recommendations.
 */
export async function getCommerceContext(userId = null) {
  // --------------------------------------------------
  // 1. Get all active products/batches
  // --------------------------------------------------

  const batches = await Batch.find({
    isActive: true,
  })
    .select(
      "batchId title description price whatYouLearn folder redirectPath"
    )
    .sort({ sortOrder: 1, createdAt: 1 })
    .lean();

  // --------------------------------------------------
  // 2. Get user's existing purchases
  // --------------------------------------------------

  let purchases = [];

  if (userId) {
    purchases = await Purchase.find({
      userId,
      expiryDate: { $gt: new Date() },
    })
      .select("classId title price expiryDate")
      .lean();
  }

  // IDs of products already owned by the user
  const ownedBatchIds = new Set(
    purchases.map((purchase) => purchase.classId)
  );

  // --------------------------------------------------
  // 3. Remove already purchased products
  // --------------------------------------------------

  const availableForRecommendation = batches.filter(
    (batch) => !ownedBatchIds.has(batch.batchId)
  );

  // --------------------------------------------------
  // 4. Return clean AI-friendly data
  // --------------------------------------------------

  return {
    availableProducts: availableForRecommendation.map((batch) => ({
      id: batch.batchId,
      title: batch.title,
      description: batch.description,
      price: batch.price,
      category: batch.folder,
      whatYouLearn: batch.whatYouLearn || [],
    })),

    ownedProducts: purchases.map((purchase) => ({
      id: purchase.classId,
      title: purchase.title,
      price: purchase.price,
      expiryDate: purchase.expiryDate,
    })),
  };
}