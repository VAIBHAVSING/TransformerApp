import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import FieldTooltip from '../components/FieldTooltip';
import LoadingState from '../components/LoadingState';
import { modelService } from '../services/api';
import { 
  BarChart3, Sparkles, Calculator, FileText, Zap, TrendingUp, Shield,
  ChevronRight, CheckCircle2, Settings, Layers
} from "lucide-react";

const InputPTPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(1);
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
    numOfLayers: '',
    predictionResults: null
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
    if (!formData.type || !formData.burden || !formData.voltageRating ||
      !formData.class || !formData.stc) {
      toast.error('Please fill all fields');
      return;
    }

    const burden = parseInt(formData.burden);
    const voltageRating = parseInt(formData.voltageRating);
    const stc = parseFloat(formData.stc);

    const crossection = (stc * 1000) / 180;

    let wirelength;
    if (burden <= 60) {
      wirelength = 85;
    } else if (burden <= 90) {
      wirelength = 70;
    } else {
      wirelength = 50;
    }

    const insulationOnCore = 3;
    const numOfLayers = 6;

    setOutputData({
      crossSection: `Cross Section = ${(Math.round(((crossection + Number.EPSILON) + 1) * 100) / 100)} sq mm`,
      wireLength: `Wire Length = ${wirelength} mm`,
      insulationOnCore: `Insulation On Core = ${(Math.round(((insulationOnCore + Number.EPSILON) + 1) * 100) / 100)} kV`,
      numOfLayers: `Number of Layers = ${numOfLayers} layers`
    });

    setShowOutput(true);
    setShowModel(true);
    setModelType(formData.type);
    setActiveStep(2);

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
      toast.error('Please fill all fields');
      return;
    }

    setIsLoading(true);
    
    const burden = parseInt(formData.burden);
    const voltageRating = parseInt(formData.voltageRating);
    const stc = parseFloat(formData.stc);

    const crossection = (stc * 1000) / 180;

    let wirelength;
    if (burden <= 60) {
      wirelength = 85;
    } else if (burden <= 90) {
      wirelength = 70;
    } else {
      wirelength = 50;
    }

    const insulationOnCore = 3;
    const numOfLayers = 6;

    const crossSectionValue = (Math.round(((crossection + Number.EPSILON) + 1) * 100) / 100);
    const wireLengthValue = wirelength;
    const insulationOnCoreValue = (Math.round(((insulationOnCore + Number.EPSILON) + 1) * 100) / 100);
    const numOfLayersValue = numOfLayers;

    const crossSectionStr = `Cross Section = ${crossSectionValue} sq mm`;
    const wireLengthStr = `Wire Length = ${wireLengthValue} mm`;
    const insulationOnCoreStr = `Insulation On Core = ${insulationOnCoreValue} kV`;
    const numOfLayersStr = `Number of Layers = ${numOfLayersValue} layers`;
    
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
      const result = await modelService.predictPT(payload);
      
      if (result.success) {
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
        setActiveStep(3);
        
        toast.success('PT predictions generated successfully!');
        
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
        
        if (result.error === 'You are not logged in! Please log in to get access.') {
          toast.warning('Please log in to use the prediction feature');
          navigate('/login', { state: { from: location.pathname, message: 'Please log in to use the prediction feature' } });
          return;
        }
        
        setErrorMessage(result.error || 'Failed to get prediction results. Please try again.');
        toast.error(result.error || 'Failed to get prediction results. Please try again.');
      }
    } catch (error) {
      console.error('Error predicting errors:', error);
      setErrorMessage('Failed to connect to the server. Please check your connection and try again.');
      toast.error('Failed to connect to the server. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintClick = () => {
    const burden = parseInt(formData.burden);
    const voltageRating = parseInt(formData.voltageRating);
    const stc = parseFloat(formData.stc);
    
    const crossection = (stc * 1000) / 180;

    let wirelength;
    if (burden <= 60) {
      wirelength = 85;
    } else if (burden <= 90) {
      wirelength = 70;
    } else {
      wirelength = 50;
    }

    const insulationOnCore = 3;
    const numOfLayers = 6;
    
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
    
    navigate('/pt-results');
  };

  const getCompletionPercentage = () => {
    const fields = Object.values(formData);
    const filledFields = fields.filter(val => val !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <Navbar isLoggedIn={true} />

      {/* Compact Header */}
      <div className="bg-gradient-to-r from-accent-600 via-accent-500 to-purple-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-wide opacity-90">IEC 61869 Compliant</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">Potential Transformer Design</h1>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs opacity-75">Voltage Range</div>
                <div className="font-bold">11-33 kV</div>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-75">AI Predictions</div>
                <div className="font-bold">6 Outputs</div>
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
            <div className={`flex items-center gap-2 ${activeStep >= 1 ? 'text-accent-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${activeStep >= 1 ? 'bg-accent-600 text-white' : 'bg-gray-200'}`}>
                {activeStep > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
              </div>
              <span className="hidden sm:inline text-sm font-semibold">Input Parameters</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <div className={`flex items-center gap-2 ${activeStep >= 2 ? 'text-accent-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${activeStep >= 2 ? 'bg-accent-600 text-white' : 'bg-gray-200'}`}>
                {activeStep > 2 ? <CheckCircle2 className="w-5 h-5" /> : '2'}
              </div>
              <span className="hidden sm:inline text-sm font-semibold">PT Calculations</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <div className={`flex items-center gap-2 ${activeStep >= 3 ? 'text-accent-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${activeStep >= 3 ? 'bg-accent-600 text-white' : 'bg-gray-200'}`}>
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
                      ? 'border-accent-600 bg-accent-50 shadow-md' 
                      : 'border-gray-200 hover:border-accent-300'
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
                      <Zap className={`w-6 h-6 mx-auto mb-2 ${formData.type === 'Oil Cooled' ? 'text-accent-600' : 'text-gray-400'}`} />
                      <div className="font-semibold text-sm">Oil Cooled</div>
                    </div>
                    {formData.type === 'Oil Cooled' && (
                      <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-accent-600" />
                    )}
                  </label>
                  
                  <label className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.type === 'Epoxy/Dry' 
                      ? 'border-accent-600 bg-accent-50 shadow-md' 
                      : 'border-gray-200 hover:border-accent-300'
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
                      <Layers className={`w-6 h-6 mx-auto mb-2 ${formData.type === 'Epoxy/Dry' ? 'text-accent-600' : 'text-gray-400'}`} />
                      <div className="font-semibold text-sm">Epoxy/Dry</div>
                    </div>
                    {formData.type === 'Epoxy/Dry' && (
                      <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-accent-600" />
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
                      title="PT Secondary Burden"
                      content="The rated secondary burden represents the load connected to the PT secondary terminals, expressed in volt-amperes (VA). PT burdens typically range from 30-100 VA."
                      technical="IEC 61869 standard burdens: 30VA, 40VA, 50VA, 60VA, 70VA, 80VA, 90VA, 100VA. Burden affects wire width: ≤60VA = 85mm, ≤90VA = 70mm, >90VA = 50mm."
                    />
                  </div>
                  <select
                    name="burden"
                    value={formData.burden}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-all"
                  >
                    <option value="">Select Burden</option>
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

                {/* Primary Voltage */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Primary Voltage (kV)
                    </label>
                    <FieldTooltip
                      title="PT Primary Voltage"
                      content="The primary voltage rating determines the nominal system voltage at which the PT will operate. This affects the transformation ratio and BDV (Breakdown Voltage) oil testing requirements."
                      technical="Common ratings: 11kV, 22kV, 33kV. Secondary voltage: 110V or 190V per IEC 61869. Primary/Secondary ratio: 11000/110 = 100:1, 22000/110 = 200:1, 33000/110 = 300:1."
                    />
                  </div>
                  <select
                    name="voltageRating"
                    value={formData.voltageRating}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-all"
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
                      title="PT Accuracy Classification"
                      content="Accuracy class defines the maximum permissible voltage error and phase displacement at rated voltage and burden. Lower class numbers indicate higher accuracy."
                      technical="IEC 61869 Classes: 0.1, 0.2, 0.5 (metering), 1.0, 3.0 (protection), 3P, 6P (protective). Class indicates % error at rated voltage. Special classes available for high-precision metering."
                    />
                  </div>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-all"
                  >
                    <option value="">Select Class</option>
                    <option value="0.1">0.1</option>
                    <option value="0.2">0.2</option>
                    <option value="0.5">0.5</option>
                    <option value="1">1</option>
                    <option value="3">3</option>
                    <option value="3P">3P</option>
                    <option value="6P">6P</option>
                  </select>
                </div>

                {/* Short-Time Current */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Short-Time Current (STC)
                    </label>
                    <FieldTooltip
                      title="Short-Time Current Rating"
                      content="The maximum current the PT primary can withstand during fault conditions for 1 second without damage. Determines conductor cross-section for mechanical strength."
                      technical="Specified in kA/sec per IEC 61869. Primary conductor cross-section formula: (STC × 1000) / 180. Critical for withstanding through-fault conditions in voltage transformers."
                    />
                  </div>
                  <select
                    name="stc"
                    value={formData.stc}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-all"
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
                  onClick={calculateForPT}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-accent-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Calculator className="w-5 h-5" />
                  Calculate Design
                </button>
              </div>

              {showOutput && (
                <div className="mt-6">
                  <button
                    onClick={calculateAndPredict}
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
            <div className="bg-gradient-to-br from-accent-50 to-purple-50 rounded-2xl p-6 mb-6 border border-accent-100">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-accent-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">IEC 61869 Standard</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    All calculations conform to IEC 61869 standards for voltage transformers with BDV oil analysis and insulation specifications.
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <span className="text-gray-600">Burden Range</span>
                  <span className="font-semibold">30-100 VA</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <span className="text-gray-600">Voltage Ratings</span>
                  <span className="font-semibold">11-33 kV</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <span className="text-gray-600">Accuracy Classes</span>
                  <span className="font-semibold">0.1 to 6P</span>
                </div>
              </div>
            </div>

            {/* 3D Model - Show early */}
            {showModel && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-scale-in">
                <h3 className="text-lg font-bold text-gray-900 mb-4">3D Visualization</h3>
                <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                  <iframe
                    title={modelType === 'Oil Cooled' ? 'Oil Cooled PT' : 'Epoxy PT'}
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
                  <BarChart3 className="w-5 h-5 text-accent-600" />
                  PT Design Output
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Cross Section', value: outputData.crossSection },
                    { label: 'Wire Length', value: outputData.wireLength },
                    { label: 'Insulation', value: outputData.insulationOnCore },
                    { label: 'Layers', value: outputData.numOfLayers },
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
            {outputData.predictionResults && (
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
                      {["Ratio100Error120", "Ratio100Error100", "Ratio100Error80"].map((key) => {
                        const rawValue = outputData.predictionResults?.[key];
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
                      {["Phase100Error120", "Phase100Error100", "Phase100Error80"].map((key) => {
                        const rawValue = outputData.predictionResults?.[key];
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

export default InputPTPage;
