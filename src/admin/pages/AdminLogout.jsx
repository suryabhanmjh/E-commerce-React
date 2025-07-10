import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear admin session/localStorage (if using auth token later)
    localStorage.removeItem("adminLoggedIn");

    // Redirect to login page after 1 second
    setTimeout(() => {
      navigate("/admin/login");
    }, 1000);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="text-2xl font-semibold text-purple-700 mb-2">
          Logging out...
        </div>
        <p className="text-gray-600">Redirecting to login page.</p>
      </div>
    </div>
  );
};

export default AdminLogout;
