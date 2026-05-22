import express from "express";
import Doubt from "../schema/doubt.model.js";
import Notification from "../schema/notification.model.js";

const router = express.Router();

/* ----------------------------------------------------
   USER: SUBMIT DOUBT
---------------------------------------------------- */
router.post("/submit-doubt", async (req, res) => {
  try {
    const { username, subject, message, contact } = req.body;

    // ✅ REQUIRED FIELD VALIDATION
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
   ADMIN: GET ALL DOUBTS
---------------------------------------------------- */
router.get("/admin/doubts", async (req, res) => {
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
router.post("/admin/reply-doubt/:id", async (req, res) => {
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

    // ✅ UPDATE DOUBT STATUS
    doubt.reply = reply;
    doubt.replied = true;
    await doubt.save();

    // 🔔 CREATE NOTIFICATION (VISIBLE IN USER NOTIFICATIONS PAGE)
    await Notification.create({
      username: doubt.username,   // 🔑 TARGET USER
      type: "DOUBT_REPLY",        // 🔑 USED BY NOTIFICATIONS PAGE
      text: reply,
      isRead: false,
      createdAt: new Date(),
    });

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
