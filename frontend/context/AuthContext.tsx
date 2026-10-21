"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI, setAuthToken, removeAuthToken, getAuthToken } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "business" | "user";
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  business: any | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (payload: any) => Promise<any>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  switchRoleDemo: (role: "admin" | "business" | "user") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<any | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load existing session on initial mount
  useEffect(() => {
    const savedToken = getAuthToken();
    if (savedToken) {
      setTokenState(savedToken);
      authAPI
        .getMe()
        .then((res) => {
          if (res.success && res.user) {
            setUser(res.user);
            setBusiness(res.business || null);
          } else {
            logout();
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      if (res.success && res.token) {
        setAuthToken(res.token);
        setTokenState(res.token);
        setUser(res.user);
        setBusiness(res.business || null);
        return res;
      }
      throw new Error(res.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: any) => {
    setIsLoading(true);
    try {
      const res = await authAPI.register(payload);
      if (res.success && res.token) {
        setAuthToken(res.token);
        setTokenState(res.token);
        setUser(res.user);
        setBusiness(res.business || null);
        return res;
      }
      throw new Error(res.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    setTokenState(null);
    setUser(null);
    setBusiness(null);
  };

  const refreshUser = async () => {
    try {
      const res = await authAPI.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        setBusiness(res.business || null);
      }
    } catch (e) {
      console.error("Failed to refresh user:", e);
    }
  };

  // Demo Switcher for fast testing between Admin, Business Owner, and Customer
  const switchRoleDemo = async (role: "admin" | "business" | "user") => {
    if (role === "admin") {
      await login("admin@shimogaservice.com", "admin123");
    } else if (role === "business") {
      await login("owner@manipal.com", "owner123");
    } else {
      await login("user@gmail.com", "user123");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        business,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
        switchRoleDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
