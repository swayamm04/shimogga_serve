import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join the Waitlist | Snapsy",
  description: "Join the Snapsy waiting list and be first to know when we launch in your area.",
};

export default function WaitlistPage() {
  return (
    <div className="page-wrapper">
      <section style={{ minHeight: "80vh", display: "flex", alignItems: "center" }}>
        <div className="container">
          <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center" }}>
            <div className="badge-made-india" style={{ marginBottom: "1.5rem", justifyContent: "center" }}>
              <span>Coming Soon</span>
            </div>
            <h1 className="page-title" id="waitlist">
              Be the first to know<br />
              <span className="highlight">when we launch.</span>
            </h1>
            <p className="page-subtitle" style={{ marginTop: "1.25rem", marginBottom: "2.5rem" }}>
              Snapsy is live in Coimbatore and expanding fast. Drop your details and we&apos;ll notify you the moment we&apos;re in your area.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "440px", margin: "0 auto" }}
            >
              <input
                type="text"
                placeholder="Your full name"
                className="search-input"
                style={{ borderRadius: "1.25rem", padding: "1rem 1.25rem" }}
              />
              <input
                type="tel"
                placeholder="Phone number (+91)"
                className="search-input"
                style={{ borderRadius: "1.25rem", padding: "1rem 1.25rem" }}
              />
              <input
                type="text"
                placeholder="Your city"
                className="search-input"
                style={{ borderRadius: "1.25rem", padding: "1rem 1.25rem" }}
              />
              <button type="submit" className="card-book-btn" style={{ borderRadius: "1.25rem", padding: "1rem", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                Join Waiting List
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </button>
            </form>

            <p style={{ marginTop: "1.25rem", fontSize: "0.8125rem", color: "var(--muted)", fontWeight: 600 }}>
              Already live in Coimbatore ·{" "}
              <a href="/services" style={{ color: "var(--primary)", fontWeight: 700, textDecoration: "none" }}>
                Book a service now →
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
