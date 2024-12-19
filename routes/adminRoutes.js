import express from 'express';
import { adminAuth } from '../middleware/auth.js';
import { getSalesAnalytics } from '../controllers/adminController.js';

const router = express.Router();

console.log('Registering admin routes...');

// Test route without auth
router.get('/test', (req, res) => {
  res.json({ message: 'Admin routes are working' });
});

// Test route with auth
router.get('/test-auth', adminAuth, (req, res) => {
  res.json({ message: 'Admin auth is working' });
});

// Analytics route
router.get('/analytics/sales', adminAuth, getSalesAnalytics);

console.log('Admin routes registered');

export default router; 