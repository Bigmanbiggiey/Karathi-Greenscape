import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen fixed">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Admin Panel
      </div>
      <nav className="mt-4 space-y-2">
        <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-700">
          Dashboard
        </Link>
        <Link to="/admin/products" className="block px-4 py-2 hover:bg-gray-700">
          Products
        </Link>
        <Link to="/admin/orders" className="block px-4 py-2 hover:bg-gray-700">
          Orders
        </Link>
        <Link to="/admin/users" className="block px-4 py-2 hover:bg-gray-700">
          Users
        </Link>
        <Link to="/admin/vendors" className="block px-4 py-2 hover:bg-gray-700">
          Vendors
        </Link>
      </nav>
    </aside>
  );
}
