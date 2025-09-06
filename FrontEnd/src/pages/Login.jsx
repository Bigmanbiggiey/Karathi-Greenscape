import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate("/"); // redirect to homepage/dashboard after login
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Karathi Greenscape</title>
        <meta
          name="description"
          content="Log in to your Karathi Greenscape account to shop sustainable products, view your orders, and manage your profile."
        />
      </Helmet>

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
          <a href="/register" className="text-green-600 underline">
            Register
          </a>
        </p>
      </form>
    </>
  );
}
