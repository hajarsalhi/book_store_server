import express from 'express';
import { auth } from '../middleware/auth.js';
import Book from '../models/book.js';
import {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
  getCategories
} from '../controllers/bookController.js';

const router = express.Router();

router.get('/search', searchBooks);
router.get('/categories', getCategories);
router.get('/', getBooks);
router.post('/', createBook);
router.get('/:id', getBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

router.get('/:id/reviews', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate({
        path: 'reviews.user',
        select: 'name'
      });
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json(book.reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

router.use(auth);

router.post('/purchase/:id', auth, async (req, res) => {
  try {
    const { quantity = 1 } = req.body;
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    if (book.stock < quantity) {
      return res.status(400).json({ message: 'Not enough books in stock' });
    }

    // Decrease stock by quantity
    book.stock -= quantity;
    await book.save();

    res.json({ message: 'Purchase successful', book });
  } catch (error) {
    res.status(500).json({ message: 'Error processing purchase' });
  }
});

router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user has already reviewed
    const existingReview = book.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    // Add new review
    book.reviews.push({
      user: req.user._id,
      userName: req.user.name,
      rating,
      comment
    });

    // Update average rating
    book.updateAverageRating();
    await book.save();

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error adding review' });
  }
});

router.put('/:bookId/reviews/:reviewId', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.bookId);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const review = book.reviews.id(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    review.rating = rating;
    review.comment = comment;
    review.updatedAt = Date.now();

    book.updateAverageRating();
    await book.save();

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error updating review' });
  }
});

router.delete('/:bookId/reviews/:reviewId', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const review = book.reviews.id(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    review.remove();
    book.updateAverageRating();
    await book.save();

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review' });
  }
});

export default router;


