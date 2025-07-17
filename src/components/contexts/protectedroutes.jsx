
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./Authcontext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login and preserve current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
