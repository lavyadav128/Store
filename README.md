# EduPortal AI — Agentic Learning & Revenue Recovery Platform

An AI-powered edtech platform that helps students discover the right course, learn with a personalised assistant, make secure payments, and recover lost revenue using an **Autonomous AI Revenue Recovery Agent**.


---

## 🚀 Overview & Problem Statement

### The Problem
Merchants lose millions in revenue every day due to payment gateway timeouts, checkout drop-offs, recurring subscription failures, overdue corporate invoices, and failed UPI Autopay mandates. Meanwhile, learners lose momentum and access to critical courses.

### The Core Solution
**EduPortal AI** closes this gap with an end-to-end **Autonomous AI Revenue Recovery System**. It ingests live payment failure signals from Razorpay webhooks, uses LLM reasoning to diagnose root cause failure patterns, enforces deterministic policy guardrails (auto-approval ceilings & discount caps), executes multi-channel recovery workflows (WhatsApp, Hinglish IVR, Razorpay retry links), and measures exact financial ROI and recovery attribution.

```text
Razorpay Webhook / Checkout / Mandate Event
                   │
                   ▼
       Failed Payment / Signal Ingestion
                   │
                   ▼
     LLM Agent Reasoning (Groq AI Model)
                   │
                   ▼
    Policy Gate Engine (Ceiling & Discount Guardrails)
        ┌──────────┴──────────┐
        │                     │
   (≤ ₹5,000)            (> ₹5,000)
  Auto-Approved       Escalated to Admin Queue
        │                     │
        └──────────┬──────────┘
                   ▼
 Multi-Channel Intervention (WhatsApp / Hinglish Voice / Discount Link)
                   │
                   ▼
 Student Retries Checkout via Razorpay
                   │
                   ▼
  Razorpay Webhook Verification (payment.captured)
                   │
                   ▼
 Signal Marked RECOVERED + Financial ROI Attribution Recorded
```

---

## 🏆 Key Features


Our AI Revenue Recovery Agent natively handles all 5 competition directions specified in the Razorpay Buildathon brief:

| Direction | Source Track | Failure Mechanism & AI Action | Operational Intervention |
|---|---|---|---|
| **1. Payment Degradation** | `payment_failure` | 3D-Secure OTP timeouts, issuing bank failures, card declines | Generates instant Razorpay retry link, evaluates policy gate, issues bounded discount offer. |
| **2. Checkout Drop-offs** | `checkout_dropoff` | Intent abandoned at checkout after selecting payment method | Automated multi-channel nudges via WhatsApp & Hinglish IVR voice scripts. |
| **3. Subscription Failures** | `subscription_failure` | Recurring membership debit failed (expired card, insufficient balance) | Subscription state tracking (`subscription.charged_failed`), automated retry sequence. |
| **4. B2B Overdue Receivables** | `overdue_receivable` | Corporate B2B invoice past Net 15/30 due date | Automated GST invoice chaser, aging bucket analysis, Razorpay B2B corporate remittance link. |
| **5. UPI Mandate Sequencer** | `mandate_failure` | NPCI / Bank switch decline on UPI Autopay / e-Mandate | Schedules debit retry during optimal banking hours (8:30 AM - 10:30 AM IST) & salary cycle days. |

---

### 2. LLM Reasoning Engine (Root Cause Diagnosis)

- Powered by **Groq High-Speed LLM Suite** (`qwen/qwen3.8-27b`, `openai/gpt-oss-120b`, `groq/compound-mini`).
- Diagnoses raw failure payloads (e.g. `BAD_REQUEST_ERROR`, `3DS_TIMEOUT`, `INSUFFICIENT_FUNDS`, `EXPIRED_CARD`, `BANK_SWITCH_DECLINE`).
- Generates structured JSON reasoning: Root Cause, Customer Sentiment, Confidence Score, Proposed Action, and Hinglish IVR Voice Script.

---

### 3. Policy Gate Engine & Guardrails (Human-in-the-Loop Governance)

- **Auto-Approve Ceiling**: Failed transactions **≤ ₹5,000** are automatically approved for bounded recovery offers.
- **Human-in-the-Loop Escalation**: Transactions **> ₹5,000** are escalated to the Admin Approval Queue for explicit authorization.
- **Bounded Guardrails**: Configurable ceilings for Maximum Retry Count, Cooldown Minutes, Maximum Discount Percentage (e.g. 10%-15%), and Auto-Approve Ceiling Amount.
- **Audit Trail**: Every decision, reasoning log, rule triggered, and execution result is immutably saved in `AgentAction` audit records.

---

### 4. Real-Time Webhook Integration & Recovery Attribution

- **Webhook Ingestion**: Listens to live Razorpay webhooks (`payment.failed`, `order.paid`, `payment.captured`, `subscription.charged`, `subscription.charged_failed`).
- **Idempotency**: Prevents duplicate customer nudges on webhook retries.
- **Financial ROI Metrics**: Real-time measurement of:
  - **Gross Recovered Revenue (₹)**
  - **Net Recovered Margin (₹)** (Gross recovered minus discount voucher costs)
  - **Recovery Rate %** (`(Recovered Signals / Total Signals) * 100`)
  - **Average Time-to-Recover (mins)**

---

### 5. Multi-Channel & Hinglish Voice Recovery

- **WhatsApp Outbound Nudges**: Bilingual Hinglish & English message templates via Twilio / WhatsApp Graph API.
- **Hinglish IVR Voice Recovery Scripts**: AI-generated voice call scripts tailored for Indian learners and finance managers.
- **Automated Background Scheduler**: Real-time Node.js worker (`revenueRecoveryScheduler.js`) polling every 30 seconds to execute scheduled retries (`retry_later` & mandate debit windows).

---


### 7. AI Study & Commerce Assistant

- Answers study questions using MongoDB course materials and notes.
- Guides students between PCM/PCB, competitive exams (IIT JEE, NEET, CS, GATE), and career paths.
- Compares live batches using real exam focus, PYQs, test series, mentorship, and price details.
- Provides authenticated students with current purchase and recovery notification status.

---

### 8. Secure Razorpay Checkout

- Backend creates Razorpay orders from database prices.
- Razorpay payment signatures are verified server-side via HMAC SHA-256.
- Course access is granted only after verification.
- Free batches use direct enrollment.

---

## 🏗️ Architecture

```text
React 18 Frontend (MUI 5, Siri Orb HUD, Socket.IO Client)
                          │
                          ▼
Express.js REST APIs (JWT Auth, Admin Controller, Webhook Handler)
                          │
                          ▼
MongoDB Database (Batches, Users, FailedPayments, AgentActions, RecoveryOffers)
                          │
                          ▼
AI Reasoning Layer (Groq LLM Suite, Pochi Context Engine)
                          │
                          ▼
Policy Gate & Execution Engine (Ceilings, Discount Vouchers, Twilio WhatsApp API)
                          │
                          ▼
Background Scheduler Worker (revenueRecoveryScheduler.js)
```

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Material UI (MUI 5), React Router v6, Axios, Socket.IO Client
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Razorpay SDK, Socket.IO, Groq SDK, Twilio SDK
- **AI & Reasoning:** Groq API (`qwen/qwen3.8-27b`, `openai/gpt-oss-120b`, `groq/compound-mini`), Web Speech Synthesis API

---

## 🔐 Security & Reliability

- Server-side Razorpay signature verification (`crypto.createHmac`).
- Server-side price validation preventing client-side tampering.
- Role-based authorization (`requireAdmin` middleware).
- Idempotent webhook processing.
- Full immutable audit trails for every AI action.

---

## 💻 Local Setup & Installation

### 1. Install Backend Dependencies

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
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

GROQ_API_KEY=your_groq_api_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### 3. Start Backend

```bash
npm run dev
```

### 4. Install & Start Frontend

```bash
cd ../dash
npm install
npm start
```

- Backend runs at: `http://localhost:5000`
- Frontend runs at: `http://localhost:3000`



