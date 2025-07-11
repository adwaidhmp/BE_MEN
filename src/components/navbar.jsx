import { Link } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-300 text-black p-4 flex justify-around items-center">
      {/* Left - Logo or Brand */}
      <div className="text-xl font-bold">
        <Link to="/">BE MEN</Link>
      </div>

      {/* Middle - Search */}
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Search"
          className="w-50 px-4 py-0.5 rounded-full bg-white text-black border border-gray-400"
        />
        <button type="submit"className="px-2 py-1.5  rounded-full text-black hover:bg-gray-400 cursor-pointer "> 
          <MagnifyingGlassIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Right - Links */}
      <div className="flex space-x-6">
        <Link to="/" className="hover:text-gray-600">Home</Link>
        <Link to="/about" className="hover:text-gray-600">About</Link>
        <Link to="/wishlist" className="hover:text-gray-600">Wishlist</Link>
        <Link to="/cart" className="hover:text-gray-600">Cart</Link>
        <Link to="/orders " className="hover:text-gray-600">Orders</Link>
        <Link to="/login" className="hover:text-gray-600">Login</Link>
        <Link to="/profile" className="hover:text-gray-600">Profile</Link>
        
      </div>
    </nav>
  );
}

export default Navbar;
