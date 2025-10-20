import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <Navbar isLoggedIn={false} showSignOut={false} />
      
      {/* Full-width Hero Section */}
      <div className="relative min-h-screen w-full flex items-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-primary-400/30 to-accent-400/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-br from-accent-400/20 to-primary-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side - Image */}
            <div className="hidden lg:block animate-float">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-3xl blur-[100px] opacity-20"></div>
                <div className="relative glass rounded-3xl overflow-hidden p-8 lg:p-12 shadow-2xl border border-white/20">
                  <img 
                    id="LoginSignUpImage" 
                    src="/LoginSignUpImage.png" 
                    alt="Forgot Password" 
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="animate-slide-up">
              <div className="max-w-md mx-auto lg:mx-0">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 rounded-full mb-6 animate-scale-in">
                  <Sparkles className="w-5 h-5 text-accent-600" />
                  <span className="text-sm font-semibold text-accent-700">Password Recovery</span>
                </div>

                <h2 className="text-5xl sm:text-6xl font-extrabold mb-4 leading-tight">
                  <span className="gradient-text drop-shadow-sm">Forgot Password?</span>
                </h2>
                <p className="text-lg text-gray-600 mb-8">No worries, we'll send you reset instructions</p>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 animate-shake">
                    <p className="font-medium">{error}</p>
                  </div>
                )}

                {isSubmitted ? (
                  <div className="glass p-8 rounded-2xl shadow-lg border border-white/20 animate-scale-in">
                    <div className="bg-primary-100 border-l-4 border-primary-600 text-primary-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
                      <CheckCircle className="w-5 h-5" />
                      <p className="font-medium">We've sent an OTP to {email}</p>
                    </div>
                    
                    <p className="text-gray-600 mb-6">
                      Please check your email for a 6-digit OTP code. Use this code to reset your password.
                    </p>
                    
                    <button 
                      onClick={handleNavigateToReset}
                      className="btn-primary w-full py-4 flex items-center justify-center gap-2 shadow-lg"
                    >
                      Enter OTP to Reset Password
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
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
                            className="input-field pl-12 py-4"
                            placeholder="you@example.com"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Enter your registered email address</p>
                      </div>
                      
                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-xl transition-shadow animate-fade-in"
                        style={{ animationDelay: '0.2s' }}
                      >
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending OTP...
                          </>
                        ) : (
                          <>
                            Send OTP
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </form>
                    
                    <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                      <p className="text-gray-600">
                        Remembered your password? 
                        <Link to="/login" className="text-primary-600 ml-1 hover:underline font-semibold">
                          Login here
                        </Link>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;