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
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  const [activeMap, setActiveMap] = useState("kitengela");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      const res = await fetch("https://formspree.io/f/xdkwobqo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to send message.");
      }

      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setSending(false);
    }
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
              📍 <strong>Locations:</strong> Head Office: Kitengela - Along Nairobi Namanga Highway, Opp Riverside Hotel <br /> Branches: Kimalat, Kitengela and Kamangu, Limuru.
            </p>
            <p>
              📞 <strong>Phone:</strong> +254 742 127 811
            </p>
            <p>
              📧 <strong>Email:</strong> danielnduatimurigi@gmail.com
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

              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full py-2 px-4 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-800 transition disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
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
            Limuru Branch
          </button>
        </div>

        {/* Map Display */}
        <div className="w-full h-96 rounded-xl overflow-hidden shadow-md">
          {activeMap === "kitengela" ? (
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d296.44435331992986!2d36.95463980705027!3d-1.4929641360481618!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182fa029a32ea761%3A0x1b98a0c9cee3a824!2sKitengela!5e0!3m2!1sen!2ske!4v1758527751462!5m2!1sen!2ske"
              height="100%"
              width="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kitengela Map"
            ></iframe>
          ) : (
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d15955.53944709092!2d36.58767862243058!3d-1.2394158951520282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sKamangu%20limuru!5e0!3m2!1sen!2ske!4v1758527970254!5m2!1sen!2ske"
              height="100%"
              width="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Nairobi Map"
            ></iframe>
          )}
        </div>
      </section>
    </div>
  );
};

export default Contact;
