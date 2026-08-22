import express from "express";
import optionalAuth from "../middleware/optionalAuth.js";
import { getRecommendations } from "../agents/revenue-recovery/services/recommendationService.js";
import CommerceAudit from "../schema/CommerceAudit.model.js";

const router = express.Router();

router.post("/", optionalAuth, async (req, res) => {
  try {
    const {
      query = "",
      currentBatchId = null,
    } = req.body;

    // Class-aware recommendation service returns:
    // { recommendations: [], noMatchMessage: "", requestedClass: "" }
    const result = await getRecommendations({
      userId: req.user?._id || null,
      query,
      currentBatchId,
      limit: 3,
    });

    const recommendations = Array.isArray(result)
      ? result
      : result.recommendations || [];

    const noMatchMessage = Array.isArray(result)
      ? ""
      : result.noMatchMessage || "";

    // Save an audit entry only for recommendations that actually exist.
    if (req.user?._id && recommendations.length > 0) {
      await Promise.all(
        recommendations.map(({ product, reasons }) =>
          CommerceAudit.create({
            userId: req.user._id,
            eventType: "recommendation_shown",
            product: {
              id: product.id,
              purchaseId: product.purchaseId,
              type: product.type,
              title: product.title,
              price: product.price,
              destination: product.destination,
            },
            reason: reasons.join(" "),
            gate: {
              decision: "approved",
              rule: "live_catalog_only",
              explanation:
                "Recommendation came from the active live catalog and excludes owned products.",
            },
            metadata: {
              query,
              currentBatchId,
            },
          })
        )
      );
    }

    return res.json({
      success: true,
      recommendations,
      noMatchMessage,
    });
  } catch (error) {
    console.error("Recommendation error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to generate recommendations",
    });
  }
});

export default router;