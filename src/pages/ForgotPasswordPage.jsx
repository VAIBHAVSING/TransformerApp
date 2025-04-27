import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { authService } from '../services/api';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Clear any previous reset attempt data when component loads
  useEffect(() => {
    localStorage.removeItem('resetEmail');
    localStorage.removeItem('otpSent');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!email) {
      setError('Email is required');
      toast.error('Email is required');
      setIsLoading(false);
      return;
    }
    
    try {
      // Show loading toast
      const loadingToastId = toast.loading("Sending OTP to your email...");
      
      const result = await authService.forgotPassword(email);
      
      // Dismiss the loading toast
      toast.dismiss(loadingToastId);
      
      if (result.success) {
        // Store email for the reset password page
        localStorage.setItem('resetEmail', email);
        localStorage.setItem('otpSent', 'true');
        
        setIsSubmitted(true);
        toast.success("OTP has been sent to your email!");
      } else {
        setError(result.error || 'Failed to send OTP. Please try again.');
        toast.error(result.error || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToReset = () => {
    navigate('/reset-password');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={false} showSignOut={false} />
      
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center py-12">
        <div className="md:w-1/2 mb-10 md:mb-0 flex justify-center">
          <div className="w-4/5">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                id="LoginSignUpImage" 
                src="/LoginSignUpImage.png" 
                alt="Forgot Password" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        <div className="md:w-1/2">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Forgot Password</h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                {error}
              </div>
            )}

            {isSubmitted ? (
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                  <p>We've sent an OTP to {email}</p>
                </div>
                
                <p className="text-gray-600 mb-4">
                  Please check your email for a 6-digit OTP code. Use this code to reset your password.
                </p>
                
                <button 
                  onClick={handleNavigateToReset}
                  className="w-full block text-center py-3 bg-gradient-to-t from-green-700 to-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300"
                >
                  Enter OTP to Reset Password
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
                <p className="text-gray-600 mb-4">
                  Enter your email address and we'll send you an OTP to reset your password.
                </p>
                
                <div className="mb-6">
                  <label 
                    htmlFor="email" 
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Email:
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your registered email"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-t from-green-700 to-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300 disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </button>
                
                <div className="mt-4 text-center">
                  <p className="text-gray-600">
                    Remembered your password? 
                    <Link to="/login" className="text-green-600 ml-1 hover:underline">
                      Login here
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;