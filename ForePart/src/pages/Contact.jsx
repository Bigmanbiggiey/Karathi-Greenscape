// src/pages/Contact.jsx
import React, { useState } from "react";
import { Title, Meta } from "react-head";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // Track which map is selected
  const [activeMap, setActiveMap] = useState("kitengela");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* SEO Head */}
      <Title>Contact Us | Karathi Greenscape</Title>
      <Meta
        name="description"
        content="Get in touch with Karathi Greenscape for wholesale and retail plant supply, landscaping solutions, and floral services across Kenya."
      />
      <Meta
        name="keywords"
        content="Karathi Greenscape, Contact, Landscaping Kenya, Wholesale Plants, Retail Flowers"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-100 via-white to-green-50 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Contact Us
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          We’d love to hear from you! Reach out to Karathi Greenscape for plant
          supply, landscaping, or any inquiries.
        </p>
      </section>

      {/* Map Selectors */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setActiveMap("kitengela")}
            className={`p-4 text-center font-semibold rounded-xl shadow-md transition ${
              activeMap === "kitengela"
                ? "bg-green-700 text-white"
                : "bg-white text-green-700 border border-green-700 hover:bg-green-50"
            }`}
          >
            Kitengela Branch
          </button>
          <button
            onClick={() => setActiveMap("nairobi")}
            className={`p-4 text-center font-semibold rounded-xl shadow-md transition ${
              activeMap === "nairobi"
                ? "bg-green-700 text-white"
                : "bg-white text-green-700 border border-green-700 hover:bg-green-50"
            }`}
          >
            Nairobi Branch
          </button>
        </div>

        {/* Map Display */}
        <div className="w-full h-96 rounded-xl overflow-hidden shadow-md">
          {activeMap === "kitengela" ? (
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1995.067541273377!2d36.9591212!3d-1.476193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f05a1a63d507f%3A0x92f6c08e3f7c502!2sKitengela!5e0!3m2!1sen!2ske!4v1694200000000!5m2!1sen!2ske"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kitengela Map"
            ></iframe>
          ) : (
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.859013063741!2d36.821946!3d-1.292066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10c715e5b7d7%3A0x96e7c6539e9f3b6c!2sNairobi!5e0!3m2!1sen!2ske!4v1694200000000!5m2!1sen!2ske"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Nairobi Map"
            ></iframe>
          )}
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Our Contact Information
          </h2>
          <p className="text-gray-700">
            You can reach us directly through the details below or by filling
            out the form.
          </p>
          <div className="space-y-4">
            <p>
              📍 <strong>Location:</strong> Kitengela, Kenya
            </p>
            <p>
              📞 <strong>Phone:</strong> +254 712 345 678
            </p>
            <p>
              📧 <strong>Email:</strong> info@karathigreenscape.com
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          {submitted ? (
            <div className="text-center">
              <h3 className="text-xl font-semibold text-green-700 mb-4">
                Thank you!
              </h3>
              <p className="text-gray-700">
                Your message has been received. We’ll get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="4"
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-800 transition"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Contact;
