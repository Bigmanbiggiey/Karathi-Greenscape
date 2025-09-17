// src/pages/admin/Vendor.jsx
import React, { useEffect, useState } from "react";
import api from "@/api"; 

const Vendor = () => {
  const [vendors, setVendors] = useState([]);
  const [newVendor, setNewVendor] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [editingVendorId, setEditingVendorId] = useState(null);
  const [editVendorData, setEditVendorData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Fetch vendors
  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await api.get("/vendors/");
      setVendors(res.data);
    } catch (err) {
      console.error("Error fetching vendors", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Add vendor
  const handleAddVendor = async (e) => {
    e.preventDefault();
    try {
      await api.post("/vendors/", newVendor);
      setNewVendor({ name: "", email: "", phone: "" });
      fetchVendors();
    } catch (err) {
      console.error("Error adding vendor", err);
    }
  };

  // Delete vendor
  const handleDeleteVendor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;
    try {
      await api.delete(`/vendors/${id}/`);
      fetchVendors();
    } catch (err) {
      console.error("Error deleting vendor", err);
    }
  };

  // Start editing
  const handleEditVendor = (vendor) => {
    setEditingVendorId(vendor.id);
    setEditVendorData({
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
    });
  };

  // Save edited vendor
  const handleSaveVendor = async (id) => {
    try {
      await api.put(`/vendors/${id}/`, editVendorData);
      setEditingVendorId(null);
      setEditVendorData({ name: "", email: "", phone: "" });
      fetchVendors();
    } catch (err) {
      console.error("Error saving vendor", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Vendors Management</h1>

      {/* Add Vendor Form */}
      <form
        onSubmit={handleAddVendor}
        className="mb-6 flex gap-4 flex-wrap items-center"
      >
        <input
          type="text"
          placeholder="Vendor Name"
          value={newVendor.name}
          onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newVendor.email}
          onChange={(e) =>
            setNewVendor({ ...newVendor, email: e.target.value })
          }
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={newVendor.phone}
          onChange={(e) =>
            setNewVendor({ ...newVendor, phone: e.target.value })
          }
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Vendor
        </button>
      </form>

      {/* Vendors List */}
      {loading ? (
        <p>Loading vendors...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="border">
                <td className="p-2 border">{vendor.id}</td>

                {/* Editable Row */}
                {editingVendorId === vendor.id ? (
                  <>
                    <td className="p-2 border">
                      <input
                        type="text"
                        value={editVendorData.name}
                        onChange={(e) =>
                          setEditVendorData({
                            ...editVendorData,
                            name: e.target.value,
                          })
                        }
                        className="border p-1 rounded w-full"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="email"
                        value={editVendorData.email}
                        onChange={(e) =>
                          setEditVendorData({
                            ...editVendorData,
                            email: e.target.value,
                          })
                        }
                        className="border p-1 rounded w-full"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="text"
                        value={editVendorData.phone}
                        onChange={(e) =>
                          setEditVendorData({
                            ...editVendorData,
                            phone: e.target.value,
                          })
                        }
                        className="border p-1 rounded w-full"
                      />
                    </td>
                    <td className="p-2 border flex gap-2">
                      <button
                        onClick={() => handleSaveVendor(vendor.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingVendorId(null)}
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2 border">{vendor.name}</td>
                    <td className="p-2 border">{vendor.email}</td>
                    <td className="p-2 border">{vendor.phone}</td>
                    <td className="p-2 border flex gap-2">
                      <button
                        onClick={() => handleEditVendor(vendor)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteVendor(vendor.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Vendor;
