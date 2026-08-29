import express from 'express';
import Razorpay from 'razorpay';
import auth from '../../auth/authh.js';
import RecoveryOffer from '../schema/RecoveryOffer.model.js';
import FailedPayment from '../schema/FailedPayment.model.js';
import PaymentAttempt from '../schema/PaymentAttempt.model.js';
import Batch from '../../batches/schema/batches.model.js';
import NoteBatch from '../../notes/schema/Notebatch.model.js';

const router = express.Router();
const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_SECRET });

async function liveProduct(batchId) {
  let batch = await Batch.findOne({ batchId }).lean();
  if (!batch) {
    batch = await Batch.findOne({ status: 'active' }).lean() || await Batch.findOne().lean();
  }
  if (batch) {
    return { id: batch.batchId || batch._id, title: batch.title, price: Number(batch.price), destination: `/batches` };
  }
  return null;
}

router.get('/active', auth, async (req, res) => {
  const offers = await RecoveryOffer.find({ userId: req.user._id, status: { $in: ['approved', 'order_created'] }, expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 }).lean();
  const result = await Promise.all(offers.map(async (offer) => {
    const product = await liveProduct(offer.batchId);
    return product ? { id: offer._id, batchId: offer.batchId, title: product.title, discountPercent: offer.discountPercent, originalPrice: product.price, discountedPrice: Math.round(product.price * (100 - offer.discountPercent)) / 100, destination: product.destination, expiresAt: offer.expiresAt } : null;
  }));
  res.json(result.filter(Boolean));
});

router.post('/:id/create-order', auth, async (req, res) => {
  let offer = await RecoveryOffer.findById(req.params.id);
  if (!offer) return res.status(404).json({ error: 'Recovery offer not found' });
  if (req.user?._id) offer.userId = req.user._id;
  if (offer.status === 'claimed') return res.status(409).json({ error: 'This offer has already been used' });
  if (offer.expiresAt <= new Date()) { offer.status = 'expired'; await offer.save(); return res.status(410).json({ error: 'This offer has expired' }); }
  const product = await liveProduct(offer.batchId);
  if (!product || product.price <= 0) return res.status(409).json({ error: 'This batch is no longer available for this offer' });
  const amount = Math.round(product.price * 100 * (100 - offer.discountPercent) / 100);
  const order = await razorpay.orders.create({ amount, currency: 'INR', receipt: `recovery_${offer._id}_${Date.now()}`, payment_capture: 1 });
  offer.razorpayOrderId = order.id; offer.status = 'order_created'; await offer.save();
  await PaymentAttempt.create({ userId: req.user._id, batchId: offer.batchId, batchTitle: product.title, amount: amount / 100, currency: 'INR', razorpayOrderId: order.id, metadata: { source: 'approved_recovery_offer', recoveryOfferId: String(offer._id) } });
  res.json({ ...order, key: process.env.RAZORPAY_KEY_ID, offerId: offer._id, classId: offer.batchId, price: amount / 100, title: product.title, destination: product.destination, discountPercent: offer.discountPercent });
});

export { RecoveryOffer };
export default router;
