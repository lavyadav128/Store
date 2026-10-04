import { Ratelimit } from '@upstash/ratelimit';
import redis from '../../config/redis.js';

export function rateLimiter({ requests = 10, window = '1 m', prefix = 'ratelimit' } = {}) {
  // If Redis credentials are not configured, pass through gracefully
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return (req, res, next) => next();
  }

  let ratelimit;
  try {
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(requests, window),
      prefix,
    });
  } catch (initErr) {
    console.warn('[RateLimiter Init Warning]:', initErr.message);
    return (req, res, next) => next();
  }

  return async (req, res, next) => {
    // Never rate-limit CORS preflight OPTIONS requests
    if (req.method === 'OPTIONS') return next();

    const forwarded = req.headers['x-forwarded-for'];
    const identifier =
      (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : null) ||
      req.ip ||
      req.socket?.remoteAddress ||
      'unknown';

    try {
      const limitPromise = ratelimit.limit(identifier);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Rate limit timeout')), 500));

      const { success, limit, remaining, reset } = await Promise.race([limitPromise, timeoutPromise]);

      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Remaining', remaining);

      if (!success) {
        const retryAfterSeconds = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
        res.setHeader('Retry-After', retryAfterSeconds);
        console.log(`🚫 Rate limit hit: ${prefix} — ${identifier}`);
        return res.status(429).json({
          message: 'Too many requests. Please try again in a little while.',
          retryAfterSeconds,
        });
      }

      next();
    } catch (err) {
      // If rate limiter times out or errors, allow request immediately
      next();
    }
  };
}