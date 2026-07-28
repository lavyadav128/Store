

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

export default mongoose.model("Resource", resourceSchema);