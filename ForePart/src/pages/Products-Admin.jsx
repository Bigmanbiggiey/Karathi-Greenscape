// src/pages/admin/ProductsAdmin.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";

const ProductsAdmin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);
  
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "",
    image: null,
  });
  
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [newVariant, setNewVariant] = useState({
    product: "",
    size: "",
    price: "",
    stock: "",
  });

  // Available categories
  const categories = [
    "flowers",
    "palm trees",
    "fruit trees",
    "ornamental trees",
    "exotic trees",
    "pots",
    "other"
  ];

  // Check if user is authorized (admin or staff)
  const isAuthorized = user && (user.user_type === 'admin' || user.user_type === 'staff');

  // Redirect unauthorized users
  useEffect(() => {
    if (!authLoading && !isAuthorized) {
      alert("Access denied. Only admin and staff can access this page.");
      navigate("/");
    }
  }, [user, authLoading, isAuthorized, navigate]);

  // Load products + variants
  useEffect(() => {
    if (isAuthorized) {
      const fetchData = async () => {
        try {
          const [prodRes, varRes] = await Promise.all([
            api.get("/shop/products/"),
            api.get("/shop/variants/"),
          ]);
          setProducts(prodRes.data);
          setVariants(varRes.data);
        } catch (err) {
          setError("Failed to load products: " + err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isAuthorized]);

  // Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("category", newProduct.category);
      if (newProduct.image) {
        formData.append("image", newProduct.image);
      }

      const res = await api.post("/shop/products/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProducts([...products, res.data]);
      setNewProduct({ name: "", description: "", category: "", image: null });
      document.getElementById("product-image-input").value = "";
      alert("Product added successfully!");
    } catch (err) {
      setError("Failed to add product: " + err.message);
    }
  };

  // Edit Product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", editingProduct.name);
      formData.append("description", editingProduct.description);
      formData.append("category", editingProduct.category);
      
      if (editingProduct.image instanceof File) {
        formData.append("image", editingProduct.image);
      }

      const res = await api.put(`/shop/products/${editingProduct.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProducts(
        products.map((p) => (p.id === editingProduct.id ? res.data : p))
      );
      setEditingProduct(null);
      alert("Product updated successfully!");
    } catch (err) {
      setError("Failed to update product: " + err.message);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await api.delete(`/shop/products/${id}/`);
      setProducts(products.filter((p) => p.id !== id));
      setVariants(variants.filter((v) => v.product !== id));
      alert("Product deleted successfully!");
    } catch (err) {
      setError("Failed to delete product: " + err.message);
    }
  };

  // Add Variant
  const handleAddVariant = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/shop/variants/", {
        product: parseInt(newVariant.product),
        size: newVariant.size,
        price: parseFloat(newVariant.price),
        stock: parseInt(newVariant.stock),
      });
      setVariants([...variants, res.data]);
      setNewVariant({ product: "", size: "", price: "", stock: "" });
      alert("Variant added successfully!");
    } catch (err) {
      setError("Failed to add variant: " + err.message);
    }
  };

  // Delete Variant
  const handleDeleteVariant = async (variantId) => {
    if (!window.confirm("Are you sure you want to delete this variant?")) {
      return;
    }

    try {
      await api.delete(`/shop/variants/${variantId}/`);
      setVariants(variants.filter((v) => v.id !== variantId));
      alert("Variant deleted successfully!");
    } catch (err) {
      setError("Failed to delete variant: " + err.message);
    }
  };

  // Restock Variant
  const handleRestock = async (productId, variantId) => {
    const amount = prompt("Enter restock amount:");
    if (!amount || isNaN(amount)) return;

    try {
      await api.post(`/shop/products/${productId}/restock/`, {
        variant_id: variantId,
        amount: parseInt(amount),
      });
      
      setVariants(
        variants.map((v) =>
          v.id === variantId
            ? { ...v, stock: v.stock + parseInt(amount) }
            : v
        )
      );
      alert("Restocked successfully!");
    } catch (err) {
      setError("Failed to restock: " + err.message);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header with User Info */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-emerald-900">Manage Products</h1>
        <div className="text-right">
          <p className="text-sm text-gray-600">Logged in as</p>
          <p className="font-semibold text-emerald-700 capitalize">
            {user.username} ({user.user_type})
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">{error}</p>
          <button
            onClick={() => setError("")}
            className="mt-2 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Add Product Form */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-emerald-800">
          Add New Product
        </h2>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              placeholder="e.g., African Violet"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Product description..."
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <input
              id="product-image-input"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.files[0] })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Accepted formats: JPG, PNG, GIF (Max 5MB)
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
          >
            Add Product
          </button>
        </form>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <h2 className="text-xl font-semibold p-6 bg-gray-50 border-b text-emerald-800">
          All Products
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left font-semibold">ID</th>
                <th className="p-4 text-left font-semibold">Image</th>
                <th className="p-4 text-left font-semibold">Name</th>
                <th className="p-4 text-left font-semibold">Category</th>
                <th className="p-4 text-left font-semibold">Description</th>
                <th className="p-4 text-left font-semibold">Variants</th>
                <th className="p-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{p.id}</td>
                  <td className="p-4">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold capitalize">
                      {p.category}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                    {p.description}
                  </td>
                  <td className="p-4">
                    <div className="space-y-2">
                      {variants
                        .filter((v) => v.product === p.id)
                        .map((v) => (
                          <div
                            key={v.id}
                            className="flex items-center justify-between gap-2 text-sm bg-gray-50 p-2 rounded"
                          >
                            <span>
                              <strong>{v.size || 'Default'}</strong> - KES{" "}
                              {parseFloat(v.price).toLocaleString()} | Stock:{" "}
                              <span
                                className={
                                  v.stock === 0 ? "text-red-600" : "text-green-600"
                                }
                              >
                                {v.stock}
                              </span>
                            </span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleRestock(p.id, v.id)}
                                className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                              >
                                Restock
                              </button>
                              <button
                                onClick={() => handleDeleteVariant(v.id)}
                                className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      {variants.filter((v) => v.product === p.id).length === 0 && (
                        <p className="text-gray-400 text-sm italic">
                          No variants
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProduct(p)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Form */}
      {editingProduct && (
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-yellow-400">
          <h2 className="text-xl font-semibold mb-4 text-yellow-700">
            Edit Product
          </h2>
          <form onSubmit={handleUpdateProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={editingProduct.description}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    description: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500"
                rows="3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={editingProduct.category}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    category: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Update Product Image
              </label>
              {editingProduct.image && typeof editingProduct.image === 'string' && (
                <div className="mb-2">
                  <img
                    src={editingProduct.image}
                    alt="Current"
                    className="h-32 w-32 object-cover rounded-lg border border-gray-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">Current image</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    image: e.target.files[0],
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to keep current image
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="flex-1 bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Variant Form */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-emerald-800">
          Add Product Variant
        </h2>
        <form onSubmit={handleAddVariant} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Product
            </label>
            <select
              value={newVariant.product}
              onChange={(e) =>
                setNewVariant({ ...newVariant, product: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size/Variant Name
            </label>
            <input
              type="text"
              placeholder="e.g., Small, Medium, Large"
              value={newVariant.size}
              onChange={(e) =>
                setNewVariant({ ...newVariant, size: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (KES)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newVariant.price}
                onChange={(e) =>
                  setNewVariant({ ...newVariant, price: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Stock
              </label>
              <input
                type="number"
                placeholder="0"
                value={newVariant.stock}
                onChange={(e) =>
                  setNewVariant({ ...newVariant, stock: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
          >
            Add Variant
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductsAdmin;