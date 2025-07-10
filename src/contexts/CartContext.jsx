import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  const updateCounts = () => {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    if (!loggedIn) {
      setCartCount(0);
      setSavedCount(0);
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      const cartKey = `cart_${currentUser.id}`;
      const savedKey = `saved_${currentUser.id}`;
      
      const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
      const saved = JSON.parse(localStorage.getItem(savedKey)) || [];
      
      setCartCount(cart.length);
      setSavedCount(saved.length);
    }
  };

  useEffect(() => {
    updateCounts();
    // Listen for storage changes
    window.addEventListener('storage', updateCounts);
    return () => window.removeEventListener('storage', updateCounts);
  }, []);

  return (
    <CartContext.Provider value={{
      cartCount,
      savedCount,
      updateCounts
    }}>
      {children}
    </CartContext.Provider>
  );
};
