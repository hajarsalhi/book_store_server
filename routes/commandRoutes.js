import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  createCommand,
  getUserCommands,
  getCommandById
} from '../controllers/commandController.js';

const router = express.Router();

// Protected routes - require authentication
router.use(auth);

router.post('/', createCommand);
router.get('/', getUserCommands);
router.get('/:id', getCommandById);

export default router; 