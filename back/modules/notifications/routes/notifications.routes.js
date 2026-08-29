import express from "express";
import Notification from "../schema/notification.model.js";
import auth from "../../auth/authh.js";

const router = express.Router();

// GET notifications for a specific user
router.get("/:username", auth, async (req, res) => {
  try {
    const userParam = req.params.username;
    const userEmail = req.user?.email || req.user?.username;

    const queryUsernames = Array.from(new Set([userParam, userEmail, req.user?.username].filter(Boolean)));
    const notifications = await Notification.find({
      username: { $in: queryUsernames }
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error("Fetch notifications error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
});

export default router;
