
import React, { useState, useContext } from "react";
import { Title, Meta } from "react-head";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const CartAndCheckout = () => {
  const navigate = useNavigate();
  const { user, accessToken } = useContext(AuthContext);
  const { cart, updateQuantity, removeItem, subtotal, clearCart } = useCart();

  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mpesa"); // mpesa or airtel
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success, error, info
  

  const API_URL = import.meta.env.VITE_API_URL;

  // Format phone number helper
  const formatPhoneNumber = (phone) => {
    // Remove spaces and non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    
    // If starts with 0, replace with 254
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    }
    // If doesn't start with 254, add it
    else if (!cleaned.startsWith('254')) {
      cleaned = '254' + cleaned;
    }
    
    return cleaned;
  };

  // Check payment status
  const checkPaymentStatus = async (paymentId) => {
    try {
      const response = await fetch(`${API_URL}/api/payment/status/${paymentId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.status === 'completed') {
          setMessage("Payment successful! Your order has been confirmed.");
          setMessageType("success");
          clearCart(); // Clear cart after successful payment
          
          // Redirect to orders page after 3 seconds
          setTimeout(() => {
            navigate('/profile'); // or wherever you show order history
          }, 3000);
        } else if (data.status === 'failed') {
          setMessage("Payment failed. Please try again.");
          setMessageType("error");
          setProcessing(false);
        }
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };

  // Checkout handler
  const handleCheckout = async (e) => {
    e.preventDefault();
    
    // Validate cart
    if (cart.length === 0) {
      setMessage("Your cart is empty");
      setMessageType("error");
      return;
    }

    // Validate phone number
    const formattedPhone = formatPhoneNumber(phone);
    if (formattedPhone.length !== 12) {
      setMessage("Please enter a valid phone number (e.g., 0712345678)");
      setMessageType("error");
      return;
    }

    setProcessing(true);
    setMessage("");

    try {
      // Prepare cart items with variant IDs
      const cartItems = cart.map(item => ({
        variant_id: item.selectedVariant.id,
        quantity: item.quantity
      }));

      const response = await fetch(`${API_URL}/api/payment/initiate/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          payment_method: paymentMethod,
          phone_number: formattedPhone,
          cart_items: cartItems
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage(
          `${paymentMethod === 'mpesa' ? 'M-Pesa' : 'Airtel Money'} payment request sent to ${phone}. ` +
          `Please check your phone and enter your PIN to complete the payment.`
        );
        setMessageType("info");

        // Start polling payment status every 5 seconds
        const statusCheckInterval = setInterval(() => {
          checkPaymentStatus(data.payment_id);
        }, 5000);

        // Stop polling after 2 minutes
        setTimeout(() => {
          clearInterval(statusCheckInterval);
          if (processing) {
            setMessage("Payment timeout. Please check your transaction history.");
            setMessageType("error");
            setProcessing(false);
          }
        }, 120000); // 2 minutes
      } else {
        setMessage(data.error || "Payment initiation failed. Please try again.");
        setMessageType("error");
        setProcessing(false);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
      console.error("Checkout error:", error);
      setProcessing(false);
    }
  };

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Login</h1>
        <p className="text-gray-600 mb-4">You need to be logged in to checkout</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Title>Cart & Checkout | Karathi Greenscape</Title>
      <Meta
        name="description"
        content="Review your cart items and complete your order securely with M-Pesa or Airtel Money at Karathi Greenscape."
      />

      <h1 className="text-3xl font-bold mb-8 text-emerald-900">Cart & Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Cart Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-emerald-800">Your Cart</h2>
          
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Your cart is empty</p>
              <button
                onClick={() => navigate('/shop')}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li
                    key={`${item.id}-${item.selectedVariant?.id}`}
                    className="flex justify-between items-start border-b pb-4"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        Size: {item.selectedVariant?.size || 'Default'}
                      </p>
                      <p className="text-emerald-700 font-medium mt-1">
                        KES {parseFloat(item.selectedVariant?.price || 0).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Qty:</label>
                        <input
                          type="number"
                          min="1"
                          max={item.selectedVariant?.stock || 99}
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                          className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Subtotal */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-emerald-700">
                    KES {subtotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Checkout Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-emerald-800">Payment</h2>
          
          <form onSubmit={handleCheckout} className="space-y-6">
            {/* Payment Method Selection */}
            <div>
              <label className="block text-gray-700 font-medium mb-3">
                Select Payment Method
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`p-4 border-2 rounded-lg font-semibold transition ${
                    paymentMethod === 'mpesa'
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  M-Pesa
                </button>
                
                <button
                  type="button"
                  onClick={() => setPaymentMethod('airtel')}
                  className={`p-4 border-2 rounded-lg font-semibold transition ${
                    paymentMethod === 'airtel'
                      ? 'border-red-600 bg-red-50 text-red-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Airtel Money
                </button>
              </div>
            </div>

            {/* Phone Number Input */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                {paymentMethod === 'mpesa' ? 'M-Pesa' : 'Airtel Money'} Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0712345678"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the phone number to receive payment prompt
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={processing || cart.length === 0}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${
                processing || cart.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : paymentMethod === 'mpesa'
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Waiting for payment...
                </span>
              ) : (
                `Pay KES ${subtotal.toLocaleString()} with ${paymentMethod === 'mpesa' ? 'M-Pesa' : 'Airtel Money'}`
              )}
            </button>
          </form>

          {/* Message Display */}
          {message && (
            <div className={`mt-6 p-4 rounded-lg border ${
              messageType === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800'
                : messageType === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              <p className="text-sm font-medium">{message}</p>
              {processing && messageType === 'info' && (
                <p className="text-xs mt-2">
                  This may take a few seconds. Please don't close this page.
                </p>
              )}
            </div>
          )}

          {/* Payment Instructions */}
          {!processing && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-sm mb-2">Payment Instructions:</h3>
              <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                <li>Select your payment method</li>
                <li>Enter your phone number</li>
                <li>Click the pay button</li>
                <li>You'll receive a payment prompt on your phone</li>
                <li>Enter your PIN to complete the payment</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartAndCheckout;