
// ─────────────────────────────────────────────────────────────
// IMPORTS — bring in all the tools this file needs
// ─────────────────────────────────────────────────────────────
 
// express is the web framework — it lets us create a server and handle routes
import express from 'express';
 
// bcrypt is commented out — it was the original password hashing library
// import bcrypt from 'bcrypt';
 
// bcryptjs is a pure JavaScript version of bcrypt (works without native code)
// used to hash passwords before saving them and to compare passwords on login
import bcrypt from "bcryptjs";
 
// jsonwebtoken (jwt) is used to create and verify tokens
// a token is like a digital ID card — once logged in, the user carries it
// to prove who they are on future requests
import jwt from 'jsonwebtoken';
 
// http-status gives us named HTTP status codes like:
// httpStatus.OK = 200, httpStatus.CREATED = 201, httpStatus.NOT_FOUND = 404, etc.
// makes code much more readable than using raw numbers
import httpStatus from 'http-status';
 
// User is our MongoDB database model (defined in a separate schema file)
// we use it to find, create, and save users in the database
import { User } from '../schema/user.model.js';

import auth from '../controller/authh.js'; // Custom auth middleware for protecting routes

import { rateLimiter } from '../middleware/rateLimit.js';
 

import { OAuth2Client } from 'google-auth-library';
const googleClient = new OAuth2Client();
// ─────────────────────────────────────────────────────────────
// ROUTER — a mini Express app just for auth routes
// ─────────────────────────────────────────────────────────────
 
// express.Router() creates a separate router object
// instead of putting all routes on the main app, we group auth routes here
// this file is then imported and attached to the main server (e.g. app.use('/api', router))
const router = express.Router();
 
 
// ══════════════════════════════════════════════════════════════
//  LOGIN ROUTE
//  URL: POST /api/login
//  What it does: checks credentials and returns a JWT token
// ══════════════════════════════════════════════════════════════
 
// router.post() registers a POST route at '/login'
// "async" means this function can use "await" to wait for database/async operations
// "req" = the incoming request (contains body, headers, etc.)
// "res" = the response object (we use it to send data back to the client)
router.post('/login', rateLimiter({ requests: 5, window: '10 m', prefix: 'rl:login' }), async (req, res) => { 
  // req.body contains the data sent by the frontend (username and password)
  // destructuring pulls them out into two separate variables
  const { username, password } = req.body;
 
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid request format." });
  }
 
  // ── MAIN LOGIC wrapped in try/catch ──
  // try: attempt the database operations
  // catch: if anything goes wrong (DB down, unexpected error), handle it gracefully
  try {
 
    // Search the database for a user whose "username" field matches what was sent
    // findOne() returns the first matching document, or null if not found
    const user = await User.findOne({ username });
 
    // If no user was found with that username, send a 404 Not Found error
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)        // HTTP 404 — user doesn't exist
        .json({ message: "User not found" });
    }
 
    // bcrypt.compare() checks if the plain-text "password" (what user typed)
    // matches the hashed password stored in the database
    // it returns true if they match, false if they don't
    // we NEVER store plain-text passwords — only hashed versions
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
 
    // If the password doesn't match, send a 401 Unauthorized error
    if (!isPasswordCorrect) {
      return res
        .status(httpStatus.UNAUTHORIZED)     // HTTP 401 — wrong password
        .json({ message: "Invalid credentials" });
    }
 
    // ── CREATE A JWT TOKEN ──
    // jwt.sign() creates a new signed token with 3 arguments:
    //   1. payload: the data stored INSIDE the token (not secret, but tamper-proof)
    //              here we store the user's database ID and username
    //   2. secret: process.env.JWT_SECRET is a private key from .env file
    //              this is what makes the token secure — only our server knows it
    //   3. options: { expiresIn: "7d" } means the token becomes invalid after 7 days
    //              the user will need to log in again after that
    const token = jwt.sign(
      { _id: user._id, username: user.username },   // payload (what's inside the token)
      process.env.JWT_SECRET,                        // secret key (kept private in .env)
      { expiresIn: "7d" }                            // token expires in 7 days
    );
 
    // ── SEND SUCCESSFUL RESPONSE ──
    // HTTP 200 OK = success
    // send back the token and user info so the frontend can store them
    return res.status(httpStatus.OK).json({
      token,                  // the JWT — frontend saves this and sends it on future requests
      username: user.username, // the user's email/username
      name: user.name,         // the user's display name
    });
 
  } catch (e) {
    // If ANYTHING unexpected goes wrong (e.g. database is offline):
    // send a 500 Internal Server Error with the actual error message
    // e.message is the error description from JavaScript/MongoDB
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)   // HTTP 500 — server-side problem
      .json({ message: `Error: ${e.message}` });
  }
});
 
 
// ══════════════════════════════════════════════════════════════
//  REGISTER ROUTE
//  URL: POST /api/register
//  What it does: creates a new user account and returns a JWT token
// ══════════════════════════════════════════════════════════════
 
// Similar structure to login — POST route, async, req and res
router.post('/register', rateLimiter({ requests: 5, window: '10 m', prefix: 'rl:register' }), async (req, res) => { 
  // Pull name, username, and password from the request body
  // (register needs name too, unlike login)
  const { name, username, password } = req.body;
 
  // ── VALIDATION: all three fields must be present ──
  if (typeof name !== 'string' || typeof username !== 'string' || typeof password !== 'string') {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid request format." });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(username)) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "Please provide a valid email address." });
  }
  
  if (password.length < 6) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "Password must be at least 6 characters long." });
  }
 
  try {
 
    // ── CHECK IF USER ALREADY EXISTS ──
    // Search the database for an existing user with the same username/email
    const existingUser = await User.findOne({ username });
 
    // If we find someone with that username, we can't create a duplicate
    // Send a 409 Conflict error
    if (existingUser) {
      return res
        .status(httpStatus.CONFLICT)        // HTTP 409 — resource already exists
        .json({ message: "User already exists" });
    }
 
    // ── HASH THE PASSWORD ──
    // NEVER save plain-text passwords in the database
    // bcrypt.hash() converts the password into a scrambled string (hash)
    // The "10" is the "salt rounds" — how many times the hashing algorithm runs
    // More rounds = slower to crack by attackers, but also slightly slower to process
    // 10 is the industry standard balance between security and speed
    const hashedPassword = await bcrypt.hash(password, 10);
 
    // ── CREATE A NEW USER DOCUMENT ──
    // "new User({...})" creates a new MongoDB document in memory (not yet saved)
    // we store the hashed password, NOT the original one
    const newUser = new User({ name, username, password: hashedPassword });
 
    // ── SAVE TO THE DATABASE ──
    // .save() actually writes the new user to MongoDB
    // if this fails (e.g. validation error), it throws and jumps to catch
    await newUser.save();
 
    // ── CREATE A JWT TOKEN FOR THE NEW USER ──
    // Same as in login — generate a token immediately after registration
    // so the user is automatically "logged in" without needing to log in separately
    const token = jwt.sign(
      { _id: newUser._id, username: newUser.username },  // payload with new user's info
      process.env.JWT_SECRET,                             // same secret key
      { expiresIn: "7d" }                                 // expires in 7 days
    );
 
    // ── SEND SUCCESSFUL RESPONSE ──
    // HTTP 201 Created = a new resource was successfully created (better than 200 for register)
    // send back the success message, token, and user info
    return res.status(httpStatus.CREATED).json({
      message: "User registered",       // confirmation message for the frontend
      token,                            // JWT so the user is instantly logged in
      username: newUser.username,       // the registered email/username
      name: newUser.name,               // the registered display name
    });
 
  } catch (e) {
    // If anything goes wrong (DB error, schema validation fail, etc.):
    // send a 500 Internal Server Error with the error details
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)   // HTTP 500 — unexpected server error
      .json({ message: `Error: ${e.message}` });
  }
});
 
 

//GET /api/user/profile
router.get("/user/profile", auth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



// ══════════════════════════════════════════════════════════════
//  GOOGLE LOGIN ROUTE
//  URL: POST /api/auth/google
//  What it does: verifies the Google access token, finds or creates
//  a user, and returns our own JWT token
// ══════════════════════════════════════════════════════════════
router.post('/auth/google', async (req, res) => {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "Missing access token." });
  }

  try {
    // Ask Google for the user's profile info using the access token
    const googleRes = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
    );

    if (!googleRes.ok) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid Google token." });
    }

    const profile = await googleRes.json();
    // profile contains: { email, name, picture, sub, ... }

    if (!profile.email) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "Google account has no email." });
    }

    // Find existing user by email, or create a new one
    let user = await User.findOne({ username: profile.email });

    if (!user) {
      // Create a new user with a random password (they'll never use it directly,
      // since they'll always log in via Google)
      const randomPassword = await bcrypt.hash(profile.sub + Date.now(), 10);
      user = new User({
        name: profile.name || profile.email,
        username: profile.email,
        password: randomPassword,
      });
      await user.save();
    }

    // Create our own JWT token, same as normal login
    const token = jwt.sign(
      { _id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(httpStatus.OK).json({
      token,
      username: user.username,
      name: user.name,
    });

  } catch (e) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: `Error: ${e.message}` });
  }
});

// ─────────────────────────────────────────────────────────────
// EXPORT THE ROUTER
// ─────────────────────────────────────────────────────────────
 
// Export the router so the main server file can import and use it
// In server.js it would be used like: app.use('/api', router)
// which means our routes become /api/login and /api/register




export default router;





