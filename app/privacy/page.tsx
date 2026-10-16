import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Snapsy",
  description: "Read Snapsy's privacy policy. Learn how we collect, use and protect your personal information.",
};

const sections = [
  {
    title: "Information We Collect",
    content: `We collect information you provide when creating an account, booking services, or contacting us. This includes your name, phone number, email address, and location. We also collect usage data to improve our platform — such as pages visited, features used, and app performance metrics.`,
  },
  {
    title: "How We Use Your Information",
    content: `Your information is used to provide and improve our services, match you with verified helpers, process payments, send service updates and notifications, and respond to support queries. We never sell your personal data to third parties.`,
  },
  {
    title: "Data Sharing",
    content: `We share your information only with helpers assigned to your tasks (name and general area only), payment processors for transaction handling, and legal authorities when required by law. All sharing is done under strict data protection agreements.`,
  },
  {
    title: "Data Security",
    content: `We use industry-standard encryption (TLS/SSL) for all data in transit and at rest. Access to customer data is strictly limited to authorised Snapsy employees on a need-to-know basis. We conduct regular security audits and vulnerability assessments.`,
  },
  {
    title: "Your Rights",
    content: `You have the right to access, correct, or delete your personal data at any time. You can export your data, withdraw consent for marketing communications, and request account deletion. Contact hello@snapsy.co.in to exercise any of these rights.`,
  },
  {
    title: "Cookies",
    content: `We use cookies to maintain session state, remember your preferences, and analyse site performance. You can control cookies through your browser settings. Disabling cookies may limit some features of our platform.`,
  },
  {
    title: "Changes to This Policy",
    content: `We may update this privacy policy from time to time. When we make significant changes, we will notify you via email or in-app notification at least 7 days before the changes take effect.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="page-wrapper">
      <section className="legal-hero">
        <div className="container">
          <div className="badge-made-india" style={{ marginBottom: "1.5rem" }}>
            <span>Legal</span>
          </div>
          <h1 className="page-title">Privacy Policy</h1>
          <p className="page-subtitle" style={{ marginTop: "1rem" }}>
            Last updated: <strong>October 2026</strong>
          </p>
          <p className="page-subtitle" style={{ maxWidth: "560px", marginTop: "0.5rem" }}>
            We believe privacy is a right, not a privilege. Here&apos;s exactly how we handle your data.
          </p>
        </div>
      </section>

      <section className="legal-content-section">
        <div className="container">
          <div className="legal-layout">
            {/* Table of Contents */}
            <aside className="legal-toc">
              <div className="legal-toc-title">Contents</div>
              <ul className="legal-toc-list">
                {sections.map((s, i) => (
                  <li key={s.title}>
                    <a href={`#section-${i}`} className="legal-toc-link">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: "2rem", padding: "1.25rem", background: "var(--primary-light)", borderRadius: "1rem", border: "1px solid var(--primary-border)" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 900, color: "var(--primary)", marginBottom: "0.5rem" }}>Questions?</div>
                <a href="mailto:hello@snapsy.co.in" style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)", textDecoration: "none" }}>
                  hello@snapsy.co.in
                </a>
              </div>
            </aside>

            {/* Content */}
            <div className="legal-body">
              {sections.map((s, i) => (
                <div key={s.title} id={`section-${i}`} className="legal-section">
                  <h2 className="legal-section-title">{s.title}</h2>
                  <p className="legal-section-body">{s.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
