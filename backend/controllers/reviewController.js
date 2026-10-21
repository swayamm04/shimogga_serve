const Review = require('../models/Review');
const Business = require('../models/Business');

// @desc    Submit a review for a business
// @route   POST /api/reviews
// @access  Public
exports.createReview = async (req, res) => {
  try {
    const { businessId, name, rating, comment } = req.body;

    if (!businessId || !name || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide business ID, name, rating, and comment' });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    const review = await Review.create({
      business: businessId,
      name,
      rating: Number(rating),
      comment,
    });

    // Recalculate average rating for the business
    const allReviews = await Review.find({ business: businessId });
    const avgRating = allReviews.reduce((acc, item) => acc + item.rating, 0) / allReviews.length;

    business.rating = parseFloat(avgRating.toFixed(1));
    business.reviewsCount = allReviews.length;
    await business.save();

    res.status(201).json({
      success: true,
      message: 'Review posted successfully',
      data: review,
      newRating: business.rating,
      reviewsCount: business.reviewsCount,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error creating review' });
  }
};
