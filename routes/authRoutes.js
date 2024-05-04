import authenticateToken from "../middlewares/authMiddlewares.js";
import { register, login } from '../controllers/authController.js';
import express from 'express';

// Create router object
const router = express.Router();

// Use the authenticateToken middleware for specific routes
router.post("/register", register);
router.post("/login", login);
router.post("/", authenticateToken); // Apply the middleware to all routes under this path

export default router;