import React from "react";
import { MdVerified } from "react-icons/md";

const About = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-3xl w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          About PG Finder
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-4">
          PG Finder is your one-stop platform for finding the perfect Paying Guest
          accommodation in Pune. We understand the struggles of finding a safe,
          affordable, and well-equipped place to stay — especially in a bustling
          city like ours. That’s why we’ve built a simple and reliable solution
          to help you explore multiple PG options at your fingertips.
        </p>
        <p className="text-gray-600 text-lg leading-relaxed mb-4">
          Whether you’re a student, working professional, or someone relocating,
          we make the process of finding a PG hassle-free. With detailed listings,
          verified amenities, and location-based search, we help you make an
          informed choice without the stress of house-hunting.
        </p>
        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          Our mission is to connect people with comfortable, secure, and budget-friendly
          accommodations while saving them time and effort. At PG Finder, your comfort
          is our priority.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">
            Why Choose Us?
          </h3>
          <ul className="text-gray-700 space-y-1 text-left">
                <li className="flex items-center gap-2">
                   <MdVerified className="text-green-600"/> Verified PG listings
                </li>
                <li className="flex items-center gap-2">
                    <MdVerified className="text-green-600"/> Easy location & price filters
                </li>
                <li className="flex items-center gap-2">
                  <MdVerified className="text-green-600"/> Transparent pricing & amenities
                </li>
                <li className="flex items-center gap-2">
                  <MdVerified className="text-green-600"/> User-friendly interface
              </li>
          </ul>

        </div>
      </div>
    </div>
  );
};

export default About;
