import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PrintPageCT = () => {
  const [data, setData] = useState({
    type: '',
    voltRat: '',
    ctNumerator: '',
    ctDenominator: '',
    burden: '',
    classType: '',
    stc: '',
    id: '',
    od: '',
    h: '',
    insC: '',
    csp: '',
    primaryTurns: '',
    crossForSecondary: '',
    secondaryTurns: '',
    lenOfPrim: '',
    insOnPrimary: ''
  });

  useEffect(() => {
    // In a real application, these values would be calculated based on the input
    // For now, we'll just simulate the values with some placeholder calculations
    const type = localStorage.getItem('Type') || '';
    const voltRat = localStorage.getItem('VoltRat') || '';
    const ctNum = localStorage.getItem('CTNumerator') || '';
    const ctDeno = localStorage.getItem('CTDenominator') || '';
    const burden = localStorage.getItem('Burden') || '';
    const classType = localStorage.getItem('ClassType') || '';
    const stc = localStorage.getItem('STC') || '';
    
    // Dummy calculations for demonstration
    const id = Math.round(parseFloat(voltRat) * 3.2);
    const od = Math.round(id * 1.5);
    const h = Math.round(od * 0.6);
    const insC = (parseFloat(voltRat) * 0.12).toFixed(2);
    const csp = (parseFloat(ctNum) / 6).toFixed(2);
    const primaryTurns = Math.round(parseFloat(ctNum) / parseFloat(ctDeno));
    const crossForSecondary = (parseFloat(burden) / 10).toFixed(2);
    const secondaryTurns = Math.round(parseFloat(ctDeno) * 1.2);
    const lenOfPrim = Math.round(id * 3.14);
    const insOnPrimary = (parseFloat(voltRat) * 0.08).toFixed(2);
    
    setData({
      type,
      voltRat,
      ctNumerator: ctNum,
      ctDenominator: ctDeno,
      burden,
      classType,
      stc,
      id,
      od,
      h,
      insC,
      csp,
      primaryTurns,
      crossForSecondary,
      secondaryTurns,
      lenOfPrim,
      insOnPrimary
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
          Electrical Supply: {data.voltRat} KV CT {data.type}
        </h3>
        
        <table className="w-[158mm] mx-auto mb-8 border border-black">
          <tbody className="bg-blue-100">
            <tr className="h-12">
              <td className="border border-black text-center p-2">
                <p className="text-center">CT Ratio: {data.ctNumerator}/{data.ctDenominator} A</p>
              </td>
            </tr>
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
                <p className="text-center">STC: {data.stc}KA/1sec</p>
              </td>
            </tr>
          </tbody>
        </table>
        
        <table className="w-[158mm] mx-auto border border-black">
          <tbody className="bg-blue-100">
            <tr className="h-20">
              <td className="border border-black p-3 w-[10%]">1</td>
              <td className="border border-black p-3 w-[50%]">Core</td>
              <td className="border border-black p-3 w-[40%]">
                {data.id} x {data.od} x {data.h} mm
              </td>
            </tr>
            <tr className="h-20">
              <td className="border border-black p-3">2</td>
              <td className="border border-black p-3">Insulation on Core</td>
              <td className="border border-black p-3">{data.insC} KV</td>
            </tr>
            <tr className="h-20">
              <td className="border border-black p-3">3</td>
              <td className="border border-black p-3">Cross Section For Primary</td>
              <td className="border border-black p-3">{data.csp} sq. mm</td>
            </tr>
            <tr className="h-20">
              <td className="border border-black p-3">4</td>
              <td className="border border-black p-3">Primary turns</td>
              <td className="border border-black p-3">{data.primaryTurns} turns</td>
            </tr>
            <tr className="h-20">
              <td className="border border-black p-3">5</td>
              <td className="border border-black p-3">Cross Section for secondary</td>
              <td className="border border-black p-3">{data.crossForSecondary} sq. mm</td>
            </tr>
            <tr className="h-20">
              <td className="border border-black p-3">6</td>
              <td className="border border-black p-3">Secondary turns</td>
              <td className="border border-black p-3">{data.secondaryTurns} turns</td>
            </tr>
            <tr className="h-20">
              <td className="border border-black p-3">7</td>
              <td className="border border-black p-3">Length of Primary</td>
              <td className="border border-black p-3">{data.lenOfPrim} mm</td>
            </tr>
            <tr className="h-20">
              <td className="border border-black p-3">8</td>
              <td className="border border-black p-3">Insulation On Primary</td>
              <td className="border border-black p-3">{data.insOnPrimary} KV</td>
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

export default PrintPageCT;