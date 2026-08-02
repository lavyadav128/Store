import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    type: { type: String, default: "DOUBT_REPLY" },
    text: { type: String, required: true },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);
// GET /notifications/:username filters { username } and sorts by createdAt desc
notificationSchema.index({ username: 1, createdAt: -1 });
export default mongoose.model("Notification", notificationSchema);
