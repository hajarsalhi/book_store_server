import express from 'express';
import { validateCoupon, calculateLoyaltyDiscount } from '../controllers/couponController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/validate', validateCoupon);
router.post('/loyalty-discount', auth, calculateLoyaltyDiscount);

export default router; 