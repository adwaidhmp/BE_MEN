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
  const [formData, setFormData] = useState({ name: "", email: "", profilePicture: "" });

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
        setFormData({
          name: matchedUser.name,
          email: matchedUser.email,
          profilePicture: matchedUser.profilePicture || "",
        });
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


  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.patch(`http://localhost:3001/users/${user.id}`, formData);
      setUser(res.data);
      sessionStorage.setItem("user", JSON.stringify(res.data));
      setIsEditing(false);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Error updating profile.");
      console.error(err);
    }
  };

  return (
    <div
      ref={profileRef}
      className="fixed top-0 right-0 h-full w-full sm:w-1/3 md:w-1/4 bg-gray-200 shadow-lg z-50 p-6 transform transition-transform duration-300"
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-xl font-bold text-gray-500 hover:text-black"
      >
        ×
      </button>

      <h2 className="text-2xl font-bold mb-6 mt-8 text-center">Profile</h2>

      {user ? (
        <>
          {/* 👤 Profile Image */}
          <div className="flex justify-center mb-4">
            <img
              src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSLU5_eUUGBfxfxRd4IquPiEwLbt4E_6RYMw&s"}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
            />
          </div>

          {isEditing ? (
            <div className="space-y-2 mb-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="w-full px-3 py-1 rounded border"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full px-3 py-1 rounded border"
              />
              <input
                type="text"
                name="profilePicture"
                value={formData.profilePicture}
                onChange={handleInputChange}
                placeholder="Profile Picture URL"
                className="w-full px-3 py-1 rounded border"
              />
              <div className="flex justify-between">
                <button onClick={handleSave} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                  Save
                </button>
                <button onClick={handleEditToggle} className="text-gray-600 hover:text-red-500">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* 👤 Info */}
              <div className="text-center mb-4">
                <p className="mb-1 text-lg font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>

              {/* ✏️ Edit button */}
              <div className="flex justify-center mb-6">
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              </div>
            </>
          )}

          {/* 📦 Links */}
          <div className="flex flex-col space-y-2 mb-6">
            <Link
              to="/orders"
              onClick={onClose}
              className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-900 text-center"
            >
              Orders
            </Link>
            <Link
              to="/wishlist"
              onClick={onClose}
              className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-900 text-center"
            >
              Wishlist
            </Link>
            <Link
              to="/cart"
              onClick={onClose}
              className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-900 text-center"
            >
              Cart
            </Link>
          </div>

          {/* 🔓 Logout */}
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white py-2 w-full rounded hover:bg-red-500"
          >
            Logout
          </button>
        </>
      ) : (
        <p className="text-center text-gray-600">Loading...</p>
      )}
    </div>
  );
}

export default Profile;
