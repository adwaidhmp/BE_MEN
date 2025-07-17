import { Link, useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useContext } from "react";
import { WishlistContext } from "./contexts/wishlistcontext";
import { CartContext } from "./contexts/cartcontext";
import { useAuth } from "./contexts/Authcontext";
import { useState } from "react";
import Profile from "./profile";
import { useRef, useEffect } from "react";


function Navbar() {
  const {wishlist}=useContext(WishlistContext)
  const { cart } = useContext(CartContext);
  const {user}=useAuth()
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
    const [srch,setsearch] =useState("")
      const navigate = useNavigate();
  console.log(srch)

    const handleSearch = () => {
      navigate(`/?search=${encodeURIComponent(srch)}`);
      setsearch("")
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
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-300 text-black p-4 flex justify-between items-center">
      {/* Left - Logo or Brand */}
      <div className="text-xl font-bold">
        <Link to="/">BE MEN</Link>
      </div>

      {/* Middle - Search */}
      <div className="flex absolute left-40 ">
        <input
          type="text"
          placeholder="Search"
          className="w-50 px-4 py-0.5 rounded-full bg-white text-black border border-gray-400"
          onChange={(e)=>(setsearch(e.target.value))}
        />
        <button
         type="submit"
        className="p-1.5 flex items-center justify-center rounded-full text-black cursor-pointer"
        onClick={handleSearch}
        >
        <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Right - Links */}
      <div className="flex space-x-6">
       
        <Link to="/" className="hover:text-gray-600">Home</Link>
        

        {/* Wishlist with count */}
        <div className="relative">
          <Link to= {user ? "/wishlist" : "/login"} className="hover:text-gray-600">❤️</Link>
          {wishlist.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-3 h-3 flex items-center justify-center rounded-full">
              {wishlist.length}
            </span>
          )}
        </div>

        <div className="relative">
       <Link to={user ? "/cart" : "/login"} className="hover:text-gray-600">🛒</Link>
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-xs w-3 h-3 flex items-center justify-center rounded-full">
         {cart.length}
          </span>
        )}
          </div>


        
        {user ? (
        <button  className="hover:text-gray-600" onClick={()=>setShowProfile(true)} >👤</button>
        ) : (
        <Link to="/login" className="hover:text-gray-600 ">Login</Link>
        )}

         <Link to="/about" className="hover:text-gray-600">About us</Link>
      </div>
    </nav>
    {showProfile ? <Profile onClose={() => setShowProfile(false)} profileRef={profileRef} /> : null}
    </>
  );
}

export default Navbar;
