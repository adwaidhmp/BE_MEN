import React from 'react';

function Aboutus() {
  return (
    <div className="bg-gray-100 min-h-screen px-6 py-20 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>

        <p className="text-lg mb-6">
          <span className="font-semibold text-black">BE MEN</span> is more than just a store — it's a lifestyle destination for modern men who take pride in style, detail, and confidence.
        </p>

        <p className="text-lg mb-6">
          At <span className="font-semibold text-black">BE MEN</span>, we specialize in curating high-quality men’s accessories that elevate your everyday look. From <strong>sunglasses</strong> and <strong>caps</strong> to <strong>watches</strong>, <strong>leather belts</strong>, <strong>wallets</strong>, <strong>rings</strong>, <strong>chains</strong>, and <strong>body sprays</strong> — we’ve got everything to define your signature style.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Why Choose BE MEN?</h2>
        <ul className="list-disc list-inside text-lg mb-6 space-y-2">
          <li>Handpicked premium accessories made for style and durability</li>
          <li>A modern blend of functionality and fashion</li>
          <li>Perfect pieces for gifting or personal use</li>
          <li>Designed for confident men who value self-expression</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
        <p className="text-lg mb-6">
          To redefine men’s fashion by making premium accessories accessible, expressive, and an essential part of every man’s wardrobe.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Vision</h2>
        <p className="text-lg">
          To be the go-to destination for men who want to look sharp, feel fresh, and stay ahead in style — effortlessly.
        </p>
      </div>
    </div>
  );
}

export default Aboutus;
