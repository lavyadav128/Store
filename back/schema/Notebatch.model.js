import mongoose from 'mongoose';

const noteBatchSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },   // "physics-crash-course" — used as classId for purchases too
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, default: 0 },                     // 0 = FREE
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('NoteBatch', noteBatchSchema);