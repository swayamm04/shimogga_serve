import { MetadataRoute } from "next";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/safety`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const businessRoutes: MetadataRoute.Sitemap = [];

  try {
    const res = await fetch(`${API_BASE_URL}/businesses?limit=1000`, {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        json.data.forEach((biz: any) => {
          if (biz.slug && biz.status === "approved") {
            businessRoutes.push({
              url: `${SITE_URL}/business/${biz.slug}`,
              lastModified: biz.updatedAt ? new Date(biz.updatedAt) : new Date(),
              changeFrequency: "weekly",
              priority: biz.isFeatured ? 0.95 : 0.85,
            });
          }
        });
      }
    }
  } catch (err) {
    console.error("Failed to fetch businesses for sitemap.xml:", err);
  }

  return [...staticRoutes, ...businessRoutes];
}
