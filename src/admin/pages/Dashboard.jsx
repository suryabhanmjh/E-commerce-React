import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [booksCount, setBooksCount] = useState(0);
  const [bannersCount, setBannersCount] = useState(0);
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    // Fetch books count
    axios.get('http://localhost:3001/books')
      .then(res => setBooksCount(res.data.length))
      .catch(() => setBooksCount(0));

    // Fetch banners count
    axios.get('http://localhost:3001/banners')
      .then(res => setBannersCount(res.data.length))
      .catch(() => setBannersCount(0));

    // Get admin email from localStorage (or set a default)
    setAdminEmail(localStorage.getItem('adminEmail') || 'admin@gmail.com');
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center sm:text-left">Welcome to the Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border-t-4 border-purple-600 hover:scale-105 transition-transform">
          <h2 className="text-base sm:text-lg font-semibold text-purple-700 flex items-center gap-2 justify-center sm:justify-start">
            📚 Total Books
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold mt-3 text-gray-800 text-center sm:text-left">{booksCount}</p>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border-t-4 border-pink-500 hover:scale-105 transition-transform">
          <h2 className="text-base sm:text-lg font-semibold text-pink-600 flex items-center gap-2 justify-center sm:justify-start">
            🖼️ Total Banners
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold mt-3 text-gray-800 text-center sm:text-left">{bannersCount}</p>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border-t-4 border-blue-500 hover:scale-105 transition-transform sm:col-span-2 lg:col-span-1">
          <h2 className="text-base sm:text-lg font-semibold text-blue-600 flex items-center gap-2 justify-center sm:justify-start">
            👤 Logged in Admin
          </h2>
          <p className="text-lg sm:text-xl mt-3 text-gray-600 font-medium text-center sm:text-left break-words">
            {adminEmail}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

