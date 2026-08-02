import mongoose from 'mongoose';

const noteBatchSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },   // "physics-crash-course" — used as classId for purchases too
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, default: 0 },                     // 0 = FREE
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  whatYouLearn: { type: [String], default: [] },

}, { timestamps: true });
// GET /api/notes/batches filters { isActive: true } and sorts by order —
// this index covers that filter + sort together
noteBatchSchema.index({ isActive: 1, order: 1 });
export default mongoose.model('NoteBatch', noteBatchSchema);