// back/routes/recoveryOfferPublic.routes.js
import express from 'express';
import mongoose from 'mongoose';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import RecoveryOffer from '../agents/revenue-recovery/schema/RecoveryOffer.model.js';
import FailedPayment from '../agents/revenue-recovery/schema/FailedPayment.model.js';
import Batch from '../schema/batches.model.js';
import { User } from '../schema/user.model.js';

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
    const discountPercent = offer.discountPercent || 10;
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
        title: signal?.batchTitle || batch?.title || 'IIT JEE Advanced Super Batch',
        description: batch?.description || 'Official Course Enrollment',
        imageUrl: batch?.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
        category: batch?.category || 'Competitive Exams',
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
    const discountPercent = offer.discountPercent || 10;
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
      classId: batch?._id || offer.batchId,
      price: discountedAmountPaise / 100,
      title: signal?.batchTitle || batch?.title || 'Course Enrollment',
      discountPercent,
    });
  } catch (err) {
    console.error('Create public recovery order error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST verify public recovery payment & auto-login user (No pre-existing login required)
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
        purchases: [{ classId: offer.batchId, price: offer.discountPercent }],
      });
    } else {
      const alreadyPurchased = user.purchases?.some((p) => String(p.classId) === String(offer.batchId));
      if (!alreadyPurchased) {
        user.purchases.push({ classId: offer.batchId, price: offer.discountPercent });
        await user.save();
      }
    }

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
    });
  } catch (err) {
    console.error('Public recovery payment verify error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
