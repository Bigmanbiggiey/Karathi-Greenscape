import React, { useState, useCallback, useRef, useEffect } from "react";
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
  const [loading, setLoading] = useState(true); // Initial state is TRUE
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
    if (!refreshToken || refreshingRef.current) return null;

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
        
        // IMPORTANT: Return the new token so other functions can use it immediately
        return data.access; 
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
    }
    return null; // Return null on failure
  }, [refreshToken, logout]);

  // 🟢 Fetch profile
  const fetchProfile = useCallback(
    async (token) => {
      const currentToken = token || accessToken;
      if (!currentToken) {
        console.warn("No access token available for profile fetch.");
        return null;
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
          return data;
        } else if (res.status === 401) {
          console.warn("⚠️ Access token expired. Refreshing...");
          const newToken = await refreshTokenFunc();
          if (newToken) {
            // Retry profile fetch with the new token
            return await fetchProfile(newToken);
          }
        } else {
          const text = await res.text();
          console.error(`❌ Profile fetch failed [${res.status}]:`, text);
        }
      } catch (error) {
        console.error("❌ Fetch profile failed:", error);
      }
      return null;
    },
    [accessToken, refreshTokenFunc]
  );

  // 🔑 INITIAL AUTH CHECK EFFECT
  useEffect(() => {
    // Only run on mount
    const initialAuthCheck = async () => {
      // If we have an access token, try to fetch the profile
      if (accessToken) {
        // If user object is missing (e.g., initial load), fetch profile
        if (!user) {
          await fetchProfile(accessToken);
        }
      } 
      // After any checks, stop the loading screen.
      setLoading(false);
    };

    initialAuthCheck();
    
  // Note: We intentionally only want this to run on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

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

  // 🟢 Request a password-reset email
  const requestPasswordReset = async (email) => {
    const res = await fetch(`${API_BASE}/password/reset/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.detail || "Could not send the reset email.");
    return data;
  };

  // 🟢 Confirm a password reset with the uid + token from the emailed link
  const confirmPasswordReset = async ({ uid, token, new_password }) => {
    const res = await fetch(`${API_BASE}/password/reset/confirm/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid, token, new_password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(
        data.new_password?.[0] ||
          data.token?.[0] ||
          data.uid?.[0] ||
          data.detail ||
          "Could not reset your password."
      );
    }
    return data;
  };

  // 🟢 Change password for the logged-in user
  const changePassword = async ({ old_password, new_password }) => {
    const res = await fetch(`${API_BASE}/password/change/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ old_password, new_password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(
        data.old_password?.[0] ||
          data.new_password?.[0] ||
          data.detail ||
          "Could not change your password."
      );
    }
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        accessToken,
        refreshToken,
        loading, // This is what PrivateRoute checks
        signup,
        login,
        logout,
        fetchProfile,
        refreshTokenFunc,
        requestPasswordReset,
        confirmPasswordReset,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}