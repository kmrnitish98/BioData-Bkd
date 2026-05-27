import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env vars for the current mode so we can validate them at build time
  const env = loadEnv(mode, process.cwd(), '');
  const isProd = mode === 'production';

  // ── Build-time validation ─────────────────────────────────────────────────
  // Catch missing required env vars at build time rather than at runtime in
  // production — this stops a broken build from being deployed silently.
  if (isProd) {
    const required = ['VITE_API_URL', 'VITE_GOOGLE_CLIENT_ID'];
    const missing = required.filter((key) => !env[key]);
    if (missing.length > 0) {
      throw new Error(
        `[Vite Build] Missing required environment variables for production build:\n` +
        missing.map((k) => `  ✗ ${k}`).join('\n') +
        `\n\nSet these in Vercel → Project Settings → Environment Variables.\n`
      );
    }
  }

  return {
    plugins: [react()],

    build: {
      // ES2020 target — supported by all modern browsers and aligns with React 19
      target: 'es2020',

      // Disable source maps in production — they expose your source code and
      // add ~40% to upload size. Enable only for staging if you need debugging.
      sourcemap: isProd ? false : 'inline',

      // Minify with esbuild (Vite default) — fast and produces very small output
      minify: isProd ? 'esbuild' : false,

      rollupOptions: {
        output: {
          manualChunks: {
            // Core React runtime — cached long-term; changes rarely
            'react-vendor': ['react', 'react-dom'],
            // Router
            'router': ['react-router-dom'],
            // Animation library
            'animation': ['framer-motion'],
            // Swiper gallery
            'swiper': ['swiper'],
            // UI icon library
            'ui-utils': ['lucide-react'],
            // Form management
            'forms': ['react-hook-form'],
            // Data fetching / cache
            'query': ['@tanstack/react-query'],
            // Google OAuth — loaded only when auth is needed
            'google-oauth': ['@react-oauth/google'],
          },
        },
      },
    },

    server: {
      // Required for Google OAuth popup to work on localhost
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      },
    },

    preview: {
      // Same headers for `vite preview` (local production preview)
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      },
    },
  };
});
