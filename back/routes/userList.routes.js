import express from "express";
import UserList from "../schema/UserList.model.js";
import auth from "../controller/authh.js"; // adjust path as per your project

const router = express.Router();

// ── GET aims & tasks ──
router.get("/", auth, async (req, res) => {
  try {
    let doc = await UserList.findOne({ username: req.user.username });
    if (!doc) doc = await UserList.create({ username: req.user.username, aims: [], tasks: [] });
    res.json({ aims: doc.aims, tasks: doc.tasks });
  } catch (err) {
    console.error("GET list error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── ADD aim ──
router.post("/aims", auth, async (req, res) => {
  try {
    const { text } = req.body;
    const doc = await UserList.findOneAndUpdate(
      { username: req.user.username },
      { $push: { aims: { text } } },
      { new: true, upsert: true }
    );
    res.json(doc.aims);
  } catch (err) {
    console.error("ADD aim error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── TOGGLE aim ──
router.patch("/aims/:id/toggle", auth, async (req, res) => {
  try {
    const doc = await UserList.findOne({ username: req.user.username });
    const aim = doc.aims.id(req.params.id);
    if (!aim) return res.status(404).json({ message: "Aim not found" });
    aim.completed = !aim.completed;
    await doc.save();
    res.json(doc.aims);
  } catch (err) {
    console.error("TOGGLE aim error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── DELETE aim ──
router.delete("/aims/:id", auth, async (req, res) => {
  try {
    const doc = await UserList.findOneAndUpdate(
      { username: req.user.username },
      { $pull: { aims: { _id: req.params.id } } },
      { new: true }
    );
    res.json(doc.aims);
  } catch (err) {
    console.error("DELETE aim error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── ADD task ──
router.post("/tasks", auth, async (req, res) => {
  try {
    const { text } = req.body;
    const doc = await UserList.findOneAndUpdate(
      { username: req.user.username },
      { $push: { tasks: { text } } },
      { new: true, upsert: true }
    );
    res.json(doc.tasks);
  } catch (err) {
    console.error("ADD task error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── TOGGLE task ──
router.patch("/tasks/:id/toggle", auth, async (req, res) => {
  try {
    const doc = await UserList.findOne({ username: req.user.username });
    const task = doc.tasks.id(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    task.completed = !task.completed;
    await doc.save();
    res.json(doc.tasks);
  } catch (err) {
    console.error("TOGGLE task error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── DELETE task ──
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const doc = await UserList.findOneAndUpdate(
      { username: req.user.username },
      { $pull: { tasks: { _id: req.params.id } } },
      { new: true }
    );
    res.json(doc.tasks);
  } catch (err) {
    console.error("DELETE task error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;