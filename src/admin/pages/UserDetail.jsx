import React, { useState, useEffect } from 'react'

const UserDetail = () => {
  const [users, setUsers] = useState([])
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedUser, setExpandedUser] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [usersRes, purchasesRes] = await Promise.all([
        fetch('https://data-json-nwab.onrender.com/users'),
        fetch('https://data-json-nwab.onrender.com/purchases')
      ])
      
      const usersData = await usersRes.json()
      const purchasesData = await purchasesRes.json()
      
      setUsers(usersData)
      setPurchases(purchasesData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  const getUserPurchases = (userId) => {
    return purchases.filter(purchase => purchase.userId === userId)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const toggleUserDetails = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId)
  }

  const updatePaymentStatus = async (purchaseId, newStatus) => {
    try {
      const response = await fetch(`https://data-json-nwab.onrender.com/purchases/${purchaseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          paymentStatus: newStatus,
          paymentUpdatedAt: new Date().toISOString(),
          paymentUpdatedBy: 'admin'
        }),
      })

      if (response.ok) {
        // Update local state
        setPurchases(prev => 
          prev.map(purchase => 
            purchase.id === purchaseId 
              ? { ...purchase, paymentStatus: newStatus }
              : purchase
          )
        )
        alert(`Payment status updated to ${newStatus}`)
      }
    } catch (error) {
      console.error('Error updating payment status:', error)
      alert('Failed to update payment status')
    }
  }

  // New: Update order status
  const updateOrderStatus = async (purchaseId, newStatus) => {
    try {
      const response = await fetch(`https://data-json-nwab.onrender.com/purchases/${purchaseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderStatus: newStatus,
          orderUpdatedAt: new Date().toISOString(),
          orderUpdatedBy: 'admin'
        }),
      });

      if (response.ok) {
        setPurchases(prev =>
          prev.map(purchase =>
            purchase.id === purchaseId
              ? { ...purchase, orderStatus: newStatus, orderUpdatedAt: new Date().toISOString(), orderUpdatedBy: 'admin' }
              : purchase
          )
        );
        alert(`Order status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading user data...</div>
      </div>
    )
  }

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 text-center sm:text-left">
        👥 User Details & Purchase History
      </h1>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Mobile Card View */}
        <div className="block md:hidden space-y-4 p-2 sm:p-4">
          {users.map((user) => {
            const userPurchases = getUserPurchases(user.id)
            const totalSpent = userPurchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0)
            
            return (
              <div key={user.id} className="bg-gray-50 rounded-lg p-4 shadow">
                <div className="flex items-center mb-3">
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-lg font-medium text-purple-700">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                  <div>
                    <span className="text-gray-600">Registered:</span>
                    <p className="font-medium">{formatDate(user.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Orders:</span>
                    <p className="font-medium">{userPurchases.length} (₹{totalSpent})</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleUserDetails(user.id)}
                  className="w-full text-purple-600 hover:text-purple-900 bg-purple-100 hover:bg-purple-200 px-3 py-2 rounded-md transition text-sm font-medium"
                >
                  {expandedUser === user.id ? 'Hide Orders' : 'View Orders'}
                </button>
                
                {expandedUser === user.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Purchase History</h4>
                    {userPurchases.length === 0 ? (
                      <p className="text-gray-500 text-sm">No purchases yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {userPurchases.map((purchase) => (
                          <div key={purchase.id} className="bg-white rounded-lg p-3 shadow-sm border">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-medium text-gray-900">Order ID: {purchase.orderId}</h4>
                                <p className="text-sm text-gray-500">Date: {formatDate(purchase.purchaseDate)}</p>
                                <div className="flex items-center mt-2 space-x-2">
                                  <span className="text-sm font-medium text-gray-700">Payment:</span>
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    purchase.paymentStatus === 'paid' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {purchase.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
                                  </span>
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    {purchase.paymentMethod ? purchase.paymentMethod.toUpperCase() : 'COD'}
                                  </span>
                                </div>
                                {purchase.deliveryAddress && (
                                  <div className="mt-2">
                                    <span className="text-sm font-medium text-gray-700">Address:</span>
                                    <p className="text-xs text-gray-600 mt-1">{purchase.deliveryAddress}</p>
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-sm">₹{purchase.totalAmount}</p>
                                <p className="text-xs text-gray-500">{purchase.items.length} items</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mb-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                purchase.paymentStatus === 'paid' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {purchase.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
                              </span>
                            </div>
                            
                            <div className="flex gap-2">
                              <button
                                onClick={() => updatePaymentStatus(purchase.id, 'pending')}
                                className={`flex-1 px-2 py-1 text-xs font-medium rounded transition ${
                                  purchase.paymentStatus === 'pending'
                                    ? 'bg-yellow-200 text-yellow-800 cursor-not-allowed'
                                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                }`}
                                disabled={purchase.paymentStatus === 'pending'}
                              >
                                Pending
                              </button>
                              <button
                                onClick={() => updatePaymentStatus(purchase.id, 'paid')}
                                className={`flex-1 px-2 py-1 text-xs font-medium rounded transition ${
                                  purchase.paymentStatus === 'paid'
                                    ? 'bg-green-200 text-green-800 cursor-not-allowed'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                                disabled={purchase.paymentStatus === 'paid'}
                              >
                                Paid
                              </button>
                            </div>
                            
                            <div className="mt-3">
                              <h6 className="text-xs font-medium text-gray-700 mb-2">Items:</h6>
                              <div className="space-y-2">
                                {purchase.items.map((item) => (
                                  <div key={item.id} className="flex items-center gap-2">
                                    <img 
                                      src={item.image} 
                                      alt={item.title}
                                      className="h-8 w-6 object-cover rounded"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium text-gray-900 truncate">{item.title}</p>
                                      <p className="text-xs text-gray-500">{item.author} - ₹{item.price}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block w-full overflow-x-auto">
          <table className="min-w-[700px] w-full">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User Info</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Registration Date</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total Orders</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => {
                const userPurchases = getUserPurchases(user.id)
                const totalSpent = userPurchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0)
                
                return (
                  <React.Fragment key={user.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-purple-700">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{userPurchases.length} orders</div>
                        <div className="text-sm text-gray-500">₹{totalSpent}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => toggleUserDetails(user.id)}
                          className="text-purple-600 hover:text-purple-900 bg-purple-100 hover:bg-purple-200 px-3 py-1 rounded-md transition"
                        >
                          {expandedUser === user.id ? 'Hide Orders' : 'View Orders'}
                        </button>
                      </td>
                    </tr>
                    
                    {expandedUser === user.id && (
                      <tr>
                        <td colSpan="5" className="px-2 sm:px-4 lg:px-6 py-4 bg-gray-50">
                          <div className="space-y-4">
                            <h3 className="text-base md:text-lg font-medium text-gray-900">
                              Purchase History for {user.name}
                            </h3>
                            
                            {userPurchases.length === 0 ? (
                              <p className="text-gray-500">No purchases yet.</p>
                            ) : (
                              <div className="space-y-4">
                                {userPurchases.map((purchase) => (
                                  <div key={purchase.id} className="bg-white rounded-lg p-2 sm:p-4 shadow">
                                    <div className="flex justify-between items-start mb-3">
                                      <div>
                                        <h4 className="font-medium text-gray-900">Order ID: {purchase.orderId}</h4>
                                        <p className="text-sm text-gray-500">Date: {formatDate(purchase.purchaseDate)}</p>
                                        <div className="flex items-center mt-2 space-x-2">
                                          <span className="text-sm font-medium text-gray-700">Payment:</span>
                                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            purchase.paymentStatus === 'paid' 
                                              ? 'bg-green-100 text-green-800' 
                                              : 'bg-yellow-100 text-yellow-800'
                                          }`}>
                                            {purchase.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
                                          </span>
                                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                            {purchase.paymentMethod ? purchase.paymentMethod.toUpperCase() : 'COD'}
                                          </span>
                                        </div>
                                        {purchase.deliveryAddress && (
                                          <div className="mt-2">
                                            <span className="text-sm font-medium text-gray-700">Address:</span>
                                            <p className="text-xs text-gray-600 mt-1">{purchase.deliveryAddress}</p>
                                          </div>
                                        )}
                                      </div>
                                      <div className="text-right">
                                        <p className="font-medium text-gray-900">₹{purchase.totalAmount}</p>
                                        <p className="text-sm text-gray-500">{purchase.items.length} items</p>
                                        <div className="mt-2 space-x-2">
                                          <button
                                            onClick={() => updatePaymentStatus(purchase.id, 'pending')}
                                            className={`px-3 py-1 text-xs font-medium rounded transition ${
                                              purchase.paymentStatus === 'pending'
                                                ? 'bg-yellow-200 text-yellow-800 cursor-not-allowed'
                                                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                            }`}
                                            disabled={purchase.paymentStatus === 'pending'}
                                          >
                                            Pending
                                          </button>
                                          <button
                                            onClick={() => updatePaymentStatus(purchase.id, 'paid')}
                                            className={`px-3 py-1 text-xs font-medium rounded transition ${
                                              purchase.paymentStatus === 'paid'
                                                ? 'bg-green-200 text-green-800 cursor-not-allowed'
                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                            }`}
                                            disabled={purchase.paymentStatus === 'paid'}
                                          >
                                            Paid
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="overflow-x-auto">
                                      <table className="min-w-[400px] w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-100">
                                          <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                          {purchase.items.map((item) => (
                                            <tr key={item.id}>
                                              <td className="px-4 py-2">
                                                <div className="flex items-center">
                                                  <img 
                                                    src={item.image} 
                                                    alt={item.title}
                                                    className="h-10 w-8 object-cover rounded mr-3"
                                                  />
                                                  <div>
                                                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                                  </div>
                                                </div>
                                              </td>
                                              <td className="px-4 py-2 text-sm text-gray-900">{item.author}</td>
                                              <td className="px-4 py-2 text-sm text-gray-900">
                                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                  {item.category}
                                                </span>
                                              </td>
                                              <td className="px-4 py-2 text-sm font-medium text-gray-900">₹{item.price}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                    {/* Admin Order Status Controls */}
                                    <div className="mt-3 flex flex-wrap gap-2 items-center">
                                      <span className="font-medium text-sm text-gray-700 mr-2">Order Status:</span>
                                      {['confirmed', 'processing', 'shipped', 'delivered'].map(status => (
                                        <button
                                          key={status}
                                          onClick={() => updateOrderStatus(purchase.id, status)}
                                          className={`px-3 py-1 text-xs font-medium rounded transition
                                            ${purchase.orderStatus === status
                                              ? 'bg-purple-600 text-white'
                                              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}
                                          `}
                                          disabled={purchase.orderStatus === status}
                                          style={{ textTransform: 'capitalize' }}
                                        >
                                          {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </button>
                                      ))}
                                      {purchase.orderUpdatedAt && (
                                        <span className="ml-2 text-xs text-gray-400">
                                          (Updated: {new Date(purchase.orderUpdatedAt).toLocaleString()})
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No users found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDetail