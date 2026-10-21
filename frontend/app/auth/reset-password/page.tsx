"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authAPI } from "@/lib/api";
import { Lock, KeyRound, CheckCircle2 } from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [code, setCode] = useState(searchParams.get("code") || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.resetPassword(code, password);
      if (res.success) {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingTop: "6.5rem", paddingBottom: "5rem" }}>
      <div className="container" style={{ maxWidth: "460px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", padding: "2.5rem", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <div style={{ textAlign: "center", marginBottom: "1.8rem" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#ecfdf5", color: "#059669", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "0.8rem" }}>
              <Lock size={22} />
            </div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a" }}>Set New Password</h1>
            <p style={{ color: "#64748b", fontSize: "0.88rem", marginTop: "0.3rem" }}>
              Enter your 6-digit verification code and new password.
            </p>
          </div>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", padding: "0.75rem", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "1.2rem" }}>
              {error}
            </div>
          )}

          {success ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46", padding: "1.2rem", borderRadius: "10px", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                ✓ <b>Password Reset Successfully!</b>
                <div style={{ fontSize: "0.85rem", color: "#047857", marginTop: "0.4rem" }}>
                  You can now log in to your account with your new credentials.
                </div>
              </div>

              <Link
                href="/auth/login"
                style={{
                  display: "block",
                  background: "#FF6B00",
                  color: "#fff",
                  padding: "0.8rem",
                  borderRadius: "8px",
                  fontWeight: 700,
                  textDecoration: "none",
                  fontSize: "0.95rem",
                }}
              >
                Sign In Now →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                  6-Digit Verification Code
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.65rem 0.8rem", background: "#fff" }}>
                  <KeyRound size={16} color="#94a3b8" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    style={{ border: "none", outline: "none", width: "100%", fontSize: "1.1rem", letterSpacing: "0.15em", fontWeight: 700 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                  New Password (min 6 characters)
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.65rem 0.8rem", background: "#fff" }}>
                  <Lock size={16} color="#94a3b8" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ border: "none", outline: "none", width: "100%", fontSize: "0.9rem" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                  Confirm New Password
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.65rem 0.8rem", background: "#fff" }}>
                  <Lock size={16} color="#94a3b8" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? "Updating..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "6rem 0", color: "#64748b" }}>Loading reset password form...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

