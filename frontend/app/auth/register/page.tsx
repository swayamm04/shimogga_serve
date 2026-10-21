"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, User, Phone, Building2 } from "lucide-react";

export default function RegisterUserPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({
        role: "user",
        name,
        email,
        password,
        phone,
      });
      router.push("/services");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: "440px", width: "100%" }}>
        <div
          style={{
            background: "#ffffff",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            padding: "2.25rem",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a" }}>Create Citizen Account</h1>
            <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.2rem" }}>
              Join Shivamogga Services to submit reviews and save service contacts
            </p>
          </div>

          {/* Business Owner Callout */}
          <div
            style={{
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              borderRadius: "6px",
              padding: "0.75rem 0.85rem",
              marginBottom: "1.25rem",
              fontSize: "0.82rem",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <Building2 size={20} color="#ea580c" style={{ flexShrink: 0 }} />
            <div>
              <span style={{ fontWeight: 700, color: "#9a3412" }}>Are you a business merchant?</span>
              <div>
                <Link href="/auth/register-business" style={{ color: "#ea580c", fontWeight: 700, textDecoration: "none" }}>
                  Register and list your business here &rarr;
                </Link>
              </div>
            </div>
          </div>

          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#b91c1c",
                padding: "0.75rem",
                borderRadius: "6px",
                fontSize: "0.82rem",
                marginBottom: "1.25rem",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label className="form-label">
                Full Name *
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "0.6rem 0.75rem", background: "#ffffff" }}>
                <User size={16} color="#64748b" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Gowda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ border: "none", outline: "none", width: "100%", fontSize: "0.88rem" }}
                />
              </div>
            </div>

            <div>
              <label className="form-label">
                Email Address *
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "0.6rem 0.75rem", background: "#ffffff" }}>
                <Mail size={16} color="#64748b" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ border: "none", outline: "none", width: "100%", fontSize: "0.88rem" }}
                />
              </div>
            </div>

            <div>
              <label className="form-label">
                Mobile Number
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "0.6rem 0.75rem", background: "#ffffff" }}>
                <Phone size={16} color="#64748b" />
                <input
                  type="tel"
                  placeholder="+91 94481 ..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ border: "none", outline: "none", width: "100%", fontSize: "0.88rem" }}
                />
              </div>
            </div>

            <div>
              <label className="form-label">
                Password *
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "0.6rem 0.75rem", background: "#ffffff" }}>
                <Lock size={16} color="#64748b" />
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ border: "none", outline: "none", width: "100%", fontSize: "0.88rem" }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: "100%", padding: "0.75rem", fontSize: "0.92rem", marginTop: "0.5rem" }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.85rem", color: "#64748b" }}>
            Already registered?{" "}
            <Link href="/auth/login" style={{ color: "#ea580c", fontWeight: 600, textDecoration: "none" }}>
              Sign In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
