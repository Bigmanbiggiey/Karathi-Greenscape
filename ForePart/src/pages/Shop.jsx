// src/pages/Shop.jsx
import React, { useEffect, useState, useContext } from "react";
import { Title, Meta } from "react-head";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

import { API_BASE } from "../config";
import { AuthContext } from "../context/AuthContext";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});

  const { addToCart } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const handleVariantChange = (productId, variant) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variant }));
  };

  const requireLogin = () => {
    if (!user) {
      // you can decide logic here:
      // For simplicity: send to login, with a register link on login page
      navigate("/login");
      return false;
    }
    return true;
  };

  const handleAddToCart = (product) => {
    if (!requireLogin()) return;

    const variant = selectedVariants[product.id];
    if (!variant) {
      alert("Please select a variant first.");
      return;
    }
    addToCart({ ...product, selectedVariant: variant });
  };

  const handleBuyNow = (product) => {
    if (!requireLogin()) return;

    handleAddToCart(product);
    navigate("/cart");
  };

  if (loading) return <p className="text-center py-10">Loading products...</p>;
  if (error) return <p className="text-center py-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* SEO */}
      <Title>Shop | Karathi Greenscape</Title>
      <Meta
        name="description"
        content="Browse eco-friendly products from Karathi Greenscape. Add items to your cart or purchase instantly with secure M-Pesa checkout."
      />

      <h1 className="text-3xl font-bold mb-8 text-emerald-900">Our Products</h1>

      {products.length === 0 ? (
        <p className="text-gray-600">No products available right now.</p>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-gray-200 bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col"
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              <h2 className="font-semibold text-lg mb-2 text-emerald-800">
                {product.name}
              </h2>
              <p className="text-gray-700 text-sm flex-grow">
                {product.description}
              </p>

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <select
                  className="mt-3 border border-gray-300 rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500"
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
              )}

              {/* Price Display */}
              <p className="font-bold mt-3">
                From{" "}
                {typeof product.price === "number" ? (
                  <span className="text-emerald-700">
                    {product.price.toLocaleString()} Ksh
                  </span>
                ) : (
                  <span className="text-gray-500 italic">N/A</span>
                )}
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 py-2 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleBuyNow(product)}
                  className="flex-1 py-2 px-4 bg-amber-400 text-white rounded-lg hover:bg-amber-600 transition"
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
