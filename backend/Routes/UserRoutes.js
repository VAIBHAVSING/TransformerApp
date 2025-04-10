import express from 'express';
import { register, login, getMe, logout } from '../Controllers/UserController.js';
import { protect } from '../Middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

// Protected routes
router.get('/me', protect, getMe);

export default router;