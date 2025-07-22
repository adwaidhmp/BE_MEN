import { useEffect, useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./contexts/Authcontext";
import { WishlistContext } from "./contexts/wishlistcontext";
import { CartContext } from "./contexts/cartcontext";
import { toast } from "react-toastify";

function Profile({ onClose, profileRef }) {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { clearWishlist } = useContext(WishlistContext);
  const { clearCart } = useContext(CartContext);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", password: "" });

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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = {
        name: editForm.name || user.name,
        email: editForm.email || user.email,
        password: editForm.password || user.password,
      };
      await axios.patch(`http://localhost:3001/users/${user.id}`, updated);
      toast.success("Profile updated!");
      setUser({ ...user, ...updated });
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update profile");
    }
  };

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

      {/* <h2 className="text-3xl font-bold mb-6 mt-8 text-center tracking-wide drop-shadow">
        Profile
      </h2> */}

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
            <form onSubmit={handleEditSubmit} className="space-y-3 mb-6">
              <input
                name="name"
                placeholder="New Name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 bg-white/40 border border-cyan-400 rounded text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              />
              <input
                name="email"
                placeholder="New Email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-3 py-2 bg-white/40 border border-cyan-400 rounded text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              />
              <input
                name="password"
                type="password"
                placeholder="New Password"
                value={editForm.password}
                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                className="w-full px-3 py-2 bg-white/40 border border-cyan-400 rounded text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              />
              <button
                type="submit"
                className="w-full bg-cyan-500/30 border border-cyan-400 text-black py-2 px-4 rounded hover:bg-cyan-600/40 hover:shadow-[0_0_10px_rgba(0,255,255,0.5)] transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditForm({
                    name: user.name || "",
                    email: user.email || "",
                    password: user.password || "",
                  });
                }}
                className="w-full bg-gray-500/30 border border-gray-400 text-black py-2 px-4 rounded hover:bg-gray-600/40 hover:shadow transition"
              >
                Cancel
              </button>
            </form>
          ) : (
            <>
              <div className="flex flex-col space-y-2 mb-6">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setEditForm({ name: "", email: "", password: "" });
                  }}
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
