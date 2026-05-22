import express from "express";
import Notification from "../schema/notification.model.js";

const router = express.Router();

// GET notifications for a specific user
router.get("/:username", async (req, res) => {
  try {
    const notifications = await Notification.find({
      username: req.params.username
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error("Fetch notifications error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
});

export default router;
