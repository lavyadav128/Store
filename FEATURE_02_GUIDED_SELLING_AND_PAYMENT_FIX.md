# Feature 2: Guided selling and Razorpay order fix

## Guided selling

- The Study Copilot has a **Find a course for my goal** action.
- It calls `POST /api/recommendations`, which uses the live catalog created in Feature 1.
- Matching is deterministic and returns at most three active products. It does not call the LLM, preventing course recommendations from consuming the chatbot's model quota.
- Every result shows the reason, current price, product type, and a direct **View batch** action.
- Products already owned by the signed-in learner remain excluded by the server.

## Razorpay order fix

`/api/create-order` imported `PaymentAttemptModel` but attempted to save through an undefined `PaymentAttempt` variable. This caused a server-side error after Razorpay created an order and prevented the checkout popup flow from completing. The route now imports and saves with the same `PaymentAttempt` model.

Note-batch checkout now sends its actual `slug` as `batchId`; it previously sent an undefined `batch.id`, which could cause the order request to be rejected.
