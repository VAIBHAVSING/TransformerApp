import jwt from 'jsonwebtoken';
import User from '../Models/User.js';
import { sendEmail } from '../Utils/emailService.js';
import crypto from 'crypto';

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

// FORGOT PASSWORD - Generate and send OTP
export const forgotPassword = async (req, res) => {
  try {
    // 1) Get user based on email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'There is no user with that email address.'
      });
    }

    // 2) Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    
    // 3) Set OTP and expiration time (10 minutes)
    user.resetPasswordOTP = await bcrypt.hash(otp, 8); // Hash OTP for security
    user.resetPasswordOTPExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    // 4) Send OTP to user's email
    const message = `
      <h1>Password Reset Request</h1>
      <p>Your password reset OTP is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your Password Reset OTP (valid for 10 min)',
        html: message
      });

      res.status(200).json({
        status: 'success',
        message: 'OTP sent to email!'
      });
    } catch (err) {
      user.resetPasswordOTP = undefined;
      user.resetPasswordOTPExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        status: 'error',
        message: 'There was an error sending the email. Try again later!'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// VERIFY OTP AND RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // 1) Get user based on email
    const user = await User.findOne({
      email,
      resetPasswordOTPExpires: { $gt: Date.now() }
    }).select('+resetPasswordOTP');

    // 2) Check if user exists and OTP is valid
    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'OTP is invalid or has expired'
      });
    }

    // 3) Compare provided OTP with stored OTP
    const isOTPValid = await bcrypt.compare(otp, user.resetPasswordOTP);

    if (!isOTPValid) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid OTP'
      });
    }

    // 4) If OTP is valid, update password
    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    await user.save();

    // 5) Log the user in, send JWT
    createSendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};