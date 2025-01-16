import Command from '../models/command.js';
import Book from '../models/book.js';
import User from '../models/user.js';
import { getRelatedBooksWithAuthor, getRelatedBooksWithCategory , getBestSellers} from './bookController.js';

export const createCommand = async (req, res) => {
  const { items } = req.body.items;
  const userId = req.user.id;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Invalid order items' });
  }
  
  try {

    let totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderItems = [];

    // First, validate all items and check stock
    for (const item of items) {
      console.log('Processing item:', item);
      
      const book = await Book.findById(item.bookId);
      
      if (!book) {
        console.log('Book not found:', item.bookId);
        return res.status(404).json({ 
          message: `Book not found: ${item.bookId}` 
        });
      }

      if (book.stock < item.quantity) {
        console.log('Insufficient stock for book:', book.title);
        return res.status(400).json({ 
          message: `Not enough stock for book: ${book.title}` 
        });
      }

      orderItems.push({
        book: book._id,
        quantity: item.quantity,
        price: book.price
      });
    }

    console.log('Order items prepared:', orderItems);
    console.log('Total amount:', totalAmount);

    // Create and save the command first
    const command = new Command({
      user: userId,
      items: orderItems,
      totalAmount,
      status: 'completed'
    });

    await command.save();
    console.log('Command saved successfully');

    // Update user total purchases and total spent
    await User.findByIdAndUpdate(userId, {
      $inc: {
        totalPurchases: 1,
        totalSpent: totalAmount,
      },
    });

    // Update sales count for each book
    const bookSales = {};

    await Command.populate(command, { path: 'items.book' });

    command.items.forEach(item => {
      const book = item.book;

      if (!book) {
        console.log('Book not found for item:', item);
        return;
      }

      if (!bookSales[book._id]) {
        bookSales[book._id] = {
          _id: book._id,
          title: book.title,
          salesCount: 0
        };
      }

      bookSales[book._id].salesCount += item.quantity;
    });

    console.log("object :", Object.values(bookSales));

    // Update stock for each book
    for (const item of items) {
      await Book.findByIdAndUpdate(
        item.bookId,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
    }
    console.log('Books stock updated');



    // Populate book details for response
    await command.populate('items.book');

    let relatedBooksWithAuthor = [];
    let relatedBooksWithCategory = [];
    let bestSellers = [];
    // Get related books
    for(const item of command.items) {
      relatedBooksWithAuthor = await getRelatedBooksWithAuthor(item.book._id);
      relatedBooksWithCategory = await getRelatedBooksWithCategory(item.book._id);
      relatedBooksWithAuthor.push(...relatedBooksWithAuthor);
      relatedBooksWithCategory.push(...relatedBooksWithCategory);
    }
    bestSellers = await getBestSellers();
    // Send the response only once
    res.status(201).json({
      message: 'Order created successfully',
      command,
      relatedBooksWithAuthor,
      relatedBooksWithCategory,
      bestSellers
    });
  } catch (error) {
    console.error('Error creating command:', error);
    res.status(500).json({ message: 'Error processing order', error: error.message });
  }
};

export const getUserCommands = async (req, res) => {
  try {
    const commands = await Command.find({ user: req.user._id })
      .populate('items.book')
      .sort({ createdAt: -1 });

    res.json(commands);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

export const getCommandById = async (req, res) => {
  try {
    const command = await Command.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('items.book');

    if (!command) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(command);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order' });
  }
}; 
