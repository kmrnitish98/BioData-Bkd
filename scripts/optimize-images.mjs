/**
 * optimize-images.mjs — One-time image optimization script
 *
 * Run with:  node scripts/optimize-images.mjs
 *
 * What it does:
 *   - logo-2.png      (445 KB) → logo-2.webp   (target <45 KB)
 *   - logo.png        (122 KB) → logo.webp      (target <25 KB)
 *   - photo1-4.png    (~800 KB each) → .webp    (target <80 KB each)
 *   - og-banner.png   (697 KB) → og-banner.webp (target <180 KB)
 *
 * After running, update imports in:
 *   - src/pages/LoginPage.jsx, SignupPage.jsx, ForgotPasswordPage.jsx,
 *     ResetPasswordPage.jsx, VerifyEmailPage.jsx (logo-2.png → logo-2.webp)
 *
 * Keep originals — don't delete PNGs (backward compat with index.html og:image).
 */

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SRC_ASSETS = path.join(__dirname, '..', 'src', 'assets');

const formatBytes = (b) => `${(b / 1024).toFixed(1)} KB`;

const results = [];

const processImage = async ({
  input,
  output,
  format,           // 'webp' | 'jpeg'
  quality,
  width,            // optional: resize width (maintains aspect ratio)
  label,
}) => {
  const inputStat = await stat(input).catch(() => null);
  if (!inputStat) {
    console.warn(`  ⚠  Skipping (not found): ${input}`);
    return;
  }

  const before = inputStat.size;
  let pipeline = sharp(input);

  if (width) {
    pipeline = pipeline.resize(width, null, {
      withoutEnlargement: true,
      fit: 'inside',
    });
  }

  if (format === 'webp') {
    pipeline = pipeline.webp({ quality, effort: 6 });
  } else if (format === 'jpeg') {
    pipeline = pipeline.jpeg({ quality, progressive: true, mozjpeg: true });
  }

  await pipeline.toFile(output);

  const after = (await stat(output)).size;
  const saving = Math.round((1 - after / before) * 100);

  results.push({ label, before, after, saving });
  console.log(
    `  ✓ ${label.padEnd(28)} ${formatBytes(before).padStart(10)} → ${formatBytes(after).padStart(10)}  (${saving}% smaller)`
  );
};

console.log('\n🔧 Aguaa Image Optimizer\n' + '─'.repeat(65));
console.log(`  ${'File'.padEnd(28)} ${'Before'.padStart(10)}   ${'After'.padStart(10)}  Savings\n` + '─'.repeat(65));

await Promise.all([
  // ── Auth page logo (445 KB → target <45 KB) ───────────────────────
  processImage({
    label:   'logo-2.png → logo-2.webp',
    input:   path.join(PUBLIC_DIR, 'logo-2.png'),
    output:  path.join(PUBLIC_DIR, 'logo-2.webp'),
    format:  'webp',
    quality: 85,
    width:   400,
  }),

  // ── Main logo (122 KB → target <25 KB) ────────────────────────────
  processImage({
    label:   'logo.png → logo.webp',
    input:   path.join(PUBLIC_DIR, 'logo.png'),
    output:  path.join(PUBLIC_DIR, 'logo.webp'),
    format:  'webp',
    quality: 85,
    width:   400,
  }),

  // ── OG banner — must be JPEG/PNG for WhatsApp (<300 KB) ───────────
  // Also produce a WebP version for modern browsers
  processImage({
    label:   'og-banner.png → og-banner.jpg',
    input:   path.join(PUBLIC_DIR, 'og-banner.png'),
    output:  path.join(PUBLIC_DIR, 'og-banner.jpg'),
    format:  'jpeg',
    quality: 82,
    width:   1200,
  }),
  processImage({
    label:   'og-banner.png → og-banner.webp',
    input:   path.join(PUBLIC_DIR, 'og-banner.png'),
    output:  path.join(PUBLIC_DIR, 'og-banner.webp'),
    format:  'webp',
    quality: 82,
    width:   1200,
  }),

  // ── Demo/gallery photos ────────────────────────────────────────────
  processImage({
    label:   'photo1.png → photo1.webp',
    input:   path.join(PUBLIC_DIR, 'photo1.png'),
    output:  path.join(PUBLIC_DIR, 'photo1.webp'),
    format:  'webp',
    quality: 80,
    width:   800,
  }),
  processImage({
    label:   'photo2.png → photo2.webp',
    input:   path.join(PUBLIC_DIR, 'photo2.png'),
    output:  path.join(PUBLIC_DIR, 'photo2.webp'),
    format:  'webp',
    quality: 80,
    width:   800,
  }),
  processImage({
    label:   'photo3.png → photo3.webp',
    input:   path.join(PUBLIC_DIR, 'photo3.png'),
    output:  path.join(PUBLIC_DIR, 'photo3.webp'),
    format:  'webp',
    quality: 80,
    width:   800,
  }),
  processImage({
    label:   'photo4.png → photo4.webp',
    input:   path.join(PUBLIC_DIR, 'photo4.png'),
    output:  path.join(PUBLIC_DIR, 'photo4.webp'),
    format:  'webp',
    quality: 80,
    width:   800,
  }),

  // ── src/assets logo (used by Navbar + Loader) ─────────────────────
  processImage({
    label:   'aguaa-logo-r.png → .webp',
    input:   path.join(SRC_ASSETS, 'aguaa-logo-r.png'),
    output:  path.join(SRC_ASSETS, 'aguaa-logo-r.webp'),
    format:  'webp',
    quality: 88,
    width:   300,
  }),
]);

console.log('─'.repeat(65));

const totalBefore = results.reduce((s, r) => s + r.before, 0);
const totalAfter  = results.reduce((s, r) => s + r.after,  0);
const totalSaving = Math.round((1 - totalAfter / totalBefore) * 100);

console.log(`\n  Total savings: ${formatBytes(totalBefore)} → ${formatBytes(totalAfter)}  (${totalSaving}% smaller)\n`);
console.log(`✅ Done. Originals preserved. Update imports to use .webp versions.\n`);
