import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DynamicCarousel from '../../components/DynamicCarousel'
import axios from 'axios'

const testimonials = [
  {
    name: "Amit Sharma",
    review: "Amazing collection and fast delivery. Highly recommended!",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Priya Singh",
    review: "Loved the wishlist feature. Found all my favorite books here.",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  }
];

const categoriesList = [
  { name: "Programming", icon: "💻" },
  { name: "Romance", icon: "💖" },
  { name: "Fashion", icon: "👗" },
  { name: "Fiction", icon: "📖" },
  { name: "Motivation", icon: "🚀" }
];

const Home = () => {
  const [books, setBooks] = useState([]);
  const [categoryBooks, setCategoryBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/books")
      .then(res => setBooks(res.data))
      .catch(() => setBooks([]));
  }, []);

  // Handle category click
  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setCategoryBooks(books.filter(b => (b.category || '').trim().toLowerCase() === cat.toLowerCase()));
  };

  // Clear category filter
  const clearCategory = () => {
    setSelectedCategory(null);
    setCategoryBooks([]);
  };

  // Newsletter form handler
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    // Replace with your Formspree endpoint
    const endpoint = "https://formspree.io/f/xpwrvdgz";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      });
      if (res.ok) {
        setSubscribed(true);
        form.reset();
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
   <>
     <DynamicCarousel />

     {/* Welcome Section */}
     <section className="mt-10 mb-8 text-center">
       <h2 className="text-2xl md:text-3xl font-bold mb-4 text-purple-700">Welcome to Old Bookstore!</h2>
       <p className="max-w-2xl mx-auto text-gray-600 mb-6">
         Discover a wide range of books at unbeatable prices. Whether you love programming, fiction, or fashion, we have something for everyone. Enjoy fast delivery, secure checkout, and a seamless shopping experience.
       </p>
       <div className="flex flex-col md:flex-row justify-center gap-6 mb-8">
         <div className="bg-white rounded-lg shadow p-6 flex-1">
           <h3 className="font-semibold text-lg mb-2">📦 Fast Delivery</h3>
           <p className="text-gray-500">Get your books delivered quickly and safely to your doorstep.</p>
         </div>
         <div className="bg-white rounded-lg shadow p-6 flex-1">
           <h3 className="font-semibold text-lg mb-2">🔒 Secure Checkout</h3>
           <p className="text-gray-500">Shop with confidence using our secure payment options.</p>
         </div>
         <div className="bg-white rounded-lg shadow p-6 flex-1">
           <h3 className="font-semibold text-lg mb-2">❤️ Save & Wishlist</h3>
           <p className="text-gray-500">Save your favorite books for later and never miss a deal.</p>
         </div>
       </div>
       <a
         href="/books"
         className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-md shadow transition"
       >
         Browse Books
       </a>
     </section>

     {/* Featured Books */}
     <section className="mb-12">
       <h3 className="text-xl font-bold text-center mb-6 text-purple-700">Featured Books</h3>
       <div className="flex gap-6 overflow-x-auto px-2 pb-2">
         {books.slice(0, 5).map((book) => (
           <div
             key={book.id}
             className="min-w-[200px] bg-white rounded-lg shadow p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition"
             onClick={() => navigate(`/book/${book.id}`)}
           >
             <img src={book.image} alt={book.title} className="h-40 object-contain mb-3 rounded" />
             <div className="font-semibold">{book.title}</div>
             <div className="text-sm text-gray-500">{book.author}</div>
           </div>
         ))}
       </div>
     </section>

     {/* Categories */}
     <section className="mb-12">
       <h3 className="text-xl font-bold text-center mb-6 text-purple-700">Browse by Category</h3>
       <div className="flex flex-wrap justify-center gap-4 mb-6">
         {categoriesList.map((cat, idx) => (
           <div
             key={idx}
             className={`bg-purple-50 hover:bg-purple-100 rounded-lg px-6 py-4 flex flex-col items-center shadow transition cursor-pointer border-2 ${
               selectedCategory === cat.name ? "border-purple-600" : "border-transparent"
             }`}
             onClick={() => handleCategoryClick(cat.name)}
           >
             <span className="text-3xl mb-2">{cat.icon}</span>
             <span className="font-medium text-purple-700">{cat.name}</span>
           </div>
         ))}
       </div>
       {selectedCategory && (
         <div className="text-center mb-4">
           <button
             onClick={clearCategory}
             className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1 rounded transition text-sm"
           >
             Clear Filter
           </button>
         </div>
       )}
       {/* Show books of selected category */}
       {selectedCategory && (
         <div>
           <h4 className="text-lg font-semibold text-purple-700 mb-4 text-center">
             Books in "{selectedCategory}"
           </h4>
           {categoryBooks.length === 0 ? (
             <div className="text-center text-gray-500">No books found in this category.</div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
               {categoryBooks.map((book) => (
                 <div
                   key={book.id}
                   className="bg-white rounded-lg shadow p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition"
                   onClick={() => navigate(`/book/${book.id}`)}
                 >
                   <img src={book.image} alt={book.title} className="h-40 object-contain mb-3 rounded" />
                   <div className="font-semibold">{book.title}</div>
                   <div className="text-sm text-gray-500">{book.author}</div>
                 </div>
               ))}
             </div>
           )}
         </div>
       )}
     </section>

     {/* How It Works */}
     <section className="mb-12">
       <h3 className="text-xl font-bold text-center mb-6 text-purple-700">How It Works</h3>
       <div className="flex flex-col md:flex-row justify-center gap-8">
         <div className="flex flex-col items-center">
           <div className="text-4xl mb-2">🔍</div>
           <div className="font-semibold">1. Search Books</div>
         </div>
         <div className="flex flex-col items-center">
           <div className="text-4xl mb-2">🛒</div>
           <div className="font-semibold">2. Add to Cart</div>
         </div>
         <div className="flex flex-col items-center">
           <div className="text-4xl mb-2">🚚</div>
           <div className="font-semibold">3. Fast Delivery</div>
         </div>
       </div>
     </section>

     {/* Testimonials */}
     <section className="mb-12">
       <h3 className="text-xl font-bold text-center mb-6 text-purple-700">What Our Customers Say</h3>
       <div className="flex flex-col md:flex-row justify-center gap-8">
         {testimonials.map((t, idx) => (
           <div key={idx} className="bg-white rounded-lg shadow p-6 max-w-xs mx-auto flex flex-col items-center">
             <img src={t.image} alt={t.name} className="w-16 h-16 rounded-full mb-3" />
             <div className="italic text-gray-600 mb-2">"{t.review}"</div>
             <div className="font-semibold text-purple-700">{t.name}</div>
           </div>
         ))}
       </div>
     </section>

     {/* Newsletter Signup */}
     <section className="mb-12 text-center">
       <h3 className="text-xl font-bold mb-3 text-purple-700">Stay Updated!</h3>
       <p className="text-gray-600 mb-4">Subscribe to our newsletter for latest offers and updates.</p>
       {subscribed ? (
         <div className="text-green-600 font-semibold text-lg py-4">
           Thank you for subscribing! 🎉
         </div>
       ) : (
         <form
           className="flex flex-col md:flex-row justify-center gap-2 max-w-md mx-auto"
           onSubmit={handleNewsletterSubmit}
         >
           <input
             type="email"
             name="email"
             required
             placeholder="Enter your email"
             className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 flex-1"
           />
           <button
             type="submit"
             className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-md transition"
           >
             Subscribe
           </button>
         </form>
       )}
     </section>
   </>
  )
}

export default Home