
import React, { useEffect, useState } from "react";
import { Title, Meta } from "react-head";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

import { API_BASE } from "../config";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({}); // track per product

  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Fetch products from backend
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

  const handleAddToCart = (product) => {
    const variant = selectedVariants[product.id];
    if (!variant) {
      alert("Please select a variant first.");
      return;
    }
    addToCart({ ...product, selectedVariant: variant });
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

      <h1 className="text-3xl font-bold mb-8">Our Products</h1>

      {products.length === 0 ? (
        <p className="text-gray-600">No products available right now.</p>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-xl shadow-sm hover:shadow-lg transition p-4 flex flex-col"
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

              <h2 className="font-semibold text-lg mb-2">{product.name}</h2>
              <p className="text-gray-600 text-sm flex-grow">{product.description}</p>

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <select
                  className="mt-3 border rounded-lg p-2"
                  value={selectedVariants[product.id] || ""}
                  onChange={(e) => handleVariantChange(product.id, e.target.value)}
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

              <p className="text-green-700 font-bold mt-3">
                From KES{" "}
                {typeof product.price === "number"
                  ? product.price.toLocaleString()
                  : "N/A"}
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    handleAddToCart(product);
                    navigate("/cart");
                  }}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
