"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { businessAPI, categoryAPI } from "@/lib/api";
import { useCity } from "@/context/CityContext";
import { getWhatsAppListingUrl } from "@/data/cities";
import CategoryIcon from "@/components/CategoryIcon";
import {
  Search,
  MapPin,
  Star,
  Phone,
  MessageCircle,
  ShieldCheck,
  Award,
  Filter,
  ArrowUpDown,
  Building2,
  ExternalLink,
} from "lucide-react";

function ServicesDirectoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedCity, setSelectedCity, cities, areas } = useCity();

  const urlCity = searchParams.get("city");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [selectedArea, setSelectedArea] = useState(searchParams.get("area") || "all");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "seo");

  const [businesses, setBusinesses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync city from URL if present
  useEffect(() => {
    if (urlCity && urlCity !== selectedCity) {
      const match = cities.find(
        (c) => c.name.toLowerCase() === urlCity.toLowerCase() || c.id === urlCity.toLowerCase()
      );
      if (match) setSelectedCity(match.name);
    }
  }, [urlCity]);

  // Fetch categories
  useEffect(() => {
    categoryAPI
      .getAll()
      .then((res) => {
        if (res.success && res.data) {
          setCategories(res.data);
        }
      })
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  // Fetch businesses when filters or city change
  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number> = {
      sortBy,
      city: selectedCity,
    };
    if (search.trim()) params.search = search.trim();
    if (selectedCategory && selectedCategory !== "all") params.category = selectedCategory;
    if (selectedArea && selectedArea !== "all" && !selectedArea.startsWith("All ")) {
      params.area = selectedArea;
    }

    businessAPI
      .getAll(params)
      .then((res) => {
        if (res.success && res.data) {
          setBusinesses(res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching businesses:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [search, selectedCategory, selectedArea, sortBy, selectedCity]);

  const handleActionClick = (e: React.MouseEvent, bizId: string, action: "call" | "whatsapp") => {
    e.stopPropagation();
    businessAPI.trackInteraction(bizId, action).catch(() => {});
  };

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    setSelectedArea("all");
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingTop: "2rem", paddingBottom: "5rem" }}>
      {/* ── Search & Filter Bar ── */}
      <div style={{ background: "#ffffff", borderBottom: "1px solid var(--border)", padding: "1.75rem 0", marginBottom: "2rem" }}>
        <div className="container">
          <div style={{ marginBottom: "1.25rem" }}>
            <span
              style={{
                fontSize: "0.75rem",
                color: "#ea580c",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {selectedCity.toUpperCase()} BUSINESS DIRECTORY
            </span>
            <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "#0f172a", marginTop: "0.15rem" }}>
              Explore Verified Local Services in {selectedCity}
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
              Browse verified hospitals, restaurants, mechanics, coaching centers, and merchants in {selectedCity} and Karnataka.
            </p>
          </div>

          {/* Interactive Multi-City Filters */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: "0.75rem",
              background: "#f8fafc",
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
          >
            {/* Search Input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                padding: "0.5rem 0.75rem",
              }}
            >
              <Search size={16} color="#64748b" />
              <input
                type="text"
                placeholder="Search name, doctor, salon..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "0.88rem",
                  color: "#0f172a",
                }}
              />
            </div>

            {/* City Selector */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                padding: "0.5rem 0.75rem",
              }}
            >
              <MapPin size={15} color="#ea580c" />
              <select
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "0.85rem",
                  color: "#0f172a",
                  fontWeight: 700,
                  background: "transparent",
                  cursor: "pointer",
                }}
                title="Select City"
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Area Filter */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                padding: "0.5rem 0.75rem",
              }}
            >
              <Building2 size={15} color="#64748b" />
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "0.85rem",
                  color: "#334155",
                  background: "transparent",
                  cursor: "pointer",
                }}
                title="Select Area"
              >
                <option value="all">All {selectedCity}</option>
                {areas
                  .filter((a) => !a.startsWith("All "))
                  .map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
              </select>
            </div>

            {/* Category Filter */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                padding: "0.5rem 0.75rem",
              }}
            >
              <Filter size={15} color="#64748b" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "0.85rem",
                  color: "#334155",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                padding: "0.5rem 0.75rem",
              }}
            >
              <ArrowUpDown size={15} color="#64748b" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "0.85rem",
                  color: "#334155",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                <option value="seo">Top Sponsored &amp; SEO Rank</option>
                <option value="rating">Highest Rating</option>
                <option value="reviews">Most Reviewed</option>
                <option value="newest">Newest Listed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Directory Listings Grid ── */}
      <div className="container">
        {/* Results Counter */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
            Showing <b style={{ color: "#0f172a" }}>{businesses.length}</b> verified results in <b>{selectedCity}</b>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#059669", fontWeight: 600 }}>
            Subscribed verified partners appear with priority
          </div>
        </div>

        {/* State: Loading, Empty, or Results */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748b", background: "#ffffff", borderRadius: "8px", border: "1px solid var(--border)" }}>
            Loading verified businesses in {selectedCity}...
          </div>
        ) : businesses.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 1.5rem",
              background: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ width: "48px", height: "48px", borderRadius: "8px", background: "#ecfdf5", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem", color: "#059669", border: "1px solid #a7f3d0" }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.35rem" }}>
              Verified Directory Expanding in {selectedCity}
            </h3>
            <p style={{ color: "#64748b", maxWidth: "500px", margin: "0 auto 1.5rem", fontSize: "0.9rem", lineHeight: 1.6 }}>
              We are currently onboarding verified merchants, clinics, and service workers in {selectedCity}. Are you a business owner or practitioner in {selectedCity}?
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <a
                href={getWhatsAppListingUrl(selectedCity)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ fontSize: "0.88rem", display: "inline-flex", alignItems: "center", gap: "0.4rem", textDecoration: "none" }}
              >
                <MessageCircle size={16} /> Chat on WhatsApp to List in {selectedCity}
              </a>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                  setSelectedArea("all");
                }}
                className="btn-secondary"
                style={{ fontSize: "0.88rem" }}
              >
                Reset All Filters
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {businesses.map((biz) => (
              <div
                key={biz._id}
                className="card"
                onClick={() => router.push(`/business/${biz.slug}`)}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Photo & Badges */}
                <div style={{ position: "relative", height: "180px", width: "100%", background: "#f1f5f9" }}>
                  <img
                    src={biz.media?.coverImage || biz.media?.logo || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80"}
                    alt={biz.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", gap: "0.4rem" }}>
                    {biz.isVerified && (
                      <span className="badge-verified">
                        <ShieldCheck size={12} /> Verified
                      </span>
                    )}
                    {biz.isFeatured && (
                      <span className="badge-featured">
                        <Award size={12} /> Top Partner
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div style={{ padding: "1.25rem", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.35rem" }}>
                    <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>
                      {biz.categoryName || "Local Business"}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.85rem", fontWeight: 700, color: "#ea580c" }}>
                      <Star size={14} fill="#ea580c" color="#ea580c" />
                      <span>{biz.rating ? biz.rating.toFixed(1) : "4.8"}</span>
                      <span style={{ color: "#94a3b8", fontWeight: 500, fontSize: "0.75rem" }}>
                        ({biz.reviewsCount || 12})
                      </span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.35rem", lineHeight: 1.3 }}>
                    {biz.name}
                  </h3>

                  <p style={{ fontSize: "0.85rem", color: "#475569", lineHeight: 1.5, marginBottom: "0.9rem", flexGrow: 1 }}>
                    {biz.tagline || (biz.description ? biz.description.slice(0, 110) + "..." : "Verified local service provider offering trusted services.")}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "#64748b", marginBottom: "1rem" }}>
                    <MapPin size={14} color="#ea580c" />
                    <span>{biz.location?.area || "Central Area"}, {biz.location?.city || selectedCity}</span>
                  </div>

                  {/* Direct Contact Actions */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", borderTop: "1px solid #f1f5f9", paddingTop: "0.85rem" }}>
                    <a
                      href={`tel:${biz.contact?.phone}`}
                      onClick={(e) => handleActionClick(e, biz._id, "call")}
                      className="btn-secondary"
                      style={{
                        padding: "0.45rem",
                        fontSize: "0.82rem",
                        textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <Phone size={13} color="#0284c7" /> Call Now
                    </a>

                    <a
                      href={`https://wa.me/${biz.contact?.whatsapp || biz.contact?.phone?.replace(/\D/g, "")}?text=${encodeURIComponent(
                        `Hello! I found your listing for ${biz.name} on the local directory. I have an inquiry.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handleActionClick(e, biz._id, "whatsapp")}
                      className="btn-primary"
                      style={{
                        padding: "0.45rem",
                        fontSize: "0.82rem",
                        textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <MessageCircle size={13} /> WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center" }}>Loading Directory...</div>}>
      <ServicesDirectoryContent />
    </Suspense>
  );
}
