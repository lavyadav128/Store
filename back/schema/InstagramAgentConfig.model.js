import mongoose from "mongoose";

// A singleton configuration for the one Instagram professional account that
// the merchant explicitly connects through Meta's official API.
const instagramAgentConfigSchema = new mongoose.Schema({
  key: { type: String, default: "default", unique: true },
  niche: { type: String, trim: true, default: "" },
  targetAudience: { type: String, trim: true, default: "" },
  brandVoice: { type: String, trim: true, default: "Helpful, accurate and encouraging" },
  contentMode: { type: String, enum: ["post", "reel", "both"], default: "both" },
  postsPerDay: { type: Number, min: 1, max: 3, default: 1 },
  running: { type: Boolean, default: false },
  autoReplyComments: { type: Boolean, default: true },
  autoReplyMessages: { type: Boolean, default: true },
  lastStartedAt: { type: Date, default: null },
  lastStoppedAt: { type: Date, default: null },
  lastError: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("InstagramAgentConfig", instagramAgentConfigSchema);
