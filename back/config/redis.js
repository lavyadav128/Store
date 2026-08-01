// ─────────────────────────────────────────────────────────────
// REDIS CONNECTION
// ─────────────────────────────────────────────────────────────
// This file creates ONE Redis connection that the whole backend shares
// (same pattern as your config/cloudinary.js — one client, imported everywhere)
//
// Redis is an in-memory database. Reading from it is roughly 100x faster
// than reading from MongoDB, because there's no disk lookup — it's all RAM.

import Redis from 'ioredis';

// process.env.REDIS_URL comes from your .env file, e.g.:
// REDIS_URL=rediss://default:xxxx@your-db-name.upstash.io:6379
const redis = new Redis(process.env.REDIS_URL, {
  // Upstash requires TLS (that's why the URL starts with "rediss://" not "redis://")
  // ioredis handles this automatically when it sees "rediss://" in the URL.

  // If Redis is briefly down, don't crash the app — just let this one request fail.
  // Redis being unavailable should NEVER take your whole website down,
  // since MongoDB is still the source of truth.
  maxRetriesPerRequest: 2,

  // If Redis takes longer than this to respond, give up on THIS request only
  connectTimeout: 5000,
});

redis.on('connect', () => {
  console.log('✅ Connected to Redis (Upstash)');
});

redis.on('error', (err) => {
  // IMPORTANT: we only log the error, we do NOT crash the server.
  // If Redis goes down, your app should still work — just slightly slower
  // (every request falls back to MongoDB, like before caching existed).
  console.error('⚠️ Redis error (falling back to DB-only mode):', err.message);
});

export default redis;