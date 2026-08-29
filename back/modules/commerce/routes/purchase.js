import express from 'express';
import crypto from 'crypto';
import * as Sentry from '@sentry/node';
import Purchase from '../schema/purchase.model.js';
import Batch from '../../batches/schema/batches.model.js';
import NoteBatch from '../../notes/schema/Notebatch.model.js';
import { User } from '../../auth/schema/user.model.js';
import auth from '../../auth/authh.js';
import PaymentAttempt from '../../revenue-recovery/schema/PaymentAttempt.model.js';
import CommerceAudit from '../schema/CommerceAudit.model.js';
import { sendWhatsAppMessage } from '../../../shared/services/twilioservice.js';
import RecoveryOffer from '../../revenue-recovery/schema/RecoveryOffer.model.js';
import FailedPayment from '../../revenue-recovery/schema/FailedPayment.model.js';

const router = express.Router();

async function getLiveProduct(classId) {
  const [batch, noteBatch] = await Promise.all([
    Batch.findOne({ batchId: classId, isActive: true }).lean(),
    NoteBatch.findOne({ slug: classId, isActive: true }).lean(),
  ]);
  return batch ? { ...batch, type: 'batch', destination: batch.redirectPath || `/class/${batch.batchId}` }
    : noteBatch ? { ...noteBatch, type: 'note-batch', destination: `/notes/${noteBatch.slug}` }
      : null;
}

// Save enrolment only after the server verifies the live product price. Paid
// products additionally require a valid Razorpay signature.
router.post('/save-purchase', auth, async (req, res) => {
  const { classId, price, razorpay_order_id, razorpay_payment_id, razorpay_signature, recoveryOfferId } = req.body;
  const userId = req.user._id;
  try {
    if (!classId || typeof classId !== 'string') return res.status(400).json({ error: 'A valid batch identifier is required' });
    const product = await getLiveProduct(classId);
    if (!product) return res.status(404).json({ error: 'Active batch not found' });
    const standardPrice = Number(product.price) || 0;
    let serverPrice = standardPrice;
    let recoveryOffer = null;
    if (recoveryOfferId) {
      recoveryOffer = await RecoveryOffer.findOne({ _id: recoveryOfferId, userId, batchId: classId, razorpayOrderId: razorpay_order_id, status: 'order_created', expiresAt: { $gt: new Date() } });
      if (!recoveryOffer) return res.status(400).json({ error: 'Recovery offer is invalid, expired, or does not match this payment.' });
      serverPrice = Math.round(standardPrice * 100 * (100 - recoveryOffer.discountPercent) / 100) / 100;
    }
    if (Number(price) !== serverPrice) return res.status(400).json({ error: 'Price verification failed. Refresh the batch and try again.' });

    if (serverPrice > 0) {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) return res.status(400).json({ error: 'Missing payment verification details' });
      const expected = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
      if (expected !== razorpay_signature) {
        Sentry.captureMessage('Payment signature mismatch', 'warning');
        return res.status(400).json({ error: 'Payment verification failed' });
      }
      const attempt = await PaymentAttempt.findOne({ razorpayOrderId: razorpay_order_id, userId, batchId: classId });
      if (!attempt || Number(attempt.amount) !== serverPrice) return res.status(400).json({ error: 'Payment order does not match this batch' });
      const duplicate = await Purchase.findOne({ razorpayPaymentId: razorpay_payment_id });
      if (duplicate) return res.status(200).json({ message: 'Purchase already saved' });
    }

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 10);
    await Purchase.findOneAndUpdate(
      { userId, classId },
      { $set: { userId, classId, title: product.title, price: serverPrice, description: product.description || '', imageUrl: product.imageUrl || '', expiryDate, isPremium: serverPrice > 0, ...(serverPrice > 0 && { razorpayPaymentId: razorpay_payment_id }) } },
      { upsert: true, new: true }
    );

    if (serverPrice > 0) {
      await PaymentAttempt.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, { $set: { status: 'paid', razorpayPaymentId: razorpay_payment_id } });
      if (recoveryOffer) {
        recoveryOffer.status = 'claimed'; recoveryOffer.razorpayPaymentId = razorpay_payment_id; await recoveryOffer.save();
        await FailedPayment.findByIdAndUpdate(recoveryOffer.failedPaymentId, { $set: { status: 'recovered' } });
      }
      await CommerceAudit.create({ userId, eventType: 'payment_verified', product: { id: `${product.type}:${classId}`, purchaseId: classId, type: product.type, title: product.title, price: serverPrice, destination: product.destination }, reason: 'Razorpay payment signature was verified and access was granted.', gate: { decision: 'approved', rule: 'razorpay_signature_verified', explanation: 'The server verified the signature and the original order/product match.' }, metadata: { razorpayOrderId: razorpay_order_id, razorpayPaymentId: razorpay_payment_id } }).catch((error) => console.error('Payment audit write failed:', error.message));
      const user = await User.findById(userId);
      if (user?.phone) await sendWhatsAppMessage(product.title, `whatsapp:+91${user.phone}`).catch((error) => console.error('WhatsApp receipt failed:', error.message));
    }
    res.status(200).json({ message: 'Purchase saved' });
  } catch (error) {
    if (error.code === 11000) return res.status(200).json({ message: 'Purchase already saved' });
    console.error('Error saving purchase:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/user-purchases', auth, async (req, res) => {
  try {
    const purchases = await Purchase.find({ userId: req.user._id, expiryDate: { $gt: new Date() } }).select('classId title description imageUrl price expiryDate isPremium -_id');
    res.json(purchases);
  } catch (error) { Sentry.captureException(error); res.status(500).json({ error: 'Unable to fetch purchases' }); }
});

router.post('/purchase-access', auth, async (req, res) => {
  try {
    let targetClassId = req.body.classId;
    if (!targetClassId && req.body.redirectPath) {
      const batch = await Batch.findOne({ redirectPath: req.body.redirectPath }).lean();
      targetClassId = batch?.batchId;
    }
    if (!targetClassId) return res.status(400).json({ error: 'classId or redirectPath is required' });
    const purchase = await Purchase.findOne({ userId: req.user._id, classId: targetClassId, expiryDate: { $gt: new Date() } });
    res.json({ access: !!purchase });
  } catch (error) { Sentry.captureException(error); res.status(500).json({ error: 'Server error' }); }
});

export default router;
