import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, Shield, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <Navbar isLoggedIn={false} showSignOut={false} />
      
      {/* Full-width Hero Section */}
      <div className="relative min-h-screen w-full flex items-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-accent-400/30 to-primary-400/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-primary-400/20 to-accent-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side - Image */}
            <div className="hidden lg:block animate-float">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-400 to-primary-400 rounded-3xl blur-[100px] opacity-20"></div>
                <div className="relative glass rounded-3xl overflow-hidden p-8 lg:p-12 shadow-2xl border border-white/20">
                  <img 
                    id="LoginSignUpImage" 
                    src="/LoginSignUpImage.png" 
                    alt="Reset Password" 
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="animate-slide-up">
              <div className="max-w-md mx-auto lg:mx-0">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 rounded-full mb-6 animate-scale-in">
                  <Shield className="w-5 h-5 text-accent-600" />
                  <span className="text-sm font-semibold text-accent-700">Secure Reset</span>
                </div>

                <h2 className="text-5xl sm:text-6xl font-extrabold mb-4 leading-tight">
                  <span className="gradient-text drop-shadow-sm">Reset Password</span>
                </h2>
                <p className="text-lg text-gray-600 mb-8">Enter your OTP and create a new secure password</p>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 animate-shake">
                    <p className="font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <label 
                      htmlFor="email" 
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={!!localStorage.getItem('resetEmail')}
                        className="input-field pl-12 py-4 disabled:bg-gray-100 disabled:text-gray-500"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <label 
                      htmlFor="otp" 
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      OTP Code
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Shield className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        id="otp" 
                        name="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                        required
                        className="input-field pl-12 py-4 text-2xl tracking-widest font-semibold"
                        placeholder="000000"
                        maxLength="6"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Enter the 6-digit code from your email
                    </p>
                  </div>
                  
                  <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <label 
                      htmlFor="newPassword" 
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="password" 
                        id="newPassword" 
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="input-field pl-12 py-4"
                        placeholder="••••••••"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Must be at least 8 characters with uppercase, lowercase, and number
                    </p>
                  </div>
                  
                  <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <label 
                      htmlFor="confirmPassword" 
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="password" 
                        id="confirmPassword" 
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="input-field pl-12 py-4"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-50 mt-8 shadow-lg hover:shadow-xl transition-shadow animate-fade-in"
                    style={{ animationDelay: '0.5s' }}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Resetting Password...
                      </>
                    ) : (
                      <>
                        Reset Password
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  
                  <div className="text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
                    <p className="text-gray-600">
                      Didn't receive the OTP? 
                      <Link to="/forgot-password" className="text-primary-600 ml-1 hover:underline font-semibold">
                        Request again
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;