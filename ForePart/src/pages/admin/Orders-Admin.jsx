import React, { useEffect, useState, useContext, useCallback } from "react";
// 🟢 RESTORING ORIGINAL IMPORTS
import api from "../../api/api"; 
import { AuthContext } from "../../context/AuthContext"; // Assuming AuthContext provides user info

/** * ----------------------------------------------------------------------
 * OrdersAdmin Component
 * ----------------------------------------------------------------------
 */

// Notification component for replacing alert()
const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  const baseClasses = "fixed top-4 right-4 p-4 rounded-lg shadow-xl text-white z-50 transition-transform duration-300 transform";
  const typeClasses = type === 'success' ? 'bg-green-500' : 'bg-red-600';

  return (
    <div className={`${baseClasses} ${typeClasses} flex items-center`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 font-bold text-lg leading-none">
        &times;
      </button>
    </div>
  );
};

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({ message: '', type: '' });
  
  // 🟢 USING REAL useContext(AuthContext)
  const { user } = useContext(AuthContext) || {}; 

  // Function to display notification and auto-dismiss
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    const timer = setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Assuming API expects path starting from /shop (or similar based on your setup)
        const res = await api.get("/shop/orders/"); 
        setOrders(res.data);
      } catch (err) {
        console.error("Error loading orders:", err);
        setError("Failed to load orders. Check the console for details.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Handler for setting status (Processing, Shipped, Completed)
  const handleStatusChange = async (id, newStatus) => {
    // Show loading state while processing
    setLoading(true);
    const auditData = { status: newStatus };

    try {
      // NOTE: Backend will perform permission check (Superuser/Admin/Staff)
      await api.post(`/shop/orders/${id}/set_status/`, auditData); 
      
      // OPTIMISTIC UI UPDATE for last modified field
      const handlerInfo = user ? { username: user.username } : null;
      
      setOrders(
        orders.map((o) =>
          o.id === id ? { 
            ...o, 
            status: newStatus,
            last_modified_by: handlerInfo, 
          } : o
        )
      );
      showNotification(`Order #${id} updated to ${newStatus}`, 'success');
    } catch (err) {
      console.error("Failed to update status:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.detail || `Error ${err.response?.status}. Check permissions/stock.`;
      showNotification(`Failed to update status: ${errorMessage}`, 'error');
    } finally {
        setLoading(false);
    }
  };

  // Handler for cancelling order
  const handleCancel = async (id) => {
    // Show loading state while processing
    setLoading(true);
    try {
      // NOTE: Backend will perform permission check (Superuser/Admin/Staff)
      await api.post(`/shop/orders/${id}/cancel/`);
      
      // OPTIMISTIC UI UPDATE for last modified field
      const handlerInfo = user ? { username: user.username } : null;

      setOrders(
        orders.map((o) => 
          o.id === id ? { 
            ...o, 
            status: "cancelled", 
            last_modified_by: handlerInfo, 
          } : o
        )
      );
      showNotification(`Order #${id} cancelled`, 'success');
    } catch (err) {
      console.error("Failed to cancel order:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.detail || `Error ${err.response?.status}. Do you have permission?`;
      showNotification(`Failed to cancel order: ${errorMessage}`, 'error');
    } finally {
        setLoading(false);
    }
  };

  if (loading && orders.length === 0) return <p className="text-center p-8 text-xl font-semibold text-green-700">Loading orders...</p>;
  if (error) return <p className="text-center text-red-500 p-8 text-lg font-medium">{error}</p>;

  // Simple client-side check for button display based on user role (Admin/Staff only)
  // Assuming user object exists and has one of these boolean/string fields
  const canManipulate = user && (user.user_type === 'admin' || user.user_type === 'staff' || user.is_superuser || user.is_staff);

  const getStatusClasses = (status) => {
    switch (status) {
      case "pending": return 'bg-yellow-100 text-yellow-800';
      case "processing": return 'bg-blue-100 text-blue-800';
      case "shipped": return 'bg-indigo-100 text-indigo-800';
      case "completed": return 'bg-green-100 text-green-800';
      case "cancelled": return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gray-50 min-h-screen font-sans">
      <Notification 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ message: '', type: '' })} 
      />
      
      <h1 className="text-3xl font-extrabold text-gray-800 border-b-2 border-green-300 pb-2">
        Order Management Dashboard
      </h1>
      
      {user && (
        <p className="text-sm text-gray-600">
          Current Handler: <span className="font-semibold text-green-700">{user.username}</span> 
          {user.user_type && <span> (Role: {user.user_type.toUpperCase()})</span>}
        </p>
      )}

      {loading && orders.length > 0 && (
          <div className="text-center text-sm text-green-600 font-medium">Processing action...</div>
      )}

      <div className="overflow-x-auto shadow-2xl rounded-xl">
        <table className="w-full text-left text-gray-700 bg-white">
          <thead className="text-xs uppercase bg-green-200 text-green-900 tracking-wider sticky top-0">
            <tr>
              <th scope="col" className="p-4">ID</th>
              <th scope="col" className="p-4">Customer</th>
              <th scope="col" className="p-4">Status</th>
              <th scope="col" className="p-4">Last Handled By</th>
              <th scope="col" className="p-4">Items</th>
              <th scope="col" className="p-4 w-[250px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b transition duration-150 hover:bg-green-50">
                <td className="p-4 font-bold text-gray-900">{o.id}</td>
                <td className="p-4 text-sm">
                  {o.user ? `${o.user.first_name || ''} ${o.user.last_name || ''}`.trim() || o.user.username : 'N/A'}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full shadow-sm ${getStatusClasses(o.status)}`}>
                    {o.status.toUpperCase()}
                  </span>
                </td>
                {/* 🟢 Display Last Handler */}
                <td className="p-4 text-sm font-medium text-gray-700">
                  {o.last_modified_by ? o.last_modified_by.username : 'N/A'}
                </td>
                <td className="p-4 text-xs space-y-1">
                  {o.items.map((item) => (
                    <div key={item.id} className="text-gray-600 leading-tight">
                      <span className="font-semibold">{item.variant.product.name || 'Product'}</span> 
                      {item.variant.size ? ` (${item.variant.size})` : ''} × {item.quantity}
                    </div>
                  ))}
                </td>
                <td className="p-4 space-x-1 space-y-1 whitespace-nowrap">
                  {canManipulate ? (
                    <>
                      {o.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(o.id, "processing")}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-xs rounded shadow-md transition disabled:opacity-50"
                            disabled={loading}
                          >
                            Process
                          </button>
                          <button
                            onClick={() => handleCancel(o.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-xs rounded shadow-md transition disabled:opacity-50"
                            disabled={loading}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {o.status === "processing" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(o.id, "shipped")}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 text-xs rounded shadow-md transition disabled:opacity-50"
                            disabled={loading}
                          >
                            Ship
                          </button>
                          <button
                            onClick={() => handleCancel(o.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-xs rounded shadow-md transition disabled:opacity-50"
                            disabled={loading}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {o.status === "shipped" && (
                        <button
                          onClick={() => handleStatusChange(o.id, "completed")}
                          className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 text-xs rounded shadow-md transition disabled:opacity-50"
                          disabled={loading}
                        >
                          Complete
                          
                        </button>
                      )}
                      {(o.status === "completed" || o.status === "cancelled") ? (
                        <span className="text-gray-500 text-sm italic">Finalized</span>
                      ) : null}
                    </>
                  ) : (
                    <span className="text-gray-400 text-sm italic">No Access</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersAdmin;
