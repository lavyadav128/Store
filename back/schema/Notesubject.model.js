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

export default mongoose.model('NoteSubject', noteSubjectSchema);