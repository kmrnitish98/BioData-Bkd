/**
 * apiError.js — Centralised API error classification.
 *
 * Usage:
 *   import { getErrorMessage, isNetworkError, isAuthError } from '../utils/apiError';
 *   const msg = getErrorMessage(err);
 */

// HTTP status → friendly message map
const STATUS_MESSAGES = {
  400: 'The request was invalid. Please check your input.',
  401: 'Your session has expired. Please sign in again.',
  403: "You don't have permission to perform this action.",
  404: 'The requested resource was not found.',
  409: 'This already exists. Please try with different details.',
  422: 'The data provided is invalid. Please review your input.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'Something went wrong on our end. Please try again shortly.',
  502: 'Our server is temporarily unavailable. Please try again.',
  503: 'Service is temporarily down for maintenance. Please try later.',
};

/**
 * Returns a user-friendly error message from an API error.
 * Prioritises the server's own message, then status map, then generic fallback.
 */
export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (!error) return fallback;

  // Network / offline
  if (error.message === 'Failed to fetch' || error.message?.includes('NetworkError')) {
    return 'No internet connection. Please check your network and try again.';
  }

  // Use server message if present and meaningful
  if (error.message && error.message !== 'Request failed') {
    return error.message;
  }

  // Map HTTP status
  if (error.status && STATUS_MESSAGES[error.status]) {
    return STATUS_MESSAGES[error.status];
  }

  return fallback;
};

/** True when the request never reached the server (offline / CORS / DNS) */
export const isNetworkError = (error) =>
  Boolean(
    error?.message === 'Failed to fetch' ||
    error?.message?.includes('NetworkError') ||
    error?.message?.includes('network')
  );

/** True for 401 — session expired */
export const isAuthError = (error) => error?.status === 401;

/** True for 403 — logged in but no permission */
export const isPermissionError = (error) => error?.status === 403;

/** True for 404 */
export const isNotFoundError = (error) => error?.status === 404;

/** True for 5xx */
export const isServerError = (error) =>
  error?.status >= 500 && error?.status < 600;

/** True for 409 conflict */
export const isConflictError = (error) => error?.status === 409;
