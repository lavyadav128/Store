import express from "express";

import optionalAuth from "../middleware/optionalAuth.js";

import {
  getRecommendations
} from "../agents/revenue-recovery/services/recommendationService.js";


const router = express.Router();


router.post(
  "/",

  optionalAuth,

  async (req, res) => {

    try {

      const {
        query = "",
        currentBatchId = null
      } = req.body;


      const recommendations =
        await getRecommendations({

          userId:
            req.user?._id || null,

          query,

          currentBatchId,

          limit: 3

        });


      return res.json({

        success: true,

        recommendations

      });


    } catch (error) {

      console.error(
        "Recommendation error:",
        error
      );


      return res.status(500).json({

        success: false,

        error:
          "Failed to generate recommendations"

      });

    }

  }
);


export default router;
