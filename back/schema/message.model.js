import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  from: { type: String, required: true },   // always "adminbrand"
  to: { type: String, default: null },      // null = send to all users
  type: { type: String, default: "ADMIN_MESSAGE" }, // optional, can be used to categorize
  isRead: { type: Boolean, default: false }, 
  createdAt: { type: Date, default: Date.now },
});

export const Message = mongoose.model("Message", messageSchema);
