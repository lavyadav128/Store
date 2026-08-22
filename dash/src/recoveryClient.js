import server from './environment';

// Sends only identifiers returned by Razorpay. The backend verifies that the
// logged-in student owns the original order before making a recovery signal.
export async function reportCheckoutFailure(orderId, response) {
  const token = localStorage.getItem('token');
  if (!token || !orderId) return;
  const error = response?.error || {};
  await fetch(`${server}/api/recovery/payment-failed`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ razorpayOrderId: orderId, razorpayPaymentId: error.metadata?.payment_id || null, reason: error.reason || error.description || 'payment_failed' }),
  }).catch(() => {});
}
