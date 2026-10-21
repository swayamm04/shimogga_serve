"use client";

import Link from "next/link";
import { Search, ArrowRight, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div style={{ background: "#f8fafc", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: "500px", width: "100%", textAlign: "center" }}>
        <div
          style={{
            fontSize: "5.5rem",
            fontWeight: 800,
            lineHeight: 1,
            color: "#0f2942",
            marginBottom: "0.5rem",
          }}
        >
          404
        </div>

        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.75rem" }}>
          Page Not Found
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "2rem" }}>
          The business, category, or directory page you are looking for does not exist or may have been updated.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem" }}>
          <Link href="/services" className="btn-primary" style={{ padding: "0.65rem 1.25rem" }}>
            <Search size={15} /> Search Directory
          </Link>
          <Link href="/" className="btn-secondary" style={{ padding: "0.65rem 1.25rem" }}>
            <Home size={15} /> Home Page
          </Link>
        </div>

        <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
            Popular Shivamogga Directories
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", justifyContent: "center" }}>
            {[
              { label: "Hospitals & Doctors", href: "/services?category=healthcare-hospitals" },
              { label: "Restaurants", href: "/services?category=restaurants-cafes" },
              { label: "Home Repairs", href: "/services?category=home-services-repairs" },
              { label: "Garages", href: "/services?category=automobile-garages" },
              { label: "Public Helplines", href: "/#emergency" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="btn-secondary"
                style={{ fontSize: "0.78rem", padding: "0.3rem 0.65rem" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
