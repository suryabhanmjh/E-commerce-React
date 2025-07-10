import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const { updateCounts } = useCart();

  useEffect(() => {
    if (localStorage.getItem('loggedIn') !== 'true') {
      alert('Please login to access your cart.');
      navigate('/login');
      return;
    }

    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
    setDeliveryAddress(user.address || '');
    
    const cartKey = `cart_${user.id}`;
    const savedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    setCart(savedCart.map(item => ({ ...item, qty: item.qty || 1 })));
  }, [navigate]);

  // ➕ Increase quantity
  const increaseQty = (id) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const cartKey = `cart_${currentUser.id}`;
    const updated = cart.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item);
    setCart(updated);
    localStorage.setItem(cartKey, JSON.stringify(updated));
    updateCounts(); // Add this line
  };

  // ➖ Decrease quantity
  const decreaseQty = (id) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const cartKey = `cart_${currentUser.id}`;
    const updated = cart.map(item => {
      if (item.id === id && item.qty > 1) {
        return { ...item, qty: item.qty - 1 };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem(cartKey, JSON.stringify(updated));
    updateCounts(); // Add this line
  };

  // ❌ Remove item
  const removeItem = (id) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const cartKey = `cart_${currentUser.id}`;
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem(cartKey, JSON.stringify(updated));
    updateCounts(); // Add this line
  };

  // 💰 Total Price
  const totalPrice = cart.reduce((total, item) => total + item.price * item.qty, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    setShowCheckoutModal(true);
  };

  const proceedToCheckout = () => {
    if (!deliveryAddress.trim()) {
      alert('Please enter a delivery address');
      return;
    }

    // Save updated address to user profile if changed
    if (deliveryAddress !== currentUser.address) {
      const updatedUser = { ...currentUser, address: deliveryAddress };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }

    navigate('/checkout', {
      state: {
        cartItems: cart,
        deliveryAddress,
        paymentMethod,
        totalAmount: totalPrice
      }
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">🛒 Your Cart</h2>
      {cart.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600 mb-4">Your cart is empty.</p>
          <button 
            onClick={() => navigate('/books')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cart.map(item => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-md">
                <div className="flex flex-col sm:flex-row gap-4">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full sm:w-24 h-32 sm:h-28 object-cover rounded-md mx-auto sm:mx-0"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2 text-center sm:text-left">{item.title}</h4>
                    <p className="text-gray-600 mb-2 text-center sm:text-left">Author: {item.author}</p>
                    <p className="text-lg mb-4 text-center sm:text-left">
                      Price: ₹{item.price} × {item.qty} = <span className="font-bold text-green-600">₹{item.price * item.qty}</span>
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => decreaseQty(item.id)}
                          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="font-semibold text-lg min-w-[2rem] text-center">{item.qty}</span>
                        <button 
                          onClick={() => increaseQty(item.id)}
                          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.id)} 
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors text-sm sm:text-base"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-100 p-4 sm:p-6 rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h3 className="text-xl sm:text-2xl font-bold">Total: ₹{totalPrice}</h3>
              <button 
                onClick={handleCheckout}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md transition-colors font-semibold text-sm sm:text-base"
              >
                ✅ Proceed to Checkout
              </button>
            </div>
          </div>

          {/* Checkout Modal */}
          {showCheckoutModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">📦 Checkout Details</h3>
                
                {/* Delivery Address */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📍 Delivery Address *
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your complete delivery address"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows="3"
                    required
                  />
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    💳 Payment Method
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <span className="font-medium">💰 Cash on Delivery</span>
                        <p className="text-sm text-gray-500">Pay when your order arrives</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <span className="font-medium">📱 UPI Payment</span>
                        <p className="text-sm text-gray-500">GPay, PhonePe, Paytm, etc.</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <span className="font-medium">💳 Debit/Credit Card</span>
                        <p className="text-sm text-gray-500">Visa, Mastercard, Rupay</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="netbanking"
                        checked={paymentMethod === 'netbanking'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <span className="font-medium">🏦 Net Banking</span>
                        <p className="text-sm text-gray-500">All major banks supported</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-2">Order Summary</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Items ({cart.length}):</span>
                      <span>₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery:</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between font-semibold text-base">
                      <span>Total:</span>
                      <span>₹{totalPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCheckoutModal(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={proceedToCheckout}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md transition-colors font-semibold"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
