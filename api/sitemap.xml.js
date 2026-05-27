// Vercel Serverless Function — generates XML sitemap including public profile URLs.
//
// BACKEND_URL must be set in Vercel environment variables dashboard.
// This is a SERVER-SIDE runtime variable — NOT the Vite VITE_API_URL build-time variable.

/* global process */
const BACKEND_URL = process.env.BACKEND_URL;

export default async function handler(req, res) {
  try {
    let profileUrls = [];

    // Fetch public profile IDs from the backend if BACKEND_URL is configured.
    // The /api/biodata/public endpoint returns full biodata objects —
    // we extract only the _id field to build profile URLs.
    if (BACKEND_URL) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/biodata/public`, {
          signal: AbortSignal.timeout(5000), // 5s timeout — don't block sitemap for slow API
        });

        if (response.ok) {
          const biodatas = await response.json();
          // biodatas is an array of objects with _id field (standard Mongoose output)
          if (Array.isArray(biodatas)) {
            profileUrls = biodatas
              .filter((b) => b._id)
              .map((b) => `
    <url>
      <loc>https://aguaa.in/profile/${b._id}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>`);
          }
        }
      } catch (fetchErr) {
        // Non-fatal — we still return the static pages sitemap even if backend is down
        console.warn('[Sitemap] Could not fetch profile IDs from backend:', fetchErr.message);
      }
    } else {
      console.warn('[Sitemap] BACKEND_URL is not set — profile URLs will be omitted from sitemap');
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <!-- Static pages -->
  <url>
    <loc>https://aguaa.in/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://aguaa.in/explore</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>https://aguaa.in/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://aguaa.in/pricing</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://aguaa.in/gallery</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>
  <url>
    <loc>https://aguaa.in/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://aguaa.in/privacy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>https://aguaa.in/terms</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>https://aguaa.in/refund</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

  <!-- Dynamic public profile pages -->
  ${profileUrls.join('')}

</urlset>`;

    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    // Cache at Vercel edge for 24 hours; serve stale for another 24h while revalidating
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=86400');
    return res.status(200).send(sitemap.trim());

  } catch (error) {
    console.error('[Sitemap] Unexpected error:', error.message);
    return res.status(500).send('Internal Server Error');
  }
}
