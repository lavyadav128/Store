import mongoose from 'mongoose';

const noteChapterSchema = new mongoose.Schema({
  subjectSlug: { type: String, required: true },     // "physics"
  slug: { type: String, required: true },             // "redox-reactions"
  title: { type: String, required: true },            // "Redox Reactions"

  mindmapUrl: { type: String, default: '' },
  shortNotesUrl: { type: String, default: '' },
  completeNotesUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' },

  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

noteChapterSchema.index({ subjectSlug: 1, slug: 1 }, { unique: true });

export default mongoose.model('NoteChapter', noteChapterSchema);