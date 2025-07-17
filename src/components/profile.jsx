import { useEffect,useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./contexts/Authcontext";
import { WishlistContext } from "./contexts/wishlistcontext";
import { CartContext } from "./contexts/cartcontext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";




function Profile({ onClose,profileRef }) {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { clearWishlist } = useContext(WishlistContext);
  const { clearCart } = useContext(CartContext);

  

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3001/users");
        const matchedUser = res.data.find(u => u.email === storedUser.email);
        setUser(matchedUser);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    clearWishlist();
    clearCart();
    navigate("/");
    onClose();
    toast.success("Logged out successfully "); 
  };

  return (
    <div ref={profileRef} className="fixed top-0 right-0 h-full w-1/4 bg-gray-200 shadow-lg z-50 p-6 transform transition-transform duration-300">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-xl font-bold text-gray-500 hover:text-black"
      >
        ×
      </button>

      <h2 className="text-2xl font-bold mb-4 mt-8">Profile</h2>

      {user ? (
        <>
          <p className="mb-2"><strong>Name:</strong> {user.name}</p>
          <p className="mb-4"><strong>Email:</strong> {user.email}</p>

          <div className="flex flex-col space-y-2 mb-6">
            <Link to="/orders" onClick={onClose} className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-900 text-center ">
            Orders</Link>
            <Link to="/wishlist" onClick={onClose} className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-900 text-center ">
            Wishlist</Link>
            <Link to="/cart" onClick={onClose} className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-900 text-center ">
            Cart</Link>
          </div>

          <button onClick={handleLogout} className="bg-red-600 text-white py-2 w-full rounded hover:bg-red-500">Logout</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Profile;


