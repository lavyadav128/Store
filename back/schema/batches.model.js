import mongoose from 'mongoose';

// ── SUBJECT sub-schema ──
// Lives inside a Batch — e.g. Class 11 has Mathematics, Physics, Chemistry.
// Denormalized (name+description live here, not in a shared lookup table)
// so each batch fully owns its own subject list from the admin panel.
const subjectSchema = new mongoose.Schema({
  slug: { type: String, required: true },        // "chemistry" — used in the URL
  name: { type: String, required: true },         // "Chemistry" — displayed
  description: { type: String, default: '' },     // "Explore the substances..."
  order: { type: Number, default: 0 },
}, { _id: false });

const batchSchema = new mongoose.Schema({
  batchId: { type: String, required: true, unique: true },
  folder: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  screenshot: { type: String, default: '' },
  price: { type: Number, default: 0 },
  redirectPath: { type: String, default: '' },
  whatYouLearn: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },

  // NEW — the subjects this batch's content is organized into.
  // Feeds the /class/:batchId "Subjects" page.
  subjects: { type: [subjectSchema], default: [] },
}, { timestamps: true });

export default mongoose.model('Batch', batchSchema);