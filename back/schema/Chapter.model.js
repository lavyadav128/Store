import mongoose from 'mongoose';

// ── CHAPTER ──
// Replaces chaptersData[classId][subject] from Subjectpage.js.
// IMPORTANT: `title` here must exactly match the `title` field used in
// your bulkupload.js Resource documents — that's how ChapterDetail.js
// matches a chapter to its mindmap/shortNotes/completeNotes PDFs.
// PDF URLs themselves are NOT stored here — they stay on the existing
// Resource collection, fetched by category + title match, unchanged.
const chapterSchema = new mongoose.Schema({
  batchId: { type: String, required: true },        // "11"
  subjectSlug: { type: String, required: true },     // "chemistry", "Semester (1)", etc — literal, matches subjects[]
  title: { type: String, required: true },           // "redox-reactions", "Real Numbers", etc — MUST match Resource.title

  videoUrl: { type: String, default: '' },            // was hardcoded in chaptersData before

  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

chapterSchema.index({ batchId: 1, subjectSlug: 1, title: 1 }, { unique: true });

export default mongoose.model('Chapter', chapterSchema);