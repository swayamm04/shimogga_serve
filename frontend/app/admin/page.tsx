"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { adminAPI, categoryAPI } from "@/lib/api";
import { CITIES_DATA, getCityAreas } from "@/data/cities";
import {
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Clock,
  Building2,
  DollarSign,
  Phone,
  MessageCircle,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  Search,
  ExternalLink,
  MapPin,
  X,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [stats, setStats] = useState<any | null>(null);
  const [recentlyAdded, setRecentlyAdded] = useState<any[]>([]);
  const [expiringSoonList, setExpiringSoonList] = useState<any[]>([]);
  const [outOfSubscriptionList, setOutOfSubscriptionList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Tab: 'overview' | 'all-businesses' | 'categories'
  const [activeTab, setActiveTab] = useState<"overview" | "all-businesses" | "categories">("overview");

  // All businesses tab state
  const [allBusinesses, setAllBusinesses] = useState<any[]>([]);
  const [bizSearch, setBizSearch] = useState("");
  const [bizFilter, setBizFilter] = useState("all");

  // Category manager state
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [newCatEmoji, setNewCatEmoji] = useState("Sparkles");
  const [newCatDesc, setNewCatDesc] = useState("");

  // Admin Direct Business Creation Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [submittingBiz, setSubmittingBiz] = useState(false);
  const [newBizName, setNewBizName] = useState("");
  const [newBizCat, setNewBizCat] = useState("");
  const [newBizCity, setNewBizCity] = useState("Shivamogga");
  const [newBizArea, setNewBizArea] = useState("Gandhi Bazaar");
  const [newBizAddress, setNewBizAddress] = useState("");
  const [newBizPhone, setNewBizPhone] = useState("");
  const [newBizWhatsapp, setNewBizWhatsapp] = useState("");
  const [newBizEmail, setNewBizEmail] = useState("");
  const [newBizTagline, setNewBizTagline] = useState("");
  const [newBizDesc, setNewBizDesc] = useState("");
  const [newBizPlan, setNewBizPlan] = useState<"1 year" | "6 months" | "1 month">("1 year");
  const [newBizFeatured, setNewBizFeatured] = useState(true);
  const [newBizVerified, setNewBizVerified] = useState(true);

  const loadAdminDashboard = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getDashboard();
      if (res.success) {
        setStats(res.stats);
        setRecentlyAdded(res.recentlyAdded || []);
        setExpiringSoonList(res.expiringSoonList || []);
        setOutOfSubscriptionList(res.outOfSubscriptionList || []);
      }
    } catch (err: any) {
      console.error("Admin dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadAllBusinesses = async () => {
    try {
      const res = await adminAPI.getBusinesses({
        search: bizSearch,
        subscriptionStatus: bizFilter !== "all" ? bizFilter : "",
      });
      if (res.success && res.data) {
        setAllBusinesses(res.data);
      }
    } catch (err) {
      console.error("Error loading businesses for admin:", err);
    }
  };

  useEffect(() => {
    categoryAPI
      .getAll()
      .then((res) => {
        if (res.success && res.data) {
          setCategoriesList(res.data);
          if (res.data.length > 0) {
            setNewBizCat(res.data[0]._id);
          }
        }
      })
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  const handleAdminCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName.trim() || !newBizPhone.trim()) {
      alert("Business Name and Phone number are required.");
      return;
    }
    setSubmittingBiz(true);
    try {
      const selectedCatObj = categoriesList.find((c) => c._id === newBizCat || c.slug === newBizCat);
      await adminAPI.createBusiness({
        name: newBizName.trim(),
        category: newBizCat,
        categoryName: selectedCatObj ? selectedCatObj.name : "Local Business",
        city: newBizCity,
        area: newBizArea,
        address: newBizAddress.trim() || `${newBizArea}, ${newBizCity}`,
        phone: newBizPhone.trim(),
        whatsapp: newBizWhatsapp.trim() || newBizPhone.trim(),
        email: newBizEmail.trim(),
        tagline: newBizTagline.trim(),
        description: newBizDesc.trim(),
        planDuration: newBizPlan,
        isFeatured: newBizFeatured,
        isVerified: newBizVerified,
      });

      alert(`Business "${newBizName}" created and published successfully!`);
      setShowAddModal(false);
      setNewBizName("");
      setNewBizPhone("");
      setNewBizWhatsapp("");
      setNewBizAddress("");
      setNewBizEmail("");
      setNewBizTagline("");
      setNewBizDesc("");
      await loadAdminDashboard();
      if (activeTab === "all-businesses") await loadAllBusinesses();
    } catch (err: any) {
      alert(err.message || "Failed to create business.");
    } finally {
      setSubmittingBiz(false);
    }
  };

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      // Auto-redirect if not logged in as admin
      router.push("/auth/login?redirect=/admin");
      return;
    }

    if (user?.role === "admin") {
      loadAdminDashboard();
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (activeTab === "all-businesses" && user?.role === "admin") {
      loadAllBusinesses();
    }
  }, [activeTab, bizSearch, bizFilter]);

  const handleUpdateStatus = async (bizId: string, newStatus: string) => {
    try {
      await adminAPI.updateBusiness(bizId, { status: newStatus });
      await loadAdminDashboard();
      if (activeTab === "all-businesses") await loadAllBusinesses();
    } catch (err: any) {
      alert(err.message || "Failed to update business status");
    }
  };

  const handleRenewOneYear = async (bizId: string) => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    try {
      await adminAPI.updateBusiness(bizId, {
        subscription: {
          planDuration: "1 year",
          status: "active",
          expiryDate: nextYear,
          amount: 8999,
        },
        isFeatured: true,
      });
      alert("Subscription renewed for 1 Year!");
      await loadAdminDashboard();
    } catch (err: any) {
      alert(err.message || "Failed to renew subscription");
    }
  };

  const handleDeleteBusiness = async (bizId: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      await adminAPI.deleteBusiness(bizId);
      await loadAdminDashboard();
      if (activeTab === "all-businesses") await loadAllBusinesses();
    } catch (err: any) {
      alert(err.message || "Failed to delete business");
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    try {
      await adminAPI.createCategory({
        name: newCatName,
        emoji: newCatEmoji,
        description: newCatDesc,
      });
      alert("Category added successfully!");
      setNewCatName("");
      setNewCatDesc("");
      await loadAdminDashboard();
    } catch (err: any) {
      alert(err.message || "Failed to create category");
    }
  };

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "5rem" }}>
        <p style={{ color: "#64748b", fontSize: "1.1rem" }}>Loading Admin Portal...</p>
      </div>
    );
  }

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingTop: "5.5rem", paddingBottom: "5rem" }}>
      <div className="container" style={{ maxWidth: "1340px", margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Top Header */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ background: "#eef2ff", color: "#4f46e5", padding: "0.2rem 0.6rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700 }}>
                ADMINISTRATOR ACCESS
              </span>
              <span style={{ color: "#64748b", fontSize: "0.85rem" }}>Logged in as {user?.email}</span>
            </div>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0f172a", marginTop: "0.3rem" }}>
              Master Admin Control Center
            </h1>
          </div>

          <div style={{ display: "flex", gap: "0.8rem" }}>
            <button
              onClick={loadAdminDashboard}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "#fff",
                border: "1px solid #cbd5e1",
                padding: "0.6rem 1rem",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.88rem",
                cursor: "pointer",
              }}
            >
              <RefreshCw size={14} /> Refresh Data
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.6rem 1.2rem",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.88rem",
                cursor: "pointer",
              }}
            >
              <Plus size={16} /> Add New Business
            </button>
          </div>
        </div>

        {/* ── KPI STATS CARDS ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.2rem",
            marginBottom: "2.5rem",
          }}
        >
          {/* Revenue */}
          <div style={{ background: "#fff", borderRadius: "14px", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>
              <span>Total Revenue</span>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#ecfdf5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <DollarSign size={18} />
              </div>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", marginTop: "0.5rem" }}>
              ₹{(stats?.totalRevenue || 0).toLocaleString()}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#059669", fontWeight: 600, marginTop: "0.3rem" }}>
              Paid subscriptions to date
            </div>
          </div>

          {/* Active Businesses */}
          <div style={{ background: "#fff", borderRadius: "14px", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>
              <span>Active Subscriptions</span>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#eef2ff", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Building2 size={18} />
              </div>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", marginTop: "0.5rem" }}>
              {stats?.activeBusinesses || 0}{" "}
              <span style={{ fontSize: "1rem", color: "#64748b", fontWeight: 500 }}>
                / {stats?.totalBusinesses || 0} total
              </span>
            </div>
            <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.3rem" }}>
              Active on top SEO placement
            </div>
          </div>

          {/* Expiring Soon (<15 days) */}
          <div style={{ background: "#fff", borderRadius: "14px", padding: "1.5rem", border: "1px solid #fde68a", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#b45309", fontSize: "0.85rem", fontWeight: 700 }}>
              <span>Expiring Soon (&lt;15 Days)</span>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#fef3c7", color: "#b45309", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Clock size={18} />
              </div>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#b45309", marginTop: "0.5rem" }}>
              {stats?.expiringSoonCount || 0}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#b45309", marginTop: "0.3rem" }}>
              Requires renewal alert
            </div>
          </div>

          {/* Out of Subscription (Expired) */}
          <div style={{ background: "#fff", borderRadius: "14px", padding: "1.5rem", border: "1px solid #fecaca", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#b91c1c", fontSize: "0.85rem", fontWeight: 700 }}>
              <span>Out of Subscription (Expired)</span>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#fee2e2", color: "#b91c1c", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AlertTriangle size={18} />
              </div>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#b91c1c", marginTop: "0.5rem" }}>
              {stats?.expiredCount || 0}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#b91c1c", marginTop: "0.3rem" }}>
              Deprioritized from top SEO
            </div>
          </div>

          {/* Total Customer Visits */}
          <div style={{ background: "#fff", borderRadius: "14px", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>
              <span>Total Customer Visits</span>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#f1f5f9", color: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Eye size={18} />
              </div>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", marginTop: "0.5rem" }}>
              {(stats?.platformTraffic?.totalViews || 0).toLocaleString()}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.3rem" }}>
              Calls: {stats?.platformTraffic?.totalCalls || 0} | WA: {stats?.platformTraffic?.totalWhatsapp || 0}
            </div>
          </div>
        </div>

        {/* ── NAVIGATION TABS ── */}
        <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: "2rem", gap: "1.5rem" }}>
          <button
            onClick={() => setActiveTab("overview")}
            style={{
              background: "none",
              border: "none",
              padding: "0.8rem 0",
              fontSize: "1rem",
              fontWeight: 700,
              color: activeTab === "overview" ? "#FF6B00" : "#64748b",
              borderBottom: activeTab === "overview" ? "3px solid #FF6B00" : "3px solid transparent",
              cursor: "pointer",
            }}
          >
            Dashboard Overview &amp; Alerts
          </button>
          <button
            onClick={() => setActiveTab("all-businesses")}
            style={{
              background: "none",
              border: "none",
              padding: "0.8rem 0",
              fontSize: "1rem",
              fontWeight: 700,
              color: activeTab === "all-businesses" ? "#FF6B00" : "#64748b",
              borderBottom: activeTab === "all-businesses" ? "3px solid #FF6B00" : "3px solid transparent",
              cursor: "pointer",
            }}
          >
            Manage All Businesses ({stats?.totalBusinesses || 0})
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            style={{
              background: "none",
              border: "none",
              padding: "0.8rem 0",
              fontSize: "1rem",
              fontWeight: 700,
              color: activeTab === "categories" ? "#FF6B00" : "#64748b",
              borderBottom: activeTab === "categories" ? "3px solid #FF6B00" : "3px solid transparent",
              cursor: "pointer",
            }}
          >
            Manage Categories
          </button>
        </div>

        {/* ── TAB 1: OVERVIEW & ALERTS ── */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {/* ALERT SECTION 1: Businesses Near End of Subscription */}
            <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #fef08a", padding: "1.8rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.2rem" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#fef3c7", color: "#b45309", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Clock size={18} />
                </div>
                <div>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#92400e" }}>
                    Businesses Near End of Subscription (&lt;15 Days Remaining)
                  </h2>
                  <p style={{ fontSize: "0.82rem", color: "#b45309" }}>
                    These partners will expire soon. Contact them or 1-click extend their listing to keep their top SEO rank.
                  </p>
                </div>
              </div>

              {expiringSoonList.length === 0 ? (
                <div style={{ padding: "1.5rem", textAlign: "center", color: "#059669", background: "#ecfdf5", borderRadius: "10px" }}>
                  ✓ No businesses currently near expiry. All active partners are well within duration.
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                    <thead>
                      <tr style={{ background: "#fffbeb", borderBottom: "1px solid #fef3c7", textAlign: "left", color: "#92400e" }}>
                        <th style={{ padding: "0.75rem" }}>Business Name</th>
                        <th style={{ padding: "0.75rem" }}>Category</th>
                        <th style={{ padding: "0.75rem" }}>Owner &amp; Phone</th>
                        <th style={{ padding: "0.75rem" }}>Expiry Date</th>
                        <th style={{ padding: "0.75rem" }}>Current Plan</th>
                        <th style={{ padding: "0.75rem" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expiringSoonList.map((biz) => (
                        <tr key={biz._id} style={{ borderBottom: "1px solid #fef3c7" }}>
                          <td style={{ padding: "0.75rem", fontWeight: 700, color: "#0f172a" }}>
                            {biz.name}
                          </td>
                          <td style={{ padding: "0.75rem", color: "#64748b" }}>{biz.categoryName}</td>
                          <td style={{ padding: "0.75rem" }}>
                            <div style={{ fontWeight: 600 }}>{biz.owner?.name}</div>
                            <div style={{ fontSize: "0.8rem", color: "#059669" }}>{biz.contact?.phone}</div>
                          </td>
                          <td style={{ padding: "0.75rem", color: "#b45309", fontWeight: 700 }}>
                            {new Date(biz.subscription.expiryDate).toLocaleDateString()}
                          </td>
                          <td style={{ padding: "0.75rem" }}>
                            <span style={{ background: "#fef3c7", color: "#b45309", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700 }}>
                              {biz.subscription.planDuration}
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem" }}>
                            <button
                              onClick={() => handleRenewOneYear(biz._id)}
                              style={{
                                background: "#FF6B00",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                padding: "0.4rem 0.8rem",
                                fontSize: "0.8rem",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              Extend 1 Year
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* ALERT SECTION 2: Out of Subscription (Expired) Businesses */}
            <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #fecaca", padding: "1.8rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.2rem" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#fee2e2", color: "#b91c1c", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#991b1b" }}>
                    Out of Subscription Businesses (Expired)
                  </h2>
                  <p style={{ fontSize: "0.82rem", color: "#b91c1c" }}>
                    These businesses have reached their plan end date. They are automatically deprioritized in search
                    results.
                  </p>
                </div>
              </div>

              {outOfSubscriptionList.length === 0 ? (
                <div style={{ padding: "1.5rem", textAlign: "center", color: "#059669", background: "#ecfdf5", borderRadius: "10px" }}>
                  ✓ No expired businesses. All subscriptions are in good standing.
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                    <thead>
                      <tr style={{ background: "#fef2f2", borderBottom: "1px solid #fee2e2", textAlign: "left", color: "#991b1b" }}>
                        <th style={{ padding: "0.75rem" }}>Business Name</th>
                        <th style={{ padding: "0.75rem" }}>Category</th>
                        <th style={{ padding: "0.75rem" }}>Owner &amp; Phone</th>
                        <th style={{ padding: "0.75rem" }}>Expired On</th>
                        <th style={{ padding: "0.75rem" }}>Status</th>
                        <th style={{ padding: "0.75rem" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {outOfSubscriptionList.map((biz) => (
                        <tr key={biz._id} style={{ borderBottom: "1px solid #fee2e2" }}>
                          <td style={{ padding: "0.75rem", fontWeight: 700, color: "#0f172a" }}>
                            {biz.name}
                          </td>
                          <td style={{ padding: "0.75rem", color: "#64748b" }}>{biz.categoryName}</td>
                          <td style={{ padding: "0.75rem" }}>
                            <div style={{ fontWeight: 600 }}>{biz.owner?.name}</div>
                            <div style={{ fontSize: "0.8rem", color: "#059669" }}>{biz.contact?.phone}</div>
                          </td>
                          <td style={{ padding: "0.75rem", color: "#b91c1c", fontWeight: 700 }}>
                            {new Date(biz.subscription.expiryDate).toLocaleDateString()}
                          </td>
                          <td style={{ padding: "0.75rem" }}>
                            <span style={{ background: "#fee2e2", color: "#b91c1c", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700 }}>
                              EXPIRED
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem" }}>
                            <button
                              onClick={() => handleRenewOneYear(biz._id)}
                              style={{
                                background: "#059669",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                padding: "0.4rem 0.8rem",
                                fontSize: "0.8rem",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              Re-Activate 1 Year
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* SECTION 3: Recently Added Businesses List */}
            <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "1.8rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a" }}>
                    Recently Added Businesses
                  </h2>
                  <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    Chronological list of registered businesses with registered dates and duration.
                  </p>
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", textAlign: "left", color: "#475569" }}>
                      <th style={{ padding: "0.75rem" }}>Business Name</th>
                      <th style={{ padding: "0.75rem" }}>Category</th>
                      <th style={{ padding: "0.75rem" }}>Owner</th>
                      <th style={{ padding: "0.75rem" }}>Registered Date</th>
                      <th style={{ padding: "0.75rem" }}>Plan Duration</th>
                      <th style={{ padding: "0.75rem" }}>Amount</th>
                      <th style={{ padding: "0.75rem" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentlyAdded.map((biz) => (
                      <tr key={biz._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "0.75rem", fontWeight: 700, color: "#0f172a" }}>
                          <Link href={`/business/${biz.slug}`} style={{ color: "#0f172a", textDecoration: "none" }}>
                            {biz.name} ↗
                          </Link>
                        </td>
                        <td style={{ padding: "0.75rem", color: "#64748b" }}>{biz.categoryName}</td>
                        <td style={{ padding: "0.75rem", color: "#334155" }}>{biz.owner?.name}</td>
                        <td style={{ padding: "0.75rem", color: "#64748b" }}>
                          {new Date(biz.subscription.registeredDate || biz.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: "0.75rem", fontWeight: 600 }}>{biz.subscription.planDuration}</td>
                        <td style={{ padding: "0.75rem", color: "#059669", fontWeight: 700 }}>
                          ₹{biz.subscription.amount?.toLocaleString()}
                        </td>
                        <td style={{ padding: "0.75rem" }}>
                          <span
                            style={{
                              background: biz.subscription.status === "active" ? "#ecfdf5" : biz.subscription.status === "expiring_soon" ? "#fef3c7" : "#fee2e2",
                              color: biz.subscription.status === "active" ? "#059669" : biz.subscription.status === "expiring_soon" ? "#b45309" : "#b91c1c",
                              padding: "0.2rem 0.5rem",
                              borderRadius: "4px",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                            }}
                          >
                            {biz.subscription.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: MANAGE ALL BUSINESSES ── */}
        {activeTab === "all-businesses" && (
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "1.8rem" }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.4rem 0.8rem", width: "320px" }}>
                <Search size={16} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search by name, phone or email..."
                  value={bizSearch}
                  onChange={(e) => setBizSearch(e.target.value)}
                  style={{ border: "none", outline: "none", background: "transparent", width: "100%", fontSize: "0.88rem" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Filter Status:</span>
                <select
                  value={bizFilter}
                  onChange={(e) => setBizFilter(e.target.value)}
                  style={{ padding: "0.45rem 0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.88rem" }}
                >
                  <option value="all">All Subscriptions</option>
                  <option value="active">Active Only</option>
                  <option value="expiring_soon">Expiring Soon</option>
                  <option value="expired">Expired Only</option>
                </select>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", textAlign: "left", color: "#475569" }}>
                    <th style={{ padding: "0.75rem" }}>Business</th>
                    <th style={{ padding: "0.75rem" }}>Category</th>
                    <th style={{ padding: "0.75rem" }}>Contact</th>
                    <th style={{ padding: "0.75rem" }}>Views / Calls</th>
                    <th style={{ padding: "0.75rem" }}>Plan &amp; Expiry</th>
                    <th style={{ padding: "0.75rem" }}>SEO Priority</th>
                    <th style={{ padding: "0.75rem" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allBusinesses.map((b) => (
                    <tr key={b._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "0.75rem" }}>
                        <div style={{ fontWeight: 700, color: "#0f172a" }}>{b.name}</div>
                        <div style={{ fontSize: "0.78rem", color: "#64748b" }}>{b.location?.area}, Shimoga</div>
                      </td>
                      <td style={{ padding: "0.75rem", color: "#64748b" }}>{b.categoryName}</td>
                      <td style={{ padding: "0.75rem" }}>
                        <div>{b.contact?.phone}</div>
                        <div style={{ fontSize: "0.78rem", color: "#64748b" }}>{b.owner?.email}</div>
                      </td>
                      <td style={{ padding: "0.75rem" }}>
                        <b>{b.metrics?.totalViews || 0} views</b>
                        <div style={{ fontSize: "0.78rem", color: "#059669" }}>{b.metrics?.callClicks || 0} calls</div>
                      </td>
                      <td style={{ padding: "0.75rem" }}>
                        <div style={{ fontWeight: 600 }}>{b.subscription?.planDuration}</div>
                        <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
                          Exp: {new Date(b.subscription?.expiryDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td style={{ padding: "0.75rem" }}>
                        <span style={{ fontWeight: 700, color: b.isFeatured ? "#ea580c" : "#64748b" }}>
                          {b.priorityScore} {b.isFeatured ? "[Top Partner]" : ""}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem" }}>
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <button
                            onClick={() => handleRenewOneYear(b._id)}
                            title="Renew 1 Year"
                            style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#059669", padding: "0.3rem 0.5rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.78rem", fontWeight: 700 }}
                          >
                            +1 Yr
                          </button>
                          <button
                            onClick={() => handleDeleteBusiness(b._id, b.name)}
                            title="Delete"
                            style={{ background: "#fee2e2", border: "1px solid #fecaca", color: "#b91c1c", padding: "0.3rem 0.5rem", borderRadius: "6px", cursor: "pointer" }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 3: MANAGE CATEGORIES ── */}
        {activeTab === "categories" && (
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "2rem" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", marginBottom: "1rem" }}>
              Add New Business Category
            </h2>
            <form onSubmit={handleCreateCategory} style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
              <input
                type="text"
                required
                placeholder="Category Name (e.g. Legal & Notary Services)"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                style={{ flex: "1 1 250px", padding: "0.6rem 0.9rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              />
              <input
                type="text"
                placeholder="Icon Identifier (e.g. Briefcase)"
                value={newCatEmoji}
                onChange={(e) => setNewCatEmoji(e.target.value)}
                style={{ width: "180px", padding: "0.6rem 0.9rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
              />
              <input
                type="text"
                placeholder="Short Description"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                style={{ flex: "2 1 300px", padding: "0.6rem 0.9rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              />
              <button
                type="submit"
                style={{ background: "#FF6B00", color: "#fff", border: "none", padding: "0.6rem 1.4rem", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}
              >
                + Add Category
              </button>
            </form>
          </div>
        )}

        {/* ── ADMIN MODAL: DIRECT BUSINESS CREATION ── */}
        {showAddModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(15, 23, 42, 0.65)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "1rem",
              backdropFilter: "blur(2px)",
            }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                maxWidth: "740px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
                padding: "2rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "1rem" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "#ea580c", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    ADMIN DIRECT ENTRY
                  </span>
                  <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", marginTop: "0.15rem" }}>
                    Add Verified Business Listing
                  </h2>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#64748b",
                    padding: "0.3rem",
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAdminCreateBusiness} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Name & Category */}
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="form-label">Business / Clinic Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sahyadri Diagnostics"
                      value={newBizName}
                      onChange={(e) => setNewBizName(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Category *</label>
                    <select
                      value={newBizCat}
                      onChange={(e) => setNewBizCat(e.target.value)}
                      className="form-select"
                      required
                    >
                      {categoriesList.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* City & Locality */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="form-label">City *</label>
                    <select
                      value={newBizCity}
                      onChange={(e) => {
                        setNewBizCity(e.target.value);
                        const areas = getCityAreas(e.target.value);
                        if (areas && areas.length > 1) {
                          setNewBizArea(areas[1]);
                        }
                      }}
                      className="form-select"
                      required
                    >
                      {CITIES_DATA.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name} ({c.district})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Locality / Area *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kuvempu Road"
                      value={newBizArea}
                      onChange={(e) => setNewBizArea(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label className="form-label">Full Physical Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Near Old Bus Stand, B.H. Road"
                    value={newBizAddress}
                    onChange={(e) => setNewBizAddress(e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Phone & WhatsApp */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="form-label">Primary Contact Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 94481 ..."
                      value={newBizPhone}
                      onChange={(e) => setNewBizPhone(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">WhatsApp Number for Leads</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9448100001"
                      value={newBizWhatsapp}
                      onChange={(e) => setNewBizWhatsapp(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Email & Plan */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="form-label">Owner / Contact Email</label>
                    <input
                      type="email"
                      placeholder="contact@business.com"
                      value={newBizEmail}
                      onChange={(e) => setNewBizEmail(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Subscription Plan</label>
                    <select
                      value={newBizPlan}
                      onChange={(e) => setNewBizPlan(e.target.value as any)}
                      className="form-select"
                    >
                      <option value="1 year">1 Year Elite (₹8,999)</option>
                      <option value="6 months">6 Months Growth (₹4,999)</option>
                      <option value="1 month">1 Month Starter (₹999)</option>
                    </select>
                  </div>
                </div>

                {/* Tagline */}
                <div>
                  <label className="form-label">Short Tagline (Search Snippet)</label>
                  <input
                    type="text"
                    placeholder="e.g. Premier multi-specialty diagnostics & emergency care"
                    value={newBizTagline}
                    onChange={(e) => setNewBizTagline(e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="form-label">Business Description</label>
                  <textarea
                    rows={2}
                    placeholder="Detailed description of services offered, facilities, and working hours..."
                    value={newBizDesc}
                    onChange={(e) => setNewBizDesc(e.target.value)}
                    className="form-textarea"
                  />
                </div>

                {/* Verified & Featured Toggles */}
                <div style={{ display: "flex", gap: "1.5rem", background: "#f8fafc", padding: "0.75rem 1rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", cursor: "pointer", fontWeight: 600, color: "#0f172a" }}>
                    <input
                      type="checkbox"
                      checked={newBizVerified}
                      onChange={(e) => setNewBizVerified(e.target.checked)}
                    />
                    <span>Verified Partner Badge</span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", cursor: "pointer", fontWeight: 600, color: "#ea580c" }}>
                    <input
                      type="checkbox"
                      checked={newBizFeatured}
                      onChange={(e) => setNewBizFeatured(e.target.checked)}
                    />
                    <span>Featured Partner (Top #1 SEO Ranking)</span>
                  </label>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem", borderTop: "1px solid #e2e8f0", paddingTop: "1rem" }}>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn-secondary"
                    style={{ padding: "0.6rem 1.25rem", fontSize: "0.88rem" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingBiz}
                    className="btn-primary"
                    style={{ padding: "0.6rem 1.5rem", fontSize: "0.88rem" }}
                  >
                    {submittingBiz ? "Creating Business..." : "Create & Publish Listing"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
