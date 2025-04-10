import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn, showSignOut = true }) => {
  return (
    <nav className="bg-white sticky top-0 z-50">
      <div className="flex justify-between items-center h-20 w-full max-w-[1300px] mx-auto px-4">
        <Link to="/" className="text-4xl font-bold cursor-pointer">
          <strong>
            <em className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              Transformer<span className="bg-gradient-to-r from-black to-gray-500 bg-clip-text text-transparent">Go</span>
            </em>
          </strong>
        </Link>
        
        <div className="lg:hidden flex items-center">
          <div className="space-y-2 cursor-pointer">
            <span className="block w-8 h-1 bg-black"></span>
            <span className="block w-8 h-1 bg-black"></span>
            <span className="block w-8 h-1 bg-black"></span>
          </div>
        </div>
        
        {isLoggedIn && (
          <ul className="hidden lg:flex items-center">
            <li className="h-20">
              <Link
                to="/dashboard"
                className="flex items-center justify-center w-32 h-full text-black font-bold text-xl hover:text-green-600 transition-all duration-300"
              >
                Home
              </Link>
            </li>
            {showSignOut && (
              <li className="flex justify-center items-center pl-4">
                <Link
                  to="/logout"
                  className="flex justify-center items-center px-5 py-3 rounded bg-gradient-to-t from-green-700 to-green-500 text-white hover:scale-105 transition-all duration-300"
                >
                  Sign Out
                </Link>
              </li>
            )}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;