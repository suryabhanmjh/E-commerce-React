import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ConfirmOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    if (location.state && location.state.orderData) {
      setOrderData(location.state.orderData);
      setCustomerName(location.state.customerName || 'Customer');
    } else {
      // If no order data, redirect to home
      navigate('/');
    }
  }, [location.state, navigate]);

  if (!orderData) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-2 sm:mb-4">✅ Order Confirmed!</h1>
        <p className="text-lg sm:text-xl text-gray-600">Thank you for your purchase, {customerName}!</p>
      </div>

      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Order Details</h3>
        <div className="space-y-2">
          <p className="text-sm sm:text-base"><strong>Order ID:</strong> {orderData.orderId}</p>
          <p className="text-sm sm:text-base"><strong>Order Date:</strong> {new Date(orderData.purchaseDate).toLocaleDateString()}</p>
          <p className="text-sm sm:text-base"><strong>Payment Method:</strong> Cash on Delivery</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Ordered Items</h3>
        <div className="space-y-4">
          {orderData.items.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full sm:w-16 h-32 sm:h-20 object-cover rounded-md mx-auto sm:mx-0"
              />
              <div className="flex-1 text-center sm:text-left">
                <h4 className="font-semibold text-lg mb-1 text-gray-800">{item.title}</h4>
                <p className="text-gray-600 mb-1">by {item.author}</p>
                <p className="text-xl font-bold text-green-600">₹{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t-2 border-gray-300 pt-4 sm:pt-6 mb-6 text-center sm:text-right">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Total Amount: ₹{orderData.totalAmount}</h3>
      </div>

      <div className="bg-blue-50 p-4 sm:p-6 rounded-lg mb-6">
        <h4 className="text-lg font-semibold text-blue-800 mb-3">📦 Delivery Information</h4>
        <div className="space-y-2 text-sm sm:text-base text-gray-700">
          <p>• Your order will be delivered within 3-5 business days</p>
          <p>• You will receive SMS updates about your order status</p>
          <p>• Payment will be collected upon delivery</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button 
          onClick={() => navigate('/')} 
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors text-sm sm:text-base"
        >
          Continue Shopping
        </button>
        <button 
          onClick={() => navigate('/profile')} 
          className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors text-sm sm:text-base"
        >
          View Orders
        </button>
      </div>
    </div>
  );
};

export default ConfirmOrder;