import mongoose from "mongoose";

// A singleton configuration for the one Instagram professional account that
// the merchant explicitly connects through Meta's official API.
const instagramAgentConfigSchema = new mongoose.Schema({
  key: { type: String, default: "default", unique: true },
  niche: { type: String, trim: true, default: "Nature, Wildlife & Earth Cinematography" },
  targetAudience: { type: String, trim: true, default: "Nature lovers, cinematography enthusiasts, and mindful explorers" },
  brandVoice: { type: String, trim: true, default: "Serene, awe-inspiring, calming, and deeply grounded in Earth's natural beauty" },
  contentMode: { type: String, enum: ["post", "reel", "both"], default: "reel" },
  postsPerDay: { type: Number, min: 1, max: 3, default: 1 },
  dailyPostTime: { type: String, default: "12:00" },
  running: { type: Boolean, default: false },
  autoReplyComments: { type: Boolean, default: true },
  autoReplyMessages: { type: Boolean, default: true },
  topAudienceCategory: { type: String, default: "🌅 Nature's Morning" },
  categoryPerformance: { type: mongoose.Schema.Types.Mixed, default: () => ({}) },
  lastOptimizedAt: { type: Date, default: null },
  lastStartedAt: { type: Date, default: null },
  lastStoppedAt: { type: Date, default: null },
  lastError: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("InstagramAgentConfig", instagramAgentConfigSchema);
