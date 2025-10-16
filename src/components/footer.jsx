import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-black text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-4">
          {/* Brand Info */}
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2 text-white">BE MEN</h3>
            <p className="text-gray-400 text-sm max-w-xs">
              Your ultimate destination for premium men's accessories
            </p>
          </div>
          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white transition duration-300 cursor-pointer">Contact Us</li>
              <li className="hover:text-white transition duration-300 cursor-pointer">Shipping Info</li>
              <li className="hover:text-white transition duration-300 cursor-pointer">Returns</li>
              <li className="hover:text-white transition duration-300 cursor-pointer">FAQ</li>
            </ul>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-3 text-center text-gray-500 text-xs">
          © 2025 BE MEN. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;