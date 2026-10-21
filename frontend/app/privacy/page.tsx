import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Shivamogga Services",
  description: "Privacy policy for Shivamogga Services. How we collect, store, and protect user and merchant information.",
};

const sections = [
  {
    title: "Information We Collect",
    content: "We collect information you provide directly to us when creating a merchant listing, submitting customer inquiries, writing reviews, or contacting support. This includes business representative names, business names, telephone numbers, email addresses, and physical addresses in Shivamogga. For visitors using public search, we track aggregate metrics such as search counts, locality filters, and click-to-call events to compile performance analytics for directory merchants.",
  },
  {
    title: "How We Use Directory Information",
    content: "Merchant listings, public business contact details, working hours, and physical addresses are displayed publicly on the directory for the explicit purpose of connecting consumers with service providers. Customer lead inquiry submissions are forwarded directly to the designated merchant.",
  },
  {
    title: "No Sale of Personal Data",
    content: "Shivamogga Services never sells, leases, or trades consumer phone numbers or merchant personal contact information to third-party telemarketers or advertisers.",
  },
  {
    title: "Security and Data Protection",
    content: "We implement standard industry security controls, encrypted HTTPS connections, and authenticated access barriers for the merchant dashboard and administrative controls.",
  },
  {
    title: "Merchant Rights & Listing Removal",
    content: "Business owners in Shivamogga may at any time request updates to their profile details, phone numbers, or request full delisting of their business by contacting contact@shimogaservice.com or accessing their account dashboard.",
  },
  {
    title: "Jurisdiction & Governing Law",
    content: "This Privacy Policy and all matters related to the platform are governed by the laws of India, under the jurisdiction of the competent courts of Shivamogga, Karnataka.",
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: "5rem" }}>
      <section style={{ background: "#0f2942", color: "#ffffff", padding: "3.5rem 0", borderBottom: "1px solid #1e3a5f" }}>
        <div className="container" style={{ maxWidth: "860px", textAlign: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "#fdba74", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            LEGAL POLICIES
          </span>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginTop: "0.4rem", color: "#ffffff" }}>
            Privacy Policy
          </h1>
          <p style={{ color: "#cbd5e1", fontSize: "0.95rem", marginTop: "0.5rem" }}>
            Last revised: October 2026 • Applicable to Shivamogga Services
          </p>
        </div>
      </section>

      <section style={{ padding: "3.5rem 0" }}>
        <div className="container" style={{ maxWidth: "860px" }}>
          <div style={{ background: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "2.5rem" }}>
            {sections.map((sec, idx) => (
              <div key={idx} style={{ marginBottom: idx === sections.length - 1 ? 0 : "2rem" }}>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>
                  {idx + 1}. {sec.title}
                </h2>
                <p style={{ color: "#475569", fontSize: "0.9rem", lineHeight: 1.65 }}>
                  {sec.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
