/**
 * useDebounce.js — Generic debounce hook.
 *
 * Returns a debounced version of `value` that only updates
 * after `delay` ms of no changes. Used by useBiodatasQuery
 * to avoid firing API requests on every search keystroke.
 *
 * Usage:
 *   const debouncedSearch = useDebounce(searchInput, 350);
 *
 * @template T
 * @param {T} value
 * @param {number} delay — milliseconds
 * @returns {T}
 */

import { useState, useEffect } from 'react';

export const useDebounce = (value, delay = 350) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

export default useDebounce;
