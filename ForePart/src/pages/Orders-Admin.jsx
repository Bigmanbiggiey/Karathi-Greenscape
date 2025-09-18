// src/pages/admin/OrdersAdmin.jsx
import React, { useEffect, useState } from "react";
import api from "../api/api"; 

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/shop/orders/");
        setOrders(res.data);
      } catch (err) {
        setError("Failed to load orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.post(`/shop/orders/${id}/set_status/`, { status: newStatus });
      setOrders(
        orders.map((o) =>
          o.id === id ? { ...o, status: newStatus } : o
        )
      );
      alert(`Order #${id} updated to ${newStatus}`);
    } catch (err) {
      alert("Failed to update status", err);
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.post(`/shop/orders/${id}/cancel/`);
      setOrders(
        orders.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o))
      );
      alert(`Order #${id} cancelled`);
    } catch (err) {
      alert("Failed to cancel order", err);
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Manage Orders</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Items</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td className="p-2 border">{o.id}</td>
              <td className="p-2 border">{o.user}</td>
              <td className="p-2 border">{o.status}</td>
              <td className="p-2 border">
                {o.items.map((item) => (
                  <div key={item.id}>
                    {item.variant} × {item.quantity}
                  </div>
                ))}
              </td>
              <td className="p-2 border space-x-2">
                {o.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleStatusChange(o.id, "processing")}
                      className="bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Processing
                    </button>
                    <button
                      onClick={() => handleCancel(o.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {o.status === "processing" && (
                  <>
                    <button
                      onClick={() => handleStatusChange(o.id, "shipped")}
                      className="bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Ship
                    </button>
                    <button
                      onClick={() => handleStatusChange(o.id, "cancelled")}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {o.status === "shipped" && (
                  <button
                    onClick={() => handleStatusChange(o.id, "completed")}
                    className="bg-purple-600 text-white px-2 py-1 rounded"
                  >
                    Complete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersAdmin;
