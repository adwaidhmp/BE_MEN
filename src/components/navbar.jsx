import { Link, useLocation } from "react-router-dom";
import {  useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Profile from "./user/profile";
import { Heart, ShoppingCart, User, ShoppingBag, Info } from "lucide-react";

function Navbar() {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };

    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfile]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-gray-900 to-black text-white shadow-lg border-b border-gray-800">
        <div className="max-w-1xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Brand */}
            <div className="flex items-center">
              <Link
                to="/"
                className="text-2xl font-bold tracking-wider hover:text-gray-300 transition-colors"
              >
                BE MEN
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              {/* Products */}
              {location.pathname !== "/home" && (
                <Link
                  to="/home"
                  className="flex items-center gap-2 hover:text-gray-300 transition-colors group"
                >
                  <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline font-medium">Products</span>
                </Link>
              )}

              {/* Wishlist */}
              <Link
                to={user ? "/wishlist" : "/login"}
                className="relative flex items-center gap-2 hover:text-gray-300 transition-colors group"
              >
                <div className="relative">
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {/* {wishlist.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold shadow-lg">
                      {wishlist.length}
                    </span>
                  )} */}
                </div>
                <span className="hidden sm:inline font-medium">Wishlist</span>
              </Link>

              {/* Cart */}
              <Link
                to={user ? "/cart" : "/login"}
                className="relative flex items-center gap-2 hover:text-gray-300 transition-colors group"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {/* {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold shadow-lg">
                      {cart.length}
                    </span>
                  )} */}
                </div>
                <span className="hidden sm:inline font-medium">Cart</span>
              </Link>

              {/* Divider */}
              <div className="hidden md:block w-px h-6 bg-gray-700"></div>

              {/* About Us */}
              <Link
                to="/about"
                className="flex items-center gap-2 hover:text-gray-300 transition-colors group"
              >
                <Info className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline font-medium">About</span>
              </Link>

              {/* Profile or Login */}
              {user ? (
                <button
                  onClick={() => setShowProfile(true)}
                  className="flex items-center gap-2 hover:text-gray-300 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="hidden md:inline font-medium">Profile</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-colors shadow-md"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showProfile && (
        <Profile onClose={() => setShowProfile(false)} profileRef={profileRef} />
      )}
    </>
  );
}

export default Navbar;
