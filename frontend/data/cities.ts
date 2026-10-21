// Karnataka Cities & Localities Configuration

export interface CityData {
  id: string;
  name: string;
  district: string;
  popularAreas: string[];
}

export const CITIES_DATA: CityData[] = [
  {
    id: "shivamogga",
    name: "Shivamogga",
    district: "Shivamogga",
    popularAreas: [
      "All Shivamogga",
      "Gandhi Bazaar",
      "Durgigudi",
      "Vinoba Nagara",
      "Tilak Nagar",
      "Kuvempu Road",
      "Savanur Road",
      "Gopala",
      "Kashipura",
      "NT Road",
      "Sagar Road",
      "BH Road",
    ],
  },
  {
    id: "bhadravathi",
    name: "Bhadravathi",
    district: "Shivamogga",
    popularAreas: [
      "All Bhadravathi",
      "Old Town",
      "New Town",
      "VISL Township",
      "MPM Colony",
      "Halappa Circle",
      "Jannapura",
      "B.H. Road",
    ],
  },
  {
    id: "sagar",
    name: "Sagar",
    district: "Shivamogga",
    popularAreas: [
      "All Sagar",
      "Gandhi Chowk",
      "Subhash Nagar",
      "Jog Road",
      "B.H. Road",
      "Nehru Nagar",
    ],
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    district: "Bengaluru Urban",
    popularAreas: [
      "All Bengaluru",
      "Koramangala",
      "Indiranagar",
      "Jayanagar",
      "Whitefield",
      "HSR Layout",
      "Malleshwaram",
      "Electronic City",
      "Rajajinagar",
      "Hebbal",
      "Yelahanka",
    ],
  },
  {
    id: "mysuru",
    name: "Mysuru",
    district: "Mysuru",
    popularAreas: [
      "All Mysuru",
      "Gokulam",
      "Jayalakshmipuram",
      "Kuvempunagar",
      "Vijayanagar",
      "Saraswathipuram",
      "Devaraja Mohalla",
      "Hebbal",
    ],
  },
  {
    id: "mangaluru",
    name: "Mangaluru",
    district: "Dakshina Kannada",
    popularAreas: [
      "All Mangaluru",
      "Hampankatta",
      "Kadri",
      "Kankanady",
      "Bejai",
      "Surathkal",
      "Lalbagh",
      "Falnir",
    ],
  },
  {
    id: "hubballi-dharwad",
    name: "Hubballi-Dharwad",
    district: "Dharwad",
    popularAreas: [
      "All Hubballi-Dharwad",
      "Vidyanagar",
      "Keshwapur",
      "Gokul Road",
      "Navanagar",
      "Line Bazaar",
      "Saptapur",
    ],
  },
  {
    id: "davangere",
    name: "Davangere",
    district: "Davangere",
    popularAreas: [
      "All Davangere",
      "MCC A Block",
      "MCC B Block",
      "PJ Extension",
      "Vidyanagar",
      "Mandipet",
      "Hadadi Road",
    ],
  },
  {
    id: "udupi-manipal",
    name: "Udupi-Manipal",
    district: "Udupi",
    popularAreas: [
      "All Udupi-Manipal",
      "Manipal",
      "Car Street",
      "Kalsanka",
      "Santhekatte",
      "Malpe",
      "Ambagilu",
    ],
  },
  {
    id: "belagavi",
    name: "Belagavi",
    district: "Belagavi",
    popularAreas: [
      "All Belagavi",
      "Tilakwadi",
      "Camp",
      "Khanapur Road",
      "Shahapur",
      "Udyambag",
    ],
  },
  {
    id: "tumakuru",
    name: "Tumakuru",
    district: "Tumakuru",
    popularAreas: [
      "All Tumakuru",
      "Batawadi",
      "SS Puram",
      "Ashok Nagar",
      "Kyatsandra",
      "Gubbi Gate",
    ],
  },
  {
    id: "hassan",
    name: "Hassan",
    district: "Hassan",
    popularAreas: [
      "All Hassan",
      "BM Road",
      "Channapatna",
      "Vidyanagar",
      "Hassan Extension",
    ],
  },
];

export const DEFAULT_CITY = "Shivamogga";

export function getCityAreas(cityName: string): string[] {
  const city = CITIES_DATA.find(
    (c) => c.name.toLowerCase() === cityName.toLowerCase() || c.id === cityName.toLowerCase()
  );
  if (city) return city.popularAreas;
  return [`All ${cityName}`, "Main Market", "Bus Stand Road", "Station Road"];
}

// WhatsApp redirect link builder for Admin-Only business listing
export const ADMIN_WHATSAPP_NUMBER = "919448100001";

export function getWhatsAppListingUrl(cityName = "Shivamogga", planName = ""): string {
  const planText = planName ? ` for the ${planName} listing plan` : "";
  const message = `Hello Admin, I would like to list my business in ${cityName}${planText} on the verified local directory. Please share the verification and onboarding details.`;
  return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
