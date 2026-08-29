
import express from "express";
import Doubt from "../schema/doubt.model.js";
import Notification from "../../notifications/schema/notification.model.js";
import { getIO } from "../../../shared/socket/io.js";
import auth from "../../auth/authh.js";
import requireAdmin from "../../../shared/middleware/requireAdmin.js";

const router = express.Router();

/* ----------------------------------------------------
   USER: SUBMIT DOUBT
---------------------------------------------------- */
router.post("/submit-doubt", auth, async (req, res) => {
  try {
    const { subject, message, contact } = req.body;
    const username = req.user?.username || req.body.username;

    if (!username || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const doubt = await Doubt.create({
      username,
      subject,
      message,
      contact: contact || "",
      replied: false,
    });

    try {
      const io = getIO();
      io.to("admins").emit("new-doubt", doubt);
      io.emit("new-doubt", doubt); // Broadcast fallback for active admin dashboards
    } catch (socketErr) {
      console.error("Socket emit failed (non-fatal):", socketErr.message);
    }

    return res.status(201).json({
      success: true,
      doubt,
    });
  } catch (err) {
    console.error("Submit doubt error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

/* ----------------------------------------------------
   USER: GET MY DOUBTS
---------------------------------------------------- */
router.get("/my-doubts", auth, async (req, res) => {
  try {
    const username = req.user?.username;
    if (!username) {
      return res.status(400).json({ success: false, message: "User not identified" });
    }
    const doubts = await Doubt.find({ username }).sort({ createdAt: -1 });
    return res.json({ success: true, doubts });
  } catch (err) {
    console.error("Fetch my doubts error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch doubts",
    });
  }
});

/* ----------------------------------------------------
   ADMIN: GET ALL DOUBTS
---------------------------------------------------- */
router.get("/admin/doubts", auth, requireAdmin, async (req, res) => {
  try {
    const doubts = await Doubt.find().sort({ createdAt: -1 });
    return res.json(doubts);
  } catch (err) {
    console.error("Fetch doubts error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch doubts",
    });
  }
});

/* ----------------------------------------------------
   ADMIN: REPLY TO DOUBT
---------------------------------------------------- */
router.post("/admin/reply-doubt/:id", auth, requireAdmin, async (req, res) => {
  try {
    const { reply } = req.body;

    if (!reply || !reply.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reply text is required",
      });
    }

    const doubt = await Doubt.findById(req.params.id);

    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: "Doubt not found",
      });
    }

    doubt.reply = reply;
    doubt.replied = true;
    await doubt.save();

    const notification = await Notification.create({
      username: doubt.username,
      type: "DOUBT_REPLY",
      text: reply,
      isRead: false,
      createdAt: new Date(),
    });

    try {
      getIO().to(doubt.username).emit("doubt-reply", notification);
    } catch (socketErr) {
      console.error("Socket emit failed (non-fatal):", socketErr.message);
    }

    return res.json({
      success: true,
      message: "Reply sent successfully",
    });
  } catch (err) {
    console.error("Reply doubt error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to send reply",
    });
  }
});

export default router;
