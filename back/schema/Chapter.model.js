import mongoose from 'mongoose';

// ── CHAPTER ──
// Lives under a (batchId, subjectSlug) pair — e.g. Class 11 → Chemistry → "Redox Reactions".
// Each chapter always has exactly 4 fixed resource slots, matching the
// existing chapter-detail page: Mindmap, Short Notes, Complete Notes, Video.
// "Open PDF" / download just link straight to these URLs — the browser's
// native PDF viewer handles display, no custom viewer needed.
const chapterSchema = new mongoose.Schema({
  batchId: { type: String, required: true },       // "11"
  subjectSlug: { type: String, required: true },    // "chemistry"
  slug: { type: String, required: true },           // "redox-reactions"
  title: { type: String, required: true },          // "Redox Reactions"

  mindmapUrl: { type: String, default: '' },
  shortNotesUrl: { type: String, default: '' },
  completeNotesUrl: { type: String, default: '' },

  videoUrl: { type: String, default: '' },
  videoComingSoon: { type: Boolean, default: true }, // shows "COMING SOON" badge

  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// A chapter slug must be unique within its (batch, subject) — but the same
// slug can be reused across different subjects/batches.
chapterSchema.index({ batchId: 1, subjectSlug: 1, slug: 1 }, { unique: true });

export default mongoose.model('Chapter', chapterSchema);