const Business = require('../models/Business');
const Category = require('../models/Category');
const VisitLog = require('../models/VisitLog');
const Lead = require('../models/Lead');
const Review = require('../models/Review');

// Helper to create slug
const createSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// @desc    Get All Businesses with Filtering, Search & SEO Priority Sorting
// @route   GET /api/businesses
// @access  Public
exports.getBusinesses = async (req, res) => {
  try {
    const {
      search,
      category,
      area,
      city,
      rating,
      featured,
      page = 1,
      limit = 20,
      sortBy = 'seo', // 'seo' | 'rating' | 'reviews' | 'newest'
    } = req.query;

    const query = { status: 'approved' };

    // Search query (name, description, area, tags)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { tagline: searchRegex },
        { 'location.area': searchRegex },
        { categoryName: searchRegex },
        { tags: { $in: [searchRegex] } },
        { services: { $in: [searchRegex] } },
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      const categoryDoc = await Category.findOne({
        $or: [{ slug: category }, { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null }],
      });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      } else {
        query.categorySlug = category.toLowerCase();
      }
    }

    // Area filter
    if (area && area !== 'all') {
      query['location.area'] = new RegExp(area, 'i');
    }

    // City filter
    if (city && city !== 'all') {
      if (/^(shivamogga|shimoga)$/i.test(city)) {
        query['location.city'] = new RegExp('Shimoga|Shivamogga', 'i');
      } else {
        query['location.city'] = new RegExp(city, 'i');
      }
    }

    // Rating filter
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // Featured filter
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Determine sort order
    let sortOptions = {};
    if (sortBy === 'rating') {
      sortOptions = { rating: -1, isFeatured: -1, priorityScore: -1 };
    } else if (sortBy === 'reviews') {
      sortOptions = { reviewsCount: -1, rating: -1 };
    } else if (sortBy === 'newest') {
      sortOptions = { createdAt: -1 };
    } else {
      // SEO Default: Subscribed active businesses rank ON TOP!
      sortOptions = {
        isFeatured: -1,
        priorityScore: -1,
        rating: -1,
        'metrics.totalViews': -1,
        createdAt: -1,
      };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await Business.countDocuments(query);
    const businesses = await Business.find(query)
      .populate('category', 'name slug icon emoji')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Update dynamic subscription status in background
    businesses.forEach((b) => b.updateSubscriptionStatus());

    res.status(200).json({
      success: true,
      count: businesses.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: businesses,
    });
  } catch (err) {
    console.error('Error fetching businesses:', err);
    res.status(500).json({ success: false, message: 'Server error fetching businesses' });
  }
};

// @desc    Get Featured Businesses (Top Sponsored / Verified)
// @route   GET /api/businesses/featured
// @access  Public
exports.getFeaturedBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({
      status: 'approved',
      isFeatured: true,
      'subscription.status': { $in: ['active', 'expiring_soon'] },
    })
      .populate('category', 'name slug icon emoji')
      .sort({ priorityScore: -1, rating: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching featured businesses' });
  }
};

// @desc    Get Single Business by Slug or ID & Increment View
// @route   GET /api/businesses/:slug
// @access  Public
exports.getBusinessBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const isId = slug.match(/^[0-9a-fA-F]{24}$/);
    const query = isId ? { _id: slug } : { slug: slug.toLowerCase() };

    const business = await Business.findOne(query).populate('category', 'name slug icon emoji');

    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    // Refresh subscription status
    business.updateSubscriptionStatus();

    // Increment page views metric
    business.metrics.totalViews = (business.metrics.totalViews || 0) + 1;
    await business.save();

    // Log the view asynchronously in VisitLog
    VisitLog.create({
      business: business._id,
      action: 'view',
      userAgent: req.headers['user-agent'] || '',
      ip: req.ip || '',
      referrer: req.headers.referer || '',
    }).catch((err) => console.error('VisitLog error:', err.message));

    // Fetch latest reviews for this business
    const reviews = await Review.find({ business: business._id }).sort({ createdAt: -1 }).limit(10);

    // Fetch related businesses in same category
    const related = await Business.find({
      category: business.category,
      _id: { $ne: business._id },
      status: 'approved',
    })
      .limit(4)
      .select('name slug tagline media rating reviewsCount location categoryName');

    res.status(200).json({
      success: true,
      data: business,
      reviews,
      related,
    });
  } catch (err) {
    console.error('Error fetching business by slug:', err);
    res.status(500).json({ success: false, message: 'Server error fetching business details' });
  }
};

// @desc    Track Customer Action (Call, WhatsApp, Website, Directions)
// @route   POST /api/businesses/:id/track
// @access  Public
exports.trackClick = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'call' | 'whatsapp' | 'website' | 'directions' | 'view'

    if (!['call', 'whatsapp', 'website', 'directions', 'view'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid action type' });
    }

    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    // Increment corresponding metric
    if (action === 'call') {
      business.metrics.callClicks = (business.metrics.callClicks || 0) + 1;
    } else if (action === 'whatsapp') {
      business.metrics.whatsappClicks = (business.metrics.whatsappClicks || 0) + 1;
    } else if (action === 'website') {
      business.metrics.websiteClicks = (business.metrics.websiteClicks || 0) + 1;
    } else if (action === 'directions') {
      business.metrics.directionsClicks = (business.metrics.directionsClicks || 0) + 1;
    } else if (action === 'view') {
      business.metrics.totalViews = (business.metrics.totalViews || 0) + 1;
    }

    await business.save();

    // Log the visit event
    await VisitLog.create({
      business: business._id,
      action,
      userAgent: req.headers['user-agent'] || '',
      ip: req.ip || '',
      referrer: req.headers.referer || '',
    });

    res.status(200).json({
      success: true,
      message: `Action "${action}" recorded successfully`,
      metrics: business.metrics,
    });
  } catch (err) {
    console.error('Error tracking click:', err);
    res.status(500).json({ success: false, message: 'Server error tracking interaction' });
  }
};

// @desc    Get Logged-in Business Owner's Profile & Dashboard Analytics
// @route   GET /api/businesses/my/dashboard
// @access  Private (Role: 'business')
exports.getMyBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user.id }).populate('category', 'name slug icon emoji');

    if (!business) {
      return res.status(404).json({ success: false, message: 'No business found for this account' });
    }

    const { status, diffDays } = business.updateSubscriptionStatus();
    await business.save();

    // Fetch recent inquiries/leads
    const leads = await Lead.find({ business: business._id }).sort({ createdAt: -1 }).limit(10);

    // Fetch recent visit actions breakdown
    const recentActivity = await VisitLog.find({ business: business._id })
      .sort({ createdAt: -1 })
      .limit(20);

    // Group activity count by action
    const activitySummary = await VisitLog.aggregate([
      { $match: { business: business._id } },
      { $group: { _id: '$action', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      business,
      subscriptionSummary: {
        status,
        daysRemaining: diffDays,
        isExpiringSoon: diffDays <= 15 && diffDays > 0,
        isExpired: diffDays <= 0,
        planDuration: business.subscription.planDuration,
        amount: business.subscription.amount,
        registeredDate: business.subscription.registeredDate,
        expiryDate: business.subscription.expiryDate,
      },
      metrics: business.metrics,
      leads,
      recentActivity,
      activitySummary,
    });
  } catch (err) {
    console.error('Error fetching business dashboard:', err);
    res.status(500).json({ success: false, message: 'Server error fetching business dashboard' });
  }
};

// @desc    Update Logged-in Business Profile
// @route   PUT /api/businesses/my/profile
// @access  Private (Role: 'business')
exports.updateMyBusiness = async (req, res) => {
  try {
    let business = await Business.findOne({ owner: req.user.id });

    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    const {
      name,
      tagline,
      description,
      contact,
      location,
      workingHours,
      services,
      amenities,
      tags,
      media,
      seo,
    } = req.body;

    if (name && name !== business.name) {
      business.name = name;
      // Optionally update slug if requested
    }
    if (tagline !== undefined) business.tagline = tagline;
    if (description !== undefined) business.description = description;

    if (contact) {
      business.contact = { ...business.contact.toObject(), ...contact };
    }
    if (location) {
      business.location = { ...business.location.toObject(), ...location };
    }
    if (workingHours) business.workingHours = workingHours;
    if (services) business.services = services;
    if (amenities) business.amenities = amenities;
    if (tags) business.tags = tags;
    if (media) {
      business.media = { ...business.media.toObject(), ...media };
    }
    if (seo) {
      business.seo = { ...business.seo.toObject(), ...seo };
    }

    await business.save();

    res.status(200).json({
      success: true,
      message: 'Business profile updated successfully',
      business,
    });
  } catch (err) {
    console.error('Error updating business:', err);
    res.status(500).json({ success: false, message: 'Server error updating business profile' });
  }
};

// @desc    Renew Business Subscription
// @route   POST /api/businesses/my/renew
// @access  Private (Role: 'business')
exports.renewSubscription = async (req, res) => {
  try {
    const { duration = '1 year' } = req.body;

    const business = await Business.findOne({ owner: req.user.id });
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    const now = new Date();
    let currentExpiry = new Date(business.subscription.expiryDate);
    // If already expired, start from now; otherwise add duration to current expiry
    let baseDate = currentExpiry > now ? currentExpiry : now;
    let newExpiry = new Date(baseDate);
    let amount = 999;

    if (duration === '1 month') {
      newExpiry.setMonth(baseDate.getMonth() + 1);
      amount = 999;
    } else if (duration === '6 months') {
      newExpiry.setMonth(baseDate.getMonth() + 6);
      amount = 4999;
    } else {
      newExpiry.setFullYear(baseDate.getFullYear() + 1);
      amount = 8999;
    }

    business.subscription.planDuration = duration;
    business.subscription.amount += amount;
    business.subscription.expiryDate = newExpiry;
    business.subscription.status = 'active';
    business.isFeatured = true;
    business.priorityScore = 100;

    await business.save();

    res.status(200).json({
      success: true,
      message: `Subscription successfully renewed for ${duration}! Valid until ${newExpiry.toLocaleDateString()}`,
      subscription: business.subscription,
    });
  } catch (err) {
    console.error('Error renewing subscription:', err);
    res.status(500).json({ success: false, message: 'Server error renewing subscription' });
  }
};
