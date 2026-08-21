// actionService.js
import razorpayTest from './razorpayTestClient.js';
import {
  sendPaymentNudge,
  sendDiscountOffer,
  sendPromiseToPayConfirmation,
  sendMandateRetryNotice,
} from './whatsappRecovery.js';

export async function executeAction(failedPayment, action, options = {}) {
  try {
    if (options.simulateFailure) {
      throw new Error('SIMULATED_RAZORPAY_TIMEOUT: Razorpay API did not respond in time.');
    }

    switch (action.type) {
      case 'retry_now':
      case 'retry_later':
        return await retryPayment(failedPayment);

      case 'nudge_customer':
        return await nudgeCustomer(failedPayment);

      case 'offer_discount':
        return await offerDiscount(failedPayment, action.params?.discountPercent || 0);

      case 'escalate_human':
        return { success: true, result: { escalated: true } };

      case 'give_up':
        return { success: true, result: { closed: true } };

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

  if (failedPayment.customerPhone) {
    await sendMandateRetryNotice(failedPayment);
  }

  return { success: true, result: { paymentLinkId: link.id, shortUrl: link.short_url } };
}

async function nudgeCustomer(failedPayment) {
  const res = await sendPaymentNudge(failedPayment);
  if (!res.success) throw new Error(res.error);
  return { success: true, result: res };
}

async function offerDiscount(failedPayment, discountPercent) {
  const res = await sendDiscountOffer(failedPayment, discountPercent);
  if (!res.success) throw new Error(res.error);
  return { success: true, result: { ...res, discountPercent } };
}

export async function confirmPromiseToPay(failedPayment, promisedDate) {
  const res = await sendPromiseToPayConfirmation(failedPayment, promisedDate);
  return res;
}