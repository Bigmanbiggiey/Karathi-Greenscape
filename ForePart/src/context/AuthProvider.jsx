// src/context/AuthProvider.jsx
import React, { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";

// Use environment variable for API base URL
const API_BASE = `${import.meta.env.VITE_API_URL}/api/auth`;

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken")
  );
  const [loading, setLoading] = useState(true);

  // 🟢 Logout (memoized so it's stable)
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

  // 🟢 Refresh Token function
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
  }, [refreshToken, logout]);

  // 🟢 Refresh token on app load
  useEffect(() => {
    if (refreshToken) {
      refreshTokenFunc();
    } else {
      setLoading(false);
    }
  }, [refreshToken, refreshTokenFunc]);

  // 🟢 Auto-refresh every 4 minutes
  useEffect(() => {
    if (!refreshToken) return;

    const interval = setInterval(() => {
      refreshTokenFunc();
    }, 4 * 60 * 1000); // every 4 minutes

    return () => clearInterval(interval);
  }, [refreshToken, refreshTokenFunc]);

  // 🟢 Register
  const signup = async ({ username, first_name, last_name, email, password }) => {
    const res = await fetch(`${API_BASE}/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, first_name, last_name, email, password }),
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
      value={{ user, accessToken, refreshToken, loading, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
