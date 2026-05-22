import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../schema/user.model.js";
import { Message } from "../schema/message.model.js";
import Notification from "../schema/notification.model.js";

const router = express.Router();

/* ---------------- ADMIN AUTH ---------------- */
const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 👇 ONLY adminbrand allowed
    if (decoded.username !== "adminbrand") {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* ---------------- GET ALL USERNAMES ---------------- */
router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find(
      { username: { $ne: "adminbrand" } }, // exclude admin
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
      from: "adminbrand",
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
      const users = await User.find({ username: { $ne: "adminbrand" } }, "username");
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
