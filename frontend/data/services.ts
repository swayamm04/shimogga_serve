export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  iconName: string;
  tags: string[];
  popular?: boolean;
  isNew?: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  services: Service[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: "healthcare",
    name: "Healthcare & Hospitals",
    slug: "healthcare-hospitals",
    iconName: "Stethoscope",
    description: "Multi-specialty hospitals, emergency ICU care, clinics and diagnostic labs in Shivamogga",
    services: [
      {
        id: "emergency-icu",
        name: "24/7 Emergency & Trauma Care",
        description: "Round-the-clock emergency medical response and critical care specialists",
        price: "Direct Consultation",
        duration: "24/7",
        iconName: "Stethoscope",
        tags: ["emergency", "icu"],
        popular: true,
      },
      {
        id: "doctor-opd",
        name: "Specialist Doctor Consultation",
        description: "Appointments with leading cardiologists, pediatricians, orthopedists, and physicians",
        price: "Direct OPD",
        duration: "30–60 min",
        iconName: "Stethoscope",
        tags: ["opd", "doctor"],
      },
    ],
  },
  {
    id: "restaurants",
    name: "Restaurants & Dining",
    slug: "restaurants-cafes",
    iconName: "UtensilsCrossed",
    description: "Authentic Malnad cuisine, pure veg family dining, bakeries and cafes in Shivamogga",
    services: [
      {
        id: "pure-veg-dining",
        name: "Family Dining & South Indian Thali",
        description: "Freshly prepared South Indian meals, filter coffee, dosas, and North Indian delicacies",
        price: "From ₹60",
        duration: "Dine-in / Parcel",
        iconName: "UtensilsCrossed",
        tags: ["veg", "family"],
        popular: true,
      },
    ],
  },
  {
    id: "home-repairs",
    name: "Home Services & Repairs",
    slug: "home-services-repairs",
    iconName: "Wrench",
    description: "Verified electricians, plumbers, home cleaning, carpentry, and appliance repairs",
    services: [
      {
        id: "electrical-repair",
        name: "Electrical Repair & Wiring",
        description: "Qualified technicians for home wiring, fan repair, fuse fixing, and inverter setups",
        price: "Estimate on Call",
        duration: "1–2 hrs",
        iconName: "Wrench",
        tags: ["electrician", "home"],
        popular: true,
      },
      {
        id: "plumbing-service",
        name: "Plumbing & Motor Repair",
        description: "Pipe leak fixes, water pump installation, bathroom fittings, and borewell plumbing",
        price: "Estimate on Call",
        duration: "1–3 hrs",
        iconName: "Wrench",
        tags: ["plumbing", "repairs"],
      },
    ],
  },
  {
    id: "automobiles",
    name: "Automobile & Garages",
    slug: "automobile-garages",
    iconName: "Car",
    description: "Two-wheeler and four-wheeler multi-brand servicing, detailing, and breakdown assistance",
    services: [
      {
        id: "car-detailing",
        name: "Car Foam Wash & Detailing",
        description: "High-pressure exterior wash, interior vacuuming, ceramic coating, and engine bay cleaning",
        price: "From ₹499",
        duration: "1–2 hrs",
        iconName: "Car",
        tags: ["car", "wash"],
      },
    ],
  },
];
