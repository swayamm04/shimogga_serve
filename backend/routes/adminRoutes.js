const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAdminBusinesses,
  createBusinessAdmin,
  updateBusinessAdmin,
  deleteBusinessAdmin,
  getUsersAdmin,
  createCategory,
  deleteCategory,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require authentication and role === 'admin'
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/businesses', getAdminBusinesses);
router.post('/businesses', createBusinessAdmin);
router.put('/businesses/:id', updateBusinessAdmin);
router.delete('/businesses/:id', deleteBusinessAdmin);
router.get('/users', getUsersAdmin);
router.post('/categories', createCategory);
router.delete('/categories/:id', deleteCategory);

module.exports = router;
