import React, { useState, useCallback, useRef } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/auth`;

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
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
  const refreshingRef = useRef(false); // Prevent multiple simultaneous refreshes

  const isAuthenticated = !!accessToken;

  // 🟢 Logout
  const logout = useCallback(async () => {
    try {
      if (refreshToken) {
        await fetch(`${API_BASE}/logout/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
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

    navigate("/login", { replace: true });
  }, [refreshToken, navigate]);

  // 🟢 Refresh token
  const refreshTokenFunc = useCallback(async () => {
    if (!refreshToken || refreshingRef.current) return;

    refreshingRef.current = true;

    try {
      const res = await fetch(`${API_BASE}/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      const text = await res.text(); // read body once
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (err) {
        console.error("Invalid JSON in refresh response:", err);
      }

      if (res.status === 200 && data?.access) {
        setAccessToken(data.access);
        localStorage.setItem("accessToken", data.access);

        // Fetch profile with new token
        await fetchProfile(data.access);
      } else if (res.status === 401 || res.status === 403) {
        console.warn("Refresh denied → logging out");
        logout();
      } else {
        console.error("Unexpected refresh error:", res.status, text);
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    } finally {
      refreshingRef.current = false;
      setLoading(false);
    }
  }, [refreshToken, logout]);

  // 🟢 Fetch profile
const fetchProfile = useCallback(
  async (token) => {
    const currentToken = token || accessToken;
    if (!currentToken) {
      console.warn("No access token available for profile fetch.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/profile/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`, // ✅ Include token here
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        console.log("✅ Profile fetched successfully:", data);
      } else if (res.status === 401) {
        console.warn("⚠️ Access token expired. Refreshing...");
        await refreshTokenFunc();
      } else {
        const text = await res.text();
        console.error(`❌ Profile fetch failed [${res.status}]:`, text);
      }
    } catch (error) {
      console.error("❌ Fetch profile failed:", error);
    }
  },
  [accessToken, refreshTokenFunc]
);


  // 🟢 Register
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
      billing_address,
    };

    if (user_type === "admin") bodyData.admin_key = key;
    else if (user_type === "staff") bodyData.staff_key = key;

    const res = await fetch(`${API_BASE}/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(JSON.stringify(errData) || "Registration failed");
    }

    return await res.json();
  };

  // 🟢 Login
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
        refreshTokenFunc,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
