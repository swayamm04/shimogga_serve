const express = require('express');
const router = express.Router();
const {
  getBusinesses,
  getFeaturedBusinesses,
  getBusinessBySlug,
  trackClick,
  getMyBusiness,
  updateMyBusiness,
  renewSubscription,
} = require('../controllers/businessController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getBusinesses);
router.get('/featured', getFeaturedBusinesses);
router.post('/:id/track', trackClick);

// Protected routes for business owner dashboard
router.get('/my/dashboard', protect, authorize('business', 'admin'), getMyBusiness);
router.put('/my/profile', protect, authorize('business', 'admin'), updateMyBusiness);
router.post('/my/renew', protect, authorize('business', 'admin'), renewSubscription);

// Dynamic slug route must be last so it doesn't conflict with /featured or /my
router.get('/:slug', getBusinessBySlug);

module.exports = router;
