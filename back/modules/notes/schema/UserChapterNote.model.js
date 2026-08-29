import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  batchSlug: { type: String, required: true },
  subjectSlug: { type: String, required: true },
  chapterSlug: { type: String, required: true },
  noteText: { type: String, required: true, maxlength: 500000 },
}, { timestamps: true });

schema.index({ userId: 1, batchSlug: 1, subjectSlug: 1, chapterSlug: 1 }, { unique: true });
export default mongoose.model('UserChapterNote', schema);
