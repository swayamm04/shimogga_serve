"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Send, ShieldCheck, MapPin, Phone } from "lucide-react";

const commonRequirements = [
  "Air Conditioner Repair & Servicing",
  "Electrician / Wiring Repair",
  "Plumbing & Motor Repair",
  "House Painting & Whitewash",
  "Deep Home Cleaning",
  "Catering & Event Cooking",
  "Two-Wheeler / Car Detailing",
  "Civil Construction & Waterproofing",
];

export default function ServiceRequestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serviceRequirement, setServiceRequirement] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("Gandhi Bazaar");
  const [urgency, setUrgency] = useState("Standard (Within 24 hours)");

  const shimogaAreas = [
    "Gandhi Bazaar",
    "Durgigudi",
    "Vinoba Nagara",
    "Tilak Nagar",
    "Kuvempu Road",
    "Savanur Road",
    "Gopala",
    "Kashipura",
    "NT Road",
    "Sagar Road",
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !phone || !serviceRequirement) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ background: "#f8fafc", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem" }}>
        <div style={{ maxWidth: "520px", width: "100%", background: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "2.5rem", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#ecfdf5", color: "#059669", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
            <CheckCircle2 size={28} />
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem" }}>
            Service Requirement Broadcasted
          </h1>
          <p style={{ fontSize: "0.92rem", color: "#64748b", lineHeight: 1.6, marginBottom: "1.75rem" }}>
            Thank you, {name}. Your requirement in <b>{area}</b> has been received. Verified service providers in Shivamogga will review your request and contact you at <b>{phone}</b>.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <Link href="/services" className="btn-primary" style={{ padding: "0.65rem 1.25rem" }}>
              Browse Directory
            </Link>
            <Link href="/" className="btn-secondary" style={{ padding: "0.65rem 1.25rem" }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: "5rem" }}>
      {/* ── Hero ── */}
      <section style={{ background: "#0f2942", color: "#ffffff", padding: "3.5rem 0", borderBottom: "1px solid #1e3a5f" }}>
        <div className="container" style={{ maxWidth: "860px", textAlign: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "#fdba74", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            CITIZEN SERVICE REQUEST
          </span>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginTop: "0.4rem", color: "#ffffff" }}>
            Post a Requirement in Shivamogga
          </h1>
          <p style={{ color: "#cbd5e1", fontSize: "0.95rem", lineHeight: 1.6, marginTop: "0.5rem" }}>
            Can&apos;t find an exact match or need multiple quotes? Describe your requirement and get contacted by verified local technicians and merchants.
          </p>
        </div>
      </section>

      {/* ── Form Section ── */}
      <section style={{ padding: "3.5rem 0" }}>
        <div className="container" style={{ maxWidth: "780px" }}>
          <div style={{ background: "#ffffff", borderRadius: "8px", border: "1px solid #cbd5e1", padding: "2.25rem", boxShadow: "var(--shadow-sm)" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1.25rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.75rem" }}>
              Submit Your Requirement
            </h2>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Common Suggestions */}
              <div>
                <label className="form-label">Frequent Requirements (Click to select)</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {commonRequirements.map((req) => (
                    <button
                      type="button"
                      key={req}
                      onClick={() => setServiceRequirement(req)}
                      className="btn-secondary"
                      style={{
                        fontSize: "0.78rem",
                        padding: "0.3rem 0.65rem",
                        background: serviceRequirement === req ? "#fff7ed" : "#f8fafc",
                        borderColor: serviceRequirement === req ? "#ea580c" : "#cbd5e1",
                        color: serviceRequirement === req ? "#ea580c" : "#334155",
                        fontWeight: serviceRequirement === req ? 700 : 500,
                      }}
                    >
                      {req}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label">Describe What You Need *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Need split AC gas refilling and general cleaning at Vinoba Nagara 2nd Cross. Looking for service this Saturday."
                  value={serviceRequirement}
                  onChange={(e) => setServiceRequirement(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="form-label">Your Locality / Area *</label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="form-select"
                  >
                    {shimogaAreas.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Urgency / Timeline</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="form-select"
                  >
                    <option value="Emergency (Immediate)">Emergency (Immediate response)</option>
                    <option value="Standard (Within 24 hours)">Standard (Within 24 hours)</option>
                    <option value="Planning (This week)">Planning (This week)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Gowda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Phone Number for Callbacks *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 94481 ..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ padding: "0.85rem", fontSize: "0.95rem", marginTop: "0.5rem" }}
              >
                <Send size={15} /> Submit Service Requirement
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
