import mongoose from 'mongoose';
import Command from '../models/command.js';
import Book from '../models/book.js';

export const createCommand = async (req, res) => {
  try {
    const { items } = req.body;
    
    console.log('Received items:', items);
    console.log('User ID:', req.user._id);
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invalid order items' });
    }

    let totalAmount = 0;
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

      totalAmount += book.price * item.quantity;
    }

    console.log('Order items prepared:', orderItems);
    console.log('Total amount:', totalAmount);

    // Create and save the command first
    const command = new Command({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      status: 'completed'
    });

    await command.save();
    console.log('Command saved');

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

    res.status(201).json({
      message: 'Order created successfully',
      command
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error processing order' });
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