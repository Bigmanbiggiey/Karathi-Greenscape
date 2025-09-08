// src/components/ProductCard.jsx
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/cart"); // Redirect straight to checkout page
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      {/* Product Image */}
      <img
        src={product.image || "/placeholder.png"}
        alt={product.name}
        className="w-full h-48 object-cover"
      />

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        <p className="mt-2 text-green-700 font-bold text-lg">
          KES {product.price}
        </p>

        {/* Actions */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => addToCart(product)}
            className="flex-1 bg-green-700 text-white px-3 py-2 rounded-lg hover:bg-green-800"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
