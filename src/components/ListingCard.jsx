


import React from "react";

export default function ListingCard({ data }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col justify-between">
      {/* Image */}
      {data.image && (
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-48 object-cover"
        />
      )}

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg">{data.name}</h3>
        <p className="text-gray-600 text-sm">{data.location}</p>
        <p className="text-indigo-600 font-bold mt-2">
          ₹ {data.price} / month
        </p>
        <p className="text-sm text-gray-500">Room: {data.roomType}</p>
        <p className="text-sm text-gray-500">Distance: {data.distance} km</p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mt-3">
          {data.amenities?.map((amenity, i) => (
            <span
              key={i}
              className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded"
            >
              {amenity}
            </span>
          ))}
        </div>

        {/* Contact */}
        <a
          href={`tel:${data.contact}`}
          className="mt-4 inline-block text-center bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Contact
        </a>
      </div>
    </div>
  );
}


