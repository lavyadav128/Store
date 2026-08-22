import express from "express";

import auth from "../controller/authh.js";

import {
  getRecommendations
} from "../agents/revenue-recovery/services/recommendationService.js";


const router = express.Router();


router.post(
  "/",

  auth,

  async (req, res) => {

    try {

      const {
        query = "",
        currentBatchId = null
      } = req.body;


      const recommendations =
        await getRecommendations({

          userId:
            req.user._id,

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