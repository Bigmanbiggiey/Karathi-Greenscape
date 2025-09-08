// src/pages/Logout.jsx
import React, { useContext, useEffect } from "react";
import { Title, Meta } from "react-head";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  return (
    <>
      {/* SEO Head */}
      <Title>Logout - Karathi Greenscape</Title>
      <Meta
        name="description"
        content="You have successfully logged out of Karathi Greenscape. Come back soon to continue shopping eco-friendly products."
      />

      <p className="text-center mt-10">Logging out...</p>
    </>
  );
}
