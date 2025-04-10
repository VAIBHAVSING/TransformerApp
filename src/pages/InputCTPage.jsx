import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const InputCTPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: '',
    burden: '',
    voltageRating: '',
    class: '',
    ctRatio: { numerator: '', denominator: '' },
    stc: ''
  });

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

  const handleCtRatioChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      ctRatio: {
        ...formData.ctRatio,
        [name]: value
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Store data in localStorage (you'd typically send this to a backend)
    localStorage.setItem('Type', formData.type);
    localStorage.setItem('VoltRat', formData.voltageRating);
    localStorage.setItem('Burden', formData.burden);
    localStorage.setItem('ClassType', formData.class);
    localStorage.setItem('CTNumerator', formData.ctRatio.numerator);
    localStorage.setItem('CTDenominator', formData.ctRatio.denominator);
    localStorage.setItem('STC', formData.stc);
    
    // Navigate to results page
    navigate('/ct-results');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={true} />
      
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent uppercase">
            Inputs for Current Transformer
          </h2>
        </div>
        
        <form 
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md"
        >
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
                  className="mr-2 h-5 w-5"
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
                  className="mr-2 h-5 w-5"
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
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">
              CT Ratio
            </label>
            <div className="flex items-center">
              <input
                type="text"
                name="numerator"
                value={formData.ctRatio.numerator}
                onChange={handleCtRatioChange}
                placeholder="Primary"
                required
                className="w-24 h-12 px-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <span className="mx-2 text-xl">/</span>
              <input
                type="text"
                name="denominator"
                value={formData.ctRatio.denominator}
                onChange={handleCtRatioChange}
                placeholder="Secondary"
                required
                className="w-24 h-12 px-3 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <span className="ml-2 text-lg">A</span>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="stc" className="block text-lg font-medium mb-2">
              Short Time Current (STC)
            </label>
            <div className="flex items-center">
              <input
                type="text"
                name="stc"
                id="stc"
                value={formData.stc}
                onChange={handleInputChange}
                required
                className="w-24 h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <span className="ml-2 text-lg">KA/1sec</span>
            </div>
          </div>
          
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-t from-green-700 to-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300"
            >
              Submit
            </button>
            
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition duration-300"
            >
              Back
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputCTPage;