"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { adminAPI, categoryAPI } from "@/lib/api";
import { CITIES_DATA } from "@/data/cities";
import {
  LayoutDashboard,
  MessageSquare,
  Shield,
  Users,
  UserCheck,
  Building2,
  FileText,
  Check,
  ExternalLink,
  LogOut,
  Plus,
  Search,
  RefreshCw,
  Trash2,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  X,
  Clock,
  TrendingUp,
  AlertTriangle,
  Layers,
  Store,
} from "lucide-react";

type NavTab =
  | "dashboard"
  | "enquiries"
  | "vendors"
  | "businesses"
  | "categories"
  | "employees"
  | "users"
  | "activity-logs";

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, logout, switchRoleDemo } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = (dateStr?: string | Date) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "-";
      return d.toISOString().slice(0, 10);
    } catch {
      return "-";
    }
  };

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");

  // Dashboard Stats & Lists
  const [stats, setStats] = useState<any | null>(null);
  const [recentlyAdded, setRecentlyAdded] = useState<any[]>([]);
  const [expiringSoonList, setExpiringSoonList] = useState<any[]>([]);
  const [outOfSubscriptionList, setOutOfSubscriptionList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // All Businesses / Directory tab
  const [allBusinesses, setAllBusinesses] = useState<any[]>([]);
  const [bizSearch, setBizSearch] = useState("");
  const [bizCityFilter, setBizCityFilter] = useState("all");
  const [bizFilter, setBizFilter] = useState("all");

  // Enquiries / Leads tab
  const [leadsList, setLeadsList] = useState<any[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);

  // Users & Staff tab
  const [usersList, setUsersList] = useState<any[]>([]);

  // Activity Logs tab
  const [activityLogs, setActivityLogs] = useState<any[]>([]);

  // Category list & category creation
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [creatingCat, setCreatingCat] = useState(false);

  // Direct Creation Modal State
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

  // Load Dashboard Data
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

  // Load All Businesses
  const loadAllBusinesses = async () => {
    try {
      const res = await adminAPI.getBusinesses({
        search: bizSearch,
        city: bizCityFilter !== "all" ? bizCityFilter : "",
        subscriptionStatus: bizFilter !== "all" ? bizFilter : "",
      });
      if (res.success && res.data) {
        setAllBusinesses(res.data);
      }
    } catch (err) {
      console.error("Error loading businesses:", err);
    }
  };

  // Load Users List
  const loadUsers = async () => {
    try {
      const res = await adminAPI.getUsers();
      if (res.success && res.data) {
        setUsersList(res.data);
      }
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  // Load Enquiries / Leads
  const loadLeads = async () => {
    setLeadsLoading(true);
    try {
      const res = await adminAPI.getLeads();
      if (res.success && res.data) {
        setLeadsList(res.data);
      }
    } catch (err) {
      console.error("Error loading leads:", err);
    } finally {
      setLeadsLoading(false);
    }
  };

  // Load Activity Logs
  const loadActivityLogs = async () => {
    try {
      const res = await adminAPI.getActivityLogs();
      if (res.success && res.data) {
        setActivityLogs(res.data);
      }
    } catch (err) {
      console.error("Error loading activity logs:", err);
    }
  };

  // Load Categories
  const loadCategories = async () => {
    try {
      const res = await categoryAPI.getAll();
      if (res.success && res.data) {
        setCategoriesList(res.data);
        if (res.data.length > 0 && !newBizCat) {
          setNewBizCat(res.data[0]._id);
        }
      }
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  // Initial Load on Auth
  useEffect(() => {
    if (user?.role === "admin") {
      loadAdminDashboard();
      loadAllBusinesses();
      loadUsers();
      loadLeads();
      loadActivityLogs();
      loadCategories();
    }
  }, [user]);

  // Reload businesses on filter change
  useEffect(() => {
    if ((activeTab === "businesses" || activeTab === "vendors") && user?.role === "admin") {
      loadAllBusinesses();
    }
  }, [activeTab, bizSearch, bizCityFilter, bizFilter]);

  // Handlers
  const handleUpdateStatus = async (bizId: string, newStatus: string) => {
    try {
      await adminAPI.updateBusiness(bizId, { status: newStatus });
      await loadAdminDashboard();
      await loadAllBusinesses();
    } catch (err: any) {
      alert(err.message || "Failed to update business status");
    }
  };

  const handleToggleVerified = async (bizId: string, current: boolean) => {
    try {
      await adminAPI.updateBusiness(bizId, { isVerified: !current });
      await loadAdminDashboard();
      await loadAllBusinesses();
    } catch (err: any) {
      alert(err.message || "Failed to toggle verification");
    }
  };

  const handleToggleFeatured = async (bizId: string, current: boolean) => {
    try {
      await adminAPI.updateBusiness(bizId, { isFeatured: !current });
      await loadAdminDashboard();
      await loadAllBusinesses();
    } catch (err: any) {
      alert(err.message || "Failed to toggle top partner status");
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
      alert("Listing subscription renewed for 1 Year!");
      await loadAdminDashboard();
      await loadAllBusinesses();
    } catch (err: any) {
      alert(err.message || "Failed to renew subscription");
    }
  };

  const handleDeleteBusiness = async (bizId: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}" from the directory?`))
      return;
    try {
      await adminAPI.deleteBusiness(bizId);
      await loadAdminDashboard();
      await loadAllBusinesses();
    } catch (err: any) {
      alert(err.message || "Failed to delete listing");
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCreatingCat(true);
    try {
      await adminAPI.createCategory({
        name: newCatName.trim(),
        description: newCatDesc.trim(),
      });
      alert(`Category "${newCatName}" created successfully!`);
      setNewCatName("");
      setNewCatDesc("");
      await loadCategories();
    } catch (err: any) {
      alert(err.message || "Failed to create category");
    } finally {
      setCreatingCat(false);
    }
  };

  const handleAdminCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName.trim() || !newBizPhone.trim()) {
      alert("Business Name and Phone number are required.");
      return;
    }
    setSubmittingBiz(true);
    try {
      const selectedCatObj = categoriesList.find(
        (c) => c._id === newBizCat || c.slug === newBizCat
      );
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

      alert(`Business "${newBizName}" added and published successfully!`);
      setShowAddModal(false);
      setNewBizName("");
      setNewBizPhone("");
      setNewBizWhatsapp("");
      setNewBizAddress("");
      setNewBizEmail("");
      setNewBizTagline("");
      setNewBizDesc("");
      await loadAdminDashboard();
      await loadAllBusinesses();
    } catch (err: any) {
      alert(err.message || "Failed to create listing.");
    } finally {
      setSubmittingBiz(false);
    }
  };

  // Guard against SSR / Client Hydration Mismatches
  if (!mounted || authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0c1523",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, sans-serif)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #ea580c 0%, #0284c7 100%)",
              color: "#ffffff",
              fontWeight: 900,
              fontSize: "1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem",
              boxShadow: "0 4px 14px rgba(234, 88, 12, 0.35)",
            }}
          >
            S
          </div>
          <div style={{ color: "#ffffff", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.3rem" }}>
            Shivamogga Services
          </div>
          <div style={{ color: "#64748b", fontSize: "0.8rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Loading Directory Admin Portal...
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated as admin, show direct Super Admin Demo access screen
  if (!user || user.role !== "admin") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c1523",
          color: "#ffffff",
          padding: "2rem",
        }}
      >
        <div
          style={{
            background: "#132238",
            padding: "2.5rem",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            maxWidth: "460px",
            width: "100%",
            textAlign: "center",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.6rem",
              marginBottom: "1.25rem",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #ea580c 0%, #0284c7 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontWeight: 900,
                fontSize: "1.1rem",
              }}
            >
              S
            </div>
            <div style={{ textAlign: "left", lineHeight: 1.15 }}>
              <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#ffffff" }}>
                Shivamogga <span style={{ color: "#ea580c" }}>Services</span>
              </div>
              <div
                style={{
                  fontSize: "0.62rem",
                  letterSpacing: "0.08em",
                  color: "#94a3b8",
                  textTransform: "uppercase",
                }}
              >
                Directory Admin Portal
              </div>
            </div>
          </div>

          <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Super Admin Access Required
          </h2>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "0.88rem",
              lineHeight: 1.5,
              marginBottom: "1.75rem",
            }}
          >
            Access the master directory system dashboard to manage verified merchants, businesses,
            staff, customer inquiries, and multi-city operations.
          </p>

          <button
            onClick={() => switchRoleDemo("admin")}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              background: "#0284c7",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              fontWeight: 700,
              fontSize: "0.92rem",
              cursor: "pointer",
              marginBottom: "0.75rem",
              transition: "background 0.2s ease",
            }}
          >
            Enter as Super Admin (Master Access)
          </button>

          <Link
            href="/"
            style={{
              display: "inline-block",
              color: "#94a3b8",
              fontSize: "0.82rem",
              textDecoration: "none",
              marginTop: "0.5rem",
            }}
          >
            &larr; Return to Directory Home
          </Link>
        </div>
      </div>
    );
  }

  // Derive counts from live state
  const pendingInquiriesCount = stats?.totalLeads || leadsList.length || 0;
  const activeAdminsCount =
    usersList.filter((u) => u.role === "admin").length || 1;
  const registeredUsersCount = usersList.length || 0;
  const activeBusinessesCount =
    stats?.activeBusinesses ||
    allBusinesses.filter((b) => b.subscription?.status === "active").length ||
    0;
  const verifiedMerchantsCount =
    allBusinesses.filter((b) => b.isVerified).length || 0;
  const totalBusinessesCount =
    stats?.totalBusinesses || allBusinesses.length || 0;

  // Breadcrumb generation based on active tab
  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "GENERAL OVERVIEW";
      case "enquiries":
        return "CUSTOMER INQUIRIES & LEADS";
      case "vendors":
        return "VENDORS & MERCHANTS";
      case "businesses":
        return "ALL BUSINESS LISTINGS";
      case "categories":
        return "SERVICE CATEGORIES";
      case "employees":
        return "STAFF & OPERATORS";
      case "users":
        return "REGISTERED USERS";
      case "activity-logs":
        return "SYSTEM AUDIT TRAIL";
      default:
        return "GENERAL OVERVIEW";
    }
  };

  const adminDisplayName = user?.name || "Shivamogga Directory Admin";
  const adminInitial = adminDisplayName.charAt(0).toUpperCase();

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        background: "#eef2f6",
        fontFamily: "var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, sans-serif)",
      }}
    >
      {/* ═══════════════════════════════════════════════════════
          LEFT SIDEBAR (Fixed, Steady & Immovable)
         ═══════════════════════════════════════════════════════ */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "250px",
          height: "100vh",
          background: "#0c1523",
          color: "#94a3b8",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid rgba(255, 255, 255, 0.06)",
          zIndex: 50,
          overflow: "hidden",
        }}
      >
        {/* Brand Logo Header */}
        <div
          style={{
            padding: "1.4rem 1.4rem 1.6rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          {/* Real Karnataka Directory Shield Emblem */}
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #ea580c 0%, #0284c7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontWeight: 900,
              fontSize: "1.1rem",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(234, 88, 12, 0.3)",
            }}
          >
            S
          </div>

          <div style={{ lineHeight: 1.15 }}>
            <div
              style={{
                fontSize: "1.05rem",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.01em",
              }}
            >
              Shivamogga <span style={{ color: "#ea580c" }}>Services</span>
            </div>
            <div
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.06em",
                color: "#64748b",
                textTransform: "uppercase",
                fontWeight: 600,
                marginTop: "0.15rem",
              }}
            >
              Directory Network
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav
          style={{
            flex: 1,
            padding: "1.2rem 0",
            display: "flex",
            flexDirection: "column",
            gap: "0.15rem",
            overflowY: "auto",
          }}
        >
          {/* 1. DASHBOARD */}
          <button
            onClick={() => setActiveTab("dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              padding: "0.75rem 1.4rem",
              background:
                activeTab === "dashboard"
                  ? "rgba(56, 189, 248, 0.08)"
                  : "transparent",
              color: activeTab === "dashboard" ? "#ffffff" : "#94a3b8",
              border: "none",
              borderLeft:
                activeTab === "dashboard"
                  ? "3px solid #38bdf8"
                  : "3px solid transparent",
              fontSize: "0.78rem",
              fontWeight: activeTab === "dashboard" ? 700 : 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              transition: "all 0.15s ease",
            }}
          >
            <LayoutDashboard
              size={17}
              color={activeTab === "dashboard" ? "#38bdf8" : "#64748b"}
            />
            <span>DASHBOARD</span>
          </button>

          {/* 2. ENQUIRIES */}
          <button
            onClick={() => setActiveTab("enquiries")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              padding: "0.75rem 1.4rem",
              background:
                activeTab === "enquiries"
                  ? "rgba(56, 189, 248, 0.08)"
                  : "transparent",
              color: activeTab === "enquiries" ? "#ffffff" : "#94a3b8",
              border: "none",
              borderLeft:
                activeTab === "enquiries"
                  ? "3px solid #38bdf8"
                  : "3px solid transparent",
              fontSize: "0.78rem",
              fontWeight: activeTab === "enquiries" ? 700 : 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              transition: "all 0.15s ease",
            }}
          >
            <MessageSquare
              size={17}
              color={activeTab === "enquiries" ? "#38bdf8" : "#64748b"}
            />
            <span>ENQUIRIES</span>
          </button>

          {/* 3. MANAGE VENDORS */}
          <button
            onClick={() => setActiveTab("vendors")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              padding: "0.75rem 1.4rem",
              background:
                activeTab === "vendors"
                  ? "rgba(56, 189, 248, 0.08)"
                  : "transparent",
              color: activeTab === "vendors" ? "#ffffff" : "#94a3b8",
              border: "none",
              borderLeft:
                activeTab === "vendors"
                  ? "3px solid #38bdf8"
                  : "3px solid transparent",
              fontSize: "0.78rem",
              fontWeight: activeTab === "vendors" ? 700 : 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              transition: "all 0.15s ease",
            }}
          >
            <Store
              size={17}
              color={activeTab === "vendors" ? "#38bdf8" : "#64748b"}
            />
            <span>MANAGE VENDORS</span>
          </button>

          {/* 4. ALL BUSINESSES */}
          <button
            onClick={() => setActiveTab("businesses")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              padding: "0.75rem 1.4rem",
              background:
                activeTab === "businesses"
                  ? "rgba(56, 189, 248, 0.08)"
                  : "transparent",
              color: activeTab === "businesses" ? "#ffffff" : "#94a3b8",
              border: "none",
              borderLeft:
                activeTab === "businesses"
                  ? "3px solid #38bdf8"
                  : "3px solid transparent",
              fontSize: "0.78rem",
              fontWeight: activeTab === "businesses" ? 700 : 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              transition: "all 0.15s ease",
            }}
          >
            <Building2
              size={17}
              color={activeTab === "businesses" ? "#38bdf8" : "#64748b"}
            />
            <span>ALL BUSINESSES</span>
          </button>

          {/* 5. CATEGORIES */}
          <button
            onClick={() => setActiveTab("categories")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              padding: "0.75rem 1.4rem",
              background:
                activeTab === "categories"
                  ? "rgba(56, 189, 248, 0.08)"
                  : "transparent",
              color: activeTab === "categories" ? "#ffffff" : "#94a3b8",
              border: "none",
              borderLeft:
                activeTab === "categories"
                  ? "3px solid #38bdf8"
                  : "3px solid transparent",
              fontSize: "0.78rem",
              fontWeight: activeTab === "categories" ? 700 : 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              transition: "all 0.15s ease",
            }}
          >
            <Layers
              size={17}
              color={activeTab === "categories" ? "#38bdf8" : "#64748b"}
            />
            <span>CATEGORIES</span>
          </button>

          {/* 6. MANAGE EMPLOYEES */}
          <button
            onClick={() => setActiveTab("employees")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              padding: "0.75rem 1.4rem",
              background:
                activeTab === "employees"
                  ? "rgba(56, 189, 248, 0.08)"
                  : "transparent",
              color: activeTab === "employees" ? "#ffffff" : "#94a3b8",
              border: "none",
              borderLeft:
                activeTab === "employees"
                  ? "3px solid #38bdf8"
                  : "3px solid transparent",
              fontSize: "0.78rem",
              fontWeight: activeTab === "employees" ? 700 : 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              transition: "all 0.15s ease",
            }}
          >
            <UserCheck
              size={17}
              color={activeTab === "employees" ? "#38bdf8" : "#64748b"}
            />
            <span>MANAGE EMPLOYEES</span>
          </button>

          {/* 7. MANAGE USERS */}
          <button
            onClick={() => setActiveTab("users")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              padding: "0.75rem 1.4rem",
              background:
                activeTab === "users"
                  ? "rgba(56, 189, 248, 0.08)"
                  : "transparent",
              color: activeTab === "users" ? "#ffffff" : "#94a3b8",
              border: "none",
              borderLeft:
                activeTab === "users"
                  ? "3px solid #38bdf8"
                  : "3px solid transparent",
              fontSize: "0.78rem",
              fontWeight: activeTab === "users" ? 700 : 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              transition: "all 0.15s ease",
            }}
          >
            <Users
              size={17}
              color={activeTab === "users" ? "#38bdf8" : "#64748b"}
            />
            <span>MANAGE USERS</span>
          </button>

          {/* 8. ACTIVITY LOGS */}
          <button
            onClick={() => setActiveTab("activity-logs")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              padding: "0.75rem 1.4rem",
              background:
                activeTab === "activity-logs"
                  ? "rgba(56, 189, 248, 0.08)"
                  : "transparent",
              color: activeTab === "activity-logs" ? "#ffffff" : "#94a3b8",
              border: "none",
              borderLeft:
                activeTab === "activity-logs"
                  ? "3px solid #38bdf8"
                  : "3px solid transparent",
              fontSize: "0.78rem",
              fontWeight: activeTab === "activity-logs" ? 700 : 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              transition: "all 0.15s ease",
            }}
          >
            <FileText
              size={17}
              color={activeTab === "activity-logs" ? "#38bdf8" : "#64748b"}
            />
            <span>ACTIVITY LOGS</span>
          </button>
        </nav>

        {/* Sidebar Footer Actions */}
        <div
          style={{
            padding: "1rem 1.4rem 1.25rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            display: "flex",
            flexDirection: "column",
            gap: "0.45rem",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              color: "#94a3b8",
              textDecoration: "none",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              padding: "0.4rem 0",
              transition: "color 0.15s ease",
            }}
          >
            <ExternalLink size={15} />
            <span>RETURN TO SITE</span>
          </Link>

          <button
            onClick={logout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              color: "#94a3b8",
              background: "transparent",
              border: "none",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              padding: "0.4rem 0",
              cursor: "pointer",
              textAlign: "left",
              transition: "color 0.15s ease",
            }}
          >
            <LogOut size={15} />
            <span>LOGOUT</span>
          </button>

          <div
            style={{
              fontSize: "0.65rem",
              color: "rgba(255, 255, 255, 0.25)",
              letterSpacing: "0.04em",
              marginTop: "0.85rem",
              textTransform: "uppercase",
            }}
          >
            &copy; 2026 SHIVAMOGGA SERVICES
          </div>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════
          RIGHT MAIN WRAPPER (Scrollable with Fixed Sidebar)
         ═══════════════════════════════════════════════════════ */}
      <div
        style={{
          marginLeft: "250px",
          width: "calc(100% - 250px)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Top Header System Bar (Sticky) */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 40,
            height: "60px",
            background: "#ffffff",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 2.25rem",
            flexShrink: 0,
            boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
          }}
        >
          {/* Breadcrumbs */}
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ color: "#94a3b8" }}>SYSTEM</span>
            <span style={{ color: "#cbd5e1" }}>/</span>
            <span style={{ color: "#0f172a" }}>DASHBOARD</span>
            <span style={{ color: "#cbd5e1" }}>/</span>
            <span style={{ color: "#64748b" }}>{getBreadcrumbTitle()}</span>
          </div>

          {/* Right Profile Info */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <div style={{ textAlign: "right", lineHeight: 1.2 }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a" }}>
                {adminDisplayName}
              </div>
              <div
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  color: "#0284c7",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                SUPER ADMIN
              </div>
            </div>

            {/* Circular Avatar Initial */}
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#0284c7",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.95rem",
              }}
            >
              {adminInitial}
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "2rem 2.25rem 3rem",
            background: "#f1f5f9",
          }}
        >
          {/* Header Title Section */}
          <div style={{ marginBottom: "1.75rem" }}>
            <h1
              style={{
                fontSize: "1.85rem",
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.015em",
                marginBottom: "0.25rem",
              }}
            >
              System Dashboard
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.88rem", margin: 0 }}>
              Welcome back, {adminDisplayName.split(" ")[0]}. Here is the real-time operational
              status of your Karnataka local services directory.
            </p>
          </div>

          {/* ═══════════════════════════════════════════════════════
              ROW OF 6 STAT CARDS (Real Project Content & Metrics)
             ═══════════════════════════════════════════════════════ */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            {/* 1. PENDING INQUIRIES */}
            <div
              onClick={() => setActiveTab("enquiries")}
              style={{
                background: "#ffffff",
                borderRadius: "4px",
                border: "1px solid #e2e8f0",
                padding: "1.1rem 1.15rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                cursor: "pointer",
                transition: "transform 0.15s ease",
              }}
              title="View customer leads & inquiries"
            >
              <div>
                <div
                  style={{
                    fontSize: "1.85rem",
                    fontWeight: 800,
                    color: "#0f172a",
                    lineHeight: 1,
                  }}
                >
                  {pendingInquiriesCount}
                </div>
                <div
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    marginTop: "0.45rem",
                  }}
                >
                  PENDING INQUIRIES
                </div>
              </div>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "4px",
                  background: "#eef2f6",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MessageSquare size={16} />
              </div>
            </div>

            {/* 2. ACTIVE ADMINS */}
            <div
              onClick={() => setActiveTab("employees")}
              style={{
                background: "#ffffff",
                borderRadius: "4px",
                border: "1px solid #e2e8f0",
                padding: "1.1rem 1.15rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                cursor: "pointer",
              }}
              title="View system administrators"
            >
              <div>
                <div
                  style={{
                    fontSize: "1.85rem",
                    fontWeight: 800,
                    color: "#0f172a",
                    lineHeight: 1,
                  }}
                >
                  {activeAdminsCount}
                </div>
                <div
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    marginTop: "0.45rem",
                  }}
                >
                  ACTIVE ADMINS
                </div>
              </div>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "4px",
                  background: "#eef2f6",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Shield size={16} />
              </div>
            </div>

            {/* 3. REGISTERED USERS */}
            <div
              onClick={() => setActiveTab("users")}
              style={{
                background: "#ffffff",
                borderRadius: "4px",
                border: "1px solid #e2e8f0",
                padding: "1.1rem 1.15rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                cursor: "pointer",
              }}
              title="View all registered users"
            >
              <div>
                <div
                  style={{
                    fontSize: "1.85rem",
                    fontWeight: 800,
                    color: "#0f172a",
                    lineHeight: 1,
                  }}
                >
                  {registeredUsersCount}
                </div>
                <div
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    marginTop: "0.45rem",
                  }}
                >
                  REGISTERED USERS
                </div>
              </div>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "4px",
                  background: "#eef2f6",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Users size={16} />
              </div>
            </div>

            {/* 4. ACTIVE BUSINESSES */}
            <div
              onClick={() => setActiveTab("businesses")}
              style={{
                background: "#ffffff",
                borderRadius: "4px",
                border: "1px solid #e2e8f0",
                padding: "1.1rem 1.15rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                cursor: "pointer",
              }}
              title="View active directory listings"
            >
              <div>
                <div
                  style={{
                    fontSize: "1.85rem",
                    fontWeight: 800,
                    color: "#0f172a",
                    lineHeight: 1,
                  }}
                >
                  {activeBusinessesCount}
                </div>
                <div
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    marginTop: "0.45rem",
                  }}
                >
                  ACTIVE BUSINESSES
                </div>
              </div>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "4px",
                  background: "#eef2f6",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Building2 size={16} />
              </div>
            </div>

            {/* 5. VERIFIED MERCHANTS */}
            <div
              onClick={() => setActiveTab("businesses")}
              style={{
                background: "#ffffff",
                borderRadius: "4px",
                border: "1px solid #e2e8f0",
                padding: "1.1rem 1.15rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                cursor: "pointer",
              }}
              title="View verified local businesses"
            >
              <div>
                <div
                  style={{
                    fontSize: "1.85rem",
                    fontWeight: 800,
                    color: "#0f172a",
                    lineHeight: 1,
                  }}
                >
                  {verifiedMerchantsCount}
                </div>
                <div
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    marginTop: "0.45rem",
                  }}
                >
                  VERIFIED MERCHANTS
                </div>
              </div>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "4px",
                  background: "#eef2f6",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Check size={16} />
              </div>
            </div>

            {/* 6. TOTAL BUSINESSES */}
            <div
              onClick={() => setActiveTab("businesses")}
              style={{
                background: "#ffffff",
                borderRadius: "4px",
                border: "1px solid #e2e8f0",
                padding: "1.1rem 1.15rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                cursor: "pointer",
              }}
              title="View total listings"
            >
              <div>
                <div
                  style={{
                    fontSize: "1.85rem",
                    fontWeight: 800,
                    color: "#0f172a",
                    lineHeight: 1,
                  }}
                >
                  {totalBusinessesCount}
                </div>
                <div
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    marginTop: "0.45rem",
                  }}
                >
                  TOTAL BUSINESSES
                </div>
              </div>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "4px",
                  background: "#eef2f6",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Store size={16} />
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════
              TAB CONTENT VIEWS
             ═══════════════════════════════════════════════════════ */}

          {/* ── TAB 1: DASHBOARD ── */}
          {activeTab === "dashboard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
              {/* Action Toolbar */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#ffffff",
                  padding: "0.85rem 1.25rem",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a" }}>
                    Quick Management Actions
                  </span>
                </div>

                <div style={{ display: "flex", gap: "0.6rem" }}>
                  <button
                    onClick={loadAdminDashboard}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.5rem 0.9rem",
                      background: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      color: "#334155",
                      cursor: "pointer",
                    }}
                  >
                    <RefreshCw size={13} /> Refresh
                  </button>
                  <button
                    onClick={() => setShowAddModal(true)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.5rem 1rem",
                      background: "#0284c7",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    <Plus size={15} /> Add New Business
                  </button>
                </div>
              </div>

              {/* Recent Businesses Table */}
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  padding: "1.4rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: 700,
                        color: "#0f172a",
                        margin: 0,
                      }}
                    >
                      Recent Business Listings
                    </h3>
                    <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>
                      Latest local businesses and merchants onboarded to the directory
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("businesses")}
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      color: "#0284c7",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    View All &rarr;
                  </button>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "0.82rem",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          borderBottom: "1px solid #e2e8f0",
                          color: "#64748b",
                          textAlign: "left",
                        }}
                      >
                        <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>BUSINESS &amp; MERCHANT</th>
                        <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>LOCATION</th>
                        <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>CATEGORY</th>
                        <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>PHONE</th>
                        <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>STATUS</th>
                        <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>PLAN</th>
                        <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700, textAlign: "right" }}>
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentlyAdded.slice(0, 7).map((biz) => (
                        <tr
                          key={biz._id}
                          style={{
                            borderBottom: "1px solid #f1f5f9",
                            transition: "background 0.15s ease",
                          }}
                        >
                          <td style={{ padding: "0.75rem", fontWeight: 600, color: "#0f172a" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                              <img
                                src={
                                  biz.media?.coverImage ||
                                  biz.media?.logo ||
                                  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=150&q=80"
                                }
                                alt={biz.name}
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "4px",
                                  objectFit: "cover",
                                }}
                              />
                              <div>
                                <div style={{ fontWeight: 700 }}>{biz.name}</div>
                                <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                                  {biz.owner?.name || "Merchant Owner"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "0.75rem", color: "#475569" }}>
                            {biz.location?.area || biz.location?.city || "Shivamogga"}
                          </td>
                          <td style={{ padding: "0.75rem", color: "#475569" }}>
                            {biz.categoryName || "General"}
                          </td>
                          <td style={{ padding: "0.75rem", color: "#475569" }}>
                            {biz.contact?.phone || "-"}
                          </td>
                          <td style={{ padding: "0.75rem" }}>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "0.2rem 0.5rem",
                                borderRadius: "4px",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                background:
                                  biz.subscription?.status === "active"
                                    ? "#dcfce7"
                                    : "#fee2e2",
                                color:
                                  biz.subscription?.status === "active"
                                    ? "#15803d"
                                    : "#b91c1c",
                              }}
                            >
                              {biz.subscription?.status || "active"}
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem", color: "#475569", fontWeight: 600 }}>
                            {biz.subscription?.planDuration || "1 year"}
                          </td>
                          <td style={{ padding: "0.75rem", textAlign: "right" }}>
                            <div style={{ display: "inline-flex", gap: "0.35rem" }}>
                              <Link
                                href={`/business/${biz.slug}`}
                                target="_blank"
                                title="View public directory listing"
                                style={{
                                  padding: "0.35rem 0.55rem",
                                  background: "#f1f5f9",
                                  borderRadius: "4px",
                                  color: "#334155",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  textDecoration: "none",
                                }}
                              >
                                <ExternalLink size={13} />
                              </Link>
                              <button
                                onClick={() =>
                                  handleToggleVerified(biz._id, biz.isVerified)
                                }
                                title={
                                  biz.isVerified
                                    ? "Mark Unverified"
                                    : "Mark Verified"
                                }
                                style={{
                                  padding: "0.35rem 0.55rem",
                                  background: biz.isVerified ? "#dbeafe" : "#f1f5f9",
                                  color: biz.isVerified ? "#1d4ed8" : "#64748b",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  fontSize: "0.72rem",
                                  fontWeight: 600,
                                }}
                              >
                                {biz.isVerified ? "Verified" : "Verify"}
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteBusiness(biz._id, biz.name)
                                }
                                title="Delete listing"
                                style={{
                                  padding: "0.35rem 0.55rem",
                                  background: "#fee2e2",
                                  color: "#b91c1c",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                }}
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

              {/* Expiring Soon & Analytics */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.25rem",
                }}
              >
                {/* Expiring soon */}
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                    padding: "1.25rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.45rem",
                      color: "#b45309",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <AlertTriangle size={16} />
                    <span>Expiring Soon (&lt; 15 Days)</span>
                  </div>
                  {expiringSoonList.length === 0 ? (
                    <div style={{ color: "#64748b", fontSize: "0.82rem", padding: "1rem 0" }}>
                      No subscriptions expiring in the next 15 days.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                      {expiringSoonList.map((item) => (
                        <div
                          key={item._id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "0.6rem 0.8rem",
                            background: "#fef3c7",
                            borderRadius: "4px",
                            fontSize: "0.82rem",
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700, color: "#78350f" }}>
                              {item.name}
                            </div>
                            <div style={{ fontSize: "0.72rem", color: "#92400e" }}>
                              {item.contact?.phone} &bull; {item.location?.city}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRenewOneYear(item._id)}
                            style={{
                              padding: "0.3rem 0.65rem",
                              background: "#ea580c",
                              color: "#ffffff",
                              border: "none",
                              borderRadius: "4px",
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              cursor: "pointer",
                            }}
                          >
                            Renew 1 Yr
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Platform Traffic Analytics */}
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                    padding: "1.25rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.45rem",
                      color: "#0369a1",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <TrendingUp size={16} />
                    <span>Real-Time Interaction Metrics</span>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0.75rem",
                    }}
                  >
                    <div style={{ background: "#f8fafc", padding: "0.9rem", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                      <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a" }}>
                        {stats?.platformTraffic?.totalViews || 0}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                        Directory Page Views
                      </div>
                    </div>
                    <div style={{ background: "#f8fafc", padding: "0.9rem", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                      <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a" }}>
                        {stats?.platformTraffic?.totalCalls || 0}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                        Direct Telephone Taps
                      </div>
                    </div>
                    <div style={{ background: "#f8fafc", padding: "0.9rem", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                      <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a" }}>
                        {stats?.platformTraffic?.totalWhatsapp || 0}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                        WhatsApp Clicks
                      </div>
                    </div>
                    <div style={{ background: "#f8fafc", padding: "0.9rem", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                      <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a" }}>
                        &#8377;{(stats?.totalRevenue || 0).toLocaleString("en-IN")}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                        Platform Revenue
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2: ENQUIRIES ── */}
          {activeTab === "enquiries" && (
            <div
              style={{
                background: "#ffffff",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                padding: "1.4rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.25rem",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    Customer Enquiries &amp; Service Leads
                  </h3>
                  <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>
                    Direct messages and leads submitted by citizens to local doctors, contractors, and merchants
                  </p>
                </div>
                <button
                  onClick={loadLeads}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.45rem 0.85rem",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <RefreshCw size={13} /> Refresh Inquiries
                </button>
              </div>

              {leadsLoading ? (
                <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                  Loading customer inquiries...
                </div>
              ) : leadsList.length === 0 ? (
                <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                  No customer inquiries received yet.
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "0.82rem",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          borderBottom: "1px solid #e2e8f0",
                          color: "#64748b",
                          textAlign: "left",
                        }}
                      >
                        <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>CUSTOMER NAME</th>
                        <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>CONTACT</th>
                        <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>TARGET BUSINESS</th>
                        <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>SERVICE NEEDED</th>
                        <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>CUSTOMER MESSAGE</th>
                        <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>DATE</th>
                        <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700, textAlign: "right" }}>
                          ACTION
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {leadsList.map((lead) => (
                        <tr
                          key={lead._id}
                          style={{
                            borderBottom: "1px solid #f1f5f9",
                          }}
                        >
                          <td style={{ padding: "0.75rem", fontWeight: 700, color: "#0f172a" }}>
                            {lead.customerName}
                          </td>
                          <td style={{ padding: "0.75rem", color: "#475569" }}>
                            <div>{lead.customerPhone}</div>
                            {lead.customerEmail && (
                              <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                                {lead.customerEmail}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: "0.75rem", fontWeight: 600, color: "#0369a1" }}>
                            {lead.business?.name || "General Directory"}
                          </td>
                          <td style={{ padding: "0.75rem", color: "#475569" }}>
                            {lead.serviceNeeded || "General Service"}
                          </td>
                          <td style={{ padding: "0.75rem", color: "#334155", maxWidth: "260px" }}>
                            {lead.message}
                          </td>
                          <td style={{ padding: "0.75rem", color: "#64748b", fontSize: "0.75rem" }}>
                            {formatDate(lead.createdAt)}
                          </td>
                          <td style={{ padding: "0.75rem", textAlign: "right" }}>
                            <a
                              href={`https://wa.me/${lead.customerPhone?.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.35rem",
                                padding: "0.35rem 0.65rem",
                                background: "#dcfce7",
                                color: "#15803d",
                                borderRadius: "4px",
                                textDecoration: "none",
                                fontWeight: 700,
                                fontSize: "0.75rem",
                              }}
                            >
                              <MessageCircle size={13} /> WhatsApp
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 3: MANAGE VENDORS / MERCHANTS ── */}
          {activeTab === "vendors" && (
            <div
              style={{
                background: "#ffffff",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                padding: "1.4rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.25rem",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    Manage Vendors &amp; Merchant Partners
                  </h3>
                  <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>
                    Registered business owners and merchant contacts across Karnataka
                  </p>
                </div>
                <button
                  onClick={loadAllBusinesses}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.45rem 0.85rem",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <RefreshCw size={13} /> Refresh Vendors
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.82rem",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid #e2e8f0",
                        color: "#64748b",
                        textAlign: "left",
                      }}
                    >
                      <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>MERCHANT / OWNER</th>
                      <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>PRIMARY BUSINESS</th>
                      <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>CITY</th>
                      <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>PHONE / WHATSAPP</th>
                      <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>VERIFIED</th>
                      <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700, textAlign: "right" }}>
                        CONTACT
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBusinesses.map((b) => (
                      <tr
                        key={b._id}
                        style={{
                          borderBottom: "1px solid #f1f5f9",
                        }}
                      >
                        <td style={{ padding: "0.75rem", fontWeight: 700, color: "#0f172a" }}>
                          {b.owner?.name || b.name}
                        </td>
                        <td style={{ padding: "0.75rem", color: "#0369a1", fontWeight: 600 }}>
                          {b.name}
                        </td>
                        <td style={{ padding: "0.75rem", color: "#475569" }}>
                          {b.location?.city || "Shivamogga"}
                        </td>
                        <td style={{ padding: "0.75rem", color: "#475569" }}>
                          {b.contact?.phone || b.contact?.whatsapp || "-"}
                        </td>
                        <td style={{ padding: "0.75rem" }}>
                          <span
                            style={{
                              padding: "0.2rem 0.5rem",
                              borderRadius: "4px",
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              background: b.isVerified ? "#dcfce7" : "#f1f5f9",
                              color: b.isVerified ? "#15803d" : "#64748b",
                            }}
                          >
                            {b.isVerified ? "VERIFIED" : "PENDING"}
                          </span>
                        </td>
                        <td style={{ padding: "0.75rem", textAlign: "right" }}>
                          <a
                            href={`https://wa.me/${(b.contact?.whatsapp || b.contact?.phone || "").replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem",
                              padding: "0.35rem 0.65rem",
                              background: "#dcfce7",
                              color: "#15803d",
                              borderRadius: "4px",
                              textDecoration: "none",
                              fontWeight: 700,
                              fontSize: "0.75rem",
                            }}
                          >
                            <MessageCircle size={13} /> Chat WhatsApp
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TAB 4: ALL BUSINESSES ── */}
          {activeTab === "businesses" && (
            <div
              style={{
                background: "#ffffff",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                padding: "1.4rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1.25rem",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    All Directory Business Listings
                  </h3>
                  <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>
                    Search and manage verified businesses across all Karnataka cities
                  </p>
                </div>

                <button
                  onClick={() => setShowAddModal(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.55rem 1.1rem",
                    background: "#0284c7",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  <Plus size={16} /> Add New Business
                </button>
              </div>

              {/* Filter Bar */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                  marginBottom: "1.25rem",
                  padding: "0.85rem",
                  background: "#f8fafc",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                }}
              >
                {/* Search */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    padding: "0.4rem 0.75rem",
                    flex: "1 1 240px",
                  }}
                >
                  <Search size={14} color="#64748b" />
                  <input
                    type="text"
                    placeholder="Search by business name, phone, or email..."
                    value={bizSearch}
                    onChange={(e) => setBizSearch(e.target.value)}
                    style={{
                      border: "none",
                      outline: "none",
                      width: "100%",
                      fontSize: "0.82rem",
                    }}
                  />
                </div>

                {/* City Filter */}
                <select
                  value={bizCityFilter}
                  onChange={(e) => setBizCityFilter(e.target.value)}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    padding: "0.4rem 0.75rem",
                    fontSize: "0.82rem",
                    color: "#0f172a",
                    fontWeight: 600,
                  }}
                >
                  <option value="all">All Karnataka Cities</option>
                  {CITIES_DATA.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

                {/* Subscription Status Filter */}
                <select
                  value={bizFilter}
                  onChange={(e) => setBizFilter(e.target.value)}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    padding: "0.4rem 0.75rem",
                    fontSize: "0.82rem",
                    color: "#0f172a",
                    fontWeight: 600,
                  }}
                >
                  <option value="all">All Subscriptions</option>
                  <option value="active">Active Only</option>
                  <option value="expired">Expired Only</option>
                </select>
              </div>

              {/* Table */}
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.82rem",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid #e2e8f0",
                        color: "#64748b",
                        textAlign: "left",
                      }}
                    >
                      <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>BUSINESS NAME</th>
                      <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>CITY / AREA</th>
                      <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>CATEGORY</th>
                      <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>CONTACT</th>
                      <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>VERIFIED</th>
                      <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>FEATURED</th>
                      <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>SUBSCRIPTION</th>
                      <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700, textAlign: "right" }}>
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBusinesses.map((b) => (
                      <tr
                        key={b._id}
                        style={{
                          borderBottom: "1px solid #f1f5f9",
                          transition: "background 0.15s ease",
                        }}
                      >
                        <td style={{ padding: "0.75rem", fontWeight: 700, color: "#0f172a" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                            <img
                              src={
                                b.media?.coverImage ||
                                b.media?.logo ||
                                "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=150&q=80"
                              }
                              alt={b.name}
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "4px",
                                objectFit: "cover",
                              }}
                            />
                            <div>
                              <div>{b.name}</div>
                              <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                                {b.slug}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "0.75rem", color: "#475569" }}>
                          {b.location?.area || b.location?.city || "Shivamogga"}
                        </td>
                        <td style={{ padding: "0.75rem", color: "#475569" }}>
                          {b.categoryName || "General"}
                        </td>
                        <td style={{ padding: "0.75rem", color: "#475569" }}>
                          <div>{b.contact?.phone || "-"}</div>
                        </td>
                        <td style={{ padding: "0.75rem" }}>
                          <button
                            onClick={() => handleToggleVerified(b._id, b.isVerified)}
                            style={{
                              padding: "0.25rem 0.55rem",
                              borderRadius: "4px",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              background: b.isVerified ? "#dcfce7" : "#f1f5f9",
                              color: b.isVerified ? "#15803d" : "#64748b",
                            }}
                          >
                            {b.isVerified ? "YES" : "NO"}
                          </button>
                        </td>
                        <td style={{ padding: "0.75rem" }}>
                          <button
                            onClick={() => handleToggleFeatured(b._id, b.isFeatured)}
                            style={{
                              padding: "0.25rem 0.55rem",
                              borderRadius: "4px",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              background: b.isFeatured ? "#fef3c7" : "#f1f5f9",
                              color: b.isFeatured ? "#b45309" : "#64748b",
                            }}
                          >
                            {b.isFeatured ? "TOP" : "STD"}
                          </button>
                        </td>
                        <td style={{ padding: "0.75rem", color: "#475569" }}>
                          <div>{b.subscription?.planDuration || "1 year"}</div>
                          <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                            {b.subscription?.status || "active"}
                          </div>
                        </td>
                        <td style={{ padding: "0.75rem", textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "0.35rem" }}>
                            <Link
                              href={`/business/${b.slug}`}
                              target="_blank"
                              title="View public page"
                              style={{
                                padding: "0.35rem 0.55rem",
                                background: "#f1f5f9",
                                borderRadius: "4px",
                                color: "#334155",
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                              }}
                            >
                              <ExternalLink size={13} />
                            </Link>
                            <button
                              onClick={() => handleRenewOneYear(b._id)}
                              title="Renew 1 year subscription"
                              style={{
                                padding: "0.35rem 0.55rem",
                                background: "#fef3c7",
                                color: "#b45309",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "0.72rem",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Renew
                            </button>
                            <button
                              onClick={() => handleDeleteBusiness(b._id, b.name)}
                              title="Delete listing"
                              style={{
                                padding: "0.35rem 0.55rem",
                                background: "#fee2e2",
                                color: "#b91c1c",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                              }}
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

          {/* ── TAB 5: CATEGORIES ── */}
          {activeTab === "categories" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Add Category Card */}
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  padding: "1.4rem",
                }}
              >
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.35rem" }}>
                  Create New Service Category
                </h3>
                <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "1rem" }}>
                  Add a new primary category for listing classification and SEO indexing
                </p>

                <form
                  onSubmit={handleCreateCategory}
                  style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "flex-end" }}
                >
                  <div style={{ flex: "1 1 220px" }}>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem" }}>
                      Category Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Solar &amp; Renewable Energy"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.5rem 0.75rem",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        fontSize: "0.82rem",
                      }}
                    />
                  </div>

                  <div style={{ flex: "2 1 300px" }}>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem" }}>
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Authorized solar panel dealers and rooftop installation technicians"
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.5rem 0.75rem",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        fontSize: "0.82rem",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={creatingCat}
                    style={{
                      padding: "0.52rem 1.25rem",
                      background: "#0284c7",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      cursor: creatingCat ? "not-allowed" : "pointer",
                    }}
                  >
                    {creatingCat ? "Adding..." : "+ Add Category"}
                  </button>
                </form>
              </div>

              {/* Categories List */}
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  padding: "1.4rem",
                }}
              >
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
                  Active Directory Categories ({categoriesList.length})
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                    gap: "0.85rem",
                  }}
                >
                  {categoriesList.map((cat) => (
                    <div
                      key={cat._id}
                      style={{
                        padding: "0.9rem",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "6px",
                      }}
                    >
                      <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.9rem" }}>
                        {cat.name}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#0369a1", marginTop: "0.15rem" }}>
                        slug: /{cat.slug}
                      </div>
                      {cat.description && (
                        <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.35rem" }}>
                          {cat.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 6: MANAGE EMPLOYEES ── */}
          {activeTab === "employees" && (
            <div
              style={{
                background: "#ffffff",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                padding: "1.4rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.25rem",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    Directory Staff &amp; System Administrators
                  </h3>
                  <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>
                    Master system operators, listing verifiers, and administrators
                  </p>
                </div>
                <button
                  onClick={loadUsers}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.45rem 0.85rem",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <RefreshCw size={13} /> Refresh Staff
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.82rem",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid #e2e8f0",
                        color: "#64748b",
                        textAlign: "left",
                      }}
                    >
                      <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>EMPLOYEE NAME</th>
                      <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>EMAIL</th>
                      <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>ROLE</th>
                      <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>PERMISSIONS</th>
                      <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>STATUS</th>
                      <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>DATE ADDED</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList
                      .filter((u) => u.role === "admin")
                      .map((emp) => (
                        <tr
                          key={emp._id}
                          style={{
                            borderBottom: "1px solid #f1f5f9",
                          }}
                        >
                          <td style={{ padding: "0.75rem", fontWeight: 700, color: "#0f172a" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                              <div
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "50%",
                                  background: "#0284c7",
                                  color: "#ffffff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: 700,
                                  fontSize: "0.85rem",
                                }}
                              >
                                {emp.name?.charAt(0).toUpperCase() || "A"}
                              </div>
                              <span>{emp.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: "0.75rem", color: "#475569" }}>
                            {emp.email}
                          </td>
                          <td style={{ padding: "0.75rem" }}>
                            <span
                              style={{
                                padding: "0.2rem 0.55rem",
                                borderRadius: "4px",
                                fontSize: "0.72rem",
                                fontWeight: 800,
                                background: "#e0f2fe",
                                color: "#0369a1",
                                textTransform: "uppercase",
                              }}
                            >
                              SUPER ADMIN
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem", color: "#64748b" }}>
                            Full Root System Access
                          </td>
                          <td style={{ padding: "0.75rem" }}>
                            <span
                              style={{
                                padding: "0.2rem 0.5rem",
                                borderRadius: "4px",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                background: "#dcfce7",
                                color: "#15803d",
                              }}
                            >
                              Active
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem", color: "#64748b", fontSize: "0.75rem" }}>
                            {formatDate(emp.createdAt)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TAB 7: MANAGE USERS ── */}
          {activeTab === "users" && (
            <div
              style={{
                background: "#ffffff",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                padding: "1.4rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.25rem",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    Manage Registered Directory Users
                  </h3>
                  <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>
                    Merchant accounts, business owners, and registered platform citizens
                  </p>
                </div>
                <button
                  onClick={loadUsers}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.45rem 0.85rem",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <RefreshCw size={13} /> Refresh Users
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.82rem",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid #e2e8f0",
                        color: "#64748b",
                        textAlign: "left",
                      }}
                    >
                      <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>USER NAME</th>
                      <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>EMAIL</th>
                      <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>PHONE</th>
                      <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>ACCOUNT TYPE</th>
                      <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>REGISTERED ON</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u) => (
                      <tr
                        key={u._id}
                        style={{
                          borderBottom: "1px solid #f1f5f9",
                        }}
                      >
                        <td style={{ padding: "0.75rem", fontWeight: 700, color: "#0f172a" }}>
                          {u.name}
                        </td>
                        <td style={{ padding: "0.75rem", color: "#475569" }}>
                          {u.email}
                        </td>
                        <td style={{ padding: "0.75rem", color: "#475569" }}>
                          {u.phone || "-"}
                        </td>
                        <td style={{ padding: "0.75rem" }}>
                          <span
                            style={{
                              padding: "0.2rem 0.55rem",
                              borderRadius: "4px",
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              background:
                                u.role === "admin"
                                  ? "#e0f2fe"
                                  : u.role === "business"
                                  ? "#ecfdf5"
                                  : "#f1f5f9",
                              color:
                                u.role === "admin"
                                  ? "#0369a1"
                                  : u.role === "business"
                                  ? "#047857"
                                  : "#475569",
                              textTransform: "uppercase",
                            }}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: "0.75rem", color: "#64748b", fontSize: "0.75rem" }}>
                          {formatDate(u.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TAB 8: ACTIVITY LOGS ── */}
          {activeTab === "activity-logs" && (
            <div
              style={{
                background: "#ffffff",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                padding: "1.4rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.25rem",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    Directory Activity Logs &amp; Audit Trail
                  </h3>
                  <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>
                    Real-time citizen views, telephone call taps, and WhatsApp interactions across Karnataka
                  </p>
                </div>
                <button
                  onClick={loadActivityLogs}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.45rem 0.85rem",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <RefreshCw size={13} /> Refresh Logs
                </button>
              </div>

              {activityLogs.length === 0 ? (
                <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                  No visit or interaction logs recorded yet.
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "0.82rem",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          borderBottom: "1px solid #e2e8f0",
                          color: "#64748b",
                          textAlign: "left",
                        }}
                      >
                        <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>TIMESTAMP</th>
                        <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>ACTION TYPE</th>
                        <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>BUSINESS NAME</th>
                        <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>CITY</th>
                        <th style={{ padding: "0.6rem 0.75rem", fontWeight: 700 }}>IP ADDRESS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activityLogs.map((log) => (
                        <tr
                          key={log._id}
                          style={{
                            borderBottom: "1px solid #f1f5f9",
                          }}
                        >
                          <td style={{ padding: "0.75rem", color: "#475569" }}>
                            {formatDate(log.timestamp)}
                          </td>
                          <td style={{ padding: "0.75rem" }}>
                            <span
                              style={{
                                padding: "0.2rem 0.5rem",
                                borderRadius: "4px",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                background:
                                  log.action === "call"
                                    ? "#dcfce7"
                                    : log.action === "whatsapp"
                                    ? "#d1fae5"
                                    : "#f1f5f9",
                                color:
                                  log.action === "call"
                                    ? "#15803d"
                                    : log.action === "whatsapp"
                                    ? "#047857"
                                    : "#475569",
                                textTransform: "uppercase",
                              }}
                            >
                              {log.action}
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem", fontWeight: 600, color: "#0f172a" }}>
                            {log.business?.name || "Directory Home"}
                          </td>
                          <td style={{ padding: "0.75rem", color: "#64748b" }}>
                            {log.business?.location?.city || "Shivamogga"}
                          </td>
                          <td style={{ padding: "0.75rem", color: "#94a3b8", fontFamily: "monospace" }}>
                            {log.ip || "127.0.0.1"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ═══════════════════════════════════════════════════════
          MODAL: ADD NEW BUSINESS DIRECTLY
         ═══════════════════════════════════════════════════════ */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "680px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "1.75rem",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem",
                paddingBottom: "0.75rem",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Add New Business Listing
                </h3>
                <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>
                  Publish directly to the verified Karnataka multi-city directory
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdminCreateBusiness} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Name & Category */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                    Business / Clinic / Shop Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Malnad Diagnostics or Sagar Electricals"
                    value={newBizName}
                    onChange={(e) => setNewBizName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.75rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                    Service Category *
                  </label>
                  <select
                    value={newBizCat}
                    onChange={(e) => setNewBizCat(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.75rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                    }}
                  >
                    {categoriesList.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* City & Area */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                    City *
                  </label>
                  <select
                    value={newBizCity}
                    onChange={(e) => setNewBizCity(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.75rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                    }}
                  >
                    {CITIES_DATA.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                    Locality / Area *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gandhi Bazaar or Kuvempu Road"
                    value={newBizArea}
                    onChange={(e) => setNewBizArea(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.75rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                    }}
                  />
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                    Official Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +91 94481 00000"
                    value={newBizPhone}
                    onChange={(e) => setNewBizPhone(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.75rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                    WhatsApp Chat Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9448100000"
                    value={newBizWhatsapp}
                    onChange={(e) => setNewBizWhatsapp(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.75rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                    }}
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                  Physical Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Kuvempu Road, Shivamogga, Karnataka 577201"
                  value={newBizAddress}
                  onChange={(e) => setNewBizAddress(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.55rem 0.75rem",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                  }}
                />
              </div>

              {/* Tagline */}
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                  Short Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Expert electrical and plumbing repairs available 24/7"
                  value={newBizTagline}
                  onChange={(e) => setNewBizTagline(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.55rem 0.75rem",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                  }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                  Full Description &amp; Services
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter services provided, business history, timings, or emergency support details..."
                  value={newBizDesc}
                  onChange={(e) => setNewBizDesc(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.55rem 0.75rem",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                  }}
                />
              </div>

              {/* Plan & Badges */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                    Subscription Plan
                  </label>
                  <select
                    value={newBizPlan}
                    onChange={(e: any) => setNewBizPlan(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.75rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                    }}
                  >
                    <option value="1 year">1 Year (&#8377;8,999)</option>
                    <option value="6 months">6 Months (&#8377;4,999)</option>
                    <option value="1 month">1 Month (&#8377;999)</option>
                  </select>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingTop: "1.4rem" }}>
                  <input
                    type="checkbox"
                    id="isVerified"
                    checked={newBizVerified}
                    onChange={(e) => setNewBizVerified(e.target.checked)}
                    style={{ width: "16px", height: "16px", cursor: "pointer" }}
                  />
                  <label htmlFor="isVerified" style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0f172a", cursor: "pointer" }}>
                    Verified Badge
                  </label>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingTop: "1.4rem" }}>
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={newBizFeatured}
                    onChange={(e) => setNewBizFeatured(e.target.checked)}
                    style={{ width: "16px", height: "16px", cursor: "pointer" }}
                  />
                  <label htmlFor="isFeatured" style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0f172a", cursor: "pointer" }}>
                    Featured (Top Partner)
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: "0.6rem 1.2rem",
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBiz}
                  style={{
                    padding: "0.6rem 1.4rem",
                    background: "#0284c7",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: submittingBiz ? "not-allowed" : "pointer",
                    opacity: submittingBiz ? 0.7 : 1,
                  }}
                >
                  {submittingBiz ? "Publishing..." : "Publish Business"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
