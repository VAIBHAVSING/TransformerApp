import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import axios from 'axios';

// Import routes
import userRoutes from './Routes/UserRoutes.js';

// Configure environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Frontend URL from environment or default
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
// Configure CORS with proper options
app.use(cors({
  origin: FRONTEND_URL, // Use FRONTEND_URL instead of allowing all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Requested-With', 'Authorization'],
  credentials: true // Allow credentials
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/user', userRoutes);

// Model API configuration
const MODEL_API_URL = process.env.MODEL_API_URL || 'http://localhost:5000';

// Import authentication middleware
import { protect } from './Middlewares/authMiddleware.js';

// Proxy routes for model predictions (protected by auth middleware)
app.post('/api/model/predict', protect, async (req, res) => {
  try {
    console.log('hii')
    const response = await axios.post(`${MODEL_API_URL}/predict`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling model API:', error.message);
    res.status(error.response?.status || 500).json({
      status: 'error',
      message: error.response?.data?.error || 'Error processing prediction request'
    });
  }
});

app.post('/api/model/predict_ct', protect, async (req, res) => {
  try {
    const response = await axios.post(`${MODEL_API_URL}/predict_ct`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling CT model API:', error.message);
    res.status(error.response?.status || 500).json({
      status: 'error',
      message: error.response?.data?.error || 'Error processing CT prediction request'
    });
  }
});

app.post('/api/model/predict_pt', protect, async (req, res) => {
  try {
    const response = await axios.post(`${MODEL_API_URL}/predict`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling CT model API:', error.message);
    res.status(error.response?.status || 500).json({
      status: 'error',
      message: error.response?.data?.error || 'Error processing CT prediction request'
    });
  }
});
// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/transformerApp')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });