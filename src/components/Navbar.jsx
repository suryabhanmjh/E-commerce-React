import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { cartCount, savedCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setIsLoggedIn(loggedIn);
    setCurrentUser(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-purple-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/">📚 OldBookStore</Link>
        </h1>
        <div className="flex items-center gap-4">
          <ul className="flex gap-4 text-lg">
            <li><Link to="/" className="hover:text-yellow-300">Home</Link></li>
            <li><Link to="/books" className="hover:text-yellow-300">Books</Link></li>
            {isLoggedIn && (
              <>
                <li>
                  <Link to="/cart" className="flex items-center gap-1 hover:text-purple-600 transition-colors">
                    🛒
                    {cartCount >= 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link to="/saved" className="flex items-center gap-1 hover:text-purple-600 transition-colors">
                    ❤️
                    {savedCount >= 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {savedCount}
                      </span>
                    )}
                  </Link>
                </li>
                <li><Link to="/profile" className="hover:text-yellow-300">👤 Profile</Link></li>
              </>
            )}
          </ul>
          <div className="flex items-center gap-2">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">
                  Login
                </Link>
                <Link to="/register" className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm">
                  Register
                </Link>
              </>
            ) : (
              <>
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

