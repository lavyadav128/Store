

import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "pyq",
        "mindmap",
        "shortnotes",
        "fullstack",
        "dsa_files",
        "completenotes",
        "videos",
        "motivation",
        "projects",
        "reels",
        "shorts",
      ],
    },

    fileUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      default: null,
    },

    fileType: {
      type: String,
      default: "url",
    },

    uploadedBy: {
      type: String,
      default: "admin",
    },

    resourceType: {
      type: String, // "image" | "video" | "raw" | null (for URL-only entries)
      default: null,
    },



    
    order: { type: Number, default: 0 }
  },
  {
    timestamps: true,
  }
);
// GET /resources/:category filters { category } and sorts by createdAt desc
resourceSchema.index({ category: 1, createdAt: -1 });

// The full listing route (no filter) sorts by { order: 1, createdAt: -1 }
resourceSchema.index({ order: 1, createdAt: -1 });
export default mongoose.model("Resource", resourceSchema);