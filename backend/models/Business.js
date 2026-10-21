const mongoose = require('mongoose');

const workingHourSchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    openTime: { type: String, default: '09:00 AM' },
    closeTime: { type: String, default: '08:00 PM' },
    isClosed: { type: Boolean, default: false },
  },
  { _id: false }
);

const businessSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    tagline: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    categoryName: {
      type: String,
      default: '',
    },
    categorySlug: {
      type: String,
      default: '',
    },
    subcategory: {
      type: String,
      default: '',
    },
    // Contact Information
    contact: {
      phone: {
        type: String,
        required: [true, 'Contact phone number is required'],
      },
      alternatePhone: {
        type: String,
        default: '',
      },
      whatsapp: {
        type: String,
        default: '',
      },
      email: {
        type: String,
        default: '',
      },
      website: {
        type: String,
        default: '',
      },
    },
    // Location Details
    location: {
      address: {
        type: String,
        required: [true, 'Address is required'],
      },
      area: {
        type: String,
        default: 'Gandhi Bazaar',
      },
      city: {
        type: String,
        default: 'Shimoga',
      },
      state: {
        type: String,
        default: 'Karnataka',
      },
      pincode: {
        type: String,
        default: '577201',
      },
      googleMapUrl: {
        type: String,
        default: '',
      },
    },
    // Media & Branding
    media: {
      logo: {
        type: String,
        default: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=400&q=80',
      },
      coverImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      },
      gallery: [
        {
          type: String,
        },
      ],
    },
    workingHours: [workingHourSchema],
    services: [
      {
        type: String,
      },
    ],
    amenities: [
      {
        type: String,
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
    // SEO Fields
    seo: {
      metaTitle: String,
      metaDescription: String,
      metaKeywords: [String],
    },
    // Subscription Details
    subscription: {
      planDuration: {
        type: String,
        enum: ['1 month', '6 months', '1 year'],
        required: true,
        default: '1 year',
      },
      amount: {
        type: Number,
        required: true,
        default: 8999,
      },
      registeredDate: {
        type: Date,
        default: Date.now,
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
      expiryDate: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        enum: ['active', 'expiring_soon', 'expired', 'pending_approval'],
        default: 'active',
      },
      paymentStatus: {
        type: String,
        enum: ['paid', 'pending', 'failed'],
        default: 'paid',
      },
      paymentReference: {
        type: String,
        default: '',
      },
      autoRenew: {
        type: Boolean,
        default: false,
      },
    },
    // Customer Traffic & Analytics
    metrics: {
      totalViews: {
        type: Number,
        default: 0,
      },
      callClicks: {
        type: Number,
        default: 0,
      },
      whatsappClicks: {
        type: Number,
        default: 0,
      },
      websiteClicks: {
        type: Number,
        default: 0,
      },
      directionsClicks: {
        type: Number,
        default: 0,
      },
      leadsCount: {
        type: Number,
        default: 0,
      },
    },
    // Platform Status & SEO Priority
    isFeatured: {
      type: Boolean,
      default: true, // Subscribed businesses get featured status
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    priorityScore: {
      type: Number,
      default: 100, // Higher score = higher ranking in search & browse results
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    reviewsCount: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected', 'suspended'],
      default: 'approved',
    },
  },
  {
    timestamps: true,
  }
);

// Helper method to compute dynamic subscription status
businessSchema.methods.updateSubscriptionStatus = function () {
  const now = new Date();
  const expiry = new Date(this.subscription.expiryDate);
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    this.subscription.status = 'expired';
    this.isFeatured = false;
    this.priorityScore = 10; // Deprioritize expired businesses
  } else if (diffDays <= 15) {
    this.subscription.status = 'expiring_soon';
    this.priorityScore = 90;
  } else {
    this.subscription.status = 'active';
    this.priorityScore = 100;
  }
  return { status: this.subscription.status, diffDays };
};

// Text index for fast multi-field search
businessSchema.index({
  name: 'text',
  description: 'text',
  categoryName: 'text',
  'location.area': 'text',
  tags: 'text',
});

module.exports = mongoose.model('Business', businessSchema);
