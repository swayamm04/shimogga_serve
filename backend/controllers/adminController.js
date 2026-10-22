const Business = require('../models/Business');
const User = require('../models/User');
const Category = require('../models/Category');
const Lead = require('../models/Lead');
const VisitLog = require('../models/VisitLog');

// @desc    Admin Dashboard Metrics & Alerts
// @route   GET /api/admin/dashboard
// @access  Private (Role: 'admin')
exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const fifteenDaysFromNow = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);

    // Update statuses for all businesses
    const allBusinesses = await Business.find();
    for (const b of allBusinesses) {
      b.updateSubscriptionStatus();
      await b.save();
    }

    // Counts
    const totalBusinesses = await Business.countDocuments();
    const activeBusinesses = await Business.countDocuments({ 'subscription.status': 'active' });
    const expiringSoonCount = await Business.countDocuments({
      'subscription.expiryDate': { $gt: now, $lte: fifteenDaysFromNow },
    });
    const expiredCount = await Business.countDocuments({
      'subscription.expiryDate': { $lte: now },
    });

    // Total Revenue calculation
    const revenueAgg = await Business.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$subscription.amount' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Platform Traffic / Total Views
    const viewsAgg = await Business.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$metrics.totalViews' },
          totalCalls: { $sum: '$metrics.callClicks' },
          totalWhatsapp: { $sum: '$metrics.whatsappClicks' },
          totalWebsite: { $sum: '$metrics.websiteClicks' },
        },
      },
    ]);
    const platformTraffic = viewsAgg.length > 0 ? viewsAgg[0] : { totalViews: 0, totalCalls: 0, totalWhatsapp: 0, totalWebsite: 0 };

    // Total Leads
    const totalLeads = await Lead.countDocuments();

    // Recently Added Businesses (latest 8)
    const recentlyAdded = await Business.find()
      .populate('category', 'name icon emoji')
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(8);

    // Businesses Near Expiry (< 15 days)
    const expiringSoonList = await Business.find({
      'subscription.expiryDate': { $gt: now, $lte: fifteenDaysFromNow },
    })
      .populate('category', 'name icon')
      .populate('owner', 'name email phone')
      .sort({ 'subscription.expiryDate': 1 })
      .limit(10);

    // Out of Subscription (Expired) Businesses
    const outOfSubscriptionList = await Business.find({
      'subscription.expiryDate': { $lte: now },
    })
      .populate('category', 'name icon')
      .populate('owner', 'name email phone')
      .sort({ 'subscription.expiryDate': -1 })
      .limit(10);

    // Subscription Duration breakdown
    const planBreakdown = await Business.aggregate([
      { $group: { _id: '$subscription.planDuration', count: { $sum: 1 }, totalAmount: { $sum: '$subscription.amount' } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalBusinesses,
        activeBusinesses,
        expiringSoonCount,
        expiredCount,
        totalRevenue,
        totalLeads,
        platformTraffic,
      },
      recentlyAdded,
      expiringSoonList,
      outOfSubscriptionList,
      planBreakdown,
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).json({ success: false, message: 'Server error loading admin dashboard' });
  }
};

// @desc    Get All Businesses for Admin (with search, status filter, pagination)
// @route   GET /api/admin/businesses
// @access  Private (Role: 'admin')
exports.getAdminBusinesses = async (req, res) => {
  try {
    const { status, subscriptionStatus, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }
    if (subscriptionStatus && subscriptionStatus !== 'all') {
      query['subscription.status'] = subscriptionStatus;
    }
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ name: regex }, { 'contact.phone': regex }, { 'contact.email': regex }];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await Business.countDocuments(query);
    const businesses = await Business.find(query)
      .populate('category', 'name slug icon emoji')
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: businesses,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching businesses for admin' });
  }
};

// @desc    Update Business Status or Subscription Details (Admin)
// @route   PUT /api/admin/businesses/:id
// @access  Private (Role: 'admin')
exports.updateBusinessAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, isFeatured, isVerified, priorityScore, subscription } = req.body;

    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    if (status) business.status = status;
    if (isFeatured !== undefined) business.isFeatured = isFeatured;
    if (isVerified !== undefined) business.isVerified = isVerified;
    if (priorityScore !== undefined) business.priorityScore = priorityScore;

    if (subscription) {
      if (subscription.planDuration) business.subscription.planDuration = subscription.planDuration;
      if (subscription.amount !== undefined) business.subscription.amount = subscription.amount;
      if (subscription.expiryDate) business.subscription.expiryDate = new Date(subscription.expiryDate);
      if (subscription.status) business.subscription.status = subscription.status;
    }

    business.updateSubscriptionStatus();
    await business.save();

    res.status(200).json({
      success: true,
      message: 'Business updated successfully by admin',
      business,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error updating business' });
  }
};

// @desc    Delete Business (Admin)
// @route   DELETE /api/admin/businesses/:id
// @access  Private (Role: 'admin')
exports.deleteBusinessAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const business = await Business.findById(id);

    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    await Business.findByIdAndDelete(id);
    await Lead.deleteMany({ business: id });
    await VisitLog.deleteMany({ business: id });

    res.status(200).json({
      success: true,
      message: 'Business and related records deleted successfully',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error deleting business' });
  }
};

// @desc    Get All Users (Admin)
// @route   GET /api/admin/users
// @access  Private (Role: 'admin')
exports.getUsersAdmin = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching users' });
  }
};

// @desc    Categories Management (Admin CRUD)
// @route   POST /api/admin/categories
// @access  Private (Role: 'admin')
exports.createCategory = async (req, res) => {
  try {
    const { name, emoji, icon, description } = req.body;
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const category = await Category.create({
      name,
      slug,
      emoji: emoji || '✨',
      icon: icon || 'Sparkles',
      description: description || '',
    });

    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error creating category' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error deleting category' });
  }
};

// @desc    Create Business Directly (Admin Only)
// @route   POST /api/admin/businesses
// @access  Private (Role: 'admin')
exports.createBusinessAdmin = async (req, res) => {
  try {
    const {
      name,
      category,
      categoryName,
      phone,
      whatsapp,
      email,
      website,
      city = 'Shivamogga',
      area = 'Central',
      address,
      tagline,
      description,
      planDuration = '1 year',
      amount,
      isFeatured = true,
      isVerified = true,
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Business name and phone are required' });
    }

    // Generate unique slug
    const cleanCity = city.toLowerCase().replace(/[^\w]/g, '');
    const cleanName = name.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/[\s_-]+/g, '-');
    const slugBase = `${cleanName}-${cleanCity}`;
    let slug = slugBase;
    let count = 1;
    while (await Business.findOne({ slug })) {
      slug = `${slugBase}-${count++}`;
    }

    // Resolve Category
    let catDoc = null;
    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        catDoc = await Category.findById(category);
      } else {
        catDoc = await Category.findOne({ slug: category });
      }
    }
    if (!catDoc) {
      catDoc = await Category.findOne();
    }

    // Subscription Duration Dates
    const now = new Date();
    const expiryDate = new Date(now);
    let planAmount = amount !== undefined ? Number(amount) : 8999;
    if (planDuration === '1 month') {
      expiryDate.setMonth(now.getMonth() + 1);
      if (amount === undefined) planAmount = 999;
    } else if (planDuration === '6 months') {
      expiryDate.setMonth(now.getMonth() + 6);
      if (amount === undefined) planAmount = 4999;
    } else {
      expiryDate.setFullYear(now.getFullYear() + 1);
      if (amount === undefined) planAmount = 8999;
    }

    const business = await Business.create({
      owner: req.user._id,
      name,
      slug,
      tagline: tagline || '',
      description: description || '',
      category: catDoc ? catDoc._id : null,
      categoryName: catDoc ? catDoc.name : categoryName || 'Local Business',
      categorySlug: catDoc ? catDoc.slug : 'local-business',
      contact: {
        phone,
        whatsapp: whatsapp || phone,
        email: email || '',
        website: website || '',
      },
      location: {
        address: address || `${area}, ${city}`,
        area,
        city,
        state: 'Karnataka',
        pincode: '577201',
      },
      subscription: {
        planDuration,
        amount: planAmount,
        registeredDate: now,
        startDate: now,
        expiryDate,
        status: 'active',
        paymentStatus: 'paid',
      },
      isFeatured: !!isFeatured,
      isVerified: !!isVerified,
      priorityScore: isFeatured ? 100 : 70,
    });

    res.status(201).json({
      success: true,
      message: 'Business created successfully by admin',
      data: business,
    });
  } catch (err) {
    console.error('Admin create business error:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error creating business' });
  }
};

// @desc    Get All Inquiries / Leads (Admin)
// @route   GET /api/admin/leads
// @access  Private (Role: 'admin')
exports.getLeadsAdmin = async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate('business', 'name slug contact location')
      .sort({ createdAt: -1 })
      .limit(60);
    res.status(200).json({ success: true, count: leads.length, data: leads });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching inquiries' });
  }
};

// @desc    Get Activity Logs (Admin)
// @route   GET /api/admin/activity-logs
// @access  Private (Role: 'admin')
exports.getActivityLogsAdmin = async (req, res) => {
  try {
    const logs = await VisitLog.find()
      .populate('business', 'name slug location.city')
      .sort({ timestamp: -1 })
      .limit(60);
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching activity logs' });
  }
};

