"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCity } from "@/context/CityContext";
import { getWhatsAppListingUrl } from "@/data/cities";
import {
  Building2,
  ShieldCheck,
  User,
  LogOut,
  LayoutDashboard,
  Search,
  MessageCircle,
  Menu,
  X,
  Phone,
  MapPin,
  ChevronDown,
  Quote,
} from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { selectedCity, setSelectedCity, cities } = useCity();

  const quotes = [
    "Supporting verified local businesses builds stronger communities.",
    "Trust is earned through honest service, verified locations, and real citizen feedback.",
    "Direct telephone & WhatsApp connectivity — connecting citizens with zero commission fees.",
    "Your authentic neighbourhood directory for healthcare, skilled technicians, and local stores.",
    "Empowering local merchants across Karnataka with transparent discovery.",
    "Quality service begins with verified standards and direct community trust.",
  ];

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteVisible, setQuoteVisible] = useState(true);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler);
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteVisible(false);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setQuoteVisible(true);
      }, 500);
    }, 5000);

    return () => clearInterval(timer);
  }, [quotes.length]);

  const whatsAppListingHref = getWhatsAppListingUrl(selectedCity);

  return (
    <>
      {/* ── Top Utility Bar: Animated Quotes Only ── */}
      <div className="top-utility-bar">
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "1.65rem",
            textAlign: "center",
            padding: "0.15rem 1rem",
          }}
        >
          <span
            style={{
              color: "#e2e8f0",
              fontSize: "0.82rem",
              fontWeight: 500,
              letterSpacing: "0.015em",
              transition: "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
              opacity: quoteVisible ? 1 : 0,
              transform: quoteVisible ? "translateY(0)" : "translateY(-3px)",
              textAlign: "center",
              display: "inline-block",
            }}
          >
            &ldquo;{quotes[quoteIndex]}&rdquo;
          </span>
        </div>
      </div>

      {/* ── Main Sticky Header ── */}
      <header className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="container navbar-inner">
          {/* Brand Logo */}
          <Link href="/" className="navbar-brand">
            <div className="navbar-brand-mark">
              {selectedCity.charAt(0)}
            </div>
            <div className="navbar-brand-title">
              {selectedCity} Services
              <span>Verified Local Directory</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="navbar-nav">
            <Link href={`/services?city=${encodeURIComponent(selectedCity)}`}>
              <Search size={15} /> Directory
            </Link>
            <Link href="/#emergency">
              Emergency Directory
            </Link>
            <a
              href={whatsAppListingHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
            >
              List Your Business
            </a>
            <Link href="/about">
              About
            </Link>

            {/* Role specific portals */}
            {user?.role === "admin" && (
              <Link
                href="/admin"
                style={{
                  color: "#1e40af",
                  background: "#eff6ff",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "6px",
                  border: "1px solid #bfdbfe",
                  fontSize: "0.85rem",
                }}
              >
                <ShieldCheck size={14} /> Admin Portal
              </Link>
            )}

            {user?.role === "business" && (
              <Link
                href="/dashboard"
                style={{
                  color: "#047857",
                  background: "#ecfdf5",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "6px",
                  border: "1px solid #a7f3d0",
                  fontSize: "0.85rem",
                }}
              >
                <LayoutDashboard size={14} /> Merchant Dashboard
              </Link>
            )}
          </nav>

          {/* Action CTAs */}
          <div className="navbar-actions">
            {/* Quick City Dropdown on Main Bar */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.35rem 0.65rem",
                borderRadius: "6px",
                border: "1px solid var(--border)",
                background: "#f8fafc",
                fontSize: "0.82rem",
                color: "#334155",
                fontWeight: 600,
              }}
            >
              <MapPin size={14} color="#ea580c" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "#0f172a",
                  cursor: "pointer",
                }}
                title="Change Active City"
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Link
                  href="/profile"
                  className="btn-secondary"
                  style={{ padding: "0.45rem 0.9rem", fontSize: "0.85rem" }}
                >
                  <User size={15} />
                  <span>{user.name.split(" ")[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  title="Sign Out"
                  style={{
                    background: "transparent",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "0.45rem 0.6rem",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Link href="/auth/login" className="btn-secondary" style={{ padding: "0.45rem 0.9rem", fontSize: "0.85rem" }}>
                  Sign In
                </Link>
                {/* Public Add Business Button -> Redirects to WhatsApp per requirements */}
                <a
                  href={whatsAppListingHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{
                    padding: "0.45rem 0.95rem",
                    fontSize: "0.85rem",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                  title="Connect via WhatsApp to list your business"
                >
                  <MessageCircle size={15} /> + Add Business
                </a>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              className="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Dropdown ── */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: "4.25rem",
            left: 0,
            right: 0,
            background: "#ffffff",
            borderBottom: "1px solid var(--border)",
            padding: "1.25rem 1.5rem",
            zIndex: 99,
            boxShadow: "var(--shadow-md)",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {/* Mobile City Selector */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #f1f5f9" }}>
            <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>Select City:</span>
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setMobileMenuOpen(false);
              }}
              style={{
                padding: "0.35rem 0.6rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#0f172a",
              }}
            >
              {cities.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <Link
            href={`/services?city=${encodeURIComponent(selectedCity)}`}
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: "none", color: "var(--text)", fontWeight: 600, padding: "0.5rem 0" }}
          >
            Explore All Businesses
          </Link>
          <Link
            href="/#emergency"
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: "none", color: "var(--text)", fontWeight: 600, padding: "0.5rem 0" }}
          >
            Emergency Directory
          </Link>
          <a
            href={whatsAppListingHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: "none", color: "var(--text)", fontWeight: 600, padding: "0.5rem 0" }}
          >
            List Your Business (WhatsApp)
          </a>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: "none", color: "var(--text)", fontWeight: 600, padding: "0.5rem 0" }}
          >
            About Directory
          </Link>

          {user?.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              style={{ textDecoration: "none", color: "#1e40af", fontWeight: 700, padding: "0.5rem 0" }}
            >
              Admin Portal
            </Link>
          )}

          {user?.role === "business" && (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              style={{ textDecoration: "none", color: "#047857", fontWeight: 700, padding: "0.5rem 0" }}
            >
              Merchant Dashboard
            </Link>
          )}

          <div style={{ height: "1px", background: "var(--border)", margin: "0.5rem 0" }} />

          {user ? (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: "none", color: "var(--text)", fontWeight: 700 }}>
                My Account ({user.name.split(" ")[0]})
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="btn-secondary"
                style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-secondary"
                style={{ flex: 1, textAlign: "center" }}
              >
                Sign In
              </Link>
              <a
                href={whatsAppListingHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary"
                style={{ flex: 1, textAlign: "center", textDecoration: "none" }}
              >
                + Add Business
              </a>
            </div>
          )}
        </div>
      )}
    </>
  );
}
