import mongoose from 'mongoose';

const noteChapterSchema = new mongoose.Schema({
  batchSlug: { type: String, required: true },
  subjectSlug: { type: String, required: true },
  slug: { type: String, required: true },
  title: { type: String, required: true },

  mindmapUrl: { type: String, default: '' },
  shortNotesUrl: { type: String, default: '' },
  completeNotesUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' },

  // Personal note for this chapter — text saved directly for fast reads,
  // plus the Cloudinary URL of the same content for the permanent copy.
  myNoteText: { type: String, default: '' },
  myNoteUrl: { type: String, default: '' },

  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

noteChapterSchema.index({ batchSlug: 1, subjectSlug: 1, slug: 1 }, { unique: true });
// GET /api/notes/chapters?batch=X&subject=Y filters { batchSlug, subjectSlug,
// isActive: true } and sorts by order
noteChapterSchema.index({ batchSlug: 1, subjectSlug: 1, isActive: 1, order: 1 });
export default mongoose.model('NoteChapter', noteChapterSchema);