import mongoose from "mongoose";

// Any potential promotion/brand request is deliberately held for a human.
const instagramBrandRequestSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  senderName: { type: String, default: "" },
  message: { type: String, required: true },
  source: { type: String, enum: ["instagram_dm", "comment", "manual"], default: "instagram_dm" },
  status: { type: String, enum: ["pending", "approved", "declined"], default: "pending" },
  adminNote: { type: String, default: "" },
}, { timestamps: true });

instagramBrandRequestSchema.index({ status: 1, createdAt: -1 });
export default mongoose.model("InstagramBrandRequest", instagramBrandRequestSchema);
