import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import React, { useState } from "react";
import { CartProvider } from "../contexts/CartContext";

const UserLayout = () => {
  const [user, setUser] = useState(null);

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar user={user} setUser={setUser} />
        <main className="flex-grow container mx-auto px-4 py-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
};

export default UserLayout;
