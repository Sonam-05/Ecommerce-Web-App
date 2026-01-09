import express from 'express';
import {
    getSalesAnalytics,
    getDashboardStats
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
import { adminAuthen } from '../utils/authenticator.js';

const router = express.Router();

router.get("/sales", protect, admin, getSalesAnalytics);
router.get('/dashboard', protect, admin, getDashboardStats);

export default router;
