import express from 'express';
import { auth } from '../middleware/auth.js';
const router = express.Router();
import {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook
} from '../controllers/bookController.js';



router.get('/', getBooks);
router.get('/:id', getBook);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

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

export default router;


