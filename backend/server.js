require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

// Route files
const authRoutes = require('./routes/authRoutes');
const businessRoutes = require('./routes/businessRoutes');
const adminRoutes = require('./routes/adminRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const leadRoutes = require('./routes/leadRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const Business = require('./models/Business');

const app = express();

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'Shimoga Local Business Directory & SEO Platform API',
  });
});

// SEO Dynamic Sitemap helper endpoint
app.get('/api/seo/sitemap', async (req, res) => {
  try {
    const businesses = await Business.find({ status: 'approved' }).select('slug updatedAt');
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';

    const urls = [
      { loc: `${baseUrl}`, changefreq: 'daily', priority: '1.0' },
      { loc: `${baseUrl}/services`, changefreq: 'daily', priority: '0.9' },
      { loc: `${baseUrl}/auth/register-business`, changefreq: 'weekly', priority: '0.8' },
      ...businesses.map((b) => ({
        loc: `${baseUrl}/business/${b.slug}`,
        lastmod: b.updatedAt.toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.8',
      })),
    ];

    res.status(200).json({ success: true, count: urls.length, urls });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error generating sitemap data' });
  }
});

// Mount Routers
app.use('/api/auth', authRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/reviews', reviewRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Connect to Database and Start Server
const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  // Auto-seed if database is freshly initialized or empty
  try {
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Database is empty, automatically initializing seed data...');
      const { seedData } = require('./seed/seed');
      await seedData();
    }
  } catch (seedErr) {
    console.warn('Auto-seed notice:', seedErr.message);
  }

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Shimoga Service API running on port ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
    console.log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`====================================================`);
  });
}).catch((err) => {
  console.error('Fatal DB connection error:', err);
  process.exit(1);
});
