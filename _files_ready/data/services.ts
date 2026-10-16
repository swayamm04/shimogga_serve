export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  icon: string;
  tags: string[];
  popular?: boolean;
  new?: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  services: Service[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: "cleaning",
    name: "Cleaning & Upkeep",
    emoji: "🧹",
    description: "Full home cleaning, mopping, dusting and more",
    color: "#FF6B00",
    services: [
      {
        id: "house-cleaning",
        name: "House Cleaning",
        description: "Full home sweep, dust, mop and sanitise by a verified helper",
        price: "₹149",
        duration: "2–4 hrs",
        icon: "🏠",
        tags: ["popular", "home"],
        popular: true,
      },
      {
        id: "mopping",
        name: "Floor Mopping",
        description: "Deep wet mopping of all floors in your home",
        price: "₹79",
        duration: "45–90 min",
        icon: "🪣",
        tags: ["home"],
      },
      {
        id: "dusting",
        name: "Dusting & Wiping",
        description: "Surfaces, shelves, fans and furniture dusted and wiped clean",
        price: "₹69",
        duration: "30–60 min",
        icon: "🧽",
        tags: ["home"],
      },
      {
        id: "bathroom-cleaning",
        name: "Bathroom Cleaning",
        description: "Complete bathroom scrub, sanitise and deodorise",
        price: "₹99",
        duration: "45–75 min",
        icon: "🚿",
        tags: ["home"],
      },
      {
        id: "kitchen-cleaning",
        name: "Kitchen Cleaning",
        description: "Counters, stovetop, sink and surfaces cleaned thoroughly",
        price: "₹99",
        duration: "45–90 min",
        icon: "🍳",
        tags: ["home", "kitchen"],
      },
      {
        id: "dishwashing",
        name: "Dishwashing",
        description: "All your dishes washed, dried and stacked neatly",
        price: "₹49",
        duration: "20–45 min",
        icon: "🍽️",
        tags: ["kitchen"],
        popular: true,
      },
    ],
  },
  {
    id: "laundry",
    name: "Laundry & Ironing",
    emoji: "👕",
    description: "Wash, dry, fold and iron your clothes fresh",
    color: "#6366F1",
    services: [
      {
        id: "laundry-wash",
        name: "Laundry & Wash",
        description: "Clothes hand-washed or machine-washed, dried and folded",
        price: "₹99",
        duration: "1–3 hrs",
        icon: "🫧",
        tags: ["laundry"],
        popular: true,
      },
      {
        id: "ironing",
        name: "Ironing & Pressing",
        description: "Clothes ironed crisp and ready to wear — per piece or bundle",
        price: "₹49",
        duration: "30–60 min",
        icon: "👔",
        tags: ["laundry"],
      },
      {
        id: "laundry-fold",
        name: "Fold & Organise",
        description: "Freshly washed clothes folded and organised in your wardrobe",
        price: "₹49",
        duration: "20–40 min",
        icon: "🗂️",
        tags: ["laundry"],
      },
    ],
  },
  {
    id: "errands",
    name: "Errands & Pickups",
    emoji: "🏃",
    description: "Let a helper run your daily errands while you focus on life",
    color: "#10B981",
    services: [
      {
        id: "parcel-pickup",
        name: "Parcel Pickup",
        description: "Pick up a parcel or document from any address in the city",
        price: "₹69",
        duration: "30–90 min",
        icon: "📦",
        tags: ["errand"],
        popular: true,
      },
      {
        id: "medicine-pickup",
        name: "Medicine Pickup",
        description: "Get your prescriptions and medicines picked up from the pharmacy",
        price: "₹49",
        duration: "20–60 min",
        icon: "💊",
        tags: ["errand", "health"],
      },
      {
        id: "queue-standing",
        name: "Queue Standing",
        description: "Helper stands in queue for you — hospital, bank, office, RTO",
        price: "₹99",
        duration: "1–3 hrs",
        icon: "🏥",
        tags: ["errand", "health"],
        popular: true,
      },
      {
        id: "bill-payment",
        name: "Bill Payment",
        description: "In-person utility or government bill payments on your behalf",
        price: "₹49",
        duration: "30–60 min",
        icon: "🧾",
        tags: ["errand"],
      },
      {
        id: "document-delivery",
        name: "Document Delivery",
        description: "Deliver important documents to any address within city limits",
        price: "₹69",
        duration: "30–90 min",
        icon: "📄",
        tags: ["errand"],
      },
    ],
  },
  {
    id: "grocery",
    name: "Grocery & Shopping",
    emoji: "🛒",
    description: "Fresh groceries and essentials delivered to your door",
    color: "#F59E0B",
    services: [
      {
        id: "grocery-run",
        name: "Grocery Run",
        description: "Helper shops your list from nearest store and delivers home",
        price: "₹79",
        duration: "45–90 min",
        icon: "🥦",
        tags: ["grocery"],
        popular: true,
      },
      {
        id: "vegetable-fruit",
        name: "Vegetables & Fruits",
        description: "Fresh seasonal vegetables and fruits sourced and delivered",
        price: "₹59",
        duration: "30–60 min",
        icon: "🥕",
        tags: ["grocery"],
      },
      {
        id: "market-shopping",
        name: "Market Shopping",
        description: "General market run — pick up anything you need from local stores",
        price: "₹69",
        duration: "45–120 min",
        icon: "🧺",
        tags: ["grocery", "shopping"],
      },
    ],
  },
  {
    id: "kitchen",
    name: "Kitchen Helpers",
    emoji: "🥗",
    description: "Prep and cooking assistance for your daily meals",
    color: "#EC4899",
    services: [
      {
        id: "vegetable-cutting",
        name: "Vegetable Cutting",
        description: "Vegetables washed, peeled and chopped as per your preference",
        price: "₹49",
        duration: "20–45 min",
        icon: "🔪",
        tags: ["kitchen"],
        popular: true,
      },
      {
        id: "onion-cutting",
        name: "Onion Cutting",
        description: "Bulk onion peeling and chopping — no more tears!",
        price: "₹49",
        duration: "15–30 min",
        icon: "🧅",
        tags: ["kitchen"],
        new: true,
      },
      {
        id: "cooking-assist",
        name: "Cooking Assistance",
        description: "Helper assists with meal prep, stirring, and kitchen tasks",
        price: "₹99",
        duration: "1–2 hrs",
        icon: "👨‍🍳",
        tags: ["kitchen"],
      },
    ],
  },
  {
    id: "gardening",
    name: "Gardening",
    emoji: "🌿",
    description: "Keep your garden, balcony and plants fresh and flourishing",
    color: "#22C55E",
    services: [
      {
        id: "plant-watering",
        name: "Plant Watering",
        description: "All indoor and balcony plants watered with care",
        price: "₹49",
        duration: "15–30 min",
        icon: "🪴",
        tags: ["garden"],
      },
      {
        id: "garden-cleaning",
        name: "Garden Cleaning",
        description: "Trim, weed, sweep and tidy up your garden or terrace",
        price: "₹99",
        duration: "1–2 hrs",
        icon: "🌱",
        tags: ["garden"],
      },
    ],
  },
];

export const allServices: Service[] = serviceCategories.flatMap((c) => c.services);
