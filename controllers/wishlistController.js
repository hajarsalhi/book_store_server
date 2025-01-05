import Wishlist from '../models/Wishlist.js';
import Book from '../models/book.js';

// Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    // Find the wishlist for the authenticated user
    const wishlist = await Wishlist.findOne({ userId: req.user._id }).populate('books');

    // Check if the wishlist exists
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    // Return the books in the wishlist
    res.json(wishlist.books); // This should be an array of book objects
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error });
  }
};

// Add a book to the user's wishlist
export const addToWishlist = async (req, res) => {
  const { bookId } = req.body;
  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: req.user._id },
      { $addToSet: { books: bookId } }, // Use $addToSet to avoid duplicates
      { new: true, upsert: true } // Create a new wishlist if it doesn't exist
    );
    res.status(201).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist', error });
  }
};

// Remove a book from the user's wishlist
export const removeFromWishlist = async (req, res) => {
  const { bookId } = req.params;
  try {
    await Wishlist.findOneAndUpdate(
      { userId: req.user._id },
      { $pull: { books: bookId } } // Remove the book from the wishlist
    );
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ message: 'Error removing from wishlist', error });
  }
}; 