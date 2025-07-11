import { useEffect, useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./contexts/Authcontext";


function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { setAuthUser } = useContext(AuthContext);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
      return;
    }

    // Fetch full user data using ID or email if needed
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
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    // setAuthUser(null);
    navigate("/login");
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-24 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

      {user ? (
        <>
          <p className="mb-2"><strong>Name:</strong> {user.name}</p>
          <p className="mb-4"><strong>Email:</strong> {user.email}</p>

          <div className="flex flex-col space-y-2 mb-6">
            <button
              onClick={() => navigate("/wishlist")}
              className="bg-gray-800 text-white py-2 rounded hover:bg-gray-700"
            >
              Go to Wishlist
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="bg-gray-800 text-white py-2 rounded hover:bg-gray-700"
            >
              Go to Cart
            </button>
            <button
              onClick={() => navigate("/orders")}
              className="bg-gray-800 text-white py-2 rounded hover:bg-gray-700"
            >
              Go to Orders
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white py-2 w-full rounded hover:bg-red-500"
          >
            Logout
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Profile;
