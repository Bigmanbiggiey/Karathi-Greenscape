// src/pages/About.jsx
import React from "react";
import { Title, Meta } from "react-head";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* SEO Head */}
      <Title>About Us | Karathi Greenscape</Title>
      <Meta
        name="description"
        content="Karathi Greenscape is your trusted partner in wholesale and retail supply of plants, flowers, and landscaping solutions across Kenya."
      />
      <Meta
        name="keywords"
        content="Karathi Greenscape, Landscaping, Wholesale Plants, Retail Flowers, Kenya, Gardening Supplies"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-100 via-white to-green-50 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          About Karathi Greenscape
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Growing nature, nurturing beauty — your one-stop shop for wholesale
          and retail plants, flowers, and landscaping solutions in Kenya.
        </p>
      </section>

      {/* About Content */}
      <section className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <div>
          <img
            src="/images/greenscape.jpg"
            alt="Karathi Greenscape nursery"
            className="rounded-2xl shadow-lg w-full object-cover"
          />
        </div>

        {/* Text */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Who We Are
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            At <strong>Karathi Greenscape</strong>, we are passionate about
            transforming spaces through nature. Based in Kenya, we supply a wide
            range of plants, flowers, and landscaping products to both wholesale
            and retail customers.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Whether you’re a homeowner, landscaper, event organizer, or
            corporate client, we provide tailored green solutions that make your
            spaces vibrant, sustainable, and welcoming.
          </p>
        </div>
      </section>

      {/* Services Highlight */}
      <section className="bg-green-50 py-16 px-6">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-8">
          What We Offer
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            "Wholesale Plant Supply",
            "Retail Flowers & Garden Products",
            "Landscaping Solutions",
            "Event Floral Decoration",
            "Indoor & Outdoor Plant Design",
            "Sustainable Green Consultancy",
          ].map((service, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {service}
              </h3>
              <p className="text-gray-600">
                High-quality, sustainable, and affordable services designed to
                meet the needs of individuals, businesses, and communities.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="text-center py-16 px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Let’s Green Your Space
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          From small gardens to large-scale projects, Karathi Greenscape is your
          partner in building a greener tomorrow.
        </p>
        <a
          href="/contact"
          className="px-6 py-3 bg-green-700 text-white rounded-xl shadow-md hover:bg-green-800 transition"
        >
          Get in Touch
        </a>
      </section>
    </div>
  );
};

export default About;
