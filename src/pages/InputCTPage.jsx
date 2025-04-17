import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const InputCTPage = () => {
  const navigate = useNavigate();
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
      setIsLoading(false);
      return;
    }

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

    const payload = {
      ...formData,
      ...computedOutput
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_Model_API_URL}/predict_ct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.error) {
        console.error('Prediction error:', data.error);
        alert('Failed to fetch predictions.');
      } else {
        setOutputData((prevOutput) => ({
          ...prevOutput,
          ctPredictionResults: data
        }));
      }
    } catch (error) {
      console.error('Prediction error:', error);
      alert('Failed to fetch predictions.');
    }

    setIsLoading(false);
  };


  const handlePrintClick = () => {
    if (!areFieldsValid()) return;
    navigate('/print-page-ct');

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
          <div className="w-full md:w-1/2 mt-10">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition duration-300 ease-in-out">
              <h2 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                CT Model Prediction Results
              </h2>

              <div className="space-y-6 text-gray-800 text-lg font-medium max-h-[500px] overflow-y-auto">
                {/* Ratio 100 Errors */}
                <div>
                  <h3 className="text-xl font-bold text-purple-600 mb-2">Ratio 100 Errors</h3>
                  {["Ratio100Error120", "Ratio100Error100", "Ratio100Error20", "Ratio100Error5", "Ratio100Error1"].map((key) => (
                    <p key={key}>
                      <span className="text-purple-500 font-semibold">{key.replace(/([a-z])([A-Z])/g, "$1 $2")}:</span>{' '}
                      {parseFloat(outputData.ctPredictionResults[key]).toFixed(2)}
                    </p>
                  ))}
                </div>

                {/* Phase 100 Errors */}
                <div>
                  <h3 className="text-xl font-bold text-indigo-600 mb-2">Phase 100 Errors</h3>
                  {["Phase100Error120", "Phase100Error100", "Phase100Error20", "Phase100Error5", "Phase100Error1"].map((key) => (
                    <p key={key}>
                      <span className="text-indigo-500 font-semibold">{key.replace(/([a-z])([A-Z])/g, "$1 $2")}:</span>{' '}
                      {parseFloat(outputData.ctPredictionResults[key]).toFixed(2)}
                    </p>
                  ))}
                </div>

                {/* Ratio 25 Errors */}
                <div>
                  <h3 className="text-xl font-bold text-pink-600 mb-2">Ratio 25 Errors</h3>
                  {["Ratio25Error120", "Ratio25Error100", "Ratio25Error20", "Ratio25Error5", "Ratio25Error1"].map((key) => (
                    <p key={key}>
                      <span className="text-pink-500 font-semibold">{key.replace(/([a-z])([A-Z])/g, "$1 $2")}:</span>{' '}
                      {parseFloat(outputData.ctPredictionResults[key]).toFixed(2)}
                    </p>
                  ))}
                </div>

                {/* Phase 25 Errors */}
                <div>
                  <h3 className="text-xl font-bold text-teal-600 mb-2">Phase 25 Errors</h3>
                  {["Phase25Error120", "Phase25Error100", "Phase25Error20", "Phase25Error5", "Phase25Error1"].map((key) => (
                    <p key={key}>
                      <span className="text-teal-500 font-semibold">{key.replace(/([a-z])([A-Z])/g, "$1 $2")}:</span>{' '}
                      {parseFloat(outputData.ctPredictionResults[key]).toFixed(2)}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default InputCTPage;