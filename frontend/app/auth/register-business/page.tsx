"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCity } from "@/context/CityContext";
import { categoryAPI } from "@/lib/api";
import { getWhatsAppListingUrl, CITIES_DATA, ADMIN_WHATSAPP_NUMBER } from "@/data/cities";
import {
  Building2,
  Calendar,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  AlertCircle,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

function RegisterBusinessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const { selectedCity, setSelectedCity } = useCity();

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Preserved Form Fields for future self-service reactivation
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState(selectedCity || "Shivamogga");
  const [area, setArea] = useState("Gandhi Bazaar");
  const [address, setAddress] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");

  const initialPlan = searchParams.get("plan")?.toLowerCase() || "1 year";
  const [subscriptionDuration, setSubscriptionDuration] = useState<"1 year" | "6 months" | "1 month">(
    initialPlan.includes("month") && !initialPlan.includes("6")
      ? "1 month"
      : initialPlan.includes("6")
      ? "6 months"
      : "1 year"
  );

  useEffect(() => {
    categoryAPI.getAll().then((res) => {
      if (res.success && res.data) {
        setCategories(res.data);
        if (res.data.length > 0) {
          setCategory(res.data[0]._id);
        }
      }
    });
  }, []);

  const now = new Date();
  const registeredDateStr = now.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const getPlanDetails = (duration: "1 year" | "6 months" | "1 month") => {
    const exp = new Date(now);
    let amount = 8999;
    if (duration === "1 month") {
      exp.setMonth(now.getMonth() + 1);
      amount = 999;
    } else if (duration === "6 months") {
      exp.setMonth(now.getMonth() + 6);
      amount = 4999;
    } else {
      exp.setFullYear(now.getFullYear() + 1);
      amount = 8999;
    }
    return {
      amount,
      expiryDateStr: exp.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };
  };

  const planInfo = getPlanDetails(subscriptionDuration);

  const whatsAppHref = getWhatsAppListingUrl(
    selectedCity,
    subscriptionDuration === "1 year"
      ? "1 Year Elite Partner"
      : subscriptionDuration === "6 months"
      ? "6 Months Growth"
      : "1 Month Starter"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const selectedCatObj = categories.find((c) => c._id === category);

      await register({
        role: "business",
        name: ownerName || businessName,
        email,
        password,
        phone,
        whatsapp: whatsapp || phone,
        businessName,
        category,
        categoryName: selectedCatObj ? selectedCatObj.name : "Local Business",
        subscriptionDuration,
        address: address || `${area}, ${city}`,
        area,
        city,
        tagline,
        description,
      });

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to register business. Please verify all details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingTop: "3rem", paddingBottom: "5rem" }}>
      <div className="container" style={{ maxWidth: "980px" }}>
        {/* ── ACTIVE PRIMARY STATE: DIRECT ONBOARDING VIA WHATSAPP ── */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #cbd5e1",
            padding: "2.5rem 2rem",
            boxShadow: "var(--shadow-sm)",
            marginBottom: "2.5rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "10px",
              background: "#ecfdf5",
              color: "#059669",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
              border: "1px solid #a7f3d0",
            }}
          >
            <MessageCircle size={28} />
          </div>

          <div
            style={{
              fontSize: "0.78rem",
              color: "#ea580c",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "0.35rem",
            }}
          >
            ADMIN-ONLY DIRECT VERIFICATION
          </div>

          <h1 style={{ fontSize: "1.9rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem" }}>
            List Your Business via WhatsApp
          </h1>

          <p style={{ color: "#475569", fontSize: "0.95rem", maxWidth: "620px", margin: "0 auto 1.5rem", lineHeight: 1.6 }}>
            Online automated payment and self-registration are currently reserved while our administration team conducts direct license and physical address verification. Contact our directory admin on WhatsApp to get your business verified and listed.
          </p>

          {/* City Context Indicator */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#f1f5f9",
              padding: "0.4rem 0.9rem",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              fontSize: "0.85rem",
              color: "#334155",
              marginBottom: "1.75rem",
              fontWeight: 600,
            }}
          >
            <MapPin size={14} color="#ea580c" />
            <span>Target City: <b>{selectedCity}</b></span>
            <span style={{ color: "#94a3b8" }}>•</span>
            <span style={{ color: "#64748b" }}>Multi-City Directory Service</span>
          </div>

          {/* Primary WhatsApp Action Button */}
          <div>
            <a
              href={whatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.85rem 2rem",
                fontSize: "1rem",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <MessageCircle size={20} />
              <span>Chat on WhatsApp with Directory Admin</span>
              <ExternalLink size={16} />
            </a>
          </div>

          {/* Step by Step Process */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.25rem",
              marginTop: "2.5rem",
              textAlign: "left",
              borderTop: "1px solid #e2e8f0",
              paddingTop: "2rem",
            }}
          >
            <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#ea580c", marginBottom: "0.2rem" }}>
                STEP 1
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "#0f172a" }}>Share Business Details</div>
              <p style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "0.3rem", lineHeight: 1.5 }}>
                Send your shop/clinic name, city, phone number, and address proof directly via WhatsApp.
              </p>
            </div>

            <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#059669", marginBottom: "0.2rem" }}>
                STEP 2
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "#0f172a" }}>Admin Direct Verification</div>
              <p style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "0.3rem", lineHeight: 1.5 }}>
                The directory administration team verifies your documentation and configures your plan.
              </p>
            </div>

            <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2563eb", marginBottom: "0.2rem" }}>
                STEP 3
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "#0f172a" }}>Go Live with Verified Badge</div>
              <p style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "0.3rem", lineHeight: 1.5 }}>
                Your business is published with top priority ranking and direct call &amp; WhatsApp click tracking.
              </p>
            </div>
          </div>
        </div>

        {/* ── HASHED / PRESERVED SECTION FOR FUTURE SELF-SERVICE ACTIVATION ── */}
        {/* =========================================================================
            LEGACY SELF-SERVICE REGISTRATION & PAYMENT CHECKOUT (HASHED / PRESERVED)
            Per user requirement:
            "make the existing design hidden or hashed as i can use this design in future"
            This code block keeps all inputs, state handlers, pricing calculations,
            and API payload structures completely intact.
           ========================================================================= */}
        <details
          style={{
            border: "1px dashed #cbd5e1",
            borderRadius: "8px",
            padding: "1.25rem",
            background: "#ffffff",
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              fontWeight: 700,
              color: "#475569",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <ShieldCheck size={16} color="#64748b" />
            <span>Preview Preserved Self-Service Registration Form (Hashed / Inactive for Future Activation)</span>
          </summary>

          <div style={{ marginTop: "1.5rem", opacity: 0.85 }}>
            <div
              style={{
                background: "#fef3c7",
                border: "1px solid #fde68a",
                color: "#92400e",
                padding: "0.75rem 1rem",
                borderRadius: "6px",
                marginBottom: "1.5rem",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              Note: This self-service submission form is currently hashed/inactive in production. Only admins will add businesses.
            </div>

            {error && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#b91c1c",
                  padding: "0.85rem 1rem",
                  borderRadius: "6px",
                  marginBottom: "1.5rem",
                  fontSize: "0.88rem",
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.6fr 1fr",
                  gap: "1.75rem",
                  alignItems: "start",
                }}
              >
                {/* Left Column: Business Details */}
                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    padding: "1.75rem",
                  }}
                >
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#0f172a", marginBottom: "1.25rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.75rem" }}>
                    1. Business &amp; Contact Details
                  </h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label className="form-label">Business / Clinic / Shop Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Sahyadri Auto Care"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label className="form-label">Category *</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="form-select"
                        >
                          {categories.map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="form-label">City *</label>
                        <select
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="form-select"
                        >
                          {CITIES_DATA.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label className="form-label">Locality / Area *</label>
                        <input
                          type="text"
                          placeholder="e.g. Kuvempu Road"
                          value={area}
                          onChange={(e) => setArea(e.target.value)}
                          className="form-input"
                        />
                      </div>

                      <div>
                        <label className="form-label">Contact Phone Number *</label>
                        <input
                          type="tel"
                          placeholder="+91 94481 ..."
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Full Street Address *</label>
                      <input
                        type="text"
                        placeholder="e.g. Near Old Bus Stand, Kuvempu Road"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label className="form-label">Owner / Representative Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Ramesh Kumar"
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          className="form-input"
                        />
                      </div>

                      <div>
                        <label className="form-label">Account Email *</label>
                        <input
                          type="email"
                          placeholder="owner@mybusiness.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Short Tagline</label>
                      <input
                        type="text"
                        placeholder="e.g. Premier multi-specialty diagnostics"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Preserved Plan Selection & Summary */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div
                    style={{
                      background: "#f8fafc",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      padding: "1.5rem",
                    }}
                  >
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
                      Preserved Plan Rates
                    </h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.25rem" }}>
                      {[
                        { id: "1 year", label: "1 Year Elite Partner", price: "₹8,999" },
                        { id: "6 months", label: "6 Months Growth", price: "₹4,999" },
                        { id: "1 month", label: "1 Month Starter", price: "₹999" },
                      ].map((p) => (
                        <label
                          key={p.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0.65rem 0.8rem",
                            borderRadius: "6px",
                            border: subscriptionDuration === p.id ? "2px solid #ea580c" : "1px solid #cbd5e1",
                            background: subscriptionDuration === p.id ? "#fff7ed" : "#ffffff",
                            cursor: "pointer",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <input
                              type="radio"
                              name="preserved_plan"
                              checked={subscriptionDuration === p.id}
                              onChange={() => setSubscriptionDuration(p.id as any)}
                            />
                            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0f172a" }}>{p.label}</span>
                          </div>
                          <span style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.9rem" }}>{p.price}</span>
                        </label>
                      ))}
                    </div>

                    <div style={{ background: "#ffffff", padding: "0.85rem", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.82rem", display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1.25rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}>
                        <span>Registered Date:</span>
                        <b style={{ color: "#0f172a" }}>{registeredDateStr}</b>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}>
                        <span>Calculated Expiry:</span>
                        <b style={{ color: "#059669" }}>{planInfo.expiryDateStr}</b>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", borderTop: "1px solid #e2e8f0", paddingTop: "0.4rem" }}>
                        <span style={{ fontWeight: 700, color: "#0f172a" }}>Total Investment:</span>
                        <b style={{ fontSize: "1rem", color: "#ea580c" }}>₹{planInfo.amount.toLocaleString()}</b>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled
                      className="btn-secondary"
                      style={{ width: "100%", padding: "0.75rem", fontSize: "0.88rem", opacity: 0.6, cursor: "not-allowed" }}
                    >
                      Self-Service Direct Submission Inactive (Admin Only)
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </details>
      </div>
    </div>
  );
}

export default function RegisterBusinessPage() {
  return (
    <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center" }}>Loading Onboarding Portal...</div>}>
      <RegisterBusinessContent />
    </Suspense>
  );
}
