import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <div className="navbar__container flex justify-between px-5">
        <div className="subjects__wrapper grid grid-cols-2">
          <div>
            <h1 className="text-7xl font-bold mt-80 ml-0 mb-4 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              <em>Transformer<span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">GO</span></em>
            </h1>
            <div className="wrapper grid grid-cols-2">
              <Link 
                to="/register" 
                className="cursor-pointer flex justify-center items-center w-40 h-20 text-2xl font-bold bg-gradient-to-t from-green-700 to-green-500 rounded-lg text-gray-100 hover:scale-105 transition-all duration-300"
              >
                Register
              </Link>
              <Link 
                to="/login" 
                className="cursor-pointer flex justify-center items-center w-40 h-20 text-2xl font-bold bg-gradient-to-t from-green-700 to-green-500 rounded-lg text-gray-100 hover:scale-105 transition-all duration-300"
              >
                Log In
              </Link>
            </div>
          </div>
          <div>
            <img 
              className="mt-24 ml-40" 
              src="/HomeTransImag.png" 
              alt="Transformer Illustration" 
              style={{ height: "700px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;