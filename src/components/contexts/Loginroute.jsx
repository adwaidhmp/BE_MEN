import { Navigate } from "react-router-dom";
import { useAuth } from "./Authcontext";

const LoginRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default LoginRoute;
