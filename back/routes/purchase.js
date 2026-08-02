// // Importing required modules and dependencies
// import express from 'express'; // Express for creating routes
// import Purchase from '../schema/purchase.model.js'; // Mongoose model for handling purchases
// import auth from '../controller/authh.js'; // Custom auth middleware for protecting routes
// import { User } from '../schema/user.model.js'; // Mongoose model for user data
// import { sendWhatsAppMessage } from '../services/twilioservice.js'; // Twilio service for sending WhatsApp notifications
// import * as Sentry from '@sentry/node';
// import crypto from 'crypto';
// // Create a new Express router
// const router = express.Router();

// //  POST /api/save-purchase
// // router.post('/save-purchase', auth, async (req, res) => {
// //   // Destructure required fields from request body
// //   const { classId, batchTitle, price, description, imageUrl, isPremium } = req.body;

// //   // Extract userId from the decoded JWT payload (set in auth middleware)
// //   const userId = req.user._id;

// //   // Log incoming purchase payload for debugging
// //   console.log(" Purchase Payload:", {
// //     classId, batchTitle, price, description, imageUrl, isPremium,
// //   });

// //   try {
// //     // Calculate expiry date (10 months from now)
// //     const expiryDate = new Date();
// //     expiryDate.setMonth(expiryDate.getMonth() + 10);

// //     // Construct purchase object with fallbacks
// //     const purchaseData = {
// //       userId,
// //       classId,
// //       title: batchTitle,
// //       price: price || 0,
// //       description: description || '',
// //       imageUrl: imageUrl || '',
// //       expiryDate,
// //       isPremium: !!isPremium, //  Ensure it's stored as a boolean
// //     };

// //     // Upsert (update if exists, otherwise insert) the purchase entry
// //     await Purchase.findOneAndUpdate(
// //       { userId, classId },          // Match on user and class
// //       { $set: purchaseData },       // Set new values
// //       { upsert: true, new: true }   // Insert if not exists, and return the new document
// //     );

// //     // If the purchase has a price > 0, send a WhatsApp confirmation
// //     if (price > 0) {
// //       const user = await User.findById(userId); // Find user by ID
// //       if (user?.phone) {                        // If user has a phone number
// //         const formattedPhone = `whatsapp:+91${user.phone}`; // Format number for WhatsApp
// //         await sendWhatsAppMessage(batchTitle, formattedPhone); // Send message
// //       }
// //     }

// //     // Respond with success
// //     res.status(200).json({ message: 'Purchase saved' });
// //   } catch (err) {
// //     // Log and handle errors
// //     console.error(" Error saving purchase:", err);
// //     res.status(500).json({ error: 'Server error' });
// //   }
// // });

// //  POST /api/save-purchase
// router.post('/save-purchase', auth, async (req, res) => {
//   // Destructure required fields from request body
//   const {
//     classId, batchTitle, price, description, imageUrl, isPremium,
//     // These 3 come from Razorpay's popup after a successful PAID payment.
//     // Free purchases (price 0) won't have these — that's fine, see below.
//     razorpay_order_id, razorpay_payment_id, razorpay_signature,
//   } = req.body;

//   // Extract userId from the decoded JWT payload (set in auth middleware)
//   const userId = req.user._id;

//   // Log incoming purchase payload for debugging
//   console.log(" Purchase Payload:", {
//     classId, batchTitle, price, description, imageUrl, isPremium,
//   });

//   try {
//     // ═══════════════════════════════════════════════════════════
//     // PAID PURCHASE: verify the payment is real before saving anything
//     // ═══════════════════════════════════════════════════════════
//     if (price > 0) {
//       if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//         // Someone is calling this route directly without ever going through
//         // Razorpay's actual payment flow — reject immediately.
//         return res.status(400).json({ error: 'Missing payment verification details' });
//       }

//       // Razorpay signs order_id + payment_id using YOUR secret key (RAZORPAY_SECRET).
//       // We recompute that same signature here. If it matches what the frontend
//       // sent, the payment is provably genuine — nobody can fake this without
//       // knowing your secret key, which never leaves the backend.
//       const expectedSignature = crypto
//         .createHmac('sha256', process.env.RAZORPAY_SECRET)
//         .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//         .digest('hex');

//       if (expectedSignature !== razorpay_signature) {
//         console.error('❌ Payment signature mismatch — possible forged request', { userId, classId });
//         Sentry.captureMessage('Payment signature mismatch (possible fraud attempt)', 'warning');
//         return res.status(400).json({ error: 'Payment verification failed' });
//       }

//       // ── IDEMPOTENCY CHECK ──
//       // Has this EXACT payment already been recorded? If yes, this call is a
//       // retry (double-click, network retry, etc.) — return success immediately
//       // WITHOUT re-sending the WhatsApp message or touching the database again.
//       const alreadyProcessed = await Purchase.findOne({ razorpayPaymentId: razorpay_payment_id });
//       if (alreadyProcessed) {
//         console.log(`🔁 Duplicate save-purchase call for payment ${razorpay_payment_id} — already processed, skipping`);
//         return res.status(200).json({ message: 'Purchase already saved' });
//       }
//     }

//     // Calculate expiry date (10 months from now)
//     const expiryDate = new Date();
//     expiryDate.setMonth(expiryDate.getMonth() + 10);

//     // Construct purchase object with fallbacks
//     const purchaseData = {
//       userId,
//       classId,
//       title: batchTitle,
//       price: price || 0,
//       description: description || '',
//       imageUrl: imageUrl || '',
//       expiryDate,
//       isPremium: !!isPremium, //  Ensure it's stored as a boolean
//       // Only attach a payment ID for paid purchases — free ones stay
//       // undefined, which the schema's sparse index is fine with.
//       ...(price > 0 && { razorpayPaymentId: razorpay_payment_id }),
//     };

//     // Upsert (update if exists, otherwise insert) the purchase entry
//     await Purchase.findOneAndUpdate(
//       { userId, classId },          // Match on user and class
//       { $set: purchaseData },       // Set new values
//       { upsert: true, new: true }   // Insert if not exists, and return the new document
//     );

//     // If the purchase has a price > 0, send a WhatsApp confirmation
//     // (only reached the FIRST time this payment is processed, thanks to the
//     // idempotency check above — never fires again on a retry)
//     if (price > 0) {
//       const user = await User.findById(userId); // Find user by ID
//       if (user?.phone) {                        // If user has a phone number
//         const formattedPhone = `whatsapp:+91${user.phone}`; // Format number for WhatsApp
//         await sendWhatsAppMessage(batchTitle, formattedPhone); // Send message
//       }
//     }

//     // Respond with success
//     res.status(200).json({ message: 'Purchase saved' });
//   } catch (err) {
//     // If two requests for the SAME payment somehow race each other and both
//     // slip past the idempotency check above before either finishes writing,
//     // the unique index on razorpayPaymentId catches it here (MongoDB error
//     // code 11000 = duplicate key). That's not a real failure — the purchase
//     // WAS saved by the other request — so we respond with success, not 500.
//     if (err.code === 11000) {
//       console.log('🔁 Race condition on duplicate payment — safely ignored');
//       return res.status(200).json({ message: 'Purchase already saved' });
//     }

//     // Log and handle errors
//     console.error(" Error saving purchase:", err);
//     Sentry.captureException(err); // this is a PAID transaction failing to save — high priority to catch
//     res.status(500).json({ error: 'Server error' });
//   }
// });



// //  GET /api/user-purchases
// router.get('/user-purchases', auth, async (req, res) => {
//   // Extract userId from JWT payload
//   const userId = req.user._id;

//   try {
//     const now = new Date(); // Current time
//     // Fetch all non-expired purchases for the user
//     const purchases = await Purchase.find({
//       userId,
//       expiryDate: { $gt: now }, // Only include non-expired
//     }).select('classId title description imageUrl price expiryDate isPremium -_id'); 
//     //  Only select required fields, excluding _id

//     // Send back the list of purchases
//     res.status(200).json(purchases);
//   } catch (err) {
//     // Handle error in fetching
//     console.error(err);
//     res.status(500).json({ error: 'Unable to fetch purchases' });
//   }
// });



// //  POST /api/purchase-access
// router.post('/purchase-access', auth, async (req, res) => {
//   // Extract classId from request and userId from token
//   const { classId } = req.body;
//   const userId = req.user._id;

//   try {
//     const now = new Date(); // Current date-time
//     // Find if the user has a valid (non-expired) purchase for this class
//     const purchase = await Purchase.findOne({
//       userId,
//       classId,
//       expiryDate: { $gt: now },
//     });

//     // Respond with access status (true/false)
//     res.status(200).json({ access: !!purchase });
//   } catch (err) {
//     // Handle server errors
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Export the router so it can be used in the main application
// export default router;


// Importing required modules and dependencies
import express from 'express'; // Express for creating routes
import Purchase from '../schema/purchase.model.js'; // Mongoose model for handling purchases
import auth from '../controller/authh.js'; // Custom auth middleware for protecting routes
import { User } from '../schema/user.model.js'; // Mongoose model for user data
import Batch from '../schema/batches.model.js'; // Needed to resolve static routes (e.g. /dsa) back to a batchId
import { sendWhatsAppMessage } from '../services/twilioservice.js'; // Twilio service for sending WhatsApp notifications
import * as Sentry from '@sentry/node'; // Error monitoring — reports payment/purchase failures
import crypto from 'crypto'; // Node's built-in crypto module — used to verify Razorpay's payment signature

// Create a new Express router
const router = express.Router();

//  POST /api/save-purchase
router.post('/save-purchase', auth, async (req, res) => {
  // Destructure required fields from request body
  const {
    classId, batchTitle, price, description, imageUrl, isPremium,
    // These 3 come from Razorpay's popup after a successful PAID payment.
    // Free purchases (price 0) won't have these — that's fine, see below.
    razorpay_order_id, razorpay_payment_id, razorpay_signature,
  } = req.body;

  // Extract userId from the decoded JWT payload (set in auth middleware)
  const userId = req.user._id;

  // Log incoming purchase payload for debugging
  console.log(" Purchase Payload:", {
    classId, batchTitle, price, description, imageUrl, isPremium,
  });

  try {
    // ═══════════════════════════════════════════════════════════
    // PAID PURCHASE: verify the payment is real before saving anything
    // ═══════════════════════════════════════════════════════════
    if (price > 0) {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ error: 'Missing payment verification details' });
      }

      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        console.error('❌ Payment signature mismatch — possible forged request', { userId, classId });
        Sentry.captureMessage('Payment signature mismatch (possible fraud attempt)', 'warning');
        return res.status(400).json({ error: 'Payment verification failed' });
      }

      const alreadyProcessed = await Purchase.findOne({ razorpayPaymentId: razorpay_payment_id });
      if (alreadyProcessed) {
        console.log(`🔁 Duplicate save-purchase call for payment ${razorpay_payment_id} — already processed, skipping`);
        return res.status(200).json({ message: 'Purchase already saved' });
      }
    }

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 10);

    const purchaseData = {
      userId,
      classId,
      title: batchTitle,
      price: price || 0,
      description: description || '',
      imageUrl: imageUrl || '',
      expiryDate,
      isPremium: !!isPremium,
      ...(price > 0 && { razorpayPaymentId: razorpay_payment_id }),
    };

    await Purchase.findOneAndUpdate(
      { userId, classId },
      { $set: purchaseData },
      { upsert: true, new: true }
    );

    if (price > 0) {
      const user = await User.findById(userId);
      if (user?.phone) {
        const formattedPhone = `whatsapp:+91${user.phone}`;
        await sendWhatsAppMessage(batchTitle, formattedPhone);
      }
    }

    res.status(200).json({ message: 'Purchase saved' });
  } catch (err) {
    if (err.code === 11000) {
      console.log('🔁 Race condition on duplicate payment — safely ignored');
      return res.status(200).json({ message: 'Purchase already saved' });
    }

    console.error(" Error saving purchase:", err);
    Sentry.captureException(err);
    res.status(500).json({ error: 'Server error' });
  }
});



//  GET /api/user-purchases
router.get('/user-purchases', auth, async (req, res) => {
  const userId = req.user._id;

  try {
    const now = new Date();
    const purchases = await Purchase.find({
      userId,
      expiryDate: { $gt: now },
    }).select('classId title description imageUrl price expiryDate isPremium -_id');

    res.status(200).json(purchases);
  } catch (err) {
    console.error(err);
    Sentry.captureException(err);
    res.status(500).json({ error: 'Unable to fetch purchases' });
  }
});



//  POST /api/purchase-access
router.post('/purchase-access', auth, async (req, res) => {
  // Two ways this route gets called:
  //  1. classId directly — for content with a dynamic URL, e.g. /class/:classId
  //  2. redirectPath — for STATIC routes like /dsa, /web, /data-analysis,
  //     /aptitude, which don't carry a classId in the URL at all. The admin
  //     configures a fixed "redirectPath" per batch (see batches.model.js),
  //     so we look up which batch owns this exact path to find its classId.
  const { classId, redirectPath } = req.body;
  const userId = req.user._id;

  try {
    const now = new Date();
    let targetClassId = classId;

    if (!targetClassId && redirectPath) {
      const batch = await Batch.findOne({ redirectPath });
      if (!batch) {
        return res.status(200).json({ access: false });
      }
      targetClassId = batch.batchId;
    }

    if (!targetClassId) {
      return res.status(400).json({ error: 'classId or redirectPath is required' });
    }

    const purchase = await Purchase.findOne({
      userId,
      classId: targetClassId,
      expiryDate: { $gt: now },
    });

    res.status(200).json({ access: !!purchase });
  } catch (err) {
    console.error(err);
    Sentry.captureException(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Export the router so it can be used in the main application
export default router;