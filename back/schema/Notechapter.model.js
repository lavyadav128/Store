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

  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

noteChapterSchema.index({ batchSlug: 1, subjectSlug: 1, slug: 1 }, { unique: true });

export default mongoose.model('NoteChapter', noteChapterSchema);