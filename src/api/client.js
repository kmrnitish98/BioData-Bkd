// Central API base URL — reads from Vite env or falls back to localhost
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Core fetch wrapper. Automatically attaches the JWT token from localStorage
 * and handles JSON parsing + error extraction.
 */
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('biodata_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = { message: 'Server returned an unexpected response' };
  }

  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    err.status = res.status;
    throw err;
  }

  return data;
};

// ── Auth ─────────────────────────────────────────────────────────────────────

export const apiSignUp = (name, email, password) =>
  request('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) });

export const apiLogin = (email, password) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const apiGoogleLogin = (token) =>
  request('/auth/google', { method: 'POST', body: JSON.stringify({ token }) });



export const apiGetMe = () => request('/auth/me');

// ── Biodata ───────────────────────────────────────────────────────────────────

export const apiGetPublicBiodatas = () => request('/biodata/public');

export const apiGetBiodataById = (id) => request(`/biodata/${id}`);

export const apiGetPrivateBiodata = (id) => request(`/biodata/user/${id}/private`);

export const apiGetMyBiodatas = () => request('/biodata/user/me');

export const apiCreateBiodata = (data) =>
  request('/biodata', { method: 'POST', body: JSON.stringify(data) });

export const apiUpdateBiodata = (id, data) =>
  request(`/biodata/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

export const apiDeleteBiodata = (id) => request(`/biodata/${id}`, { method: 'DELETE' });

// ── Photo Upload ──────────────────────────────────────────────────────────────

/**
 * Upload a photo file to the backend (which forwards to Cloudinary).
 * Uses FormData — no Content-Type header (browser sets multipart boundary automatically).
 */
export const apiUploadPhoto = async (file, onProgress) => {
  const token = localStorage.getItem('biodata_token');
  const formData = new FormData();
  formData.append('photo', file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${BASE_URL}/biodata/upload-photo`);
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

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
          reject(new Error(data.message || 'Upload failed'));
        }
      } catch {
        reject(new Error('Upload failed — invalid response'));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
};
