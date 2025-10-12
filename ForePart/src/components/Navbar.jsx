import { Link } from "react-router-dom";
import { useState } from "react";
// Ensure you have these imports from lucide-react:
import { ShoppingCart, Menu, X, LogIn, UserPlus, LogOut } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to close the mobile menu when a link is clicked
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // Define common link styles
  const linkClass = "hover:text-yellow-300 transition duration-150 ease-in-out";
  const mobileLinkClass = "block py-2 px-4 rounded-md text-base font-medium hover:bg-green-700 hover:text-yellow-300 transition duration-150 ease-in-out";

  return (
    <nav className="bg-green-700 text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <Link to="/" className="text-2xl font-bold tracking-wide rounded-lg hover:bg-green-600 p-1">
            Karathi Greenscape
          </Link>

          {/* Desktop Links (Primary Navigation) */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className={linkClass}>
              Home
            </Link>
            <Link to="/shop" className={linkClass}>
              Shop
            </Link>
            <Link to="/about" className={linkClass}>
              About
            </Link>
            <Link to="/contact" className={linkClass}>
              Contact
            </Link>
            <Link to="/profile" className={linkClass}>
              Profile
            </Link>
            
            {/* Cart Icon */}
            <Link to="/cart" className={`flex items-center ${linkClass}`}>
              <ShoppingCart className="h-5 w-5 mr-1" /> Cart
            </Link>
            
            {/* Authentication Links */}
            <div className="pl-4 border-l border-green-600 flex space-x-4">
              <Link to="/login" className={`flex items-center text-sm ${linkClass}`}>
                <LogIn className="h-4 w-4 mr-1" /> Login
              </Link>
              <Link to="/register" className={`flex items-center text-sm ${linkClass}`}>
                <UserPlus className="h-4 w-4 mr-1" /> Register
              </Link>
              {/* This is the Logout link pointing to /logout */}
              <Link 
                to="/logout" 
                className={`flex items-center text-sm text-red-300 hover:text-red-500 ${linkClass}`}
              >
                <LogOut className="h-4 w-4 mr-1" /> Logout
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-700 focus:ring-white"
            aria-expanded={isOpen}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="bg-green-800 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {/* Main Links */}
          <Link to="/" onClick={handleLinkClick} className={mobileLinkClass}>
            Home
          </Link>
          <Link to="/shop" onClick={handleLinkClick} className={mobileLinkClass}>
            Shop
          </Link>
          <Link to="/about" onClick={handleLinkClick} className={mobileLinkClass}>
            About
          </Link>
          <Link to="/contact" onClick={handleLinkClick} className={mobileLinkClass}>
            Contact
          </Link>
          <Link to="/profile" onClick={handleLinkClick} className={mobileLinkClass}>
            Profile
          </Link>
          <Link to="/cart" onClick={handleLinkClick} className={mobileLinkClass}>
            <ShoppingCart className="h-5 w-5 inline mr-2" /> Cart
          </Link>

          {/* Authentication Links */}
          <div className="pt-2 border-t border-green-700 mt-2 space-y-1">
            <Link to="/login" onClick={handleLinkClick} className={mobileLinkClass}>
              <LogIn className="h-5 w-5 inline mr-2" /> Login
            </Link>
            <Link to="/register" onClick={handleLinkClick} className={mobileLinkClass}>
              <UserPlus className="h-5 w-5 inline mr-2" /> Register
            </Link>
            {/* This is the Logout link pointing to /logout */}
            <Link 
              to="/logout" 
              onClick={handleLinkClick} 
              className={`${mobileLinkClass} text-red-300 hover:text-red-500`}
            >
              <LogOut className="h-5 w-5 inline mr-2" /> Logout
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
