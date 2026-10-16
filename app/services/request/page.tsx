"use client";

import { useState } from "react";
import { serviceCategories } from "@/data/services";

const popularServices = [
  "House Cleaning", "Dishwashing", "Grocery Run", "Queue Standing",
  "Vegetable Cutting", "Onion Cutting", "Laundry & Wash", "Parcel Pickup",
];

export default function ServiceRequestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="page-wrapper">
        <section style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="container" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🎉</div>
            <h1 style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "1rem" }}>
              Request received!
            </h1>
            <p style={{ fontSize: "1.0625rem", color: "var(--muted)", fontWeight: 500, maxWidth: "440px", margin: "0 auto 2rem", lineHeight: 1.65 }}>
              We&apos;ll match you with a verified helper and confirm within{" "}
              <strong style={{ color: "var(--text)" }}>15 minutes</strong>. We&apos;ll reach you at{" "}
              <strong style={{ color: "var(--text)" }}>{phone}</strong>.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/services" className="btn-cta-primary" style={{ background: "var(--primary)" }}>
                Browse More Services
              </a>
              <a href="/" className="btn-custom" style={{ borderRadius: "999px", padding: "0.875rem 1.5rem" }}>
                Back to Home
              </a>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <section className="about-hero" style={{ paddingBottom: "2rem" }}>
        <div className="container">
          <div className="badge-made-india" style={{ marginBottom: "1.5rem" }}>
            <span>Custom Request</span>
          </div>
          <h1 className="page-title">
            Can&apos;t find it? Just<br />
            <span className="highlight">describe your task.</span>
          </h1>
          <p className="page-subtitle" style={{ maxWidth: "520px", marginTop: "1.25rem" }}>
            Tell us what you need and we&apos;ll find the right helper for you — even if it&apos;s not in our standard menu.
          </p>
        </div>
      </section>

      <section style={{ paddingBottom: "5rem" }}>
        <div className="container">
          <div className="request-layout">
            {/* Form */}
            <div className="request-form-card">
              <h2 style={{ fontSize: "1.25rem", fontWeight: 900, letterSpacing: "-0.025em", marginBottom: "1.75rem" }}>
                Tell us what you need
              </h2>
              <form onSubmit={handleSubmit} className="request-form">
                {/* Popular suggestions */}
                <div className="request-field">
                  <label className="request-label">Popular tasks (click to fill)</label>
                  <div className="request-suggestions">
                    {popularServices.map((s) => (
                      <button
                        type="button"
                        key={s}
                        className={`request-suggestion-chip${task === s ? " active" : ""}`}
                        onClick={() => setTask(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="request-field">
                  <label className="request-label" htmlFor="req-task">Describe your task *</label>
                  <textarea
                    id="req-task"
                    className="request-textarea"
                    placeholder="e.g., I need someone to sort and iron about 20 clothes, and organise them in my wardrobe..."
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    required
                    rows={4}
                  />
                </div>

                <div className="request-field">
                  <label className="request-label" htmlFor="req-category">Service category</label>
                  <select
                    id="req-category"
                    className="request-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select a category (optional)</option>
                    {serviceCategories.map((c) => (
                      <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                    ))}
                    <option value="other">🌀 Something else</option>
                  </select>
                </div>

                <div className="request-row">
                  <div className="request-field">
                    <label className="request-label" htmlFor="req-name">Your name *</label>
                    <input
                      id="req-name"
                      type="text"
                      className="request-input"
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="request-field">
                    <label className="request-label" htmlFor="req-phone">Phone number *</label>
                    <input
                      id="req-phone"
                      type="tel"
                      className="request-input"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="request-row">
                  <div className="request-field">
                    <label className="request-label" htmlFor="req-date">Preferred date & time</label>
                    <input
                      id="req-date"
                      type="datetime-local"
                      className="request-input"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div className="request-field">
                    <label className="request-label" htmlFor="req-address">Address</label>
                    <input
                      id="req-address"
                      type="text"
                      className="request-input"
                      placeholder="Area, Coimbatore"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="request-submit-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/>
                    <path d="m21.854 2.147-10.94 10.939"/>
                  </svg>
                  Submit Request
                </button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="request-sidebar">
              <div className="request-sidebar-card">
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚡</div>
                <div style={{ fontWeight: 900, fontSize: "1rem", marginBottom: "0.5rem" }}>Fast response</div>
                <p style={{ fontSize: "0.85rem", color: "var(--muted)", fontWeight: 500, lineHeight: 1.6 }}>
                  We review custom requests within 15 minutes and call you to confirm.
                </p>
              </div>
              <div className="request-sidebar-card">
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>💰</div>
                <div style={{ fontWeight: 900, fontSize: "1rem", marginBottom: "0.5rem" }}>Transparent pricing</div>
                <p style={{ fontSize: "0.85rem", color: "var(--muted)", fontWeight: 500, lineHeight: 1.6 }}>
                  We quote you a fair price upfront — no surprises, no hidden charges.
                </p>
              </div>
              <div className="request-sidebar-card">
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🛡️</div>
                <div style={{ fontWeight: 900, fontSize: "1rem", marginBottom: "0.5rem" }}>Verified helpers</div>
                <p style={{ fontSize: "0.85rem", color: "var(--muted)", fontWeight: 500, lineHeight: 1.6 }}>
                  Every helper assigned to your custom task is background-verified.
                </p>
              </div>
              <div style={{ padding: "1.25rem", background: "var(--primary-light)", border: "1px solid var(--primary-border)", borderRadius: "1.25rem" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 900, color: "var(--primary)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Need help right now?
                </div>
                <a href="tel:+918428729033" style={{ fontWeight: 800, color: "var(--text)", textDecoration: "none", fontSize: "1rem" }}>
                  +91 84287 29033
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
