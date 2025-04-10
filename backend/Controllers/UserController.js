import jwt from 'jsonwebtoken';
import User from '../Models/User.js';

// Helper function to create JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Helper function to send JWT token as cookie and response
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  // Cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_EXPIRES_IN) || 1) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  // Remove password from output
  user.password = undefined;

  res.status(statusCode)
    .cookie('jwt', token, cookieOptions)
    .json({
      status: 'success',
      token,
      data: { user }
    });
};

// Register new user
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email or username already in use'
      });
    }

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password
    });

    // Send token
    createSendToken(newUser, 201, res);
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }

    // Send token
    createSendToken(user, 200, res);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get current user info
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Logout user
export const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  
  res.status(200).json({ status: 'success' });
};