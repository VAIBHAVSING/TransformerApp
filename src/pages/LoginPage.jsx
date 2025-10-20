import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../App';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!email || !password) {
      setError('Please enter both email and password');
      toast.error('Please enter both email and password');
      setIsLoading(false);
      return;
    }
    
    try {
      const loadingToastId = toast.loading("Logging in...");
      
      const result = await login({ email, password });
      
      toast.dismiss(loadingToastId);
      
      if (result.success) {
        toast.success("Login successful!");
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed. Please try again.');
        toast.error(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      toast.error('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <Navbar isLoggedIn={false} showSignOut={false} />
      
      <div className="relative min-h-screen w-full flex items-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
            {/* Left Side - Image */}
            <div className="hidden lg:block animate-float">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-3xl blur-[100px] opacity-20"></div>
                <div className="relative glass rounded-3xl overflow-hidden p-8 lg:p-12 shadow-2xl">
                  <img 
                    src="/LoginSignUpImage.png" 
                    alt="Login" 
                    className="w-full h-auto rounded-2xl transform hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="animate-slide-up">
              <div className="max-w-md mx-auto lg:mx-0 lg:ml-auto">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm border border-primary-200 rounded-full shadow-sm mb-8">
                  <Sparkles className="w-5 h-5 text-primary-600 animate-pulse" />
                  <span className="text-sm font-semibold text-primary-700">Welcome Back</span>
                </div>

                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-4 leading-tight">
                  <span className="gradient-text drop-shadow-sm">Sign In</span>
                </h2>
                <p className="text-gray-600 mb-8 text-lg">Enter your credentials to access your account</p>

                  {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 animate-shake">
                    <p className="font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
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
                        className="input-field pl-12"
                      />
                    </div>
                  </div>
                  
                  <div>
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
                        className="input-field pl-12"
                      />
                    </div>
                    <div className="text-right mt-2">
                      <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full btn-primary flex items-center justify-center gap-2 text-lg py-4"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Logging in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">Don't have an account?</span>
                    </div>
                  </div>

                  <Link 
                    to="/register" 
                    className="w-full btn-secondary flex items-center justify-center gap-2 text-lg py-4"
                  >
                    Create Account
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

export default LoginPage;