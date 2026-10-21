import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Phone, CheckCircle2, AlertCircle, MapPin, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "Safety & Verification Standards | Shivamogga Services",
  description: "Learn how Shivamogga Services verifies local merchants, ensures physical presence in Shivamogga, and protects consumer integrity.",
};

const safetyStandards = [
  {
    title: "Physical Location Verification",
    desc: "Every featured merchant listing is verified with an authentic physical address within Shivamogga (Gandhi Bazaar, Durgigudi, Kuvempu Road, Vinoba Nagara, etc.) to prevent ghost listings or remote scammers.",
  },
  {
    title: "Direct Phone & Identity Validation",
    desc: "We verify the active working telephone number and representative details of merchants before awarding the Verified Merchant status.",
  },
  {
    title: "Emergency Services Direct Access",
    desc: "Public emergency lines for District Hospital casualty, City Police Control, Fire Emergency, and MESCOM are monitored and validated for 24/7 direct dial connectivity.",
  },
  {
    title: "Transparent Resident Feedback",
    desc: "Reviews are subject to moderation to eliminate automated spam and fake reviews. Citizens can post genuine feedback regarding punctuality, billing, and work quality.",
  },
  {
    title: "Zero Commission or Payment Interference",
    desc: "We never ask customers for bank transfers or credit card payments on behalf of local merchants. All payments are settled directly between you and the service provider upon service delivery.",
  },
  {
    title: "Merchant Disqualification Policy",
    desc: "Businesses that receive verified reports of fraudulent pricing, non-delivery of service, or illegal practice are permanently delisted from our Shivamogga directory.",
  },
];

export default function SafetyPage() {
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: "5rem" }}>
      {/* ── Hero ── */}
      <section style={{ background: "#0f2942", color: "#ffffff", padding: "4rem 0", borderBottom: "1px solid #1e3a5f" }}>
        <div className="container" style={{ maxWidth: "860px", textAlign: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "#fdba74", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            CONSUMER PROTECTION &amp; TRUST
          </span>
          <h1 style={{ fontSize: "2.3rem", fontWeight: 800, marginTop: "0.5rem", color: "#ffffff" }}>
            Verification &amp; Safety Standards
          </h1>
          <p style={{ color: "#cbd5e1", fontSize: "1.05rem", lineHeight: 1.6, marginTop: "0.85rem" }}>
            How Shivamogga Services verifies local merchants, audits public emergency contacts, and safeguards citizen trust.
          </p>
        </div>
      </section>

      {/* ── Content Grid ── */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container" style={{ maxWidth: "960px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
              marginBottom: "3rem",
            }}
          >
            {safetyStandards.map((item, idx) => (
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
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
                  <ShieldCheck size={20} color="#059669" />
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>
                    {item.title}
                  </h3>
                </div>
                <p style={{ color: "#475569", fontSize: "0.88rem", lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Citizen Tips Notice */}
          <div
            style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "8px",
              padding: "1.75rem",
              display: "flex",
              gap: "1rem",
              alignItems: "flex-start",
            }}
          >
            <AlertCircle size={24} color="#1e40af" style={{ flexShrink: 0, marginTop: "0.15rem" }} />
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1e3a8a", marginBottom: "0.35rem" }}>
                Consumer Safety Recommendation
              </h3>
              <p style={{ color: "#1e40af", fontSize: "0.9rem", lineHeight: 1.6 }}>
                For home services (plumbers, electricians, appliance technicians), always request an upfront cost estimate prior to beginning work. For medical procedures, consult licensed physicians and visit registered clinics in Shivamogga.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
