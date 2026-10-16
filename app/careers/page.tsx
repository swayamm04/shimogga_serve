import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | Snapsy",
  description: "Join the Snapsy team and help build India's on-demand life operations platform. Open roles in engineering, operations, and growth.",
};

const roles = [
  {
    title: "Frontend Engineer",
    team: "Engineering",
    type: "Full-time · Remote",
    tags: ["React", "Next.js", "TypeScript"],
  },
  {
    title: "Operations Manager",
    team: "Operations",
    type: "Full-time · Coimbatore",
    tags: ["Logistics", "Ops", "Growth"],
  },
  {
    title: "Growth & Marketing Lead",
    team: "Growth",
    type: "Full-time · Coimbatore",
    tags: ["Marketing", "Analytics", "SEO"],
  },
  {
    title: "Customer Experience Associate",
    team: "Support",
    type: "Full-time · Coimbatore",
    tags: ["Support", "Tamil", "English"],
  },
  {
    title: "Backend Engineer",
    team: "Engineering",
    type: "Full-time · Remote",
    tags: ["Node.js", "PostgreSQL", "APIs"],
  },
  {
    title: "City Launch Lead",
    team: "Expansion",
    type: "Full-time · Field",
    tags: ["Strategy", "Growth", "Leadership"],
  },
];

const perks = [
  { icon: "🏖️", label: "Flexible time off" },
  { icon: "💻", label: "Remote-friendly" },
  { icon: "📈", label: "ESOPs from day one" },
  { icon: "🍱", label: "Meal & errand credits" },
  { icon: "🎓", label: "Learning budget" },
  { icon: "🌍", label: "Work on real impact" },
];

export default function CareersPage() {
  return (
    <div className="page-wrapper">
      {/* ── Hero ── */}
      <section className="about-hero">
        <div className="container">
          <div className="badge-made-india" style={{ marginBottom: "1.5rem" }}>
            <span>We&apos;re Hiring</span>
          </div>
          <h1 className="page-title">
            Build something that matters.<br />
            <span className="highlight">Every single day.</span>
          </h1>
          <p className="page-subtitle" style={{ maxWidth: "540px", marginTop: "1.25rem" }}>
            We&apos;re a small, fast-moving team solving real problems for real people. If you want to build India&apos;s most trusted service platform, you&apos;re in the right place.
          </p>
        </div>
      </section>

      {/* ── Perks ── */}
      <section className="about-section" style={{ paddingTop: "3rem" }}>
        <div className="container">
          <div className="careers-perks-grid">
            {perks.map((p) => (
              <div key={p.label} className="careers-perk-card">
                <span style={{ fontSize: "1.75rem" }}>{p.icon}</span>
                <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open Roles ── */}
      <section className="about-section">
        <div className="container">
          <h2 className="about-heading" style={{ marginBottom: "2rem" }}>Open Roles</h2>
          <div className="careers-roles-list">
            {roles.map((role) => (
              <div key={role.title} className="careers-role-card">
                <div className="careers-role-left">
                  <div className="careers-role-title">{role.title}</div>
                  <div className="careers-role-meta">
                    <span className="careers-role-team">{role.team}</span>
                    <span className="careers-role-dot">·</span>
                    <span>{role.type}</span>
                  </div>
                  <div className="careers-role-tags">
                    {role.tags.map((t) => (
                      <span key={t} className="careers-role-tag">{t}</span>
                    ))}
                  </div>
                </div>
                <a href={`mailto:hello@snapsy.co.in?subject=Application: ${role.title}`} className="careers-apply-btn">
                  Apply
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── No role? ── */}
      <section className="about-section">
        <div className="container">
          <div className="cta-banner">
            <div className="cta-banner-left">
              <div className="cta-banner-tag">💌 Don&apos;t see a fit?</div>
              <div className="cta-banner-title">Send us an open application</div>
              <div className="cta-banner-sub">We&apos;re always looking for exceptional people. Tell us how you&apos;d add value.</div>
            </div>
            <div className="cta-banner-actions">
              <a href="mailto:hello@snapsy.co.in?subject=Open Application" className="btn-cta-primary">Email Us</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
