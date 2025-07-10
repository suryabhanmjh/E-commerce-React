import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin");
  return isAdmin === "true" ? children : <Navigate to="/admin/login" />;
};

export default AdminProtectedRoute;
