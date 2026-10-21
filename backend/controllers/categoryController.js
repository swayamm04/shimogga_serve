const Category = require('../models/Category');
const Business = require('../models/Business');

// @desc    Get all active categories with business count
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });

    // Aggregate business counts per category
    const categoryCounts = await Business.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    categoryCounts.forEach((c) => {
      if (c._id) countMap[c._id.toString()] = c.count;
    });

    const data = categories.map((cat) => ({
      ...cat.toObject(),
      businessCount: countMap[cat._id.toString()] || 0,
    }));

    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching categories' });
  }
};
