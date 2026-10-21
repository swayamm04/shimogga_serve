import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Phone, MapPin, Building2, TrendingUp, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Shivamogga Services",
  description: "Learn about Shivamogga Services — the independent, verified local directory and essential public services network for Shivamogga district, Karnataka.",
};

const stats = [
  { value: "11+", label: "Shivamogga Localities Covered" },
  { value: "0%", label: "Citizen Commission Fees" },
  { value: "24/7", label: "Public Helplines & Emergency Directory" },
  { value: "100%", label: "Direct Phone & WhatsApp Access" },
];

const values = [
  {
    title: "100% Direct Citizen Access",
    desc: "We believe citizens should be able to call doctors, clinics, electricians, and restaurants directly without app lock-ins, booking commissions, or middleman fees.",
  },
  {
    title: "Vetted Physical Listings",
    desc: "All featured merchants and service providers are verified with physical presence in Shivamogga, including Gandhi Bazaar, Durgigudi, Kuvempu Road, and surrounding areas.",
  },
  {
    title: "Public Emergency Integration",
    desc: "We maintain direct, one-tap public telephone directory access for McGann Teaching Hospital, City Police 112, Ambulance 108, and MESCOM 1912.",
  },
  {
    title: "Empowering Local Merchants",
    desc: "We provide local shops, technicians, and healthcare practices with professional search placement and visitor tracking to grow in the Malnad region.",
  },
];

export default function AboutPage() {
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: "5rem" }}>
      {/* ── Hero ── */}
      <section style={{ background: "#0f2942", color: "#ffffff", padding: "4rem 0", borderBottom: "1px solid #1e3a5f" }}>
        <div className="container" style={{ maxWidth: "860px", textAlign: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "#fdba74", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            ABOUT OUR PLATFORM
          </span>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 800, marginTop: "0.5rem", color: "#ffffff" }}>
            The Digital Directory for Shivamogga District
          </h1>
          <p style={{ color: "#cbd5e1", fontSize: "1.05rem", lineHeight: 1.6, marginTop: "0.85rem" }}>
            Shivamogga Services connects residents, visitors, and families with verified doctors, hospitals, restaurants, emergency services, and local tradespeople across Shivamogga, Karnataka.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "2.5rem 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", textAlign: "center" }}>
            {stats.map((s, idx) => (
              <div key={idx} style={{ padding: "1rem" }}>
                <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0f2942" }}>{s.value}</div>
                <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600, marginTop: "0.2rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission & Story ── */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container" style={{ maxWidth: "960px" }}>
          <div style={{ background: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "2.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", marginBottom: "1rem" }}>
              Our Purpose
            </h2>
            <p style={{ color: "#334155", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "1rem" }}>
              In growing tier-2 cities like Shivamogga, finding trustworthy emergency numbers, reliable specialized doctors, qualified electricians, or authentic family restaurants often relies on fragmented social media groups or outdated information.
            </p>
            <p style={{ color: "#334155", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "1rem" }}>
              Shivamogga Services was created as a clean, unified, and fast directory. We do not intermediate payments or charge commissions to citizens. Instead, we list verified telephone numbers, WhatsApp contact buttons, working hours, and physical Google Maps coordinates.
            </p>
            <p style={{ color: "#334155", fontSize: "0.95rem", lineHeight: 1.7 }}>
              Whether you need urgent emergency casualty care at McGann District Hospital, an authorized mechanic for two-wheeler breakdown, or an appointment with an orthopedist on Kuvempu Road, our directory gives you direct access instantly.
            </p>
          </div>

          {/* Core Values */}
          <div style={{ marginTop: "3rem" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.5rem", textAlign: "center" }}>
              Core Operating Standards
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {values.map((v, i) => (
                <div key={i} style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.5rem" }}>
                    <CheckCircle2 size={18} color="#059669" />
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>{v.title}</h3>
                  </div>
                  <p style={{ color: "#64748b", fontSize: "0.88rem", lineHeight: 1.6 }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Strip */}
          <div style={{ background: "#0f2942", color: "#ffffff", padding: "2.5rem", borderRadius: "8px", marginTop: "3rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Do you operate a business in Shivamogga?</h3>
              <p style={{ color: "#cbd5e1", fontSize: "0.9rem", marginTop: "0.25rem" }}>Register your practice, shop, or clinic to reach local citizens directly.</p>
            </div>
            <Link href="/auth/register-business" className="btn-primary" style={{ padding: "0.75rem 1.4rem" }}>
              Register Your Business
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
