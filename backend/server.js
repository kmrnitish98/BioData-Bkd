require('dotenv').config();
const express = require('express');
const cors = require('cors');
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
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server requests (no origin) and matching origins
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some((o) =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    if (allowed) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Routes
app.use('/api/auth', require('./routes/auth'));
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
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 BioData API running on http://localhost:${PORT}`);
});
