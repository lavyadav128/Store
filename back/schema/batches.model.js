import mongoose from 'mongoose';

// ── SUBJECT sub-schema ── (unchanged from before)
const subjectSchema = new mongoose.Schema({
  slug: { type: String, required: true },        // literal subject key, e.g. "physics", "Semester (1)"
  name: { type: String, required: true },         // display name
  description: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { _id: false });

// ── RESOURCE TYPES ──
// Replaces the hardcoded classId === "14" / "10" / "1" branching in
// ChapterDetail.js. Admin controls which resource cards show for this
// batch's chapters — works for any batch including future custom ones.
const resourceTypesSchema = new mongoose.Schema({
  mindmap: { type: Boolean, default: true },
  shortNotes: { type: Boolean, default: true },
  completeNotes: { type: Boolean, default: true },
  video: { type: Boolean, default: true },
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

  subjects: { type: [subjectSchema], default: [] },
  resourceTypes: { type: resourceTypesSchema, default: () => ({}) },
}, { timestamps: true });

export default mongoose.model('Batch', batchSchema);