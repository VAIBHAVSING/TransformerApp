import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PrintPagePT = () => {
  const [outputData, setOutputData] = useState({
    type: '',
    voltageRating: '',
    burden: '',
    class: '',
    stc: '',
    crossSection: '',
    wireLength: '',
    insulationOnCore: '',
    numOfLayers: ''
  });

  const [isPrinted, setIsPrinted] = useState(false);

  useEffect(() => {
    // Get the data passed from the previous page
    const data = JSON.parse(localStorage.getItem('ptOutputData'));
    if (data) {
      setOutputData(data);
    }
  }, []);

  const handlePrint = () => {
    window.print();
    setIsPrinted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="print:hidden">
        <Navbar isLoggedIn={true} />
      </div>
      
      <div className="container mx-auto py-8 px-4">
        <div className="text-center print:hidden">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              Potential Transformer Output
            </span>
          </h2>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-6">TransformerGo</h1>
            <h2 className="text-2xl mb-8">Potential Transformer Specifications</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="border-b pb-2">
                <span className="font-bold mr-2">Type:</span>
                <span>{outputData.type}</span>
              </div>
              
              <div className="border-b pb-2">
                <span className="font-bold mr-2">Voltage Rating:</span>
                <span>{outputData.voltageRating} kV</span>
              </div>
              
              <div className="border-b pb-2">
                <span className="font-bold mr-2">Burden:</span>
                <span>{outputData.burden} VA</span>
              </div>
              
              <div className="border-b pb-2">
                <span className="font-bold mr-2">Class:</span>
                <span>{outputData.class}</span>
              </div>
              
              <div className="border-b pb-2">
                <span className="font-bold mr-2">Short Time Current:</span>
                <span>{outputData.stc} kA/sec</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border-b pb-2">
                <span className="font-bold mr-2">Cross Section Area:</span>
                <span>{outputData.crossSection} sq. mm</span>
              </div>
              
              <div className="border-b pb-2">
                <span className="font-bold mr-2">Wire Width:</span>
                <span>{outputData.wireLength} mm</span>
              </div>
              
              <div className="border-b pb-2">
                <span className="font-bold mr-2">Insulation on Core:</span>
                <span>{outputData.insulationOnCore} Layers of Crepe Paper</span>
              </div>
              
              <div className="border-b pb-2">
                <span className="font-bold mr-2">Number of Layers:</span>
                <span>{outputData.numOfLayers} Layers</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <div className="text-center text-gray-600">
              <p className="text-sm">*This document is computer-generated and serves for reference purposes only.</p>
              <p className="text-sm">*Generated on {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center space-x-4 print:hidden">
            {!isPrinted ? (
              <button
                onClick={handlePrint}
                className="px-6 py-3 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
              >
                Print Document
              </button>
            ) : (
              <p className="text-green-600 font-medium">Document printed successfully!</p>
            )}
            
            <Link
              to="/input-pt"
              className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Inputs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintPagePT;