import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const Saved = () => {
  const [saved, setSaved] = useState([]);
  const navigate = useNavigate();
  const { updateCounts } = useCart();

  useEffect(() => {
    if (localStorage.getItem('loggedIn') !== 'true') {
      alert('Please login to access saved books.');
      navigate('/login');
      return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const savedKey = `saved_${currentUser.id}`;
    const data = JSON.parse(localStorage.getItem(savedKey)) || [];
    setSaved(data);
  }, [navigate]);

  const moveToCart = (book) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const cartKey = `cart_${currentUser.id}`;
    const savedKey = `saved_${currentUser.id}`;
    
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    if (!cart.find(item => item.id === book.id)) {
      cart.push({ ...book, qty: 1 });
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }
    const updated = saved.filter(item => item.id !== book.id);
    setSaved(updated);
    localStorage.setItem(savedKey, JSON.stringify(updated));
    updateCounts();
    alert("Moved to cart ✅");
  };

  const removeItem = (id) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const savedKey = `saved_${currentUser.id}`;
    const updated = saved.filter(item => item.id !== id);
    setSaved(updated);
    localStorage.setItem(savedKey, JSON.stringify(updated));
    updateCounts();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">❤️ Saved for Later</h2>
      {saved.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">No saved books.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {saved.map(book => (
            <div key={book.id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {book.image && (
                    <img 
                      src={book.image} 
                      alt={book.title}
                      className="w-full sm:w-20 h-32 sm:h-24 object-cover rounded-md mx-auto sm:mx-0"
                    />
                  )}
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="font-semibold text-lg mb-2 text-gray-800">{book.title}</h4>
                    <p className="text-gray-600 mb-2">Author: {book.author}</p>
                    <p className="text-green-600 font-bold text-lg mb-4">₹{book.price}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <button 
                    onClick={() => moveToCart(book)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors text-sm sm:text-base"
                  >
                    🛒 Move to Cart
                  </button>
                  <button 
                    onClick={() => removeItem(book.id)} 
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors text-sm sm:text-base"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Saved;
