import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Shivamogga Services",
  description: "Terms and conditions governing the use of Shivamogga Services local directory.",
};

const sections = [
  {
    title: "Acceptance of Terms",
    content: "By accessing or utilizing the Shivamogga Services directory website, mobile interfaces, or merchant services, you agree to comply with and be bound by these Terms of Service. If you do not accept these terms, please do not use the directory.",
  },
  {
    title: "Nature of Directory Services",
    content: "Shivamogga Services is an independent local search and business information directory. We facilitate direct contact between residents and independent merchants, clinics, healthcare centers, restaurants, and repair technicians. Shivamogga Services is not an employer, partner, or agent of the listed service providers.",
  },
  {
    title: "Merchant Listing Responsibilities",
    content: "Merchants registering listings guarantee that all submitted contact numbers, addresses, license details, and claims are accurate, truthful, and represent an authentic physical establishment in Shivamogga district. Fraudulent representations or impersonation will lead to immediate listing termination without refund.",
  },
  {
    title: "Direct Customer-Merchant Transactions",
    content: "All agreements, quotes, guarantees, and payments for goods or services arranged through listings found on Shivamogga Services are solely between the consumer and the service provider. Shivamogga Services does not intermediate payments, charge transaction commissions, or act as an escrow agent.",
  },
  {
    title: "Reviews and Community Guidelines",
    content: "Users submitting customer reviews agree that their statements are truthful, based on genuine interactions, and free from defamatory, profane, or malicious content. We reserve the right to remove non-compliant reviews.",
  },
  {
    title: "Governing Law and Dispute Resolution",
    content: "These terms are governed by the laws of India. Any legal dispute or proceeding arising out of the use of this directory shall be submitted to the exclusive jurisdiction of the courts located in Shivamogga, Karnataka, India.",
  },
];

export default function TermsPage() {
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: "5rem" }}>
      <section style={{ background: "#0f2942", color: "#ffffff", padding: "3.5rem 0", borderBottom: "1px solid #1e3a5f" }}>
        <div className="container" style={{ maxWidth: "860px", textAlign: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "#fdba74", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            USER AGREEMENT
          </span>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginTop: "0.4rem", color: "#ffffff" }}>
            Terms of Service
          </h1>
          <p style={{ color: "#cbd5e1", fontSize: "0.95rem", marginTop: "0.5rem" }}>
            Last revised: October 2026 • Governing Shivamogga Services
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
