/* global process */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─────────────────────────────────────────────────────────────────────────────
// BACKEND_URL is the runtime env var set in Vercel's dashboard.
// VITE_API_URL is a BUILD-TIME variable — it is baked into the JS bundle and
// is NOT available in Vercel serverless functions at runtime. Never use it here.
// ─────────────────────────────────────────────────────────────────────────────
const BACKEND_URL = process.env.BACKEND_URL;

// Vercel Serverless Function — injects profile-specific Open Graph tags
// so WhatsApp/Twitter/Facebook previews show the person's name and photo.
export default async function handler(req, res) {
  try {
    const { id } = req.query;
    if (!id) {
      return fallback(res);
    }

    // Guard: if BACKEND_URL is not configured in Vercel env vars, log and fall back
    if (!BACKEND_URL) {
      console.error('[OG] BACKEND_URL env var is not set in Vercel — falling back to default HTML');
      return fallback(res);
    }

    const apiUrl = `${BACKEND_URL}/api/biodata/${id}`;
    const response = await fetch(apiUrl, {
      // 5-second timeout so a slow/down backend doesn't block social crawlers
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return fallback(res);
    }

    const data = await response.json();
    const name      = data?.personalInfo?.fullName || 'Biodata Profile';
    const city      = data?.personalInfo?.city || '';
    const age       = calculateAge(data?.personalInfo?.dob);
    const photoURL  = data?.photoURL || 'https://aguaa.in/logo.png';

    const title       = `${name}'s Biodata | Aguaa`;
    const description = [
      `View ${name}'s verified marriage profile`,
      age  ? `(${age} yrs)` : '',
      city ? `from ${city}` : '',
      '— Dil Se Rishta, Vishwas Se Shaadi.',
    ].filter(Boolean).join(' ');

    // Read the compiled dist/index.html (built by Vite, present in production)
    const indexPath = path.join(process.cwd(), 'dist', 'index.html');
    if (!fs.existsSync(indexPath)) {
      console.error('[OG] dist/index.html not found — did the Vite build run?');
      return fallback(res);
    }

    let html = fs.readFileSync(indexPath, 'utf8');

    // Remove existing title and description tags so we don't have duplicates
    html = html
      .replace(/<title>[\s\S]*?<\/title>/, '')
      .replace(/<meta\s+name="description"[^>]*>/i, '');

    // Inject profile-specific OG tags right before </head>
    const ogTags = `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="${escapeHtml(photoURL)}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:url" content="https://aguaa.in/profile/${encodeURIComponent(id)}">
    <meta property="og:type" content="profile">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${escapeHtml(photoURL)}">
    `;

    html = html.replace('</head>', `${ogTags}</head>`);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).send(html);

  } catch (error) {
    console.error('[OG] Error injecting OG tags:', error.message);
    return fallback(res);
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function fallback(res) {
  try {
    const indexPath = path.join(process.cwd(), 'dist', 'index.html');
    if (!fs.existsSync(indexPath)) {
      return res.status(500).send('Build not found');
    }
    const html = fs.readFileSync(indexPath, 'utf8');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=300');
    return res.status(200).send(html);
  } catch {
    return res.status(500).send('Internal Server Error');
  }
}

function calculateAge(dob) {
  if (!dob) return null;
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age > 0 ? age : null;
}

// Prevent OG tag injection from being a stored-XSS vector
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
