import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/api';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import InputCTPage from './pages/InputCTPage';
import InputPTPage from './pages/InputPTPage';
import PrintPageCT from './pages/PrintPageCT';
import PrintPagePT from './pages/PrintPagePT';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Create and export the auth context
export const AuthContext = React.createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = localStorage.getItem('user');
          if (userData) {
            setUser(JSON.parse(userData));
          } else {
            // If we have token but no user data, fetch it
            const response = await authService.getCurrentUser();
            setUser(response.data.user);
          }
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // If there's an error with the token, clear it
        authService.logout();
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.data.user);
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      setUser(response.data.user);
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    
    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }
    
    return children;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, logout }}>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/input-ct" 
            element={
              <ProtectedRoute>
                <InputCTPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/input-pt" 
            element={
              <ProtectedRoute>
                <InputPTPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ct-results" 
            element={
              <ProtectedRoute>
                <PrintPageCT />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pt-results" 
            element={
              <ProtectedRoute>
                <PrintPagePT />
              </ProtectedRoute>
            } 
          />
          
          {/* Logout route */}
          <Route 
            path="/logout" 
            element={
              <LogoutHandler logout={logout} />
            }
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

// Logout handler component
const LogoutHandler = ({ logout }) => {
  useEffect(() => {
    logout();
  }, [logout]);
  
  return <Navigate to="/login" />;
};

export default App;
