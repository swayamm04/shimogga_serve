import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Partner | Snapsy",
  description: "Join Snapsy as a partner helper. Earn on your schedule in Coimbatore by handling cleaning, errands, grocery runs and more. Get paid same day.",
};

const steps = [
  {
    num: "01",
    title: "Download the Partner App",
    desc: "Get the Snapsy Partner app on Android. Sign up takes less than 5 minutes.",
    icon: "📱",
  },
  {
    num: "02",
    title: "Complete Verification",
    desc: "Submit your ID and complete a short background check. We verify everyone for safety.",
    icon: "✅",
  },
  {
    num: "03",
    title: "Set Your Hours",
    desc: "Work whenever you want. Morning, evening, weekends — you decide your schedule.",
    icon: "🕐",
  },
  {
    num: "04",
    title: "Start Earning",
    desc: "Accept tasks near you and get paid the same day. No waiting, no delays.",
    icon: "💸",
  },
];

const benefits = [
  { icon: "🗓️", title: "Flexible schedule", desc: "Work on your own terms. No fixed hours, no commitments." },
  { icon: "⚡", title: "Same-day pay", desc: "Your earnings transferred the same day, every day." },
  { icon: "📍", title: "Work near home", desc: "We match you with tasks in your own neighbourhood." },
  { icon: "🌟", title: "Build your rating", desc: "Top-rated partners unlock more tasks and higher pay." },
  { icon: "🛡️", title: "Insured & supported", desc: "Every partner is covered and backed by our support team." },
  { icon: "📈", title: "Grow with us", desc: "As Snapsy expands, our partners grow with us into leadership roles." },
];

export default function PartnersPage() {
  return (
    <div className="page-wrapper">
      {/* ── Hero ── */}
      <section className="about-hero">
        <div className="container">
          <div className="badge-made-india" style={{ marginBottom: "1.5rem" }}>
            <span>Become a Partner</span>
          </div>
          <h1 className="page-title">
            Earn on your schedule.<br />
            <span className="highlight">Be your own boss.</span>
          </h1>
          <p className="page-subtitle" style={{ maxWidth: "560px", marginTop: "1.25rem" }}>
            Join hundreds of verified Snapsy helpers earning flexible income in Coimbatore. Handle tasks in your neighbourhood and get paid the same day.
          </p>
          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
            <a href="https://play.google.com/store/apps/details?id=com.snapsy.partner" target="_blank" rel="noopener noreferrer" className="btn-cta-primary" style={{ background: "var(--primary)" }}>
              Download Partner App
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </a>
            <a href="mailto:hello@snapsy.co.in" className="btn-custom" style={{ padding: "0.875rem 1.75rem", borderRadius: "999px" }}>
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="about-section" style={{ background: "var(--white)", padding: "5rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-tag" style={{ display: "inline-flex" }}>How It Works</div>
            <h2 className="about-heading" style={{ marginTop: "0.75rem" }}>Start earning in 4 steps</h2>
          </div>
          <div className="partners-steps-grid">
            {steps.map((s) => (
              <div key={s.num} className="partners-step-card">
                <div className="partners-step-num">{s.num}</div>
                <div style={{ fontSize: "2.25rem", margin: "1rem 0 0.75rem" }}>{s.icon}</div>
                <div className="partners-step-title">{s.title}</div>
                <p className="partners-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="about-section" style={{ padding: "5rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-tag" style={{ display: "inline-flex" }}>Why Snapsy</div>
            <h2 className="about-heading" style={{ marginTop: "0.75rem" }}>Partner benefits</h2>
          </div>
          <div className="about-values-grid">
            {benefits.map((b) => (
              <div key={b.title} className="about-value-card">
                <div className="about-value-icon">{b.icon}</div>
                <div className="about-value-title">{b.title}</div>
                <p className="about-value-desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-section">
        <div className="container">
          <div className="cta-banner">
            <div className="cta-banner-left">
              <div className="cta-banner-tag">🚀 Ready to start?</div>
              <div className="cta-banner-title">Join 500+ partners earning with Snapsy</div>
              <div className="cta-banner-sub">Download the partner app and be verified in under 24 hours.</div>
            </div>
            <div className="cta-banner-actions">
              <a href="https://play.google.com/store/apps/details?id=com.snapsy.partner" target="_blank" rel="noopener noreferrer" className="btn-cta-primary">
                Download App
              </a>
              <a href="/about" className="btn-cta-secondary">Learn More</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
