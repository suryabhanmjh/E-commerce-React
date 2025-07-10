import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../contexts/CartContext';

const ProfilePage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState(false);
  const [address, setAddress] = useState('');
  const navigate = useNavigate();
  const { updateCounts } = useCart();

  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    if (!loggedIn) {
      navigate('/login');
      return;
    }
    
    fetchUserData();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (!storedUser || !storedUser.id) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:3001/users/${storedUser.id}`);
      setCurrentUser(response.data);
      setAddress(response.data.address || '');

      // Fetch purchase history
      try {
        const purchasesResponse = await axios.get(`http://localhost:3001/purchases?userId=${storedUser.id}`);
        setPurchases(purchasesResponse.data);
      } catch (error) {
        console.log('No purchase history found');
        setPurchases([]);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressUpdate = async () => {
    try {
      await axios.patch(`http://localhost:3001/users/${currentUser.id}`, {
        address: address
      });
      
      // Update localStorage
      const updatedUser = { ...currentUser, address };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      setEditingAddress(false);
      alert('Address updated successfully!');
    } catch (error) {
      console.error('Error updating address:', error);
      alert('Failed to update address');
    }
  };

  const getOrderStatus = (purchase) => {
    // Always check payment status first
    if (purchase.paymentStatus === 'pending') {
      return { status: 'Payment Pending', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' };
    }
    // Check if admin has manually set order status
    if (purchase.orderStatus) {
      const statusMap = {
        'confirmed': { status: 'Order Confirmed', color: 'bg-blue-100 text-blue-800', icon: '✅' },
        'processing': { status: 'Processing', color: 'bg-orange-100 text-orange-800', icon: '📦' },
        'shipped': { status: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: '🚚' },
        'delivered': { status: 'Delivered', color: 'bg-green-100 text-green-800', icon: '🎉' }
      }
      return statusMap[purchase.orderStatus] || { status: 'Order Confirmed', color: 'bg-blue-100 text-blue-800', icon: '✅' }
    }

    // Default auto status based on date and payment
    const orderDate = new Date(purchase.purchaseDate);
    const now = new Date();
    const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
    
    if (purchase.paymentStatus === 'pending') {
      return { status: 'Payment Pending', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' };
    }
    
    if (daysDiff === 0) {
      return { status: 'Order Confirmed', color: 'bg-blue-100 text-blue-800', icon: '✅' };
    } else if (daysDiff <= 1) {
      return { status: 'Processing', color: 'bg-orange-100 text-orange-800', icon: '📦' };
    } else if (daysDiff <= 3) {
      return { status: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: '🚚' };
    } else {
      return { status: 'Delivered', color: 'bg-green-100 text-green-800', icon: '🎉' };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('currentUser');
    updateCounts(); // Add this line
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">User data not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* User Profile Section */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="bg-purple-700 text-white p-6 text-center">
            <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl text-purple-700">👤</span>
            </div>
            <h1 className="text-2xl font-bold">User Profile</h1>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <div className="p-3 bg-gray-100 rounded-md border">
                  {currentUser.name}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="p-3 bg-gray-100 rounded-md border">
                  {currentUser.email}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
                  <button
                    onClick={() => setEditingAddress(!editingAddress)}
                    className="text-sm text-purple-600 hover:text-purple-800"
                  >
                    {editingAddress ? 'Cancel' : 'Edit'}
                  </button>
                </div>
                {editingAddress ? (
                  <div className="space-y-2">
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your delivery address"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      rows="3"
                    />
                    <button
                      onClick={handleAddressUpdate}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Save Address
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-100 rounded-md border">
                    {address || 'No address added yet'}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <button 
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Purchase History Section */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-green-600 text-white p-6">
            <h2 className="text-2xl font-bold">📚 Order History & Status</h2>
          </div>
          
          <div className="p-6">
            {purchases.length === 0 ? (
              <p className="text-center text-gray-500">No purchases yet. Start shopping!</p>
            ) : (
              <div className="space-y-6">
                {purchases.map((purchase, index) => {
                  const orderStatus = getOrderStatus(purchase);
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                        <div>
                          <h3 className="text-lg font-semibold">Order #{purchase.orderId}</h3>
                          <div className="flex flex-wrap items-center mt-1 gap-2">
                            <span className="text-sm text-gray-500">
                              {new Date(purchase.purchaseDate).toLocaleDateString()}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${orderStatus.color}`}>
                              {orderStatus.icon} {orderStatus.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-green-600">₹{purchase.totalAmount}</span>
                          <p className="text-xs text-gray-500">{purchase.items.length} items</p>
                        </div>
                      </div>

                      {/* Order Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Confirmed</span>
                          <span>Processing</span>
                          <span>Shipped</span>
                          <span>Delivered</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              orderStatus.status === 'Payment Pending' ? 'bg-yellow-400 w-0' :
                              orderStatus.status === 'Order Confirmed' ? 'bg-blue-400 w-1/4' :
                              orderStatus.status === 'Processing' ? 'bg-orange-400 w-1/2' :
                              orderStatus.status === 'Shipped' ? 'bg-purple-400 w-3/4' :
                              'bg-green-400 w-full'
                            }`}
                          ></div>
                        </div>
                        {/* Real-time status updates info */}
                        {purchase.orderUpdatedAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            Status updated: {new Date(purchase.orderUpdatedAt).toLocaleDateString()} by admin
                          </p>
                        )}
                      </div>
                      
                      <div className="grid gap-4">
                        {purchase.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center space-x-4 bg-gray-50 p-3 rounded">
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="w-16 h-20 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{item.title}</h4>
                              <p className="text-sm text-gray-600">by {item.author}</p>
                              <p className="text-sm font-semibold">₹{item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {orderStatus.status !== 'Delivered' && orderStatus.status !== 'Payment Pending' && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="bg-blue-50 p-3 rounded-md">
                            <p className="text-sm text-blue-800">
                              <strong>📍 Delivery Address:</strong> {purchase.deliveryAddress || address || 'No address provided'}
                            </p>
                            {orderStatus.status === 'Shipped' && (
                              <p className="text-sm text-blue-600 mt-1">
                                🚚 Expected delivery: 1-2 business days
                              </p>
                            )}
                            {orderStatus.status === 'Processing' && (
                              <p className="text-sm text-blue-600 mt-1">
                                📦 Your order is being prepared for shipment
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {orderStatus.status === 'Delivered' && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="bg-green-50 p-3 rounded-md text-center">
                            <p className="text-sm text-green-800 font-medium">
                              🎉 Order Delivered Successfully!
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                              Thank you for shopping with us!
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;