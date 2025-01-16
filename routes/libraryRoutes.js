import express from 'express';
const router = express.Router();
import { getPurchasedBooks, updateReadingStatus, saveBookNotes, addToLibrary, removeFromLibrary } from '../controllers/libraryController.js';
import { auth } from '../middleware/auth.js';

// All routes require authentication
router.use(auth);

// Get user's purchased books
router.get('/purchased-books', auth, getPurchasedBooks);

// Update reading status
router.put('/purchased-books/:id', auth, updateReadingStatus);

// Save notes
router.put('/purchased-books/:id/notes', auth, saveBookNotes);

// Add book to library (after purchase)
router.post('/purchased-books/:id', auth, addToLibrary);

// Remove book from library
router.delete('/purchased-books/:id', auth, removeFromLibrary);

export default router;