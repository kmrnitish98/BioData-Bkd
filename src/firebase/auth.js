import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  updateProfile,
} from 'firebase/auth';

import { auth } from './config';

const googleProvider = new GoogleAuthProvider();
// Ask Google to always show account picker
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const signUpWithEmail = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName });
  return userCredential.user;
};

export const signInWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

/**
 * Try popup first (fast UX). If blocked by an extension or browser,
 * fall back to redirect-based sign-in automatically.
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    // Extension or browser blocked the popup → fall back to redirect
    const blockedCodes = [
      'auth/popup-blocked',
      'auth/popup-closed-by-user',
      'auth/cancelled-popup-request',
      'auth/network-request-failed',
      'auth/internal-error',
    ];
    if (blockedCodes.includes(err.code)) {
      // Redirect — page will reload, result handled in useAuth
      await signInWithRedirect(auth, googleProvider);
      return null; // page navigates away
    }
    throw err;
  }
};

/**
 * Call this once on app load to capture result from redirect sign-in.
 * Returns the user if a redirect just completed, otherwise null.
 */
export const getGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    return result?.user ?? null;
  } catch {
    return null;
  }
};

export const logOut = async () => {
  await signOut(auth);
};
