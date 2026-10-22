"use client";

import { useState } from "react";
import Link from "next/link";
import { leadAPI, businessAPI } from "@/lib/api";
import {
  Phone,
  MessageCircle,
  MapPin,
  Globe,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Send,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";

interface BusinessDetailClientProps {
  business: any;
}

export default function BusinessDetailClient({ business }: BusinessDetailClientProps) {
  // Lead inquiry form state
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryService, setInquiryService] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquirySending, setInquirySending] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleTrackAction = (action: "call" | "whatsapp" | "website" | "directions") => {
    if (!business?._id) return;
    businessAPI.trackInteraction(business._id, action).catch(() => {});
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: business.name,
          text: `Contact ${business.name} in ${business.location?.area || "Shivamogga"}, Karnataka.`,
          url,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business?._id || !inquiryName || !inquiryPhone || !inquiryMessage) return;

    setInquirySending(true);
    try {
      const res = await leadAPI.submit({
        businessId: business._id,
        customerName: inquiryName,
        customerPhone: inquiryPhone,
        customerEmail: inquiryEmail,
        serviceNeeded: inquiryService,
        message: inquiryMessage,
      });
      if (res.success) {
        setInquirySuccess(true);
        setInquiryName("");
        setInquiryPhone("");
        setInquiryEmail("");
        setInquiryService("");
        setInquiryMessage("");
      }
    } catch (err: any) {
      alert(err.message || "Failed to send inquiry");
    } finally {
      setInquirySending(false);
    }
  };

  const cleanPhone = (business.contact?.whatsapp || business.contact?.phone || "919448100001").replace(/\D/g, "");

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: "5rem" }}>
      {/* ── Breadcrumb Bar ── */}
      <nav aria-label="Breadcrumb" style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "0.75rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "#64748b", flexWrap: "wrap" }}>
            <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>
              Home
            </Link>
            <span>/</span>
            <Link
              href={`/?city=${encodeURIComponent(business.location?.city || "Shivamogga")}&category=${business.categorySlug || "all"}#businesses`}
              style={{ color: "#64748b", textDecoration: "none" }}
            >
              {business.categoryName || "Directory"}
            </Link>
            <span>/</span>
            <span style={{ color: "#0f172a", fontWeight: 600 }}>{business.name}</span>
          </div>
        </div>
      </nav>

      {/* ── Header Banner & Profile Card ── */}
      <div className="container" style={{ marginTop: "1.5rem" }}>
        {/* Cover Photo */}
        <div
          style={{
            height: "260px",
            width: "100%",
            borderRadius: "8px",
            overflow: "hidden",
            position: "relative",
            background: "#0f2942",
          }}
        >
          <img
            src={business.media?.coverImage || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"}
            alt={`${business.name} storefront in ${business.location?.area || "Shivamogga"}`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {business.isFeatured && (
            <div
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                background: "#ea580c",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.75rem",
                padding: "0.3rem 0.75rem",
                borderRadius: "4px",
                letterSpacing: "0.03em",
              }}
            >
              FEATURED PARTNER
            </div>
          )}
        </div>

        {/* Profile Card Summary */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            boxShadow: "var(--shadow)",
            padding: "1.5rem",
            marginTop: "-40px",
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flex: "1 1 340px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "8px",
                overflow: "hidden",
                border: "2px solid #ffffff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                flexShrink: 0,
                background: "#f1f5f9",
              }}
            >
              <img
                src={business.media?.logo || "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=400&q=80"}
                alt={`${business.name} logo`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {business.categoryName}
                </span>
                {business.isVerified && (
                  <span className="badge-verified">
                    <ShieldCheck size={12} /> VERIFIED LOCAL MERCHANT
                  </span>
                )}
              </div>

              {/* Primary SEO Heading */}
              <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a", marginTop: "0.2rem", lineHeight: 1.25 }}>
                {business.name}
              </h1>

              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginTop: "0.35rem", fontSize: "0.85rem", color: "#64748b", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <MapPin size={14} color="#ea580c" />
                  <span>
                    {business.location?.area || "Shivamogga"}, {business.location?.city || "Karnataka"}
                  </span>
                </div>
                {business.location?.pincode && (
                  <>
                    <span>•</span>
                    <span>PIN: {business.location.pincode}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", alignItems: "center" }}>
            <a
              href={`tel:${business.contact?.phone || "+919448100001"}`}
              onClick={() => handleTrackAction("call")}
              className="btn-dark"
              style={{ padding: "0.65rem 1.25rem", fontSize: "0.9rem" }}
            >
              <Phone size={15} color="#38bdf8" /> Call Now
            </a>

            <a
              href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(business.name)}%2C%20I%20found%20your%20business%20listing%20online`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleTrackAction("whatsapp")}
              className="btn-primary"
              style={{ padding: "0.65rem 1.25rem", fontSize: "0.9rem", background: "#059669", borderColor: "#059669" }}
            >
              <MessageCircle size={15} /> WhatsApp
            </a>

            {business.location?.googleMapUrl && (
              <a
                href={business.location.googleMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleTrackAction("directions")}
                className="btn-secondary"
                style={{ padding: "0.65rem 1rem", fontSize: "0.85rem" }}
              >
                <MapPin size={14} color="#ea580c" /> Directions
              </a>
            )}

            {business.contact?.website && (
              <a
                href={business.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleTrackAction("website")}
                className="btn-secondary"
                style={{ padding: "0.65rem 1rem", fontSize: "0.85rem" }}
              >
                <Globe size={14} /> Website
              </a>
            )}

            <button
              onClick={handleShare}
              className="btn-secondary"
              style={{ padding: "0.65rem 0.85rem", fontSize: "0.85rem" }}
              title="Share listing"
            >
              {copiedLink ? <Check size={14} color="#059669" /> : <Share2 size={14} />}
              <span>{copiedLink ? "Link Copied!" : "Share"}</span>
            </button>
          </div>
        </div>

        {/* ── Main Layout: Details & Sidebar ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "1.75rem",
            marginTop: "1.75rem",
          }}
        >
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* About Box */}
            <section style={{ background: "#ffffff", borderRadius: "8px", padding: "1.75rem", border: "1px solid #e2e8f0" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.65rem" }}>
                About {business.name}
              </h2>
              <p style={{ color: "#334155", lineHeight: 1.7, fontSize: "0.93rem" }}>
                {business.description || business.tagline || `${business.name} is a verified business provider located in ${business.location?.area || "Shivamogga"}, Karnataka. Providing verified local services with direct phone and WhatsApp connectivity.`}
              </p>

              {/* Services Offered */}
              {business.services && business.services.length > 0 && (
                <div style={{ marginTop: "1.75rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.75rem" }}>
                    Services Offered
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {business.services.map((service: string, index: number) => (
                      <span
                        key={index}
                        style={{
                          background: "#f8fafc",
                          border: "1px solid #cbd5e1",
                          color: "#334155",
                          padding: "0.4rem 0.8rem",
                          borderRadius: "4px",
                          fontSize: "0.83rem",
                          fontWeight: 500,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                        }}
                      >
                        <CheckCircle2 size={13} color="#059669" /> {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {business.amenities && business.amenities.length > 0 && (
                <div style={{ marginTop: "1.5rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.75rem" }}>
                    Amenities &amp; Facilities
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {business.amenities.map((item: string, index: number) => (
                      <span
                        key={index}
                        style={{
                          background: "#eff6ff",
                          color: "#1e40af",
                          border: "1px solid #bfdbfe",
                          padding: "0.35rem 0.75rem",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Photo Gallery */}
            {business.media?.gallery && business.media.gallery.length > 0 && (
              <section style={{ background: "#ffffff", borderRadius: "8px", padding: "1.75rem", border: "1px solid #e2e8f0" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.85rem" }}>
                  Photos &amp; Facilities
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
                  {business.media.gallery.map((imgUrl: string, idx: number) => (
                    <div key={idx} style={{ height: "140px", borderRadius: "6px", overflow: "hidden", background: "#f1f5f9" }}>
                      <img
                        src={imgUrl}
                        alt={`${business.name} premises photo ${idx + 1}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Direct Verification Guarantee Notice */}
            <section style={{ background: "#ffffff", borderRadius: "8px", padding: "1.5rem", border: "1px solid #e2e8f0", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "6px", background: "#f0fdf4", color: "#15803d", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.25rem" }}>
                  Verified Local Listing
                </h3>
                <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.5, margin: 0 }}>
                  This business is registered with physical presence in {business.location?.area || "Shivamogga"}, Karnataka. Call or WhatsApp the owner directly for rates, appointments, and inquiries with zero middleman commission.
                </p>
              </div>
            </section>
          </div>

          {/* Right Column (Sidebar) */}
          <aside style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Direct Inquiry Form */}
            <div style={{ background: "#ffffff", borderRadius: "8px", padding: "1.5rem", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.25rem" }}>
                Send Direct Message
              </h3>
              <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "1rem" }}>
                Reach {business.name} directly for pricing, quotes, or service appointments.
              </p>

              {inquirySuccess ? (
                <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "0.95rem", borderRadius: "6px", color: "#065f46", fontSize: "0.85rem", lineHeight: 1.5 }}>
                  <b>Inquiry Submitted Successfully!</b> The business owner has received your request and will contact you directly at {inquiryPhone || "your phone number"}.
                </div>
              ) : (
                <form onSubmit={handleSendInquiry} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div>
                    <label className="form-label">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Suresh Gowda"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 94481 ..."
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      Service or Requirement
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Consultation, Rate Inquiry"
                      value={inquiryService}
                      onChange={(e) => setInquiryService(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      Message / Question *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Mention your requirements, preferred timing, or questions..."
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      className="form-textarea"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={inquirySending}
                    className="btn-primary"
                    style={{ width: "100%", marginTop: "0.35rem" }}
                  >
                    <Send size={14} /> {inquirySending ? "Sending..." : "Submit Inquiry"}
                  </button>
                </form>
              )}
            </div>

            {/* Working Hours Card */}
            <div style={{ background: "#ffffff", borderRadius: "8px", padding: "1.5rem", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.85rem" }}>
                <Clock size={16} color="#ea580c" />
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>Working Hours</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.82rem" }}>
                {business.workingHours && business.workingHours.length > 0 ? (
                  business.workingHours.map((wh: any, i: number) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", color: "#334155", paddingBottom: "0.25rem", borderBottom: "1px solid #f8fafc" }}>
                      <span style={{ fontWeight: 600 }}>{wh.day}</span>
                      <span style={{ color: wh.isClosed ? "#dc2626" : "#059669", fontWeight: 600 }}>
                        {wh.isClosed ? "Closed" : `${wh.openTime} - ${wh.closeTime}`}
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ color: "#059669", fontWeight: 600 }}>Open All Days: 09:00 AM – 08:30 PM</div>
                )}
              </div>
            </div>

            {/* Address & Google Maps */}
            <div style={{ background: "#ffffff", borderRadius: "8px", padding: "1.5rem", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.65rem" }}>
                <MapPin size={16} color="#ea580c" />
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>Address &amp; Directions</h3>
              </div>
              <address style={{ fontStyle: "normal", color: "#334155", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "0.85rem" }}>
                {business.location?.address}, {business.location?.area || "Shivamogga"}, {business.location?.city || "Shivamogga"}, Karnataka — {business.location?.pincode || "577201"}
              </address>
              {business.location?.googleMapUrl && (
                <a
                  href={business.location.googleMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleTrackAction("directions")}
                  className="btn-secondary"
                  style={{ width: "100%", textAlign: "center", fontSize: "0.82rem" }}
                >
                  Open in Google Maps <ExternalLink size={13} />
                </a>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
