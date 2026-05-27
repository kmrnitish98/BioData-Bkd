/**
 * biodata.js — Biodata domain API module.
 *
 * All biodata-related API calls live here, including:
 *  - Paginated public list (cursor-based, ready for infinite scroll)
 *  - CRUD operations
 *  - Photo upload with XHR progress tracking
 *
 * Import from '../api' (barrel) in application code.
 */

import { API_URL } from '../config/env';
import { http, createAbortController } from './http';
import { PAGINATION, UPLOAD, TIMEOUTS } from '../constants/limits';
import logger from '../lib/logger';

// ── Read ─────────────────────────────────────────────────────────────────────

/**
 * Fetch paginated public biodatas.
 *
 * Backend is expected to support:
 *   GET /biodata/public?page=1&limit=12&search=rahul&filter=With+Photo
 *
 * Falls back gracefully if backend doesn't yet support pagination
 * (returns the full array as { data: [...], total, page, totalPages }).
 *
 * @param {{ page?: number, limit?: number, search?: string, filter?: string, signal?: AbortSignal }} params
 * @returns {Promise<{ data: object[], total: number, page: number, totalPages: number }>}
 */
export const getPublicBiodatas = async ({
  page   = 1,
  limit  = PAGINATION.EXPLORE_PAGE_SIZE,
  search = '',
  filter = 'All',
  signal,
} = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (search) params.set('search', search);
  if (filter && filter !== 'All') params.set('filter', filter);

  const result = await http(`/biodata/public?${params}`, { signal });

  // ── Normalise response ──────────────────────────────────────────────────
  // Handle both old format (plain array) and new paginated format
  if (Array.isArray(result)) {
    return {
      data:       result,
      total:      result.length,
      page:       1,
      totalPages: 1,
      hasMore:    false,
    };
  }
  return {
    data:       result.data       ?? result.biodatas ?? [],
    total:      result.total      ?? 0,
    page:       result.page       ?? page,
    totalPages: result.totalPages ?? 1,
    hasMore:    result.hasMore    ?? false,
  };
};

/**
 * Fetch a single public biodata by ID.
 * @param {string} id
 * @param {AbortSignal} [signal]
 */
export const getBiodataById = (id, signal) =>
  http(`/biodata/${id}`, { signal });

/**
 * Fetch a private biodata (owner only).
 * @param {string} userId
 * @param {AbortSignal} [signal]
 */
export const getPrivateBiodata = (userId, signal) =>
  http(`/biodata/user/${userId}/private`, { signal });

/**
 * Fetch all biodatas belonging to the currently authenticated user.
 * @param {AbortSignal} [signal]
 */
export const getMyBiodatas = (signal) =>
  http('/biodata/user/me', { signal });

// ── Write ────────────────────────────────────────────────────────────────────

/**
 * Create a new biodata.
 * @param {object} data — biodata payload
 * @returns {Promise<{ _id: string }>}
 */
export const createBiodata = (data) =>
  http('/biodata', {
    method: 'POST',
    body: JSON.stringify(data),
  });

/**
 * Partially update a biodata.
 * @param {string} id
 * @param {Partial<object>} data — fields to update
 */
export const updateBiodata = (id, data) =>
  http(`/biodata/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

/**
 * Delete a biodata by ID.
 * @param {string} id
 */
export const deleteBiodata = (id) =>
  http(`/biodata/${id}`, { method: 'DELETE' });

// ── Upload ───────────────────────────────────────────────────────────────────

/**
 * Upload a photo to Cloudinary via the backend.
 * Uses XHR for upload progress reporting.
 *
 * @param {File} file — validated by UPLOAD limits before calling
 * @param {(pct: number) => void} [onProgress]
 * @returns {Promise<{ photoURL: string, photoPublicId: string }>}
 */
export const uploadPhoto = (file, onProgress) => {
  // ── Client-side validation ──────────────────────────────────────────────
  if (file.size > UPLOAD.MAX_PHOTO_BYTES) {
    return Promise.reject(
      new Error(`Photo must be under ${UPLOAD.MAX_PHOTO_BYTES / 1024 / 1024} MB`)
    );
  }
  if (!UPLOAD.ACCEPTED_PHOTO_TYPES.includes(file.type)) {
    return Promise.reject(
      new Error('Only JPEG, PNG and WebP images are supported')
    );
  }

  const formData = new FormData();
  formData.append('photo', file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}/biodata/upload-photo`);
    xhr.withCredentials = true;
    xhr.timeout = TIMEOUTS.UPLOAD_MS;

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data);
        } else {
          const err = new Error(data.message || 'Upload failed');
          err.status = xhr.status;
          logger.apiError('/biodata/upload-photo', err);
          reject(err);
        }
      } catch {
        reject(new Error('Upload failed — invalid server response'));
      }
    };

    xhr.ontimeout = () => reject(new Error('Upload timed out. Please try again.'));
    xhr.onerror   = () => reject(new Error('Network error during upload'));

    xhr.send(formData);
  });
};
