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
  getCategories,
  getTopRatedBooks,
  getBestSellers
} from '../controllers/bookController.js';

const router = express.Router();

router.get('/search', searchBooks);
router.get('/categories', getCategories);
router.get('/', getBooks);
router.post('/', createBook);
router.get('/', getTopRatedBooks);
router.get('/', getBestSellers);
router.get('/:id', getBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

router.get('/:id/reviews', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate({
        path: 'reviews.user',
        select: 'name username _id'
      });
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    const reviews = book.reviews.map(review => ({
      ...review.toObject(),
      user: review.user._id
    }));
    
    res.json(reviews);
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

router.post('/:id/reviews', async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const review = {
      user: req.user._id,
      userName: req.user.username || req.user.name,
      rating,
      comment,
      createdAt: new Date()
    };

    book.reviews.push(review);
    book.updateAverageRating();
    await book.save();

    res.status(201).json({
      ...review,
      _id: book.reviews[book.reviews.length - 1]._id
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Error adding review' });
  }
});

router.put('/:bookId/reviews/:reviewId', async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const review = book.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() === req.user._id.toString()) {
      review.rating = req.body.rating;
      review.comment = req.body.comment;
      book.updateAverageRating();
      await book.save();

      res.json(review);
    } else {
      return res.status(403).json({ message: 'Not authorized' });
    }
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Error updating review' });
  }
});

router.use(auth);

router.delete('/:bookId/reviews/:reviewId', async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const review = book.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Convert IDs to strings for comparison
    const reviewUserId = review.user.toString();
    const currentUserId = req.user._id.toString();

    if (reviewUserId !== currentUserId) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    // Use pull to remove the subdocument
    book.reviews.pull({ _id: req.params.reviewId });
    book.updateAverageRating();
    await book.save();

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Error deleting review' });
  }
});


export default router;


