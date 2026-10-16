"use client";

import { useState } from "react";

export default function WaitlistForm() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        style={{
          background: "var(--primary-light)",
          border: "1px solid rgba(255, 77, 0, 0.2)",
          borderRadius: "1.25rem",
          padding: "2rem",
          maxWidth: "440px",
          margin: "0 auto",
        }}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎉</div>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>You&apos;re on the list!</h3>
        <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
          Thanks {name}! We will reach out on {phone} as soon as Snapsy expands to {city || "your area"}.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "440px", margin: "0 auto" }}
    >
      <input
        type="text"
        placeholder="Your full name"
        className="search-input"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ borderRadius: "1.25rem", padding: "1rem 1.25rem" }}
      />
      <input
        type="tel"
        placeholder="Phone number (+91)"
        className="search-input"
        required
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ borderRadius: "1.25rem", padding: "1rem 1.25rem" }}
      />
      <input
        type="text"
        placeholder="Your city"
        className="search-input"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ borderRadius: "1.25rem", padding: "1rem 1.25rem" }}
      />
      <button
        type="submit"
        className="card-book-btn"
        style={{ borderRadius: "1.25rem", padding: "1rem", fontSize: "0.9rem", marginTop: "0.5rem", justifyContent: "center" }}
      >
        Join Waiting List
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
        </svg>
      </button>
    </form>
  );
}
