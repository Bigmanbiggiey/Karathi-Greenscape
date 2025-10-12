// src/pages/admin/Payment-Admin.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/api"; // Assuming the path to your configured Axios instance

// Utility to format currency (assuming USD)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KES',
  }).format(amount);
};

export default function PaymentAdmin() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      // Assuming endpoint is '/api/shop/payments/'
      const res = await api.get("/payment/admin/list"); 
      setPayments(res.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError("Failed to load payment data. Check API configuration.");
    } finally {
      setLoading(false);
    }
  };

  // --- Rendering States ---
  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-gray-600">Loading payments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Transactions</h1>
        <p className="text-gray-600">No payment transactions found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Payment Transactions</h1>
      <p className="text-gray-600">
        Total Transactions: <span className="font-semibold">{payments.length}</span>
      </p>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.id}</td>
                {/* Assumes payment object links to order by ID */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.order_id || p.order}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {formatCurrency(p.amount || p.total)} 
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.payment_method || 'N/A'}</td>
                
                {/* Status Badge */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                      p.status === 'completed' ? 'bg-green-100 text-green-800' :
                      p.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      p.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                  }`}>
                    {p.status || 'unknown'}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {p.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}