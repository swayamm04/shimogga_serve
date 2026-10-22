"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { businessAPI, categoryAPI } from "@/lib/api";
import { useCity } from "@/context/CityContext";
import {
  Search,
  MapPin,
  Phone,
  MessageCircle,
  ShieldCheck,
  X,
  RotateCcw,
} from "lucide-react";

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedCity, setSelectedCity, cities, areas } = useCity();

  // URL Query Sync
  const urlCity = searchParams.get("city");
  const urlCategory = searchParams.get("category");
  const urlSearch = searchParams.get("search");
  const urlArea = searchParams.get("area");

  // State
  const [searchTerm, setSearchTerm] = useState(urlSearch || "");
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || "all");
  const [selectedArea, setSelectedArea] = useState(urlArea || "all");

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

  // Sync state if URL query params change (e.g. from Mega Menu or Footer links)
  useEffect(() => {
    if (urlCategory !== null) setSelectedCategory(urlCategory || "all");
    if (urlSearch !== null) setSearchTerm(urlSearch || "");
    if (urlArea !== null) setSelectedArea(urlArea || "all");
  }, [urlCategory, urlSearch, urlArea]);

  // Reset selected area when city changes
  useEffect(() => {
    setSelectedArea("all");
  }, [selectedCity]);

  // Load Categories once
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

  // Fetch businesses whenever filters or city change
  useEffect(() => {
    async function loadBusinesses() {
      setLoading(true);
      try {
        const params: Record<string, string | number> = {
          city: selectedCity,
          limit: 30,
        };
        if (searchTerm.trim()) params.search = searchTerm.trim();
        if (selectedCategory && selectedCategory !== "all") params.category = selectedCategory;
        if (selectedArea && selectedArea !== "all" && !selectedArea.startsWith("All ")) {
          params.area = selectedArea;
        }

        const res = await businessAPI.getAll(params);
        if (res.success && res.data) {
          setBusinesses(res.data);
        } else {
          setBusinesses([]);
        }
      } catch (err) {
        console.error("Failed to load directory data:", err);
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    }
    loadBusinesses();
  }, [selectedCity, searchTerm, selectedCategory, selectedArea]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    document.getElementById("businesses")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedArea("all");
  };

  const handleActionClick = (e: React.MouseEvent, bizId: string, action: "call" | "whatsapp" | "website") => {
    e.stopPropagation();
    businessAPI.trackInteraction(bizId, action).catch(() => {});
  };

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    (selectedCategory !== "all" && selectedCategory !== "") ||
    (selectedArea !== "all" && selectedArea !== "");

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* ── HERO SEARCH SECTION ── */}
      <section
        style={{
          background: "#0f2942",
          color: "#ffffff",
          paddingTop: "4.5rem",
          paddingBottom: "4.5rem",
          borderBottom: "1px solid #1e3a5f",
        }}
      >
        <div className="container">
          <div style={{ maxWidth: "880px", margin: "0 auto", textAlign: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.35rem 0.85rem",
                borderRadius: "4px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                fontSize: "0.82rem",
                color: "#fdba74",
                marginBottom: "1.25rem",
                fontWeight: 600,
              }}
            >
              <ShieldCheck size={16} color="#fb923c" />
              <span>Verified Local Business Directory • {selectedCity}</span>
            </div>

            <h1
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                marginBottom: "1rem",
                color: "#ffffff",
              }}
            >
              Find Top Verified Services &amp; Businesses in {selectedCity}
            </h1>

            <p
              style={{
                fontSize: "1.05rem",
                color: "#cbd5e1",
                lineHeight: 1.6,
                marginBottom: "2rem",
                maxWidth: "680px",
                margin: "0 auto 2rem",
              }}
            >
              Connect directly with verified hospitals, pure veg restaurants, electricians, plumbing services, automobile garages, and local stores. Zero middleman fees.
            </p>

            {/* Direct Multi-City Search Bar */}
            {/* Direct Multi-City Search Bar */}
            <form
              onSubmit={handleHeroSearch}
              style={{
                background: "#ffffff",
                borderRadius: "8px",
                padding: "0.45rem 0.6rem",
                border: "1px solid #cbd5e1",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.25)",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                maxWidth: "680px",
                margin: "0 auto",
              }}
            >
              {/* Keyword Search */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.65rem",
                  flex: 1,
                  padding: "0.45rem 0.75rem",
                }}
              >
                <Search size={20} color="#64748b" />
                <input
                  type="text"
                  placeholder="Search doctor, hospital, restaurant, car repair, electrician..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    border: "none",
                    outline: "none",
                    width: "100%",
                    fontSize: "0.98rem",
                    color: "#0f172a",
                    background: "transparent",
                  }}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  padding: "0.75rem 1.6rem",
                  fontSize: "0.92rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  borderRadius: "6px",
                  flexShrink: 0,
                }}
              >
                <Search size={15} /> Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── LISTED BUSINESSES DIRECTORY ── */}
      <section id="businesses" style={{ padding: "3rem 0 5rem", background: "#f8fafc" }}>
        <div className="container">
          {/* Results Count & Filter Chips Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
              gap: "0.75rem",
              fontSize: "0.88rem",
            }}
          >
            <div style={{ color: "#64748b" }}>
              Showing <b style={{ color: "#0f172a" }}>{businesses.length}</b> verified results in <b>{selectedCity}</b>
            </div>

            {hasActiveFilters && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", alignItems: "center" }}>
                {selectedCategory !== "all" && activeCategoryObj && (
                  <span
                    style={{
                      background: "#eff6ff",
                      color: "#1e40af",
                      border: "1px solid #bfdbfe",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "4px",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    Category: {activeCategoryObj.name}
                    <button
                      onClick={() => setSelectedCategory("all")}
                      style={{ background: "transparent", border: "none", cursor: "pointer", color: "#1e40af", padding: 0 }}
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {selectedArea !== "all" && (
                  <span
                    style={{
                      background: "#f0fdf4",
                      color: "#15803d",
                      border: "1px solid #bbf7d0",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "4px",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    Area: {selectedArea}
                    <button
                      onClick={() => setSelectedArea("all")}
                      style={{ background: "transparent", border: "none", cursor: "pointer", color: "#15803d", padding: 0 }}
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {searchTerm.trim() !== "" && (
                  <span
                    style={{
                      background: "#fff7ed",
                      color: "#c2410c",
                      border: "1px solid #fed7aa",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "4px",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    Keyword: &ldquo;{searchTerm}&rdquo;
                    <button
                      onClick={() => setSearchTerm("")}
                      style={{ background: "transparent", border: "none", cursor: "pointer", color: "#c2410c", padding: 0 }}
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                <button
                  onClick={handleResetFilters}
                  className="btn-secondary"
                  style={{ fontSize: "0.78rem", display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.2rem 0.55rem" }}
                >
                  <RotateCcw size={12} /> Reset
                </button>
              </div>
            )}
          </div>

          {/* Cards Grid / States */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748b", background: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              Loading businesses in {selectedCity}...
            </div>
          ) : businesses.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "3.5rem 1.5rem",
                background: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>
                No listings matching your search in {selectedCity}
              </h3>
              <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
                Try adjusting your search terms, selecting &quot;All Categories&quot;, or switching localities.
              </p>
              <button
                onClick={handleResetFilters}
                className="btn-primary"
                style={{ display: "inline-flex", padding: "0.6rem 1.25rem" }}
              >
                Reset All Filters
              </button>
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
                  <div style={{ position: "relative", height: "180px", width: "100%", background: "#e2e8f0" }}>
                    <Link href={`/business/${biz.slug}`} style={{ display: "block", width: "100%", height: "100%" }}>
                      <img
                        src={biz.media?.coverImage || biz.media?.logo || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"}
                        alt={biz.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </Link>

                    {/* Badges */}
                    <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", gap: "0.35rem" }}>
                      {biz.isFeatured && (
                        <span className="badge-sponsor">
                          TOP PARTNER
                        </span>
                      )}
                      {biz.isVerified && (
                        <span className="badge-verified">
                          <ShieldCheck size={12} /> VERIFIED
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        right: "10px",
                        background: "rgba(15,23,42,0.9)",
                        color: "#ffffff",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        padding: "0.2rem 0.55rem",
                        borderRadius: "4px",
                      }}
                    >
                      {biz.location?.area || selectedCity}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                    <div style={{ marginBottom: "0.45rem" }}>
                      <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        {biz.categoryName}
                      </span>
                      <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#0f172a", marginTop: "0.15rem" }}>
                        <Link href={`/business/${biz.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                          {biz.name}
                        </Link>
                      </h3>
                    </div>

                    <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "0.85rem", flexGrow: 1 }}>
                      {biz.tagline || (biz.description ? biz.description.substring(0, 95) + "..." : "Contact for details and service availability.")}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#64748b", fontSize: "0.8rem", marginBottom: "1rem" }}>
                      <MapPin size={14} color="#ea580c" />
                      <span>{biz.location?.address || `${biz.location?.area || selectedCity}, Karnataka`}</span>
                    </div>

                    {/* Actions */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "0.5rem",
                        paddingTop: "0.75rem",
                        borderTop: "1px solid #f1f5f9",
                      }}
                    >
                      <a
                        href={`tel:${biz.contact?.phone || "+919448100001"}`}
                        onClick={(e) => handleActionClick(e, biz._id, "call")}
                        className="btn-secondary"
                        style={{ padding: "0.45rem", fontSize: "0.82rem" }}
                      >
                        <Phone size={13} color="#059669" /> Call
                      </a>

                      <a
                        href={`https://wa.me/${(biz.contact?.whatsapp || biz.contact?.phone || "919448100001").replace(/\D/g, "")}?text=Hello%2C%20I%20found%20your%20business%20on%20${encodeURIComponent(selectedCity)}%20Services`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => handleActionClick(e, biz._id, "whatsapp")}
                        className="btn-secondary"
                        style={{ padding: "0.45rem", fontSize: "0.82rem", color: "#047857", borderColor: "#a7f3d0", background: "#f0fdf4" }}
                      >
                        <MessageCircle size={13} color="#047857" /> WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── ABOUT DIRECTORY (SHORT & IN-PAGE) ── */}
      <section id="about" style={{ padding: "4rem 0", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <div className="container" style={{ maxWidth: "860px", textAlign: "center" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#ea580c", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            ABOUT THE DIRECTORY
          </span>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a", marginTop: "0.3rem", marginBottom: "0.85rem" }}>
            Direct Local Business Directory for {selectedCity}
          </h2>
          <p style={{ color: "#475569", fontSize: "0.95rem", lineHeight: 1.7, margin: "0 auto 2rem", maxWidth: "720px" }}>
            {selectedCity} Services is an independent, community-driven platform designed to connect citizens and visitors directly with trusted local doctors, hospitals, restaurants, home repairs, automobile garages, and local merchants. We provide direct phone and WhatsApp contact without middlemen, booking fees, or hidden commissions.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
              textAlign: "left",
            }}
          >
            <div style={{ background: "#ffffff", padding: "1.2rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.3rem" }}>
                100% Direct Contact
              </h3>
              <p style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.5, margin: 0 }}>
                Direct one-tap call and WhatsApp chat with clinic doctors, mechanics, and store owners.
              </p>
            </div>

            <div style={{ background: "#ffffff", padding: "1.2rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.3rem" }}>
                Verified Physical Presence
              </h3>
              <p style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.5, margin: 0 }}>
                All listed merchants have real, verified physical addresses and localities in {selectedCity}.
              </p>
            </div>

            <div style={{ background: "#ffffff", padding: "1.2rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.3rem" }}>
                Free for Citizens
              </h3>
              <p style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.5, margin: 0 }}>
                Browse contacts, timings, and menus without registration or platform booking fees.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center", color: "#64748b" }}>Loading directory...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
