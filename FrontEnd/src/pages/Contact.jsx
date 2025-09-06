// src/pages/Contact.jsx
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now just simulate submission
    console.log("Form submitted:", form);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Helmet>
        <title>Contact Us | Karathi Greenscape</title>
        <meta
          name="description"
          content="Get in touch with Karathi Greenscape for wholesale and retail plant supply, landscaping solutions, and floral services across Kenya."
        />
        <meta
          name="keywords"
          content="Karathi Greenscape, Contact, Landscaping Kenya, Wholesale Plants, Retail Flowers"
        />
      </Helmet>

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
