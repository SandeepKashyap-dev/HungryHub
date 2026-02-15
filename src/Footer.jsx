import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">

        
        <div>
          <h2 className="text-2xl font-bold text-white">HungryHub</h2>
          <p className="mt-3 text-sm">
            Order delicious food from your favorite restaurants and get it
            delivered fast at your doorstep.
          </p>
        </div>

        
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-orange-400">Home</Link></li>
            <li><Link to="/cart" className="hover:text-orange-400">Cart</Link></li>
            <li><Link to="/login" className="hover:text-orange-400">Login</Link></li>
            <li><Link to="/register" className="hover:text-orange-400">Register</Link></li>
          </ul>
        </div>

    
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Categories</h3>
          <ul className="space-y-2">
            <li>Burger</li>
            <li>Pizza</li>
            <li>Biryani</li>
            <li>Chinese</li>
          </ul>
        </div>

        
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
          <p>📍 Kurukshetra, India</p>
          <p>📞 +91 70564 11186</p>
          <p>✉ hungryhub@gmail.com</p>
        </div>

      </div>

      
      <div className="border-t border-gray-700 text-center py-4 text-sm">
        © {new Date().getFullYear()} HungryHub. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;
