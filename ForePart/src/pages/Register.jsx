// src/pages/Register.jsx
import React, { useContext, useState } from "react";
import { Title, Meta } from "react-head";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    user_type: "customer", // default to customer
    billing_address: "",   // only used for customer
    key: "",               // only used for staff/admin
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      alert("Registration successful! You can now log in.");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Title>Register - Karathi Greenscape</Title>
      <Meta
        name="description"
        content="Create an account with Karathi Greenscape to shop eco-friendly products and manage your orders online."
      />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col max-w-md mx-auto gap-4 pt-15"
      >
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
          className="p-2 border rounded"
        />
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

        {/* --- User Type Select --- */}
        <select
          value={form.user_type}
          onChange={(e) => setForm({ ...form, user_type: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="customer">Customer</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>

        {/* --- Billing Address for Customer Only --- */}
        {form.user_type === "customer" && (
          <input
            type="text"
            placeholder="Billing Address"
            value={form.billing_address}
            onChange={(e) => setForm({ ...form, billing_address: e.target.value })}
            required
            className="p-2 border rounded"
          />
        )}

        {/* --- Key Input for Staff/Admin --- */}
        {(form.user_type === "staff" || form.user_type === "admin") && (
          <input
            type="text"
            placeholder={`${form.user_type === "staff" ? "Staff" : "Admin"} Key`}
            value={form.key}
            onChange={(e) => setForm({ ...form, key: e.target.value })}
            required
            className="p-2 border rounded"
          />
        )}

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
