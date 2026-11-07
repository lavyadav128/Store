// back/shared/middleware/cache.js
// Ultra-fast In-Memory Cache with optional Upstash Redis tier

import redis from '../../config/redis.js';

// High-speed In-Memory Cache (0ms latency fallback)
const memoryCache = new Map();

// ── 1. cache(seconds) ──
export function cache(seconds = 60) {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    const now = Date.now();

    // Check ultrafast in-memory cache first (instant response)
    const mem = memoryCache.get(key);
    if (mem && mem.expiresAt > now) {
      return res.json(mem.data);
    }

    const hasRedis = Boolean(
      process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_URL.trim() &&
      process.env.UPSTASH_REDIS_REST_TOKEN &&
      process.env.UPSTASH_REDIS_REST_TOKEN.trim()
    );

    if (hasRedis) {
      try {
        const cached = await Promise.race([
          redis.get(key),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Redis timeout')), 250))
        ]);

        if (cached) {
          memoryCache.set(key, { data: cached, expiresAt: now + seconds * 1000 });
          return res.json(cached);
        }
      } catch (err) {
        // Non-fatal, bypass to database
      }
    }

    // Intercept res.json to cache response
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      memoryCache.set(key, { data: body, expiresAt: now + seconds * 1000 });

      if (hasRedis) {
        redis.set(key, body, { ex: seconds }).catch(() => {});
      }
      return originalJson(body);
    };

    next();
  };
}

// ── 2. clearCache(pattern) ──
export async function clearCache(pattern) {
  memoryCache.clear();
  const hasRedis = Boolean(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_URL.trim() &&
    process.env.UPSTASH_REDIS_REST_TOKEN &&
    process.env.UPSTASH_REDIS_REST_TOKEN.trim()
  );

  if (hasRedis) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (err) {
      // Non-fatal
    }
  }
}
