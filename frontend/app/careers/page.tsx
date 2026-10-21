import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, MapPin, CheckCircle2, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers | Shivamogga Services",
  description: "Work with Shivamogga Services. Opportunities in local merchant operations, field verification, and regional digital growth.",
};

const openRoles = [
  {
    title: "Field Verification Executive",
    department: "Operations",
    location: "Shivamogga City (Gandhi Bazaar / Kuvempu Road)",
    type: "Full-Time",
    desc: "Conduct physical location verifications, store visits, and onboarding for local merchants, clinics, and service providers across Shivamogga.",
  },
  {
    title: "Regional Merchant Growth Associate",
    department: "Business Development",
    location: "Shivamogga & Bhadravathi",
    type: "Full-Time",
    desc: "Introduce local shop owners, restaurants, and medical practices to digital search ranking and managed directory listings.",
  },
  {
    title: "Digital SEO & Content Specialist",
    department: "Marketing",
    location: "Shivamogga / Hybrid",
    type: "Full-Time",
    desc: "Optimize local search schemas, Google Business listings synchronization, and category metadata for regional discovery.",
  },
];

export default function CareersPage() {
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: "5rem" }}>
      <section style={{ background: "#0f2942", color: "#ffffff", padding: "4rem 0", borderBottom: "1px solid #1e3a5f" }}>
        <div className="container" style={{ maxWidth: "860px", textAlign: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "#fdba74", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            JOIN OUR TEAM
          </span>
          <h1 style={{ fontSize: "2.3rem", fontWeight: 800, marginTop: "0.5rem", color: "#ffffff" }}>
            Work with Shivamogga Services
          </h1>
          <p style={{ color: "#cbd5e1", fontSize: "1.05rem", lineHeight: 1.6, marginTop: "0.85rem" }}>
            Help build the leading local digital infrastructure and verified merchant network for Shivamogga district.
          </p>
        </div>
      </section>

      <section style={{ padding: "4rem 0" }}>
        <div className="container" style={{ maxWidth: "860px" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.5rem" }}>
            Current Openings in Shivamogga
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {openRoles.map((role, idx) => (
              <div
                key={idx}
                style={{
                  background: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  padding: "1.5rem",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#ea580c", textTransform: "uppercase" }}>
                      {role.department} • {role.type}
                    </span>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#0f172a", marginTop: "0.2rem" }}>
                      {role.title}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#64748b", fontSize: "0.82rem", marginTop: "0.25rem" }}>
                      <MapPin size={14} color="#ea580c" />
                      <span>{role.location}</span>
                    </div>
                  </div>

                  <a
                    href="mailto:careers@shimogaservice.com"
                    className="btn-primary"
                    style={{ fontSize: "0.82rem", padding: "0.45rem 0.9rem" }}
                  >
                    Apply via Email
                  </a>
                </div>

                <p style={{ color: "#475569", fontSize: "0.88rem", lineHeight: 1.6, marginTop: "0.85rem" }}>
                  {role.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "1.5rem", borderRadius: "8px", marginTop: "2.5rem", textAlign: "center" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1e3a8a", marginBottom: "0.35rem" }}>
              Don&apos;t see a matching position?
            </h3>
            <p style={{ color: "#1e40af", fontSize: "0.88rem" }}>
              Send your resume and a brief description of how you can contribute to <a href="mailto:careers@shimogaservice.com" style={{ color: "#1e40af", fontWeight: 700 }}>careers@shimogaservice.com</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
