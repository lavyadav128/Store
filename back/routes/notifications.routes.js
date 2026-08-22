import express from "express";
import Notification from "../schema/notification.model.js";
import auth from "../controller/authh.js";

const router = express.Router();

// GET notifications for a specific user
router.get("/:username", auth, async (req, res) => {
  try {
    if (req.params.username !== req.user.username && req.user.username !== (process.env.ADMIN_USERNAME || "adminbrand@gmail.com")) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
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
