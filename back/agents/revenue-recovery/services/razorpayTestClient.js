// razorpayTestClient.js
// Deliberately separate from the Razorpay instance in index.js.
// Uses RAZORPAY_TEST_KEY_ID / RAZORPAY_TEST_SECRET — your TEST MODE keys.
// Never reuse your live keys here.

import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

const razorpayTest = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export default razorpayTest;