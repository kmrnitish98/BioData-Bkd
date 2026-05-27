/**
 * logger.js — Production-safe structured logger.
 *
 * Replaces bare console.* calls across the codebase with:
 *  - Log level control (silenced in production for non-error levels)
 *  - Structured metadata support { context, data }
 *  - Sentry integration hook (ready to wire)
 *  - Unique session correlation ID for log tracing
 *
 * Usage:
 *   import logger from '../lib/logger';
 *   logger.info('User logged in', { context: 'Auth', data: { userId } });
 *   logger.error('API failed', { context: 'api/client', data: err });
 *   logger.warn('Token expiring', { context: 'useAuth' });
 *
 * Architecture benefit:
 *  - Zero noise in production console (errors/warnings only)
 *  - One-line Sentry activation when DSN is set
 *  - Session ID lets you grep all logs from a single user session
 */

import { IS_DEV, FEATURE_SENTRY, SENTRY_DSN } from '../config/env';

// ── Session ID ──────────────────────────────────────────────────────────────
// Short random ID generated once per page load — helps correlate logs
const SESSION_ID = Math.random().toString(36).slice(2, 8).toUpperCase();

// ── Sentry integration hook ─────────────────────────────────────────────────
// When VITE_SENTRY_DSN is set AND @sentry/react is installed,
// errors are automatically routed to Sentry.
//
// To activate:
//   1. npm install @sentry/react
//   2. Set VITE_SENTRY_DSN in Vercel environment variables
//
// The dynamic import is deliberately inside a try/catch — Rollup will emit
// a warning if the package is missing, but the build and runtime are unaffected.
let Sentry = null;
if (FEATURE_SENTRY && SENTRY_DSN) {
  // Only attempt if the package is listed in package.json
  // Remove the IS_DEV guard when ready to test Sentry in development
  if (!IS_DEV) {
    // Using a variable string defeats static analysis — Rollup won't try to
    // resolve the specifier at build time unless it's a string literal.
    const pkg = '@sentry/react';
    import(/* @vite-ignore */ pkg)
      .then((mod) => {
        Sentry = mod;
        Sentry.init({
          dsn: SENTRY_DSN,
          environment: import.meta.env.MODE,
          tracesSampleRate: 0.1,
        });
      })
      .catch(() => {
        // @sentry/react not installed — silently continue without it
      });
  }
}

// ── Log levels ──────────────────────────────────────────────────────────────
const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };

// In production: only warn + error reach the console
// In development: all levels
const MIN_LEVEL = IS_DEV ? LEVELS.debug : LEVELS.warn;

// ── Formatter ───────────────────────────────────────────────────────────────
const format = (level, message, meta = {}) => {
  const ts = new Date().toISOString();
  const ctx = meta.context ? `[${meta.context}]` : '';
  return `[${ts}] [${SESSION_ID}] [${level.toUpperCase()}] ${ctx} ${message}`;
};

// ── Core log function ───────────────────────────────────────────────────────
const log = (level, message, meta = {}) => {
  if (LEVELS[level] < MIN_LEVEL) return;

  const formatted = format(level, message, meta);
  const data = meta.data;

  switch (level) {
    case 'debug': console.debug(formatted, data ?? ''); break;
    case 'info':  console.info(formatted,  data ?? ''); break;
    case 'warn':  console.warn(formatted,  data ?? ''); break;
    case 'error':
      console.error(formatted, data ?? '');
      // Route to Sentry when available
      if (Sentry && data instanceof Error) {
        Sentry.captureException(data, { extra: { message, ...meta } });
      } else if (Sentry && data) {
        Sentry.captureMessage(message, { level: 'error', extra: meta });
      }
      break;
  }
};

// ── Public API ──────────────────────────────────────────────────────────────
const logger = {
  debug: (msg, meta) => log('debug', msg, meta),
  info:  (msg, meta) => log('info',  msg, meta),
  warn:  (msg, meta) => log('warn',  msg, meta),
  error: (msg, meta) => log('error', msg, meta),

  /** Log an API error with standard shape */
  apiError: (endpoint, err, meta = {}) =>
    log('error', `API error: ${endpoint}`, {
      context: 'api',
      data: err,
      ...meta,
    }),

  /** Log a user action (info level) */
  action: (action, data) =>
    log('info', `Action: ${action}`, { context: 'user', data }),

  /** Expose session ID for correlation */
  sessionId: SESSION_ID,
};

export default logger;
