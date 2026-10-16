import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Snapsy",
  description: "Read Snapsy's terms of service. Understand your rights and responsibilities when using our platform.",
};

const sections = [
  {
    title: "Acceptance of Terms",
    content: `By accessing or using Snapsy's platform, mobile application, or any of our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. These terms apply to all users, including customers and partner helpers.`,
  },
  {
    title: "Description of Services",
    content: `Snapsy is an on-demand marketplace connecting customers with independent helper partners for household tasks, errands, grocery runs, and other services. Snapsy does not directly provide these services but facilitates connections between customers and verified independent partners.`,
  },
  {
    title: "User Accounts",
    content: `You must create an account to use Snapsy. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must be at least 18 years old to create an account. Provide accurate and complete information when registering.`,
  },
  {
    title: "Booking & Payments",
    content: `All service bookings are subject to partner availability. Prices are displayed upfront before booking and include all applicable fees. Payments are processed securely through our payment partners. Snapsy reserves the right to update pricing with 7 days' notice.`,
  },
  {
    title: "Cancellations & Refunds",
    content: `Customers may cancel a booking up to 10 minutes after confirmation for a full refund. Cancellations made after a helper has been dispatched may incur a partial fee. Refunds are processed within 3–5 business days to the original payment method.`,
  },
  {
    title: "Prohibited Conduct",
    content: `Users may not misuse the platform for illegal purposes, harass or abuse helpers or other users, attempt to circumvent our payment system, create fake accounts, or use automated tools to access our services. Violations may result in immediate account termination.`,
  },
  {
    title: "Limitation of Liability",
    content: `Snapsy's liability is limited to the amount paid for the specific service in question. We are not liable for indirect, incidental, or consequential damages. Partner helpers are independent contractors, and Snapsy is not responsible for their actions beyond our vetting and rating systems.`,
  },
  {
    title: "Governing Law",
    content: `These terms are governed by the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Coimbatore, Tamil Nadu, India. These terms constitute the entire agreement between you and Snapsy.`,
  },
];

export default function TermsPage() {
  return (
    <div className="page-wrapper">
      <section className="legal-hero">
        <div className="container">
          <div className="badge-made-india" style={{ marginBottom: "1.5rem" }}>
            <span>Legal</span>
          </div>
          <h1 className="page-title">Terms of Service</h1>
          <p className="page-subtitle" style={{ marginTop: "1rem" }}>
            Last updated: <strong>October 2026</strong>
          </p>
          <p className="page-subtitle" style={{ maxWidth: "560px", marginTop: "0.5rem" }}>
            Please read these terms carefully before using Snapsy. They govern how you may use our platform.
          </p>
        </div>
      </section>

      <section className="legal-content-section">
        <div className="container">
          <div className="legal-layout">
            <aside className="legal-toc">
              <div className="legal-toc-title">Contents</div>
              <ul className="legal-toc-list">
                {sections.map((s, i) => (
                  <li key={s.title}>
                    <a href={`#section-${i}`} className="legal-toc-link">{s.title}</a>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: "2rem", padding: "1.25rem", background: "var(--primary-light)", borderRadius: "1rem", border: "1px solid var(--primary-border)" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 900, color: "var(--primary)", marginBottom: "0.5rem" }}>Questions?</div>
                <a href="mailto:hello@snapsy.co.in" style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)", textDecoration: "none" }}>hello@snapsy.co.in</a>
              </div>
            </aside>
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
