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
    const rawId = decodeURIComponent(req.params.id || "").trim();
    const queryUsername = (req.query.username || req.body?.username || "").trim();
    const queryEmail = (req.query.email || req.body?.email || "").trim();

    if (!rawId && !queryUsername && !queryEmail) {
      return res.status(400).json({ error: "User ID or username is required" });
    }

    // Protect master administrator account
    const protectedAdmins = ["adminbrand@gmail.com", "adminbrand"];
    if (
      protectedAdmins.includes(rawId.toLowerCase()) ||
      protectedAdmins.includes(queryUsername.toLowerCase()) ||
      protectedAdmins.includes(queryEmail.toLowerCase())
    ) {
      return res.status(403).json({ error: "Master administrator account cannot be deleted." });
    }

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("MongoDB connection is not ready.");
    }

    // Strict 24-character hexadecimal check for genuine MongoDB ObjectId
    const is24Hex = /^[0-9a-fA-F]{24}$/.test(rawId);
    const targetObjId = is24Hex ? new mongoose.Types.ObjectId(rawId) : null;

    // Search for user in database across all identifiers
    const userSearchConditions = [];
    if (targetObjId) userSearchConditions.push({ _id: targetObjId });
    if (rawId && !is24Hex) userSearchConditions.push({ username: rawId }, { email: rawId });
    if (queryUsername) userSearchConditions.push({ username: queryUsername });
    if (queryEmail) userSearchConditions.push({ email: queryEmail });

    let targetUser = null;
    if (userSearchConditions.length > 0) {
      targetUser = await db.collection("users").findOne({ $or: userSearchConditions }).catch(() => null);
    }

    if (targetUser && targetUser.username === "adminbrand@gmail.com") {
      return res.status(403).json({ error: "Master administrator account cannot be deleted." });
    }

    const userId = targetUser ? targetUser._id : targetObjId;
    const userIdStr = userId ? String(userId) : (is24Hex ? rawId : null);
    const username = targetUser?.username || queryUsername || (!is24Hex ? rawId : null);
    const email = targetUser?.email || queryEmail || (rawId.includes("@") ? rawId : null);
    const displayName = targetUser?.name || username || email || "Student";

    // Collect all valid ID variants for cascade matching
    const idVariants = [userId, userIdStr].filter(Boolean);
    const usernameVariants = [username].filter(Boolean);
    const emailVariants = [email].filter(Boolean);

    // 1. Permanently delete from `users` collection
    const userDeleteOr = [];
    if (userId) userDeleteOr.push({ _id: userId });
    if (userIdStr && is24Hex) {
      try { userDeleteOr.push({ _id: new mongoose.Types.ObjectId(userIdStr) }); } catch (_) {}
    }
    if (username) userDeleteOr.push({ username });
    if (email) userDeleteOr.push({ email });
    if (userDeleteOr.length > 0) {
      await db.collection("users").deleteMany({ $or: userDeleteOr }).catch(() => {});
    }

    // 2. Cascade delete `purchases`
    const purchaseOr = [];
    idVariants.forEach((v) => purchaseOr.push({ userId: v }));
    usernameVariants.forEach((u) => purchaseOr.push({ userId: u }));
    if (purchaseOr.length > 0) {
      await db.collection("purchases").deleteMany({ $or: purchaseOr }).catch(() => {});
    }

    // 3. Cascade delete `doubts`
    const doubtOr = [];
    usernameVariants.forEach((u) => doubtOr.push({ username: u }));
    idVariants.forEach((v) => doubtOr.push({ userId: v }));
    if (doubtOr.length > 0) {
      await db.collection("doubts").deleteMany({ $or: doubtOr }).catch(() => {});
    }

    // 4. Cascade delete payment attempts, failures, and audits
    const paymentOr = [];
    idVariants.forEach((v) => paymentOr.push({ userId: v }));
    usernameVariants.forEach((u) => paymentOr.push({ username: u }, { customerEmail: u }));
    emailVariants.forEach((e) => paymentOr.push({ customerEmail: e }, { email: e }));

    const idOnlyOr = idVariants.map((v) => ({ userId: v }));

    await Promise.all([
      paymentOr.length > 0 ? db.collection("paymentattempts").deleteMany({ $or: paymentOr }).catch(() => {}) : Promise.resolve(),
      paymentOr.length > 0 ? db.collection("failedpayments").deleteMany({ $or: paymentOr }).catch(() => {}) : Promise.resolve(),
      idOnlyOr.length > 0 ? db.collection("recoveryoffers").deleteMany({ $or: idOnlyOr }).catch(() => {}) : Promise.resolve(),
      idOnlyOr.length > 0 ? db.collection("commerceaudits").deleteMany({ $or: idOnlyOr }).catch(() => {}) : Promise.resolve(),
      idOnlyOr.length > 0 ? db.collection("commerceevents").deleteMany({ $or: idOnlyOr }).catch(() => {}) : Promise.resolve(),
      paymentOr.length > 0 ? db.collection("checkoutattempts").deleteMany({ $or: paymentOr }).catch(() => {}) : Promise.resolve(),
    ]);

    // 5. Cascade delete `testattempts`
    const testOr = [];
    usernameVariants.forEach((u) => testOr.push({ username: u }));
    idVariants.forEach((v) => testOr.push({ userId: v }));
    if (testOr.length > 0) {
      await db.collection("testattempts").deleteMany({ $or: testOr }).catch(() => {});
    }

    // 6. Cascade delete notifications and messages
    const msgOr = [];
    usernameVariants.forEach((u) => msgOr.push({ to: u }, { from: u }));
    emailVariants.forEach((e) => msgOr.push({ to: e }, { from: e }));

    const notifOr = [];
    usernameVariants.forEach((u) => notifOr.push({ username: u }));
    emailVariants.forEach((e) => notifOr.push({ username: e }));

    await Promise.all([
      notifOr.length > 0 ? db.collection("notifications").deleteMany({ $or: notifOr }).catch(() => {}) : Promise.resolve(),
      msgOr.length > 0 ? db.collection("messages").deleteMany({ $or: msgOr }).catch(() => {}) : Promise.resolve(),
    ]);

    // 7. Cascade delete native student notes & userlists
    if (idOnlyOr.length > 0) {
      await Promise.all([
        db.collection("userchapternotes").deleteMany({ $or: idOnlyOr }).catch(() => {}),
        db.collection("userlists").deleteMany({ $or: idOnlyOr }).catch(() => {}),
      ]);
    }

    // 8. Safely clear all server-side analytics & response caches so model retrains on genuine remaining students
    try { analyticsDataService.clearCache(); } catch (_) {}
    try { mlEngineService.clearCache(); } catch (_) {}
    try { await clearCache("*"); } catch (_) {}

    console.log(`[ADMIN] Cascade deleted student "${displayName}" (${userIdStr || username || email}) across all MongoDB collections.`);

    return res.status(200).json({
      success: true,
      message: `Student "${displayName}" (@${username || email || userIdStr}) and all associated records have been permanently purged from MongoDB.`,
      deletedUser: {
        _id: userId,
        username,
        name: displayName,
      },
    });
  } catch (err) {
    console.error("Cascade deletion error:", err);
    return res.status(500).json({ error: "Failed to delete user and cascade records", details: err.message });
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
