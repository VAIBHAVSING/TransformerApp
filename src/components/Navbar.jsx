import { Link } from 'react-router-dom';
import { Home, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = ({ isLoggedIn, showSignOut = true }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="glass sticky top-0 z-50 border-b border-gray-100">
      <div className="flex justify-between items-center h-20 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-3xl sm:text-4xl font-bold hover:scale-105 transition-transform">
          <span className="gradient-text">Transformer</span>
          <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">GO</span>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="lg:hidden p-2 rounded-lg hover:bg-primary-50 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
        
        {/* Desktop menu */}
        {isLoggedIn && (
          <ul className="hidden lg:flex items-center gap-2">
            <li>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-5 py-2.5 text-gray-700 font-semibold text-lg rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-all duration-300"
              >
                <Home className="w-5 h-5" />
                Dashboard
              </Link>
            </li>
            {showSignOut && (
              <li>
                <Link
                  to="/logout"
                  className="flex items-center gap-2 btn-primary"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </Link>
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && isLoggedIn && (
        <div className="lg:hidden glass border-t border-gray-100 animate-slide-down">
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 font-semibold rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-all duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="w-5 h-5" />
              Dashboard
            </Link>
            {showSignOut && (
              <Link
                to="/logout"
                className="flex items-center gap-3 px-4 py-3 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;