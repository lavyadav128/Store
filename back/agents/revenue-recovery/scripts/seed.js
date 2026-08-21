// seed.js
// Run with: node back/agents/revenue-recovery/scripts/seed.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FailedPayment from '../schema/FailedPayment.model.js';

dotenv.config();

const names = ['Rahul Sharma', 'Priya Nair', 'Amit Verma', 'Sneha Iyer', 'Karan Mehta', 'Divya Rao'];
const reasons = ['insufficient_funds', 'card_expired', 'network_error', 'bank_declined', 'otp_timeout'];

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomAmount() { return Math.floor((Math.random() * 9000 + 500) * 100); }
function randomPhone() { return `+9198${Math.floor(10000000 + Math.random() * 89999999)}`; }

const seeds = [
  ...Array.from({ length: 8 }).map(() => ({
    source: 'payment_failure',
    amount: randomAmount(),
    currency: 'INR',
    customerName: randomFrom(names),
    customerPhone: randomPhone(),
    failureReason: randomFrom(reasons),
  })),
  ...Array.from({ length: 8 }).map(() => ({
    source: 'checkout_dropoff',
    amount: randomAmount(),
    currency: 'INR',
    customerName: randomFrom(names),
    customerPhone: randomPhone(),
    failureReason: 'abandoned_before_payment',
  })),
  ...Array.from({ length: 6 }).map(() => ({
    source: 'subscription_failure',
    amount: randomAmount(),
    currency: 'INR',
    customerName: randomFrom(names),
    customerPhone: randomPhone(),
    failureReason: randomFrom(['insufficient_funds', 'card_expired']),
  })),
  ...Array.from({ length: 5 }).map(() => ({
    source: 'mandate_failure',
    amount: randomAmount(),
    currency: 'INR',
    customerName: randomFrom(names),
    customerPhone: randomPhone(),
    failureReason: 'mandate_debit_failed',
  })),
  ...Array.from({ length: 5 }).map(() => ({
    source: 'overdue_receivable',
    amount: Math.floor((Math.random() * 90000 + 10000) * 100),
    currency: 'INR',
    customerName: randomFrom(names) + ' (Business)',
    customerPhone: randomPhone(),
    failureReason: 'invoice_overdue',
  })),
  {
    source: 'overdue_receivable',
    amount: 800000 * 100,
    currency: 'INR',
    customerName: 'Enterprise Client Pvt Ltd',
    customerPhone: randomPhone(),
    failureReason: 'invoice_overdue',
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  await FailedPayment.deleteMany({});
  const created = await FailedPayment.insertMany(seeds);

  console.log(`✅ Seeded ${created.length} synthetic revenue-at-risk signals`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});