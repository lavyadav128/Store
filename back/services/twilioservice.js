// /back/services/twilioservice.js
import twilio from 'twilio';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (accountSid && authToken && !accountSid.includes('your_') && !authToken.includes('your_')) {
    try {
      return twilio(accountSid, authToken);
    } catch (err) {
      console.warn('Twilio initialization warning:', err.message);
    }
  }
  return null;
}

/**
 * Format phone number into whatsapp format.
 */
function formatWhatsAppNumber(phone) {
  if (!phone) return null;
  const cleaned = String(phone).replace(/[^\d+]/g, '');
  if (cleaned.startsWith('whatsapp:')) return cleaned;
  if (cleaned.startsWith('+')) return `whatsapp:${cleaned}`;
  if (cleaned.length === 10) return `whatsapp:+91${cleaned}`;
  return `whatsapp:+${cleaned}`;
}

/**
 * Generic WhatsApp Message Dispatcher
 */
export async function sendWhatsAppMessage(messageText, recipientPhone) {
  const to = formatWhatsAppNumber(recipientPhone);
  if (!to) {
    console.warn('Cannot send WhatsApp message: Invalid phone number', recipientPhone);
    return { success: false, reason: 'Invalid phone number' };
  }

  const client = getTwilioClient();
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

  if (client) {
    try {
      const response = await client.messages.create({
        body: messageText,
        from: fromNumber,
        to: to,
      });

      console.log(`📱 WhatsApp message sent to ${to}! (SID: ${response.sid})`);
      return { success: true, sid: response.sid };
    } catch (err) {
      console.error(`❌ Twilio WhatsApp send error for ${to}:`, err.message);
      return { success: false, error: err.message };
    }
  }

  console.log(`📱 [Simulated WhatsApp Dispatch] To: ${to}\nMessage: ${messageText}`);
  return { success: true, simulated: true };
}

/**
 * Dispatch Client Payment Request via WhatsApp
 */
export async function sendClientPaymentWhatsApp({ clientName, clientPhone, projectTitle, projectCode, amount, paymentLink }) {
  const msg = `👋 Hi ${clientName || 'Client'},\n\nYour project *"${projectTitle}"* (Code: *${projectCode}*) is approved & ready.\n\n💰 *Amount Due:* ₹${amount.toLocaleString()}\n\n🔗 *Clickable Payment Link:*\n${paymentLink}\n\nDeliverables and complete source code unlock immediately upon payment. Thank you!\n— *Project Studio*`;
  return sendWhatsAppMessage(msg, clientPhone);
}

/**
 * Dispatch Client Deliverables link via WhatsApp
 */
export async function sendClientDeliveryWhatsApp({ clientName, clientPhone, projectTitle, projectCode, deliveryUrl, repositoryUrl }) {
  const downloadUrl = repositoryUrl || deliveryUrl;
  const msg = `🎉 *Project Deliverables Unlocked!*\n\nHi ${clientName || 'Client'},\nThank you for your payment for *"${projectTitle}"* (Code: *${projectCode}*).\n\n🚀 *Live Web Application:*\n${deliveryUrl}\n\n📦 *Source Code Download (.zip):*\n${downloadUrl}\n\nAccess your deliverables anytime on your project portal.\n— *Project Studio*`;
  return sendWhatsAppMessage(msg, clientPhone);
}
