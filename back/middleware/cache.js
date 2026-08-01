// ─────────────────────────────────────────────────────────────
// CACHE MIDDLEWARE
// ─────────────────────────────────────────────────────────────
// This gives you two tools:
//   1. cache(seconds)  → drop into any GET route, like `auth` middleware
//   2. clearCache(pattern) → call inside admin POST/PUT/DELETE/PATCH routes
//      to invalidate (wipe) stale cached data after a write

import redis from '../config/redis.js';

// ── 1. cache(seconds) ──
// Usage:  router.get('/', cache(60), async (req, res) => { ... })
//
// HOW IT WORKS, STEP BY STEP:
//   - Builds a unique key from the route path + query params
//     e.g. GET /api/batches?folder=Tech  →  key = "cache:/api/batches?folder=Tech"
//   - Checks Redis for that key
//       → FOUND: send the saved response immediately, skip MongoDB entirely
//       → NOT FOUND: let the real route run, but "intercept" res.json()
//         so that whatever the route sends back also gets SAVED to Redis
//         with an expiry time (seconds), before going to the browser
export function cache(seconds = 60) {
  return async (req, res, next) => {
    // Build a unique cache key per full URL (path + query string)
    const key = `cache:${req.originalUrl}`;

    try {
      const cached = await redis.get(key);

      if (cached) {
        // CACHE HIT — data found in Redis, skip MongoDB completely
        console.log(`🟢 Cache HIT: ${key}`);
        return res.json(JSON.parse(cached));
      }

      console.log(`🔴 Cache MISS: ${key}`);

      // CACHE MISS — no data in Redis yet.
      // We temporarily "hijack" res.json so that whenever the real route
      // handler calls res.json(data), we ALSO save that data to Redis
      // before it goes out to the browser. The browser never notices this.
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        // "EX" = expire after N seconds, so stale data can't live forever
        redis.set(key, JSON.stringify(body), 'EX', seconds).catch((err) =>
          console.error('Redis SET failed (non-fatal):', err.message)
        );
        return originalJson(body);
      };

      next(); // continue to the real route handler (queries MongoDB as normal)
    } catch (err) {
      // If Redis itself fails, don't block the request — just skip caching
      console.error('Redis GET failed, skipping cache:', err.message);
      next();
    }
  };
}

// ── 2. clearCache(pattern) ──
// Usage (inside an admin write route, AFTER a successful save/update/delete):
//     await clearCache('cache:/api/batches*');
//
// HOW IT WORKS:
//   Redis lets us search for all keys matching a pattern (using * as wildcard)
//   and delete them all at once. This is how we make sure that the NEXT
//   student request after an admin edit gets fresh data, not stale cache.
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