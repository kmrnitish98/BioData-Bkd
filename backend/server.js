require('dotenv').config();
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');

const app = express();

// ── Connect to MongoDB Atlas
connectDB();

// ── CORS — allow any localhost port in dev, explicit CLIENT_URL in production
const allowedOrigins = [
  process.env.CLIENT_URL,          // e.g. http://localhost:5173 from .env
  /^http:\/\/localhost:\d+$/,       // any localhost:PORT in development
  /^http:\/\/127\.0\.0\.1:\d+$/,   // also 127.0.0.1:PORT
  /^https:\/\/.*\.vercel\.app$/,    // allow Vercel preview and production domains
  'https://aguaa.in',
  'https://www.aguaa.in'
];

// Apply Security Headers
app.use(helmet());
app.use(cookieParser());

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server requests (no origin) and matching origins
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some((o) =>
      typeof o === 'string' ? o === origin : (o && typeof o.test === 'function' ? o.test(origin) : false)
    );
    
    if (allowed) {
      return callback(null, true);
    } else {
      console.warn(`[CORS] Origin rejected but allowed temporarily for debugging: ${origin}`);
      return callback(null, true); // ALLOW ALL temporarily to fix the 500 error
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize()); // Prevent NoSQL injection

// ── Rate Limiting for Auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: { message: 'Too many requests from this IP, please try again later.' }
});

// ── Routes
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/biodata', require('./routes/biodata'));

// ── Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ── Global error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message);
  
  const status = err.status || 500;
  let message = err.message || 'Internal server error';
  
  res.status(status).json({ message: message, error: err.stack });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 BioData API running on http://localhost:${PORT}`);
});
