import mongoose from 'mongoose';

const noteSubjectSchema = new mongoose.Schema({
  batchSlug: { type: String, required: true },       // which batch this subject belongs to
  slug: { type: String, required: true },             // "physics"
  name: { type: String, required: true },             // "Physics"
  description: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// slug only needs to be unique WITHIN a batch, not globally
noteSubjectSchema.index({ batchSlug: 1, slug: 1 }, { unique: true });
// GET /api/notes/subjects?batch=X filters { batchSlug, isActive: true }
// and sorts by order — this index covers that query specifically
// (separate from the existing unique index, which is for slug lookups)
noteSubjectSchema.index({ batchSlug: 1, isActive: 1, order: 1 });
export default mongoose.model('NoteSubject', noteSubjectSchema);