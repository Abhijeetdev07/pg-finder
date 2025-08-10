import React from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaHome, FaPhoneAlt, FaMobileAlt } from "react-icons/fa";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        className="relative h-[80vh] flex items-center justify-center text-center text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1500&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect PG
          </h1>
          <p className="mb-6 text-lg text-gray-200">
            Compare rooms, amenities, and prices – all in one place.
          </p>

          {/* Search bar */}
          <div className="flex bg-white rounded-full overflow-hidden shadow-lg">
            <input
              type="text"
              placeholder="Search PGs near your college..."
              className="flex-grow px-4 py-2 text-gray-800 focus:outline-none"
            />

            <Link
              to="/listings"
              className="bg-blue-600 px-5 flex items-center justify-center hover:bg-blue-700 transition"
            >
              <FaSearch className="text-white text-lg" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition">
          <FaHome className="mx-auto text-blue-600 mb-4" size={40} />
          <h3 className="font-semibold text-lg">Student Focused</h3>
          <p className="text-sm text-gray-600 mt-2">
            Filters for budget, distance, room type, and facilities.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition">
          <FaPhoneAlt className="mx-auto text-blue-600 mb-4" size={40} />
          <h3 className="font-semibold text-lg">Verified Contacts</h3>
          <p className="text-sm text-gray-600 mt-2">
            Contact owners directly from the listing page.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition">
          <FaMobileAlt className="mx-auto text-blue-600 mb-4" size={40} />
          <h3 className="font-semibold text-lg">Responsive</h3>
          <p className="text-sm text-gray-600 mt-2">
            Works smoothly on mobile, tablet, and desktop.
          </p>
        </div>
      </section>
    </div>
  );
}


