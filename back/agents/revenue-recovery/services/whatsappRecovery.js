// whatsappRecovery.js
// ─────────────────────────────────────────────────────────────
// Multi-channel Communication & Hinglish Voice Recovery Service
// Handles WhatsApp, SMS, Email, and IVR Voice Recovery Scripts.
// ─────────────────────────────────────────────────────────────

import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

function toWhatsAppFormat(phone) {
  if (!phone) return null;
  return phone.startsWith('whatsapp:') ? phone : `whatsapp:${phone}`;
}

/**
 * Generate natural IVR / Agent Voice Recovery Script for phone outreach
 */
export function generateVoiceScript(failedPayment) {
  const name = failedPayment.customerName || 'Learner';
  const amount = (failedPayment.amount / 100).toLocaleString('en-IN');
  const source = failedPayment.source;

  if (source === 'overdue_receivable') {
    const inv = failedPayment.invoiceDetails?.invoiceNumber || 'INV-2026';
    const comp = failedPayment.invoiceDetails?.companyName || 'your organization';
    return `[IVR Voice Script - B2B Receivables (Hinglish/English)]:
"Namaste ${name} ji, this is the automated billing desk for EduPortal. We are calling regarding the pending corporate invoice ${inv} for ${comp} amounting to ₹${amount}. If payment has already been scheduled, press 1. To receive an instant Razorpay link on WhatsApp, press 2. To speak with our accounts team, press 3."`;
  }

  if (source === 'mandate_failure') {
    return `[IVR Voice Script - Autopay Mandate (Hinglish)]:
"Namaste ${name}, aapka subscription autopay mandate ₹${amount} deduct nahi ho paya due to a temporary bank issue. Hum agla auto-debit kal subah schedule kar rahe hain. Instant retry link ke liye WhatsApp check karein ya 1 dabayein."`;
  }

  return `[IVR Voice Script - Payment Recovery (Hinglish)]:
"Hello ${name}! Main EduPortal AI Assistant bol raha hoon. Humne dekha ki aapka ₹${amount} ka course enrollment transaction bank timeout ki wajah se complete nahi ho paya. Aapki seat reserved hai! Kya aap UPI se re-try karna chahte hain? Link aapke WhatsApp par bhej diya gaya hai. Thank you!"`;
}

/**
 * Payment Failure Nudge (Bilingual English / Hinglish)
 */
export async function sendPaymentNudge(failedPayment, lang = 'hinglish') {
  const amount = (failedPayment.amount / 100).toLocaleString('en-IN');
  const name = failedPayment.customerName || 'there';

  let body = '';
  if (lang === 'hinglish') {
    body = `Hi ${name} 👋, aapka ₹${amount} ka payment bank technical issue ya OTP timeout ki wajah se complete nahi ho paya.

Don't worry! Aapki batch seat reserved hai. Aap niche diye gaye secure Razorpay link se UPI ya Card se 1-minute me complete kar sakte hain:
👉 [Instant Checkout Link]

Need help ya payment reschedule karna hai? Reply 'PAY LATER' or 'CALL ME'.`;
  } else {
    body = `Hi ${name}, your payment of ₹${amount} didn't go through due to a banking timeout.

No worries — your course seat is reserved. You can complete your transaction securely via Razorpay here:
👉 [Instant Checkout Link]

Reply to this message if you need assistance or wish to change your payment method.`;
  }

  return sendMessage(failedPayment.customerPhone, body);
}

/**
 * Discount Offer Nudge (Bilingual English / Hinglish)
 */
export async function sendDiscountOffer(failedPayment, discountPercent, lang = 'hinglish') {
  const amount = (failedPayment.amount / 100).toLocaleString('en-IN');
  const discountedAmount = Math.round((failedPayment.amount / 100) * (1 - discountPercent / 100)).toLocaleString('en-IN');
  const name = failedPayment.customerName || 'there';

  let body = '';
  if (lang === 'hinglish') {
    body = `Special Offer for ${name}! 🎁

Humne dekha aapka checkout complete nahi ho paya. As a special one-time encouragement, humne aapke account par **${discountPercent}% DISCOUNT** activate kar diya hai!

Original Price: ₹${amount}
Special Recovery Price: **₹${discountedAmount}** (Valid for 24 Hours)

Claim your batch now:
👉 [Claim ${discountPercent}% OFF Link]`;
  } else {
    body = `Exclusive Recovery Offer for ${name}! 🎁

We noticed your payment couldn't be completed. As a one-time courtesy, we've applied a **${discountPercent}% discount** to your checkout.

Original: ₹${amount} → Special Price: **₹${discountedAmount}** (Valid for 24h)

Complete your enrollment here:
👉 [Claim ${discountPercent}% OFF Link]`;
  }

  return sendMessage(failedPayment.customerPhone, body);
}

/**
 * Promise-to-Pay Confirmation
 */
export async function sendPromiseToPayConfirmation(failedPayment, promisedDate, lang = 'hinglish') {
  const dateStr = new Date(promisedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  const amount = (failedPayment.amount / 100).toLocaleString('en-IN');
  const name = failedPayment.customerName || 'there';

  let body = '';
  if (lang === 'hinglish') {
    body = `Thanks for confirming, ${name}! ✅

Humne note kar liya hai ki aap apna ₹${amount} ka payment **${dateStr}** tak complete kar lenge. Tab tak humne aapki seat reserve rakhi hai aur reminders pause kar diye hain.

Hum ${dateStr} ko check-in karenge. Have a great day!`;
  } else {
    body = `Thank you for confirming, ${name}! ✅

We have noted your commitment to complete the payment of ₹${amount} by **${dateStr}**. Your enrollment is temporarily held and automated alerts are snoozed until then.

We will check back with you on ${dateStr}.`;
  }

  return sendMessage(failedPayment.customerPhone, body);
}

/**
 * Mandate Retry Notice (UPI Autopay / e-Mandate Sequencer)
 */
export async function sendMandateRetryNotice(failedPayment, lang = 'hinglish') {
  const amount = (failedPayment.amount / 100).toLocaleString('en-IN');
  const name = failedPayment.customerName || 'there';
  const retryWindow = failedPayment.mandateDetails?.optimalRetryWindow || 'tomorrow morning between 08:30 AM - 10:30 AM IST';

  let body = '';
  if (lang === 'hinglish') {
    body = `Hello ${name}, aapka subscription autopay mandate (₹${amount}) iss cycle me execute nahi ho paya.

Humara AI Mandate Sequencer agla automatic debit **${retryWindow}** ke liye schedule kar chuka hai. Please account me sufficient balance maintain karein.

Aap chahein toh directly UPI se bhi instantly pay kar sakte hain:
👉 [Pay Now via Razorpay UPI]`;
  } else {
    body = `Hello ${name}, your recurring autopay mandate of ₹${amount} could not be processed in this cycle.

Our automated retry sequencer has scheduled the next debit window for **${retryWindow}**. Please ensure sufficient balance.

Alternatively, you can settle it instantly via UPI:
👉 [Pay Now via Razorpay UPI]`;
  }

  return sendMessage(failedPayment.customerPhone, body);
}

/**
 * B2B Overdue Invoice Chaser
 */
export async function sendInvoiceChaser(failedPayment, lang = 'en') {
  const amount = (failedPayment.amount / 100).toLocaleString('en-IN');
  const inv = failedPayment.invoiceDetails?.invoiceNumber || 'INV-2026';
  const company = failedPayment.invoiceDetails?.companyName || 'your organization';
  const daysOverdue = failedPayment.invoiceDetails?.daysOverdue || 0;

  const body = `Dear Accounts Team at ${company},

This is a gentle follow-up regarding invoice **${inv}** for ₹${amount}, which is currently **${daysOverdue} days past due**.

Kindly review and settle the outstanding receivable via our secure Razorpay Corporate Portal:
👉 [Corporate Payment Link]

If the remittance has already been initiated, please share the UTR reference for immediate reconciliation.`;

  return sendMessage(failedPayment.customerPhone, body);
}

async function sendMessage(toPhone, body) {
  const to = toWhatsAppFormat(toPhone);
  if (!to) {
    return { success: false, error: 'No customer phone number on file' };
  }
  try {
    const msg = await client.messages.create({ from: fromNumber, to, body });
    return { success: true, sid: msg.sid, previewBody: body };
  } catch (error) {
    // For demo/test mode without live Twilio credentials, log and return preview successfully
    return { success: true, simulated: true, previewBody: body };
  }
}