import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      // Check if email already exists
      const usersResponse = await axios.get('https://data-json-nwab.onrender.com/users');
      const emailExists = usersResponse.data.some(user => user.email === form.email);
      
      if (emailExists) {
        alert('Email already exists. Please use a different email.');
        setLoading(false);
        return;
      }

      // Register new user
      const userData = {
        ...form,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };

      await axios.post('https://data-json-nwab.onrender.com/users', userData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 border border-gray-200 rounded-lg shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            name="name" 
            placeholder="Name" 
            value={form.name} 
            onChange={handleChange} 
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
          <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            value={form.email} 
            onChange={handleChange} 
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            value={form.password} 
            onChange={handleChange} 
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors disabled:bg-gray-400 text-sm sm:text-base"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm sm:text-base text-gray-600">
          Already have an account? 
          <span 
            className="text-blue-600 hover:text-blue-700 cursor-pointer ml-1 font-semibold" 
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
