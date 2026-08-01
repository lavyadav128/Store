// ─────────────────────────────────────────────────────────────
// CACHE MIDDLEWARE (Upstash REST client version)
// ─────────────────────────────────────────────────────────────
// This gives you two tools:
//   1. cache(seconds)  → drop into any GET route, like `auth` middleware
//   2. clearCache(pattern) → call inside admin POST/PUT/DELETE/PATCH routes
//      to invalidate (wipe) stale cached data after a write
//
// NOTE: the Upstash REST client auto-serializes/deserializes JSON for you.
// Do NOT manually JSON.stringify() before set() or JSON.parse() after get().

import redis from '../config/redis.js';

// ── 1. cache(seconds) ──
// Usage:  router.get('/', cache(60), async (req, res) => { ... })
export function cache(seconds = 60) {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;

    try {
      const cached = await redis.get(key);

      if (cached) {
        // CACHE HIT — data found in Redis, skip MongoDB completely
        // `cached` is already a real object here, NOT a JSON string
        console.log(`🟢 Cache HIT: ${key}`);
        return res.json(cached);
      }

      console.log(`🔴 Cache MISS: ${key}`);

      // CACHE MISS — hijack res.json so whatever the route sends back
      // also gets saved to Redis (with expiry) before going to the browser
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        // { ex: seconds } = expire after N seconds (Upstash REST syntax)
        redis.set(key, body, { ex: seconds }).catch((err) =>
          console.error('Redis SET failed (non-fatal):', err.message)
        );
        return originalJson(body);
      };

      next();
    } catch (err) {
      // If Redis itself fails (network hiccup etc), don't block the request —
      // just skip caching for this one request. MongoDB still answers normally.
      console.error('Redis GET failed, skipping cache:', err.message);
      next();
    }
  };
}

// ── 2. clearCache(pattern) ──
// Usage: await clearCache('cache:/api/batches*');
export async function clearCache(pattern) {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`🧹 Cleared ${keys.length} cache key(s) matching "${pattern}"`);
    }
  } catch (err) {
    console.error('Redis cache clear failed (non-fatal):', err.message);
  }
}