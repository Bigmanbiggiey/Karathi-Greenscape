import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSideBar";
import AdminNavbar from "./AdminNavBar";
import api from "../api/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        api.get("/shop/products/"),
        api.get("/shop/orders/"),
        api.get("/auth/users/")
      ]);

      const products = productsRes.data;
      const orders = ordersRes.data;
      const users = usersRes.data;

      const totalRevenue = orders
        .filter(o => o.status === "completed" || o.status === "paid")
        .reduce((sum, order) => sum + parseFloat(order.total_price), 0);

      const pendingOrders = orders.filter(o => o.status === "pending").length;

      const lowStock = products.filter(p =>
        p.variants && p.variants.some(v => v.stock < 5)
      ).length;

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue: totalRevenue,
        pendingOrders: pendingOrders,
        lowStockProducts: lowStock
      });

      setRecentOrders(orders.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtext }) => (
    <div
      className="bg-white rounded-lg shadow-md p-6 border-l-4"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2" style={{ color }}>
            {value}
          </p>
          {subtext && (
            <p className="text-xs text-gray-400 mt-1">{subtext}</p>
          )}
        </div>
        <div className="text-4xl" style={{ color, opacity: 0.3 }}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 ml-64">
          <AdminNavbar />
          <main className="p-6">
            <div className="flex items-center justify-center h-96">
              <p className="text-lg text-gray-600">Loading dashboard...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <AdminNavbar />
        <main className="p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Dashboard Overview
            </h2>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's what's happening today.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Revenue"
              value={`KES ${stats.totalRevenue.toLocaleString()}`}
              icon="💰"
              color="#10b981"
              subtext="All time earnings"
            />
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              icon="📦"
              color="#3b82f6"
              subtext={`${stats.pendingOrders} pending`}
            />
            <StatCard
              title="Total Products"
              value={stats.totalProducts}
              icon="🌱"
              color="#8b5cf6"
              subtext={`${stats.lowStockProducts} low stock`}
            />
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon="👥"
              color="#f59e0b"
              subtext="Registered customers"
            />
            <StatCard
              title="Pending Orders"
              value={stats.pendingOrders}
              icon="⏳"
              color="#ef4444"
              subtext="Requires attention"
            />
            <StatCard
              title="Low Stock Alert"
              value={stats.lowStockProducts}
              icon="⚠️"
              color="#ec4899"
              subtext="Products need restock"
            />
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Recent Orders</h3>
              <a
                href="/admin/orders"
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
              >
                View All →
              </a>
            </div>

            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No orders yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Order ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentOrders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">
                          #{order.id}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {order.user?.username || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold">
                          KES {parseFloat(order.total_price).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "paid"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="/pages/Products-Admin.jsx"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-t-4 border-emerald-500"
            >
              <h4 className="font-semibold text-lg mb-2">Manage Products</h4>
              <p className="text-gray-600 text-sm">
                Add, edit, or remove products from your inventory
              </p>
            </a>

            <a
              href="/admin/orders"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-t-4 border-blue-500"
            >
              <h4 className="font-semibold text-lg mb-2">Process Orders</h4>
              <p className="text-gray-600 text-sm">
                View and manage customer orders and payments
              </p>
            </a>

            <a
              href="/admin/users"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-t-4 border-purple-500"
            >
              <h4 className="font-semibold text-lg mb-2">User Management</h4>
              <p className="text-gray-600 text-sm">
                Manage customer accounts and permissions
              </p>
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}

