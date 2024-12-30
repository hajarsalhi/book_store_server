import Book from '../models/book.js';

// Get all books
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single book
export const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create book
export const createBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update book
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    Object.assign(book, req.body);
    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete book
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ _id: req.params.id });
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ 
      message: 'Book deleted successfully',
      book: book 
    });

  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ 
      message: 'Error deleting book', 
      error: error.message 
    });
  }
};

export const searchBooks = async (req, res) => {
  try {
    console.log('Search endpoint hit with query:', req.query);
    
    const {
      title,
      priceRange,
      category,
      author,
      publicationDate,
      rating,
      inStock
    } = req.query;

    let query = {};

    // Title filter
    if (title && title.trim()) {
      query.title = { 
        $regex: title.trim().split(/\s+/).map(word => 
          `(?=.*${word})`
        ).join(''), 
        $options: 'i' 
      };
    }

    // Category filter
    if (category) {
      const categories = category.split(',').filter(Boolean);
      if (categories.length > 0) {
        query.category = { $in: categories };
      }
    }

    // Price range filter
    if (priceRange) {
      try {
        const [min, max] = priceRange.split(',').map(Number);
        if (!isNaN(min) && !isNaN(max)) {
          query.price = { $gte: min, $lte: max };
        }
      } catch (err) {
        console.error('Price range parsing error:', err);
      }
    }

    // Author filter
    if (author && author.trim()) {
      query.author = { $regex: author.trim(), $options: 'i' };
    }

    // Publication date filter
    if (publicationDate) {
      try {
        const date = new Date(publicationDate);
        if (!isNaN(date.getTime())) {
          query.publicationDate = {
            $gte: date,
            $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000)
          };
        }
      } catch (err) {
        console.error('Date parsing error:', err);
      }
    }

    // Rating filter
    if (rating) {
      const ratingNum = parseFloat(rating);
      if (!isNaN(ratingNum)) {
        query.rating = { $gte: ratingNum };
      }
    }

    // Stock filter
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    console.log('Final MongoDB query:', JSON.stringify(query, null, 2));

    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .limit(title && !category && !author ? 10 : undefined);

    console.log(`Found ${books.length} matching books`);
    res.json(books);

  } catch (error) {
    console.error('Search books error:', error);
    res.status(500).json({ 
      message: 'Error searching books',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Add a new endpoint to get categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Book.distinct('category');
    res.json(categories.filter(Boolean)); // Filter out null/undefined values
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

// Fetch books sorted by rating
export const getTopRatedBooks = async (req, res) => {
  try {
    console.log('Fetching top-rated books');
    const books = await Book.find({ averageRating: { $gte: 4 } })
      .sort({ averageRating: -1 })
      .limit(3);
    console.log('Top-rated books fetched:', books);
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching top-rated books:', error);
    res.status(500).json({ message: 'Error fetching top-rated books from the database', error: error.message });
  }
};

export const getRelatedBooksWithAuthor = async (bookId) => {
  try {
    const book = await Book.findById(bookId);
    if (!book) {
      console.log('Book not found');
      return [];
    }
    const relatedBooks = await Book.find({
      $and: [
        { author: book.author },
        { title: { $ne: book.title } }
      ]
    }).limit(3);
    const uniqueRelatedBooks = Array.from(new Set(relatedBooks.map(b => b._id)))
      .map(id => relatedBooks.find(b => b._id === id));
    return uniqueRelatedBooks;
  } catch (error) {
    console.error('Error fetching related books:', error);
    return [];
  }
};

export const getRelatedBooksWithCategory = async (bookId) => {
  try {
    const book = await Book.findById(bookId);
    if (!book) {
      console.log('Book not found');
      return [];
    }
    const relatedBooks = await Book.find({
      $and: [
        { category: book.category },
        { title: { $ne: book.title } }
      ]
    }).limit(3);

    const uniqueRelatedBooks = Array.from(new Set(relatedBooks.map(b => b._id)))
      .map(id => relatedBooks.find(b => b._id === id));


    return uniqueRelatedBooks;
  } catch (error) {
    console.error('Error fetching related books:', error);
    return [];
  }
};

export const getBestSellers = async () => {
  try {
    const books = await Book.find({ salesCount: { $gt: 0 } })
      .sort({ salesCount: -1 })
      .limit(5);
    return books;
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    return [];
  }
};

export const getNewReleases = async (req, res) => {
  try {
    const newReleases = await Book.find({})
      .sort({ createdAt: -1 }) // Assuming you have a createdAt field
      .limit(4); // Limit to 4 most recent books
    res.status(200).json(newReleases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
