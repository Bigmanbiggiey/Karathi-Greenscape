// src/context/AuthProvider.jsx
import React, { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/auth`;

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken"));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!accessToken;

  // 🟢 Logout
  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/logout/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }

    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }, [accessToken]);

  // 🟢 Fetch profile
  const fetchProfile = useCallback(
    async (token = accessToken) => {
      if (!token) return;

      const res = await fetch(`${API_BASE}/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } else if (res.status === 401) {
        // Token expired, try refreshing
        await refreshTokenFunc();
      }
    },
    [accessToken] // ✅ depends only on accessToken
  );

  // 🟢 Refresh token
  const refreshTokenFunc = useCallback(async () => {
    if (!refreshToken) return;

    const res = await fetch(`${API_BASE}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!res.ok) {
      logout();
      return;
    }

    const data = await res.json();
    setAccessToken(data.access);
    localStorage.setItem("accessToken", data.access);
    setLoading(false);

    // ✅ fetch profile after refreshing
    fetchProfile(data.access);
  }, [refreshToken, logout, fetchProfile]); // ✅ include fetchProfile

  // 🟢 On load
  useEffect(() => {
    if (refreshToken) {
      refreshTokenFunc();
    } else {
      setLoading(false);
    }
  }, [refreshToken, refreshTokenFunc]);

  // 🟢 Auto refresh
  useEffect(() => {
    if (!refreshToken) return;
    const interval = setInterval(refreshTokenFunc, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshToken, refreshTokenFunc]);

  // 🟢 Register
  const signup = async ({ username, email, password, user_type = "customer", billing_address = "" }) => {
    const res = await fetch(`${API_BASE}/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, user_type, billing_address }),
    });

    if (!res.ok) throw new Error("Registration failed");
    return await res.json();
  };

  // 🟢 Login
  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();

    setAccessToken(data.access);
    setRefreshToken(data.refresh);
    setUser(data.user);

    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data.user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        accessToken,
        refreshToken,
        loading,
        signup,
        login,
        logout,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
