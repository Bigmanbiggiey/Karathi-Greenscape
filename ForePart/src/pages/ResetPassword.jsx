// src/pages/ResetPassword.jsx
import React, { useState, useContext } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Title, Meta } from "react-head";
import { AuthContext } from "../context/AuthContext";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { confirmPasswordReset } = useContext(AuthContext);

  const uid = searchParams.get("uid") || "";
  const token = searchParams.get("token") || "";
  const linkValid = Boolean(uid && token);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset({ uid, token, new_password: password });
      setDone(true);
      setTimeout(() => navigate("/login", { replace: true }), 2500);
    } catch (err) {
      setError(err.message || "Could not reset your password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <Title>Reset Password | Karathi Greenscape</Title>
      <Meta name="description" content="Choose a new password for your Karathi Greenscape account." />

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">Set a new password</h1>
          <p className="text-gray-600">Choose a strong password you don't use elsewhere.</p>
        </div>

        {!linkValid ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-lg text-sm font-medium">
            This reset link is missing or malformed. Please request a new one from the{" "}
            <Link to="/forgot-password" className="underline font-semibold">
              forgot password
            </Link>{" "}
            page.
          </div>
        ) : done ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-4 rounded-lg text-sm font-medium">
            Your password has been reset. Redirecting you to login…
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Enter a new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Re-enter the new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Resetting..." : "Reset password"}
              </button>
            </form>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
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

export default ResetPassword;
