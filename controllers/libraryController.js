import UserLibrary from '../models/userLibrary.js';
import Book from '../models/book.js';


export const getPurchasedBooks = async (req, res) => {
  try {
    const userLibrary = await UserLibrary.find({ userId: req.user.id })
      .populate({
        path: 'bookId',
        select: 'title author imageUrl description price'
      })
      .sort({ purchaseDate: -1 });

      userLibrary.forEach(async (item) => {
        const book = await Book.findById(item.bookId);
        item.bookId = book;
      });

    res.json(userLibrary);
  } catch (error) {
    console.error('Error fetching purchased books:', error);
    res.status(500).json({ message: 'Error fetching library books' });
  }
};

export const updateReadingStatus = async (req, res) => {
  try {
    const bookId  = req.params.id;
    const status = req.body.status;

    console.log('bookId', bookId.id);
    console.log('status', req.body.status);

    if (!['not-started', 'reading', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid reading status' });
    }

    const updatedBook = await UserLibrary.findOneAndUpdate(
      { userId: req.user._id, bookId: bookId },
      { readingStatus: status },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found in library' });
    }

    res.json({ message: 'Reading status updated successfully', status });
  } catch (error) {
    console.error('Error updating reading status:', error);
    res.status(500).json({ message: 'Error updating reading status' });
  }
};

export const saveBookNotes = async (req, res) => {
  try {
    const bookId  = req.params.id;
    const notes  = req.body.notes;

    const updatedBook = await UserLibrary.findOneAndUpdate(
      { userId: req.user._id, bookId },
      { notes },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found in library' });
    }

    res.json({ message: 'Notes saved successfully', notes });
  } catch (error) {
    console.error('Error saving notes:', error);
    res.status(500).json({ message: 'Error saving notes' });
  }
};

export const addToLibrary = async (req, res) => {
  try {
    const bookId= req.params.id;

    const existingEntry = await UserLibrary.findOne({
      userId: req.user._id,
      bookId
    });

    if (existingEntry) {
      return res.status(400).json({ message: 'Book already in library' });
    }

    const newLibraryEntry = new UserLibrary({
      userId: req.user._id,
      bookId,
      readingStatus: 'not-started',
      purchaseDate: new Date()
    });

    await newLibraryEntry.save();

    res.status(201).json({ message: 'Book added to library successfully' });
  } catch (error) {
    console.error('Error adding book to library:', error);
    res.status(500).json({ message: 'Error adding book to library' });
  }
};

export const removeFromLibrary = async (req, res) => {
  try {
    const  bookId  = req.params.id;
    await UserLibrary.findOneAndDelete({ userId: req.user._id, bookId: bookId });
    res.json({ message: 'Book removed from library successfully' });
  } catch (error) {
    console.error('Error removing book from library:', error);
    res.status(500).json({ message: 'Error removing book from library' });
  }
};
