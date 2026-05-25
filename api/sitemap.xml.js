// Vercel Serverless Function for dynamic sitemap generation
export default async function handler(req, res) {
  try {
    const backendUrl = process.env.VITE_API_URL || 'https://aguaa-backend-production.up.railway.app';
    
    // We assume there's an endpoint to get all public profile IDs. 
    // In Biodata.js we have an index for isPublic: true.
    const response = await fetch(`${backendUrl}/api/biodata/public/ids`);
    
    let urls = [];
    
    if (response.ok) {
      const ids = await response.json();
      urls = ids.map(id => `
        <url>
          <loc>https://aguaa.in/profile/${id}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `);
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>https://aguaa.in/</loc>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
        <url>
          <loc>https://aguaa.in/explore</loc>
          <changefreq>daily</changefreq>
          <priority>0.9</priority>
        </url>
        ${urls.join('')}
      </urlset>
    `;

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate'); // Cache for 24h
    return res.status(200).send(sitemap.trim());
  } catch (error) {
    console.error('Sitemap error:', error);
    res.status(500).send('Internal Server Error');
  }
}
