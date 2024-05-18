import express from 'express';
import {authMiddleware} from '../middleware/authMiddleware.js';
import {signup, login, logout} from '../controllers/authController.js';
import {getUserProfile, updateUserProfile} from '../controllers/profileController.js';
import {calculateCarbonFootprint, getCarbonFootprintHistory} from '../controllers/carbonFootprintController.js';


const router = express.Router();

// Authentication
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Profile Management
router.get('/users/profile/:id', authMiddleware, getUserProfile);
router.post('/users/profile/update/:id', authMiddleware, updateUserProfile);

// Carbon Footprint Calculation
router.post('/carbon-footprint', authMiddleware, calculateCarbonFootprint);
router.get('/carbon-footprint/history', authMiddleware, getCarbonFootprintHistory);



export default router;
