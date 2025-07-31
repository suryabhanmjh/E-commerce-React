import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DisplayBanners = () => {
  const [banners, setBanners] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ title: '', subtitle: '', image: '' });
  const navigate = useNavigate();

  const fetchBanners = async () => {
    const res = await axios.get('https://data-json-nwab.onrender.com/banners');
    setBanners(res.data);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      await axios.delete(`https://data-json-nwab.onrender.com/banners/${id}`);
      setBanners(banners.filter(b => b.id !== id));
    }
  };

  const handleEdit = (banner) => {
    setEditId(banner.id);
    setEditData({ title: banner.title, subtitle: banner.subtitle, image: banner.image });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    const updated = { ...editData, id };
    await axios.put(`https://data-json-nwab.onrender.com/banners/${id}`, updated);
    setBanners(banners.map(b => (b.id === id ? updated : b)));
    setEditId(null);
  };

  const handleEditCancel = () => {
    setEditId(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      <div className="bg-gradient-to-r from-pink-600 to-purple-500 rounded-2xl shadow-lg p-4 sm:p-8 mb-6 sm:mb-8 flex flex-col sm:flex-row items-center gap-4">
        <div className="text-3xl sm:text-4xl bg-white rounded-full p-3 sm:p-4 shadow text-pink-600">🎯</div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">All Banners</h2>
          <p className="text-pink-100 text-sm sm:text-base">View all banners for your store</p>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {banners.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No banners found.
          </div>
        ) : (
          banners.map((b) => (
            <div key={b.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              {editId === b.id ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="text"
                      name="image"
                      value={editData.image}
                      onChange={handleEditChange}
                      className="w-full border rounded px-2 py-1 text-sm"
                      placeholder="Image URL"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={editData.title}
                      onChange={handleEditChange}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      name="subtitle"
                      value={editData.subtitle}
                      onChange={handleEditChange}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSave(b.id)}
                      className="flex-1 px-3 py-2 rounded bg-green-500 text-white hover:bg-green-700 transition text-sm"
                    >
                      💾 Save
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="flex-1 px-3 py-2 rounded bg-gray-400 text-white hover:bg-gray-600 transition text-sm"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex gap-3 mb-3">
                    <img 
                      src={b.image} 
                      alt={b.title} 
                      className="w-20 h-16 sm:w-24 sm:h-20 object-cover rounded shadow flex-shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">{b.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{b.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(b)}
                      className="flex-1 px-3 py-2 rounded bg-purple-500 text-white hover:bg-purple-700 transition text-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="flex-1 px-3 py-2 rounded bg-red-500 text-white hover:bg-red-700 transition text-sm"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white border border-gray-200">
          <caption className="caption-top text-lg font-semibold text-pink-700 mb-2 sr-only">All Banners</caption>
          <thead className="bg-pink-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left border-b border-gray-200 text-xs sm:text-sm">Image</th>
              <th className="py-3 px-4 text-left border-b border-gray-200 text-xs sm:text-sm">Title</th>
              <th className="py-3 px-4 text-left border-b border-gray-200 text-xs sm:text-sm">Description</th>
              <th className="py-3 px-4 text-left border-b border-gray-200 text-xs sm:text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500 border-b border-gray-200">
                  No banners found.
                </td>
              </tr>
            )}
            {banners.map((b, idx) => (
              <tr key={b.id} className={idx % 2 === 0 ? "bg-white" : "bg-pink-50"}>
                <td className="py-2 px-4 border-b border-gray-200">
                  {editId === b.id ? (
                    <input
                      type="text"
                      name="image"
                      value={editData.image}
                      onChange={handleEditChange}
                      className="w-32 h-10 border rounded px-2"
                    />
                  ) : (
                    <img src={b.image} alt={b.title} className="w-32 h-20 object-cover rounded shadow" />
                  )}
                </td>
                <td className="py-2 px-4 font-semibold border-b border-gray-200">
                  {editId === b.id ? (
                    <input
                      type="text"
                      name="title"
                      value={editData.title}
                      onChange={handleEditChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    b.title
                  )}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {editId === b.id ? (
                    <input
                      type="text"
                      name="subtitle"
                      value={editData.subtitle}
                      onChange={handleEditChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    b.subtitle
                  )}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {editId === b.id ? (
                    <>
                      <button
                        onClick={() => handleEditSave(b.id)}
                        className="mr-2 px-3 py-1 rounded bg-green-500 text-white hover:bg-green-700 transition"
                        title="Save"
                      >
                        💾 Save
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="px-3 py-1 rounded bg-gray-400 text-white hover:bg-gray-600 transition"
                        title="Cancel"
                      >
                        ❌ Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(b)}
                        className="mr-2 px-3 py-1 rounded bg-purple-500 text-white hover:bg-purple-700 transition"
                        title="Edit"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-700 transition"
                        title="Delete"
                      >
                        🗑️ Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisplayBanners;