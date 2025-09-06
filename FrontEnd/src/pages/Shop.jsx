import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/shop/products/");
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

  if (loading) return <p className="text-center py-10">Loading products...</p>;
  if (error) return <p className="text-center py-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Helmet>
        <title>Shop | Karathi Greenscape</title>
        <meta
          name="description"
          content="Browse eco-friendly products from Karathi Greenscape. Add items to your cart or purchase instantly with secure M-Pesa checkout."
        />
      </Helmet>

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
              <p className="text-green-700 font-bold mt-3">
                KES {product.price.toLocaleString()}
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    addToCart(product);
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
