import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/Authcontext";
import { toast } from "react-toastify";

export default function AdminLayout() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-200">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-gray-800 text-white p-6 flex-shrink-0 lg:h-screen lg:sticky top-0">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-gray-400">{user?.name}</p>
        </div>

        {/* Responsive Nav + Logout */}
        <div className="flex flex-col lg:flex-col gap-4">
          {/* Small screen: nav & logout in one row */}
          <div className="flex flex-wrap justify-between items-center gap-4 lg:hidden">
            <nav className="flex flex-wrap gap-4 text-lg">
              <Link
                to="/admin"
                className={location.pathname === "/admin" ? "text-yellow-400" : "hover:text-yellow-400"}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/users"
                className={location.pathname === "/admin/users" ? "text-yellow-400" : "hover:text-yellow-400"}
              >
                Users
              </Link>
              <Link
                to="/admin/orders"
                className={location.pathname === "/admin/orders" ? "text-yellow-400" : "hover:text-yellow-400"}
              >
                Orders
              </Link>
              <Link
                to="/admin/products"
                className={location.pathname === "/admin/products" ? "text-yellow-400" : "hover:text-yellow-400"}
              >
                Products
              </Link>
              <Link
                to="/admin/feedback"
                className={location.pathname === "/admin/feedback" ? "text-yellow-400" : "hover:text-yellow-400"}
              >
                Feedbacks
              </Link>
            </nav>
            <button
              onClick={handleLogout}
              className="ml-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
            >
              Logout
            </button>
          </div>

          {/* Large screen vertical layout */}
          <nav className="hidden lg:flex flex-col gap-3 text-lg">
            <Link
              to="/admin"
              className={location.pathname === "/admin" ? "text-yellow-400" : "hover:text-yellow-400"}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/users"
              className={location.pathname === "/admin/users" ? "text-yellow-400" : "hover:text-yellow-400"}
            >
              Users
            </Link>
            <Link
              to="/admin/orders"
              className={location.pathname === "/admin/orders" ? "text-yellow-400" : "hover:text-yellow-400"}
            >
              Orders
            </Link>
            <Link
              to="/admin/products"
              className={location.pathname === "/admin/products" ? "text-yellow-400" : "hover:text-yellow-400"}
            >
              Products
            </Link>
            <Link
                to="/admin/feedback"
                className={location.pathname === "/admin/feedback" ? "text-yellow-400" : "hover:text-yellow-400"}
              >
                Feedbacks
              </Link>
            <button
              onClick={handleLogout}
              className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
            >
              Logout
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto lg:h-screen">
        <Outlet />
      </main>
    </div>
  );
}
