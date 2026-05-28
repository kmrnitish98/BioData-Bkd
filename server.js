require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');

const app = express();
const IS_PROD = process.env.NODE_ENV === 'production';

// ── Startup env var validation ────────────────────────────────────────────────
// Fail fast at startup if critical secrets are missing — better than crashing
// mid-request when the first DB query or JWT sign is attempted.
const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET'];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error('❌ [Server] Missing required environment variables:');
  missingEnv.forEach((key) => console.error(`   ✗ ${key}`));
  console.error('   Set these in your .env file (dev) or hosting dashboard (production).');
  process.exit(1);
}

// ── Connect to MongoDB Atlas
connectDB();

// ── CORS — explicitly allowlisted origins only.
//    In production ONLY aguaa.in and the canonical Vercel domain are allowed.
//    In development any localhost port is allowed for convenience.
//
//    CLIENT_URL env var is the single source of truth for your frontend URL.
//    Update it in Render env vars when your frontend domain changes.
const allowedOrigins = [
  'https://aguaa.in',
  'https://www.aguaa.in',
  /^https:\/\/aguaa-[a-z0-9-]+\.vercel\.app$/, // Vercel preview deploys
  'https://aguaa-taupe.vercel.app',             // Current production Vercel URL
];

// Dynamically add CLIENT_URL if it's set and not already in the list
if (process.env.CLIENT_URL && !allowedOrigins.includes(process.env.CLIENT_URL)) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

// In development also allow localhost on any port
if (!IS_PROD) {
  allowedOrigins.push(
    /^http:\/\/localhost:\d+$/,
    /^http:\/\/127\.0\.0\.1:\d+$/
  );
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server requests (no Origin header, e.g. Postman in dev, cron jobs)
    if (!origin) {
      // In production, block no-origin requests if they're not from trusted sources
      // But for API usability (health checks, etc.) we allow them
      return callback(null, true);
    }

    const isAllowed = allowedOrigins.some((allowed) =>
      typeof allowed === 'string'
        ? allowed === origin
        : allowed instanceof RegExp
        ? allowed.test(origin)
        : false
    );

    if (isAllowed) {
      return callback(null, true);
    }

    // Reject — do NOT silently allow unknown origins
    return callback(new Error(`CORS: Origin '${origin}' is not allowed`));
  },
  credentials: true,           // Required for cookie-based auth
  optionsSuccessStatus: 200,   // Some legacy browsers choke on 204
};

// ── Security middleware
app.use(helmet());             // Sets X-Content-Type-Options, X-Frame-Options, etc.
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize());      // Prevent NoSQL injection via request body/params

// ── Global rate limiter (applied to all routes as a safety net)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 200,                    // generous limit — auth routes have their own stricter limits
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
  skip: (req) => req.path === '/api/health', // never throttle health checks
});
app.use(globalLimiter);

// ── Auth-specific rate limiter (imported by the auth router)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again later.' },
});

// ── Routes
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/biodata', require('./routes/biodata'));

// ── Health check (no auth, no rate limit)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 handler — unknown routes
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// ── Global error handler
// IMPORTANT: Never expose err.stack or internal details in production.
// In development we include the stack so debugging is easy.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // CORS errors from the origin callback come through here
  if (err.message && err.message.startsWith('CORS:')) {
    return res.status(403).json({ message: 'Forbidden: Cross-origin request rejected' });
  }

  const status = err.status || err.statusCode || 500;

  // Safe user-facing message — never leak internals
  const userMessage =
    status < 500
      ? err.message || 'Bad request'         // 4xx: safe to show client errors
      : 'An unexpected error occurred';       // 5xx: always generic in production

  const response = { message: userMessage };

  // In development only: attach stack trace so engineers can debug locally
  if (!IS_PROD) {
    response.debug = {
      originalMessage: err.message,
      stack: err.stack,
    };
  }

  // Always log the full error on the server side (not exposed to client)
  console.error(`[${new Date().toISOString()}] ${status} ${req.method} ${req.originalUrl} —`, err.message);
  if (IS_PROD && status >= 500) {
    // In production log the full stack server-side only for post-mortem debugging
    console.error(err.stack);
  }

  res.status(status).json(response);
});

const PORT = process.env.PORT || 5006;
app.listen(PORT, () => {
  console.log(`🚀 BioData API running on http://localhost:${PORT} [${IS_PROD ? 'production' : 'development'}]`);
});
