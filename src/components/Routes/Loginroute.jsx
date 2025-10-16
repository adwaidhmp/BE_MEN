import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const LoginRoute = ({ children }) => {
  // Get user from Redux auth slice
  const user = useSelector((state) => state.auth.user);

  if (user) {
    if (user.role?.toLowerCase() === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default LoginRoute;
