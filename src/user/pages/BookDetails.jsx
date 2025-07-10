import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../contexts/CartContext';

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const navigate = useNavigate();
    const { updateCounts } = useCart();

    useEffect(() => {
        axios.get(`https://data-json-nwab.onrender.com/books/${id}`)
            .then(res => setBook(res.data))
            .catch(err => console.error("Failed to fetch book", err));
    }, [id]);

    const addToCart = () => {
        if (localStorage.getItem('loggedIn') !== 'true') {
            alert('Please login to add to cart.');
            navigate('/login');
            return;
        }
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const cartKey = `cart_${currentUser.id}`;
        let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        
        const already = cart.find(item => item.id === book.id);
        if (!already) {
            cart.push(book);
            localStorage.setItem(cartKey, JSON.stringify(cart));
            updateCounts();
            alert("Added to cart ✅");
        } else {
            alert("Already in cart ❗");
        }
    };

    const saveForLater = () => {
        if (localStorage.getItem('loggedIn') !== 'true') {
            alert('Please login to save for later.');
            navigate('/login');
            return;
        }
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const savedKey = `saved_${currentUser.id}`;
        const saved = JSON.parse(localStorage.getItem(savedKey)) || [];
        
        const alreadySaved = saved.find(item => item.id === book.id);
        if (!alreadySaved) {
            saved.push(book);
            localStorage.setItem(savedKey, JSON.stringify(saved));
            updateCounts();
            alert("❤️ Saved for later!");
        } else {
            alert("Already saved!");
        }
    };

    if (!book) return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-lg">Loading...</p>
        </div>
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/2 p-6">
                        <img 
                            src={book.image} 
                            alt={book.title} 
                            className="w-full max-w-sm mx-auto lg:mx-0 rounded-lg shadow-md"
                        />
                    </div>
                    
                    <div className="lg:w-1/2 p-6">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-gray-800">{book.title}</h2>
                        
                        <div className="space-y-3 mb-6">
                            <p className="text-lg"><b>Author:</b> <span className="text-gray-700">{book.author}</span></p>
                            <p className="text-lg"><b>Category:</b> <span className="text-gray-700">{book.category}</span></p>
                            <p className="text-lg"><b>Price:</b> <span className="text-2xl font-bold text-green-600">₹{book.price}</span></p>
                        </div>
                        
                        <div className="mb-6">
                            <p className="text-lg font-semibold mb-2">Description:</p>
                            <p className="text-gray-700 leading-relaxed">{book.description}</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button 
                                onClick={addToCart} 
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                            >
                                🛒 Add to Cart
                            </button>
                            <button 
                                onClick={saveForLater} 
                                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                            >
                                ❤️ Save for Later
                            </button>
                        </div>
                        
                        <button 
                            onClick={() => navigate('/books')}
                            className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
                        >
                            ← Back to Books
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;
