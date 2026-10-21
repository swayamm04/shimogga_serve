require('dotenv').config();
const { connectDB } = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Business = require('../models/Business');
const Review = require('../models/Review');
const Lead = require('../models/Lead');
const VisitLog = require('../models/VisitLog');

async function seedData() {
  try {
    const conn = await connectDB();
    console.log('Connected to DB for seeding:', conn.name);

    // Clear existing collections
    console.log('Clearing existing data for a fresh start...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Business.deleteMany({});
    await Review.deleteMany({});
    await Lead.deleteMany({});
    await VisitLog.deleteMany({});

    // 1. Create Default Users
    console.log('Creating Admin, Business Owners, and User accounts...');
    const admin = await User.create({
      name: 'Shimoga Service Admin',
      email: 'admin@shimogaservice.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 94481 00001',
    });

    const user1 = await User.create({
      name: 'Ramesh Kumar',
      email: 'user@gmail.com',
      password: 'user123',
      role: 'user',
      phone: '+91 98451 23456',
    });

    const ownerManipal = await User.create({
      name: 'Dr. Suresh Rao (Manipal Admin)',
      email: 'owner@manipal.com',
      password: 'owner123',
      role: 'business',
      phone: '+91 81822 55500',
    });

    const ownerMeenakshi = await User.create({
      name: 'Naveen Hegde (Meenakshi Bhavan)',
      email: 'owner@meenakshi.com',
      password: 'owner123',
      role: 'business',
      phone: '+91 81822 77700',
    });

    const ownerSahyadriSpa = await User.create({
      name: 'Ananya Bhat (Sahyadri Spa)',
      email: 'owner@sahyadrispa.com',
      password: 'owner123',
      role: 'business',
      phone: '+91 97412 88899',
    });

    const ownerExpressAuto = await User.create({
      name: 'Kiran Gowda (Express Auto)',
      email: 'owner@expressauto.com',
      password: 'owner123',
      role: 'business',
      phone: '+91 94811 44433',
    });

    const ownerHomeCleaning = await User.create({
      name: 'Prakash Rao (Namma Cleaners)',
      email: 'owner@nammacleaners.com',
      password: 'owner123',
      role: 'business',
      phone: '+91 81822 99911',
    });

    // 2. Create Categories
    console.log('Creating Shimoga Business Categories...');
    const categoriesData = [
      {
        name: 'Healthcare & Hospitals',
        slug: 'healthcare-hospitals',
        emoji: '',
        icon: 'Stethoscope',
        description: 'Multi-specialty hospitals, emergency care, clinics and diagnostic labs in Shimoga',
        order: 1,
      },
      {
        name: 'Restaurants & Cafes',
        slug: 'restaurants-cafes',
        emoji: '',
        icon: 'Utensils',
        description: 'Authentic Malnad cuisine, pure veg family restaurants, bakeries & trendy cafes',
        order: 2,
      },
      {
        name: 'Home Services & Repairs',
        slug: 'home-services-repairs',
        emoji: '',
        icon: 'Wrench',
        description: 'Deep house cleaning, electrical repairs, plumbing, painting & pest control',
        order: 3,
      },
      {
        name: 'Automobile & Garages',
        slug: 'automobile-garages',
        emoji: '',
        icon: 'Car',
        description: 'Authorized showrooms, car detailing, multi-brand two-wheeler & four-wheeler servicing',
        order: 4,
      },
      {
        name: 'Education & Coaching',
        slug: 'education-coaching',
        emoji: '',
        icon: 'GraduationCap',
        description: 'Premier engineering, medical colleges, schools, PU coaching & competitive exam institutes',
        order: 5,
      },
      {
        name: 'Beauty, Salon & Spa',
        slug: 'beauty-salon-spa',
        emoji: '',
        icon: 'Sparkles',
        description: 'Bridal makeup, unisex luxury salons, skin care clinics & authentic Ayurvedic wellness spas',
        order: 6,
      },
      {
        name: 'Real Estate & Builders',
        slug: 'real-estate-builders',
        emoji: '',
        icon: 'Building2',
        description: 'Verified residential plots, independent villas, commercial spaces & civil contractors',
        order: 7,
      },
      {
        name: 'Retail & Shopping',
        slug: 'retail-shopping',
        emoji: '',
        icon: 'ShoppingBag',
        description: 'Traditional silk sarees, jewelry showrooms, electronics & Gandhi Bazaar specialty shops',
        order: 8,
      },
    ];

    const categories = await Category.insertMany(categoriesData);
    const catMap = {};
    categories.forEach((c) => (catMap[c.slug] = c));

    // 3. Create Sample Businesses (Active, Expiring Soon, and Expired for complete admin testing!)
    console.log('Seeding Businesses with SEO metadata and metrics...');
    const now = new Date();

    // 1 Year Plan (Active)
    const expiry1Year = new Date();
    expiry1Year.setFullYear(now.getFullYear() + 1);

    // 6 Months Plan (Active)
    const expiry6Months = new Date();
    expiry6Months.setMonth(now.getMonth() + 6);

    // Expiring Soon (5 days left)
    const expirySoon = new Date();
    expirySoon.setDate(now.getDate() + 5);

    // Expired (10 days ago)
    const expiryPast = new Date();
    expiryPast.setDate(now.getDate() - 10);

    const businessesData = [
      {
        owner: ownerManipal._id,
        name: 'Manipal Super Specialty Hospital',
        slug: 'manipal-super-specialty-hospital-shimoga',
        tagline: 'Leading 24/7 Multi-Specialty Healthcare with Advanced ICU in Malnad',
        description:
          'Manipal Super Specialty Hospital in Shimoga provides cutting-edge medical treatments, cardiology, neurology, orthopedics, pediatric care, and round-the-clock emergency trauma response with certified specialists.',
        category: catMap['healthcare-hospitals']._id,
        categoryName: catMap['healthcare-hospitals'].name,
        categorySlug: catMap['healthcare-hospitals'].slug,
        contact: {
          phone: '+91 81822 55500',
          whatsapp: '918182255500',
          email: 'care@manipalshimoga.com',
          website: 'https://manipalhospitals.com/shimoga',
        },
        location: {
          address: 'Kuvempu Road, Near Sahyadri College',
          area: 'Kuvempu Road',
          city: 'Shimoga',
          state: 'Karnataka',
          pincode: '577203',
          googleMapUrl: 'https://maps.google.com/?q=Shimoga+Hospital',
        },
        media: {
          logo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80',
          coverImage: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80',
          gallery: [
            'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
          ],
        },
        workingHours: [
          { day: 'All Days', openTime: '12:00 AM', closeTime: '11:59 PM', isClosed: false },
        ],
        services: ['24/7 Emergency & ICU', 'Cardiology & Angioplasty', 'Orthopedic Surgeries', 'Diagnostics & MRI', 'Pharmacy'],
        amenities: ['Emergency Ambulance', 'Wheelchair Access', 'Parking Lot', 'Insurance Cashless', 'Cafeteria'],
        tags: ['hospital', 'emergency', 'icu', 'doctor', 'cardiology', 'shimoga best hospital'],
        seo: {
          metaTitle: 'Manipal Super Specialty Hospital Shimoga | Top 24/7 Multi-Specialty Care',
          metaDescription: 'Consult leading doctors at Manipal Hospital Shimoga. 24/7 Emergency, Cardiology, Orthopedics & advanced diagnostic services.',
          metaKeywords: ['shimoga hospital', 'best hospital shimoga', 'emergency clinic kuvempu road'],
        },
        subscription: {
          planDuration: '1 year',
          amount: 8999,
          registeredDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
          startDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
          expiryDate: expiry1Year,
          status: 'active',
          paymentStatus: 'paid',
        },
        metrics: {
          totalViews: 1420,
          callClicks: 312,
          whatsappClicks: 185,
          websiteClicks: 210,
          directionsClicks: 430,
          leadsCount: 28,
        },
        isFeatured: true,
        isVerified: true,
        priorityScore: 100,
        rating: 4.9,
        reviewsCount: 148,
        status: 'approved',
      },
      {
        owner: ownerMeenakshi._id,
        name: 'Meenakshi Pure Veg Family Restaurant',
        slug: 'meenakshi-pure-veg-restaurant-shimoga',
        tagline: 'Legendary South Indian Breakfast, Filter Coffee & North Indian Delicacies',
        description:
          'Located in the heart of Durgigudi, Meenakshi Pure Veg is Shimoga’s favorite dining spot famous for crispy Masala Dosa, hot Filter Kaapi, authentic Malnad thalis, and spacious AC family hall.',
        category: catMap['restaurants-cafes']._id,
        categoryName: catMap['restaurants-cafes'].name,
        categorySlug: catMap['restaurants-cafes'].slug,
        contact: {
          phone: '+91 81822 77700',
          whatsapp: '918182277700',
          email: 'hello@meenakshibhavan.in',
          website: 'https://meenakshibhavan.in',
        },
        location: {
          address: 'Opp. Old Bus Stand, Durgigudi Main Road',
          area: 'Durgigudi',
          city: 'Shimoga',
          state: 'Karnataka',
          pincode: '577201',
          googleMapUrl: 'https://maps.google.com/?q=Durgigudi+Shimoga',
        },
        media: {
          logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
          coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
          gallery: [
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
          ],
        },
        workingHours: [
          { day: 'All Days', openTime: '06:30 AM', closeTime: '10:30 PM', isClosed: false },
        ],
        services: ['South Indian Breakfast', 'North Indian Curries', 'Malnad Traditional Meals', 'Party Hall Booking', 'Home Delivery'],
        amenities: ['Air Conditioned Dining', 'Valet Parking', 'Pure Vegetarian', 'UPI & Card Accepted', 'Family Seating'],
        tags: ['restaurant', 'veg food', 'dosa', 'breakfast', 'durgigudi', 'shimoga cafe'],
        seo: {
          metaTitle: 'Meenakshi Pure Veg Restaurant | Best Family Dining in Shimoga',
          metaDescription: 'Taste the best Masala Dosa, Meals and filter coffee in Shimoga at Meenakshi Pure Veg, Durgigudi.',
          metaKeywords: ['best veg restaurant shimoga', 'meenakshi bhavan shimoga', 'durgigudi food'],
        },
        subscription: {
          planDuration: '6 months',
          amount: 4999,
          registeredDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          expiryDate: expiry6Months,
          status: 'active',
          paymentStatus: 'paid',
        },
        metrics: {
          totalViews: 980,
          callClicks: 145,
          whatsappClicks: 95,
          websiteClicks: 65,
          directionsClicks: 320,
          leadsCount: 16,
        },
        isFeatured: true,
        isVerified: true,
        priorityScore: 95,
        rating: 4.8,
        reviewsCount: 92,
        status: 'approved',
      },
      {
        owner: ownerHomeCleaning._id,
        name: 'Namma Cleaners & Facility Services',
        slug: 'namma-cleaners-home-services-shimoga',
        tagline: 'Professional Deep Home Cleaning, Sofa Sanitization & Pest Control',
        description:
          'Shimoga’s highest rated home upkeep professionals. We provide deep bathroom scrubbing, kitchen de-greasing, sofa shampooing, water tank cleaning and eco-friendly pest control at transparent fixed rates.',
        category: catMap['home-services-repairs']._id,
        categoryName: catMap['home-services-repairs'].name,
        categorySlug: catMap['home-services-repairs'].slug,
        contact: {
          phone: '+91 81822 99911',
          whatsapp: '918182299911',
          email: 'support@nammacleaners.com',
          website: 'https://nammacleaners.com',
        },
        location: {
          address: 'Shop 14, Commercial Complex, Vinoba Nagara',
          area: 'Vinoba Nagara',
          city: 'Shimoga',
          state: 'Karnataka',
          pincode: '577204',
          googleMapUrl: 'https://maps.google.com/?q=Vinoba+Nagara+Shimoga',
        },
        media: {
          logo: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80',
          coverImage: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=1200&q=80',
          gallery: [
            'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
          ],
        },
        workingHours: [
          { day: 'Mon - Sun', openTime: '08:00 AM', closeTime: '07:00 PM', isClosed: false },
        ],
        services: ['Full House Deep Cleaning', 'Bathroom Scrubbing', 'Sofa & Carpet Shampooing', 'Water Tank Cleaning', 'Pest Control'],
        amenities: ['Verified Staff', 'Same Day Service', 'Eco Friendly Chemicals', 'Online Booking'],
        tags: ['cleaning', 'home service', 'pest control', 'vinoba nagara', 'housekeeping'],
        seo: {
          metaTitle: 'Namma Cleaners Shimoga | #1 Professional Home Cleaning & Pest Control',
          metaDescription: 'Book reliable deep home cleaning, water tank disinfection and pest control in Shimoga at affordable rates.',
          metaKeywords: ['home cleaning shimoga', 'sofa cleaning vinoba nagar', 'pest control shimoga'],
        },
        subscription: {
          planDuration: '1 year',
          amount: 8999,
          registeredDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
          startDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
          expiryDate: expiry1Year,
          status: 'active',
          paymentStatus: 'paid',
        },
        metrics: {
          totalViews: 640,
          callClicks: 110,
          whatsappClicks: 140,
          websiteClicks: 48,
          directionsClicks: 75,
          leadsCount: 34,
        },
        isFeatured: true,
        isVerified: true,
        priorityScore: 92,
        rating: 4.7,
        reviewsCount: 56,
        status: 'approved',
      },
      // Expiring Soon Example (for Admin alert demo!)
      {
        owner: ownerSahyadriSpa._id,
        name: 'Sahyadri Ayurvedic Spa & Luxury Unisex Salon',
        slug: 'sahyadri-ayurvedic-spa-salon-shimoga',
        tagline: 'Authentic Kerala Panchakarma, Herbal Body Massages & Bridal Styling',
        description:
          'Experience tranquil rejuvenation in Shimoga with ancient herbal therapies, stress-relief massages, steam baths, and modern unisex hair & beauty treatments by expert stylists.',
        category: catMap['beauty-salon-spa']._id,
        categoryName: catMap['beauty-salon-spa'].name,
        categorySlug: catMap['beauty-salon-spa'].slug,
        contact: {
          phone: '+91 97412 88899',
          whatsapp: '919741288899',
          email: 'ananya@sahyadrispa.com',
          website: 'https://sahyadrispa.in',
        },
        location: {
          address: '2nd Floor, Gold Plaza, Tilak Nagar Main Road',
          area: 'Tilak Nagar',
          city: 'Shimoga',
          state: 'Karnataka',
          pincode: '577201',
          googleMapUrl: 'https://maps.google.com/?q=Tilak+Nagar+Shimoga',
        },
        media: {
          logo: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80',
          coverImage: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=80',
          gallery: [
            'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80',
          ],
        },
        workingHours: [
          { day: 'Tue - Sun', openTime: '09:30 AM', closeTime: '08:30 PM', isClosed: false },
          { day: 'Monday', openTime: '', closeTime: '', isClosed: true },
        ],
        services: ['Abhyanga Oil Massage', 'Herbal Steam & Shirodhara', 'Bridal Makeup', 'Hair Spa & Keratin', 'Facials'],
        amenities: ['Private Therapy Rooms', 'Steam Bath', 'Card Payment', 'Herbal Green Tea'],
        tags: ['spa', 'massage', 'ayurveda', 'salon', 'tilak nagar', 'bridal styling'],
        seo: {
          metaTitle: 'Sahyadri Ayurvedic Spa Shimoga | Authentic Panchakarma & Bridal Salon',
          metaDescription: 'Rejuvenate your body and mind at Sahyadri Ayurvedic Spa & Unisex Salon in Tilak Nagar, Shimoga.',
          metaKeywords: ['spa in shimoga', 'ayurvedic massage shimoga', 'bridal makeup tilak nagar'],
        },
        subscription: {
          planDuration: '1 month',
          amount: 999,
          registeredDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
          startDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
          expiryDate: expirySoon, // 5 days left!
          status: 'expiring_soon',
          paymentStatus: 'paid',
        },
        metrics: {
          totalViews: 410,
          callClicks: 52,
          whatsappClicks: 78,
          websiteClicks: 32,
          directionsClicks: 120,
          leadsCount: 11,
        },
        isFeatured: true,
        isVerified: true,
        priorityScore: 88,
        rating: 4.6,
        reviewsCount: 38,
        status: 'approved',
      },
      // Out of Subscription (Expired) Example (for Admin alert demo!)
      {
        owner: ownerExpressAuto._id,
        name: 'Express Auto Spa & Multi-Brand Service Garage',
        slug: 'express-auto-spa-garage-shimoga',
        tagline: 'High Pressure Foam Wash, Engine Diagnostics & Periodic Maintenance',
        description:
          'Expert 4-wheeler and 2-wheeler periodic car care, ceramic coating, wheel alignment, brake overhaul, and computer diagnostics with genuine OEM spare parts.',
        category: catMap['automobile-garages']._id,
        categoryName: catMap['automobile-garages'].name,
        categorySlug: catMap['automobile-garages'].slug,
        contact: {
          phone: '+91 94811 44433',
          whatsapp: '919481144433',
          email: 'kiran@expressauto.in',
          website: '',
        },
        location: {
          address: 'Near Old Toll Gate, Savanur Road',
          area: 'Savanur Road',
          city: 'Shimoga',
          state: 'Karnataka',
          pincode: '577202',
          googleMapUrl: 'https://maps.google.com/?q=Savanur+Road+Shimoga',
        },
        media: {
          logo: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80',
          coverImage: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1200&q=80',
          gallery: [],
        },
        workingHours: [
          { day: 'Mon - Sat', openTime: '08:30 AM', closeTime: '08:00 PM', isClosed: false },
          { day: 'Sunday', openTime: '09:00 AM', closeTime: '01:00 PM', isClosed: false },
        ],
        services: ['Foam Car Wash', 'Engine Tuning', 'Wheel Balancing', 'Teflon & Ceramic Coating', 'AC Repair'],
        amenities: ['Customer Lounge with WiFi', 'Complimentary Tea', 'Hydraulic Lift Bay'],
        tags: ['car wash', 'garage', 'mechanic', 'car service', 'savanur road', 'shimoga auto'],
        seo: {
          metaTitle: 'Express Auto Spa & Car Service | Top Garage in Shimoga',
          metaDescription: 'Trusted car wash, wheel alignment and periodic servicing on Savanur Road, Shimoga.',
          metaKeywords: ['car service shimoga', 'car wash savanur road', 'best mechanic shimoga'],
        },
        subscription: {
          planDuration: '1 month',
          amount: 999,
          registeredDate: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
          startDate: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
          expiryDate: expiryPast, // Expired 10 days ago!
          status: 'expired',
          paymentStatus: 'paid',
        },
        metrics: {
          totalViews: 215,
          callClicks: 28,
          whatsappClicks: 14,
          websiteClicks: 10,
          directionsClicks: 55,
          leadsCount: 4,
        },
        isFeatured: false, // Expired businesses lose featured badge and rank below
        isVerified: true,
        priorityScore: 10, // Deprioritized
        rating: 4.4,
        reviewsCount: 19,
        status: 'approved',
      },
    ];

    const insertedBusinesses = await Business.insertMany(businessesData);
    console.log(`Seeded ${insertedBusinesses.length} businesses.`);

    // 4. Seed Reviews for Manipal & Meenakshi
    console.log('Seeding customer reviews...');
    await Review.create([
      {
        business: insertedBusinesses[0]._id,
        user: user1._id,
        name: 'Ganesh Murthy',
        rating: 5,
        comment: 'Outstanding care and immediate response during emergency. The doctors in Shimoga Manipal are truly professional and compassionate.',
      },
      {
        business: insertedBusinesses[0]._id,
        name: 'Deepa Srinivas',
        rating: 5,
        comment: 'Clean facilities and cashless insurance process was seamless. Highly recommended in Malnad region.',
      },
      {
        business: insertedBusinesses[1]._id,
        user: user1._id,
        name: 'Venkatesh Prasad',
        rating: 5,
        comment: 'Best Masala Dosa in all of Shimoga. The coconut chutney and hot filter coffee is an unmatched morning ritual!',
      },
      {
        business: insertedBusinesses[1]._id,
        name: 'Pooja Bhat',
        rating: 4,
        comment: 'Very tasty food and fast service even during heavy Sunday rush. Good family environment.',
      },
    ]);

    // 5. Seed Leads for Business Owners
    console.log('Seeding direct leads and customer inquiries...');
    await Lead.create([
      {
        business: insertedBusinesses[0]._id,
        customerName: 'Shankar Rao',
        customerPhone: '+91 94481 77722',
        customerEmail: 'shankar@gmail.com',
        serviceNeeded: 'Cardiology Consultation',
        message: 'Looking to book an appointment with Senior Cardiologist this Friday morning.',
      },
      {
        business: insertedBusinesses[2]._id,
        customerName: 'Sumanth K',
        customerPhone: '+91 98862 33441',
        customerEmail: 'sumanth@yahoo.com',
        serviceNeeded: 'Full House Deep Cleaning',
        message: 'Need full deep cleaning for 3BHK house in Vinoba Nagar before house warming function.',
      },
    ]);

    console.log('===========================================================');
    console.log(' SEEDING COMPLETE SUCCESSFULLY!');
    console.log(' Admin Login:     admin@shimogaservice.com  / admin123');
    console.log(' Business Owner:  owner@manipal.com         / owner123');
    console.log(' Normal User:     user@gmail.com            / user123');
    console.log(' Total Revenue:   ₹24,995 (from seeded subscriptions)');
    console.log(' Active: 3 | Expiring Soon (<15d): 1 | Expired: 1');
    console.log('===========================================================');

    if (require.main === module) {
      process.exit(0);
    }
  } catch (err) {
    console.error('Seeding error:', err);
    if (require.main === module) {
      process.exit(1);
    }
  }
}

if (require.main === module) {
  seedData();
}

module.exports = { seedData };

