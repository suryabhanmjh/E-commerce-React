import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [totalAmount, setTotalAmount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    if (!loggedIn) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
    
    // Get data from location state or fallback to localStorage
    if (location.state) {
      setCartItems(location.state.cartItems);
      setDeliveryAddress(location.state.deliveryAddress);
      setPaymentMethod(location.state.paymentMethod);
      setTotalAmount(location.state.totalAmount);
    } else {
      const cartKey = `cart_${user.id}`;
      const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
      setCartItems(cart);
      setDeliveryAddress(user.address || '');
      setTotalAmount(cart.reduce((total, item) => total + (item.price * (item.qty || 1)), 0));
    }
    
    setLoading(false);
  }, [navigate, location.state]);

  const getPaymentMethodDetails = () => {
    const methods = {
      cod: { name: 'Cash on Delivery', icon: '💰', desc: 'Pay when your order arrives' },
      upi: { name: 'UPI Payment', icon: '📱', desc: 'GPay, PhonePe, Paytm, etc.' },
      card: { name: 'Debit/Credit Card', icon: '💳', desc: 'Visa, Mastercard, Rupay' },
      netbanking: { name: 'Net Banking', icon: '🏦', desc: 'All major banks supported' }
    };
    return methods[paymentMethod] || methods.cod;
  };

  const handleConfirmOrder = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!deliveryAddress.trim()) {
      alert("Please provide a delivery address!");
      return;
    }

    setProcessing(true);

    try {
      // Create purchase record
      const purchase = {
        userId: currentUser.id,
        items: cartItems,
        totalAmount: totalAmount,
        purchaseDate: new Date().toISOString(),
        orderId: `ORD_${Date.now()}`,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        paymentMethod: paymentMethod,
        deliveryAddress: deliveryAddress,
        customerDetails: {
          name: currentUser.name,
          email: currentUser.email
        }
      };

      // Save to database
      await axios.post('https://data-json-nwab.onrender.com/purchases', purchase);

      // Update user address if provided
      if (deliveryAddress !== currentUser.address) {
        await axios.patch(`https://data-json-nwab.onrender.com/users/${currentUser.id}`, {
          address: deliveryAddress
        });
        
        // Update localStorage
        const updatedUser = { ...currentUser, address: deliveryAddress };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }

      // Clear cart
      const cartKey = `cart_${currentUser.id}`;
      localStorage.removeItem(cartKey);
      
      // Navigate to confirmation page with order data
      navigate("/confirm-order", { 
        state: { 
          orderData: purchase,
          customerName: currentUser.name || currentUser.email
        } 
      });
    } catch (error) {
      console.error('Error processing order:', error);
      alert("Error processing order. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="text-lg">Loading...</div></div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">🛒 Your Cart is Empty</h2>
        <button onClick={() => navigate('/books')} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md">
          Continue Shopping
        </button>
      </div>
    );
  }

  const paymentDetails = getPaymentMethodDetails();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">🧾 Order Confirmation</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h3 className="text-xl font-semibold mb-4">📚 Order Items ({cartItems.length})</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {cartItems.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-16 h-20 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{item.title}</h4>
                  <p className="text-gray-600 text-xs">by {item.author}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm">Qty: {item.qty || 1}</span>
                    <span className="font-bold text-green-600">₹{(item.price * (item.qty || 1))}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h3 className="text-xl font-semibold mb-4">👤 Customer Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <div className="p-3 bg-gray-100 rounded-md">{currentUser.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="p-3 bg-gray-100 rounded-md">{currentUser.email}</div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h3 className="text-xl font-semibold mb-4">📍 Delivery Address</h3>
            <div className="p-3 bg-gray-100 rounded-md">
              {deliveryAddress || 'No address provided'}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h3 className="text-xl font-semibold mb-4">💳 Payment Method</h3>
            <div className="flex items-center p-3 bg-gray-100 rounded-md">
              <span className="text-2xl mr-3">{paymentDetails.icon}</span>
              <div>
                <div className="font-semibold">{paymentDetails.name}</div>
                <div className="text-sm text-gray-600">{paymentDetails.desc}</div>
              </div>
            </div>
            {paymentMethod !== 'cod' && (
              <div className="mt-3 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  ℹ️ For demo purposes, this payment will be marked as completed automatically.
                </p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h3 className="text-xl font-semibold mb-4">💰 Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Items ({cartItems.length}):</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges:</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Fees:</span>
                <span className="text-green-600">₹0</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                <span>Total Amount:</span>
                <span className="text-green-600">₹{totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => navigate('/cart')} 
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              ← Back to Cart
            </button>
            <button 
              onClick={handleConfirmOrder}
              disabled={processing}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              {processing ? 'Processing...' : '✔ Confirm Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
