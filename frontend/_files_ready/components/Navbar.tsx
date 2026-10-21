"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <header className={`navbar${scrolled ? " scrolled" : ""}`}>
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <span className="navbar-logo-text">
            snap<span>sy</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-nav">
          <Link href="/services" className="active">Services</Link>
          <Link href="/about">About</Link>
          <Link href="/careers">Careers</Link>
          <button>Investors</button>
          <Link href="/partners">Partners</Link>
          <Link href="/#waitlist">Contact</Link>
          <div className="navbar-divider" />
          <Link href="/partners" className="btn-partner">Switch to Partner</Link>
          <Link href="/#waitlist" className="btn-waitlist">Join Waiting List</Link>
          <button className="btn-app">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
              <path d="M12 18h.01"/>
            </svg>
            Get App
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
        </nav>

        {/* Hamburger */}
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>
            </svg>
          )}
        </button>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <Link href="/services" className="active" onClick={() => setMenuOpen(false)}>Services</Link>
        <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
        <Link href="/careers" onClick={() => setMenuOpen(false)}>Careers</Link>
        <button>Investors</button>
        <Link href="/partners" onClick={() => setMenuOpen(false)}>Partners</Link>
        <Link href="/#waitlist" onClick={() => setMenuOpen(false)}>Contact</Link>
        <div className="mobile-menu-divider" />
        <div className="mobile-menu-actions">
          <Link href="/partners" className="btn-waitlist" style={{background:"transparent",color:"var(--primary)",border:"1px solid var(--primary)",boxShadow:"none"}} onClick={() => setMenuOpen(false)}>
            Switch to Partner
          </Link>
          <Link href="/#waitlist" className="btn-waitlist" onClick={() => setMenuOpen(false)}>
            Join Waiting List
          </Link>
          <button className="btn-app">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
              <path d="M12 18h.01"/>
            </svg>
            Get App
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
