import type { Metadata } from "next";
import WaitlistForm from "@/components/WaitlistForm";

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

            <WaitlistForm />

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
