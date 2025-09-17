// src/pages/Users.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  // Assume we store auth + role in localStorage
  const role = localStorage.getItem("role"); // "admin" | "vendor" | "customer"

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await axios.get("/api/users/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (role === "admin") {
          setUsers(res.data);
        } else {
          setCurrentUser(res.data[0]);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [role]);

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({ ...user });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    try {
      const token = localStorage.getItem("access");
      const res = await axios.patch(`/api/users/${id}/`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (role === "admin") {
        setUsers(users.map((u) => (u.id === id ? res.data : u)));
      } else {
        setCurrentUser(res.data);
      }
      setEditingId(null);
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("access");
      await axios.delete(`/api/users/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  // --- Admin view ---
  if (role === "admin") {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">All Users</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">First Name</th>
              <th className="border p-2">Last Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border p-2">{user.id}</td>
                <td className="border p-2">
                  {editingId === user.id ? (
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name || ""}
                      onChange={handleChange}
                      className="border p-1 w-full"
                    />
                  ) : (
                    user.first_name
                  )}
                </td>
                <td className="border p-2">
                  {editingId === user.id ? (
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name || ""}
                      onChange={handleChange}
                      className="border p-1 w-full"
                    />
                  ) : (
                    user.last_name
                  )}
                </td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.user_type}</td>
                <td className="border p-2 flex gap-2">
                  {editingId === user.id ? (
                    <button
                      onClick={() => handleSave(user.id)}
                      className="px-2 py-1 bg-green-500 text-white rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(user)}
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // --- Vendor/Customer view ---
  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      {currentUser && (
        <div className="border p-4 rounded-lg shadow">
          <p>
            <strong>Email:</strong> {currentUser.email}
          </p>
          <div className="mt-2">
            <label className="block text-sm">First Name</label>
            <input
              type="text"
              name="first_name"
              value={
                editingId === currentUser.id
                  ? formData.first_name
                  : currentUser.first_name
              }
              onChange={handleChange}
              disabled={editingId !== currentUser.id}
              className="border p-1 w-full"
            />
          </div>
          <div className="mt-2">
            <label className="block text-sm">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={
                editingId === currentUser.id
                  ? formData.last_name
                  : currentUser.last_name
              }
              onChange={handleChange}
              disabled={editingId !== currentUser.id}
              className="border p-1 w-full"
            />
          </div>
          {editingId === currentUser.id ? (
            <button
              onClick={() => handleSave(currentUser.id)}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => handleEdit(currentUser)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Edit
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Users;
