// ─────────────────────────────────────────────────────────────
// REDIS CONNECTION (via Upstash REST API)
// ─────────────────────────────────────────────────────────────
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';

// IMPORTANT: load .env right here, inside this file.
// WHY: in ES modules, ALL "import" statements across the whole app run
// first (in the order they appear), BEFORE any regular code — including
// index.js's own "dotenv.config()" line. Since other files (like
// rateLimit.js, which routes import) pull in this file, this file can
// end up running BEFORE index.js's dotenv.config() ever executes,
// meaning process.env.UPSTASH_REDIS_REST_URL would still be undefined.
// Calling dotenv.config() again here is 100% safe — it's idempotent,
// so calling it in both index.js and here causes no issues.
dotenv.config();

// These two come from Upstash Dashboard -> your database -> "REST API" tab
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

console.log('✅ Redis (Upstash REST) client ready');

export default redis;