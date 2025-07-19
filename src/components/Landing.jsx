import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Footer from "./footer";

export default function Landing() {
  return (
    
    <div className="min-h-screen bg-black text-white font-sans">
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
        <div className="bg-black/60 w-full h-full absolute top-0 left-0 z-0" />
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

      {/* Categories Section */}
      <section className="py-20 px-6 md:px-20 bg-black">
        <h2 className="text-4xl font-bold text-center mb-12">Our Collections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
          {[
            { name: "Sunglasses",  image: "landimage/pl(1).png" },
            { name: "Watches", image: "landimage/rc3.jpg" },
            { name: "Perfume", image: "landimage/dior.jpg" },
            { name: "Chains", image: "landimage/tiffany&co.png" },
            { name: "Caps", image: "landimage/off(1).jpg" },
            { name: "Belt", image: "landimage/vrc(3).png" },
          ].map((item) => (
            <Link
              to="/home"
              key={item.name}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:scale-105 transition-transform"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-64 object-cover opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-white">{item.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer/>
    </div>
  );
}
