import express from "express";
import mongoose from "mongoose";
import auth from "../../auth/authh.js";
import requireAdmin from "../../../shared/middleware/requireAdmin.js";
import { User } from "../../auth/schema/user.model.js";
import { Message } from "../../doubts/schema/message.model.js";
import Notification from "../../notifications/schema/notification.model.js";
import Purchase from "../../commerce/schema/purchase.model.js";
import Doubt from "../../doubts/schema/doubt.model.js";
import PaymentAttempt from "../../revenue-recovery/schema/PaymentAttempt.model.js";
import FailedPayment from "../../revenue-recovery/schema/FailedPayment.model.js";
import RecoveryOffer from "../../revenue-recovery/schema/RecoveryOffer.model.js";
import CommerceAudit from "../../commerce/schema/CommerceAudit.model.js";
import analyticsDataService from "../../analytics/services/analyticsData.service.js";
import mlEngineService from "../../analytics/services/mlEngine.service.js";
import { clearCache } from "../../../shared/middleware/cache.js";

const router = express.Router();

/* ---------------- ADMIN AUTH ---------------- */
const adminAuth = [auth, requireAdmin];

/* ---------------- GET ALL ENRICHED USERS ---------------- */
router.get("/users", adminAuth, async (req, res) => {
  try {
    const rawUsers = await User.find(
      { username: { $ne: "adminbrand@gmail.com" } },
      { password: 0 }
    ).sort({ createdAt: -1 }).lean();

    const userIds = rawUsers.map((u) => u._id);
    const usernames = rawUsers.map((u) => u.username).filter(Boolean);

    // Fetch purchases and doubts in parallel for fast enrichment
    const [purchases, doubts] = await Promise.all([
      Purchase.find({ userId: { $in: userIds } }).select("userId price createdAt").lean().catch(() => []),
      Doubt.find({ username: { $in: usernames } }).select("username createdAt").lean().catch(() => []),
    ]);

    // Index purchases by userId
    const purchaseStats = {};
    purchases.forEach((p) => {
      const k = String(p.userId);
      if (!purchaseStats[k]) purchaseStats[k] = { count: 0, totalSpend: 0, lastDate: null };
      purchaseStats[k].count += 1;
      purchaseStats[k].totalSpend += Number(p.price || 0);
      if (p.createdAt && (!purchaseStats[k].lastDate || new Date(p.createdAt) > new Date(purchaseStats[k].lastDate))) {
        purchaseStats[k].lastDate = p.createdAt;
      }
    });

    // Index doubts by username
    const doubtStats = {};
    doubts.forEach((d) => {
      if (!doubtStats[d.username]) doubtStats[d.username] = { count: 0, lastDate: null };
      doubtStats[d.username].count += 1;
      if (d.createdAt && (!doubtStats[d.username].lastDate || new Date(d.createdAt) > new Date(doubtStats[d.username].lastDate))) {
        doubtStats[d.username].lastDate = d.createdAt;
      }
    });

    const enrichedUsers = rawUsers.map((u) => {
      const uid = String(u._id);
      const p = purchaseStats[uid] || { count: 0, totalSpend: 0, lastDate: null };
      const d = doubtStats[u.username] || { count: 0, lastDate: null };

      const dates = [
        u.createdAt ? new Date(u.createdAt) : null,
        p.lastDate ? new Date(p.lastDate) : null,
        d.lastDate ? new Date(d.lastDate) : null,
      ].filter(Boolean);

      const lastActive = dates.length > 0 ? new Date(Math.max(...dates.map(dt => dt.getTime()))).toISOString() : (u.createdAt || new Date().toISOString());

      return {
        _id: u._id,
        name: u.name || u.username || "Student",
        username: u.username,
        email: u.email || u.username,
        role: u.role || "student",
        createdAt: u.createdAt,
        purchaseCount: p.count,
        totalSpend: p.totalSpend,
        doubtsCount: d.count,
        lastActive,
      };
    });

    res.status(200).json({ users: enrichedUsers });
  } catch (err) {
    console.error("Failed to fetch admin users:", err);
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
});

/* ---------------- FULL CASCADE DELETE USER ---------------- */
// Permanently removes user and all their records (purchases, payments, doubts, notifications) across MongoDB
router.delete("/users/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "User ID or username is required" });

    // Find the user by ObjectId or username
    const query = mongoose.Types.ObjectId.isValid(id)
      ? { $or: [{ _id: id }, { username: id }] }
      : { username: id };

    const targetUser = await User.findOne(query);
    if (!targetUser) {
      return res.status(404).json({ error: "User not found in MongoDB." });
    }

    if (targetUser.username === "adminbrand@gmail.com") {
      return res.status(403).json({ error: "Master administrator account cannot be deleted." });
    }

    const userId = targetUser._id;
    const userIdStr = String(targetUser._id);
    const username = targetUser.username;

    // 1. Delete user record
    await User.deleteOne({ _id: userId });

    // 2. Cascade delete all purchases
    await Purchase.deleteMany({
      $or: [{ userId: userId }, { userId: userIdStr }, { userId: username }],
    });

    // 3. Cascade delete all doubts
    await Doubt.deleteMany({
      $or: [{ userId: userId }, { username: username }],
    });

    // 4. Cascade delete payment attempts & failures
    await PaymentAttempt.deleteMany({
      $or: [{ userId: userId }, { userId: userIdStr }, { username: username }],
    });
    await FailedPayment.deleteMany({
      $or: [{ userId: userId }, { userId: userIdStr }, { customerEmail: username }],
    });
    await RecoveryOffer.deleteMany({
      $or: [{ userId: userId }, { userId: userIdStr }],
    });
    await CommerceAudit.deleteMany({
      $or: [{ userId: userId }, { userId: userIdStr }],
    });

    // 5. Cascade delete notifications and direct messages
    await Notification.deleteMany({ username: username });
    await Message.deleteMany({
      $or: [{ to: username }, { from: username }],
    });

    // 6. Cascade delete native collection records
    if (mongoose.connection?.db) {
      await Promise.all([
        mongoose.connection.db.collection("userchapternotes").deleteMany({
          $or: [{ userId: userId }, { userId: userIdStr }],
        }).catch(() => {}),
        mongoose.connection.db.collection("userlists").deleteMany({
          $or: [{ userId: userId }, { userId: userIdStr }],
        }).catch(() => {}),
      ]);
    }

    // 7. Clear all server-side analytics & response caches so model retrains on genuine remaining students
    analyticsDataService.clearCache();
    mlEngineService.clearCache();
    await clearCache("*");

    console.log(`[ADMIN] Cascade deleted student ${username} (${userIdStr}) across all MongoDB collections.`);

    res.status(200).json({
      success: true,
      message: `Student "${targetUser.name || username}" (@${username}) and all associated purchases, payments, doubts, and notes have been permanently purged from MongoDB.`,
      deletedUser: {
        _id: userId,
        username,
        name: targetUser.name,
      },
    });
  } catch (err) {
    console.error("Cascade deletion error:", err);
    res.status(500).json({ error: "Failed to delete user and cascade records", details: err.message });
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
