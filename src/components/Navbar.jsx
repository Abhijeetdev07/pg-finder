import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const linkClasses = ({ isActive }) =>
    `hover:text-indigo-600 transition-colors ${
      isActive ? "text-indigo-600 border-b-2 border-indigo-600" : ""
    }`;

  return (
    <header className="sticky top-0 bg-white shadow z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3">
          <div id="logo" className="w-[120px] h-[40px]">
            <img
              src="./src/assets/logo-PG.png"
              alt="PG Finder Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 items-center text-[16px]">
          <NavLink to="/" className={linkClasses}>
            Home
          </NavLink>
          <NavLink to="/listings" className={linkClasses}>
            Listings
          </NavLink>
          <NavLink to="/Contact" className={linkClasses}>
            Contact
          </NavLink>
          <NavLink to="/AboutUs" className={linkClasses}>
            About Us
          </NavLink>
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

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-white border-t overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-4 py-3 gap-2 text-[16px]">
          <NavLink to="/" onClick={() => setIsOpen(false)} className="hover:text-indigo-600">
            Home
          </NavLink>
          <NavLink to="/listings" onClick={() => setIsOpen(false)} className="hover:text-indigo-600">
            Listings
          </NavLink>
          <NavLink to="/Contact" onClick={() => setIsOpen(false)} className="hover:text-indigo-600">
            Contact
          </NavLink>
          <NavLink to="/AboutUs" onClick={() => setIsOpen(false)} className="hover:text-indigo-600">
            About Us
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
