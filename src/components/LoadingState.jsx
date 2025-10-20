import { Loader2, Cpu, Calculator, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

const LoadingState = ({ type = 'default', message }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const calculationSteps = [
    { icon: Calculator, text: 'Validating input parameters...' },
    { icon: Cpu, text: 'Calculating core dimensions...' },
    { icon: Cpu, text: 'Analyzing electrical characteristics...' },
    { icon: Cpu, text: 'Running AI prediction model...' },
    { icon: CheckCircle, text: 'Finalizing results...' }
  ];

  useEffect(() => {
    if (type === 'calculation') {
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev < calculationSteps.length - 1 ? prev + 1 : prev));
      }, 1200);

      return () => clearInterval(interval);
    }
  }, [type]);

  if (type === 'calculation') {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
          <div className="flex flex-col items-center">
            {/* Animated Icon */}
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center animate-pulse">
                {(() => {
                  const IconComponent = calculationSteps[currentStep].icon;
                  return IconComponent && <IconComponent className="w-10 h-10 text-primary-600 animate-scale-in" />;
                })()}
              </div>
              <div className="absolute inset-0 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>

            {/* Steps Progress */}
            <div className="w-full mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Processing</span>
                <span className="text-sm text-gray-500">{currentStep + 1} / {calculationSteps.length}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-600 to-accent-600 transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep + 1) / calculationSteps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Current Step */}
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800 mb-2">
                {calculationSteps[currentStep].text}
              </p>
              <p className="text-sm text-gray-500">
                This may take a few moments...
              </p>
            </div>

            {/* Technical Note */}
            <div className="mt-6 px-4 py-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-gray-600 text-center">
                <strong>Technical Process:</strong> Running IEEE-compliant calculations and AI model inference
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default loading state
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
      <p className="text-gray-600 font-medium">{message || 'Processing...'}</p>
    </div>
  );
};

export default LoadingState;
