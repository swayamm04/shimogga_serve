"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authAPI } from "@/lib/api";
import { Mail, ArrowLeft, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetCode, setResetCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await authAPI.forgotPassword(email);
      if (res.success) {
        setMessage(res.message);
        setResetCode(res.resetCode);
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate reset code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingTop: "6.5rem", paddingBottom: "5rem" }}>
      <div className="container" style={{ maxWidth: "460px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", padding: "2.5rem", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <div style={{ textAlign: "center", marginBottom: "1.8rem" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#fff7ed", color: "#FF6B00", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "0.8rem" }}>
              <KeyRound size={22} />
            </div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a" }}>Forgot Password</h1>
            <p style={{ color: "#64748b", fontSize: "0.88rem", marginTop: "0.3rem" }}>
              Enter your registered email and we will send a 6-digit reset code.
            </p>
          </div>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", padding: "0.75rem", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "1.2rem" }}>
              {error}
            </div>
          )}

          {message ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46", padding: "1rem", borderRadius: "10px", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                ✓ {message}
                {resetCode && (
                  <div style={{ marginTop: "0.8rem", padding: "0.6rem", background: "#fff", borderRadius: "8px", border: "1px dashed #059669" }}>
                    Your Verification Code: <b style={{ fontSize: "1.2rem", color: "#FF6B00" }}>{resetCode}</b>
                  </div>
                )}
              </div>

              <button
                onClick={() => router.push(`/auth/reset-password?code=${resetCode}`)}
                style={{
                  width: "100%",
                  background: "#FF6B00",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.95rem",
                }}
              >
                Proceed to Reset Password →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                  Registered Email Address
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.65rem 0.8rem", background: "#fff" }}>
                  <Mail size={16} color="#94a3b8" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ border: "none", outline: "none", width: "100%", fontSize: "0.9rem" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: "#FF6B00",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.8rem",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                }}
              >
                {loading ? "Generating Code..." : "Send Reset Code"}
              </button>
            </form>
          )}

          <div style={{ marginTop: "1.8rem", textAlign: "center" }}>
            <Link href="/auth/login" style={{ color: "#64748b", fontSize: "0.85rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
