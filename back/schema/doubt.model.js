import mongoose from "mongoose";

const doubtSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    contact: { type: String },
    reply: { type: String, default: "" },
    replied: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Doubt", doubtSchema);
