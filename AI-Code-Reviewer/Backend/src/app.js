const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const aiRoutes = require('./routes/ai.routes');

const app = express();

// Needed so rate limiting sees the real client IP behind Render's proxy
app.set('trust proxy', 1);

const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
  })
);
app.use(express.json({ limit: '50kb' }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please slow down.',
});

app.get('/', (req, res) => res.send('AI Code Reviewer API is running'));
app.use('/ai', limiter, aiRoutes);

module.exports = app;
