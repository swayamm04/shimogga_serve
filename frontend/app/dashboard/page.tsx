"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { businessAPI } from "@/lib/api";
import {
  Eye,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  Edit,
  Save,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

export default function BusinessOwnerDashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [businessData, setBusinessData] = useState<any | null>(null);
  const [metrics, setMetrics] = useState<any | null>(null);
  const [subscription, setSubscription] = useState<any | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Tab: 'analytics' | 'leads' | 'edit-profile'
  const [activeTab, setActiveTab] = useState<"analytics" | "leads" | "edit-profile">("analytics");

  // Renewal Modal
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewalDuration, setRenewalDuration] = useState<"1 year" | "6 months" | "1 month">("1 year");
  const [renewing, setRenewing] = useState(false);

  // Profile Edit form fields
  const [editTagline, setEditTagline] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editWhatsapp, setEditWhatsapp] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await businessAPI.getMyDashboard();
      if (res.success && res.business) {
        setBusinessData(res.business);
        setMetrics(res.metrics || res.business.metrics);
        setSubscription(res.subscriptionSummary || res.business.subscription);
        setLeads(res.leads || []);
        setRecentActivity(res.recentActivity || []);

        // Pre-fill profile edit fields
        setEditTagline(res.business.tagline || "");
        setEditDescription(res.business.description || "");
        setEditPhone(res.business.contact?.phone || "");
        setEditWhatsapp(res.business.contact?.whatsapp || "");
        setEditAddress(res.business.location?.address || "");
        setEditWebsite(res.business.contact?.website || "");
      }
    } catch (err: any) {
      console.error("Error loading business dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== "business" && user.role !== "admin"))) {
      router.push("/auth/login?redirect=/dashboard");
      return;
    }

    if (user) {
      loadDashboard();
    }
  }, [user, authLoading, router]);

  const handleRenew = async () => {
    setRenewing(true);
    try {
      const res = await businessAPI.renewSubscription(renewalDuration);
      if (res.success) {
        alert(res.message);
        setShowRenewModal(false);
        await loadDashboard();
      }
    } catch (err: any) {
      alert(err.message || "Failed to renew subscription");
    } finally {
      setRenewing(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSaved(false);

    try {
      const res = await businessAPI.updateMyProfile({
        tagline: editTagline,
        description: editDescription,
        contact: {
          phone: editPhone,
          whatsapp: editWhatsapp,
          website: editWebsite,
        },
        location: {
          address: editAddress,
        },
      });

      if (res.success) {
        setProfileSaved(true);
        setBusinessData(res.business);
      }
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "5rem" }}>
        <p style={{ color: "#64748b", fontSize: "1.1rem" }}>Loading Business Dashboard &amp; Analytics...</p>
      </div>
    );
  }

  if (!businessData) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "5rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.8rem", color: "#0f172a" }}>No Business Profile Linked</h2>
        <p style={{ color: "#64748b", margin: "0.5rem 0 1.5rem" }}>
          You are logged in as a general user. Register your business to start tracking customer visits.
        </p>
        <Link
          href="/auth/register-business"
          style={{ background: "#FF6B00", color: "#fff", padding: "0.75rem 1.4rem", borderRadius: "10px", fontWeight: 700, textDecoration: "none" }}
        >
          Register Your Business Now
        </Link>
      </div>
    );
  }

  const daysRemaining = subscription?.daysRemaining || 0;
  const isExpired = subscription?.isExpired || daysRemaining <= 0;
  const isExpiringSoon = subscription?.isExpiringSoon || (daysRemaining > 0 && daysRemaining <= 15);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingTop: "5.5rem", paddingBottom: "5rem" }}>
      <div className="container" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Welcome & Business Header */}
        <div
          style={{
            background: "#fff",
            borderRadius: "18px",
            border: "1px solid #e2e8f0",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", flex: "1 1 350px" }}>
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "14px",
                overflow: "hidden",
                border: "2px solid #e2e8f0",
                background: "#f1f5f9",
                flexShrink: 0,
              }}
            >
              <img
                src={businessData.media?.logo || "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=400&q=80"}
                alt={businessData.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                  {businessData.categoryName}
                </span>
                {businessData.isVerified && (
                  <span style={{ background: "#ecfdf5", color: "#059669", fontSize: "0.72rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "999px" }}>
                    ✓ Verified Merchant
                  </span>
                )}
              </div>
              <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a", marginTop: "0.2rem" }}>
                {businessData.name}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#64748b", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                <MapPin size={14} color="#FF6B00" />
                <span>{businessData.location?.address || `${businessData.location?.area}, Shimoga`}</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
            <Link
              href={`/business/${businessData.slug}`}
              target="_blank"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "#f1f5f9",
                border: "1px solid #cbd5e1",
                padding: "0.6rem 1rem",
                borderRadius: "8px",
                color: "#334155",
                fontWeight: 600,
                fontSize: "0.85rem",
                textDecoration: "none",
              }}
            >
              <ExternalLink size={14} /> View Live Listing
            </Link>

            <button
              onClick={() => setShowRenewModal(true)}
              className="btn-primary"
              style={{ fontSize: "0.85rem" }}
            >
              Renew / Upgrade Plan
            </button>
          </div>
        </div>

        {/* ── SUBSCRIPTION STATUS BANNER / ALERT ── */}
        <div
          style={{
            background: isExpired ? "#fef2f2" : isExpiringSoon ? "#fffbeb" : "#ecfdf5",
            border: isExpired ? "1px solid #fecaca" : isExpiringSoon ? "1px solid #fde68a" : "1px solid #a7f3d0",
            borderRadius: "14px",
            padding: "1.2rem 1.6rem",
            marginBottom: "2rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            {isExpired ? (
              <AlertTriangle size={24} color="#b91c1c" />
            ) : isExpiringSoon ? (
              <Clock size={24} color="#b45309" />
            ) : (
              <ShieldCheck size={24} color="#059669" />
            )}
            <div>
              <div style={{ fontWeight: 800, color: isExpired ? "#991b1b" : isExpiringSoon ? "#92400e" : "#065f46" }}>
                {isExpired
                  ? "Subscription Expired — Rank Deprioritized"
                  : isExpiringSoon
                  ? `Subscription Expiring Soon: ${daysRemaining} Days Left!`
                  : `Active Subscription: Ranking on Top of Shimoga Searches`}
              </div>
              <div style={{ fontSize: "0.82rem", color: isExpired ? "#b91c1c" : isExpiringSoon ? "#b45309" : "#047857" }}>
                Plan: <b>{subscription?.planDuration || "1 Year"}</b> • Registered On:{" "}
                {new Date(subscription?.registeredDate || businessData.createdAt).toLocaleDateString()} • Valid Until:{" "}
                {new Date(subscription?.expiryDate).toLocaleDateString()}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowRenewModal(true)}
            style={{
              background: isExpired ? "#b91c1c" : isExpiringSoon ? "#b45309" : "#059669",
              color: "#fff",
              border: "none",
              padding: "0.45rem 1rem",
              borderRadius: "6px",
              fontWeight: 700,
              fontSize: "0.82rem",
              cursor: "pointer",
            }}
          >
            {isExpired ? "Re-Activate Listing Now" : "Extend Subscription"}
          </button>
        </div>

        {/* ── CUSTOMER VISITOR ANALYTICS CARDS (AS EXPLICITLY REQUESTED) ── */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a" }}>
              Customer Traffic &amp; Visit Analytics
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.88rem" }}>
              Real-time counts of visitors discovering and contacting your business from ShimogaBiz.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.2rem",
            }}
          >
            {/* Total Visitors from site */}
            <div style={{ background: "#fff", borderRadius: "14px", padding: "1.5rem", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>Total Visitors</span>
                <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f172a" }}>
                  <Eye size={18} />
                </div>
              </div>
              <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0f172a", marginTop: "0.4rem" }}>
                {metrics?.totalViews || 0}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#059669", fontWeight: 600, marginTop: "0.2rem" }}>
                Profile impressions on site
              </div>
            </div>

            {/* Direct Phone Calls */}
            <div style={{ background: "#fff", borderRadius: "14px", padding: "1.5rem", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>Direct Phone Calls</span>
                <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", color: "#059669" }}>
                  <Phone size={18} />
                </div>
              </div>
              <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#059669", marginTop: "0.4rem" }}>
                {metrics?.callClicks || 0}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.2rem" }}>
                Tapped &quot;Call Now&quot; button
              </div>
            </div>

            {/* WhatsApp Chats */}
            <div style={{ background: "#fff", borderRadius: "14px", padding: "1.5rem", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>WhatsApp Chats</span>
                <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", color: "#25D366" }}>
                  <MessageCircle size={18} />
                </div>
              </div>
              <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0f172a", marginTop: "0.4rem" }}>
                {metrics?.whatsappClicks || 0}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.2rem" }}>
                Direct customer chats
              </div>
            </div>

            {/* Map Directions */}
            <div style={{ background: "#fff", borderRadius: "14px", padding: "1.5rem", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>Directions &amp; Map</span>
                <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", color: "#ea580c" }}>
                  <MapPin size={18} />
                </div>
              </div>
              <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0f172a", marginTop: "0.4rem" }}>
                {metrics?.directionsClicks || 0}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.2rem" }}>
                Navigated to your store
              </div>
            </div>
          </div>
        </div>

        {/* ── TABS: RECENT LEADS & EDIT PROFILE ── */}
        <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: "2rem", gap: "1.5rem" }}>
          <button
            onClick={() => setActiveTab("analytics")}
            style={{
              background: "none",
              border: "none",
              padding: "0.8rem 0",
              fontSize: "1rem",
              fontWeight: 700,
              color: activeTab === "analytics" ? "#FF6B00" : "#64748b",
              borderBottom: activeTab === "analytics" ? "3px solid #FF6B00" : "3px solid transparent",
              cursor: "pointer",
            }}
          >
            Customer Inquiries &amp; Leads ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab("edit-profile")}
            style={{
              background: "none",
              border: "none",
              padding: "0.8rem 0",
              fontSize: "1rem",
              fontWeight: 700,
              color: activeTab === "edit-profile" ? "#FF6B00" : "#64748b",
              borderBottom: activeTab === "edit-profile" ? "3px solid #FF6B00" : "3px solid transparent",
              cursor: "pointer",
            }}
          >
            Edit Business Profile &amp; Contact
          </button>
        </div>

        {/* ── INQUIRIES / LEADS TAB ── */}
        {activeTab === "analytics" && (
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "1.8rem" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", marginBottom: "1rem" }}>
              Direct Customer Leads
            </h2>

            {leads.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "8px", background: "#f1f5f9", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#64748b", marginBottom: "0.5rem" }}>
                  <MessageCircle size={22} />
                </div>
                <div style={{ fontWeight: 600 }}>No inquiries received yet</div>
                <p style={{ fontSize: "0.85rem", marginTop: "0.3rem" }}>
                  When visitors submit inquiries from your public profile, they will appear here with customer names and phone numbers.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {leads.map((lead) => (
                  <div
                    key={lead._id}
                    style={{
                      background: "#f8fafc",
                      borderRadius: "12px",
                      padding: "1.2rem",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontWeight: 800, color: "#0f172a", fontSize: "1rem" }}>
                          {lead.customerName}
                        </span>
                        {lead.serviceNeeded && (
                          <span style={{ background: "#eef2ff", color: "#4f46e5", fontSize: "0.75rem", padding: "0.15rem 0.5rem", borderRadius: "4px", fontWeight: 600 }}>
                            {lead.serviceNeeded}
                          </span>
                        )}
                      </div>
                      <p style={{ color: "#475569", fontSize: "0.9rem", margin: "0.5rem 0" }}>
                        &quot;{lead.message}&quot;
                      </p>
                      <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                        Received: {new Date(lead.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                      <a
                        href={`tel:${lead.customerPhone}`}
                        style={{
                          background: "#0f172a",
                          color: "#fff",
                          padding: "0.5rem 0.9rem",
                          borderRadius: "6px",
                          fontWeight: 700,
                          fontSize: "0.82rem",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <Phone size={13} /> {lead.customerPhone}
                      </a>
                      <a
                        href={`https://wa.me/${lead.customerPhone.replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(lead.customerName)}%2C%20thank%20you%20for%20contacting%20${encodeURIComponent(businessData.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: "#25D366",
                          color: "#fff",
                          padding: "0.5rem 0.9rem",
                          borderRadius: "6px",
                          fontWeight: 700,
                          fontSize: "0.82rem",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <MessageCircle size={13} /> WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── EDIT PROFILE TAB ── */}
        {activeTab === "edit-profile" && (
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.5rem" }}>
              Update Listing Details
            </h2>

            {profileSaved && (
              <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46", padding: "0.8rem", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "0.88rem" }}>
                ✓ Business details updated successfully!
              </div>
            )}

            <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "1.2rem", maxWidth: "700px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                  Tagline
                </label>
                <input
                  type="text"
                  value={editTagline}
                  onChange={(e) => setEditTagline(e.target.value)}
                  style={{ width: "100%", padding: "0.7rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                  About &amp; Description
                </label>
                <textarea
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  style={{ width: "100%", padding: "0.7rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    style={{ width: "100%", padding: "0.7rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={editWhatsapp}
                    onChange={(e) => setEditWhatsapp(e.target.value)}
                    style={{ width: "100%", padding: "0.7rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                  Street Address
                </label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  style={{ width: "100%", padding: "0.7rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                  Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={editWebsite}
                  onChange={(e) => setEditWebsite(e.target.value)}
                  style={{ width: "100%", padding: "0.7rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                style={{
                  background: "#FF6B00",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.85rem 1.5rem",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  alignSelf: "flex-start",
                }}
              >
                {savingProfile ? "Saving Changes..." : "Save Profile Details"}
              </button>
            </form>
          </div>
        )}

        {/* ── RENEW SUBSCRIPTION MODAL ── */}
        {showRenewModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
          >
            <div style={{ background: "#fff", borderRadius: "18px", padding: "2.2rem", maxWidth: "480px", width: "100%" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem" }}>
                Renew / Extend Subscription
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#64748b", marginBottom: "1.5rem" }}>
                Keep your top SEO ranking, customer visit analytics, and verified partner badge active.
              </p>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                  Select Extension Duration:
                </label>
                <select
                  value={renewalDuration}
                  onChange={(e) => setRenewalDuration(e.target.value as any)}
                  style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "2px solid #FF6B00", fontWeight: 700, fontSize: "0.95rem", background: "#fff7ed", color: "#9a3412" }}
                >
                  <option value="1 year">1 Year (₹8,999) — Top Priority (Recommended)</option>
                  <option value="6 months">6 Months (₹4,999) — Growth Plan</option>
                  <option value="1 month">1 Month (₹999) — Standard Listing</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.8rem" }}>
                <button
                  type="button"
                  onClick={() => setShowRenewModal(false)}
                  style={{ background: "#f1f5f9", border: "none", padding: "0.7rem 1.2rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={renewing}
                  onClick={handleRenew}
                  style={{ background: "#FF6B00", color: "#fff", border: "none", padding: "0.7rem 1.4rem", borderRadius: "8px", fontWeight: 800, cursor: "pointer" }}
                >
                  {renewing ? "Processing..." : "Confirm & Renew"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
