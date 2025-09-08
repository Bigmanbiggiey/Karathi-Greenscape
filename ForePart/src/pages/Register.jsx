// src/pages/Register.jsx
import React, { useContext, useState } from "react";
import { Title, Meta } from "react-head";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const { signup } = useContext(AuthContext);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      alert("Registration successful! You can now log in.");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      {/* SEO Head */}
      <Title>Register - Karathi Greenscape</Title>
      <Meta
        name="description"
        content="Create an account with Karathi Greenscape to shop eco-friendly products and manage your orders online."
      />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col max-w-md mx-auto gap-4"
      >
        <input
          type="text"
          placeholder="First Name"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          required
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          required
          className="p-2 border rounded"
        />
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
          Register
        </button>
      </form>
    </>
  );
}
