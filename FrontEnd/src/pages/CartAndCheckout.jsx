import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const CartAndCheckout = () => {
  const { authTokens } = AuthContext();
  const { cart, updateQuantity, removeItem, subtotal } = useCart();

  const [phone, setPhone] = useState("");
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  // Checkout handler
  const handleCheckout = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:8000/api/payment/stkpush/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access}`,
        },
        body: JSON.stringify({
          phone_number: phone,
          amount: subtotal,
          order_id: 1, // TODO: dynamically link to actual order
        }),
      });

      if (!response.ok) throw new Error("Failed to initiate payment");

      await response.json();
      setMessage(`STK Push sent to ${phone}. Check your phone to complete payment.`);
    } catch (error) {
      setMessage("Payment initiation failed. Try again.");
      console.error("Checkout error:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-8">
      <Helmet>
        <title>Cart & Checkout | Karathi Greenscape</title>
        <meta
          name="description"
          content="Review your cart items and complete your order securely with M-Pesa checkout at Karathi Greenscape."
        />
      </Helmet>

      {/* Cart Section */}
      <div>
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        {cart.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <ul className="space-y-4">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center border p-4 rounded-lg shadow-sm"
              >
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p>KES {item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, e.target.value)}
                    className="w-16 px-2 py-1 border rounded"
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Subtotal */}
        {cart.length > 0 && (
          <div className="mt-6 text-lg font-semibold">
            Subtotal: KES {subtotal.toLocaleString()}
          </div>
        )}
      </div>

      {/* Checkout Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>
        <form
          onSubmit={handleCheckout}
          className="bg-white shadow-md rounded-xl p-6 border border-gray-200"
        >
          <label className="block mb-4">
            <span className="block text-gray-700 font-medium mb-2">
              M-Pesa Phone Number
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 2547XXXXXXXX"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </label>

          <button
            type="submit"
            disabled={processing || cart.length === 0}
            className={`w-full py-2 px-4 rounded-lg font-semibold text-white ${
              processing || cart.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {processing ? "Processing..." : "Pay with M-Pesa"}
          </button>
        </form>

        {message && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartAndCheckout;
