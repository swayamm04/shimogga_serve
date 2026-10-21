import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Merchant & User Data Deletion | Shivamogga Services",
  description: "Request deletion of your merchant listing, customer account, or personal data from Shivamogga Services.",
};

export default function DataDeletionPage() {
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: "5rem" }}>
      <section style={{ background: "#0f2942", color: "#ffffff", padding: "3.5rem 0", borderBottom: "1px solid #1e3a5f" }}>
        <div className="container" style={{ maxWidth: "860px", textAlign: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "#fdba74", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            PRIVACY &amp; DATA RIGHTS
          </span>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginTop: "0.4rem", color: "#ffffff" }}>
            Data Deletion &amp; Listing Removal
          </h1>
          <p style={{ color: "#cbd5e1", fontSize: "0.95rem", marginTop: "0.5rem" }}>
            Merchants and citizens have the right to request full removal of their profiles and personal records.
          </p>
        </div>
      </section>

      <section style={{ padding: "3.5rem 0" }}>
        <div className="container" style={{ maxWidth: "780px" }}>
          <div style={{ background: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "2rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.75rem" }}>
              How to Request Deletion
            </h2>
            <p style={{ color: "#475569", fontSize: "0.9rem", lineHeight: 1.65, marginBottom: "1.25rem" }}>
              To permanently remove your merchant listing, reviews, or user account from the directory, please send an email from your registered email address to:
            </p>
            <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "#0f172a", fontWeight: 700 }}>
              <Mail size={18} color="#ea580c" />
              <span>privacy@shimogaservice.com</span>
            </div>
            <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.6, marginTop: "1rem" }}>
              Include your Business Name, Registered Phone Number, and reason for removal. Deletion requests are processed within 5 business days, and public search index cache will be cleared immediately.
            </p>
          </div>

          <div style={{ background: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "2rem" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.75rem" }}>
              What Is Removed Upon Deletion
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.88rem", color: "#334155" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <CheckCircle2 size={16} color="#059669" />
                <span>Public merchant listing and directory search indexing</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <CheckCircle2 size={16} color="#059669" />
                <span>Telephone and WhatsApp contact links</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <CheckCircle2 size={16} color="#059669" />
                <span>Photo gallery images and facility descriptions</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <CheckCircle2 size={16} color="#059669" />
                <span>User account credentials and login sessions</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
