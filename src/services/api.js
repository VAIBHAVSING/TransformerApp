import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with credentials support
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication services
export const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/user/register', userData);
      if (response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/user/login', credentials);
      if (response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.get('/user/logout');
      localStorage.removeItem('userToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Get current user data
  getCurrentUser: async () => {
    try {
      const response = await api.get('/user/me');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch user data';
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('userToken');
  },

  // Request password reset OTP
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/user/forgotPassword', { email });
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send reset OTP'
      };
    }
  },

  // Reset password with OTP
  resetPassword: async (data) => {
    try {
      const response = await api.post('/user/resetPassword', data);
      if (response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to reset password'
      };
    }
  }
};

// Model prediction services
export const modelService = {
  // PT model prediction
  predictPT: async (payload) => {
    try {
      const response = await api.post('/model/predict_pt', payload);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get prediction results'
      };
    }
  },

  // CT model prediction
  predictCT: async (payload) => {
    try {
      const response = await api.post('/model/predict_ct', payload);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get CT prediction results'
      };
    }
  }
};

// Add authorization header for protected requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;