// App.jsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import StaffLayout from "./layouts/StaffLayout";
import PrivateRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

// Main site pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/CartAndCheckout";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard-Admin";
import ProductsAdmin from "./pages/Products-Admin";
import OrdersAdmin from "./pages/admin/Orders-Admin";
import UsersAdmin from "./pages/admin/Users-Admin";
import PaymentsAdmin from "./pages/admin/Payment-Admin";
import AuditLogsAdmin from "./pages/admin/Audit-Logs";

// Staff pages
import StaffDashboard from "./pages/staff/StaffDashboard";

function App() {
  return (
      <Routes>
        {/* Main Site Routes - WITH Navbar & Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Protected Customer Routes */} 
          <Route element={<PrivateRoute allowedRoles={['customer', 'staff', 'admin']} />}> 
            <Route element ={<MainLayout />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<Profile />} />
            </Route> 
          </Route>
        

        {/* Admin Routes - Admin Sidebar & Navbar */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="orders" element={<OrdersAdmin />} />
            <Route path="users" element={<UsersAdmin />} />
            <Route path="payments" element={<PaymentsAdmin />} />
            <Route path="audit-logs" element={<AuditLogsAdmin />} />
          </Route>
        </Route>
        

        {/* Staff Routes - Staff Sidebar & Navbar */}
        <Route element={<PrivateRoute allowedRoles={["staff"]} />}>
          <Route path="/staff" element={<StaffLayout />}>
            <Route index element={<StaffDashboard />} />
            <Route path="dashboard" element={<StaffDashboard />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="orders" element={<OrdersAdmin />} />
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}

export default App;