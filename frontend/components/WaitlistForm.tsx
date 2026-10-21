"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function WaitlistForm() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [taluk, setTaluk] = useState("Bhadravathi");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        style={{
          background: "#ecfdf5",
          border: "1px solid #a7f3d0",
          borderRadius: "8px",
          padding: "1.75rem",
          maxWidth: "460px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div style={{ display: "inline-flex", padding: "0.5rem", borderRadius: "50%", background: "#d1fae5", color: "#059669", marginBottom: "0.75rem" }}>
          <CheckCircle2 size={24} />
        </div>
        <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#065f46", marginBottom: "0.35rem" }}>
          Registration Confirmed
        </h3>
        <p style={{ fontSize: "0.85rem", color: "#047857" }}>
          Thank you {name}. We will notify you at {phone} as soon as full verified directory listings expand to {taluk}.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "0.85rem", maxWidth: "460px", margin: "0 auto" }}
    >
      <div>
        <input
          type="text"
          placeholder="Your Full Name"
          className="form-input"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <input
          type="tel"
          placeholder="Phone Number (+91)"
          className="form-input"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div>
        <select
          value={taluk}
          onChange={(e) => setTaluk(e.target.value)}
          className="form-select"
        >
          <option value="Bhadravathi">Bhadravathi Taluk</option>
          <option value="Sagar">Sagar / Jog Falls Area</option>
          <option value="Thirthahalli">Thirthahalli Taluk</option>
          <option value="Shikaripura">Shikaripura Taluk</option>
          <option value="Soraba">Soraba Taluk</option>
          <option value="Hosanagara">Hosanagara Taluk</option>
        </select>
      </div>
      <button
        type="submit"
        className="btn-primary"
        style={{ width: "100%", padding: "0.75rem", fontSize: "0.92rem" }}
      >
        Request Expansion in My Taluk
      </button>
    </form>
  );
}
