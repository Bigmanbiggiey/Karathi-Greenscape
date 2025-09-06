// src/pages/Orders.jsx
import { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../context/AuthContext";
import OrderStatusBadge from "../components/OrderStatusBadge";

const Orders = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/shop/orders/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* SEO */}
      <Helmet>
        <title>My Orders | Karathi Greenscape</title>
        <meta
          name="description"
          content="Track your orders and view payment status at Karathi Greenscape."
        />
      </Helmet>

      <h1 className="text-3xl font-bold text-green-700 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-xl shadow-sm p-5 bg-white hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">
                  Order #{order.id}
                </h2>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-gray-700">
                <span className="font-medium">Total:</span> KES{" "}
                {order.total_amount}
              </p>
              <p className="text-gray-600 text-sm">
                Placed on: {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
