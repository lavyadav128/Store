import mongoose from "mongoose";

const audioTrackSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  artist: { type: String, default: "Royalty Free" },
  audioUrl: { type: String, default: "" },
  genre: { type: String, default: "Lo-Fi Beats" },
  duration: { type: Number, default: 30 },
}, { _id: false });

const instagramContentSchema = new mongoose.Schema({
  type: { type: String, enum: ["post", "reel"], required: true },
  status: { type: String, enum: ["draft", "ready", "scheduled", "publishing", "published", "failed"], default: "draft" },
  topic: { type: String, required: true, trim: true },
  caption: { type: String, required: true },
  hashtags: { type: [String], default: [] },
  creativeBrief: { type: String, default: "" },
  reelScript: { type: String, default: "" },
  // Meta needs a publicly retrievable image/video URL.
  assetUrl: { type: String, default: "" },
  assetSource: { type: String, enum: ["", "ai_image", "ai_video", "admin", "unsplash_hd"], default: "" },
  visualOptions: { type: [String], default: [] },
  audioTrack: { type: audioTrackSchema, default: () => ({}) },
  trendingAudioSuggestion: { type: String, default: "" },
  mediaGenerationStatus: { type: String, enum: ["not_requested", "generating", "ready", "failed"], default: "not_requested" },
  mediaGenerationError: { type: String, default: "" },
  scheduledFor: { type: Date, default: null },
  publishedAt: { type: Date, default: null },
  instagramMediaId: { type: String, default: "" },
  error: { type: String, default: "" },
  createdBy: { type: String, enum: ["agent", "admin"], default: "agent" },
}, { timestamps: true });

instagramContentSchema.index({ status: 1, scheduledFor: 1 });
export default mongoose.model("InstagramContent", instagramContentSchema);
