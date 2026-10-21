"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { businessAPI, leadAPI, reviewAPI } from "@/lib/api";
import {
  Phone,
  MessageCircle,
  MapPin,
  Globe,
  Clock,
  Star,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Share2,
  ArrowLeft,
  Send,
  Building2,
  ExternalLink,
} from "lucide-react";

export default function BusinessDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [business, setBusiness] = useState<any | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Lead inquiry form state
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryService, setInquiryService] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquirySending, setInquirySending] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    businessAPI
      .getBySlug(slug)
      .then((res) => {
        if (res.success && res.data) {
          setBusiness(res.data);
          setReviews(res.reviews || []);
          setRelated(res.related || []);
        } else {
          setError("Business not found");
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load business");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const handleTrackAction = (action: "call" | "whatsapp" | "website" | "directions") => {
    if (!business?._id) return;
    businessAPI.trackInteraction(business._id, action).catch(() => {});
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

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business?._id || !reviewName || !reviewComment) return;

    setReviewSubmitting(true);
    try {
      const res = await reviewAPI.submit({
        businessId: business._id,
        name: reviewName,
        rating: reviewRating,
        comment: reviewComment,
      });
      if (res.success) {
        setReviews([res.data, ...reviews]);
        setBusiness((prev: any) => ({
          ...prev,
          rating: res.newRating,
          reviewsCount: res.reviewsCount,
        }));
        setShowReviewModal(false);
        setReviewName("");
        setReviewComment("");
      }
    } catch (err: any) {
      alert(err.message || "Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#64748b", fontSize: "1rem" }}>Loading business profile...</p>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem" }}>
        <h2 style={{ fontSize: "1.6rem", color: "#0f172a", marginBottom: "0.5rem" }}>Business Not Found</h2>
        <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>The business you are looking for may have been removed or updated.</p>
        <Link href="/services" className="btn-primary">
          Back to Directory
        </Link>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    image: business.media?.coverImage || business.media?.logo,
    telephone: business.contact?.phone,
    email: business.contact?.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.location?.address,
      addressLocality: business.location?.area || "Shivamogga",
      addressRegion: "Karnataka",
      postalCode: business.location?.pincode || "577201",
      addressCountry: "IN",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: business.rating || 5,
      reviewCount: business.reviewsCount || 1,
    },
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: "5rem" }}>
      {/* Inject SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Breadcrumb Bar ── */}
      <div style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "0.75rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "#64748b", flexWrap: "wrap" }}>
            <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>
              Home
            </Link>
            <span>/</span>
            <Link href="/services" style={{ color: "#64748b", textDecoration: "none" }}>
              Directory
            </Link>
            <span>/</span>
            <Link href={`/services?category=${business.categorySlug}`} style={{ color: "#64748b", textDecoration: "none" }}>
              {business.categoryName}
            </Link>
            <span>/</span>
            <span style={{ color: "#0f172a", fontWeight: 600 }}>{business.name}</span>
          </div>
        </div>
      </div>

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
            alt={business.name}
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
              }}
            >
              TOP SPONSORED PARTNER
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
                alt={business.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                  {business.categoryName}
                </span>
                {business.isVerified && (
                  <span className="badge-verified">
                    <ShieldCheck size={12} /> VERIFIED SHIVAMOGGA MERCHANT
                  </span>
                )}
              </div>

              <h1 style={{ fontSize: "1.65rem", fontWeight: 800, color: "#0f172a", marginTop: "0.15rem" }}>
                {business.name}
              </h1>

              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginTop: "0.35rem", fontSize: "0.85rem", color: "#64748b", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  <b style={{ color: "#0f172a" }}>{business.rating}</b>
                  <span>({business.reviewsCount} verified reviews)</span>
                </div>
                <span>•</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <MapPin size={14} color="#ea580c" />
                  <span>{business.location?.area || "Shivamogga"}, Karnataka</span>
                </div>
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
              href={`https://wa.me/${(business.contact?.whatsapp || business.contact?.phone || "919448100001").replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(business.name)}%2C%20I%20saw%20your%20profile%20on%20Shivamogga%20Services`}
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
            <div style={{ background: "#ffffff", borderRadius: "8px", padding: "1.75rem", border: "1px solid #e2e8f0" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.6rem" }}>
                About {business.name}
              </h2>
              <p style={{ color: "#334155", lineHeight: 1.65, fontSize: "0.92rem" }}>
                {business.description || business.tagline}
              </p>

              {/* Services Offered */}
              {business.services && business.services.length > 0 && (
                <div style={{ marginTop: "1.5rem" }}>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.6rem" }}>
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
                          padding: "0.35rem 0.75rem",
                          borderRadius: "4px",
                          fontSize: "0.82rem",
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
                <div style={{ marginTop: "1.25rem" }}>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.6rem" }}>
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
                          padding: "0.3rem 0.65rem",
                          borderRadius: "4px",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Photo Gallery */}
            {business.media?.gallery && business.media.gallery.length > 0 && (
              <div style={{ background: "#ffffff", borderRadius: "8px", padding: "1.75rem", border: "1px solid #e2e8f0" }}>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.85rem" }}>
                  Facilities &amp; Photos
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
                  {business.media.gallery.map((imgUrl: string, idx: number) => (
                    <div key={idx} style={{ height: "130px", borderRadius: "6px", overflow: "hidden", background: "#f1f5f9" }}>
                      <img src={imgUrl} alt={`${business.name} photo ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Reviews Section */}
            <div style={{ background: "#ffffff", borderRadius: "8px", padding: "1.75rem", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a" }}>
                    Verified Customer Reviews
                  </h2>
                  <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                    Ratings from residents in Shivamogga.
                  </p>
                </div>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="btn-secondary"
                  style={{ fontSize: "0.82rem", padding: "0.45rem 0.85rem" }}
                >
                  Write a Review
                </button>
              </div>

              {/* Review Modal */}
              {showReviewModal && (
                <div
                  style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.5)",
                    zIndex: 110,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem",
                  }}
                >
                  <div style={{ background: "#ffffff", borderRadius: "8px", padding: "1.75rem", maxWidth: "480px", width: "100%", border: "1px solid #cbd5e1" }}>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.85rem" }}>
                      Review {business.name}
                    </h3>
                    <form onSubmit={handleReviewSubmit}>
                      <div style={{ marginBottom: "0.85rem" }}>
                        <label className="form-label">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          placeholder="e.g. Ramesh Kumar"
                          className="form-input"
                        />
                      </div>

                      <div style={{ marginBottom: "0.85rem" }}>
                        <label className="form-label">
                          Rating (Out of 5 Stars)
                        </label>
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                          className="form-select"
                        >
                          <option value="5">5 Stars (Excellent service)</option>
                          <option value="4">4 Stars (Good quality)</option>
                          <option value="3">3 Stars (Average experience)</option>
                          <option value="2">2 Stars (Needs improvement)</option>
                          <option value="1">1 Star (Poor service)</option>
                        </select>
                      </div>

                      <div style={{ marginBottom: "1.25rem" }}>
                        <label className="form-label">
                          Written Feedback
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share your experience regarding pricing, punctuality, and quality..."
                          className="form-textarea"
                        />
                      </div>

                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                        <button
                          type="button"
                          onClick={() => setShowReviewModal(false)}
                          className="btn-secondary"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={reviewSubmitting}
                          className="btn-primary"
                        >
                          {reviewSubmitting ? "Submitting..." : "Post Review"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {reviews.length === 0 ? (
                  <p style={{ color: "#64748b", fontSize: "0.88rem" }}>No reviews written yet. Be the first to share your experience.</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev._id} style={{ padding: "0.9rem", borderRadius: "6px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                        <span style={{ fontWeight: 600, color: "#0f172a", fontSize: "0.9rem" }}>{rev.name}</span>
                        <div style={{ display: "flex", gap: "0.1rem" }}>
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />
                          ))}
                        </div>
                      </div>
                      <p style={{ color: "#334155", fontSize: "0.85rem", lineHeight: 1.5 }}>{rev.comment}</p>
                      <span style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.35rem", display: "block" }}>
                        {new Date(rev.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Direct Inquiry Form */}
            <div style={{ background: "#ffffff", borderRadius: "8px", padding: "1.5rem", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.25rem" }}>
                Send Direct Inquiry
              </h3>
              <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "1rem" }}>
                Request an appointment, quote, or callback from this merchant.
              </p>

              {inquirySuccess ? (
                <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "0.85rem", borderRadius: "6px", color: "#065f46", fontSize: "0.85rem" }}>
                  <b>Inquiry Submitted Successfully.</b> The merchant has received your request and will contact you directly.
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
                      placeholder="e.g. OPD Consultation, AC Servicing"
                      value={inquiryService}
                      onChange={(e) => setInquiryService(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      Message / Requirement *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Mention preferred timings and requirements..."
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
              <p style={{ color: "#334155", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "0.85rem" }}>
                {business.location?.address}, {business.location?.area || "Shivamogga"}, Shivamogga, Karnataka — {business.location?.pincode || "577201"}
              </p>
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
          </div>
        </div>
      </div>
    </div>
  );
}
