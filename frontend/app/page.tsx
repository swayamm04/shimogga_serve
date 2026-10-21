"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  TrendingUp,
  Award,
  CheckCircle2,
  ArrowRight,
  Eye,
  Building2,
  Clock,
  ExternalLink,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { selectedCity, setSelectedCity, cities, areas } = useCity();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("all");
  const [featuredBusinesses, setFeaturedBusinesses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Reset selected area when city changes
  useEffect(() => {
    setSelectedArea("all");
  }, [selectedCity]);

  const emergencyContacts =
    selectedCity === "Shivamogga"
      ? [
          { title: "McGann District Hospital Casualty", number: "08182222222", display: "08182-222222", desc: "24/7 Government Medical Emergency, Kuvempu Road" },
          { title: "Police Emergency Control", number: "112", display: "112", desc: "Shivamogga City & District Police Helpline" },
          { title: "Ambulance Emergency Response", number: "108", display: "108", desc: "Immediate 24/7 Medical Response Ambulance" },
          { title: "MESCOM Electricity Helpline", number: "1912", display: "1912", desc: "Power Outages, Faults & Line Emergency" },
          { title: "Fire & Rescue Department", number: "101", display: "101", desc: "Fire Emergency Station, Shivamogga" },
          { title: "KSRTC Central Bus Stand Enquiry", number: "08182222044", display: "08182-222044", desc: "Bus Schedule & Transit Enquiry, B.H. Road" },
        ]
      : [
          { title: "State Police Rapid Control", number: "112", display: "112", desc: `24/7 Emergency Police Response in ${selectedCity}` },
          { title: "Ambulance Emergency Response", number: "108", display: "108", desc: `Immediate 24/7 Medical Trauma Ambulance in ${selectedCity}` },
          { title: "Fire & Rescue Department", number: "101", display: "101", desc: `Fire Emergency Services in ${selectedCity}` },
          { title: "Karnataka Electricity Helpline", number: "1912", display: "1912", desc: "Power Outages, Faults & Line Emergency" },
          { title: "Women Safety Helpline", number: "1091", display: "1091", desc: `24/7 Dedicated Women Safety Helpline in ${selectedCity}` },
          { title: "Child Protection Helpline", number: "1098", display: "1098", desc: "24/7 Child Protection & Assistance Services" },
        ];

  useEffect(() => {
    async function loadData() {
      try {
        const [bizRes, catRes] = await Promise.all([
          businessAPI.getFeatured().catch(() => ({ data: [] })),
          categoryAPI.getAll().catch(() => ({ data: [] })),
        ]);
        if (bizRes.success && bizRes.data) {
          setFeaturedBusinesses(bizRes.data);
        }
        if (catRes.success && catRes.data) {
          setCategories(catRes.data);
        }
      } catch (err) {
        console.error("Failed to load directory data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCity) params.set("city", selectedCity);
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    if (selectedArea && selectedArea !== "all" && !selectedArea.startsWith("All ")) {
      params.set("area", selectedArea);
    }
    router.push(`/services?${params.toString()}`);
  };

  const handleActionClick = (e: React.MouseEvent, bizId: string, action: "call" | "whatsapp" | "website") => {
    e.stopPropagation();
    businessAPI.trackInteraction(bizId, action).catch(() => {});
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* ── HERO SECTION ── */}
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
              <span>Verified Local Business &amp; Essential Services Directory • {selectedCity}</span>
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
            <form
              onSubmit={handleSearch}
              style={{
                background: "#ffffff",
                borderRadius: "8px",
                padding: "0.45rem",
                border: "1px solid #cbd5e1",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                display: "flex",
                flexWrap: "wrap",
                gap: "0.45rem",
                alignItems: "center",
              }}
            >
              {/* Keyword Search */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  flex: "1 1 240px",
                  padding: "0.5rem 0.85rem",
                }}
              >
                <Search size={18} color="#64748b" />
                <input
                  type="text"
                  placeholder="Search doctor, hospital, restaurant, car repair, electrician..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    border: "none",
                    outline: "none",
                    width: "100%",
                    fontSize: "0.92rem",
                    color: "#0f172a",
                  }}
                />
              </div>

              {/* City Selection Dropdown */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  flex: "0 1 170px",
                  padding: "0.5rem 0.85rem",
                  borderLeft: "1px solid #e2e8f0",
                }}
              >
                <MapPin size={16} color="#ea580c" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "0.88rem",
                    color: "#0f172a",
                    cursor: "pointer",
                    width: "100%",
                    fontWeight: 700,
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

              {/* Dynamic Locality Dropdown */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  flex: "0 1 170px",
                  padding: "0.5rem 0.85rem",
                  borderLeft: "1px solid #e2e8f0",
                }}
              >
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "0.88rem",
                    color: "#334155",
                    cursor: "pointer",
                    width: "100%",
                    fontWeight: 500,
                  }}
                  title="Select Locality"
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

              <button
                type="submit"
                className="btn-primary"
                style={{ padding: "0.75rem 1.5rem", fontSize: "0.92rem" }}
              >
                <Search size={15} /> Search
              </button>
            </form>

            {/* Popular Category Shortcuts */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "0.5rem",
                marginTop: "1.5rem",
              }}
            >
              <span style={{ fontSize: "0.82rem", color: "#94a3b8", alignSelf: "center", fontWeight: 600 }}>
                Popular Categories:
              </span>
              {[
                { name: "Hospitals & Doctors", slug: "healthcare-hospitals" },
                { name: "Restaurants & Cafes", slug: "restaurants-cafes" },
                { name: "Home Repairs & Cleaning", slug: "home-services-repairs" },
                { name: "Automobile Garages", slug: "automobile-garages" },
                { name: "Education & Coaching", slug: "education-coaching" },
                { name: "Salons & Spas", slug: "beauty-salon-spa" },
              ].map((item) => (
                <Link
                  key={item.slug}
                  href={`/services?category=${item.slug}`}
                  style={{
                    fontSize: "0.8rem",
                    padding: "0.3rem 0.75rem",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "4px",
                    color: "#e2e8f0",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── EMERGENCY & PUBLIC UTILITY DIRECTORY ── */}
      <section id="emergency" style={{ padding: "3.5rem 0", background: "#ffffff", borderBottom: "1px solid #e2e8f0" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.8rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#ea580c", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                CITIZEN HELPLINES
              </span>
              <h2 style={{ fontSize: "1.65rem", fontWeight: 800, color: "#0f172a", marginTop: "0.2rem" }}>
                Shivamogga Emergency &amp; Utility Contacts
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                Direct official telephone numbers for police, fire, casualty hospitals, and essential municipal services.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1rem",
            }}
          >
            {emergencyContacts.map((contact, idx) => (
              <div
                key={idx}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "1.1rem 1.25rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a" }}>
                    {contact.title}
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.2rem" }}>
                    {contact.desc}
                  </p>
                </div>
                <a
                  href={`tel:${contact.number}`}
                  className="btn-dark"
                  style={{
                    padding: "0.45rem 0.85rem",
                    fontSize: "0.82rem",
                    flexShrink: 0,
                  }}
                >
                  <Phone size={13} color="#38bdf8" /> {contact.display}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED & VERIFIED BUSINESSES ── */}
      <section style={{ padding: "4rem 0", background: "#f8fafc" }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.78rem",
                  color: "#ea580c",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "0.25rem",
                }}
              >
                <Award size={15} /> Verified Local Network
              </div>
              <h2 style={{ fontSize: "1.85rem", fontWeight: 800, color: "#0f172a" }}>
                Top Ranked Businesses in Shivamogga
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.92rem" }}>
                Verified local healthcare providers, restaurants, and repair technicians with direct phone and WhatsApp contact.
              </p>
            </div>

            <Link
              href="/services"
              className="btn-secondary"
              style={{ fontSize: "0.88rem" }}
            >
              View All Directory Listings <ArrowRight size={15} />
            </Link>
          </div>

          {/* Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {featuredBusinesses.slice(0, 6).map((biz) => (
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
                  <img
                    src={biz.media?.coverImage || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"}
                    alt={biz.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />

                  {/* Badges */}
                  <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", gap: "0.35rem" }}>
                    <span className="badge-sponsor">
                      TOP PARTNER
                    </span>
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
                    {biz.location?.area || "Shivamogga"}
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.35rem" }}>
                    <div>
                      <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                        {biz.categoryName}
                      </span>
                      <h3 style={{ fontSize: "1.12rem", fontWeight: 700, color: "#0f172a", marginTop: "0.1rem" }}>
                        {biz.name}
                      </h3>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.2rem",
                        background: "#fffbeb",
                        border: "1px solid #fde68a",
                        color: "#b45309",
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        padding: "0.2rem 0.45rem",
                        borderRadius: "4px",
                      }}
                    >
                      <Star size={13} fill="#b45309" color="#b45309" />
                      <span>{biz.rating || "4.8"}</span>
                    </div>
                  </div>

                  <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "0.85rem", flexGrow: 1 }}>
                    {biz.tagline || (biz.description ? biz.description.substring(0, 95) + "..." : "Contact for details and service availability.")}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#64748b", fontSize: "0.8rem", marginBottom: "1rem" }}>
                    <MapPin size={14} color="#ea580c" />
                    <span>{biz.location?.address || `${biz.location?.area || "Shivamogga"}, Karnataka`}</span>
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
                      href={`https://wa.me/${(biz.contact?.whatsapp || biz.contact?.phone || "919448100001").replace(/\D/g, "")}?text=Hello%2C%20I%20found%20your%20business%20on%20Shivamogga%20Services`}
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
        </div>
      </section>

      {/* ── BROWSE BY CATEGORY (WITH CLEAN SVG ICONS) ── */}
      <section id="categories" style={{ padding: "4.5rem 0", background: "#ffffff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "650px", margin: "0 auto 2.5rem" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#ea580c", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              LOCAL SERVICE CATEGORIES
            </span>
            <h2 style={{ fontSize: "1.85rem", fontWeight: 800, color: "#0f172a", marginTop: "0.2rem" }}>
              Explore Shivamogga by Category
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.92rem", marginTop: "0.3rem" }}>
              Select a specialized category to find phone numbers, doctor timings, menu details, and verified addresses.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.2rem",
            }}
          >
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/services?category=${cat.slug}`}
                className="card"
                style={{
                  padding: "1.25rem",
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "6px",
                    background: "#eff6ff",
                    color: "#1e40af",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "0.85rem",
                    border: "1px solid #dbeafe",
                  }}
                >
                  <CategoryIcon slug={cat.slug} name={cat.name} iconName={cat.icon} size={22} color="#1e40af" />
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.35rem" }}>
                  {cat.name}
                </h3>
                <p style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.5, marginBottom: "0.9rem", flexGrow: 1 }}>
                  {cat.description || "Browse top verified service providers in this category."}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.8rem", color: "#ea580c", fontWeight: 600 }}>
                  <span>{cat.businessCount || 1} Listed Business{cat.businessCount === 1 ? "" : "es"}</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR BUSINESS OWNERS / SUBSCRIPTION PRICING ── */}
      <section
        id="pricing"
        style={{
          padding: "4.5rem 0",
          background: "#0f2942",
          color: "#ffffff",
          borderBottom: "1px solid #1e3a5f",
        }}
      >
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 3rem" }}>
            <span
              style={{
                fontSize: "0.8rem",
                color: "#fdba74",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              FOR {selectedCity.toUpperCase()} MERCHANTS &amp; SERVICE PROVIDERS
            </span>
            <h2 style={{ fontSize: "2.1rem", fontWeight: 800, marginTop: "0.4rem", color: "#ffffff" }}>
              List Your Business &amp; Receive Verified Local Customers
            </h2>
            <p style={{ color: "#cbd5e1", fontSize: "0.95rem", marginTop: "0.6rem", lineHeight: 1.6 }}>
              Direct telephone inquiries, WhatsApp customer chats, and visitor analytics.
            </p>
            <div
              style={{
                marginTop: "1.25rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "6px",
                padding: "0.45rem 1rem",
                fontSize: "0.82rem",
                color: "#fdba74",
              }}
            >
              <MessageCircle size={15} color="#fb923c" />
              <span>Admin-Verified Onboarding: All listings are reviewed and created directly via WhatsApp.</span>
            </div>
          </div>

          {/* Pricing Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
              alignItems: "stretch",
            }}
          >
            {/* 1 Month Plan */}
            <div
              style={{
                background: "#ffffff",
                color: "#0f172a",
                borderRadius: "8px",
                padding: "2rem",
                border: "1px solid #cbd5e1",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a" }}>1 Month Starter</h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "0.2rem" }}>
                Short-term trial for local shops and service workers.
              </p>
              <div style={{ margin: "1.25rem 0" }}>
                <span style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0f172a" }}>₹999</span>
                <span style={{ color: "#64748b", fontSize: "0.85rem" }}> / month</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.75rem", display: "flex", flexDirection: "column", gap: "0.65rem", fontSize: "0.85rem", color: "#334155", flexGrow: 1 }}>
                <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle2 size={16} color="#059669" /> Verified Business Profile
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle2 size={16} color="#059669" /> Direct Call &amp; WhatsApp Lead Links
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle2 size={16} color="#059669" /> Visitor &amp; Lead Tracker
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle2 size={16} color="#059669" /> Category Search Placement
                </li>
              </ul>
              <a
                href={getWhatsAppListingUrl(selectedCity, "1 Month Starter")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ textAlign: "center", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
              >
                <MessageCircle size={15} /> Chat on WhatsApp to List
              </a>
            </div>

            {/* 1 Year Plan (Best Value) */}
            <div
              style={{
                background: "#ffffff",
                color: "#0f172a",
                borderRadius: "8px",
                padding: "2rem",
                border: "2px solid #ea580c",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-12px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#ea580c",
                  color: "#ffffff",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  padding: "0.2rem 0.75rem",
                  borderRadius: "4px",
                  letterSpacing: "0.05em",
                }}
              >
                TOP RECOMMENDATION • SAVE 25%
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", marginTop: "0.2rem" }}>
                1 Year Elite Partner
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#ea580c", marginTop: "0.2rem", fontWeight: 600 }}>
                Maximum visibility for serious clinics, showrooms &amp; contractors.
              </p>
              <div style={{ margin: "1.25rem 0" }}>
                <span style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0f172a" }}>₹8,999</span>
                <span style={{ color: "#64748b", fontSize: "0.85rem" }}> / year (₹749/mo)</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.75rem", display: "flex", flexDirection: "column", gap: "0.65rem", fontSize: "0.85rem", color: "#334155", flexGrow: 1 }}>
                <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle2 size={16} color="#ea580c" /> <b>Top #1 Ranking in Category Search</b>
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle2 size={16} color="#ea580c" /> <b>Featured Partner Homepage Placement</b>
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle2 size={16} color="#ea580c" /> Full Call &amp; WhatsApp Analytics Tracker
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle2 size={16} color="#ea580c" /> Direct Customer Inquiry Leads Inbox
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle2 size={16} color="#ea580c" /> Google Schema SEO Structured Data
                </li>
              </ul>
              <a
                href={getWhatsAppListingUrl(selectedCity, "1 Year Elite Partner")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ textAlign: "center", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
              >
                <MessageCircle size={15} /> Chat on WhatsApp to List (1 Year)
              </a>
            </div>

            {/* 6 Months Plan */}
            <div
              style={{
                background: "#ffffff",
                color: "#0f172a",
                borderRadius: "8px",
                padding: "2rem",
                border: "1px solid #cbd5e1",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a" }}>6 Months Growth</h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "0.2rem" }}>
                Ideal for established retail stores, restaurants, and salons.
              </p>
              <div style={{ margin: "1.25rem 0" }}>
                <span style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0f172a" }}>₹4,999</span>
                <span style={{ color: "#64748b", fontSize: "0.85rem" }}> / 6 months</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.75rem", display: "flex", flexDirection: "column", gap: "0.65rem", fontSize: "0.85rem", color: "#334155", flexGrow: 1 }}>
                <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle2 size={16} color="#059669" /> High Search Priority Placement
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle2 size={16} color="#059669" /> Customer Calls &amp; Inquiries Tracker
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle2 size={16} color="#059669" /> Verified Partner Badge
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle2 size={16} color="#059669" /> Photo Gallery &amp; Working Hours
                </li>
              </ul>
              <a
                href={getWhatsAppListingUrl(selectedCity, "6 Months Growth")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ textAlign: "center", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
              >
                <MessageCircle size={15} /> Chat on WhatsApp to List
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST & INTEGRITY STANDARDS ── */}
      <section style={{ padding: "4rem 0", background: "#ffffff" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "650px", margin: "0 auto 3rem" }}>
            <h2 style={{ fontSize: "1.85rem", fontWeight: 800, color: "#0f172a" }}>
              Why Shivamogga Residents Trust Us
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.92rem", marginTop: "0.3rem" }}>
              We provide clean, direct local access without spam, markups, or middlemen.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            <div style={{ padding: "1.5rem", borderRadius: "8px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "6px", background: "#eff6ff", color: "#1e40af", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.85rem" }}>
                <TrendingUp size={22} />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.35rem" }}>
                Direct Contact, Zero Commissions
              </h3>
              <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.6 }}>
                You speak directly to the doctor, clinic, technician, or store owner. We never charge booking fees or take a percentage of transactions.
              </p>
            </div>

            <div style={{ padding: "1.5rem", borderRadius: "8px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "6px", background: "#ecfdf5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.85rem" }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.35rem" }}>
                Verified Physical Addresses
              </h3>
              <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.6 }}>
                Listings are vetted with physical address validation across Gandhi Bazaar, Durgigudi, Kuvempu Road, and all Shivamogga localities.
              </p>
            </div>

            <div style={{ padding: "1.5rem", borderRadius: "8px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "6px", background: "#fff7ed", color: "#ea580c", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.85rem" }}>
                <Eye size={22} />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.35rem" }}>
                Transparent Local Feedback
              </h3>
              <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.6 }}>
                Real ratings and written experiences from fellow citizens in Shivamogga, helping you make informed decisions quickly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
