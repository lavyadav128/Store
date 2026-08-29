import { Ratelimit } from '@upstash/ratelimit';
import redis from '../../config/redis.js';

export function rateLimiter({ requests = 10, window = '1 m', prefix = 'ratelimit' } = {}) {
  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    prefix,
  });

  return async (req, res, next) => {
    const identifier = req.ip || 'unknown';

    try {
      const { success, limit, remaining, reset } = await ratelimit.limit(identifier);

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
      console.error('Rate limit check failed, allowing request:', err.message);
      next();
    }
  };
}