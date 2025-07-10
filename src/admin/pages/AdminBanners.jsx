import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminBanners = () => {
  const [banner, setBanner] = useState({
    title: '',
    desc: '',
    image: ''
  });

  const [banners, setBanners] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    desc: '',
    image: ''
  });

  const handleChange = (e) => {
    setBanner({ ...banner, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3001/banners', banner);
    alert('✅ Banner Added!');
    setBanner({ title: '', desc: '', image: '' });
    fetchBanners();
  };

  const fetchBanners = async () => {
    const res = await axios.get('http://localhost:3001/banners');
    setBanners(res.data);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      <div className="bg-gradient-to-r from-pink-600 to-purple-500 rounded-2xl shadow-lg p-4 sm:p-8 mb-6 sm:mb-8 flex flex-col sm:flex-row items-center gap-4">
        <div className="text-3xl sm:text-4xl bg-white rounded-full p-3 sm:p-4 shadow text-pink-600">🎯</div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">Admin - Add Banner</h2>
          <p className="text-pink-100 text-sm sm:text-base">Add a new banner for your store</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl px-4 sm:px-8 py-6 sm:py-8 grid gap-4 sm:gap-5 mb-8 sm:mb-10" style={{ borderTop: "6px solid #ec4899" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
            <input 
              name="title" 
              placeholder="Title" 
              value={banner.title} 
              onChange={handleChange} 
              required 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400 outline-none text-sm sm:text-base" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <input 
              name="desc" 
              placeholder="Description" 
              value={banner.desc} 
              onChange={handleChange} 
              required 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400 outline-none text-sm sm:text-base" 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
            <input 
              name="image" 
              placeholder="Image URL" 
              value={banner.image} 
              onChange={handleChange} 
              required 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400 outline-none text-sm sm:text-base" 
            />
          </div>
        </div>
        <button 
          type="submit" 
          className="mt-4 bg-gradient-to-r from-pink-600 to-pink-500 text-white font-bold px-6 py-3 rounded-lg shadow hover:from-pink-700 hover:to-pink-600 transition text-sm sm:text-base"
        >
          ➕ Add Banner
        </button>
      </form>
    </div>
  );
};

export default AdminBanners;
