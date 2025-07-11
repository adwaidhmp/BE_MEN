import { Link } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useContext } from "react";
import { WishlistContext } from "./contexts/wishlistcontext";
import { CartContext } from "./contexts/cartcontext";
import { useAuth } from "./contexts/Authcontext";



function Navbar() {
  const {wishlist}=useContext(WishlistContext)
  const { cart } = useContext(CartContext);
  const {user}=useAuth()
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-300 text-black p-4 flex justify-around items-center">
      {/* Left - Logo or Brand */}
      <div className="text-xl font-bold">
        <Link to="/">BE MEN</Link>
      </div>

      {/* Middle - Search */}
      <div className="flex space-x-2 max-w-scren">
        <input
          type="text"
          placeholder="Search"
          className="w-50 px-4 py-0.5 rounded-full bg-white text-black border border-gray-400"
        />
        <button
         type="submit"
        className="p-1.5 flex items-center justify-center rounded-full text-black hover:bg-gray-400 cursor-pointer"
        >
        <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Right - Links */}
      <div className="flex space-x-6">
        <Link to="/" className="hover:text-gray-600">Home</Link>
        <Link to="/about" className="hover:text-gray-600">About</Link>

        {/* Wishlist with count */}
        <div className="relative">
          <Link to= {user ? "/wishlist" : "/login"} className="hover:text-gray-600">Wishlist</Link>
          {wishlist.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-3 h-3 flex items-center justify-center rounded-full">
              {wishlist.length}
            </span>
          )}
        </div>

        <div className="relative">
  <Link to={user ? "/cart" : "/login"} className="hover:text-gray-600">Cart</Link>
  {cart.length > 0 && (
    <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-xs w-3 h-3 flex items-center justify-center rounded-full">
      {cart.length}
    </span>
  )}
</div>


        <Link to={user ? "/orders" : "/login"}className="hover:text-gray-600">Orders</Link>
        <Link to={user ? "/profile" : "/login"} className="hover:text-gray-600">Login</Link>
        <Link to="/profile" className="hover:text-gray-600">Profile</Link>
        
      </div>
    </nav>
  );
}

export default Navbar;
