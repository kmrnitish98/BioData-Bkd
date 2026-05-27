/**
 * env.js — Centralised, validated environment configuration.
 *
 * SINGLE SOURCE OF TRUTH for all env vars. No more scattered
 * `import.meta.env.VITE_*` calls across every file — import
 * from here and get type-safe, validated values.
 *
 * Architecture benefit:
 *  - Catch misconfiguration at module load time, not at request time
 *  - Easy to mock in tests
 *  - All env docs live in one place
 */

const get = (key, fallback = undefined) => {
  const value = import.meta.env[key];
  if (value !== undefined && value !== '') return value;
  if (fallback !== undefined) return fallback;
  return undefined;
};

const requireInProd = (key, description) => {
  const value = get(key);
  if (!value && import.meta.env.PROD) {
    // Cannot use logger here — logger imports env.js (would be circular).
    // Use structured console.error that matches logger's format for grep-ability.
    // This fires only in production builds with missing config — correct severity.
    const ts = new Date().toISOString();
    console.error(
      `[${ts}] [CONFIG] [ERROR] CRITICAL: ${key} is not set in production.\n` +
      `  Description: ${description}\n` +
      `  Action: Set it in Vercel → Project Settings → Environment Variables.`
    );
  }
  return value;
};

// ── API ────────────────────────────────────────────────────────────────────────
export const API_URL = requireInProd(
  'VITE_API_URL',
  'Backend API base URL (e.g. https://your-app.onrender.com/api)'
) ?? 'http://localhost:5006/api';

// ── Auth ───────────────────────────────────────────────────────────────────────
export const GOOGLE_CLIENT_ID = requireInProd(
  'VITE_GOOGLE_CLIENT_ID',
  'Google OAuth Client ID from Google Cloud Console'
) ?? '';

// ── App ────────────────────────────────────────────────────────────────────────
export const APP_ENV   = get('VITE_APP_ENV', import.meta.env.MODE);   // 'development' | 'production' | 'staging'
export const IS_PROD   = APP_ENV === 'production' || import.meta.env.PROD;
export const IS_DEV    = !IS_PROD;
export const APP_NAME  = get('VITE_APP_NAME', 'Aguaa');
export const APP_URL   = get('VITE_APP_URL', 'https://aguaa.in');

// ── Feature flags ──────────────────────────────────────────────────────────────
export const FEATURE_AI_ASSIST   = get('VITE_FEATURE_AI_ASSIST', 'true')  === 'true';
export const FEATURE_SENTRY      = get('VITE_SENTRY_DSN', '')             !== '';

// ── Monitoring ─────────────────────────────────────────────────────────────────
export const SENTRY_DSN = get('VITE_SENTRY_DSN', '');

export default {
  API_URL,
  GOOGLE_CLIENT_ID,
  APP_ENV,
  IS_PROD,
  IS_DEV,
  APP_NAME,
  APP_URL,
  FEATURE_AI_ASSIST,
  FEATURE_SENTRY,
  SENTRY_DSN,
};
