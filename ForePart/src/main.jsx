// src/main.jsx 
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HeadProvider } from "react-head";
import AuthProvider from "./context/AuthProvider"
import { CartProvider } from "./context/CartContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HeadProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </HeadProvider>
  </React.StrictMode>
);
