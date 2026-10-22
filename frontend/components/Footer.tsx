"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin, ShieldCheck, MessageCircle } from "lucide-react";
import { useCity } from "@/context/CityContext";
import { getWhatsAppListingUrl, CITIES_DATA } from "@/data/cities";

export default function Footer() {
  const pathname = usePathname();
  const { selectedCity, setSelectedCity } = useCity();
  const whatsAppListingHref = getWhatsAppListingUrl(selectedCity);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer style={{ background: "#09131e", color: "#94a3b8", paddingTop: "3.5rem", paddingBottom: "2rem", borderTop: "1px solid #1e293b" }}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.85rem" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "6px",
                  background: "#ea580c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: "1rem",
                }}
              >
                {selectedCity.charAt(0)}
              </div>
              <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "#ffffff" }}>
                {selectedCity} &amp; Karnataka Services
              </span>
            </div>
            <p style={{ fontSize: "0.85rem", lineHeight: "1.6", color: "#64748b", marginBottom: "1.1rem" }}>
              Official local business and essential services directory covering {selectedCity} and prominent Karnataka cities. Direct phone and WhatsApp connectivity to verified local merchants, clinics, and service providers.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.82rem" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: "#cbd5e1" }}>
                <MapPin size={14} color="#ea580c" /> Kuvempu Road, Shivamogga &amp; Karnataka Network
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: "#cbd5e1" }}>
                <Phone size={14} color="#ea580c" /> Direct Directory Support &amp; Enquiries
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: "#cbd5e1" }}>
                <Mail size={14} color="#ea580c" /> contact@shimogaservice.com
              </span>
            </div>
          </div>

          {/* Top Categories */}
          <div>
            <h4 style={{ color: "#ffffff", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.85rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              TOP DIRECTORIES
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem" }}>
              <Link href={`/?city=${encodeURIComponent(selectedCity)}&category=healthcare-hospitals#businesses`} style={{ color: "#94a3b8", textDecoration: "none" }}>
                Healthcare &amp; Hospitals
              </Link>
              <Link href={`/?city=${encodeURIComponent(selectedCity)}&category=restaurants-cafes#businesses`} style={{ color: "#94a3b8", textDecoration: "none" }}>
                Restaurants &amp; Dining
              </Link>
              <Link href={`/?city=${encodeURIComponent(selectedCity)}&category=home-services-repairs#businesses`} style={{ color: "#94a3b8", textDecoration: "none" }}>
                Home Repairs &amp; Cleaning
              </Link>
              <Link href={`/?city=${encodeURIComponent(selectedCity)}&category=automobile-garages#businesses`} style={{ color: "#94a3b8", textDecoration: "none" }}>
                Automobile &amp; Garages
              </Link>
              <Link href={`/?city=${encodeURIComponent(selectedCity)}&category=education-coaching#businesses`} style={{ color: "#94a3b8", textDecoration: "none" }}>
                Education &amp; Coaching
              </Link>
              <Link href={`/?city=${encodeURIComponent(selectedCity)}&category=beauty-salon-spa#businesses`} style={{ color: "#94a3b8", textDecoration: "none" }}>
                Salons &amp; Wellness Spas
              </Link>
              <Link href={`/?city=${encodeURIComponent(selectedCity)}&category=real-estate-builders#businesses`} style={{ color: "#94a3b8", textDecoration: "none" }}>
                Real Estate &amp; Contractors
              </Link>
            </div>
          </div>

          {/* Business Merchants & Onboarding via WhatsApp */}
          <div>
            <h4 style={{ color: "#ffffff", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.85rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              FOR BUSINESS OWNERS
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem" }}>
              <a
                href={whatsAppListingHref}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#fdba74", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
              >
                <MessageCircle size={14} color="#fb923c" /> List Business (via WhatsApp)
              </a>
              <Link href="/auth/login" style={{ color: "#94a3b8", textDecoration: "none" }}>
                Merchant Account Login
              </Link>
              <Link href="/dashboard" style={{ color: "#94a3b8", textDecoration: "none" }}>
                Visitor &amp; Leads Tracker
              </Link>
              <Link href="/partners" style={{ color: "#94a3b8", textDecoration: "none" }}>
                Merchant Partnership
              </Link>
              <Link href="/admin" style={{ color: "#94a3b8", textDecoration: "none" }}>
                Master Admin Portal
              </Link>
            </div>
          </div>

          {/* Multi-City Coverage Index */}
          <div>
            <h4 style={{ color: "#ffffff", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.85rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              COVERED CITIES &amp; HUBS
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
              {CITIES_DATA.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCity(c.name)}
                  style={{
                    fontSize: "0.75rem",
                    padding: "0.25rem 0.55rem",
                    background: selectedCity === c.name ? "#ea580c" : "#1e293b",
                    borderRadius: "4px",
                    color: selectedCity === c.name ? "#ffffff" : "#cbd5e1",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: selectedCity === c.name ? 700 : 500,
                  }}
                  title={`View directory for ${c.name}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid #1e293b",
            paddingTop: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            fontSize: "0.8rem",
            color: "#64748b",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ShieldCheck size={16} color="#059669" />
            <span>Verified Local Directory &amp; Business Network. All rights reserved.</span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem" }}>
            <Link href="/#about" style={{ color: "#64748b", textDecoration: "none" }}>
              About
            </Link>
            <Link href="/safety" style={{ color: "#64748b", textDecoration: "none" }}>
              Safety &amp; Trust
            </Link>
            <Link href="/partners" style={{ color: "#64748b", textDecoration: "none" }}>
              Partners
            </Link>
            <Link href="/careers" style={{ color: "#64748b", textDecoration: "none" }}>
              Careers
            </Link>
            <Link href="/privacy" style={{ color: "#64748b", textDecoration: "none" }}>
              Privacy Policy
            </Link>
            <Link href="/terms" style={{ color: "#64748b", textDecoration: "none" }}>
              Terms of Use
            </Link>
            <Link href="/data-deletion" style={{ color: "#64748b", textDecoration: "none" }}>
              Data Deletion
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
