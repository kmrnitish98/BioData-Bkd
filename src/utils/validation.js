/**
 * validation.js — Shared react-hook-form validation rule objects.
 *
 * Usage:
 *   import { emailRules, passwordRules, nameRules } from '../utils/validation';
 *   <input {...register('email', emailRules)} />
 */

export const nameRules = {
  required: 'Full name is required',
  minLength: { value: 2, message: 'Name must be at least 2 characters' },
  maxLength: { value: 60, message: 'Name must be under 60 characters' },
  pattern: {
    value: /^[a-zA-Z\u0900-\u097F\s'-]+$/,
    message: 'Name can only contain letters, spaces, hyphens and apostrophes',
  },
};

export const emailRules = {
  required: 'Email address is required',
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    message: 'Please enter a valid email address',
  },
  maxLength: { value: 254, message: 'Email address is too long' },
};

export const passwordRules = {
  required: 'Password is required',
  minLength: { value: 8, message: 'Password must be at least 8 characters' },
  maxLength: { value: 128, message: 'Password must be under 128 characters' },
};

export const newPasswordRules = {
  ...passwordRules,
  validate: {
    hasUppercase: (v) => /[A-Z]/.test(v) || 'Must contain at least one uppercase letter',
    hasLowercase: (v) => /[a-z]/.test(v) || 'Must contain at least one lowercase letter',
    hasNumber:    (v) => /\d/.test(v)    || 'Must contain at least one number',
  },
};

/** Confirm-password rule — needs access to getValues from useForm */
export const confirmPasswordRules = (getValues) => ({
  required: 'Please confirm your password',
  validate: (value) => value === getValues('password') || 'Passwords do not match',
});

/**
 * Returns a password strength score 0-4 and label.
 * 0 = empty, 1 = weak, 2 = fair, 3 = good, 4 = strong
 */
export const getPasswordStrength = (password = '') => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;

  const map = [
    { label: '',       color: '' },
    { label: 'Weak',   color: '#ef4444' },
    { label: 'Fair',   color: '#f97316' },
    { label: 'Good',   color: '#eab308' },
    { label: 'Strong', color: '#22c55e' },
  ];
  return { score, ...map[score] };
};
