import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Here you can send form data to your backend / email service
    console.log("Form Submitted:", formData);

    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });

    // Reset the confirmation message after a few seconds
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Contact Us
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Have questions about our PG listings? Send us a message and we’ll get back to you soon!
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Write your message here..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 h-28 resize-none"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Send Message
          </button>
        </form>
        {submitted && (
          <p className="text-green-600 text-center mt-4">
            ✅ Your message has been sent successfully!
          </p>
        )}
      </div>
    </div>
  );
};

export default Contact;
