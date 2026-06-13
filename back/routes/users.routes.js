

import express from 'express';
// import bcrypt from 'bcrypt';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { User } from '../schema/user.model.js';
import { Message } from "../schema/message.model.js";
import auth from "../controller/authh.js"


const router = express.Router();

// ---------------------- LOGIN ----------------------
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Please provide all fields." });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { _id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(httpStatus.OK).json({
      token,
      username: user.username,
      name: user.name,
    });
  } catch (e) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: `Error: ${e.message}` });
  }
});

// ---------------------- REGISTER ----------------------
router.post('/register', async (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Please provide all fields." });
  }

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res
        .status(httpStatus.CONFLICT)
        .json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, username, password: hashedPassword });

    await newUser.save();

    const token = jwt.sign(
      { _id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(httpStatus.CREATED).json({
      message: "User registered",
      token,
      username: newUser.username,
      name: newUser.name,
    });
  } catch (e) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: `Error: ${e.message}` });
  }
});


// Fetch all notifications for this user
router.get("/notifications/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const messages = await Message.find({
      $or: [
        { to: username }, // messages to this user
        { to: null },     // broadcast messages
      ],
    }).sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});


// GET /api/user/profile
router.get("/admin/profile", auth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;





