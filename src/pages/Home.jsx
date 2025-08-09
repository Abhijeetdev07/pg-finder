import React from "react";
import { Link } from "react-router-dom";

/**
 * Home: hero + basic search UI (non-backend)
 */
export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="bg-white rounded-lg shadow p-8 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Find the perfect PG near your college</h1>
        <p className="text-gray-600 mb-6">Search and compare rooms, amenities and prices tailored for students.</p>

        {/* Search bar (client-side only for now) */}
        {/* <div className="flex flex-col md:flex-row gap-3">
          <input type="text" placeholder="Search by city / college / area" className="flex-1 border rounded px-3 py-2" />
          <select className="border rounded px-3 py-2 w-40">
            <option>Any budget</option>
            <option>₹ 3,000 - ₹ 6,000</option>
            <option>₹ 6,000 - ₹ 10,000</option>
          </select>
          <Link to="/listings" className="bg-indigo-600 text-white px-4 py-2 rounded">Search</Link>
        </div> */}
      </section>

      {/* Quick intro / features */}
      <section className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold">Student focused</h3>
          <p className="text-sm text-gray-600">Filters for budget, distance, room type and facilities.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold">Verified contacts</h3>
          <p className="text-sm text-gray-600">Contact owners directly from the listing page.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold">Responsive</h3>
          <p className="text-sm text-gray-600">Works smoothly on mobile, tablet and desktop.</p>
        </div>
      </section>
    </div>
  );
}
