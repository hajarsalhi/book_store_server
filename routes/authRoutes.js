import express from 'express';
import { login, verifyToken, signup } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.get('/verify', verifyToken);
router.post('/signup', signup);

export default router; 