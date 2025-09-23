import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [billingAddress, setBillingAddress] = useState("");
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user profile + purchase history
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await axios.get("http://localhost:8000/api/auth/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(res.data);
        setBillingAddress(res.data.billing_address || "");
        setPurchaseHistory(res.data.purchase_history || []);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access");
      await axios.put(
        "http://localhost:8000/api/auth/profile/",
        { ...profile, billing_address: billingAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      {/* Profile Form */}
      <form
        onSubmit={handleSave}
        className="bg-white shadow-lg rounded-2xl p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">User Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={profile?.first_name || ""}
            onChange={(e) =>
              setProfile({ ...profile, first_name: e.target.value })
            }
            disabled={!isEditing}
            className={`border rounded-xl p-3 w-full ${
              !isEditing ? "bg-gray-100 text-gray-600" : ""
            }`}
          />
          <input
            type="text"
            value={profile?.last_name || ""}
            onChange={(e) =>
              setProfile({ ...profile, last_name: e.target.value })
            }
            disabled={!isEditing}
            className={`border rounded-xl p-3 w-full ${
              !isEditing ? "bg-gray-100 text-gray-600" : ""
            }`}
          />
          <input
            type="email"
            value={profile?.email || ""}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            disabled={!isEditing}
            className={`border rounded-xl p-3 w-full ${
              !isEditing ? "bg-gray-100 text-gray-600" : ""
            }`}
          />
          <input
            type="text"
            value={profile?.username || ""}
            disabled
            className="border rounded-xl p-3 w-full bg-gray-100 text-gray-600"
          />
        </div>

        {/* Billing Address */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Billing Address</h3>
          <textarea
            value={billingAddress}
            onChange={(e) => setBillingAddress(e.target.value)}
            disabled={!isEditing}
            placeholder="Enter billing address"
            className={`border rounded-xl p-3 w-full ${
              !isEditing ? "bg-gray-100 text-gray-600" : ""
            }`}
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          {isEditing ? (
            <>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>

      {/* Purchase History */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Purchase History</h2>
        {purchaseHistory.length > 0 ? (
          <ul className="space-y-4">
            {purchaseHistory.map((order) => (
              <li key={order.id} className="border-b pb-3 last:border-none">
                <p className="font-medium">
                  Order #{order.id} – {order.date}
                </p>
                <p className="text-sm text-gray-600">
                  {order.items
                    .map((item) => `${item.name} x${item.qty}`)
                    .join(", ")}
                </p>
                <p className="text-sm font-semibold">Total: ${order.total}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No purchases yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
