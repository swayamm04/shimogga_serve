const express = require('express');
const router = express.Router();
const { createLead, getMyLeads } = require('../controllers/leadController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', createLead);
router.get('/my', protect, authorize('business', 'admin'), getMyLeads);

module.exports = router;
