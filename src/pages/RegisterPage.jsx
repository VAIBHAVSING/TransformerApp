import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, User, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../App';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required');
      toast.error('All fields are required');
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      toast.error("Passwords don't match");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      toast.error("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }
    
    try {
      const loadingToastId = toast.loading("Creating your account...");
      
      const result = await register({ username, email, password });
      
      toast.dismiss(loadingToastId);
      
      if (result.success) {
        toast.success("Account created successfully!");
        navigate('/dashboard');
      } else {
        setError(result.error || 'Registration failed. Please try again.');
        toast.error(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
      toast.error('An error occurred during registration. Please try again.');
      console.error('Registration error:', err);
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
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-primary-400/30 to-accent-400/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-accent-400/20 to-primary-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side - Image */}
            <div className="hidden lg:block animate-float">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-3xl blur-[100px] opacity-20"></div>
                <div className="relative glass rounded-3xl overflow-hidden p-8 lg:p-12 shadow-2xl border border-white/20">
                  <img 
                    src="/LoginSignUpImage.png" 
                    alt="Registration" 
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="animate-slide-up">
              <div className="max-w-md mx-auto lg:mx-0">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 rounded-full mb-6 animate-scale-in">
                <Sparkles className="w-5 h-5 text-accent-600" />
                <span className="text-sm font-semibold text-accent-700">Join TransformerGO</span>
              </div>

              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-4 leading-tight">
                <span className="gradient-text drop-shadow-sm">Create Account</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">Get started with your free account today</p>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 animate-shake">
                  <p className="font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      id="username" 
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder="johndoe"
                      className="input-field pl-12 py-4"
                    />
                  </div>
                </div>

                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
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
                      placeholder="you@example.com"
                      className="input-field pl-12 py-4"
                    />
                  </div>
                </div>
                
                <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="password" 
                      id="password" 
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="input-field pl-12 py-4"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Must be at least 8 characters long
                  </p>
                </div>
                
                <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
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
                      placeholder="••••••••"
                      className="input-field pl-12 py-4"
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full btn-primary flex items-center justify-center gap-2 text-lg py-4 mt-8 animate-fade-in shadow-lg hover:shadow-xl transition-shadow"
                  style={{ animationDelay: '0.5s' }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                
                <div className="relative my-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gradient-to-br from-primary-50 via-white to-accent-50 text-gray-500">Already have an account?</span>
                  </div>
                </div>

                <Link 
                  to="/login" 
                  className="w-full btn-secondary flex items-center justify-center gap-2 text-lg py-4 animate-fade-in"
                  style={{ animationDelay: '0.7s' }}
                >
                  Sign In
                </Link>
              </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;