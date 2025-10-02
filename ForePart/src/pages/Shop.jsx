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
  const [selectedVariants, setSelectedVariants] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all"); // Category filter
  const [categories, setCategories] = useState([]); // Available categories

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

        // Extract unique categories from products
        const uniqueCategories = [...new Set(data.map(p => p.category))];
        setCategories(uniqueCategories);
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
   */
  const handleVariantChange = (productId, variantId) => {
    setSelectedVariants((prev) => ({ 
      ...prev, 
      [productId]: variantId 
    }));
  };

  /**
   * Check if user is logged in before performing cart actions
   */
  const requireLogin = () => {
    if (!user) {
      const nextPath = location.pathname;
      navigate(`/login?next=${encodeURIComponent(nextPath)}`);
      return false;
    }
    return true;
  };

  /**
   * Add product to cart with selected variant
   */
  const handleAddToCart = (product) => {
    if (!requireLogin()) return;

    const variantId = selectedVariants[product.id];
    
    if (!variantId) {
      alert("Please select a size/variant first.");
      return;
    }

    // Find the full variant object
    const selectedVariant = product.variants.find(v => v.id === parseInt(variantId));

    if (!selectedVariant || selectedVariant.stock === 0) {
      alert("Sorry, this variant is out of stock.");
      return;
    }

    addToCart({ 
      ...product, 
      selectedVariant: selectedVariant 
    });

    alert(`${product.name} (${selectedVariant.size || 'Default'}) added to cart!`);
  };

  /**
   * Buy Now - add to cart and go to checkout
   */
  const handleBuyNow = (product) => {
    if (!requireLogin()) return;

    const variantId = selectedVariants[product.id];
    if (!variantId) {
      alert("Please select a size/variant first.");
      return;
    }

    const selectedVariant = product.variants.find(v => v.id === parseInt(variantId));

    if (!selectedVariant || selectedVariant.stock === 0) {
      alert("Sorry, this variant is out of stock.");
      return;
    }

    addToCart({ 
      ...product, 
      selectedVariant: selectedVariant 
    });

    navigate("/cart");
  };

  /**
   * Filter products by selected category
   */
  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

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
        content="Browse eco-friendly products from Karathi Greenscape. Add items to your cart or purchase instantly."
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

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Filter by Category:
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === "all"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Products ({products.length})
            </button>
            {categories.map((category) => {
              const count = products.filter(p => p.category === category).length;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                    selectedCategory === category
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {category} ({count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg">
            {selectedCategory === "all" 
              ? "No products available right now." 
              : `No products found in "${selectedCategory}" category.`}
          </p>
          <p className="text-gray-500 mt-2">
            {selectedCategory !== "all" && (
              <button
                onClick={() => setSelectedCategory("all")}
                className="text-emerald-600 hover:underline"
              >
                View all products
              </button>
            )}
          </p>
        </div>
      ) : (
        /* Product Grid */
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {filteredProducts.map((product) => {
            // Calculate minimum price from variants
            const minPrice = product.variants && product.variants.length > 0
              ? Math.min(...product.variants.map(v => parseFloat(v.price)))
              : 0;

            return (
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
                  <div className="w-full h-48 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center text-gray-400 mb-4">
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

                {/* Category Badge */}
                <span className="inline-block px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-full mb-2 capitalize w-fit">
                  {product.category}
                </span>

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
                      Select Size:
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                      value={selectedVariants[product.id] || ""}
                      onChange={(e) =>
                        handleVariantChange(product.id, e.target.value)
                      }
                    >
                      <option value="">Choose a size</option>
                      {product.variants.map((variant) => (
                        <option 
                          key={variant.id} 
                          value={variant.id}
                          disabled={variant.stock === 0}
                        >
                          {variant.size || 'Default'} – KES {parseFloat(variant.price).toLocaleString()}
                          {variant.stock === 0 ? ' (Out of Stock)' : ` (${variant.stock} in stock)`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Price Display */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Starting from</p>
                  <p className="font-bold text-xl">
                    <span className="text-emerald-700">
                      KES {minPrice.toLocaleString()}
                    </span>
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Shop;