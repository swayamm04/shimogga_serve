import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Deletion | Snapsy",
  description: "Request deletion of your Snapsy account and personal data. We process all requests within 30 days.",
};

export default function DataDeletionPage() {
  return (
    <div className="page-wrapper">
      <section className="legal-hero">
        <div className="container">
          <div className="badge-made-india" style={{ marginBottom: "1.5rem" }}>
            <span>Your Rights</span>
          </div>
          <h1 className="page-title">Data Deletion Request</h1>
          <p className="page-subtitle" style={{ maxWidth: "560px", marginTop: "1rem" }}>
            You have the right to request deletion of your account and all associated personal data. We process all requests within 30 days.
          </p>
        </div>
      </section>

      <section className="legal-content-section" style={{ paddingBottom: "5rem" }}>
        <div className="container">
          <div style={{ maxWidth: "720px", margin: "0 auto" }}>

            {/* What gets deleted */}
            <div className="data-deletion-card">
              <h2 className="legal-section-title">What gets deleted</h2>
              <div className="data-deletion-items">
                {[
                  { icon: "👤", label: "Account profile and personal info" },
                  { icon: "📍", label: "Saved addresses and location history" },
                  { icon: "📋", label: "Order and task history" },
                  { icon: "💬", label: "Support conversation history" },
                  { icon: "🔔", label: "Notification preferences" },
                  { icon: "💳", label: "Saved payment methods" },
                ].map((item) => (
                  <div key={item.label} className="data-deletion-item">
                    <span className="data-deletion-item-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What we retain */}
            <div className="data-deletion-card" style={{ background: "rgba(255,107,0,0.04)", border: "1px solid var(--primary-border)" }}>
              <h2 className="legal-section-title">What we retain (legally required)</h2>
              <p className="legal-section-body" style={{ marginBottom: "1rem" }}>
                Certain records must be retained as required by Indian law (GST, financial regulations, legal disputes):
              </p>
              <div className="data-deletion-items">
                {[
                  { icon: "🧾", label: "Transaction records — 7 years (GST compliance)" },
                  { icon: "⚖️", label: "Dispute-related data — until resolution" },
                  { icon: "🛡️", label: "Safety incident records — 3 years" },
                ].map((item) => (
                  <div key={item.label} className="data-deletion-item">
                    <span className="data-deletion-item-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How to request */}
            <div className="data-deletion-card">
              <h2 className="legal-section-title">How to request deletion</h2>
              <p className="legal-section-body">
                Send an email from your registered email address with the subject line <strong>&ldquo;Data Deletion Request&rdquo;</strong>. Include your registered phone number so we can verify your identity.
              </p>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
                <a
                  href="mailto:hello@snapsy.co.in?subject=Data Deletion Request"
                  className="btn-cta-primary"
                  style={{ background: "var(--primary)" }}
                >
                  Send Request Email
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/>
                    <path d="m21.854 2.147-10.94 10.939"/>
                  </svg>
                </a>
              </div>
              <div style={{ marginTop: "1.5rem", padding: "1rem 1.25rem", background: "var(--bg)", borderRadius: "1rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--muted)", lineHeight: 1.65 }}>
                ⏱️ We will confirm receipt within <strong>48 hours</strong> and complete deletion within <strong>30 days</strong> of identity verification.
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
