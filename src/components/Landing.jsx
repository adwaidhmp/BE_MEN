import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Footer from "./footer";

export default function Landing() {
  return (
    
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-black  text-white font-sans">
        <div className="absolute top-6 right-6 z-20">
        <Link
          to="/login"
          className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-200 transition"
        >
          Login
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative bg-[url('/images/hero-bg.jpg')] bg-cover bg-center h-screen flex items-center justify-center">
        <div className="bg-gradient-to-r from-gray-900 to-black w-full h-full absolute top-0 left-0 z-0" />
        <div className="z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">BE MEN</h1>
          <p className="text-xl md:text-2xl mb-6">Unleash Your Masculine Style</p>
          <Link
            to="/home"
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
          >
            Explore Products <ArrowRight />
          </Link>
        </div>
      </div>
      <hr></hr>
      <Footer/>
    </div>
  );
}
