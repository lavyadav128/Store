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

    const { title, category, resourceUrl } = req.body;

    if (!title || !category) {
      return res
        .status(400)
        .json({ message: "Title and category required" });
    }

    // Must have either file OR URL
    if (!req.file && !resourceUrl) {
      return res
        .status(400)
        .json({ message: "Provide either a file or URL" });
    }

    let fileUrl = "";
    let publicId = "";
    let fileType = "";

    // CASE 1: URL was provided
    if (resourceUrl) {
      fileUrl = resourceUrl;
      publicId = null;
      fileType = "url";
    }

    // CASE 2: File was uploaded
    else if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const isPDF =
          req.file.mimetype === "application/pdf";

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
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        stream.end(req.file.buffer);
      });

      fileUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
      fileType = req.file.mimetype;
    }

    const resource = await Resource.create({
      title,
      category,
      fileUrl,
      publicId,
      fileType,
    });

    res.status(201).json(resource);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({
      message: err.message,
    });
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
    const files = await Resource.find().sort({ order: 1, createdAt: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ── SAVE order ──
router.post("/reorder", auth, async (req, res) => {
  try {
    const { ids } = req.body; // array of ids in new order
    if (!Array.isArray(ids)) {
      return res.status(400).json({ message: "ids must be an array" });
    }
    // update each resource's order field
    await Promise.all(
      ids.map((id, index) =>
        Resource.findByIdAndUpdate(id, { order: index })
      )
    );
    res.json({ message: "Order saved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
      if (resource.publicId) {
        const isPDF =
          resource.fileType === "application/pdf";
    
        const resourceType =
          isPDF ? "raw" : "auto";
    
        await cloudinary.uploader.destroy(
          resource.publicId,
          {
            resource_type: resourceType,
            invalidate: true,
          }
        );
    
        console.log(
          "Deleted from Cloudinary:",
          resource.publicId
        );
      }
    } catch (cloudErr) {
      console.error(
        "Cloudinary delete error:",
        cloudErr.message
      );
    }

    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;