import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user); // get user from Redux
  const location = useLocation();

  if (!user) {
    // Redirect to login if not logged in and preserve current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.is_staff) {
    // Redirect admins to /admin
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
