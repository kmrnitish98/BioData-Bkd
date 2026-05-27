/**
 * routes.js — Single source of truth for all application route paths.
 *
 * Problem this solves:
 *  Right now route strings like '/forgot-password', '/dashboard', '/profile/:id'
 *  are scattered across 20+ files. A single typo causes a silent 404.
 *
 * Usage:
 *   import { ROUTES } from '../constants/routes';
 *   navigate(ROUTES.DASHBOARD);
 *   <Link to={ROUTES.PROFILE(':id')} />
 *   <Route path={ROUTES.PROFILE(':id')} element={...} />
 */

export const ROUTES = {
  // ── Public ─────────────────────────────────────────────────────
  HOME:             '/',
  GALLERY:          '/gallery',
  ABOUT:            '/about',
  PRICING:          '/pricing',
  PRIVACY:          '/privacy',
  TERMS:            '/terms',
  REFUND:           '/refund',
  CONTACT:          '/contact',
  EXPLORE:          '/explore',

  // ── Auth ───────────────────────────────────────────────────────
  LOGIN:            '/login',
  SIGNUP:           '/signup',
  FORGOT_PASSWORD:  '/forgot-password',
  RESET_PASSWORD:   '/reset-password',
  VERIFY_EMAIL:     '/verify-email',

  // ── Protected ─────────────────────────────────────────────────
  DASHBOARD:        '/dashboard',
  CREATE:           '/create',

  // ── Dynamic (functions returning strings) ─────────────────────
  PROFILE:  (id) => `/profile/${id}`,
  EDIT:     (id) => `/edit/${id}`,

  // ── Error pages ────────────────────────────────────────────────
  NOT_FOUND:        '*',
  SERVER_ERROR:     '/500',
};

export default ROUTES;
