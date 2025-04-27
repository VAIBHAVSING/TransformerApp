import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { authService } from '../services/api';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if OTP was requested
  useEffect(() => {
    const storedEmail = localStorage.getItem('resetEmail');
    const otpSent = localStorage.getItem('otpSent');
    
    if (storedEmail) {
      setEmail(storedEmail);
    }
    
    if (!otpSent) {
      toast.warning('Please request an OTP first');
      navigate('/forgot-password');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Validation
    if (!email || !otp || !newPassword || !confirmPassword) {
      setError('All fields are required');
      toast.error('All fields are required');
      setIsLoading(false);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      toast.error("Passwords don't match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      toast.error("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, and one number");
      toast.error("Password must contain at least one uppercase letter, one lowercase letter, and one number");
      setIsLoading(false);
      return;
    }
    
    try {
      // Show loading toast
      const loadingToastId = toast.loading("Resetting your password...");
      
      const result = await authService.resetPassword({ 
        email, 
        otp, 
        newPassword 
      });
      
      // Dismiss the loading toast
      toast.dismiss(loadingToastId);
      
      if (result.success) {
        // Clear reset process data
        localStorage.removeItem('resetEmail');
        localStorage.removeItem('otpSent');
        
        toast.success("Password reset successfully! You can now log in with your new password.");
        navigate('/login');
      } else {
        setError(result.error || 'Password reset failed. Please try again.');
        toast.error(result.error || 'Password reset failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
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
                alt="Reset Password" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        <div className="md:w-1/2">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Reset Password</h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
              <div className="mb-4">
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
                  disabled={!!localStorage.getItem('resetEmail')}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="Enter your registered email"
                />
              </div>

              <div className="mb-4">
                <label 
                  htmlFor="otp" 
                  className="block text-gray-700 font-semibold mb-2"
                >
                  OTP Code:
                </label>
                <input 
                  type="text" 
                  id="otp" 
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter 6-digit OTP from your email"
                  maxLength="6"
                />
              </div>
              
              <div className="mb-4">
                <label 
                  htmlFor="newPassword" 
                  className="block text-gray-700 font-semibold mb-2"
                >
                  New Password:
                </label>
                <input 
                  type="password" 
                  id="newPassword" 
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter new password"
                />
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters with uppercase, lowercase, and number</p>
              </div>
              
              <div className="mb-6">
                <label 
                  htmlFor="confirmPassword" 
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Confirm Password:
                </label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Confirm new password"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-t from-green-700 to-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </button>
              
              <div className="mt-4 text-center">
                <p className="text-gray-600">
                  Didn't receive the OTP? 
                  <Link to="/forgot-password" className="text-green-600 ml-1 hover:underline">
                    Request again
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;