import { Link } from "react-router-dom";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-green-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <Link to="/" className="text-2xl font-bold tracking-wide">
            Karathi Greenscape
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-yellow-300">
              Home
            </Link>
            <Link to="/shop" className="hover:text-yellow-300">
              Shop
            </Link>
            <Link to="/about" className="hover:text-yellow-300">
              About
            </Link>
            <Link to="/contact" className="hover:text-yellow-300">
              Contact
            </Link>
            <Link to="/profile" className="hover:text-yellow-300">
              Profile
            </Link>
            <Link to="/cart" className="flex items-center hover:text-yellow-300">
              <ShoppingCart className="h-5 w-5 mr-1" /> Cart
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-green-800 px-4 py-3 space-y-2">
          <Link to="/" className="block hover:text-yellow-300">
            Home
          </Link>
          <Link to="/shop" className="block hover:text-yellow-300">
            Shop
          </Link>
          <Link to="/about" className="block hover:text-yellow-300">
            About
          </Link>
          <Link to="/contact" className="block hover:text-yellow-300">
            Contact
          </Link>
          <Link to="/cart" className="block hover:text-yellow-300">
            Cart
          </Link>
          <Link to="/profile" className="block hover:text-yellow-300">
            Profile
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
