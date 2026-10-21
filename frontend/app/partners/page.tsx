import type { Metadata } from "next";
import Link from "next/link";
import { Building2, TrendingUp, CheckCircle2, Phone, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Merchant Partner Network | Shivamogga Services",
  description: "Join the verified merchant network in Shivamogga. List your clinic, restaurant, repair service, or store to receive direct calls, WhatsApp leads, and Google ranking priority.",
};

const steps = [
  {
    num: "01",
    title: "Select Listing Plan",
    desc: "Choose between 1 Month Starter, 6 Months Growth, or 1 Year Elite SEO Partner according to your business needs.",
  },
  {
    num: "02",
    title: "Submit Business Information",
    desc: "Provide your practice or store name, category, physical address in Shivamogga, phone number, and WhatsApp link.",
  },
  {
    num: "03",
    title: "Verification & Activation",
    desc: "Our team verifies your physical address and working telephone. Your business receives the Verified Merchant badge.",
  },
  {
    num: "04",
    title: "Direct Customer Inquiries",
    desc: "Start receiving direct phone calls and WhatsApp inquiries from residents looking for your specific services.",
  },
];

const benefits = [
  {
    title: "Top #1 Search Ranking",
    desc: "Our priority placement ensures subscribed partners appear above competitors when citizens search in Shivamogga.",
  },
  {
    title: "100% Direct Calls & WhatsApp",
    desc: "Customers call your number directly. We take 0% commission from your sales and never interfere in customer transactions.",
  },
  {
    title: "Live Lead & Visitor Analytics",
    desc: "Access your private merchant dashboard to see real-time clicks on your phone number, WhatsApp link, and profile views.",
  },
  {
    title: "Google SEO Structured Schema",
    desc: "Every business profile includes Schema.org LocalBusiness metadata, helping your listing appear in Google search results.",
  },
  {
    title: "Direct Customer Inquiry Inbox",
    desc: "Receive structured service inquiry forms sent by local residents looking for appointments and price quotes.",
  },
  {
    title: "Dedicated Local Merchant Support",
    desc: "Need to update your working hours, add photos, or modify services? Our local team is available via direct phone and email.",
  },
];

export default function PartnersPage() {
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: "5rem" }}>
      {/* ── Hero ── */}
      <section style={{ background: "#0f2942", color: "#ffffff", padding: "4rem 0", borderBottom: "1px solid #1e3a5f" }}>
        <div className="container" style={{ maxWidth: "860px", textAlign: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "#fdba74", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            MERCHANT PARTNERSHIP PROGRAM
          </span>
          <h1 style={{ fontSize: "2.3rem", fontWeight: 800, marginTop: "0.5rem", color: "#ffffff" }}>
            Grow Your Local Business in Shivamogga
          </h1>
          <p style={{ color: "#cbd5e1", fontSize: "1.05rem", lineHeight: 1.6, marginTop: "0.85rem" }}>
            Get verified local visibility, direct phone calls, and customer inquiries across Gandhi Bazaar, Durgigudi, Kuvempu Road, and all Shivamogga localities.
          </p>
          <div style={{ marginTop: "1.75rem", display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/auth/register-business" className="btn-primary" style={{ padding: "0.75rem 1.6rem" }}>
              Register Your Business
            </Link>
            <Link href="/#pricing" className="btn-secondary" style={{ padding: "0.75rem 1.4rem" }}>
              View Subscription Plans
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section style={{ padding: "4rem 0", background: "#ffffff", borderBottom: "1px solid #e2e8f0" }}>
        <div className="container" style={{ maxWidth: "960px" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#ea580c", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              ONBOARDING PROCESS
            </span>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a", marginTop: "0.2rem" }}>
              Get Listed in 4 Simple Steps
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
            {steps.map((s) => (
              <div key={s.num} style={{ background: "#f8fafc", padding: "1.5rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#ea580c", marginBottom: "0.5rem" }}>
                  {s.num}
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.4rem" }}>
                  {s.title}
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.6 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container" style={{ maxWidth: "960px" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#ea580c", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              COMMERCIAL ADVANTAGES
            </span>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a", marginTop: "0.2rem" }}>
              Why List with Shivamogga Services?
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {benefits.map((b, idx) => (
              <div key={idx} style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.5rem" }}>
                  <CheckCircle2 size={18} color="#059669" />
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>{b.title}</h3>
                </div>
                <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
