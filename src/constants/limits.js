/**
 * limits.js — Application-wide numeric constants.
 *
 * Single source of truth for all magic numbers:
 * pagination sizes, upload limits, timeouts, debounce delays.
 *
 * Usage:
 *   import { PAGINATION, UPLOAD, TIMEOUTS } from '../constants/limits';
 *   const perPage = PAGINATION.EXPLORE_PAGE_SIZE;
 */

// ── Pagination ──────────────────────────────────────────────────────────────
export const PAGINATION = {
  /** Public Explore page — profiles per page */
  EXPLORE_PAGE_SIZE: 12,
  /** Dashboard — my biodatas (usually small, no pagination needed yet) */
  DASHBOARD_PAGE_SIZE: 20,
};

// ── Upload ──────────────────────────────────────────────────────────────────
export const UPLOAD = {
  /** Max photo file size in bytes (5 MB) */
  MAX_PHOTO_BYTES: 5 * 1024 * 1024,
  /** Accepted MIME types for photo upload */
  ACCEPTED_PHOTO_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  /** Max filename length */
  MAX_FILENAME_LENGTH: 255,
};

// ── Request timeouts ────────────────────────────────────────────────────────
export const TIMEOUTS = {
  /** Standard API request timeout (ms) */
  API_REQUEST_MS: 15_000,
  /** Photo upload timeout — larger because of multipart (ms) */
  UPLOAD_MS: 60_000,
  /** Search debounce delay (ms) */
  SEARCH_DEBOUNCE_MS: 350,
  /** Toast auto-dismiss (ms) */
  TOAST_DURATION_MS: 4_000,
  /** Resend verification/reset cooldown (s) */
  RESEND_COOLDOWN_S: 60,
};

// ── Retry ───────────────────────────────────────────────────────────────────
export const RETRY = {
  /** Max automatic retries for 5xx errors */
  MAX_ATTEMPTS: 2,
  /** Base delay before first retry (ms) */
  BASE_DELAY_MS: 800,
  /** HTTP status codes that are safe to retry */
  RETRYABLE_STATUSES: new Set([500, 502, 503, 504]),
};

// ── Cache ────────────────────────────────────────────────────────────────────
export const CACHE = {
  /** React Query stale time for public biodata list (ms) */
  PUBLIC_BIODATAS_STALE_MS: 3 * 60 * 1000,   // 3 minutes
  /** React Query stale time for current user (ms) */
  ME_STALE_MS: 5 * 60 * 1000,                // 5 minutes
  /** React Query gc time (ms) */
  GC_TIME_MS: 10 * 60 * 1000,               // 10 minutes
};

// ── Auth ────────────────────────────────────────────────────────────────────
export const AUTH = {
  /** localStorage key for cached user */
  USER_STORAGE_KEY: 'biodata_user',
  /** localStorage key for mobile CTA dismissed */
  MOBILE_CTA_KEY: 'aguaa_mobile_cta_dismissed',
};
