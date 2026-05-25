/* global process */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vercel Serverless Function to inject Open Graph tags for Profile sharing
export default async function handler(req, res) {
  try {
    const { id } = req.query;
    if (!id) {
      return fallback(res);
    }

    // Fetch biodata from production backend
    // Replace this with your actual production backend URL
    const backendUrl = process.env.VITE_API_URL || 'https://aguaa-backend-production.up.railway.app';
    
    // We do a direct fetch to the backend API
    const response = await fetch(`${backendUrl}/api/biodata/${id}`);
    if (!response.ok) {
      return fallback(res);
    }
    
    const data = await response.json();
    const name = data?.personalInfo?.fullName || 'Biodata Profile';
    const city = data?.personalInfo?.city || '';
    const age = calculateAge(data?.personalInfo?.dob);
    const photoURL = data?.photoURL || data?.personalInfo?.photoURL || 'https://aguaa.in/default-share.jpg';
    
    const title = `${name}'s Biodata | Aguaa`;
    const description = `View ${name}'s verified marriage profile${age ? ` (${age} yrs)` : ''}${city ? ` from ${city}` : ''}. Looking for a loving life partner.`;

    // Read the compiled index.html
    const indexPath = path.join(__dirname, '..', 'index.html');
    let html = fs.readFileSync(indexPath, 'utf8');

    // Inject OG Tags before </head>
    const ogTags = `
      <title>${title}</title>
      <meta name="description" content="${description}">
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${description}">
      <meta property="og:image" content="${photoURL}">
      <meta property="og:url" content="https://aguaa.in/profile/${id}">
      <meta property="og:type" content="profile">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${title}">
      <meta name="twitter:description" content="${description}">
      <meta name="twitter:image" content="${photoURL}">
    `;

    html = html.replace('</head>', `${ogTags}</head>`);
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // Cache for 1 hour at edge
    return res.status(200).send(html);

  } catch (error) {
    console.error('OG Tag injection error:', error);
    return fallback(res);
  }
}

function fallback(res) {
  try {
   const indexPath = path.join(process.cwd(), 'dist', 'index.html');
   if (!fs.existsSync(indexPath)) {
        return res.status(500).send('index.html not found');
      }
    const html = fs.readFileSync(indexPath, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  } catch (e) {
    return res.status(500).send('Internal Server Error');
  }
}

function calculateAge(dob) {
  if (!dob) return null;
  const birthDate = new Date(dob);
  if (isNaN(birthDate)) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age > 0 ? age : null;
}
