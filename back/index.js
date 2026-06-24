// ─────────────────────────────────────────────────────────────
// IMPORTS — bring in all the tools/libraries this file needs
// ─────────────────────────────────────────────────────────────
  
// express is the main web framework — it lets us create a server,
// define routes (URLs), and handle incoming requests & responses
import express from 'express';

// cors = Cross-Origin Resource Sharing
// browsers block requests from a different domain/port by default (security rule)
// this middleware tells the browser "yes, these other origins are allowed to talk to our server"
import cors from 'cors';

// mongoose is a library that connects our Node.js app to a MongoDB database
// it also lets us define data schemas (models) and query the database easily
import mongoose from 'mongoose';

// dotenv reads the .env file (which contains secret keys, DB URLs, etc.)
// and makes them available as process.env.VARIABLE_NAME in the code
import dotenv from 'dotenv';

// Razorpay is India's popular payment gateway SDK
// we use it to create payment orders on the backend
import Razorpay from 'razorpay';


// ─────────────────────────────────────────────────────────────
// ROUTE IMPORTS — each file handles a specific group of URLs
// ─────────────────────────────────────────────────────────────

// handles /api/login and /api/register (user authentication)
import userRoutes from './routes/users.routes.js';

// handles course purchase related endpoints
import purchaseRoutes from './routes/purchase.js';

// handles the AI chatbot API endpoints
import chatbotRoutes from './ai/chatbot.js';

// handles admin-only operations (e.g. manage users, content)
import adminRoutes from "./routes/admin.routes.js";

// handles student doubt/question submission and responses
import doubtRoutes from "./routes/doubt.routes.js";

// handles creating and fetching notifications
import notificationsRoutes from "./routes/notifications.routes.js";

// handles fetching the list of all registered users (admin feature)
import userListRoutes from './routes/userList.routes.js';

// handles uploading and fetching study resources (PDFs, notes, etc.)
import resourceRoutes from './routes/resource.routes.js';

// handles the video studio feature (recording, uploading videos)
import videoStudioRouter from "./routes/video.routes.js";

import videoSplitterRoutes from "./routes/videoSplitter.routes.js";

import dns from 'node:dns';

dns.setServers(['8.8.8.8', '8.8.4.4']); // Google DNS
// dns.setServers(['1.1.1.1']);        // Cloudflare alternative
// ─────────────────────────────────────────────────────────────
// LOAD ENVIRONMENT VARIABLES
// ─────────────────────────────────────────────────────────────

// dotenv.config() reads the .env file from the project root
// and loads all key=value pairs into process.env
// MUST be called before any code that uses process.env.SOMETHING
dotenv.config();


// ─────────────────────────────────────────────────────────────
// CREATE THE EXPRESS APP
// ─────────────────────────────────────────────────────────────

// express() creates our main application object
// we attach middleware and routes to this "app"
const app = express();


// ═════════════════════════════════════════════════════════════
//  MIDDLEWARE
//  Middleware = functions that run on EVERY request before
//  it reaches the actual route handler
// ═════════════════════════════════════════════════════════════

// ── CORS CONFIGURATION ──
// Tells the browser which external origins (domains/ports) are allowed
// to send requests to our backend
app.use(cors({
  origin: [
    'http://localhost:3001',              // local frontend during development
    // 'https://note-vevp.onrender.com',     // deployed frontend on Render
    'http://localhost:3000',           // ✅ local Docker frontend
  ],
  // List of HTTP methods we allow from those origins
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  // "credentials: true" allows cookies and Authorization headers to be sent
  credentials: true,
  // Only these two headers are allowed in requests from the frontend
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle "preflight" OPTIONS requests
// Before sending POST/PUT/DELETE, browsers first send an OPTIONS request to check if CORS is allowed
// app.options('*') tells express to respond to OPTIONS on ALL routes using the cors() settings above
// Without this, cross-origin POST requests would fail
app.options('*', cors());

// ── JSON BODY PARSER ──
// Without this, req.body would be undefined for JSON requests
// express.json() reads the raw request body and parses it into a JavaScript object
// limit: "20mb" allows large payloads (e.g. base64 images, video thumbnails)
app.use(express.json({ limit: "20mb" }));

// ── URL-ENCODED BODY PARSER ──
// Parses data sent from HTML <form> submissions (key=value&key=value format)
// extended: true allows nested objects in form data
// limit: "20mb" same large payload allowance as above
app.use(express.urlencoded({ extended: true, limit: "20mb" }));


// ═════════════════════════════════════════════════════════════
//  ROUTES
//  app.use(path, router) mounts a router at a specific URL prefix
//  All routes inside that router file will start with that prefix
// ═════════════════════════════════════════════════════════════

// Doubt routes — e.g. POST /api/doubt, GET /api/doubts
app.use("/api", doubtRoutes);

// Admin routes — e.g. GET /api/admin/users, DELETE /api/admin/user/:id
app.use("/api/admin", adminRoutes);

// Notification routes — e.g. GET /api/notifications, POST /api/notifications
app.use("/api/notifications", notificationsRoutes);

// Resource routes — e.g. GET /api/resources, POST /api/resources/upload
app.use("/api/resources", resourceRoutes);

// User list routes — e.g. GET /api/admin/list/users
app.use("/api/admin/list", userListRoutes);

// Video studio routes — e.g. POST /api/video-studio/upload
app.use("/api/video-studio", videoStudioRouter);

// User auth routes — e.g. POST /api/login, POST /api/register
app.use('/api', userRoutes);

// Purchase routes — e.g. POST /api/purchase, GET /api/purchases
app.use('/api', purchaseRoutes);

// Chatbot routes — e.g. POST /api/chat
app.use('/api', chatbotRoutes);

app.use("/api/video-splitter", videoSplitterRoutes);

// ── HEALTH CHECK ROUTE ──
// A simple GET "/" route to confirm the backend server is alive
// Useful for uptime monitoring tools or to verify deployment works
// req = incoming request, res = outgoing response
app.get("/", (req, res) => {
  // Log a timestamp every time someone pings this route
  console.log("Ping received at", new Date());
  // Send a plain text response — no JSON needed here
  res.send("Backend is alive!");
});




// ═════════════════════════════════════════════════════════════
//  RAZORPAY — Payment Order Creation
// ═════════════════════════════════════════════════════════════

// Create a Razorpay instance using our API keys stored in .env
// key_id and key_secret are provided by Razorpay when you create an account
// NEVER hardcode these — always use environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,      // public key (used on frontend too)
  key_secret: process.env.RAZORPAY_SECRET,   // secret key (backend only, never expose)
});

// POST /api/create-order
// The frontend calls this to create a payment order before showing the Razorpay payment popup
app.post('/api/create-order', async (req, res) => {

  // Pull amount and receipt from the request body (sent by the frontend)
  const { amount, receipt } = req.body;

  // Build the "options" object that Razorpay's API expects
  const options = {
    // Razorpay requires the amount in the SMALLEST unit of the currency
    // For INR: 1 Rupee = 100 paise, so multiply by 100
    // e.g. ₹499 → 49900 paise
    amount: amount * 100,

    // Currency code — INR = Indian Rupee
    currency: 'INR',

    // receipt is an optional ID to identify this order in your records
    // if not provided by the frontend, we generate one using the current timestamp
    receipt: receipt || `receipt_${Date.now()}`,

    // payment_capture: 1 means auto-capture the payment immediately after user pays
    // (as opposed to 0 which would require a manual capture step)
    payment_capture: 1,
  };

  try {
    // Call Razorpay's API to actually create the order
    // This returns an order object with an order ID, status, etc.
    const order = await razorpay.orders.create(options);

    // Send the created order back to the frontend
    // The frontend uses order.id to open the Razorpay payment popup
    res.status(200).json(order);

  } catch (error) {
    // If Razorpay's API fails (network issue, invalid keys, etc.), log it and send an error
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});


// ═════════════════════════════════════════════════════════════
//  DATABASE CONNECTION
// ═════════════════════════════════════════════════════════════

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);  // ✅ No extra options needed
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}


// ═════════════════════════════════════════════════════════════
//  START THE SERVER
// ═════════════════════════════════════════════════════════════

// Read the port number from .env, or default to 3000 if not set
// process.env.PORT is usually set automatically by hosting platforms like Render or Railway
const PORT = 3000;

// connectDB() returns a Promise — .then() runs AFTER the database connects successfully
// This ensures the server only starts AFTER we have a working DB connection
// If DB fails, connectDB() calls process.exit(1) and the server never starts
connectDB().then(() => {

  // app.listen() starts the HTTP server and begins accepting incoming requests
  // PORT = which port to listen on (e.g. 3000)
  // "0.0.0.0" = listen on ALL network interfaces, not just localhost
  //   → this is important for cloud hosting (Render, Railway, etc.)
  //   → without it, the server might only be accessible inside the machine
  // The callback (arrow function) runs once the server has started
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
});