import express from "express";
import Resource from "../schema/Resource.model.js";
import { upload, cloudinary } from "../config/cloudinary.js";
import auth from "../controller/authh.js";

const router = express.Router();

// ── UPLOAD file (admin only) ──
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    const { title, category } = req.body;

    const resource = await Resource.create({
      title,
      category,
      fileUrl:  req.file.path,
      publicId: req.file.filename,
      fileType: req.file.mimetype,
    });

    res.status(201).json(resource);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

// ── GET files by category ──
router.get("/:category", async (req, res) => {
  try {
    const files = await Resource.find({ category: req.params.category }).sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET all files ──
router.get("/", async (req, res) => {
  try {
    const files = await Resource.find().sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── DELETE file ──
router.delete("/:id", auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Not found" });

    // Delete from Cloudinary too
    await cloudinary.uploader.destroy(resource.publicId, { resource_type: "auto" });

    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;