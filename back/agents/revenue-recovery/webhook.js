// webhook.js
// Must be mounted in index.js BEFORE app.use(express.json()).

import express from 'express';
import crypto from 'crypto';
import FailedPayment from './schema/FailedPayment.model.js';
import { processSignal } from './services/orchestrator.js';

const router = express.Router();

router.post('/webhook/razorpay', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!secret) {
    console.error('RAZORPAY_WEBHOOK_SECRET is not set');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  const expected = crypto.createHmac('sha256', secret).update(req.body).digest('hex');
  if (signature !== expected) {
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  const payload = JSON.parse(req.body.toString());

  if (payload.event === 'payment.failed') {
    const p = payload.payload.payment.entity;
    const signal = await FailedPayment.create({
      source: 'payment_failure',
      razorpayOrderId: p.order_id,
      razorpayPaymentId: p.id,
      amount: p.amount,
      currency: p.currency,
      customerEmail: p.email,
      customerPhone: p.contact,
      failureReason: p.error_reason || p.error_code || 'unknown',
      rawPayload: p,
    });

    processSignal(signal._id).catch((err) => console.error('Agent processing error:', err));
  }

  res.status(200).json({ received: true });
});

export default router;