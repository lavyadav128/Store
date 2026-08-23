# EduPortal AI — Agentic Learning & Revenue Recovery Platform

An AI-powered edtech platform that helps students discover the right course, learn with a personalised assistant, make secure payments, and receive guided recovery support when a payment fails.

Built for the **Razorpay Buildathon — AI Revenue Recovery Track**.

## Problem

Students may leave a purchase unfinished because of a payment failure, checkout interruption, or uncertainty about the right course. Merchants lose revenue while students lose learning momentum.

EduPortal AI closes this gap with goal-based course guidance, secure Razorpay checkout, live failed-payment detection, admin-approved recovery offers, student notifications, retry links, and an assistant that understands the currently logged-in student's courses, interests, payments, and recovery status.

## Core Solution

```text
Student
  ↓
AI Course Guidance + Secure Checkout
  ↓
Razorpay Test Mode Payment
  ↓
Payment Success / Payment Failure
  ↓
Revenue Recovery Signal
  ↓
Admin Approval + Bounded Discount Offer
  ↓
Student Notification + Retry Checkout
  ↓
Verified Payment + Course Access
```

## Key Features

### AI Study & Commerce Assistant

- Answers study questions using course material and notes.
- Helps students decide between PCM and PCB using interests, strengths, and goals.
- Understands goals such as IIT JEE, JEE Main, NEET, DSA, and web development.
- Recommends live batches and note batches from MongoDB.
- Compares batches using real exam focus, audience, curriculum, and included features.
- Knows batches owned by the authenticated student.
- Gives current payment and recovery status for that student only.
- Keeps chat during the active login session; a new login starts a fresh conversation.

### Batch Intelligence

Every batch can store:

- Exam focus
- Target audience
- Learning outcomes
- Included features
- Price and availability

For example, the platform differentiates IIT JEE preparation (JEE Main + Advanced, PYQs, test series, mentorship, doubt support) from JEE Main-focused preparation (Main PYQs, practice, mocks, and performance analysis). Admin-entered batch data overrides category defaults.

### Secure Razorpay Checkout

- Backend creates Razorpay orders from database prices.
- Razorpay payment signatures are verified server-side.
- Course access is granted only after verification.
- Free batches use direct enrolment.
- Payment attempts are saved for support and recovery.
- Razorpay Test Mode supports a safe end-to-end demo.


### AI Revenue Recovery

- Detects verified failed-payment signals from Razorpay Test Mode.
- Shows customer, batch, amount, source, failure reason, attempts, and status in the admin dashboard.
- Tracks open, recovering, recovered, escalated, and closed/lost cases.
- Applies bounded policy controls for retry limits, cooldown, maximum discount percentage, and automatic-approval threshold.
- Automatically approves a bounded recovery discount when the failed amount is **₹5,000 or below**.
- Escalates payments **above ₹5,000** to the admin dashboard for explicit human approval.
- Maintains a complete audit trail showing the policy decision, reason, action, and result.
- Uses a responsive mobile signal feed while preserving the desktop dashboard layout.

### Recovery Offers and Approval Flow

1. A Razorpay payment fails and creates a recovery signal.
2. The policy engine checks the amount and recovery rules.
3. For failures of **₹5,000 or below**, the policy engine automatically approves a time-limited recovery discount and creates a student notification.
4. For failures **above ₹5,000**, the signal appears in the Revenue Recovery dashboard and waits for human/admin approval.
5. After automatic or human approval, the student sees a login popup and Notification Centre message.
6. The student claims a secure discounted retry checkout link.
7. The backend verifies the successful Razorpay payment signature before granting course access.
8. The recovery case is marked as recovered and the complete action history remains available in the audit trail.

The platform never automatically charges a student, grants access without verified payment, or promises a refund. Automatic approval is limited to the configured ₹5,000 threshold and bounded discount policy.

## Architecture

```text
React Frontend
      ↓
Express REST APIs
      ↓
MongoDB Database
      ↓
AI Assistant Context Engine
      ↓
Razorpay Test Mode
      ↓
Revenue Recovery Agent
      ↓
Admin Dashboard + Student Notifications
```

## Tech Stack

**Frontend:** React, Material UI, React Router, Axios, Socket.IO Client  
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Razorpay SDK, Socket.IO, Upstash Redis, AI/LLM integration

## Security and Reliability

- JWT-based authentication and protected admin routes
- Server-side price validation and Razorpay signature verification
- User-specific purchase, payment, and chatbot context
- Admin approval before recovery discounts
- Duplicate failed-payment protection
- Recovery audit trail
- No sensitive token logging

## Local Setup

### 1. Install backend dependencies

```bash
cd back
npm install
```

### 2. Configure `back/.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_SECRET=your_razorpay_test_key_secret

OPENAI_API_KEY=your_ai_key
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

Never commit real `.env` credentials to GitHub. Use `.env.example` in a public repository.

### 3. Start backend

```bash
npm run dev
```

### 4. Install and start frontend

```bash
cd ../dash
npm install
npm start
```

Backend: `http://localhost:5000`  
Frontend: `http://localhost:3000`

## Recommended Buildathon Demo

1.Student logs in and tells the AI assistant a learning goal.

T2.he assistant compares IIT JEE and JEE Main batches using live batch data, including exam focus, PYQs, test series, mentorship, and notes.

3.Student starts secure Razorpay Test Mode checkout.

3.A payment failure creates a live Revenue Recovery signal with the student, batch, amount, and failure reason.

4.The policy engine checks the failed amount:
    - If the amount is ₹5,000 or below, it automatically approves a bounded recovery discount, creates a student notification, and records the decision in the audit trail.
    - If the amount is above ₹5,000, it is escalated to the Revenue Recovery dashboard for explicit human/admin approval.

5.Admin can review high-value recovery signals, inspect the reasoning and audit trail, approve the recovery offer, and monitor recovery status.

6.Student receives a login popup and Notification Centre message with the approved discount retry link.

7.Student asks the chatbot about payment status and receives live information about the failed payment, approval status, available discount, and next safe action.

8.Student claims the discount, retries Razorpay checkout, receives verified course access after server-side signature validation, and the recovery case is marked as recovered.

## Buildathon Fit

### Primary Track: AI Revenue Recovery

The project detects failed payments, creates a bounded recovery workflow, requires human approval for discount offers, provides student communication, and records each decision in an audit trail.

### Additional Strength: AI Growth & Agentic Commerce

The assistant recommends suitable live courses, compares batches using real data, understands student goals, and guides students toward safe checkout actions.

## Future Improvements

- WhatsApp and email recovery reminders
- Public-deployment Razorpay webhooks
- Recovery conversion analytics
- Hinglish support
- Subscription and mandate-retry recovery
- Role-based administrative permissions

## Author

Built for the Razorpay Buildathon as an AI-powered learning and revenue-recovery platform.


## Screenshots

### AI Course Guidance

![AI Course Guidance](./screenshots/chatbot.png)

### IIT JEE vs JEE Main Comparison

![Batch Comparison](./screenshots/batch-comparison.png)

### Razorpay Test Checkout

![Razorpay Test Checkout](./screenshots/razorpay-checkout.png)

### AI Revenue Recovery Dashboard

![Revenue Recovery Dashboard](./screenshots/revenue-dashboard.png)

### Student Recovery Notification

![Recovery Notification](./screenshots/recovery-notification.png)
