// src/pages/ForgotPassword.jsx
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Title, Meta } from "react-head";
import { AuthContext } from "../context/AuthContext";

const ForgotPassword = () => {
  const { requestPasswordReset } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <Title>Forgot Password | Karathi Greenscape</Title>
      <Meta
        name="description"
        content="Request a link to reset your Karathi Greenscape account password."
      />

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">
            Forgot your password?
          </h1>
          <p className="text-gray-600">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        {sent ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-4 rounded-lg text-sm">
            <p className="font-medium">
              If an account exists for <span className="font-semibold">{email}</span>,
              a password-reset link is on its way. Check your inbox (and spam folder).
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            Remembered it?{" "}
            <Link
              to="/login"
              className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline"
            >
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
