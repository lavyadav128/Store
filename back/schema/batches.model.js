import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({
  batchId: { type: String, required: true, unique: true },
  folder: { type: String, required: true },       // NEW — replaces pageType + category
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  screenshot: { type: String, default: '' },
  price: { type: Number, default: 0 },
  redirectPath: { type: String, default: '' },
  whatYouLearn: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  // pageType, category — REMOVED
});
// The public GET /api/batches route filters by { isActive: true, folder }
// and sorts by sortOrder — this index lets MongoDB satisfy that ENTIRE
// query (filter + sort) directly from the index, without scanning documents
// or sorting in memory. Order matters: equality fields first (isActive,
// folder), then the sort field (sortOrder).
batchSchema.index({ isActive: 1, folder: 1, sortOrder: 1 });
export default mongoose.model('Batch', batchSchema);
