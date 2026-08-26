// actionService.js
import razorpayTest from './razorpayTestClient.js';
import {
  sendPaymentNudge,
  sendDiscountOffer,
  sendPromiseToPayConfirmation,
  sendMandateRetryNotice,
  sendInvoiceChaser,
  generateVoiceScript,
} from './whatsappRecovery.js';

export async function executeAction(failedPayment, action, options = {}) {
  try {
    // Generate and attach voice recovery script
    if (!failedPayment.voiceScript) {
      failedPayment.voiceScript = generateVoiceScript(failedPayment);
    }

    const lang = failedPayment.language || 'hinglish';

    switch (action.type) {
      case 'retry_now':
      case 'retry_later':
        return await retryPayment(failedPayment);

      case 'nudge_customer':
        return await nudgeCustomer(failedPayment, lang);

      case 'offer_discount':
        return await offerDiscount(failedPayment, action.params?.discountPercent || 10, lang);

      case 'schedule_mandate':
        return await scheduleMandate(failedPayment, lang);

      case 'chase_invoice':
        return await chaseInvoice(failedPayment);

      case 'escalate_human':
        return { success: true, result: { escalated: true, reason: 'Escalated to human review queue' } };

      case 'give_up':
        return { success: true, result: { closed: true, reason: 'Signal closed after max policy exhaustion' } };

      default:
        return { success: false, error: `Unknown action type: ${action.type}` };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function retryPayment(failedPayment) {
  const link = await razorpayTest.paymentLink.create({
    amount: failedPayment.amount,
    currency: failedPayment.currency || 'INR',
    description: `Retry payment (attempt ${failedPayment.attempts + 1})`,
    customer: {
      name: failedPayment.customerName || 'Customer',
      email: failedPayment.customerEmail || undefined,
      contact: failedPayment.customerPhone || undefined,
    },
    notify: { sms: false, email: false },
  });

  return { success: true, result: { paymentLinkId: link.id, shortUrl: link.short_url } };
}

async function nudgeCustomer(failedPayment, lang) {
  const res = await sendPaymentNudge(failedPayment, lang);
  if (!res.success) throw new Error(res.error);
  return { success: true, result: res };
}

async function offerDiscount(failedPayment, discountPercent, lang) {
  const res = await sendDiscountOffer(failedPayment, discountPercent, lang);
  if (!res.success) throw new Error(res.error);
  return { success: true, result: { ...res, discountPercent } };
}

async function scheduleMandate(failedPayment, lang) {
  const res = await sendMandateRetryNotice(failedPayment, lang);
  if (!res.success) throw new Error(res.error);
  return {
    success: true,
    result: {
      mandateScheduled: true,
      window: failedPayment.mandateDetails?.optimalRetryWindow || '08:30 AM - 10:30 AM IST',
      ...res,
    },
  };
}

async function chaseInvoice(failedPayment) {
  const res = await sendInvoiceChaser(failedPayment);
  if (!res.success) throw new Error(res.error);
  return {
    success: true,
    result: {
      invoiceChased: true,
      invoiceNumber: failedPayment.invoiceDetails?.invoiceNumber || 'INV-2026',
      daysOverdue: failedPayment.invoiceDetails?.daysOverdue || 0,
      ...res,
    },
  };
}

export async function confirmPromiseToPay(failedPayment, promisedDate) {
  const res = await sendPromiseToPayConfirmation(failedPayment, promisedDate, failedPayment.language || 'hinglish');
  return res;
}