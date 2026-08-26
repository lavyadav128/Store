import express from "express";
import Notification from "../schema/notification.model.js";
import auth from "../controller/authh.js";

const router = express.Router();

// GET notifications for a specific user
router.get("/:username", auth, async (req, res) => {
  try {
    const userParam = req.params.username;
    const userEmail = req.user?.email || req.user?.username;

    const notifications = await Notification.find({
      $or: [
        { username: userParam },
        { username: userEmail },
        { username: "student" },
      ],
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error("Fetch notifications error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
});

export default router;
