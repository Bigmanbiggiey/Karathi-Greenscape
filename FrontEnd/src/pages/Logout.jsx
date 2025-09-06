import React, { useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
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
      <Helmet>
        <title>Logout - Karathi Greenscape</title>
        <meta
          name="description"
          content="You have successfully logged out of Karathi Greenscape. Come back soon to continue shopping eco-friendly products."
        />
      </Helmet>
      <p className="text-center mt-10">Logging out...</p>
    </>
  );
}
