import server from './environment';

// Sends only identifiers returned by Razorpay. The backend records the failure signal,
// automatically generates an instant recovery discount offer, dispatches multi-channel nudges,
// and returns the offer details to display an immediate popup on the screen.
export async function reportCheckoutFailure(orderId, response) {
  const token = localStorage.getItem('token');
  if (!token || !orderId) return;
  const error = response?.error || {};
  try {
    const res = await fetch(`${server}/api/recovery/payment-failed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        razorpayOrderId: orderId,
        razorpayPaymentId: error.metadata?.payment_id || null,
        reason: error.reason || error.description || 'payment_failed',
      }),
    });
    const data = await res.json();
    if (data?.offer) {
      window.dispatchEvent(new CustomEvent('recovery-discount-offer', { detail: data.offer }));
    }
  } catch (err) {
    console.warn('[RecoveryClient] Failed to report checkout failure:', err);
  }
}

