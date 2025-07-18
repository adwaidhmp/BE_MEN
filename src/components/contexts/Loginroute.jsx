import { Navigate } from "react-router-dom";
import { useAuth } from "./Authcontext";

const LoginRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    if (user.role?.toLowerCase() === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default LoginRoute;
