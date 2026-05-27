/**
 * AuthContext.jsx — Proper React Context for authentication state.
 *
 * Problem this solves:
 *  useAuth() currently holds state in every component that calls it.
 *  If two components call useAuth(), they each get SEPARATE state instances —
 *  meaning a login in one component wouldn't update the other.
 *  (Currently this is hidden by localStorage hydration, but it's a latent bug.)
 *
 * Solution:
 *  Single AuthContext at the app root. All components share ONE state instance.
 *  useAuth() becomes a thin hook that reads from this context.
 *
 * Architecture benefits:
 *  - Single source of truth for auth state
 *  - 401 global redirect handled here via AUTH_EXPIRED_EVENT
 *  - No prop drilling
 *  - Easy to unit-test by wrapping in <AuthProvider value={mockAuth}>
 *
 * Usage:
 *   // In App.jsx (already added):
 *   <AuthProvider><App /></AuthProvider>
 *
 *   // In any component (API unchanged — same as before):
 *   const { currentUser, login, logout, loading } = useAuth();
 */

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getMe, logout as apiLogout } from '../api/auth';
import { AUTH_EXPIRED_EVENT } from '../api/http';
import { AUTH } from '../constants/limits';
import logger from '../lib/logger';

// ── Context ──────────────────────────────────────────────────────────────────
export const AuthContext = createContext(null);

// ── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  // ── Hydrate from localStorage synchronously (no flash) ─────────────────
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH.USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Always start loading=true — prevents ProtectedRoute from seeing
  // a null user before the server session-verify completes.
  // Set to false only after getMe() resolves or rejects.
  const [loading, setLoading] = useState(true);

  // Ref to track if component is still mounted (prevents setState on unmounted)
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  // ── Verify session on mount ─────────────────────────────────────────────
  useEffect(() => {
    const controller = new AbortController();

    getMe(controller.signal)
      .then((user) => {
        if (!mounted.current) return;
        // getMe returns data.user — if backend /auth/me wraps in { user: } correctly
        // this will be the user object. If undefined, cookie is missing/invalid.
        if (!user) {
          localStorage.removeItem(AUTH.USER_STORAGE_KEY);
          setCurrentUser(null);
          return;
        }
        setCurrentUser(user);
        localStorage.setItem(AUTH.USER_STORAGE_KEY, JSON.stringify(user));
        logger.info('Session verified', { context: 'AuthContext', data: { id: user._id } });
      })
      .catch((err) => {
        if (!mounted.current) return;
        // Ignore aborted/timed-out requests (StrictMode double-mount cleanup)
        if (err.code === 'ABORTED' || err.code === 'TIMEOUT') return;
        if (err.status === 401) {
          // Genuine session expiry — clear auth
          localStorage.removeItem(AUTH.USER_STORAGE_KEY);
          setCurrentUser(null);
          logger.info('Session expired — logged out', { context: 'AuthContext' });
        }
        // Network errors / 5xx: keep cached user (cookie may still be valid)
      })
      .finally(() => {
        if (mounted.current) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  // ── Global 401 handler ──────────────────────────────────────────────────
  // The HTTP layer fires AUTH_EXPIRED_EVENT for any 401 from any request.
  // This catches cases where the cookie expires mid-session (not just on mount).
  useEffect(() => {
    const handleExpiry = () => {
      if (!mounted.current) return;
      logger.warn('Auth expired event received — clearing session', { context: 'AuthContext' });
      localStorage.removeItem(AUTH.USER_STORAGE_KEY);
      setCurrentUser(null);
      // Navigate to login — use window.location to avoid Router coupling
      if (!window.location.pathname.startsWith('/login')) {
        window.location.replace('/login?reason=session_expired');
      }
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpiry);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpiry);
  }, []);

  // ── Actions ─────────────────────────────────────────────────────────────
  const login = useCallback((user) => {
    localStorage.setItem(AUTH.USER_STORAGE_KEY, JSON.stringify(user));
    setCurrentUser(user);
    logger.action('login', { userId: user._id });
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (err) {
      logger.warn('Logout API call failed (continuing)', { context: 'AuthContext', data: err });
    }
    localStorage.removeItem(AUTH.USER_STORAGE_KEY);
    setCurrentUser(null);
    logger.action('logout');
  }, []);

  // ── Context value ────────────────────────────────────────────────────────
  const value = {
    currentUser,
    loading,
    login,
    logout,
    /** Convenience: true if the current user has a verified email */
    isEmailVerified: currentUser?.emailVerified ?? false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ── Hook ─────────────────────────────────────────────────────────────────────
/**
 * useAuth — reads auth state from AuthContext.
 * Must be used inside <AuthProvider>.
 * API is identical to the old useAuth() hook — zero breaking changes.
 *
 * @returns {{ currentUser, loading, login, logout, isEmailVerified }}
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx && import.meta.env.DEV) {
    throw new Error('useAuth() must be used inside <AuthProvider>. Check your component tree.');
  }
  return ctx;
};

export default AuthProvider;
