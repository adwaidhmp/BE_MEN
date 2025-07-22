import { Link, useLocation, useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useContext, useState, useEffect, useRef } from "react";
import { WishlistContext } from "./contexts/wishlistcontext";
import { CartContext } from "./contexts/cartcontext";
import { useAuth } from "./contexts/Authcontext";
import Profile from "./profile";

function Navbar() {
  const location = useLocation();
  const { wishlist } = useContext(WishlistContext);
  const { cart } = useContext(CartContext);
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
  const [srch, setsearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (srch.trim()) {
      navigate(`/home?search=${encodeURIComponent(srch)}`);
      setsearch("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };

    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfile]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-gray-300 text-black px-4 py-3 flex flex-col md:flex-row items-center justify-between shadow-md">
        {/* Brand */}
        <div className="text-xl font-bold mb-2 md:mb-0">
          <Link to="/">BE MEN</Link>
        </div>

        {/* Search */}
        <div className="flex items-center w-full md:w-auto md:absolute md:left-1/2 md:translate-x-[-50%] mb-2 md:mb-0">
          <input
            type="text"
            placeholder="Search"
            className="flex-grow md:w-60 px-4 py-1 rounded-full bg-white text-black border border-gray-400"
            value={srch}
            onChange={(e) => setsearch(e.target.value)}
          />
          <button
            type="submit"
            className="ml-2 p-1.5 flex items-center justify-center rounded-full text-black cursor-pointer"
            onClick={handleSearch}
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Main Links Area */}
        <div className="flex justify-between w-full md:w-auto items-center md:space-x-6 flex-wrap">
          {/* Left: Wishlist + Cart */}
          <div className="flex items-center space-x-4 order-2 md:order-2">


            {/* Products */}
            {location.pathname !== "/home" && (
              <Link to="/home" className="hover:text-gray-600 md:mr-4">
                Products
              </Link>
            )}

            {/* Wishlist */}
            <div className="relative">
              <Link to={user ? "/wishlist" : "/login"} className="hover:text-gray-600">
                ❤️
              </Link>
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </div>

            {/* Cart */}
            <div className="relative">
              <Link to={user ? "/cart" : "/login"} className="hover:text-gray-600">
                🛒
              </Link>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </div>
          </div>

          {/* Right: Profile + About */}
          <div className="flex items-center space-x-4 order-3 md:order-3 ml-auto">
            {/* Profile or Login */}
            {user ? (
              <button onClick={() => setShowProfile(true)} className="hover:text-gray-600">
                👤
              </button>
            ) : (
              <Link to="/login" className="hover:text-gray-600">
                Login
              </Link>
            )}

            {/* About us */}
            <Link to="/about" className="hover:text-gray-600">
              About us
            </Link>
          </div>
        </div>
      </nav>

      {showProfile && <Profile onClose={() => setShowProfile(false)} profileRef={profileRef} />}
    </>
  );
}

export default Navbar;
