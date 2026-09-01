// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate, useLocation, useSearchParams, Link } from "react-router-dom";
import { Title, Meta } from "react-head";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useContext(AuthContext);
  
  // State for form handling
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call login function from AuthContext
      const userData = await login(email, password);
      
      // Determine redirect path
      // Priority: 1) location.state.from (PrivateRoute redirect)
      //          2) searchParams 'next' (manual redirect)
      //          3) Role-based default
      const from = location.state?.from?.pathname ||
                   searchParams.get("next") ||
                   (userData.user_type === 'admin' ? '/admin/dashboard' :
                    userData.user_type === 'staff' ? '/staff/dashboard' : '/');
      
      // Redirect user
      navigate(from, { replace: true });
    } catch (err) {
      // Display error message to user
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Preserve the 'next' parameter when linking to register page
  const nextParam = searchParams.get("next");
  const registerLink = nextParam 
    ? `/register?next=${encodeURIComponent(nextParam)}`
    : "/register";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      {/* SEO Meta Tags */}
      <Title>Login | Karathi Greenscape</Title>
      <Meta
        name="description"
        content="Login to your Karathi Greenscape account to shop eco-friendly products and manage your orders."
      />

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Login to continue shopping</p>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
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

          {/* Password Input */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
            <div className="text-right mt-2">
              <Link
                to="/forgot-password"
                className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          {/* Link to Register */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link 
              to={registerLink} 
              className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline"
            >
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;