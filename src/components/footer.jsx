import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <h2 className="text-xl font-bold mb-4 md:mb-0">BE MEN</h2>

        <div className="flex space-x-6">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-gray-400">Home</Link>
          <Link to="/about" className="hover:text-gray-400">About</Link>
          <Link to="/contact" className="hover:text-gray-400">Contact</Link>
        </div>
      </div>

      <div className="text-center text-sm mt-4 text-gray-400">
        © 2025 BE MEN All rights reserved
        <br />
        Developed by{" "}
        <a
          href="https://www.linkedin.com/in/adwaidh-mp-/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          Adwaidh MP
        </a>
      </div>
    </footer>
  );
}

export default Footer;
