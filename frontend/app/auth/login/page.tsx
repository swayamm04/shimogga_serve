"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, ShieldCheck, Building2, User } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectUrl = searchParams.get("redirect") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res?.user?.role === "admin") {
        router.push(redirectUrl || "/admin");
      } else if (res?.user?.role === "business") {
        router.push(redirectUrl || "/dashboard");
      } else {
        router.push(redirectUrl || "/services");
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleFillCredentials = (fillEmail: string, fillPass: string) => {
    setEmail(fillEmail);
    setPassword(fillPass);
  };

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        padding: "2.25rem",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "6px",
            background: "#0f2942",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: "1.2rem",
            marginBottom: "0.85rem",
          }}
        >
          S
        </div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a" }}>Sign In to Shivamogga Services</h1>
        <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.2rem" }}>
          Access your merchant dashboard, customer leads &amp; account settings
        </p>
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
            Email Address
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
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
            <Link href="/auth/forgot-password" style={{ fontSize: "0.78rem", color: "#ea580c", textDecoration: "none", fontWeight: 600 }}>
              Forgot password?
            </Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "0.6rem 0.75rem", background: "#ffffff" }}>
            <Lock size={16} color="#64748b" />
            <input
              type="password"
              required
              placeholder="••••••••"
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
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.85rem", color: "#64748b" }}>
        Don&apos;t have an account yet?{" "}
        <Link href="/auth/register-business" style={{ color: "#ea580c", fontWeight: 600, textDecoration: "none" }}>
          Register your business
        </Link>
      </div>

      {/* Discrete test/evaluation credentials helper */}
      <div style={{ marginTop: "2rem", paddingTop: "1.25rem", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
          Test Credentials (Pre-fill)
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
          <button
            type="button"
            onClick={() => handleFillCredentials("admin@shimogaservice.com", "admin123")}
            className="btn-secondary"
            style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
          >
            Admin (admin123)
          </button>
          <button
            type="button"
            onClick={() => handleFillCredentials("owner@manipal.com", "owner123")}
            className="btn-secondary"
            style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
          >
            Merchant: Manipal (owner123)
          </button>
          <button
            type="button"
            onClick={() => handleFillCredentials("user@gmail.com", "user123")}
            className="btn-secondary"
            style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
          >
            Citizen User (user123)
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div style={{ background: "#f8fafc", minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: "440px", width: "100%" }}>
        <Suspense fallback={<div style={{ textAlign: "center" }}>Loading login form...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
