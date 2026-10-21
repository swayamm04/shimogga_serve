const Lead = require('../models/Lead');
const Business = require('../models/Business');

// @desc    Submit customer inquiry / lead
// @route   POST /api/leads
// @access  Public
exports.createLead = async (req, res) => {
  try {
    const { businessId, customerName, customerPhone, customerEmail, serviceNeeded, message } = req.body;

    if (!businessId || !customerName || !customerPhone || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, phone, message and business ID' });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    const lead = await Lead.create({
      business: businessId,
      customerName,
      customerPhone,
      customerEmail: customerEmail || '',
      serviceNeeded: serviceNeeded || '',
      message,
    });

    // Increment lead counter on business
    business.metrics.leadsCount = (business.metrics.leadsCount || 0) + 1;
    await business.save();

    res.status(201).json({
      success: true,
      message: 'Inquiry sent successfully to the business owner',
      lead,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error submitting inquiry' });
  }
};

// @desc    Get leads for business owner
// @route   GET /api/leads/my
// @access  Private (Role: 'business')
exports.getMyLeads = async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user.id });
    if (!business) {
      return res.status(404).json({ success: false, message: 'No business found' });
    }

    const leads = await Lead.find({ business: business._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: leads.length, data: leads });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching leads' });
  }
};
