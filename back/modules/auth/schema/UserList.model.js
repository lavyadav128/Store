import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  text:      { type: String,  required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date,    default: Date.now },
});

const userListSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    aims:  [itemSchema],
    tasks: [itemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("UserList", userListSchema);