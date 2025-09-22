import React from "react";
import logo from "../assets/logo-PG.png";

export default function Footer() {
  return (
    <footer className="bg-gray-300 text-black py-6 mt-8">
      <div className="container mx-auto px-4 grid md:grid-cols-4 gap-1">

        {/* Logo */}

         <div>
             <a href="/">
                <div id="logo" className="w-[120px] h-[40px]">
                  <img src={logo} alt="PG Finder Logo" className="w-full h-full object-contain"/>
                </div>
             </a>
             <p className="mt-3 ml-3"><span className="block">PG Finder</span>Your Stay, Just a Click Away.</p>
         </div>
        
        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-lg mb-3">Quick Links</h4>
          <ul>
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/listings" className="hover:underline">Listings</a></li>
            <li><a href="/Contact" className="hover:underline">Contact</a></li>
            <li><a href="AboutUs" className="hover:underline">About Us</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-bold text-lg mb-3">Contact</h4>
          <p>Email: info@pgfinder.com</p>
          <p>Phone: +91 9876543210</p>
        </div>

        {/* About */}
        <div>
          <h4 className="font-bold text-lg mb-3">About Us</h4>
          <p className="text-sm max-w-xs">
            PG Finder helps college students find affordable and comfortable
            accommodations near their campus with ease.
          </p>
        </div>
      </div>

      <div className="text-center mt-6 border-t border-blue-400 pt-4 text-sm">
        © 2025 PG Finder. All Rights Reserved.
      </div>
    </footer>
  );
}
