import * as Sentry from '@sentry/node';
import dotenv from 'dotenv';

// Match the backend config: the local .env file is the source of truth during
// development and must replace stale terminal-level variables.
dotenv.config({ override: true });

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 0.2,
});
