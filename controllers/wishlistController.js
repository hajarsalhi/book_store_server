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
  const bookId  = req.body.bookId;
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
  try {
    const bookId = req.params.id;
    
    const result = await Wishlist.findOneAndUpdate(
      { userId: req.user.id },
      { $pull: { books: bookId } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ 
        success: false, 
        message: 'Wishlist not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Book removed from wishlist',
      wishlist: result
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error removing from wishlist', 
      error: error.message 
    });
  }
}; 