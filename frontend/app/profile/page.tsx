"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { authAPI } from "@/lib/api";
import { User, Phone, Mail, Lock, ShieldCheck, Building2, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, business, logout, refreshUser, isLoading: authLoading } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [changingPass, setChangingPass] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?redirect=/profile");
      return;
    }

    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user, authLoading, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg("");

    try {
      const res = await authAPI.updateProfile({ name, phone });
      if (res.success) {
        setProfileMsg("Profile updated successfully!");
        await refreshUser();
      }
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPass(true);
    setPasswordMsg("");
    setPasswordError("");

    try {
      const res = await authAPI.changePassword({ currentPassword, newPassword });
      if (res.success) {
        setPasswordMsg("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (err: any) {
      setPasswordError(err.message || "Failed to change password");
    } finally {
      setChangingPass(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#64748b" }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingTop: "3rem", paddingBottom: "5rem" }}>
      <div className="container" style={{ maxWidth: "840px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "#0f172a" }}>My Account Profile</h1>
            <p style={{ color: "#64748b", fontSize: "0.88rem" }}>Manage your account settings and security credentials.</p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            {user.role === "admin" && (
              <Link href="/admin" className="btn-secondary" style={{ color: "#1e40af", borderColor: "#bfdbfe", background: "#eff6ff" }}>
                <ShieldCheck size={15} /> Admin Portal
              </Link>
            )}

            {user.role === "business" && (
              <Link href="/dashboard" className="btn-secondary" style={{ color: "#047857", borderColor: "#a7f3d0", background: "#ecfdf5" }}>
                <Building2 size={15} /> Merchant Dashboard
              </Link>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {/* Edit Profile Info */}
          <div style={{ background: "#ffffff", borderRadius: "8px", padding: "1.75rem", border: "1px solid #e2e8f0", boxShadow: "var(--shadow-sm)" }}>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <User size={18} color="#ea580c" /> Personal Information
            </h2>

            {profileMsg && (
              <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46", padding: "0.65rem 0.85rem", borderRadius: "6px", fontSize: "0.85rem", marginBottom: "1rem" }}>
                {profileMsg}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="form-label">
                  Role
                </label>
                <div style={{ padding: "0.55rem 0.75rem", background: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.85rem", fontWeight: 600, color: "#0f172a" }}>
                  {user.role === "admin" ? "Master Administrator" : user.role === "business" ? "Verified Merchant" : "Citizen User"}
                </div>
              </div>

              <div>
                <label className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="form-input"
                  style={{ background: "#f8fafc", color: "#64748b" }}
                />
              </div>

              <div>
                <label className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="btn-primary"
                style={{ marginTop: "0.5rem" }}
              >
                {savingProfile ? "Saving..." : "Save Profile Details"}
              </button>
            </form>
          </div>

          {/* Change Password Card */}
          <div style={{ background: "#ffffff", borderRadius: "8px", padding: "1.75rem", border: "1px solid #e2e8f0", boxShadow: "var(--shadow-sm)" }}>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <Lock size={18} color="#ea580c" /> Change Password
            </h2>

            {passwordMsg && (
              <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46", padding: "0.65rem 0.85rem", borderRadius: "6px", fontSize: "0.85rem", marginBottom: "1rem" }}>
                {passwordMsg}
              </div>
            )}

            {passwordError && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", padding: "0.65rem 0.85rem", borderRadius: "6px", fontSize: "0.85rem", marginBottom: "1rem" }}>
                {passwordError}
              </div>
            )}

            <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-input"
                />
              </div>

              <button
                type="submit"
                disabled={changingPass}
                className="btn-secondary"
                style={{ marginTop: "0.5rem" }}
              >
                {changingPass ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
