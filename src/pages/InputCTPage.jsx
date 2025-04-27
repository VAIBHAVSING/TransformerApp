import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { modelService } from '../services/api';
import { BarChart3 } from "lucide-react";

const InputCTPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    type: '',
    burden: '',
    voltageRating: '',
    class: '',
    ctRatio: '',
    stc: ''
  });

  const [outputData, setOutputData] = useState({
    coreSize: '',
    insulationOnCore: '',
    crossSectionForPrimary: '',
    n1: '',
    crossSectionForSecondary: '',
    n2: '',
    lengthOfPrimary: '',
    insulationOnPrimary: ''
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

  const areFieldsValid = () => {
    const requiredFields = ['type', 'burden', 'voltageRating', 'class', 'ctRatio', 'stc'];
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill the "${field}" field.`);
        return false;
      }
    }
    return true;
  };

  const calculateForCT = () => {
    if (!areFieldsValid()) return;

    const computed = getCTComputedOutput(formData);

    setOutputData({
      coreSize: computed.coreSize,
      insulationOnCore: computed.insulationOnCore,
      crossSectionForPrimary: computed.crossSectionForPrimary,
      n1: computed.n1,
      n2: computed.n2,
      crossSectionForSecondary: computed.crossSectionForSecondary,
      lengthOfPrimary: computed.lengthOfPrimary,
      insulationOnPrimary: computed.insulationOnPrimary
    });

    setShowOutput(true);
    setModelType(formData.type);
    setShowModel(true);

    localStorage.setItem('ctOutputData', JSON.stringify({
      ...formData,
      voltageRating: parseInt(formData.voltageRating),
      burden: parseInt(formData.burden),
      ctRatioNumerator: parseInt(formData.ctRatio.split(':')[0]),
      ctRatioDenominator: parseInt(formData.ctRatio.split(':')[1]),
      ...computed
    }));
  };



  const getCTComputedOutput = (formData) => {
    const burden = parseInt(formData.burden);
    const voltageRating = parseInt(formData.voltageRating);
    const a1 = parseInt(formData.ctRatio.split(':')[0]);
    const a2 = parseInt(formData.ctRatio.split(':')[1]);
    const stc = parseFloat(formData.stc);

    const freq = 50;
    const n2 = 60;
    const currDensity = 1.0;
    const copperCurrentDensity = 1.65;

    const vA = burden / a2;
    const area = (4.44 * freq * n2 * currDensity) / vA;
    const n1 = Math.round((a2 * n2) / a1);
    const crossection = (stc * 1000) / 180;
    const totalCrossection = crossection * n1;
    const diameter = Math.sqrt((crossection * 4) / Math.PI);
    const insulation = 40;
    const internalDiameter = insulation + diameter;
    const height = 30;
    const outerDiameter = (2 * area) / height + internalDiameter;
    const insulationOnCore = 3;
    const crossectionForPrimary = a1 / copperCurrentDensity;
    const crossectionForSecondary = a2 / copperCurrentDensity;
    const lengthOfPrimary = (15 * (a1 / a2)) / 100;

    let insulationOnPrimary = 0;
    if (voltageRating === 11) insulationOnPrimary = 15;
    else if (voltageRating === 22) insulationOnPrimary = 30;
    else if (voltageRating === 33) insulationOnPrimary = 40;

    return {
      coreSize: `Core Size = ${Math.ceil(outerDiameter)} mm x ${Math.ceil(internalDiameter)} mm x ${Math.ceil(height)} mm`,
      insulationOnCore: `Layers on Core = ${(Math.round(((insulationOnCore + Number.EPSILON) + 1) * 100) / 100)} Layers of Crepe Paper`,
      crossSectionForPrimary: `Cross Section for primary = ${Math.round((crossectionForPrimary + Number.EPSILON) * 100) / 100} sq mm`,
      n1: `Primary turns = ${n1} turns`,
      n2: `Secondary turns = ${n2} turns`,
      crossSectionForSecondary: `Cross Section for secondary = ${Math.round((crossectionForSecondary + Number.EPSILON) * 100000) / 1000} sq mm`,
      lengthOfPrimary: `Length of Primary = ${Math.round((lengthOfPrimary + Number.EPSILON) * 1000) / 100} m`,
      insulationOnPrimary: `Insulation On Primary = ${Math.round((insulationOnPrimary + Number.EPSILON) * 100) / 100} Layers of Crepe Paper`,
      // Additional raw values for backend
      internalDiameter: Math.ceil(internalDiameter),
      outerDiameter: Math.ceil(outerDiameter),
      height: Math.ceil(height),
      insulationOnCoreVal: Math.round(((insulationOnCore + Number.EPSILON) + 1) * 100) / 100,
      lengthOfPrimaryVal: Math.round((lengthOfPrimary + Number.EPSILON) * 1000) / 100,
      insulationOnPrimaryVal: Math.round((insulationOnPrimary + Number.EPSILON) * 100) / 100,
      primaryTurns: n1,
      secondaryTurns: n2,
      crossSectionForPrimaryVal: Math.round((crossectionForPrimary + Number.EPSILON) * 100) / 100,
      crossSectionForSecondaryVal: Math.round((crossectionForSecondary + Number.EPSILON) * 100000) / 1000,
    };
  };

  const predictErrors = async () => {
    if (!areFieldsValid()) {
      return;
    }

    setIsLoading(true);
    const computedOutput = getCTComputedOutput(formData);
    setOutputData({
      coreSize: computedOutput.coreSize,
      insulationOnCore: computedOutput.insulationOnCore,
      crossSectionForPrimary: computedOutput.crossSectionForPrimary,
      n1: computedOutput.n1,
      n2: computedOutput.n2,
      crossSectionForSecondary: computedOutput.crossSectionForSecondary,
      lengthOfPrimary: computedOutput.lengthOfPrimary,
      insulationOnPrimary: computedOutput.insulationOnPrimary
    });
    setShowOutput(true);
    setModelType(formData.type);
    setShowModel(true);

    // Prepare payload with the right structure expected by the backend
    const payload = {
      type: formData.type,
      burden: parseFloat(formData.burden),
      voltageRating: parseFloat(formData.voltageRating),
      class: formData.class,
      ctRatio: formData.ctRatio,
      stc: parseFloat(formData.stc)
    };

    try {
      const result = await modelService.predictCT(payload);
      
      if (result.success) {
        setOutputData((prevOutput) => ({
          ...prevOutput,
          ctPredictionResults: result.data
        }));
      } else {
        console.error('Prediction error:', result.error);
        
        // If unauthorized (401), redirect to login
        if (result.error === 'You are not logged in! Please log in to get access.') {
          navigate('/login', { state: { from: location.pathname, message: 'Please log in to use the prediction feature' } });
          return;
        }
        
        // Handle other errors
        setErrorMessage(result.error || 'Failed to get prediction results');
        alert('Failed to fetch predictions: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Prediction error:', error);
      setErrorMessage('Failed to connect to the server');
      alert('Failed to connect to the server. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const handlePrintClick = () => {
    if (!areFieldsValid()) return;
    
    // Make sure all data is saved to localStorage before navigating
    const computed = getCTComputedOutput(formData);
    localStorage.setItem('ctOutputData', JSON.stringify({
      ...formData,
      voltageRating: parseInt(formData.voltageRating),
      burden: parseInt(formData.burden),
      ctRatioNumerator: parseInt(formData.ctRatio.split(':')[0]),
      ctRatioDenominator: parseInt(formData.ctRatio.split(':')[1]),
      ...computed
    }));
    
    // Navigate to the correct route defined in App.jsx
    navigate('/ct-results');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={true} />

      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              Inputs for Current Transformer
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
              <option value="10">10 VA</option>
              <option value="15">15 VA</option>
              <option value="20">20 VA</option>
              <option value="30">30 VA</option>
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="voltageRating" className="block text-lg font-medium mb-2">
              Voltage Rating
            </label>
            <select
              name="voltageRating"
              id="voltageRating"
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
            <label htmlFor="class" className="block text-lg font-medium mb-2">
              Class
            </label>
            <select
              name="class"
              id="class"
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
            <label htmlFor="ctRatio" className="block text-lg font-medium mb-2">
              Current Voltage Ratio
            </label>
            <select
              name="ctRatio"
              id="ctRatio"
              value={formData.ctRatio}
              onChange={handleInputChange}
              required
              className="w-full md:w-64 h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">--Select--</option>
              <option value="10:5">10:5</option>
              <option value="15:5">15:5</option>
              <option value="20:5">20:5</option>
              <option value="25:5">25:5</option>
              <option value="30:5">30:5</option>
              <option value="40:5">40:5</option>
              <option value="50:5">50:5</option>
              <option value="75:5">75:5</option>
              <option value="100:5">100:5</option>
              <option value="125:5">125:5</option>
              <option value="150:5">150:5</option>
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

          <div className="flex gap-4 mt-8">
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 hover:scale-105 transition-all duration-300"
            >
              Back
            </Link>

            <button
              type="button"
              onClick={calculateForCT}
              className="px-6 py-3 rounded bg-gradient-to-t from-green-700 to-green-500 text-white font-bold hover:scale-105 transition-all duration-300"
            >
              Compute
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            id="open-page-btn"
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
                    Output for Current Transformer
                  </span>
                </h2>

                <div className="space-y-4">
                  <p className="text-lg">{outputData.coreSize}</p>
                  <p className="text-lg">{outputData.insulationOnCore}</p>
                  <p className="text-lg">{outputData.crossSectionForPrimary}</p>
                  <p className="text-lg">{outputData.n1}</p>
                  <p className="text-lg">{outputData.crossSectionForSecondary}</p>
                  <p className="text-lg">{outputData.n2}</p>
                  <p className="text-lg">{outputData.lengthOfPrimary}</p>
                  <p className="text-lg">{outputData.insulationOnPrimary}</p>

                  <div className="mt-6 text-center">
                    <button
                      onClick={handlePrintClick}
                      className="px-6 py-3 rounded bg-gradient-to-t from-green-700 to-green-500 text-white font-bold hover:scale-105 transition-all duration-300"
                    >
                      Print
                    </button>
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

        {/* CT Prediction Results */}
        {outputData.ctPredictionResults && (
          <div className="w-full mt-10">
            <div className="bg-gradient-to-br from-white to-purple-50 p-8 rounded-2xl shadow-xl border border-purple-100 hover:shadow-2xl transition-all duration-500 ease-in-out">
              <div className="flex items-center justify-center mb-6">
                <BarChart3 className="text-purple-600 w-7 h-7 mr-3" />
                <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-400 bg-clip-text text-transparent">
                  CT Model Prediction Results
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ratio 100 Errors */}
                <div className="bg-gradient-to-r from-purple-50 to-white p-6 rounded-xl shadow-md">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <h3 className="font-bold text-xl text-purple-700">Ratio 100 Errors</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {["Ratio100Error120", "Ratio100Error100", "Ratio100Error20", "Ratio100Error5", "Ratio100Error1"].map((key) => {
                      const value = parseFloat(outputData.ctPredictionResults[key]).toFixed(2);
                      const label = key.replace(/Ratio100Error/, '').replace(/([a-z])([A-Z])/g, "$1 $2");
                      
                      return (
                        <div key={key} className="relative">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-purple-900">At {label}% Load</span>
                            <span className="text-sm font-bold text-purple-800">{value}</span>
                          </div>
                          <div className="w-full bg-purple-100 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full transition-all duration-500" 
                              style={{ 
                                width: `${Math.min(Math.abs(parseFloat(value) * 20), 100)}%`,
                                opacity: Math.min(Math.abs(parseFloat(value) * 0.2 + 0.5), 1)
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Phase 100 Errors */}
                <div className="bg-gradient-to-r from-indigo-50 to-white p-6 rounded-xl shadow-md">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
                    <h3 className="font-bold text-xl text-indigo-700">Phase 100 Errors</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {["Phase100Error120", "Phase100Error100", "Phase100Error20", "Phase100Error5", "Phase100Error1"].map((key) => {
                      const value = parseFloat(outputData.ctPredictionResults[key]).toFixed(2);
                      const label = key.replace(/Phase100Error/, '').replace(/([a-z])([A-Z])/g, "$1 $2");
                      
                      return (
                        <div key={key} className="relative">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-indigo-900">At {label}% Load</span>
                            <span className="text-sm font-bold text-indigo-800">{value}</span>
                          </div>
                          <div className="w-full bg-indigo-100 rounded-full h-2">
                            <div 
                              className="bg-indigo-500 h-2 rounded-full transition-all duration-500" 
                              style={{ 
                                width: `${Math.min(Math.abs(parseFloat(value) * 20), 100)}%`,
                                opacity: Math.min(Math.abs(parseFloat(value) * 0.2 + 0.5), 1)
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Ratio 25 Errors */}
                <div className="bg-gradient-to-r from-pink-50 to-white p-6 rounded-xl shadow-md">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
                    <h3 className="font-bold text-xl text-pink-700">Ratio 25 Errors</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {["Ratio25Error120", "Ratio25Error100", "Ratio25Error20", "Ratio25Error5", "Ratio25Error1"].map((key) => {
                      const value = parseFloat(outputData.ctPredictionResults[key]).toFixed(2);
                      const label = key.replace(/Ratio25Error/, '').replace(/([a-z])([A-Z])/g, "$1 $2");
                      
                      return (
                        <div key={key} className="relative">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-pink-900">At {label}% Load</span>
                            <span className="text-sm font-bold text-pink-800">{value}</span>
                          </div>
                          <div className="w-full bg-pink-100 rounded-full h-2">
                            <div 
                              className="bg-pink-500 h-2 rounded-full transition-all duration-500" 
                              style={{ 
                                width: `${Math.min(Math.abs(parseFloat(value) * 20), 100)}%`,
                                opacity: Math.min(Math.abs(parseFloat(value) * 0.2 + 0.5), 1)
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Phase 25 Errors */}
                <div className="bg-gradient-to-r from-teal-50 to-white p-6 rounded-xl shadow-md">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 bg-teal-500 rounded-full mr-2"></div>
                    <h3 className="font-bold text-xl text-teal-700">Phase 25 Errors</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {["Phase25Error120", "Phase25Error100", "Phase25Error20", "Phase25Error5", "Phase25Error1"].map((key) => {
                      const value = parseFloat(outputData.ctPredictionResults[key]).toFixed(2);
                      const label = key.replace(/Phase25Error/, '').replace(/([a-z])([A-Z])/g, "$1 $2");
                      
                      return (
                        <div key={key} className="relative">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-teal-900">At {label}% Load</span>
                            <span className="text-sm font-bold text-teal-800">{value}</span>
                          </div>
                          <div className="w-full bg-teal-100 rounded-full h-2">
                            <div 
                              className="bg-teal-500 h-2 rounded-full transition-all duration-500" 
                              style={{ 
                                width: `${Math.min(Math.abs(parseFloat(value) * 20), 100)}%`,
                                opacity: Math.min(Math.abs(parseFloat(value) * 0.2 + 0.5), 1)
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm italic">
                  Values represent predicted error percentages at different loads
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default InputCTPage;