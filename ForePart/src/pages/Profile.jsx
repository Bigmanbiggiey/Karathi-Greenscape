import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { user, accessToken, fetchProfile, changePassword } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [billingAddress, setBillingAddress] = useState("");
  const [saving, setSaving] = useState(false);

  // Change-password form
  const [pwForm, setPwForm] = useState({ old_password: "", new_password: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  // Fetch profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        await fetchProfile();
        setProfile(user);
        setBillingAddress(user?.billing_address || "");
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    loadProfile();
  }, [user, fetchProfile]);

  // Save billing address
  const handleSave = async () => {
    if (!accessToken) return;
    setSaving(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/profile/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ billing_address: billingAddress }),
        }
      );

      if (!res.ok) throw new Error("Failed to update profile");
      const updated = await res.json();
      setProfile(updated);
      alert("Billing address updated!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Could not save billing address.");
    } finally {
      setSaving(false);
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (pwForm.new_password !== pwForm.confirm) {
      setPwError("New passwords do not match.");
      return;
    }

    setPwSaving(true);
    try {
      await changePassword({
        old_password: pwForm.old_password,
        new_password: pwForm.new_password,
      });
      setPwSuccess("Password updated successfully.");
      setPwForm({ old_password: "", new_password: "", confirm: "" });
    } catch (err) {
      setPwError(err.message || "Could not change your password.");
    } finally {
      setPwSaving(false);
    }
  };

  if (!profile) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>

      {/* User Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="font-semibold">Username:</p>
          <p>{profile.username}</p>
        </div>
        <div>
          <p className="font-semibold">Email:</p>
          <p>{profile.email}</p>
        </div>
        <div>
          <p className="font-semibold">First Name:</p>
          <p>{profile.first_name || "—"}</p>
        </div>
        <div>
          <p className="font-semibold">Last Name:</p>
          <p>{profile.last_name || "—"}</p>
        </div>
      </div>

      {/* Billing Address */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Billing Address</label>
        <textarea
          value={billingAddress}
          onChange={(e) => setBillingAddress(e.target.value)}
          rows={3}
          className="w-full border rounded-lg p-2"
          placeholder="Enter billing address (optional)"
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Change Password */}
      <div className="mb-8 border-t pt-6">
        <h3 className="text-xl font-bold mb-4">Change Password</h3>

        {pwError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-3 text-sm">
            {pwError}
          </div>
        )}
        {pwSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg mb-3 text-sm">
            {pwSuccess}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="password"
            value={pwForm.old_password}
            onChange={(e) => setPwForm({ ...pwForm, old_password: e.target.value })}
            required
            placeholder="Current password"
            className="border rounded-lg p-2"
          />
          <input
            type="password"
            value={pwForm.new_password}
            onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })}
            required
            minLength={8}
            placeholder="New password"
            className="border rounded-lg p-2"
          />
          <input
            type="password"
            value={pwForm.confirm}
            onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
            required
            minLength={8}
            placeholder="Confirm new password"
            className="border rounded-lg p-2"
          />
          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={pwSaving}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {pwSaving ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      {/* Purchase History */}
      <h3 className="text-xl font-bold mb-4">Purchase History</h3>
      {profile.purchase_history?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Order ID</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Items</th>
              </tr>
            </thead>
            <tbody>
              {profile.purchase_history.map((order) => (
                <tr key={order.order_id}>
                  <td className="border p-2 text-center">{order.order_id}</td>
                  <td className="border p-2 text-center">{order.total_price} KES</td>
                  <td className="border p-2 text-center">{order.status}</td>
                  <td className="border p-2 text-center">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="border p-2">
                    <ul className="list-disc pl-4">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.product} ({item.variant}) × {item.quantity} ({item.price} KES)
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No purchase history yet.</p>
      )}
    </div>
  );
}
