# Features 3–5: safe conversational checkout, policy controls, and audit trail

## 3. Conversational checkout

1. A learner receives up to three live recommendations.
2. Selecting **Checkout safely** creates a server-side checkout intent, but never starts a payment.
3. The chatbot shows the exact batch and current price and requires a second explicit **Confirm and continue** action.
4. On confirmation, the server re-reads the live product. If availability changed, ownership changed, or price changed, checkout stops with an honest message.
5. Only after confirmation does the learner enter the existing batch page and its established enrolment/Razorpay flow.

Free batches retain their direct-enrolment flow. Paid batches retain Razorpay test checkout. The AI does not create a payment or edit a price.

## 4. Bounded pricing and actions

- Razorpay order creation resolves the title and amount from MongoDB; the browser's amount/title are ignored.
- Only an active, paid product may create an order. Free products cannot enter Razorpay checkout.
- The existing policy's `maxDiscountPercent` is enforced through `POST /api/commerce/discount-requests`.
- A within-limit discount request is **pending human approval**; it never changes a product price automatically.
- An over-limit request is blocked and logged. The policy/limits remain visible in the existing Revenue Recovery dashboard.

## 5. Auditability and failures

`CommerceAudit` records: recommendations, checkout intent, confirmation/cancellation, discount request, Razorpay order creation/failure, and verified payment. Each record contains product/price snapshot, reason, gate decision, policy explanation, timestamp, and metadata.

Open `/commerce-audit` as an admin to inspect the latest 200 commerce events. The existing Revenue Recovery dashboard continues to show the separate failed-payment agent audit and graceful failure path.

## Checkout corrections included

- Fixed the undefined `PaymentAttempt` model reference.
- Note-batch checkout now uses its `slug` as `batchId`.
- Note-batch and dynamic batch popups use the server-returned Razorpay order amount rather than a browser-calculated amount.
- A successful verified payment updates its `PaymentAttempt` to `paid`.
