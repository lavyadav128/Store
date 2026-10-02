import mongoose from "mongoose";

const songItemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  artist: { type: String, default: "Trending Artist", trim: true },
  genre: { type: String, default: "Motivational / Hype" },
  audioUrl: { type: String, default: "" },
  active: { type: Boolean, default: true },
}, { _id: true, timestamps: true });

export const DEFAULT_SONGS = [];

const instagramAgentConfigSchema = new mongoose.Schema({
  key: { type: String, default: "default", unique: true },
  niche: { type: String, trim: true, default: "Virat Kohli Inspiration & Cricket Mastery" },
  searchTopic: { type: String, trim: true, default: "Virat Kohli quotes" },
  agentPersona: { type: String, default: "virat_kohli_inspiration" },
  targetAudience: { type: String, trim: true, default: "Virat Kohli fans, cricket lovers, and mindset enthusiasts" },
  brandVoice: { type: String, trim: true, default: "Fierce, inspiring, resilient, aggressive, and legendary" },
  contentMode: { type: String, enum: ["post", "reel", "both"], default: "reel" },
  postsPerDay: { type: Number, min: 1, max: 3, default: 1 },
  dailyPostTime: { type: String, default: "12:00" },
  running: { type: Boolean, default: false },
  autoReplyComments: { type: Boolean, default: true },
  autoReplyMessages: { type: Boolean, default: true },
  topAudienceCategory: { type: String, default: "👑 King Kohli Motivation" },
  categoryPerformance: { type: mongoose.Schema.Types.Mixed, default: () => ({}) },
  listedSongs: { type: [songItemSchema], default: () => [] },
  lastOptimizedAt: { type: Date, default: null },
  lastStartedAt: { type: Date, default: null },
  lastStoppedAt: { type: Date, default: null },
  lastError: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.models.InstagramAgentConfig || mongoose.model("InstagramAgentConfig", instagramAgentConfigSchema);
