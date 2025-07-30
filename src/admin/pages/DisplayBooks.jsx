import React, { useEffect, useState } from "react";
import axios from "axios";

const DisplayBooks = () => {
  const [books, setBooks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    author: "",
    category: "",
    price: "",
    description: "",
    image: ""
  });
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [categories, setCategories] = useState([]);

  // Fetch all books
  const fetchBooks = async () => {
    const res = await axios.get("http://localhost:3001/books");
    setBooks(res.data);

    // Extract unique categories for filter dropdown
    const cats = Array.from(new Set(res.data.map(b => b.category).filter(Boolean)));
    setCategories(cats);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Delete book
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      await axios.delete(`http://localhost:3001/books/${id}`);
      fetchBooks();
    }
  };

  // Start editing
  const handleEdit = (book) => {
    setEditId(book.id);
    setEditForm({
      title: book.title,
      author: book.author,
      category: book.category,
      price: book.price,
      description: book.description,
      image: book.image
    });
  };

  // Handle edit form change
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Save edit
  const handleEditSave = async (id) => {
    await axios.put(`http://localhost:3001/books/${id}`, {
      ...editForm,
      price: Number(editForm.price)
    });
    setEditId(null);
    fetchBooks();
  };

  // Cancel edit
  const handleEditCancel = () => {
    setEditId(null);
  };

  // Filtered books
  const filteredBooks =
    categoryFilter === "All"
      ? books
      : books.filter((b) => b.category === categoryFilter);

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-purple-800 flex items-center gap-2 justify-center sm:justify-start">
        <span>📚</span> All Books
      </h2>
      
      {/* Category Filter */}
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
        <label className="font-medium text-gray-700 text-sm sm:text-base">Filter by Category:</label>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="w-full sm:w-auto border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm sm:text-base"
        >
          <option value="All">All</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {filteredBooks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No books found.
          </div>
        ) : (
          filteredBooks.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              {editId === book.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Image URL</label>
                      <input
                        name="image"
                        value={editForm.image}
                        onChange={handleEditChange}
                        className="w-full border rounded px-2 py-1 text-sm"
                        placeholder="Image URL"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                      <input
                        name="title"
                        value={editForm.title}
                        onChange={handleEditChange}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Author</label>
                      <input
                        name="author"
                        value={editForm.author}
                        onChange={handleEditChange}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                      <input
                        name="category"
                        value={editForm.category}
                        onChange={handleEditChange}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Price</label>
                      <input
                        name="price"
                        type="number"
                        value={editForm.price}
                        onChange={handleEditChange}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        className="w-full border rounded px-2 py-1 text-sm h-20"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition"
                      onClick={() => handleEditSave(book.id)}
                    >
                      Save
                    </button>
                    <button
                      className="flex-1 bg-gray-400 text-white px-3 py-2 rounded text-sm hover:bg-gray-500 transition"
                      onClick={handleEditCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex gap-4 mb-3">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded shadow flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">by {book.author}</p>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">{book.category}</p>
                      <p className="text-sm sm:text-base text-purple-700 font-bold">₹{book.price}</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{book.description}</p>
                  <div className="flex gap-2">
                    <button
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition"
                      onClick={() => handleEdit(book)}
                    >
                      Edit
                    </button>
                    <button
                      className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition"
                      onClick={() => handleDelete(book.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-purple-700 text-white">
            <tr>
              <th className="py-3 px-4 text-left text-xs sm:text-sm">Image</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm">Title</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm">Author</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm">Category</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm">Price</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm">Description</th>
              <th className="py-3 px-4 text-center text-xs sm:text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  No books found.
                </td>
              </tr>
            )}
            {filteredBooks.map((book) =>
              editId === book.id ? (
                <tr key={book.id} className="bg-purple-50">
                  <td className="py-2 px-4">
                    <input
                      name="image"
                      value={editForm.image}
                      onChange={handleEditChange}
                      className="border rounded px-2 py-1 w-24"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      className="border rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      name="author"
                      value={editForm.author}
                      onChange={handleEditChange}
                      className="border rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                      className="border rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      name="price"
                      type="number"
                      value={editForm.price}
                      onChange={handleEditChange}
                      className="border rounded px-2 py-1 w-20"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      className="border rounded px-2 py-1"
                    />
                  </td>
                  <td className="py-2 px-4 text-center">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded mr-2 hover:bg-green-700"
                      onClick={() => handleEditSave(book.id)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                      onClick={handleEditCancel}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={book.id} className="hover:bg-purple-50 transition">
                  <td className="py-2 px-4">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-16 h-20 object-cover rounded shadow"
                    />
                  </td>
                  <td className="py-2 px-4 font-semibold">{book.title}</td>
                  <td className="py-2 px-4">{book.author}</td>
                  <td className="py-2 px-4">{book.category}</td>
                  <td className="py-2 px-4 text-purple-700 font-bold">
                    ₹{book.price}
                  </td>
                  <td className="py-2 px-4 max-w-xs truncate">{book.description}</td>
                  <td className="py-2 px-4 text-center">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded mr-2 hover:bg-blue-700"
                      onClick={() => handleEdit(book)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      onClick={() => handleDelete(book.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisplayBooks;