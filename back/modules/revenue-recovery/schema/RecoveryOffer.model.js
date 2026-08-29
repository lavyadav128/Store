import mongoose from 'mongoose';

const recoveryOfferSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  failedPaymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'FailedPayment', required: true, unique: true },
  batchId: { type: String, required: true },
  discountPercent: { type: Number, required: true, min: 1, max: 100 },
  status: { type: String, enum: ['approved', 'order_created', 'claimed', 'expired', 'cancelled'], default: 'approved' },
  expiresAt: { type: Date, required: true, index: true },
  razorpayOrderId: { type: String, default: null },
  razorpayPaymentId: { type: String, default: null },
}, { timestamps: true });

export default mongoose.model('RecoveryOffer', recoveryOfferSchema);
