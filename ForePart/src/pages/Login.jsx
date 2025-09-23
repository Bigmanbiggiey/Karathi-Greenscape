// src/pages/Login.jsx
import React, { useContext, useState } from "react";
import { Title, Meta } from "react-head";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Grab ?next= param from URL
  const searchParams = new URLSearchParams(location.search);
  const nextPath = searchParams.get("next") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate(nextPath, { replace: true }); // redirect back where they came from
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      {/* SEO Head */}
      <Title>Login - Karathi Greenscape</Title>
      <Meta
        name="description"
        content="Log in to your Karathi Greenscape account to shop sustainable products, view your orders, and manage your profile."
      />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col max-w-md mx-auto gap-4 mt-10"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="p-2 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="p-2 border rounded"
        />

        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Login
        </button>

        <p className="text-center text-sm">
          Don’t have an account?{" "}
          <a
            href={`/register?next=${encodeURIComponent(nextPath)}`}
            className="text-green-600 underline"
          >
            Register
          </a>
        </p>
      </form>
    </>
  );
}
