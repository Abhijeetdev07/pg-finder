import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import Contact from "./pages/contact";
import About from "./pages/AboutUs";

/**
 * App: top-level router and layout
 */
export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/Contact" element={<Contact/>} />
            <Route path="/AboutUs" element={<About/>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
