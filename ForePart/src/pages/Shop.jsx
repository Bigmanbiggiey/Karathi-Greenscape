// src/pages/Shop.jsx
import React, { useEffect, useState, useContext } from "react";
import { Title, Meta } from "react-head";
import { useCart } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE } from "../config";
import { AuthContext } from "../context/AuthContext";

const Shop = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({}); // Track selected variant for each product

  // Context and navigation hooks
  const { addToCart } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch products from API on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/shop/products/`);
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  /**
   * Handle variant selection for a specific product
   * Stores the selected variant ID in state
   */
  const handleVariantChange = (productId, variantId) => {
    setSelectedVariants((prev) => ({ 
      ...prev, 
      [productId]: variantId 
    }));
  };

  /**
   * Check if user is logged in before performing cart actions
   * If not logged in, redirect to login page with 'next' parameter
   * The 'next' parameter preserves the current page URL so user can be redirected back
   */
  const requireLogin = () => {
    if (!user) {
      // Save current path to redirect back after login
      const nextPath = location.pathname;
      navigate(`/login?next=${encodeURIComponent(nextPath)}`);
      return false;
    }
    return true;
  };

  /**
   * Add product to cart
   * 1. Check if user is logged in
   * 2. Validate that a variant is selected
   * 3. Add product with selected variant to cart
   */
  const handleAddToCart = (product) => {
    // Check authentication first
    if (!requireLogin()) return;

    // Get the selected variant for this product
    const variantId = selectedVariants[product.id];
    
    // Validate variant selection
    if (!variantId) {
      alert("Please select a variant first.");
      return;
    }

    // Find the full variant object from product variants
    const selectedVariant = product.variants.find(v => v.id === parseInt(variantId));

    // Add product with variant info to cart
    addToCart({ 
      ...product, 
      selectedVariant: selectedVariant 
    });

    // Optional: Show success feedback
    alert(`${product.name} added to cart!`);
  };

  /**
   * Buy Now functionality
   * 1. Check if user is logged in
   * 2. Add product to cart
   * 3. Navigate directly to cart page
   */
  const handleBuyNow = (product) => {
    // Check authentication first
    if (!requireLogin()) return;

    // Add to cart (this also validates variant selection)
    const variantId = selectedVariants[product.id];
    if (!variantId) {
      alert("Please select a variant first.");
      return;
    }

    const selectedVariant = product.variants.find(v => v.id === parseInt(variantId));
    addToCart({ 
      ...product, 
      selectedVariant: selectedVariant 
    });

    // Navigate to cart for checkout
    navigate("/cart");
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* SEO Meta Tags */}
      <Title>Shop | Karathi Greenscape</Title>
      <Meta
        name="description"
        content="Browse eco-friendly products from Karathi Greenscape. Add items to your cart or purchase instantly with secure M-Pesa checkout."
      />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-emerald-900 mb-2">
          Our Products
        </h1>
        <p className="text-gray-600">
          Discover our collection of eco-friendly plants and gardening products
        </p>
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg">No products available right now.</p>
          <p className="text-gray-500 mt-2">Check back soon for new arrivals!</p>
        </div>
      ) : (
        /* Product Grid */
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-gray-200 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col"
            >
              {/* Product Image */}
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}

              {/* Product Name */}
              <h2 className="font-semibold text-lg mb-2 text-emerald-800">
                {product.name}
              </h2>

              {/* Product Description */}
              <p className="text-gray-700 text-sm flex-grow mb-4">
                {product.description || "No description available"}
              </p>

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Size/Variant:
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    value={selectedVariants[product.id] || ""}
                    onChange={(e) =>
                      handleVariantChange(product.id, e.target.value)
                    }
                  >
                    <option value="">Choose a variant</option>
                    {product.variants.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        {variant.name} – KES{" "}
                        {typeof variant.price === "number"
                          ? variant.price.toLocaleString()
                          : "N/A"}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price Display */}
              <div className="mb-4">
                <p className="text-sm text-gray-600">Starting from</p>
                <p className="font-bold text-xl">
                  {typeof product.price === "number" ? (
                    <span className="text-emerald-700">
                      KES {product.price.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-gray-500 italic">Price unavailable</span>
                  )}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 py-2 px-4 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleBuyNow(product)}
                  className="flex-1 py-2 px-4 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;