import express from "express";
import Resource from "../schema/Resource.model.js";
import { upload, cloudinary } from "../config/cloudinary.js";
import auth from "../controller/authh.js";

const router = express.Router();

// ── UPLOAD file (admin only) ──
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file?.originalname);

    if (!req.file) return res.status(400).json({ message: "No file received" });

    const { title, category } = req.body;
    if (!title || !category) return res.status(400).json({ message: "Title and category required" });

    // Upload buffer directly to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      // determine resource type based on file type
      const isPDF = req.file.mimetype === "application/pdf";
      const resourceType = isPDF ? "raw" : "auto";
    
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `notenova/${category}`,
          resource_type: resourceType,
          type: "upload",
          access_mode: "public",
          public_id: `${Date.now()}-${req.file.originalname}`,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      stream.end(req.file.buffer);
    });

    console.log("Cloudinary upload success:", uploadResult.secure_url);

    const resource = await Resource.create({
      title,
      category,
      fileUrl:  uploadResult.secure_url,
      publicId: uploadResult.public_id,
      fileType: req.file.mimetype,
    });

    res.status(201).json(resource);
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ message: err.message });
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

    // destroy with correct resource_type
    const isPDF = resource.fileType === "application/pdf";
    const resourceType = isPDF ? "raw" : "auto";

    try {
      await cloudinary.uploader.destroy(resource.publicId, { 
        resource_type: resourceType,
        invalidate: true,
      });
      console.log("Deleted from Cloudinary:", resource.publicId);
    } catch (cloudErr) {
      console.error("Cloudinary delete error:", cloudErr.message);
      // still delete from MongoDB even if Cloudinary fails
    }

    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;