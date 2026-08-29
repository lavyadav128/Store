import mongoose from "mongoose";

// A singleton configuration for the one Instagram professional account that
// the merchant explicitly connects through Meta's official API.
const instagramAgentConfigSchema = new mongoose.Schema({
  key: { type: String, default: "default", unique: true },
  niche: { type: String, trim: true, default: "High-Performance Motivation & Daily Success Wisdom" },
  targetAudience: { type: String, trim: true, default: "Ambitious individuals, students, creators, and professionals striving for excellence" },
  brandVoice: { type: String, trim: true, default: "Powerful, inspiring, stoic, deeply motivating, and thought-provoking in Hindi & English" },
  contentMode: { type: String, enum: ["post", "reel", "both"], default: "both" },
  postsPerDay: { type: Number, min: 1, max: 3, default: 1 },
  dailyPostTime: { type: String, default: "07:00" }, // 24-hr format (e.g. 07:00 for 7:00 AM IST morning motivation)
  running: { type: Boolean, default: false },
  autoReplyComments: { type: Boolean, default: true },
  autoReplyMessages: { type: Boolean, default: true },
  topAudienceCategory: { type: String, default: "Discipline & Grit" },
  categoryPerformance: { type: mongoose.Schema.Types.Mixed, default: () => ({}) },
  lastOptimizedAt: { type: Date, default: null },
  lastStartedAt: { type: Date, default: null },
  lastStoppedAt: { type: Date, default: null },
  geminiApiKey: { type: String, default: "" },
  lastError: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("InstagramAgentConfig", instagramAgentConfigSchema);
