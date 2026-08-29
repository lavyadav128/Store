import mongoose from "mongoose";
const schema = new mongoose.Schema({ type: { type: String, required: true }, message: { type: String, required: true }, metadata: { type: mongoose.Schema.Types.Mixed, default: {} } }, { timestamps: true });
schema.index({ createdAt: -1 });
export default mongoose.model("ClientAgentActivity", schema);
