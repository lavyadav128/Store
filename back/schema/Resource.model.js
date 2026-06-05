import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title:    { type: String, required: true },
    category: { 
      type: String, 
      required: true,
      enum: ["pyq", "mindmap", "shortnotes", "fullstack", "dsa_files", "completenotes", "videos"]
    },
    fileUrl:    { type: String, required: true },  // Cloudinary URL
    publicId:   { type: String, required: true },  // Cloudinary public_id (for deletion)
    fileType:   { type: String },                  // pdf, image, video etc
    uploadedBy: { type: String, default: "admin" },
  },
  { timestamps: true }
);

export default mongoose.model("Resource", resourceSchema);