// back/routes/recoveryOfferPublic.routes.js
import express from 'express';
import mongoose from 'mongoose';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import RecoveryOffer from '../schema/RecoveryOffer.model.js';
import FailedPayment from '../schema/FailedPayment.model.js';
import PaymentAttempt from '../schema/PaymentAttempt.model.js';
import Batch from '../../batches/schema/batches.model.js';
import NoteBatch from '../../notes/schema/Notebatch.model.js';
import { User } from '../../auth/schema/user.model.js';
import Purchase from '../../commerce/schema/purchase.model.js';
import CommerceAudit from '../../commerce/schema/CommerceAudit.model.js';

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_SECRET || 'rzp_secret_placeholder',
});

// GET public recovery offer details (No login required)
router.get('/:offerId', async (req, res) => {
  try {
    const { offerId } = req.params;
    let offer = null;
    if (mongoose.isValidObjectId(offerId)) {
      offer = await RecoveryOffer.findById(offerId).populate('failedPaymentId');
      if (!offer) {
        offer = await RecoveryOffer.findOne({ failedPaymentId: offerId }).populate('failedPaymentId');
      }
    }
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Recovery offer not found or expired.' });
    }

    const signal = offer.failedPaymentId;
    let batch = null;
    if (offer.batchId) {
      batch = await Batch.findOne({ $or: [{ batchId: offer.batchId }, { _id: mongoose.isValidObjectId(offer.batchId) ? offer.batchId : null }] }).lean();
    }
    if (!batch) {
      batch = await Batch.findOne({ status: 'active' }).lean() || await Batch.findOne().lean();
    }

    const origPricePaise = signal?.amount || (batch?.price ? batch.price * 100 : 499900);
    const discountPercent = offer.discountPercent || 15;
    const discountedAmountPaise = Math.round(origPricePaise * (1 - discountPercent / 100));

    res.json({
      success: true,
      offerId: offer._id,
      discountPercent,
      originalPriceRupees: origPricePaise / 100,
      discountedPriceRupees: discountedAmountPaise / 100,
      discountedAmountPaise,
      customerName: signal?.customerName || 'Learner',
      customerEmail: signal?.customerEmail || '',
      customerPhone: signal?.customerPhone || '',
      batch: {
        id: batch?._id || offer.batchId,
        batchId: batch?.batchId || offer.batchId,
        title: signal?.batchTitle || batch?.title || 'Course Enrollment',
        description: batch?.description || 'Official Course Enrollment with 10-month complete access.',
        imageUrl: batch?.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
        category: batch?.category || batch?.folder || 'Competitive Exams',
        destination: batch?.redirectPath || `/class/${batch?.batchId || offer.batchId}`,
      },
    });
  } catch (err) {
    console.error('Fetch public recovery offer error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST public recovery offer create Razorpay order (No login required)
router.post('/:offerId/create-order', async (req, res) => {
  try {
    const { offerId } = req.params;
    let offer = null;
    if (mongoose.isValidObjectId(offerId)) {
      offer = await RecoveryOffer.findById(offerId).populate('failedPaymentId') || await RecoveryOffer.findOne({ failedPaymentId: offerId }).populate('failedPaymentId');
    }
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Recovery offer not found.' });
    }

    const signal = offer.failedPaymentId;
    let batch = null;
    if (offer.batchId) {
      batch = await Batch.findOne({ $or: [{ batchId: offer.batchId }, { _id: mongoose.isValidObjectId(offer.batchId) ? offer.batchId : null }] }).lean();
    }
    if (!batch) {
      batch = await Batch.findOne().lean();
    }

    const origPricePaise = signal?.amount || (batch?.price ? batch.price * 100 : 499900);
    const discountPercent = offer.discountPercent || 15;
    const discountedAmountPaise = Math.round(origPricePaise * (1 - discountPercent / 100));

    const options = {
      amount: discountedAmountPaise,
      currency: 'INR',
      receipt: `rec_off_${Date.now()}`,
      notes: {
        recoveryOfferId: String(offer._id),
        batchId: String(offer.batchId),
        discountPercent: String(discountPercent),
      },
    };

    const order = await razorpay.orders.create(options);
    res.json({
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      offerId: String(offer._id),
      classId: batch?.batchId || batch?._id || offer.batchId,
      price: discountedAmountPaise / 100,
      title: signal?.batchTitle || batch?.title || 'Course Enrollment',
      destination: batch?.redirectPath || `/class/${batch?.batchId || offer.batchId}`,
      discountPercent,
    });
  } catch (err) {
    console.error('Create public recovery order error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST verify public recovery payment & auto-login user & grant batch access
router.post('/:offerId/verify', async (req, res) => {
  try {
    const { offerId } = req.params;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, name } = req.body;

    let offer = null;
    if (mongoose.isValidObjectId(offerId)) {
      offer = await RecoveryOffer.findById(offerId).populate('failedPaymentId') || await RecoveryOffer.findOne({ failedPaymentId: offerId }).populate('failedPaymentId');
    }
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Recovery offer not found.' });
    }

    // Verify signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET || 'rzp_secret_placeholder');
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed: Invalid signature' });
    }

    // Mark offer claimed & signal recovered
    offer.status = 'claimed';
    offer.razorpayOrderId = razorpay_order_id;
    offer.razorpayPaymentId = razorpay_payment_id;
    await offer.save();

    if (offer.failedPaymentId) {
      const signal = offer.failedPaymentId;
      signal.status = 'recovered';
      signal.recoveredAt = new Date();
      signal.recoveredAmountPaise = offer.failedPaymentId.amount;
      signal.recoveryChannel = 'razorpay_public_discount_link';
      await signal.save();
    }

    // Find or create student user
    const customerEmail = email || offer.failedPaymentId?.customerEmail || 'student@gmail.com';
    let user = await User.findOne({ $or: [{ email: customerEmail }, { username: customerEmail }] });

    if (!user) {
      const randomPassword = crypto.randomBytes(8).toString('hex');
      user = await User.create({
        username: customerEmail,
        email: customerEmail,
        password: randomPassword,
        name: name || offer.failedPaymentId?.customerName || 'Student',
        role: 'user',
      });
    }

    // Fetch batch details to populate Purchase model
    const [batch, noteBatch] = await Promise.all([
      Batch.findOne({ $or: [{ batchId: offer.batchId }, { _id: mongoose.isValidObjectId(offer.batchId) ? offer.batchId : null }] }).lean(),
      NoteBatch.findOne({ slug: offer.batchId }).lean(),
    ]);

    const batchTitle = offer.failedPaymentId?.batchTitle || batch?.title || noteBatch?.title || 'Course Enrollment';
    const destination = batch?.redirectPath || (batch?.batchId ? `/class/${batch.batchId}` : noteBatch?.slug ? `/notes/${noteBatch.slug}` : `/batches`);
    const finalPrice = Math.round((offer.failedPaymentId?.amount || (batch?.price ? batch.price * 100 : 499900)) * (1 - (offer.discountPercent || 15) / 100)) / 100;

    // Create / update the Purchase model with 10 months validity
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 10);

    await Purchase.findOneAndUpdate(
      { userId: user._id, classId: offer.batchId },
      {
        $set: {
          userId: user._id,
          classId: offer.batchId,
          title: batchTitle,
          price: finalPrice,
          description: batch?.description || noteBatch?.description || 'Recovered Discount Enrollment',
          imageUrl: batch?.imageUrl || '',
          expiryDate,
          isPremium: true,
          razorpayPaymentId: razorpay_payment_id,
        },
      },
      { upsert: true, new: true }
    );

    // Update payment attempt if exists
    await PaymentAttempt.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { $set: { status: 'paid', razorpayPaymentId: razorpay_payment_id } }
    ).catch(() => {});

    // Audit trail
    await CommerceAudit.create({
      userId: user._id,
      eventType: 'payment_verified',
      product: {
        id: `batch:${offer.batchId}`,
        purchaseId: offer.batchId,
        type: batch ? 'batch' : 'note-batch',
        title: batchTitle,
        price: finalPrice,
        destination,
      },
      reason: 'Recovery discount Razorpay payment signature verified and batch access granted.',
      gate: { decision: 'approved', rule: 'recovery_payment_verified', explanation: 'Public recovery payment completed.' },
      metadata: { razorpayOrderId: razorpay_order_id, razorpayPaymentId: razorpay_payment_id, recoveryOfferId: String(offer._id) },
    }).catch(() => {});

    // Issue JWT Token so student is automatically logged in
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Payment verified! Enrollment complete.',
      token,
      username: user.username,
      name: user.name,
      batchId: offer.batchId,
      destination,
    });
  } catch (err) {
    console.error('Public recovery payment verify error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

