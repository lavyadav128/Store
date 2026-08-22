


import express from "express";
import Resource from "../schema/Resource.model.js";
import { upload, cloudinary } from "../config/cloudinary.js";
import auth from "../controller/authh.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

// ── UPLOAD file (admin only) ──
router.post("/upload", auth, requireAdmin, upload.single("file"), async (req, res) => {
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
    let resourceType = ""; // NEW: stores the real Cloudinary resource_type (image/video/raw)

    // CASE 1: URL was provided
    if (resourceUrl) {
      fileUrl = resourceUrl;
      publicId = null;
      fileType = "url";
      resourceType = null; // nothing stored on Cloudinary, nothing to delete there
    }

    // CASE 2: File was uploaded
    else if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const isPDF = req.file.mimetype === "application/pdf";

        // "auto" is valid on UPLOAD (Cloudinary figures out the real type for us)
        const uploadResourceType = isPDF ? "raw" : "auto";

        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `notenova/${category}`,
            resource_type: uploadResourceType,
            type: "upload",
            access_mode: "public",
            public_id: `${Date.now()}-${req.file.originalname}`,
            format: isPDF ? "pdf" : undefined,   // ADD THIS
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

      // IMPORTANT: Cloudinary tells us exactly what it stored this as
      // ("image", "video", or "raw") — save this, don't re-guess it later.
      resourceType = uploadResult.resource_type;
    }

    const resource = await Resource.create({
      title,
      category,
      fileUrl,
      publicId,
      fileType,
      resourceType, // NEW
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
router.post("/reorder", auth, requireAdmin, async (req, res) => {
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
router.delete("/:id", auth, requireAdmin, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Not found" });

    let cloudinaryDeleteFailed = false;

    try {
      if (resource.publicId) {
        // Use the resource_type that was actually stored at upload time.
        // Cloudinary's destroy() requires "image" | "video" | "raw" —
        // it does NOT accept "auto". Falling back to "image" only if the
        // field is somehow missing on older records.
        const resourceType = resource.resourceType || "image";

        const destroyResult = await cloudinary.uploader.destroy(
          resource.publicId,
          {
            resource_type: resourceType,
            invalidate: true,
          }
        );

        console.log(
          "Cloudinary destroy result for",
          resource.publicId,
          "->",
          destroyResult
        );

        // Cloudinary returns { result: "ok" } on success,
        // "not found" if it's already gone, or other errors otherwise.
        if (destroyResult.result !== "ok" && destroyResult.result !== "not found") {
          cloudinaryDeleteFailed = true;
        }
      }
    } catch (cloudErr) {
      console.error("Cloudinary delete error:", cloudErr.message);
      cloudinaryDeleteFailed = true;
    }

    await Resource.findByIdAndDelete(req.params.id);

    res.json({
      message: "Deleted successfully",
      cloudinaryDeleteFailed, // let the frontend/admin know if cleanup on Cloudinary side failed
    });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;
