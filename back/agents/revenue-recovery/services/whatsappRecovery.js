// whatsappRecovery.js
import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

function toWhatsAppFormat(phone) {
  if (!phone) return null;
  return phone.startsWith('whatsapp:') ? phone : `whatsapp:${phone}`;
}

export async function sendPaymentNudge(failedPayment) {
  const amountRupees = (failedPayment.amount / 100).toFixed(2);
  const body = `Hi ${failedPayment.customerName || 'there'}, your payment of ₹${amountRupees} didn't go through. No worries — you can complete it anytime here: [checkout link]. Reply if you need help.`;
  return sendMessage(failedPayment.customerPhone, body);
}

export async function sendDiscountOffer(failedPayment, discountPercent) {
  const body = `Hi ${failedPayment.customerName || 'there'}, we noticed your payment didn't complete. As a one-time offer, here's ${discountPercent}% off if you finish your order in the next 24 hours: [checkout link].`;
  return sendMessage(failedPayment.customerPhone, body);
}

export async function sendPromiseToPayConfirmation(failedPayment, promisedDate) {
  const body = `Thanks for confirming! We've noted you'll complete the payment of ₹${(failedPayment.amount / 100).toFixed(2)} by ${new Date(promisedDate).toDateString()}. We'll check in then.`;
  return sendMessage(failedPayment.customerPhone, body);
}

export async function sendMandateRetryNotice(failedPayment) {
  const body = `Hi ${failedPayment.customerName || 'there'}, your autopay mandate debit didn't go through. We'll retry automatically — please make sure sufficient balance is available.`;
  return sendMessage(failedPayment.customerPhone, body);
}

async function sendMessage(toPhone, body) {
  const to = toWhatsAppFormat(toPhone);
  if (!to) {
    return { success: false, error: 'No customer phone number on file' };
  }
  try {
    const msg = await client.messages.create({ from: fromNumber, to, body });
    return { success: true, sid: msg.sid };
  } catch (error) {
    return { success: false, error: error.message };
  }
}