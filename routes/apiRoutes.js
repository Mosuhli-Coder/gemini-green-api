import express from 'express';
import {authMiddleware} from '../middleware/authMiddleware.js';
import {signup, login, logout} from '../controllers/authController.js';
import {getProfile, updateProfile} from '../controllers/profileController.js';
import {calculateCarbonFootprint, getCarbonFootprintHistory} from '../controllers/carbonFootprintController.js';


const router = express.Router();

// Authentication
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Profile Management
router.get('/profile/:id', authMiddleware, getProfile);
router.post('/profile/update/:id', authMiddleware, updateProfile);

// Carbon Footprint Calculation
router.post('/carbon-footprint', authMiddleware, calculateCarbonFootprint);
router.get('/carbon-footprint/history', authMiddleware, getCarbonFootprintHistory);



export default router;
