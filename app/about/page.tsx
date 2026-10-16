import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Snapsy",
  description: "Learn about Snapsy — India's on-demand life operations platform. Verified helpers at your door in under 15 minutes, from ₹49.",
};

const stats = [
  { value: "15 min", label: "Avg. arrival time" },
  { value: "₹49", label: "Starting price" },
  { value: "500+", label: "Verified helpers" },
  { value: "4.9★", label: "Avg. rating" },
];

const values = [
  {
    icon: "⚡",
    title: "Speed is respect",
    desc: "Your time is precious. We obsess over response times so you never wait more than you have to.",
  },
  {
    icon: "🛡️",
    title: "Trust by design",
    desc: "Every helper is background-verified, trained and rated by real customers before they serve you.",
  },
  {
    icon: "💡",
    title: "Human-first",
    desc: "We believe real humans, not robots, solve the messy complexity of everyday life.",
  },
  {
    icon: "🌱",
    title: "Community income",
    desc: "We create flexible, dignified earning opportunities for local helpers in every neighbourhood we enter.",
  },
];

export default function AboutPage() {
  return (
    <div className="page-wrapper">
      {/* ── Hero ── */}
      <section className="about-hero">
        <div className="container">
          <div className="badge-made-india" style={{ marginBottom: "1.5rem" }}>
            <span>Our Story</span>
          </div>
          <h1 className="page-title" style={{ maxWidth: "700px" }}>
            We handle life&apos;s tasks.<br />
            <span className="highlight">So you don&apos;t have to.</span>
          </h1>
          <p className="page-subtitle" style={{ maxWidth: "560px", marginTop: "1.25rem" }}>
            Snapsy is India&apos;s on-demand life operations platform — built to give urban Indians their time back by connecting them with trusted local helpers for any task, any time.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="about-stats-section">
        <div className="container">
          <div className="about-stats-grid">
            {stats.map((s) => (
              <div key={s.label} className="about-stat-card">
                <div className="about-stat-value">{s.value}</div>
                <div className="about-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="about-section">
        <div className="container">
          <div className="about-two-col">
            <div className="about-col-text">
              <div className="section-tag">Our Mission</div>
              <h2 className="about-heading">
                Building the infrastructure for urban life
              </h2>
              <p className="about-body">
                We started Snapsy in Coimbatore with a simple observation: people waste hours every week on errands, queues, and chores that could be handled by a trusted neighbour. We built the platform to make that possible — reliably, affordably, and fast.
              </p>
              <p className="about-body">
                From dishwashing to hospital queue-standing, we handle the full spectrum of everyday tasks so our customers can focus on what matters most to them.
              </p>
            </div>
            <div className="about-col-visual">
              <div className="about-visual-card">
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🚀</div>
                <div style={{ fontWeight: 900, fontSize: "1.25rem", letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>Founded in 2026</div>
                <div style={{ color: "var(--muted)", fontWeight: 500, fontSize: "0.9rem", lineHeight: 1.6 }}>
                  Born in Coimbatore, Tamil Nadu. Recognised by DPIIT. Built for urban India.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="about-section" style={{ background: "var(--white)", padding: "5rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-tag" style={{ display: "inline-flex" }}>Our Values</div>
            <h2 className="about-heading" style={{ marginTop: "0.75rem" }}>What drives us every day</h2>
          </div>
          <div className="about-values-grid">
            {values.map((v) => (
              <div key={v.title} className="about-value-card">
                <div className="about-value-icon">{v.icon}</div>
                <div className="about-value-title">{v.title}</div>
                <p className="about-value-desc">{v.desc}</p>
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
              <div className="cta-banner-tag">⚡ Join the movement</div>
              <div className="cta-banner-title">Ready to get your time back?</div>
              <div className="cta-banner-sub">Book your first service in under 60 seconds.</div>
            </div>
            <div className="cta-banner-actions">
              <a href="/services" className="btn-cta-primary">Browse Services</a>
              <a href="/careers" className="btn-cta-secondary">Join Our Team</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
