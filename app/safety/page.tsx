import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Safety | Snapsy",
  description: "Learn how Snapsy keeps customers and partners safe. Our verification, rating and safety systems explained.",
};

const safeguards = [
  {
    icon: "🪪",
    title: "Government ID Verification",
    desc: "Every helper completes government ID verification before they can accept any task on Snapsy.",
  },
  {
    icon: "🔍",
    title: "Background Screening",
    desc: "We conduct background checks on all partner helpers through a certified third-party provider.",
  },
  {
    icon: "⭐",
    title: "Rating & Review System",
    desc: "Every completed task is rated by customers. Low-rated helpers are immediately reviewed and suspended if needed.",
  },
  {
    icon: "📍",
    title: "Real-time Tracking",
    desc: "Track your helper's location in real time from the moment they're assigned until the task is complete.",
  },
  {
    icon: "🆘",
    title: "Emergency SOS",
    desc: "Both customers and helpers have access to an in-app SOS button that alerts our safety team instantly.",
  },
  {
    icon: "🛡️",
    title: "Task Insurance",
    desc: "All tasks are covered under Snapsy's task insurance, protecting you against accidental damage during service.",
  },
];

export default function SafetyPage() {
  return (
    <div className="page-wrapper">
      <section className="about-hero">
        <div className="container">
          <div className="badge-made-india" style={{ marginBottom: "1.5rem" }}>
            <span>Safety First</span>
          </div>
          <h1 className="page-title">
            Your safety is our<br />
            <span className="highlight">highest priority.</span>
          </h1>
          <p className="page-subtitle" style={{ maxWidth: "560px", marginTop: "1.25rem" }}>
            Every Snapsy interaction is built on a foundation of trust, verification, and accountability. Here&apos;s exactly how we keep you safe.
          </p>
        </div>
      </section>

      <section className="about-section" style={{ paddingBottom: "5rem" }}>
        <div className="container">
          <div className="about-values-grid">
            {safeguards.map((s) => (
              <div key={s.title} className="about-value-card">
                <div className="about-value-icon">{s.icon}</div>
                <div className="about-value-title">{s.title}</div>
                <p className="about-value-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section" style={{ background: "var(--white)", padding: "5rem 0" }}>
        <div className="container">
          <div className="about-two-col">
            <div className="about-col-text">
              <div className="section-tag">Our Commitment</div>
              <h2 className="about-heading">We take incidents seriously</h2>
              <p className="about-body">
                Any safety incident reported on our platform is reviewed by our dedicated safety team within 2 hours. Helpers involved in verified incidents are immediately suspended pending investigation.
              </p>
              <p className="about-body">
                We have a zero-tolerance policy for harassment, abuse, or misconduct — for both customers and helpers.
              </p>
              <a href="mailto:safety@snapsy.co.in" className="btn-cta-primary" style={{ marginTop: "1.5rem", display: "inline-flex" }}>
                Report a Safety Issue
              </a>
            </div>
            <div className="about-col-visual">
              <div className="about-visual-card">
                <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🛡️</div>
                <div style={{ fontWeight: 900, fontSize: "1.125rem", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>24/7 Safety Support</div>
                <div style={{ color: "var(--muted)", fontSize: "0.875rem", fontWeight: 500, lineHeight: 1.65 }}>
                  Our safety team is available around the clock. Reach us anytime at{" "}
                  <a href="mailto:safety@snapsy.co.in" style={{ color: "var(--primary)", fontWeight: 700 }}>safety@snapsy.co.in</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
