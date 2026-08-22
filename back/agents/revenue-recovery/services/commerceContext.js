import Batch from "../../../schema/batches.model.js";
import NoteBatch from "../../../schema/Notebatch.model.js";
import Purchase from "../../../schema/purchase.model.js";

/**
 * Builds the commerce information that the chatbot
 * can safely use for recommendations.
 */
export async function getCommerceContext(userId = null) {
  // --------------------------------------------------
  // 1. Get all active products/batches
  // --------------------------------------------------

  const [batches, noteBatches] = await Promise.all([
    Batch.find({ isActive: true })
      .select("batchId title description price whatYouLearn folder redirectPath")
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean(),
    NoteBatch.find({ isActive: true })
      .select("slug title description price whatYouLearn order")
      .sort({ order: 1, createdAt: 1 })
      .lean(),
  ]);

  const products = [
    ...batches.map((batch) => ({
      id: `batch:${batch.batchId}`,
      purchaseId: batch.batchId,
      type: "batch",
      title: batch.title,
      description: batch.description,
      price: batch.price,
      category: batch.folder,
      whatYouLearn: batch.whatYouLearn || [],
      destination: batch.redirectPath || `/class/${batch.batchId}`,
    })),
    ...noteBatches.map((batch) => ({
      id: `note:${batch.slug}`,
      purchaseId: batch.slug,
      type: "note-batch",
      title: batch.title,
      description: batch.description,
      price: batch.price,
      category: "Notes",
      whatYouLearn: batch.whatYouLearn || [],
      destination: `/notes/${batch.slug}`,
    })),
  ];

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
  const ownedPurchaseIds = new Set(
    purchases.map((purchase) => purchase.classId)
  );

  // --------------------------------------------------
  // 3. Remove already purchased products
  // --------------------------------------------------

  const availableForRecommendation = products.filter(
    (product) => !ownedPurchaseIds.has(product.purchaseId)
  );

  // --------------------------------------------------
  // 4. Return clean AI-friendly data
  // --------------------------------------------------

  return {
    availableProducts: availableForRecommendation,

    ownedProducts: purchases.map((purchase) => ({
      id: purchase.classId,
      title: purchase.title,
      price: purchase.price,
      expiryDate: purchase.expiryDate,
    })),
  };
}
