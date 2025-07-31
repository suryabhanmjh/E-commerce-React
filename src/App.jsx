import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Admin Pages
import AdminLogin from './admin/pages/AdminLogin';
import AdminPanel from './admin/pages/AdminPanel';
import AdminBanners from './admin/pages/AdminBanners';
import AdminLogout from './admin/pages/AdminLogout';
import Dashboard from './admin/pages/Dashboard';
import DisplayBooks from './admin/pages/DisplayBooks';
import DisplayBanners from './admin/pages/DisplayBanners';

import AdminProtectedRoute from './components/AdminProtectedRoute';

// User Pages
import Home from './user/pages/Home';
import Books from './user/pages/Books';
import BookDetails from './user/pages/BookDetails';
import Cart from './user/pages/Cart';
import Checkout from './user/pages/Checkout';
import ConfirmOrder from './user/pages/ConfirmOrder';
import Saved from './user/pages/Saved';
import Register from './user/pages/Register';
import Login from './user/pages/Login';
import ProfilePage from './user/pages/ProfilePage';
import UserDetail from './admin/pages/UserDetail';

function App() {
  return (
    <Router>
      <Routes>
        {/* User Side */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirm-order" element={<ConfirmOrder />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Admin Side */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Layout + Protected Routes  */}
        <Route path="/admin" element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="panel" element={<AdminPanel />} />
          <Route path="display-books" element={<DisplayBooks />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="display-banners" element={<DisplayBanners />} />
          <Route path="logout" element={<AdminLogout />} />
          <Route path="user-detail" element={<UserDetail />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<div className="text-center text-2xl p-10">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;