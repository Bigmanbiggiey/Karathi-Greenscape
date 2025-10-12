// src/pages/admin/Users-Admin.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/api"; // Assuming the path to your configured Axios instance is correct

const USER_ROLES = ["customer", "staff", "admin"];

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth/users/");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please check the API connection.");
    } finally {
      setLoading(false);
    }
  };

  // 1. Handle Role Change (PATCH request to update user_type)
  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change user ${userId} to role: ${newRole}?`)) {
      return;
    }
    
    try {
      // Assuming your backend supports PATCH or PUT to update user data
      await api.patch(`/auth/users/${userId}/`, { user_type: newRole });
      
      // Update state immediately upon success
      setUsers(prevUsers =>
        prevUsers.map(u => (u.id === userId ? { ...u, user_type: newRole } : u))
      );
      alert(`User ${userId}'s role updated to ${newRole}.`);
    } catch (err) {
      console.error("Error changing role:", err);
      alert("Failed to update user role. Check console for details.");
    }
  };

  // 2. Handle User Deletion (DELETE request)
  const handleDeleteUser = async (userId) => {
    if (!window.confirm(`WARNING: This will permanently delete user ID ${userId}. Are you ABSOLUTELY sure?`)) {
      return;
    }

    try {
      await api.delete(`/auth/users/${userId}/`);
      
      // Filter out the deleted user from state
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
      alert(`User ${userId} deleted successfully.`);
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user. Check console for details.");
    }
  };

  // --- Rendering States ---
  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-gray-600">Loading users...</p>
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

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
      <p className="text-gray-600">
        Total Registered Users: <span className="font-semibold">{users.length}</span>
      </p>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                
                {/* Role/User Type Column */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                      user.user_type === 'admin' ? 'bg-red-100 text-red-800' :
                      user.user_type === 'staff' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                  }`}>
                    {user.user_type}
                  </span>
                </td>
                
                {/* Actions Column */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <select
                    value={user.user_type}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    {USER_ROLES.map(role => (
                      <option key={role} value={role}>
                        {role.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="ml-2 text-indigo-600 hover:text-indigo-900 font-medium p-1 rounded-md bg-indigo-50 hover:bg-indigo-100 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}