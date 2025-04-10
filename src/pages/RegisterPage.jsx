import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
    
    // Validation
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
      // Show loading toast
      const loadingToastId = toast.loading("Creating your account...");
      
      const result = await register({ username, email, password });
      
      // Dismiss the loading toast
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
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={false} showSignOut={false} />
      
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center py-12">
        <div className="md:w-1/2 mb-10 md:mb-0 flex justify-center">
          <div className="w-4/5">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                id="LoginSignUpImage" 
                src="/LoginSignUpImage.png" 
                alt="Registration" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        <div className="md:w-1/2">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Sign Up</h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
              <div className="mb-4">
                <label 
                  htmlFor="username" 
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Username:
                </label>
                <input 
                  type="text" 
                  id="username" 
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

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
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="mb-4">
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
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
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
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-t from-green-700 to-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Creating Account...' : 'Register'}
              </button>
              
              <div className="mt-4 text-center">
                <p className="text-gray-600">
                  Already have an account? 
                  <Link to="/login" className="text-green-600 ml-1 hover:underline">
                    Login here
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

export default RegisterPage;