// src/pages/Home.jsx
import React from "react";
import { Title, Meta } from "react-head";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* SEO Head */}
      <Title>
        Karathi Greenscape | Wholesale & Retail Plants & Landscaping
      </Title>
      <Meta
        name="description"
        content="Karathi Greenscape provides wholesale and retail plant supply, landscaping solutions, and floral services across Kenya. Order fresh plants today!"
      />
      <Meta
        name="keywords"
        content="Karathi Greenscape, Landscaping Kenya, Wholesale Plants, Retail Flowers, Gardening, Kitengela"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-200 via-white to-green-100 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Welcome to Karathi Greenscape
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-6">
          Your trusted partner in wholesale & retail plants, landscaping, and
          floral services across Kenya.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/shop"
            className="px-6 py-3 bg-green-700 text-white rounded-xl font-semibold shadow hover:bg-green-800 transition"
          >
            Shop Now
          </Link>
          <Link
            to="/about"
            className="px-6 py-3 bg-white border border-green-700 text-green-700 rounded-xl font-semibold shadow hover:bg-green-50 transition"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
          Our Services
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Wholesale Plant Supply",
              desc: "Supplying nurseries, landscapers, and businesses with bulk plants at competitive prices.",
            },
            {
              title: "Retail Plant Store",
              desc: "Individual plants and floral arrangements available for personal gardens and décor.",
            },
            {
              title: "Landscaping Services",
              desc: "Professional landscaping and garden setup to transform your outdoor spaces.",
            },
          ].map((service, idx) => (
            <div
              key={idx}
              className="bg-white shadow rounded-2xl p-6 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-green-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
            Featured Products
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Indoor Plants */}
            <div className="bg-white shadow rounded-2xl p-6 hover:shadow-lg transition text-center">
              <div className="h-40 bg-green-100 rounded-xl mb-4 flex items-center justify-center">
                <span className="text-3xl">🏡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Indoor Plants
              </h3>
              <p className="text-gray-600 mb-2">
                Perfect for homes and offices.
              </p>
              <ul className="text-gray-700 text-sm">
                <li>• Duranta – Ksh 50</li>
                <li>• Geranium – Ksh 100</li>
              </ul>
              <Link
                to="/shop"
                className="mt-4 inline-block px-4 py-2 bg-green-700 text-white rounded-lg shadow hover:bg-green-800 transition"
              >
                View More
              </Link>
            </div>

            {/* Outdoor Shrubs */}
            <div className="bg-white shadow rounded-2xl p-6 hover:shadow-lg transition text-center">
              <div className="h-40 bg-green-100 rounded-xl mb-4 flex items-center justify-center">
                <span className="text-3xl">🌳</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Outdoor Shrubs
              </h3>
              <p className="text-gray-600 mb-2">
                Ideal for landscaping and garden borders.
              </p>
              <ul className="text-gray-700 text-sm">
                <li>• Bougainvillea – Ksh 50</li>
                <li>• Croton – Ksh 500</li>
                <li>• Hibiscus – Ksh 200</li>
              </ul>
              <Link
                to="/shop"
                className="mt-4 inline-block px-4 py-2 bg-green-700 text-white rounded-lg shadow hover:bg-green-800 transition"
              >
                View More
              </Link>
            </div>

            {/* Flowering Plants */}
            <div className="bg-white shadow rounded-2xl p-6 hover:shadow-lg transition text-center">
              <div className="h-40 bg-green-100 rounded-xl mb-4 flex items-center justify-center">
                <span className="text-3xl">🌸</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Flowering Plants
              </h3>
              <p className="text-gray-600 mb-2">
                Brighten up any space with vibrant blooms.
              </p>
              <ul className="text-gray-700 text-sm">
                <li>• Bolsam – Ksh 200</li>
                <li>• Hibiscus – Ksh 200</li>
                <li>• Geranium – Ksh 100</li>
              </ul>
              <Link
                to="/shop"
                className="mt-4 inline-block px-4 py-2 bg-green-700 text-white rounded-lg shadow hover:bg-green-800 transition"
              >
                View More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-20 bg-gradient-to-r from-green-700 to-green-900 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to transform your space?
        </h2>
        <p className="max-w-2xl mx-auto mb-8 text-lg">
          Whether you need bulk plant supply, garden beautification, or
          landscaping expertise — Karathi Greenscape has you covered.
        </p>
        <Link
          to="/contact"
          className="px-8 py-3 bg-white text-green-800 font-semibold rounded-xl shadow hover:bg-gray-100 transition"
        >
          Contact Us Today
        </Link>
      </section>
    </div>
  );
};

export default Home;
