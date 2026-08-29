import express from "express";
import auth from "../../auth/authh.js";
import requireAdmin from "../../../shared/middleware/requireAdmin.js";
import { User } from "../../auth/schema/user.model.js";
import { Message } from "../../doubts/schema/message.model.js";
import Notification from "../../notifications/schema/notification.model.js";

const router = express.Router();

/* ---------------- ADMIN AUTH ---------------- */
const adminAuth = [auth, requireAdmin];

/* ---------------- GET ALL USERNAMES ---------------- */
router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find(
      { username: { $ne: "adminbrand@gmail.com" } }, // exclude admin
      { username: 1, _id: 0 }
    );

    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

/* ---------------- SEND MESSAGE ---------------- */
router.post("/send-message", adminAuth, async (req, res) => {
  const { text, toUsername } = req.body;

  if (!text) return res.status(400).json({ message: "Message required" });

  try {
    // Save message to Message collection
    const message = new Message({
      text,
      from: "adminbrand@gmail.com",
      to: toUsername || null,
    });

    await message.save();

    // 🔔 Create notification(s) for user(s)
    if (toUsername) {
      // Single user
      await Notification.create({
        username: toUsername,
        type: "ADMIN_MESSAGE",
        text,
        isRead: false,
      });
    } else {
      // All users
      const users = await User.find({ username: { $ne: "adminbrand@gmail.com" } }, "username");
      const notifications = users.map((u) => ({
        username: u.username,
        type: "ADMIN_MESSAGE",
        text,
        isRead: false,
      }));
      await Notification.insertMany(notifications);
    }

    res.status(200).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("Failed to send admin message:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

export default router;
