import { useState, useEffect, useCallback } from 'react';
import { apiGetMe } from '../api/client';

export const useAuth = () => {
  // Initialize synchronously from localStorage — no flash, instant render
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('biodata_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // loading=true only when we have a cached user and are verifying it with the server.
  // If there's no cached user, there's nothing to verify — loading is immediately false.
  const [loading, setLoading] = useState(
    () => Boolean(localStorage.getItem('biodata_user'))
  );

  useEffect(() => {
    const hasCachedUser = localStorage.getItem('biodata_user');
    if (!hasCachedUser) {
      // No cached user → not logged in, nothing to verify
      setLoading(false);
      return;
    }

    apiGetMe()
      .then((user) => {
        // Token is valid — refresh the cached user with latest server data
        setCurrentUser(user);
        localStorage.setItem('biodata_user', JSON.stringify(user));
      })
      .catch((err) => {
        // Only clear auth on actual authentication failures (401 Unauthorized).
        // Network errors, CORS issues, server down, etc. should NOT log the user out —
        // they still have a valid cookie and we can trust the localStorage copy.
        if (err.status === 401) {
          localStorage.removeItem('biodata_user');
          setCurrentUser(null);
        }
        // For any other error: keep currentUser from localStorage as-is
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback((user) => {
    localStorage.setItem('biodata_user', JSON.stringify(user));
    setCurrentUser(user);
  }, []);

  const logout = useCallback(async () => {
    try {
      // Need to import apiLogout at top if not done, but we can do it via dynamic import or just let it fail silently if not needed.
      // Better yet, let's just make sure apiLogout is imported at the top.
      const { apiLogout } = await import('../api/client');
      await apiLogout();
    } catch(err) {
      console.error('Logout error', err);
    }
    localStorage.removeItem('biodata_user');
    setCurrentUser(null);
  }, []);

  return { currentUser, loading, login, logout };
};
