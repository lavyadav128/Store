import mongoose from 'mongoose';

const noteSubjectSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },  // "physics"
  name: { type: String, required: true },                 // "Physics"
  description: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('NoteSubject', noteSubjectSchema);