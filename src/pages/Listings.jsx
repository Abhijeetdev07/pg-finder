import React, { useState } from "react";
import { listings as sampleListings } from "../data/listings";
import ListingCard from "../components/ListingCard";// Assuming you have a CSS file for styles
export default function Listings() {
  const [roomType, setRoomType] = useState("");
  const [budget, setBudget] = useState("");
  const [facilities, setFacilities] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleCheckboxChange = (value) => {
    setFacilities((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  // Filtering
  let filtered = sampleListings.filter((pg) => {
    if (roomType && pg.roomType !== roomType) return false;

    if (budget) {
      const [min, max] = budget.split("-").map(Number);
      if (isNaN(min) || isNaN(max)) return false;
      if (pg.price < min || pg.price > max) return false;
    }

    if (facilities.length && !facilities.every((f) => pg.amenities.includes(f))) return false;

    return true;
  });

  // Sorting
  if (sortBy === "low-high") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === "high-low") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortBy === "nearest") {
    filtered = [...filtered].sort((a, b) => a.distance - b.distance);
  }

  // Sidebar content as component
  const FilterSidebar = () => (
    <aside className="bg-white shadow rounded p-4 space-y-6 w-full md:w-64" aria-label="Filters">
      <h3 className="text-lg font-bold border-b pb-2 mb-4">Filters</h3>

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

      <div>
        <h4 className="font-semibold mb-2">Sort By</h4>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          aria-label="Sort listings"
        >
          <option value="">Default</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
          <option value="nearest">Nearest</option>
        </select>
      </div>
    </aside>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">PG Listings</h2>
        <button
          className="md:hidden text-sm bg-indigo-600 text-white px-3 py-1 rounded"
          onClick={() => setShowFilters((s) => !s)}
          aria-expanded={showFilters}
          aria-controls="mobile-filters"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Mobile filters (collapsible) */}
        {showFilters && (
          <div id="mobile-filters" className="md:hidden">
            <FilterSidebar />
          </div>
        )}

        {/* Desktop sticky sidebar */}
        <div className="hidden md:block w-full md:w-64">
          {/* `sticky top-[100px]` pins this sidebar 100px from viewport top */}
          <div className="sticky top-[100px] self-start">
            <FilterSidebar />
          </div>
        </div>

        {/* Listings column: make it an internal scroll area so cards scroll while sidebar stays visible */}
        <div className="flex-1 w-full">
          <div
            // Use inline style for calc to avoid Tailwind config issues.
            style={{ maxHeight: "calc(100vh - 100px)" }}
            className="overflow-auto scrollbar-hide"
            aria-live="polite"
          >
            {filtered.length === 0 ? (
              <p className="text-gray-600 p-4">No PGs match your filters.</p>
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
    </div>
  );
}


