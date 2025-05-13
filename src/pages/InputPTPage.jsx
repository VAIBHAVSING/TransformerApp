import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CheckCircle, BarChart3 } from "lucide-react";
import { modelService } from '../services/api';

const InputPTPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
  const [errorMessage, setErrorMessage] = useState('');

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

  const calculateAndPredict = async () => {
    if (!formData.type || !formData.burden || !formData.voltageRating ||
      !formData.class || !formData.stc) {
      alert('Please fill all fields');
      return;
    }

    setIsLoading(true);
    
    // First calculate the PT outputs
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

    // Update output data first so it's available for the API call
    setOutputData({
      crossSection: crossSectionStr,
      wireLength: wireLengthStr,
      insulationOnCore: insulationOnCoreStr,
      numOfLayers: numOfLayersStr
    });

    // Calculate the numeric values
    const crossSectionValue = (Math.round(((crossection + Number.EPSILON) + 1) * 100) / 100);
    const wireLengthValue = wirelength;
    const insulationOnCoreValue = (Math.round(((insulationOnCore + Number.EPSILON) + 1) * 100) / 100);
    const numOfLayersValue = numOfLayers;
    
    // Prepare payload for API with string values
    const payload = {
      formData: {
        type: formData.type,
        burden: formData.burden,
        class: formData.class,
        stc: formData.stc
      },
      outputData: {
        crossSection: String(crossSectionValue),
        wireLength: String(wireLengthValue),
        insulationOnCore: String(insulationOnCoreValue),
        numOfLayers: String(numOfLayersValue)
      }
    };

    try {
      // Use the modelService instead of direct fetch
      const result = await modelService.predictPT(payload);
      
      if (result.success) {
        // Update output with the prediction results
        setOutputData(prevData => ({
          crossSection: crossSectionStr,
          wireLength: wireLengthStr,
          insulationOnCore: insulationOnCoreStr,
          numOfLayers: numOfLayersStr,
          predictionResults: result.data
        }));

        setShowOutput(true);
        setShowModel(true);
        setModelType(formData.type);
        
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
      } else {
        console.error('Error predicting errors:', result.error);
        
        // If unauthorized (401), redirect to login
        if (result.error === 'You are not logged in! Please log in to get access.') {
          navigate('/login', { state: { from: location.pathname, message: 'Please log in to use the prediction feature' } });
          return;
        }
        
        // Handle other errors
        setErrorMessage(result.error || 'Failed to get prediction results. Please try again.');
      }
    } catch (error) {
      console.error('Error predicting errors:', error);
      setErrorMessage('Failed to connect to the server. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintClick = () => {
    // Recalculate and save data before navigating
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
    
    // Save data to localStorage before navigation
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
    
    // Navigate to the correct route defined in App.jsx
    navigate('/pt-results');
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
            onClick={calculateAndPredict}
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
            {/* Output Section */}
            <div className="w-full md:w-1/2">
              <div className="bg-white p-8 rounded-lg shadow-lg border border-green-100 hover:shadow-xl transition duration-300">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                    Output for Potential Transformer
                  </span>
                </h2>

                <div className="space-y-4 text-gray-800 text-lg font-medium">
                  <p id="crosssection">• {outputData.crossSection}</p>
                  <p id="wirelength">• {outputData.wireLength}</p>
                  <p id="insulationOnCore">• {outputData.insulationOnCore}</p>
                  <p id="noOfLayers">• {outputData.numOfLayers}</p>

                  <div className="mt-6 text-center">
                    <button
                      onClick={handlePrintClick}
                      id="printbtn"
                      className="px-6 py-3 rounded bg-gradient-to-t from-green-700 to-green-500 text-white font-bold hover:scale-105 transition-all duration-300 inline-block"
                    >
                      Print
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Prediction Results */}
            {outputData.predictionResults && (
              <div className="w-full md:w-1/2">
                <div className="bg-gradient-to-br from-white to-green-50 p-8 rounded-2xl shadow-xl border border-green-100 hover:shadow-2xl transition-all duration-500 ease-in-out transform hover:-translate-y-1">
                  <div className="flex items-center justify-center mb-6">
                    <BarChart3 className="text-green-600 w-7 h-7 mr-3" />
                    <h2 className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                      Model Prediction Results
                    </h2>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-transparent opacity-30 rounded-lg"></div>

                    <div className="space-y-5">
                      <div className="bg-gradient-to-r from-green-50 to-white p-4 rounded-lg shadow-md">
                        <h3 className="font-bold text-xl text-green-700 mb-2 border-b border-green-100 pb-2">Ratio Errors</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                          <div className="bg-white p-3 rounded-lg border border-green-100 shadow-sm flex flex-col items-center justify-center transform transition-transform hover:scale-105">
                            <span className="text-sm text-green-900 font-medium">At 120% Load</span>
                            <span className="text-2xl font-bold text-green-600">
                              {parseFloat(outputData.predictionResults.Ratio100Error120).toFixed(2)}
                            </span>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-green-100 shadow-sm flex flex-col items-center justify-center transform transition-transform hover:scale-105">
                            <span className="text-sm text-green-900 font-medium">At 100% Load</span>
                            <span className="text-2xl font-bold text-green-600">
                              {parseFloat(outputData.predictionResults.Ratio100Error100).toFixed(2)}
                            </span>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-green-100 shadow-sm flex flex-col items-center justify-center transform transition-transform hover:scale-105">
                            <span className="text-sm text-green-900 font-medium">At 80% Load</span>
                            <span className="text-2xl font-bold text-green-600">
                              {parseFloat(outputData.predictionResults.Ratio100Error80).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg shadow-md">
                        <h3 className="font-bold text-xl text-blue-700 mb-2 border-b border-blue-100 pb-2">Phase Errors</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                          <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm flex flex-col items-center justify-center transform transition-transform hover:scale-105">
                            <span className="text-sm text-blue-900 font-medium">At 120% Load</span>
                            <span className="text-2xl font-bold text-blue-600">
                              {parseFloat(outputData.predictionResults.Phase100Error120).toFixed(2)}
                            </span>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm flex flex-col items-center justify-center transform transition-transform hover:scale-105">
                            <span className="text-sm text-blue-900 font-medium">At 100% Load</span>
                            <span className="text-2xl font-bold text-blue-600">
                              {parseFloat(outputData.predictionResults.Phase100Error100).toFixed(2)}
                            </span>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm flex flex-col items-center justify-center transform transition-transform hover:scale-105">
                            <span className="text-sm text-blue-900 font-medium">At 80% Load</span>
                            <span className="text-2xl font-bold text-blue-600">
                              {parseFloat(outputData.predictionResults.Phase100Error80).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-center">
                      <p className="text-gray-600 text-sm italic">Values represent predicted error percentages at different loads</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

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