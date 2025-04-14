import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
      // Show loading toast
      const loadingToastId = toast.loading("Logging in...");
      
      const result = await login({ email, password });
      
      // Dismiss the loading toast
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
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={false} showSignOut={false} />
      
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center py-12">
        <div className="md:w-1/2 mb-10 md:mb-0 flex justify-center">
          <div className="w-4/5">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                id="LoginSignUpImage" 
                src="/LoginSignUpImage.png" 
                alt="Login" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        <div className="md:w-1/2">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Login</h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
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
                />
              </div>
              
              <div className="mb-6">
                <label 
                  htmlFor="password" 
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Password:
                </label>
                <input 
                  type="password" 
                  id="password" 
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="text-right mt-2">
                  <Link to="/forgot-password" className="text-sm text-green-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-t from-green-700 to-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
              
              <div className="mt-4 text-center">
                <p className="text-gray-600">
                  Don't have an account? 
                  <Link to="/register" className="text-green-600 ml-1 hover:underline">
                    Register here
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

export default LoginPage;