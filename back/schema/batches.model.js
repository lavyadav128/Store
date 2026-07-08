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

export default mongoose.model('Batch', batchSchema);
