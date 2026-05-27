/**
 * useAuth.js — Auth hook (re-export from AuthContext).
 *
 * All existing imports of `useAuth` from this file continue to work.
 * The actual implementation now lives in src/context/AuthContext.jsx
 * so auth state is a singleton shared across all components.
 *
 * @deprecated Direct import from hooks/useAuth.js still works,
 *   but prefer: import { useAuth } from '../context/AuthContext';
 */
export { useAuth } from '../context/AuthContext';
