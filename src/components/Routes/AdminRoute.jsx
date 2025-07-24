import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/Authcontext";
import NoAccess from "../no access";

export default function AdminRoute({ children }) {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
    if (user.role !== "admin") {
    return <NoAccess />;
  }
  
  return children;
}

