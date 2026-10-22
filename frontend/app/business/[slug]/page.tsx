import type { Metadata } from "next";
import Link from "next/link";
import BusinessDetailClient from "@/components/BusinessDetailClient";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

async function getBusiness(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/businesses/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error("Error fetching business for SEO:", error);
    return null;
  }
}

function getSchemaType(categorySlug: string): string {
  switch (categorySlug) {
    case "restaurants-cafes":
      return "Restaurant";
    case "healthcare-hospitals":
      return "Hospital";
    case "automobile-garages":
      return "AutoRepair";
    case "beauty-salon-spa":
      return "DaySpa";
    case "home-services-repairs":
      return "HomeAndConstructionBusiness";
    case "education-coaching":
      return "EducationalOrganization";
    case "real-estate-builders":
      return "RealEstateAgent";
    default:
      return "LocalBusiness";
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusiness(slug);

  if (!business) {
    return {
      title: "Business Not Found | Local Directory",
      description: "The requested business profile could not be found in our verified local directory.",
      robots: { index: false, follow: false },
    };
  }

  const area = business.location?.area || "Shivamogga";
  const city = business.location?.city || "Karnataka";
  const phone = business.contact?.phone || "";
  const category = business.categoryName || "Local Services";

  // Highly targeted title for Google Search ranking:
  // e.g. "Meenakshi Pure Veg Family Restaurant - Durgigudi, Shimoga | Contact & Address"
  const title = business.seo?.metaTitle || `${business.name} - ${area}, ${city} | Direct Contact & Services`;

  const description =
    business.seo?.metaDescription ||
    `Direct phone & WhatsApp contact for ${business.name} in ${area}, ${city}. Phone: ${phone}. Verified ${category} listing with full address, operating hours, and zero middleman fees.`;

  const canonicalUrl = `${SITE_URL}/business/${business.slug}`;
  const coverImage = business.media?.coverImage || business.media?.logo;

  return {
    title,
    description,
    keywords: [
      business.name,
      `${business.name} ${area}`,
      `${business.name} ${city}`,
      `${business.name} phone number`,
      `${business.name} contact`,
      `${business.name} address`,
      `${category} in ${area}`,
      `${category} ${city}`,
      ...(business.tags || []),
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${business.name} | Verified Local Listing`,
      description,
      url: canonicalUrl,
      siteName: "Karnataka Local Services Directory",
      type: "website",
      images: coverImage
        ? [
            {
              url: coverImage,
              width: 1200,
              height: 630,
              alt: `${business.name} storefront in ${area}`,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${business.name} - ${area}, ${city}`,
      description,
      images: coverImage ? [coverImage] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function BusinessDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const business = await getBusiness(slug);

  if (!business) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem", background: "#f8fafc" }}>
        <h1 style={{ fontSize: "1.85rem", color: "#0f172a", marginBottom: "0.5rem", fontWeight: 800 }}>
          Business Listing Not Found
        </h1>
        <p style={{ color: "#64748b", marginBottom: "1.5rem", maxWidth: "480px" }}>
          The business you are searching for may have been updated, relocated, or temporarily unlisted.
        </p>
        <Link href="/" className="btn-primary" style={{ padding: "0.65rem 1.35rem" }}>
          Back to Directory Homepage
        </Link>
      </div>
    );
  }

  const schemaType = getSchemaType(business.categorySlug);

  // Schema.org LocalBusiness JSON-LD for Google Rich Results & direct Knowledge Graph matching
  const jsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: business.name,
    description: business.description || business.tagline,
    url: `${SITE_URL}/business/${business.slug}`,
    telephone: business.contact?.phone,
    email: business.contact?.email || undefined,
    image: [business.media?.coverImage, business.media?.logo].filter(Boolean),
    address: {
      "@type": "PostalAddress",
      streetAddress: business.location?.address,
      addressLocality: business.location?.area || "Shivamogga",
      addressRegion: business.location?.state || "Karnataka",
      postalCode: business.location?.pincode || "577201",
      addressCountry: "IN",
    },
    priceRange: "₹₹",
  };

  if (business.location?.latitude && business.location?.longitude) {
    jsonLd.geo = {
      "@type": "GeoCoordinates",
      latitude: business.location.latitude,
      longitude: business.location.longitude,
    };
  }

  return (
    <>
      {/* Schema.org Structured Data for Googlebot */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BusinessDetailClient business={business} />
    </>
  );
}
