import { useEffect, useState } from "react";
import { useNavigate, Outlet, NavLink } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🔐 Check admin auth on load
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) {
      navigate("/admin/login");
    }
  }, [navigate]);

  // Close sidebar on route change (optional)
  useEffect(() => {
    setSidebarOpen(false);
  }, [navigate]);

  return (
    <div className="flex min-h-screen relative">
      {/* Hamburger menu for mobile */}
      <button
        className="absolute top-4 left-4 z-30 lg:hidden p-2 rounded bg-purple-800 text-white focus:outline-none"
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label="Open sidebar"
      >
        {/* Hamburger icon */}
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar */}
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed z-30 top-0 left-0 h-full w-56 lg:w-64 bg-purple-800 text-white shadow-lg transform transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:static lg:translate-x-0 lg:min-h-screen`}
        style={{ minHeight: "100vh" }}
      >
        <div className="p-4 lg:p-6 border-b border-purple-700 flex items-center justify-between">
          <h2 className="text-lg lg:text-xl font-bold">📚 Admin Dashboard</h2>
          {/* Close button for mobile */}
          <button
            className="lg:hidden p-1 ml-2 text-white"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="p-3 lg:p-4 space-y-2 lg:space-y-3">
          <NavLink to="/admin" end className={navClass}>
            🏠 Dashboard
          </NavLink>
          <NavLink to="/admin/panel" className={navClass}>
            📘 Add Books
          </NavLink>
          <NavLink to="/admin/display-books" className={navClass}>
            📖 Manage Books
          </NavLink>
          <NavLink to="/admin/banners" className={navClass}>
            🖼️ Banners
          </NavLink>
          <NavLink to="/admin/display-banners" className={navClass}>
            👁️ Display Banners
          </NavLink>
          <NavLink to="/admin/user-detail" className={navClass}>
            👥 Users
          </NavLink>
          <NavLink to="/admin/logout" className={navClass}>
            🚪 Logout
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className="flex-1 p-3 sm:p-6 bg-gray-50 overflow-y-auto lg:ml-0"
        style={{ marginLeft: 0 }}
      >
        {/* Add top padding for mobile to avoid hamburger overlap */}
        <div className="lg:hidden h-14" />
        <Outlet />
      </main>
    </div>
  );
};

const navClass = ({ isActive }) =>
  `block px-3 lg:px-4 py-2 rounded hover:bg-purple-700 transition text-sm lg:text-base ${
    isActive ? "bg-purple-700 font-semibold" : "bg-purple-600"
  }`;

export default AdminLayout;
