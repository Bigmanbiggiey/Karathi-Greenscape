// src/pages/Login.jsx
import React, { useContext, useState } from "react";
import { Title, Meta } from "react-head";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Grab ?next= param from URL or fallback to homepage
  const searchParams = new URLSearchParams(location.search);
  const nextPath = searchParams.get("next") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(nextPath, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
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
        className="flex flex-col max-w-md mx-auto gap-4 mt-10 p-6 border rounded-lg shadow-md bg-white"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        {error && (
          <p className="text-red-600 text-center font-medium">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm">
          Don’t have an account?{" "}
          <Link
            to={`/register?next=${encodeURIComponent(nextPath)}`}
            className="text-green-600 underline"
          >
            Register
          </Link>
        </p>
      </form>
    </>
  );
}
