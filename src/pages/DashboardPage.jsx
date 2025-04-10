import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-white">
      <Navbar isLoggedIn={true} />
      
      {/* Hero Section */}
      <div className="py-16">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-6xl md:text-7xl font-bold mb-10 text-center">
            <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">Choose</span> your <br />
            <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">Type</span>
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
            <Link 
              to="/input-ct" 
              className="flex justify-center items-center h-40 text-3xl font-bold bg-gradient-to-t from-green-700 to-green-500 rounded-lg text-white hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Current Transformer
            </Link>
            
            <Link 
              to="/input-pt" 
              className="flex justify-center items-center h-40 text-3xl font-bold bg-gradient-to-t from-green-700 to-green-500 rounded-lg text-white hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Potential Transformer
            </Link>
          </div>
          
          <Link 
            to="/login" 
            className="mt-12 py-2 px-8 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-all duration-300"
          >
            Back
          </Link>
        </div>
      </div>
      
      {/* About Section */}
      <div id="about" className="bg-gradient-to-r from-white to-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center">
              <div className="w-4/5">
                <img 
                  id="HomeImage" 
                  src="/HomeTransImag.png" 
                  alt="Transformer Illustration" 
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                What does our website provide?
              </h1>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Computation of Current Transformer and Potential Transformer Parameters. 
                <br />We also provide
              </h2>
              <p className="text-lg text-gray-700">
                • Prediction of Phase Error and Ratio Error.<br />
                • 3D Model
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;