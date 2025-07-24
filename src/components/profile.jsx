import { useEffect, useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./contexts/Authcontext";
import { WishlistContext } from "./contexts/wishlistcontext";
import { CartContext } from "./contexts/cartcontext";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

function Profile({ onClose, profileRef }) {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { clearWishlist } = useContext(WishlistContext);
  const { clearCart } = useContext(CartContext);
  const [showPassword, setShowPassword] = useState(false);


  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3001/users");
        const matchedUser = res.data.find((u) => u.email === storedUser.email);
        setUser(matchedUser);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try {
      await axios.patch(`http://localhost:3001/users/${user.id}`, { active: false });
      sessionStorage.removeItem("user");
      setUser(null);
      clearWishlist();
      clearCart();
      navigate("/");
      onClose();
      toast.success("Logged out successfully");
    } catch (err) {
      console.error("Failed to logout:", err);
      toast.error("Logout failed");
    }
  };

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: user?.password||"",
    },
    enableReinitialize: true, // Important: Reset form when user data changes
    validationSchema: Yup.object({
      name: Yup.string().min(2, "Name must be at least 2 characters"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters"),
    }),
    onSubmit: async (values) => {
      try {
        await axios.patch(`http://localhost:3001/users/${user.id}`, values);
        toast.success("Profile updated!");
        setUser({ ...user, ...values });
        setIsEditing(false);
      } catch (err) {
        console.error("Update failed:", err);
        toast.error("Failed to update profile");
      }
    },
  });

  return (
    <div
      ref={profileRef}
      className="fixed top-0 right-0 h-full w-full sm:w-1/3 md:w-1/4 bg-white/10 backdrop-blur-lg border-l border-white/20 shadow-2xl z-50 p-6 transform transition-transform duration-300 text-black"
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-2xl font-bold text-black hover:text-red-500"
      >
        ×
      </button>

      {user ? (
        <>
          {/* 👤 Profile Image */}
          <div className="flex justify-center pt-25 mb-4">
            <img
              src={
                user.profilePicture ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSLU5_eUUGBfxfxRd4IquPiEwLbt4E_6RYMw&s"
              }
              alt="Profile"
              className="w-24 h-24 rounded-full border border-cyan-500 shadow-[0_0_20px_rgba(0,255,255,0.4)] object-cover"
            />
          </div>

          <div className="text-center mb-6">
            <p className="mb-1 text-xl font-semibold">{user.name}</p>
            <p className="text-sm text-gray-700 ">{user.email}</p>
          </div>

          {isEditing ? (
            <form onSubmit={formik.handleSubmit} className="space-y-3 mb-6">
              <input
                name="name"
                placeholder="New Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 bg-white/40 border border-cyan-400 rounded text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-600 text-sm">{formik.errors.name}</p>
              )}

              <input
                name="email"
                placeholder="New Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 bg-white/40 border border-cyan-400 rounded text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-600 text-sm">{formik.errors.email}</p>
              )}
              <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 bg-white/40 border border-cyan-400 rounded text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-700 hover:text-black"
              >
                {showPassword ? "🔒" : "👀"}
              </button> 
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-600 text-sm">{formik.errors.password}</p>
              )}

              <button
                type="submit"
                className="w-full bg-cyan-500/30 border border-cyan-400 text-black py-2 px-4 rounded hover:bg-cyan-600/40 hover:shadow-[0_0_10px_rgba(0,255,255,0.5)] transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-full bg-gray-500/30 border border-gray-400 text-black py-2 px-4 rounded hover:bg-gray-600/40 hover:shadow transition"
              >
                Cancel
              </button>
            </form>
          ) : (
            <>
              <div className="flex flex-col space-y-2 mb-6">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white/20 border border-purple-400 text-black py-2 px-4 rounded hover:bg-white/30 hover:shadow transition"
                >
                  Edit Profile
                </button>
                <Link
                  to="/orders"
                  onClick={onClose}
                  className="bg-white/20 border border-cyan-500 text-black py-2 px-4 rounded text-center hover:bg-white/30 hover:shadow transition"
                >
                  Orders
                </Link>
                <Link
                  to="/wishlist"
                  onClick={onClose}
                  className="bg-white/20 border border-cyan-500 text-black py-2 px-4 rounded text-center hover:bg-white/30 hover:shadow transition"
                >
                  Wishlist
                </Link>
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="bg-white/20 border border-cyan-500 text-black py-2 px-4 rounded text-center hover:bg-white/30 hover:shadow transition"
                >
                  Cart
                </Link>
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-500/30 border border-red-400 text-black py-2 w-full rounded hover:bg-red-600/40 hover:shadow transition"
              >
                Logout
              </button>
            </>
          )}
        </>
      ) : (
        <p className="text-center text-black">Loading...</p>
      )}
    </div>
  );
}

export default Profile;
