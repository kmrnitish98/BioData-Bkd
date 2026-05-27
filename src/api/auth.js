/**
 * auth.js — Auth domain API module.
 *
 * All authentication-related API calls live here.
 * Import from '../api' (barrel) in application code.
 */

import { http } from './http';

/**
 * Register a new user.
 * @param {{ name: string, email: string, password: string }} payload
 * @returns {Promise<{ user: object }>}
 */
export const signUp = ({ name, email, password }) =>
  http('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });

/**
 * Log in with email and password.
 * @param {{ email: string, password: string }} payload
 * @returns {Promise<{ user: object }>}
 */
export const login = ({ email, password }) =>
  http('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

/**
 * Authenticate via Google OAuth token.
 * @param {string} token — Google ID token or access token
 * @returns {Promise<{ user: object }>}
 */
export const googleLogin = (token) =>
  http('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });

/**
 * Log out the current user (clears server-side cookie).
 */
export const logout = () =>
  http('/auth/logout', { method: 'POST' });

/**
 * Get the currently authenticated user from the server.
 * Used to verify the session cookie on app load.
 * @param {AbortSignal} [signal]
 * @returns {Promise<object>} user object
 */
export const getMe = (signal) =>
  http('/auth/me', { signal }).then((data) => data.user);

/**
 * Request a password reset email.
 * @param {string} email
 */
export const forgotPassword = (email) =>
  http('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

/**
 * Reset the password using a token from the email link.
 * @param {{ token: string, password: string }} payload
 */
export const resetPassword = ({ token, password }) =>
  http('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });

/**
 * Verify an email address using a token from the verification email.
 * @param {string} token
 */
export const verifyEmail = (token) =>
  http('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });

/**
 * Resend the verification email.
 * @param {string} email
 */
export const resendVerification = (email) =>
  http('/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
