import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar"; //  main site navbar
import Footer from "../components/Footer"; //  main site footer

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}