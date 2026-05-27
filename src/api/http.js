/**
 * http.js — Core HTTP transport layer.
 *
 * Improvements over the original client.js:
 *  1. AbortController support — callers can cancel in-flight requests
 *  2. Automatic retry on transient 5xx errors (exponential backoff)
 *  3. Request timeout via AbortSignal
 *  4. Global 401 interception — publishes an event that AuthContext handles
 *  5. Structured logging via lib/logger
 *  6. JSON parsing safety (non-JSON responses handled gracefully)
 *
 * Usage:
 *   import { http, createAbortController } from './http';
 *   const { signal, abort } = createAbortController();
 *   const data = await http('/biodata/public', { signal });
 *   // In cleanup: abort();
 */

import { API_URL } from '../config/env';
import logger from '../lib/logger';
import { RETRY, TIMEOUTS } from '../constants/limits';

// ── Global 401 event ────────────────────────────────────────────────────────
// AuthContext listens for this to redirect to /login without circular imports.
export const AUTH_EXPIRED_EVENT = 'aguaa:auth:expired';

const dispatchAuthExpired = () => {
  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
};

// ── Abort controller helper ─────────────────────────────────────────────────
/**
 * Creates an AbortController with an optional timeout.
 * @param {number} timeoutMs — auto-aborts after this many ms (default: API_REQUEST_MS)
 * @returns {{ signal: AbortSignal, abort: () => void, clear: () => void }}
 */
export const createAbortController = (timeoutMs = TIMEOUTS.API_REQUEST_MS) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort('timeout'), timeoutMs);
  return {
    signal: controller.signal,
    abort:  () => { clearTimeout(timer); controller.abort('cancelled'); },
    clear:  () => clearTimeout(timer),
  };
};

// ── Retry helper ────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Exponential backoff: 800ms, 1600ms, 3200ms...
 */
const retryDelay = (attempt) =>
  RETRY.BASE_DELAY_MS * Math.pow(2, attempt);

// ── Core http function ──────────────────────────────────────────────────────
/**
 * @param {string} endpoint — relative path, e.g. '/auth/me'
 * @param {RequestInit & { _attempt?: number }} options
 * @returns {Promise<any>} parsed JSON response
 * @throws {{ message: string, status: number }}
 */
export const http = async (endpoint, options = {}) => {
  const { _attempt = 0, signal, ...fetchOptions } = options;

  const url = `${API_URL}${endpoint}`;

  // Merge caller signal with a timeout signal
  const { signal: timeoutSignal, clear } = createAbortController();
  const combinedSignal = signal
    ? AbortSignal.any
      ? AbortSignal.any([signal, timeoutSignal])   // modern browsers
      : signal                                      // fallback: use caller's signal
    : timeoutSignal;

  const headers = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers || {}),
  };

  let res;
  try {
    res = await fetch(url, {
      ...fetchOptions,
      headers,
      credentials: 'include',
      signal: combinedSignal,
    });
  } catch (err) {
    clear();
    if (err.name === 'AbortError') {
      const abortErr = new Error(
        err.message === 'timeout'
          ? 'Request timed out. Please try again.'
          : 'Request was cancelled.'
      );
      abortErr.status = 0;
      abortErr.code   = err.message === 'timeout' ? 'TIMEOUT' : 'ABORTED';
      throw abortErr;
    }
    // Network / CORS / DNS failure
    const netErr = new Error('No internet connection. Please check your network.');
    netErr.status = 0;
    netErr.code   = 'NETWORK_ERROR';
    logger.apiError(endpoint, err);
    throw netErr;
  } finally {
    clear();
  }

  // ── Parse response ───────────────────────────────────────────
  let data;
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: 'Server returned an unexpected response.' };
  }

  // ── 401 — session expired ────────────────────────────────────
  if (res.status === 401) {
    // IMPORTANT: Only dispatch auth:expired for NON-auth routes.
    // Auth routes (/auth/google, /auth/login, /auth/me) handle their own
    // 401s at the call site. Dispatching here would cause AuthContext to
    // clear localStorage and redirect to /login WHILE the user is actively
    // trying to log in (e.g. bad Google token → 401 → global logout race).
    const isAuthRoute = endpoint.startsWith('/auth/');
    if (!isAuthRoute) {
      logger.warn('Session expired — dispatching auth:expired', { context: 'http', data: endpoint });
      dispatchAuthExpired();
    }
    const err = new Error(data.message || 'Your session has expired. Please sign in again.');
    err.status = 401;
    throw err;
  }

  // ── 5xx — retry with backoff ─────────────────────────────────
  if (RETRY.RETRYABLE_STATUSES.has(res.status) && _attempt < RETRY.MAX_ATTEMPTS) {
    const delay = retryDelay(_attempt);
    logger.warn(
      `${res.status} from ${endpoint} — retrying in ${delay}ms (attempt ${_attempt + 1}/${RETRY.MAX_ATTEMPTS})`,
      { context: 'http' }
    );
    await sleep(delay);
    return http(endpoint, { ...fetchOptions, signal, _attempt: _attempt + 1 });
  }

  // ── Other non-OK status ──────────────────────────────────────
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    err.status = res.status;
    err.data   = data;
    logger.apiError(endpoint, err);
    throw err;
  }

  return data;
};

export default http;
