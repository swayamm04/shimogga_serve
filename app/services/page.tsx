"use client";

import { useState, useMemo } from "react";
import ServiceCard from "@/components/ServiceCard";
import { serviceCategories, allServices } from "@/data/services";

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (activeCategory === "all" && !q) return serviceCategories;

    return serviceCategories
      .map((cat) => {
        const matchesCat = activeCategory === "all" || cat.id === activeCategory;
        const services = cat.services.filter((s) => {
          if (!matchesCat) return false;
          if (!q) return true;
          return (
            s.name.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q) ||
            s.tags.some((t) => t.includes(q))
          );
        });
        return { ...cat, services };
      })
      .filter((cat) => cat.services.length > 0);
  }, [search, activeCategory]);

  const totalResults = filtered.reduce((n, c) => n + c.services.length, 0);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", paddingTop: "4rem" }}>
      <main className="container" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>

        {/* ── Page Header ── */}
        <div className="page-header">
          <div className="page-header-left">
            <div className="badge-made-india">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}>
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
              </svg>
              <span>Proudly Made in India</span>
            </div>

            <h1 className="page-title">
              Describe the task.{" "}
              <br />
              <span className="highlight">We&apos;ll solve it.</span>
            </h1>
            <p className="page-subtitle">
              Browse our full menu of services or search for exactly what you need.
              We&apos;ll match you with a pro in seconds.
            </p>
          </div>

          {/* Search */}
          <div className="search-area">
            <div className="search-wrap">
              <span className="search-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.34-4.34"/>
                </svg>
              </span>
              <input
                id="service-search"
                type="text"
                className="search-input"
                placeholder="Search services (e.g., 'Onion Cutting', 'Cleaning')..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <a href="/services/request" className="btn-custom">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/>
                <path d="M20 2v4"/><path d="M22 4h-4"/>
                <circle cx="4" cy="20" r="2"/>
              </svg>
              Can&apos;t find it?
            </a>
          </div>
        </div>

        {/* ── Category Tabs ── */}
        <div className="category-tabs">
          <button
            id="tab-all"
            className={`category-tab${activeCategory === "all" ? " active" : ""}`}
            onClick={() => setActiveCategory("all")}
          >
            ✨ All Services
            <span style={{
              fontSize: "0.7rem",
              fontWeight: 800,
              opacity: activeCategory === "all" ? 0.8 : 0.5,
              marginLeft: "0.15rem"
            }}>
              ({allServices.length})
            </span>
          </button>
          {serviceCategories.map((cat) => (
            <button
              key={cat.id}
              id={`tab-${cat.id}`}
              className={`category-tab${activeCategory === cat.id ? " active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
              style={activeCategory === cat.id ? { background: cat.color, borderColor: cat.color, boxShadow: `0 4px 16px ${cat.color}40` } : {}}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        {/* ── Results ── */}
        {search && (
          <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--muted)", marginBottom: "1.5rem" }}>
            {totalResults} result{totalResults !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
          </p>
        )}

        {filtered.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <div className="no-results-title">No services found</div>
            <p className="no-results-sub">Try a different search term or{" "}
              <a href="/services/request" style={{ color: "var(--primary)", fontWeight: 700 }}>request a custom service</a>.
            </p>
          </div>
        ) : (
          filtered.map((cat) => (
            <section key={cat.id} className="services-section" id={`section-${cat.id}`}>
              <div className="section-label">
                <span className="section-emoji">{cat.emoji}</span>
                <span className="section-name">{cat.name}</span>
                <span className="section-count">{cat.services.length}</span>
              </div>
              <div className="services-grid">
                {cat.services.map((service, i) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    accentColor={cat.color}
                    delay={i * 60}
                  />
                ))}
              </div>
            </section>
          ))
        )}

        {/* ── CTA Banner ── */}
        <div className="cta-banner">
          <div className="cta-banner-left">
            <div className="cta-banner-tag">⚡ On-Demand · Under 15 min arrival</div>
            <div className="cta-banner-title">
              Can&apos;t find what you need?
              <br />
              Just ask.
            </div>
            <div className="cta-banner-sub">
              Describe any task — we&apos;ll find the right helper for you.
            </div>
          </div>
          <div className="cta-banner-actions">
            <a href="/services/request" className="btn-cta-primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/>
                <path d="M20 2v4"/><path d="M22 4h-4"/>
                <circle cx="4" cy="20" r="2"/>
              </svg>
              Request Custom Service
            </a>
            <a href="/#waitlist" className="btn-cta-secondary">Join Waiting List</a>
          </div>
        </div>

      </main>
    </div>
  );
}
