import React, { useState } from 'react';
import axios from 'axios';


const AdminPanel = () => {
  const [form, setForm] = useState({
    title: '',
    author: '',
    category: '',
    price: '',
    description: '',
    image: ''
  });

  const [banner, setBanner] = useState({
    title: '',
    subtitle: '',
    image: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBannerChange = (e) => {
    setBanner({ ...banner, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://data-json-nwab.onrender.com/books', {
        ...form,
        price: Number(form.price)
      });
      alert('✅ Book added successfully!');
      setForm({
        title: '',
        author: '',
        category: '',
        price: '',
        description: '',
        image: ''
      });
    } catch (err) {
      alert('❌ Failed to add book');
    }
  };

  

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      <div className="bg-gradient-to-r from-purple-700 to-purple-500 rounded-2xl shadow-lg p-4 sm:p-8 mb-6 sm:mb-8 flex flex-col sm:flex-row items-center gap-4">
        <div className="text-3xl sm:text-4xl bg-white rounded-full p-3 sm:p-4 shadow text-purple-700">📚</div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">Admin Panel</h2>
          <p className="text-purple-100 text-sm sm:text-base">Add a new book to your collection</p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl px-4 sm:px-8 py-6 sm:py-8 grid gap-4 sm:gap-5"
        style={{ borderTop: "6px solid #7c3aed" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
            <input
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Author</label>
            <input
              name="author"
              placeholder="Author"
              value={form.author}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
            <input
              name="category"
              placeholder="Category (e.g. Programming)"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Price</label>
            <input
              name="price"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none text-sm sm:text-base"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
            <input
              name="image"
              placeholder="Image URL"
              value={form.image}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none text-sm sm:text-base"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none min-h-[80px] text-sm sm:text-base"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold px-6 py-3 rounded-lg shadow hover:from-purple-700 hover:to-purple-600 transition text-sm sm:text-base"
        >
          ➕ Add Book
        </button>
      </form>
      
    </div>
  );
};

export default AdminPanel;
