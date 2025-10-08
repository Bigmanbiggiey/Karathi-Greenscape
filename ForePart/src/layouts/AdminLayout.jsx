import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../pages/AdminSideBar";
import AdminNavbar from "../pages/AdminNavBar";

export default function AdminLayout() {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <AdminNavbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}