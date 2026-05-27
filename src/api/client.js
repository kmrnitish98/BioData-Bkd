/**
 * client.js — Legacy compatibility shim.
 *
 * All imports that previously did:
 *   import { apiLogin, apiGetMe } from '../api/client'
 * continue to work WITHOUT ANY CHANGES.
 *
 * The actual implementations have moved to:
 *   src/api/http.js     — core transport (retry, abort, timeout, logging)
 *   src/api/auth.js     — auth domain functions
 *   src/api/biodata.js  — biodata domain functions
 *   src/api/index.js    — public barrel
 *
 * Migration path (gradual, non-breaking):
 *   Step 1 (now):  All functions re-exported here. Nothing breaks.
 *   Step 2 (next): Update individual files to import from '../api' directly.
 *   Step 3 (later): Delete this shim once all callers are migrated.
 */

export {
  // Auth
  signUp      as apiSignUp,
  login       as apiLogin,
  googleLogin as apiGoogleLogin,
  logout      as apiLogout,
  getMe       as apiGetMe,
  forgotPassword     as apiForgotPassword,
  resetPassword      as apiResetPassword,
  verifyEmail        as apiVerifyEmail,
  resendVerification as apiResendVerification,
} from './auth';

export {
  // Biodata
  getPublicBiodatas  as apiGetPublicBiodatas,
  getBiodataById     as apiGetBiodataById,
  getPrivateBiodata  as apiGetPrivateBiodata,
  getMyBiodatas      as apiGetMyBiodatas,
  createBiodata      as apiCreateBiodata,
  updateBiodata      as apiUpdateBiodata,
  deleteBiodata      as apiDeleteBiodata,
  uploadPhoto        as apiUploadPhoto,
} from './biodata';

// Transport (for direct use in tests / advanced scenarios)
export { http, createAbortController } from './http';
