const Footer = () => {
  return (
    <footer className="bg-green-900 text-white py-6 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Brand Info */}
          <div>
            <h2 className="text-lg font-semibold">Karathi Greenscape</h2>
            <p className="mt-2 text-sm">
              Transforming spaces with lush greenery and elegant landscaping.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-md font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <a href="/" className="hover:text-yellow-300">
                  Home
                </a>
              </li>
              <li>
                <a href="/shop" className="hover:text-yellow-300">
                  Shop
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-yellow-300">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-yellow-300">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-md font-semibold mb-2">Contact Us</h3>
            <p className="text-sm">📍 Kitengela & Limuru Kenya</p>
            <p className="text-sm">📞 +254 742 127 811</p>
            <p className="text-sm">✉️ danielnduatimurigi@gmail.com</p>
          </div>
        </div>

        <div className="border-t border-green-700 mt-6 pt-4 text-center text-sm">
          © {new Date().getFullYear()} Karathi Greenscape. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
