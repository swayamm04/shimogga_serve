import type { Metadata } from "next";
import WaitlistForm from "@/components/WaitlistForm";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Taluk Expansion Registry | Shivamogga Services",
  description: "Request verified local directory coverage for Bhadravathi, Sagar, Thirthahalli, Shikaripura, and surrounding taluks in Shivamogga district.",
};

export default function WaitlistPage() {
  return (
    <div style={{ background: "#f8fafc", minHeight: "85vh", padding: "4rem 1.5rem" }}>
      <div className="container" style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center" }}>
        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#ea580c", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          REGIONAL COVERAGE EXPANSION
        </span>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", marginTop: "0.35rem", marginBottom: "0.85rem" }}>
          Expanding Across Shivamogga District
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "2rem" }}>
          Shivamogga Services is actively verified across Shivamogga City and expanding to Bhadravathi, Sagar, and Thirthahalli. Register your taluk to be notified first or request coverage.
        </p>

        <WaitlistForm />

        <div style={{ marginTop: "2rem", fontSize: "0.85rem", color: "#64748b" }}>
          Already in Shivamogga City?{" "}
          <Link href="/services" style={{ color: "#ea580c", fontWeight: 700, textDecoration: "none" }}>
            Explore active directory listings &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
