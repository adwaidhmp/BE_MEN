import React from 'react';
import { Shield, Award, Heart, TrendingUp } from 'lucide-react';

function Aboutus() {
  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-slate-900/40"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-32 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-amber-600/20 backdrop-blur-sm rounded-full border border-amber-600/30">
            <span className="text-amber-400 text-sm font-semibold tracking-wider">EST. 2024</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 bg-clip-text text-transparent">
            BE MEN
          </h1>
          <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Where style meets substance. Redefining men's accessories for the modern gentleman.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-300 text-lg mb-4 leading-relaxed">
              <span className="font-bold text-amber-400">BE MEN</span> isn't just another accessories store. We're a movement built on the belief that every detail matters when it comes to personal style.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Born from a passion for quality craftsmanship and timeless design, we curate pieces that don't just complement your outfit—they complete your identity. From the boardroom to weekend adventures, we've got you covered.
            </p>
          </div>
          <div className="bg-gradient-to-br from-amber-600/10 to-slate-800/50 p-8 rounded-2xl border border-amber-600/20 backdrop-blur-sm">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-600/20 p-3 rounded-lg">
                  <Shield className="text-amber-400" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Premium Quality</h3>
                  <p className="text-gray-400">Handpicked accessories built to last</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-amber-600/20 p-3 rounded-lg">
                  <TrendingUp className="text-amber-400" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Trend-Forward</h3>
                  <p className="text-gray-400">Always ahead of the style curve</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-amber-600/20 p-3 rounded-lg">
                  <Award className="text-amber-400" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Signature Style</h3>
                  <p className="text-gray-400">Define your unique presence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collection Showcase */}
      <div className="bg-gradient-to-b from-slate-800/50 to-transparent py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4 text-center">Our Collection</h2>
          <p className="text-gray-400 text-center mb-12 text-lg">Everything you need to elevate your everyday</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Sunglasses', 'Watches', 'Leather Belts', 'Wallets', 'Caps', 'Rings', 'Chains', 'Body Sprays'].map((item, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 border border-slate-700/50 hover:border-amber-600/50 transition-all duration-300 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/0 to-amber-600/0 group-hover:from-amber-600/10 group-hover:to-transparent transition-all duration-300"></div>
                <p className="relative text-center font-semibold text-lg">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-amber-600/10 via-slate-800/30 to-transparent p-10 rounded-2xl border border-amber-600/20">
            <div className="bg-amber-600/20 w-12 h-12 rounded-full flex items-center justify-center mb-6">
              <Heart className="text-amber-400" size={24} />
            </div>
            <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              To redefine men's fashion by making premium accessories accessible, expressive, and an essential part of every man's wardrobe. We believe style is personal, powerful, and worth investing in.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-700/30 via-slate-800/30 to-transparent p-10 rounded-2xl border border-slate-700/50">
            <div className="bg-slate-700/50 w-12 h-12 rounded-full flex items-center justify-center mb-6">
              <TrendingUp className="text-gray-300" size={24} />
            </div>
            <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              To be the go-to destination for men who refuse to compromise on style. We're building a community of confident individuals who understand that the right accessories don't just complete an outfit—they tell a story.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-amber-600/20 to-slate-900/40 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Define Your Style?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of men who've elevated their everyday with BE MEN
          </p>
          <button className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-600/30"
          onClick={() => window.location.href = '/home'}>
            Shop Collection
          </button>
        </div>
      </div>

      {/* Footer Placeholder */}
      <div className="bg-slate-900 py-8 text-center text-gray-500 border-t border-slate-800">
        <p>© 2024 BE MEN. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Aboutus;