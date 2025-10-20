import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import FieldTooltip from '../components/FieldTooltip';
import LoadingState from '../components/LoadingState';
import { modelService } from '../services/api';
import { 
  BarChart3, Sparkles, Calculator, FileText, Zap, TrendingUp, Gauge, Shield,
  ChevronRight, CheckCircle2, AlertCircle, Info, Layers, Settings
} from "lucide-react";

const InputCTPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(1);
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
        toast.error(`Please fill the "${field}" field.`);
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
    setActiveStep(2);

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
      coreSize: `Core Size = ${Math.ceil(outerDiameter)} mm × ${Math.ceil(internalDiameter)} mm × ${Math.ceil(height)} mm`,
      insulationOnCore: `Layers on Core = ${(Math.round(((insulationOnCore + Number.EPSILON) + 1) * 100) / 100)} Layers of Crepe Paper`,
      crossSectionForPrimary: `Cross Section for primary = ${Math.round((crossectionForPrimary + Number.EPSILON) * 100) / 100} sq mm`,
      n1: `Primary turns = ${n1} turns`,
      n2: `Secondary turns = ${n2} turns`,
      crossSectionForSecondary: `Cross Section for secondary = ${Math.round((crossectionForSecondary + Number.EPSILON) * 100000) / 1000} sq mm`,
      lengthOfPrimary: `Length of Primary = ${Math.round((lengthOfPrimary + Number.EPSILON) * 1000) / 100} m`,
      insulationOnPrimary: `Insulation On Primary = ${Math.round((insulationOnPrimary + Number.EPSILON) * 100) / 100} Layers of Crepe Paper`,
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
    if (!areFieldsValid()) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Prepare payload with the correct structure expected by the backend
      const payload = {
        type: formData.type,
        burden: parseFloat(formData.burden),
        voltageRating: parseFloat(formData.voltageRating),
        class: formData.class,
        ctRatio: formData.ctRatio,
        stc: parseFloat(formData.stc)
      };

      console.log('CT Prediction Payload:', payload);
      const result = await modelService.predictCT(payload);

      if (result.success) {
        console.log('CT Prediction Results:', result.data);
        setOutputData((prevOutput) => ({
          ...prevOutput,
          ctPredictionResults: result.data
        }));
        toast.success('CT predictions generated successfully!');
        setActiveStep(3);
      } else {
        console.error('Prediction error:', result.error);
        
        if (result.error === 'You are not logged in! Please log in to get access.') {
          toast.warning('Please log in to use the prediction feature');
          navigate('/login', { state: { from: location.pathname, message: 'Please log in to use the prediction feature' } });
          return;
        }
        
        setErrorMessage(result.error || 'Failed to get prediction results');
        toast.error('Failed to fetch predictions: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Prediction error:', error);
      setErrorMessage('Failed to connect to the server');
      toast.error('Failed to connect to the server. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintClick = () => {
    if (!areFieldsValid()) return;
    
    const ctOutputData = JSON.parse(localStorage.getItem('ctOutputData') || '{}');
    
    const finalData = {
      ...ctOutputData,
      predictionResults: outputData.ctPredictionResults
    };
    
    localStorage.setItem('ctOutputData', JSON.stringify(finalData));
    navigate('/ct-results');
  };

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    const fields = Object.values(formData);
    const filledFields = fields.filter(val => val !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar isLoggedIn={true} />

      {/* Compact Header */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-wide opacity-90">ML-Powered Manufacturing</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">Current Transformer Production</h1>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs opacity-75">Burden Range</div>
                <div className="font-bold">10-30 VA</div>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-75">AI Predictions</div>
                <div className="font-bold">20 Outputs</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Form Completion</span>
              <span className="font-semibold">{getCompletionPercentage()}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5">
              <div 
                className="bg-white rounded-full h-1.5 transition-all duration-500"
                style={{ width: `${getCompletionPercentage()}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2 sm:gap-8">
            <div className={`flex items-center gap-2 ${activeStep >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${activeStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
                {activeStep > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
              </div>
              <span className="hidden sm:inline text-sm font-semibold">Input Parameters</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <div className={`flex items-center gap-2 ${activeStep >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${activeStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
                {activeStep > 2 ? <CheckCircle2 className="w-5 h-5" /> : '2'}
              </div>
              <span className="hidden sm:inline text-sm font-semibold">CT Calculations</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <div className={`flex items-center gap-2 ${activeStep >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${activeStep >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
                {activeStep > 3 ? <CheckCircle2 className="w-5 h-5" /> : '3'}
              </div>
              <span className="hidden sm:inline text-sm font-semibold">AI Predictions</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form - Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Transformer Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Settings className="w-4 h-4 inline mr-2" />
                  Transformer Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.type === 'Oil Cooled' 
                      ? 'border-primary-600 bg-primary-50 shadow-md' 
                      : 'border-gray-200 hover:border-primary-300'
                  }`}>
                    <input
                      type="radio"
                      name="type"
                      value="Oil Cooled"
                      checked={formData.type === "Oil Cooled"}
                      onChange={handleTypeChange}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <Zap className={`w-6 h-6 mx-auto mb-2 ${formData.type === 'Oil Cooled' ? 'text-primary-600' : 'text-gray-400'}`} />
                      <div className="font-semibold text-sm">Oil Cooled</div>
                    </div>
                    {formData.type === 'Oil Cooled' && (
                      <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-primary-600" />
                    )}
                  </label>
                  
                  <label className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.type === 'Epoxy/Dry' 
                      ? 'border-primary-600 bg-primary-50 shadow-md' 
                      : 'border-gray-200 hover:border-primary-300'
                  }`}>
                    <input
                      type="radio"
                      name="type"
                      value="Epoxy/Dry"
                      checked={formData.type === "Epoxy/Dry"}
                      onChange={handleTypeChange}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <Layers className={`w-6 h-6 mx-auto mb-2 ${formData.type === 'Epoxy/Dry' ? 'text-primary-600' : 'text-gray-400'}`} />
                      <div className="font-semibold text-sm">Epoxy/Dry</div>
                    </div>
                    {formData.type === 'Epoxy/Dry' && (
                      <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-primary-600" />
                    )}
                  </label>
                </div>
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Rated Burden */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Rated Burden (VA)
                    </label>
                    <FieldTooltip
                      title="Rated Secondary Burden"
                      content="The rated secondary burden is the impedance of the secondary circuit, expressed in volt-amperes (VA). This represents the load connected to the CT secondary winding during testing."
                      technical="Standard burden values: 10VA, 15VA, 20VA, 30VA. Higher burden requires larger core size for manufacturing. Typical power factor: 0.8 lagging."
                    />
                  </div>
                  <select
                    name="burden"
                    value={formData.burden}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                  >
                    <option value="">Select Burden</option>
                    <option value="10">10 VA</option>
                    <option value="15">15 VA</option>
                    <option value="20">20 VA</option>
                    <option value="30">30 VA</option>
                  </select>
                </div>

                {/* Primary Voltage */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Primary Voltage (kV)
                    </label>
                    <FieldTooltip
                      title="Primary System Voltage"
                      content="The primary voltage rating indicates the nominal system voltage at which the CT will operate. This determines the insulation requirements and overall design specifications."
                      technical="Common MV ratings: 11kV, 22kV, 33kV. Insulation design varies: 11kV = 15 layers, 22kV = 30 layers, 33kV = 40 layers of crepe paper insulation."
                    />
                  </div>
                  <select
                    name="voltageRating"
                    value={formData.voltageRating}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                  >
                    <option value="">Select Voltage</option>
                    <option value="11">11 kV</option>
                    <option value="22">22 kV</option>
                    <option value="33">33 kV</option>
                  </select>
                </div>

                {/* Accuracy Class */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Accuracy Class
                    </label>
                    <FieldTooltip
                      title="CT Accuracy Classification"
                      content="Accuracy class defines the maximum permissible ratio error and phase displacement under specified conditions. Lower class numbers indicate higher accuracy requirements."
                      technical="Common accuracy classes: 0.1, 0.2, 0.3 (metering), 1.0, 3.0 (protection). 0.2S/0.5S are special accuracy classes for revenue metering. Class indicates % error at rated current."
                    />
                  </div>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                  >
                    <option value="">Select Class</option>
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

                {/* CT Ratio */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      CT Ratio
                    </label>
                    <FieldTooltip
                      title="Current Transformation Ratio"
                      content="The ratio of primary current to secondary current. Standard secondary rating is 5A. The primary current rating is selected based on the maximum expected load current with appropriate margin."
                      technical="Expressed as Primary:Secondary (e.g., 100:5 = 20:1 ratio). Standard secondary: 5A or 1A. Primary selection: 1.2-1.5× max load current for normal operation, considering fault levels."
                    />
                  </div>
                  <select
                    name="ctRatio"
                    value={formData.ctRatio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                  >
                    <option value="">Select Ratio</option>
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

                {/* Short-Time Current */}
                <div className="sm:col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Short-Time Current (STC)
                    </label>
                    <FieldTooltip
                      title="Short-Time Current Rating"
                      content="The maximum current the CT can withstand for a specified duration (typically 1 second) during fault conditions without thermal or mechanical damage. Critical for protection applications."
                      technical="Specified in kA/sec per IEEE C57.13. Determines conductor size for mechanical strength during fault. Values: 3-31.1 kA/sec. Primary conductor cross-section = (STC × 1000) / 180."
                    />
                  </div>
                  <select
                    name="stc"
                    value={formData.stc}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                  >
                    <option value="">Select STC</option>
                    <option value="3">3 kA/sec</option>
                    <option value="6.7">6.7 kA/sec</option>
                    <option value="13.1">13.1 kA/sec</option>
                    <option value="26.2">26.2 kA/sec</option>
                    <option value="31.1">31.1 kA/sec</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/dashboard"
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all text-center"
                >
                  Back to Dashboard
                </Link>
                <button
                  onClick={calculateForCT}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Calculator className="w-5 h-5" />
                  Calculate Design
                </button>
              </div>

              {showOutput && (
                <div className="mt-6">
                  <button
                    onClick={predictErrors}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Generate AI Predictions
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Info & Results */}
          <div className="lg:col-span-1">
            {/* Info Card */}
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6 mb-6 border border-primary-100">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Automated Quality Control</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Automated measurements with Random Forest error prediction for transformer manufacturing with real-time quality monitoring.
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <span className="text-gray-600">Burden Range</span>
                  <span className="font-semibold">10-30 VA</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <span className="text-gray-600">Voltage Ratings</span>
                  <span className="font-semibold">11-33 kV</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <span className="text-gray-600">Accuracy Classes</span>
                  <span className="font-semibold">0.1 to 5.0</span>
                </div>
              </div>
            </div>

            {/* 3D Model - Show early */}
            {showModel && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-scale-in">
                <h3 className="text-lg font-bold text-gray-900 mb-4">3D Visualization</h3>
                <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                  <iframe
                    title={modelType === 'Oil Cooled' ? 'Oil Cooled CT' : 'Epoxy CT'}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    src={modelType === 'Oil Cooled'
                      ? "https://sketchfab.com/models/24bdbf43519840f691e3ace4fae233f5/embed"
                      : "https://sketchfab.com/models/2d1e67715d15453996afa9cbea8ff6f5/embed"
                    }
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Interactive {modelType} transformer model
                </p>
              </div>
            )}

            {/* Output Results */}
            {showOutput && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-scale-in">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary-600" />
                  CT Design Output
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Core Size', value: outputData.coreSize },
                    { label: 'Insulation', value: outputData.insulationOnCore },
                    { label: 'Primary Section', value: outputData.crossSectionForPrimary },
                    { label: 'Primary Turns', value: outputData.n1 },
                    { label: 'Secondary Section', value: outputData.crossSectionForSecondary },
                    { label: 'Secondary Turns', value: outputData.n2 },
                    { label: 'Primary Length', value: outputData.lengthOfPrimary },
                    { label: 'Primary Insulation', value: outputData.insulationOnPrimary },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                      <div className="text-sm font-semibold text-gray-900">{item.value}</div>
                    </div>
                  ))}

                  <button
                    onClick={handlePrintClick}
                    className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    Generate PDF Report
                  </button>
                </div>
              </div>
            )}

            {/* AI Prediction Results */}
            {outputData.ctPredictionResults && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 animate-scale-in">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  AI Prediction Results
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {/* Ratio 100 Errors */}
                  <div className="bg-gradient-to-r from-purple-50 to-white p-4 rounded-xl border border-purple-100">
                    <h4 className="font-bold text-sm text-purple-700 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Ratio 100 Errors
                    </h4>
                    <div className="space-y-2">
                      {["Ratio100Error120", "Ratio100Error100", "Ratio100Error20", "Ratio100Error5", "Ratio100Error1"].map((key) => {
                        const rawValue = outputData.ctPredictionResults?.[key];
                        const value = rawValue !== undefined && rawValue !== null ? parseFloat(rawValue).toFixed(2) : 'N/A';
                        const label = key.replace(/Ratio100Error/, '') + '%';
                        return (
                          <div key={key} className="flex justify-between items-center text-xs">
                            <span className="text-gray-600">At {label} Load</span>
                            <span className="font-bold text-purple-700">{value}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Phase 100 Errors */}
                  <div className="bg-gradient-to-r from-indigo-50 to-white p-4 rounded-xl border border-indigo-100">
                    <h4 className="font-bold text-sm text-indigo-700 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      Phase 100 Errors
                    </h4>
                    <div className="space-y-2">
                      {["Phase100Error120", "Phase100Error100", "Phase100Error20", "Phase100Error5", "Phase100Error1"].map((key) => {
                        const rawValue = outputData.ctPredictionResults?.[key];
                        const value = rawValue !== undefined && rawValue !== null ? parseFloat(rawValue).toFixed(2) : 'N/A';
                        const label = key.replace(/Phase100Error/, '') + '%';
                        return (
                          <div key={key} className="flex justify-between items-center text-xs">
                            <span className="text-gray-600">At {label} Load</span>
                            <span className="font-bold text-indigo-700">{value}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ratio 25 Errors */}
                  <div className="bg-gradient-to-r from-pink-50 to-white p-4 rounded-xl border border-pink-100">
                    <h4 className="font-bold text-sm text-pink-700 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      Ratio 25 Errors
                    </h4>
                    <div className="space-y-2">
                      {["Ratio25Error120", "Ratio25Error100", "Ratio25Error20", "Ratio25Error5", "Ratio25Error1"].map((key) => {
                        const rawValue = outputData.ctPredictionResults?.[key];
                        const value = rawValue !== undefined && rawValue !== null ? parseFloat(rawValue).toFixed(2) : 'N/A';
                        const label = key.replace(/Ratio25Error/, '') + '%';
                        return (
                          <div key={key} className="flex justify-between items-center text-xs">
                            <span className="text-gray-600">At {label} Load</span>
                            <span className="font-bold text-pink-700">{value}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Phase 25 Errors */}
                  <div className="bg-gradient-to-r from-teal-50 to-white p-4 rounded-xl border border-teal-100">
                    <h4 className="font-bold text-sm text-teal-700 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      Phase 25 Errors
                    </h4>
                    <div className="space-y-2">
                      {["Phase25Error120", "Phase25Error100", "Phase25Error20", "Phase25Error5", "Phase25Error1"].map((key) => {
                        const rawValue = outputData.ctPredictionResults?.[key];
                        const value = rawValue !== undefined && rawValue !== null ? parseFloat(rawValue).toFixed(2) : 'N/A';
                        const label = key.replace(/Phase25Error/, '') + '%';
                        return (
                          <div key={key} className="flex justify-between items-center text-xs">
                            <span className="text-gray-600">At {label} Load</span>
                            <span className="font-bold text-teal-700">{value}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <LoadingState type="calculation" />
        </div>
      )}
    </div>
  );
};

export default InputCTPage;
