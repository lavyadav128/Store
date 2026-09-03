import mongoose from "mongoose";

const audioTrackSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  artist: { type: String, default: "Royalty Free" },
  audioUrl: { type: String, default: "" },
  genre: { type: String, default: "Nature Soundscape" },
  duration: { type: Number, default: 30 },
}, { _id: false });

const instagramContentSchema = new mongoose.Schema({
  type: { type: String, enum: ["post", "reel"], required: true },
  status: { type: String, enum: ["draft", "ready", "scheduled", "publishing", "published", "failed"], default: "draft" },
  topic: { type: String, required: true, trim: true },
  speaker: { type: String, default: "" },
  quote: { type: String, default: "" },
  quoteFingerprint: { type: String, default: "", index: true },
  themeCategory: { type: String, default: "🌅 Nature's Morning" },
  caption: { type: String, required: true },
  hashtags: { type: [String], default: [] },
  creativeBrief: { type: String, default: "" },
  aspectRatio: { type: String, enum: ["16:9", "9:16", "1:1"], default: "9:16" },
  assetUrl: { type: String, default: "" },
  assetSource: {
    type: String,
    enum: ["", "admin", "ai_reel", "ai_post"],
    default: "admin",
  },
  soundscape: { type: String, default: "" },
  audioUrl: { type: String, default: "" },
  audioDuration: { type: Number, default: 0 },
  audioTrack: { type: audioTrackSchema, default: () => ({}) },
  trendingAudioSuggestion: { type: String, default: "" },
  mediaGenerationStatus: { type: String, enum: ["not_requested", "generating", "ready", "failed"], default: "ready" },
  mediaGenerationError: { type: String, default: "" },
  scheduledFor: { type: Date, default: null },
  publishedAt: { type: Date, default: null },
  instagramMediaId: { type: String, default: "" },
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  viewsCount: { type: Number, default: 0 },
  savesCount: { type: Number, default: 0 },
  error: { type: String, default: "" },
  createdBy: { type: String, enum: ["agent", "admin"], default: "admin" },
}, { timestamps: true });

instagramContentSchema.index({ status: 1, scheduledFor: 1 });
export default mongoose.models.InstagramContent || mongoose.model("InstagramContent", instagramContentSchema);
