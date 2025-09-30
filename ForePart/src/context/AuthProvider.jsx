// src/context/AuthProvider.jsx
import React, { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/auth`;

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
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
      if (accessToken) {
        await fetch(`${API_BASE}/logout/`, {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }

    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login"); // redirect to login
  }, [accessToken, navigate]);

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
        await refreshTokenFunc();
      }
    },
    [accessToken]
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

    await fetchProfile(data.access);
    setLoading(false);
  }, [refreshToken, logout, fetchProfile]);

  // 🟢 On load
  useEffect(() => {
    if (refreshToken) {
      refreshTokenFunc();
    } else {
      setLoading(false);
    }
  }, [refreshToken, refreshTokenFunc]);

  // 🟢 Auto refresh every 4 minutes
  useEffect(() => {
    if (!refreshToken) return;
    const interval = setInterval(refreshTokenFunc, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshToken, refreshTokenFunc]);

  // 🟢 Register (handles keys for staff/admin)
const signup = async ({
  username,
  email,
  password,
  first_name,
  last_name,
  user_type = "customer",
  billing_address = "",
  key = "",
}) => {
  const bodyData = { 
    username, 
    email, 
    password, 
    first_name,
    last_name,
    user_type, 
    billing_address 
  };
  
  // Send the key with the correct field name
  if (user_type === "admin") {
    bodyData.admin_key = key;
  } else if (user_type === "staff") {
    bodyData.staff_key = key;
  }

  const res = await fetch(`${API_BASE}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bodyData),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.detail || "Registration failed");
  }

  return await res.json();
};

  // 🟢 Login (includes redirect_url)
  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.detail || "Login failed");
    }

    const data = await res.json();

    setAccessToken(data.access);
    setRefreshToken(data.refresh);
    setUser(data.user);

    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    localStorage.setItem("user", JSON.stringify(data.user));

    // Determine redirect URL based on user_type
    let redirect_url = "/";
    if (data.user.user_type === "admin") redirect_url = "/admin/dashboard";
    else if (data.user.user_type === "staff") redirect_url = "/staff/dashboard";

    return { ...data.user, redirect_url };
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
