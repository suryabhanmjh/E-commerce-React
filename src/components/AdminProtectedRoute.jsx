import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("adminLoggedIn");
  
  if (isLoggedIn !== "true") {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

export default AdminProtectedRoute;
