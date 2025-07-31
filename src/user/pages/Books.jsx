import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../contexts/CartContext";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { updateCounts } = useCart();

  useEffect(() => {
    axios.get("https://data-json-nwab.onrender.com/books").then((res) => {
      setBooks(res.data);
      // Extract unique categories
      const cats = Array.from(new Set(res.data.map(b => b.category?.trim()).filter(Boolean)));
      setCategories(cats);
    });
  }, []);

  // Filtered books
  const filteredBooks = books.filter(book => {
    const matchesCategory = category === "all" || (book.category && book.category.trim() === category);
    const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (book) => {
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
      updateCounts(); // Add this line
      alert("Added to cart ✅");
    } else {
      alert("Already in cart ❗");
    }
  };

  const saveForLater = (book) => {
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
      updateCounts(); // Add this line
      alert("❤️ Saved for later!");
    } else {
      alert("Already saved!");
    }
  };

  return (
    <div className="py-10 px-4 container mx-auto">
      <h2 className="text-3xl font-bold mb-6">📚 All Available Books</h2>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8 bg-gray-50 p-4 rounded-lg shadow-sm">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by book name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <div>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <p className="text-center text-gray-500">No books found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden flex flex-col"
            >
              {/* Save Heart Icon */}
              <button
                onClick={() => saveForLater(book)}
                className="absolute top-3 right-3 text-gray-300 group-hover:text-red-500 text-xl transition-opacity opacity-0 group-hover:opacity-100 z-10"
              >
                <FaHeart />
              </button>

              <div className="w-full h-60 bg-white flex items-center justify-center">
                <img
                  src={book.image}
                  alt={book.title}
                  className="h-full object-contain bg-white"
                />
              </div>


              <div className="p-4 relative group-hover:bg-gray-50 transition-colors duration-300 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{book.title}</h3>
                  <p className="text-gray-600 text-sm mb-1">👤 {book.author}</p>
                  <p className="text-purple-700 font-bold mb-3">₹ {book.price}</p>
                </div>
                {/* Add to Cart (appears on hover) */}
                <button
                  onClick={() => addToCart(book)}
                  className="absolute left-4 right-4 bottom-16 bg-purple-600 text-white py-2 rounded-md opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-purple-700 z-10"
                >
                  <FaShoppingCart className="inline-block mr-2" />
                  Add to Cart
                </button>

                {/* View Details */}
                <button
                  className="w-full bg-gray-800 text-white py-2 rounded-md mt-2 hover:bg-gray-900"
                  onClick={() => navigate(`/book/${book.id}`)}
                >
                  View Details
                </button>
              </div>

              {/* Dim effect on hover */}
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition duration-300 rounded-xl pointer-events-none" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;
