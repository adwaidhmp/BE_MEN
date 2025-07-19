import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/Authcontext";

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  console.log("AdminRoute user:", user);
  
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;
  

  return children;
}

