// components/AdminLayout.jsx
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/Authcontext";
import { toast } from "react-toastify";

export default function AdminLayout() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen flex  bg-gray-200">
      {/* Sidebar (fixed and full height) */}
      <aside className="fixed top-0 left-0 w-64 h-screen bg-gray-800 text-white p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-gray-400">{user?.name}</p>
        </div>
        <nav className="flex flex-col gap-3 text-lg">
          <Link to="/admin" className={location.pathname === "/admin" ? "text-yellow-400" : "hover:text-yellow-400"}>Dashboard</Link>
          <Link to="/admin/users" className={location.pathname === "/admin/users" ? "text-yellow-400" : "hover:text-yellow-400"}>Users</Link>
          <Link to="/admin/orders" className={location.pathname === "/admin/orders" ? "text-yellow-400" : "hover:text-yellow-400"}>Orders</Link>
          <Link to="/admin/products" className={location.pathname === "/admin/products" ? "text-yellow-400" : "hover:text-yellow-400"}>Products</Link>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-10 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          Logout
        </button>
      </aside>

      {/* Main content area that scrolls */}
      <main className="ml-64 w-full p-6 overflow-y-auto max-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
