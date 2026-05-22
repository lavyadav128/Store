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

export default mongoose.model("Notification", notificationSchema);
