import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PrintPagePT = () => {
  const [data, setData] = useState({
    type: '',
    voltRat: '',
    burden: '',
    classType: '',
    stc: '',
    cross: '',
    wirelen: '',
    insulationOnCore: '',
    numOfLayers: ''
  });

  useEffect(() => {
    // In a real application, these values would be calculated based on the input
    // For now, we'll just simulate the values with some placeholder calculations
    const type = localStorage.getItem('Type') || '';
    const voltRat = localStorage.getItem('VoltRat') || '';
    const burden = localStorage.getItem('Burden') || '';
    const classType = localStorage.getItem('ClassType') || '';
    const stc = localStorage.getItem('STC') || '';
    
    // Dummy calculations for demonstration
    const cross = (parseFloat(voltRat) * 0.4).toFixed(2);
    const wirelen = (parseFloat(burden) * 0.15).toFixed(2);
    const insulationOnCore = Math.round(parseFloat(voltRat) * 0.4);
    const numOfLayers = Math.round(parseFloat(burden) / 10);
    
    setData({
      type,
      voltRat,
      burden,
      classType,
      stc,
      cross,
      wirelen,
      insulationOnCore,
      numOfLayers
    });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="print:hidden">
        <Navbar isLoggedIn={true} />
      </div>
      
      <div className="w-[210mm] mx-auto bg-white p-8 shadow-lg print:shadow-none">
        <h1 className="text-4xl font-bold text-center mb-6">Design Sheet</h1>
        <h3 className="text-xl font-medium text-center mb-6">
          Electrical Supply: {data.voltRat} KV PT {data.type}
        </h3>
        
        <table className="w-[158mm] mx-auto mb-8 border border-black">
          <tbody className="bg-blue-100">
            <tr className="h-12">
              <td className="border border-black text-center p-2">
                <p className="text-center">Burden: {data.burden} VA</p>
              </td>
            </tr>
            <tr className="h-12">
              <td className="border border-black text-center p-2">
                <p className="text-center">Class: {data.classType}</p>
              </td>
            </tr>
            <tr className="h-12">
              <td className="border border-black text-center p-2">
                <p className="text-center">STC: {data.stc} KA/1sec</p>
              </td>
            </tr>
          </tbody>
        </table>
        
        <table className="w-[158mm] mx-auto border border-black">
          <tbody className="bg-blue-100">
            <tr className="h-20">
              <td className="border border-black p-3 w-[10%]">1</td>
              <td className="border border-black p-3 w-[50%]">Cross Section Area</td>
              <td className="border border-black p-3 w-[40%]">{data.cross} sq. mm</td>
            </tr>
            <tr className="h-20">
              <td className="border border-black p-3">2</td>
              <td className="border border-black p-3">Width of Wire</td>
              <td className="border border-black p-3">{data.wirelen} mm</td>
            </tr>
            <tr className="h-20">
              <td className="border border-black p-3">3</td>
              <td className="border border-black p-3">Insulation On Core</td>
              <td className="border border-black p-3">{data.insulationOnCore} Layers of Crepe Paper</td>
            </tr>
            <tr className="h-20">
              <td className="border border-black p-3">4</td>
              <td className="border border-black p-3">Number of Layers</td>
              <td className="border border-black p-3">{data.numOfLayers} Layers</td>
            </tr>
          </tbody>
        </table>
        
        <div className="flex justify-center mt-8 print:hidden">
          <button 
            onClick={handlePrint}
            className="px-6 py-2 bg-gradient-to-t from-green-700 to-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300"
          >
            Print
          </button>
          <Link
            to="/dashboard"
            className="ml-4 px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition duration-300"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrintPagePT;