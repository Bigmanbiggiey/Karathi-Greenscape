// src/pages/Logout.jsx
import React, { useContext, useEffect } from "react";
import { Title, Meta } from "react-head";
import { AuthContext } from "../context/AuthContext";

export default function Logout() {
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    // Calling logout() handles the API request, state cleanup, 
    // and the navigation to /login.
    logout();
    
    // We intentionally do NOT call navigate("/login") here, 
    // as it is handled inside the logout function in AuthProvider.
    // This prevents a redundant redirect call.
  }, [logout]); // logout is a useCallback, so this hook runs once on mount

  return (
    <div className="flex justify-center items-center min-h-[40vh]">
      {/* SEO Head */}
      <Title>Logging Out...</Title>
      <Meta
        name="description"
        content="You are currently logging out of Karathi Greenscape."
      />

      <p className="text-xl font-semibold text-gray-700">Logging out... Please wait.</p>
    </div>
  );
}