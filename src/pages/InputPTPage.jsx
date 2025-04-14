import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const InputPTPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: '',
    burden: '',
    voltageRating: '',
    class: '',
    stc: ''
  });

  const [outputData, setOutputData] = useState({
    crossSection: '',
    wireLength: '',
    insulationOnCore: '',
    numOfLayers: ''
  });

  const [showOutput, setShowOutput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [modelType, setModelType] = useState('');

  const handleTypeChange = (e) => {
    setFormData({
      ...formData,
      type: e.target.value
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const calculateForPT = () => {
    // Validate form first
    if (!formData.type || !formData.burden || !formData.voltageRating || 
        !formData.class || !formData.stc) {
      alert('Please fill all fields');
      return;
    }

    // Parse input values
    const burden = parseInt(formData.burden);
    const voltageRating = parseInt(formData.voltageRating);
    const stc = parseFloat(formData.stc);

    // Calculations based on original JS_Computation.js
    const crossection = (stc * 1000) / 180;

    // Determine wire length based on burden
    let wirelength;
    if (burden <= 60) {
      wirelength = 85;
    } else if (burden <= 90) {
      wirelength = 70;
    } else {
      wirelength = 50;
    }

    // Constants
    const insulationOnCore = 3; // kV
    const numOfLayers = 6;

    // Format output strings the same way as original code
    const crossSectionStr = `Cross Section Area = ${(Math.round(((crossection + Number.EPSILON) + 1) * 100) / 100)} sq. mm`;
    const wireLengthStr = `Width of Wire = ${wirelength} mm`;
    const insulationOnCoreStr = `Layers on Core = ${(Math.round(((insulationOnCore + Number.EPSILON) + 1) * 100) / 100)} Layers of Crepe Paper`;
    const numOfLayersStr = `Number of Layers = ${numOfLayers} Layers`;

    setOutputData({
      crossSection: crossSectionStr,
      wireLength: wireLengthStr,
      insulationOnCore: insulationOnCoreStr,
      numOfLayers: numOfLayersStr
    });

    setShowOutput(true);

    // Show the appropriate 3D model based on type
    setModelType(formData.type);
    setShowModel(true);

    // Save for printing
    localStorage.setItem('ptOutputData', JSON.stringify({
      type: formData.type,
      voltageRating: voltageRating,
      burden: burden,
      class: formData.class,
      stc: stc,
      crossSection: (Math.round(((crossection + Number.EPSILON) + 1) * 100) / 100),
      wireLength: wirelength,
      insulationOnCore: (Math.round(((insulationOnCore + Number.EPSILON) + 1) * 100) / 100),
      numOfLayers: numOfLayers
    }));
  };
  
  const predictErrors = () => {
    setIsLoading(true);
    
    // Simulate running the model
    setTimeout(() => {
      setIsLoading(false);
      setShowOutput(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={true} />
      
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              Inputs for Potential Transformer
            </span>
          </h2>
        </div>
        
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="mb-8">
            <div className="flex gap-6">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="t1"
                  name="type"
                  value="Oil Cooled"
                  required
                  checked={formData.type === "Oil Cooled"}
                  onChange={handleTypeChange}
                  className="mr-2 h-5 w-5 accent-green-600"
                />
                <label htmlFor="t1" className="text-lg">Oil Cooled</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="t2"
                  name="type"
                  value="Epoxy/Dry"
                  required
                  checked={formData.type === "Epoxy/Dry"}
                  onChange={handleTypeChange}
                  className="mr-2 h-5 w-5 accent-green-600"
                />
                <label htmlFor="t2" className="text-lg">Epoxy/Dry</label>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="burden" className="block text-lg font-medium mb-2">
              Burden
            </label>
            <select
              name="burden"
              id="burden"
              value={formData.burden}
              onChange={handleInputChange}
              required
              className="w-full md:w-64 h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">--Select--</option>
              <option value="30">30 VA</option>
              <option value="40">40 VA</option>
              <option value="50">50 VA</option>
              <option value="60">60 VA</option>
              <option value="70">70 VA</option>
              <option value="80">80 VA</option>
              <option value="90">90 VA</option>
              <option value="100">100 VA</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label htmlFor="voltage-rating" className="block text-lg font-medium mb-2">
              Voltage Rating
            </label>
            <select
              name="voltageRating"
              id="voltage-rating"
              value={formData.voltageRating}
              onChange={handleInputChange}
              required
              className="w-full md:w-64 h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">--Select--</option>
              <option value="11">11 kV</option>
              <option value="22">22 kV</option>
              <option value="33">33 kV</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label htmlFor="class-type" className="block text-lg font-medium mb-2">
              Class
            </label>
            <select
              name="class"
              id="class-type"
              value={formData.class}
              onChange={handleInputChange}
              required
              className="w-full md:w-64 h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">--Select--</option>
              <option value="0.1">0.1</option>
              <option value="0.2">0.2</option>
              <option value="0.3">0.3</option>
              <option value="1">1</option>
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="0.2S">0.2S</option>
              <option value="0.5S">0.5S</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label htmlFor="stc" className="block text-lg font-medium mb-2">
              Short Time Current
            </label>
            <select
              name="stc"
              id="stc"
              value={formData.stc}
              onChange={handleInputChange}
              required
              className="w-full md:w-64 h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">--Select--</option>
              <option value="3">3 kA/sec</option>
              <option value="6.7">6.7 kA/sec</option>
              <option value="13.1">13.1 kA/sec</option>
              <option value="26.2">26.2 kA/sec</option>
              <option value="31.1">31.1 kA/sec</option>
            </select>
          </div>
          
          <div className="flex gap-4 mt-8 justify-center">
            <Link
              to="/"
              className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 hover:scale-105 transition-all duration-300"
            >
              Back
            </Link>
            
            <button
              type="button"
              onClick={calculateForPT}
              className="px-6 py-3 rounded bg-gradient-to-t from-green-700 to-green-500 text-white font-bold hover:scale-105 transition-all duration-300"
            >
              Compute
            </button>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button
            id="open-page-btn1"
            className="px-6 py-3 rounded bg-gradient-to-t from-green-700 to-green-500 text-white font-bold hover:scale-105 transition-all duration-300"
            onClick={predictErrors}
          >
            Predict Errors
          </button>
        </div>
        
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-lg">
              <p className="text-xl">Running the model...</p>
            </div>
          </div>
        )}
        
        {showOutput && (
          <div className="flex flex-col md:flex-row gap-6 mt-10">
            <div className="w-full md:w-1/2">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                    Output for Potential Transformer
                  </span>
                </h2>
                
                <div className="space-y-4">
                  <p className="text-lg" id="crosssection">{outputData.crossSection}</p>
                  <p className="text-lg" id="wirelength">{outputData.wireLength}</p>
                  <p className="text-lg" id="insulationOnCore">{outputData.insulationOnCore}</p>
                  <p className="text-lg" id="noOfLayers">{outputData.numOfLayers}</p>
                  
                  <div className="mt-6 text-center">
                    <Link
                      to="/print-page-pt"
                      id="printbtn"
                      className="px-6 py-3 rounded bg-gradient-to-t from-green-700 to-green-500 text-white font-bold hover:scale-105 transition-all duration-300 inline-block"
                    >
                      Print
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {showModel && (
              <div className="w-full md:w-1/2">
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-4 text-center">
                    <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                      3D Model - {modelType === 'Oil Cooled' ? 'oil cooled' : 'epoxy dry'}
                    </span>
                  </h2>
                  
                  <div className="sketchfab-embed-wrapper">
                    <iframe 
                      title={modelType === 'Oil Cooled' ? 'Oil Cooled with Dimensions' : 'Epoxy Transformer with Dimensions'} 
                      width="100%" 
                      height="500" 
                      frameBorder="0" 
                      allowFullScreen 
                      mozallowfullscreen="true" 
                      webkitallowfullscreen="true"
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      xr-spatial-tracking="true"
                      src={modelType === 'Oil Cooled' 
                        ? "https://sketchfab.com/models/24bdbf43519840f691e3ace4fae233f5/embed" 
                        : "https://sketchfab.com/models/2d1e67715d15453996afa9cbea8ff6f5/embed"
                      }
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      <a 
                        href={modelType === 'Oil Cooled' 
                          ? "https://sketchfab.com/3d-models/oil-cooled-with-dimensions-24bdbf43519840f691e3ace4fae233f5" 
                          : "https://sketchfab.com/3d-models/epoxy-transformer-with-dimensions-2d1e67715d15453996afa9cbea8ff6f5"
                        } 
                        target="_blank" 
                        rel="nofollow"
                        className="font-bold text-green-600 hover:text-green-500"
                      >
                        {modelType === 'Oil Cooled' ? 'Oil Cooled with Dimensions' : 'Epoxy Transformer with Dimensions'}
                      </a> on <a href="https://sketchfab.com" target="_blank" rel="nofollow" className="font-bold text-green-600 hover:text-green-500">Sketchfab</a>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputPTPage;