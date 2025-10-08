import React from "react";
import { Outlet } from "react-router-dom";
import StaffSidebar from "../pages/staff/StaffSideBar";
import StaffNavbar from "../pages/staff/StaffNavBar";

export default function StaffLayout() {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <StaffSidebar />
      <div className="flex-1 ml-64">
        <StaffNavbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}