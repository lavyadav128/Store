import mongoose from "mongoose";

const instagramActivitySchema = new mongoose.Schema({
  type: { type: String, required: true },
  message: { type: String, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

instagramActivitySchema.index({ createdAt: -1 });
export default mongoose.model("InstagramActivity", instagramActivitySchema);
