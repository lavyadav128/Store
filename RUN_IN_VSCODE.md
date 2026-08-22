# Run NoteNova in VS Code

## 1. Prerequisites

- Install Node.js 20 LTS from nodejs.org, then confirm `node -v` and `npm -v` work in the VS Code terminal.
- Use a MongoDB Atlas connection string, or run MongoDB locally.
- Have Razorpay **test-mode** credentials ready. Never put live credentials in a test/demo build.

## 2. Open the project

1. Extract the ZIP.
2. In VS Code, select **File → Open Folder** and open the extracted `NoteNova` folder.
3. Open two VS Code terminals.

## 3. Configure environment variables

1. In `back`, copy `.env.example` to `.env`.
2. Fill at minimum:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_secret
ADMIN_USERNAME=adminbrand@gmail.com
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_SECRET=your_matching_test_secret
RAZORPAY_WEBHOOK_SECRET=the_webhook_secret_set_in_razorpay
OPENROUTER_API_KEY=your_openrouter_key
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

3. In `dash`, copy `.env.example` to `.env` and set:

```env
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_RAZORPAY_LIVE_KEY=rzp_test_xxxxx
```

`REACT_APP_RAZORPAY_LIVE_KEY` is an old variable name retained for compatibility; it must contain the same **test public key** as `RAZORPAY_KEY_ID`.

## 4. Install and start

Terminal 1:

```powershell
cd back
npm install
npm run dev
```

Terminal 2:

```powershell
cd dash
npm install
npm start
```

Open `http://localhost:3000`.

## 5. Critical verification

1. Log in as a normal student and confirm `/admin-dashboard`, `/commerce-audit`, recovery data, upload/delete controls, and other admin APIs return access denied.
2. Log in as the `ADMIN_USERNAME` account and confirm admin pages work.
3. For a paid regular batch and paid note batch, confirm the Razorpay test popup opens and a successful test payment unlocks content.
4. Change a batch price in admin, refresh, and confirm checkout uses the new server-side amount.
5. Open the chatbot: **Find a course for my goal → Checkout safely → Confirm and continue**.
6. In Razorpay Test Mode, configure `payment.failed` webhook to your deployed endpoint:

```text
https://YOUR_BACKEND_DOMAIN/api/agent/revenue-recovery/webhook/razorpay
```

Then execute a failed test payment and verify it appears in the Revenue Recovery dashboard.

## 6. Local webhook note

Razorpay cannot reach `localhost`. Use a deployed backend or an HTTPS tunnel only for webhook testing. Keep the webhook secret identical in Razorpay and `back/.env`.
