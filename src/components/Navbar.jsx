
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi"; // Added HiX for cross icon

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 bg-white shadow z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div id="logo" className="w-[120px] h-[40px]">
            <img
              src="./src/assets/logo-PG.png"
              alt="PG Finder Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 items-center text-[16px]">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <Link to="/listings" className="hover:text-indigo-600">Listings</Link>
          <Link to="/Contact" className="hover:text-indigo-600">Contact</Link>
          <Link to="/AboutUs" className="hover:text-indigo-600">About Us</Link>
        </nav>

        {/* Mobile toggle button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            className="p-2 text-2xl transition-transform duration-100"
          >
            {isOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </div>

      {/* Mobile menu with slide-down animation */}
      <div
        className={`md:hidden bg-white border-t overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-4 py-3 gap-2 text-[16px]">
          <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-indigo-600">
            Home
          </Link>
          <Link to="/listings" onClick={() => setIsOpen(false)} className="hover:text-indigo-600">
            Listings
          </Link>
          <Link to="/Contact" onClick={() => setIsOpen(false)} className="hover:text-indigo-600">
            Contact
          </Link>
          <Link to="/AboutUs" onClick={() => setIsOpen(false)} className="hover:text-indigo-600">
            About Us
          </Link>
        </nav>
      </div>
    </header>
  );
}

