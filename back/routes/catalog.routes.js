import express from "express";
import optionalAuth from "../middleware/optionalAuth.js";
import { getCommerceContext } from "../agents/revenue-recovery/services/commerceContext.js";

const router = express.Router();

// Single customer-safe, live source of truth for the Study Copilot's catalog.
router.get("/ai", optionalAuth, async (req, res) => {
  try {
    const catalog = await getCommerceContext(req.user?._id || null);
    res.set("Cache-Control", "no-store");
    res.json({
      generatedAt: new Date().toISOString(),
      currency: "INR",
      products: catalog.availableProducts,
      ownedProducts: catalog.ownedProducts,
    });
  } catch (error) {
    console.error("Unable to build AI catalog:", error);
    res.status(500).json({ error: "Unable to load the live course catalog" });
  }
});

export default router;
