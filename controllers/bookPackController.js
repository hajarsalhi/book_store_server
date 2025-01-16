import Book from '../models/book.js';
import BookPack from '../models/BookPack.js';

export const generateBookPacks = async () => {
  try {
    // Example: Generate packs based on genres
    const categories = await Book.distinct('category'); // Get unique genres from books

    const packs = await Promise.all(categories.map(async (category) => {
      const books = await Book.find({ category }).limit(3); // Get top 3 books in this genre
      return {
        name: `${category}`,
        description: `A collection of popular ${category} books.`,
        books: books.map(book => book._id) // Store book IDs
      };
    }));

    // Save generated packs to the database
    await BookPack.deleteMany(); // Clear existing packs
    await BookPack.insertMany(packs); // Insert new packs

    return packs;
  } catch (error) {
    console.error('Error generating book packs:', error);
    throw error;
  }
};

export const getBookPacks = async (req, res) => {
  try {
    const packs = await BookPack.find({name:req.query.category}).populate('books'); // Populate book details
    res.status(200).json(packs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book packs' });
  }
};
