// src/pages/admin/ProductsAdmin.jsx
import React, { useEffect, useState } from "react";
import api from "@/api"; 
const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newProduct, setNewProduct] = useState({ name: "", description: "" });
  const [newVariant, setNewVariant] = useState({ product: "", price: "", stock: "" });

  // Load products + variants
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, varRes] = await Promise.all([
          api.get("/shop/products/"),
          api.get("/shop/variants/"),
        ]);
        setProducts(prodRes.data);
        setVariants(varRes.data);
      } catch (err) {
        setError("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/shop/products/", newProduct);
      setProducts([...products, res.data]);
      setNewProduct({ name: "", description: "" });
    } catch (err) {
      setError("Failed to add product", err);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/shop/products/${id}/`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      setError("Failed to delete product", err);
    }
  };

  // Add Variant
  const handleAddVariant = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/shop/variants/", newVariant);
      setVariants([...variants, res.data]);
      setNewVariant({ product: "", price: "", stock: "" });
    } catch (err) {
      setError("Failed to add variant", err);
    }
  };

  // Restock Variant
  const handleRestock = async (productId, variantId) => {
    const amount = prompt("Enter restock amount:");
    if (!amount) return;

    try {
      await api.post(`/shop/products/${productId}/restock/`, {
        variant_id: variantId,
        amount: parseInt(amount),
      });
      alert("Restocked successfully");
    } catch (err) {
      setError("Failed to restock", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Manage Products</h1>

      {/* Add Product */}
      <form onSubmit={handleAddProduct} className="space-x-2">
        <input
          type="text"
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="border px-2 py-1"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
          className="border px-2 py-1"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">
          Add Product
        </button>
      </form>

      {/* Products Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Variants</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="p-2 border">{p.id}</td>
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">{p.description}</td>
              <td className="p-2 border">
                {variants
                  .filter((v) => v.product === p.id)
                  .map((v) => (
                    <div key={v.id} className="flex justify-between items-center">
                      <span>
                        Ksh {v.price} | Stock: {v.stock}
                      </span>
                      <button
                        onClick={() => handleRestock(p.id, v.id)}
                        className="ml-2 bg-green-600 text-white px-2 py-1 rounded"
                      >
                        Restock
                      </button>
                    </div>
                  ))}
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => handleDeleteProduct(p.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Variant */}
      <div>
        <h2 className="font-semibold mb-2">Add Variant</h2>
        <form onSubmit={handleAddVariant} className="space-x-2">
          <select
            value={newVariant.product}
            onChange={(e) => setNewVariant({ ...newVariant, product: e.target.value })}
            className="border px-2 py-1"
            required
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Price"
            value={newVariant.price}
            onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
            className="border px-2 py-1"
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={newVariant.stock}
            onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
            className="border px-2 py-1"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">
            Add Variant
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductsAdmin;
