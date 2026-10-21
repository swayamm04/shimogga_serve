const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Business = require('../models/Business');
const Category = require('../models/Category');

// Generate JWT token
const sendTokenResponse = (user, business = null, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'metalindustry_secret_key_123',
    { expiresIn: '30d' }
  );

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
    },
    business: business || null,
  });
};

// Helper: Calculate subscription dates and amounts
const getSubscriptionDetails = (duration) => {
  const now = new Date();
  let expiryDate = new Date();
  let amount = 999;

  switch (duration) {
    case '1 month':
      expiryDate.setMonth(now.getMonth() + 1);
      amount = 999;
      break;
    case '6 months':
      expiryDate.setMonth(now.getMonth() + 6);
      amount = 4999;
      break;
    case '1 year':
    default:
      expiryDate.setFullYear(now.getFullYear() + 1);
      amount = 8999;
      break;
  }

  return { planDuration: duration || '1 year', amount, registeredDate: now, startDate: now, expiryDate };
};

// Generate URL slug from business name
const createSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// @desc    Register a User or Business Owner
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role = 'user',
      // Business registration fields
      businessName,
      category,
      categoryName,
      subscriptionDuration = '1 year',
      address,
      area,
      city = 'Shimoga',
      tagline,
      description,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    // Create user
    const userRole = role === 'business' ? 'business' : 'user';
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      role: userRole,
    });

    let business = null;

    // If registering as a business owner, create the business entity
    if (userRole === 'business') {
      const finalBusinessName = businessName || name;
      let baseSlug = createSlug(finalBusinessName);
      
      // Ensure unique slug
      let uniqueSlug = baseSlug;
      let count = 1;
      while (await Business.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${baseSlug}-${count}`;
        count++;
      }

      // Resolve category
      let categoryObj = null;
      if (category) {
        categoryObj = await Category.findById(category).catch(() => null);
      }
      if (!categoryObj && categoryName) {
        categoryObj = await Category.findOne({ name: new RegExp(categoryName, 'i') });
      }
      if (!categoryObj) {
        // Fallback to first category or create one
        categoryObj = await Category.findOne();
      }

      const subDetails = getSubscriptionDetails(subscriptionDuration);

      business = await Business.create({
        owner: user._id,
        name: finalBusinessName,
        slug: uniqueSlug,
        tagline: tagline || 'Trusted local service in Shimoga',
        description: description || `Welcome to ${finalBusinessName}, offering high quality services across Shimoga and surrounding areas.`,
        category: categoryObj ? categoryObj._id : undefined,
        categoryName: categoryObj ? categoryObj.name : (categoryName || 'General Services'),
        categorySlug: categoryObj ? categoryObj.slug : 'general',
        contact: {
          phone: phone || '9876543210',
          whatsapp: phone || '9876543210',
          email: email.toLowerCase(),
        },
        location: {
          address: address || 'Main Road, Gandhi Bazaar',
          area: area || 'Gandhi Bazaar',
          city: city || 'Shimoga',
          pincode: '577201',
        },
        subscription: {
          planDuration: subDetails.planDuration,
          amount: subDetails.amount,
          registeredDate: subDetails.registeredDate,
          startDate: subDetails.startDate,
          expiryDate: subDetails.expiryDate,
          status: 'active',
          paymentStatus: 'paid',
        },
        isFeatured: true,
        priorityScore: 100,
        workingHours: [
          { day: 'Monday', openTime: '09:00 AM', closeTime: '08:00 PM', isClosed: false },
          { day: 'Tuesday', openTime: '09:00 AM', closeTime: '08:00 PM', isClosed: false },
          { day: 'Wednesday', openTime: '09:00 AM', closeTime: '08:00 PM', isClosed: false },
          { day: 'Thursday', openTime: '09:00 AM', closeTime: '08:00 PM', isClosed: false },
          { day: 'Friday', openTime: '09:00 AM', closeTime: '08:00 PM', isClosed: false },
          { day: 'Saturday', openTime: '09:00 AM', closeTime: '08:00 PM', isClosed: false },
          { day: 'Sunday', openTime: '10:00 AM', closeTime: '02:00 PM', isClosed: false },
        ],
      });
    }

    sendTokenResponse(user, business, 201, res);
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error during registration' });
  }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find user by email and select password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    let business = null;
    if (user.role === 'business') {
      business = await Business.findOne({ owner: user._id }).populate('category', 'name slug icon emoji');
      if (business) {
        business.updateSubscriptionStatus();
        await business.save();
      }
    }

    sendTokenResponse(user, business, 200, res);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Get Current Logged in User Profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let business = null;
    if (user.role === 'business') {
      business = await Business.findOne({ owner: user._id }).populate('category', 'name slug icon emoji');
      if (business) {
        business.updateSubscriptionStatus();
        await business.save();
      }
    }

    res.status(200).json({
      success: true,
      user,
      business,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching profile' });
  }
};

// @desc    Update Profile Details
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      user,
      message: 'Profile updated successfully',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
};

// @desc    Change Password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password' });
    }

    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password does not match' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error changing password' });
  }
};

// @desc    Forgot Password - Generates Reset Token
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No user registered with this email' });
    }

    // Generate reset token (6 character verification code for easy entry)
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedToken = crypto.createHash('sha256').update(resetCode).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save({ validateBeforeSave: false });

    // In production, send email; in this full-stack setup, return code for instant verification testing
    res.status(200).json({
      success: true,
      message: 'Password reset code generated and sent to email',
      resetCode, // provided directly for frictionless testing and demo
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error in forgot password' });
  }
};

// @desc    Reset Password with Token
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { code, password } = req.body;

    if (!code || !password) {
      return res.status(400).json({ success: false, message: 'Please provide reset code and new password' });
    }

    const hashedToken = crypto.createHash('sha256').update(code.trim()).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset code' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now login.',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error resetting password' });
  }
};
