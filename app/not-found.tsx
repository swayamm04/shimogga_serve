import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-wrapper">
      <section style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div className="container">
          <div style={{ maxWidth: "520px", margin: "0 auto" }}>
            {/* Big 404 */}
            <div style={{
              fontSize: "clamp(6rem, 18vw, 10rem)",
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 1,
              color: "transparent",
              WebkitTextStroke: "2px rgba(0,0,0,0.08)",
              marginBottom: "1rem",
              userSelect: "none",
            }}>
              404
            </div>

            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>

            <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "1rem", lineHeight: 1.2 }}>
              This page doesn&apos;t exist.<br />
              <span style={{ color: "var(--primary)", fontStyle: "italic" }}>Yet.</span>
            </h1>
            <p style={{ fontSize: "1rem", color: "var(--muted)", fontWeight: 500, lineHeight: 1.65, marginBottom: "2rem" }}>
              Looks like this page took the day off. Let&apos;s get you back to somewhere useful.
            </p>

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/services" className="btn-cta-primary" style={{ background: "var(--primary)", textDecoration: "none" }}>
                Browse Services
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </Link>
              <Link href="/about" className="btn-custom" style={{ borderRadius: "999px", padding: "0.875rem 1.5rem", textDecoration: "none" }}>
                About Snapsy
              </Link>
            </div>

            {/* Quick links */}
            <div style={{ marginTop: "3rem", padding: "1.5rem 2rem", background: "var(--white)", borderRadius: "1.5rem", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 900, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "1rem" }}>
                Quick links
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
                {[
                  { label: "Services", href: "/services" },
                  { label: "About", href: "/about" },
                  { label: "Careers", href: "/careers" },
                  { label: "Partners", href: "/partners" },
                  { label: "Safety", href: "/safety" },
                  { label: "Contact", href: "mailto:hello@snapsy.co.in" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    style={{
                      padding: "0.4rem 1rem",
                      borderRadius: "999px",
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      fontSize: "0.8125rem",
                      fontWeight: 700,
                      color: "var(--text)",
                      textDecoration: "none",
                      transition: "color 0.2s, background 0.2s",
                    }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "var(--primary)"; }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "var(--text)"; }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
