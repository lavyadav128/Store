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
    // Generate and attach voice recovery script if not present
    if (!failedPayment.voiceScript) {
      failedPayment.voiceScript = generateVoiceScript(failedPayment);
    }

    const lang = failedPayment.language || 'hinglish';

    switch (action.type) {
      case 'retry_now':
        failedPayment.status = 'recovering';
        await failedPayment.save();
        return await retryPayment(failedPayment);

      case 'retry_later': {
        const delayMins = action.params?.delayMinutes || 30;
        failedPayment.scheduledFor = new Date(Date.now() + delayMins * 60000);
        failedPayment.status = 'recovering';
        await failedPayment.save();
        return {
          success: true,
          result: {
            scheduled: true,
            scheduledFor: failedPayment.scheduledFor,
            delayMinutes: delayMins,
            message: `Retry scheduled for ${failedPayment.scheduledFor.toLocaleString('en-IN')}`,
          },
        };
      }

      case 'nudge_customer':
        failedPayment.status = 'recovering';
        await failedPayment.save();
        return await nudgeCustomer(failedPayment, lang);

      case 'offer_discount': {
        failedPayment.status = 'recovering';
        await failedPayment.save();
        return await offerDiscount(failedPayment, action.params?.discountPercent || 10, lang);
      }

      case 'schedule_mandate': {
        const nextRetry = new Date(Date.now() + 12 * 3600 * 1000);
        if (!failedPayment.mandateDetails) failedPayment.mandateDetails = {};
        failedPayment.mandateDetails.nextScheduledRetry = nextRetry;
        failedPayment.scheduledFor = nextRetry;
        failedPayment.status = 'recovering';
        await failedPayment.save();
        return await scheduleMandate(failedPayment, lang);
      }

      case 'chase_invoice':
        failedPayment.status = 'recovering';
        await failedPayment.save();
        return await chaseInvoice(failedPayment);

      case 'escalate_human':
        failedPayment.status = 'escalated';
        await failedPayment.save();
        return { success: true, result: { escalated: true, reason: 'Escalated to human review queue' } };

      case 'give_up':
        failedPayment.status = 'lost';
        await failedPayment.save();
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
  return { success: res.success, result: res, error: res.error };
}

async function offerDiscount(failedPayment, discountPercent, lang) {
  const res = await sendDiscountOffer(failedPayment, discountPercent, lang);
  return { success: res.success, result: { ...res, discountPercent }, error: res.error };
}

async function scheduleMandate(failedPayment, lang) {
  const res = await sendMandateRetryNotice(failedPayment, lang);
  return {
    success: res.success,
    result: {
      mandateScheduled: true,
      window: failedPayment.mandateDetails?.optimalRetryWindow || '08:30 AM - 10:30 AM IST',
      ...res,
    },
    error: res.error,
  };
}

async function chaseInvoice(failedPayment) {
  const res = await sendInvoiceChaser(failedPayment);
  return {
    success: res.success,
    result: {
      invoiceChased: true,
      invoiceNumber: failedPayment.invoiceDetails?.invoiceNumber || 'INV-2026',
      daysOverdue: failedPayment.invoiceDetails?.daysOverdue || 0,
      ...res,
    },
    error: res.error,
  };
}

export async function confirmPromiseToPay(failedPayment, promisedDate) {
  const res = await sendPromiseToPayConfirmation(failedPayment, promisedDate, failedPayment.language || 'hinglish');
  return res;
}