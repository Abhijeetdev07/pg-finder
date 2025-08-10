import React, { useState } from "react";
import { listings as sampleListings } from "../data/listings";
import ListingCard from "../components/ListingCard";

export default function Listings() {
  const [roomType, setRoomType] = useState("");
  const [budget, setBudget] = useState("");
  const [facilities, setFacilities] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleCheckboxChange = (value) => {
    setFacilities((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  // Filtering
  let filtered = sampleListings.filter((pg) => {
    if (roomType && pg.roomType !== roomType) return false;

    if (budget) {
      const [min, max] = budget.split("-").map(Number);
      if (isNaN(min) || isNaN(max)) return false;
      if (pg.price < min || pg.price > max) return false;
    }

    if (facilities.length && !facilities.every((f) => pg.amenities.includes(f)))
      return false;

    return true;
  });

  // Sorting
  if (sortBy === "low-high") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === "high-low") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } 

  // Sidebar component
  const FilterSidebar = () => (
    <aside className="bg-white shadow rounded p-4 space-y-3 w-full md:w-64">
      <h3 className="text-lg font-bold border-b pb-2 mb-1">Filters</h3>

      <div>
        <h4 className="font-semibold mb-2">Sort By</h4>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="">Default</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Room Type</h4>
        {["Single", "Double", "Triple"].map((type) => (
          <label key={type} className="block cursor-pointer">
            <input
              type="radio"
              name="roomType"
              value={type}
              checked={roomType === type}
              onChange={() => setRoomType(type)}
              className="mr-2 cursor-pointer"
            />
            {type}
          </label>
        ))}
      </div>

      <div>
        <h4 className="font-semibold mb-2">Budget</h4>
        {[
          { label: "₹ 0 - ₹ 5,000", value: "0-5000" },
          { label: "₹ 5,001 - ₹ 8,000", value: "5001-8000" },
          { label: "₹ 8,001 - ₹ 10,000", value: "8001-10000" },
        ].map((b) => (
          <label key={b.value} className="block cursor-pointer">
            <input
              type="radio"
              name="budget"
              value={b.value}
              checked={budget === b.value}
              onChange={() => setBudget(b.value)}
              className="mr-2 cursor-pointer"
            />
            {b.label}
          </label>
        ))}
      </div>

      <div>
        <h4 className="font-semibold mb-2">Facilities</h4>
        {["Wi-Fi", "Meals", "Laundry", "AC"].map((f) => (
          <label key={f} className="block cursor-pointer">
            <input
              type="checkbox"
              value={f}
              checked={facilities.includes(f)}
              onChange={() => handleCheckboxChange(f)}
              className="mr-2 cursor-pointer"
            />
            {f}
          </label>
        ))}
      </div>

      <button
        className="text-sm text-red-500 underline border p-2 rounded"
        onClick={() => {
          setRoomType("");
          setBudget("");
          setFacilities([]);
          setSortBy("");
        }}
      >
        Clear All
      </button>
    </aside>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">PG Listings</h2>
        <button
          className="md:hidden text-sm bg-indigo-600 text-white px-3 py-1 rounded"
          onClick={() => setShowFilters(true)}
        >
          Show Filters
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Desktop sidebar */}
        <div className="hidden md:block w-full md:w-64">
          <div className="sticky top-[100px] self-start">
            <FilterSidebar />
          </div>
        </div>

        {/* Listings area */}
        <div className="flex-1 w-full">
          <div
            style={{ maxHeight: "calc(100vh - 100px)" }}
            className="overflow-auto scrollbar-hide"
          >
            {filtered.length === 0 ? (
              <p className="text-gray-600 p-4">😞 sorry!, Not Available</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-2">
                {filtered.map((pg) => (
                  <ListingCard key={pg.id} data={pg} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter sidebar */}
      <div
        className={`fixed inset-0 z-50 flex md:hidden transition-opacity duration-300 ${
          showFilters ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Background overlay */}
        <div
          className="flex-1 bg-black bg-opacity-50"
          onClick={() => setShowFilters(false)}
        ></div>

        {/* Sidebar */}
        <div
          className={`w-64 bg-white shadow-lg p-4 overflow-y-auto transform transition-transform duration-300 ${
            showFilters ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <button
              className="text-gray-500"
              onClick={() => setShowFilters(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <FilterSidebar />
        </div>
      </div>
    </div>
  );
}
