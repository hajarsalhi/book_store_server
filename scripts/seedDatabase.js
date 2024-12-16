import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Book from '../models/book.js';
import User from '../models/user.js';

dotenv.config();

// Sample data
const books = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A story of decadence and excess, Gatsby explores the darker aspects of the American Dream.",
    price: 9.99,
    stock: 50,
    image: "https://example.com/gatsby.jpg"
  },
  {
    title: "1984",
    author: "George Orwell",
    description: "A dystopian social science fiction novel and cautionary tale.",
    price: 12.99,
    stock: 75,
    image: "https://example.com/1984.jpg"
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "A story of racial injustice and the loss of innocence in the American South.",
    price: 11.99,
    stock: 60,
    image: "https://example.com/mockingbird.jpg"
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "A fantasy novel about the adventures of hobbit Bilbo Baggins.",
    price: 14.99,
    stock: 45,
    image: "https://example.com/hobbit.jpg"
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "A romantic novel of manners about marriage and social status.",
    price: 8.99,
    stock: 55,
    image: "https://example.com/pride.jpg"
  }
];


const users = [
  {
    username: "john_doe",
    email: "john@example.com",
    password: "john123",
    fullName: "John Doe",
    role: "user",
    isActive: true,
    address: {
      street: "456 User Lane",
      city: "User City",
      state: "US",
      zipCode: "67890"
    },
    phoneNumber: "098-765-4321"
  },
  {
    username: "jane_smith",
    email: "jane@example.com",
    password: "jane123",
    fullName: "Jane Smith",
    role: "user",
    isActive: true,
    address: {
      street: "789 Reader Ave",
      city: "Reader City",
      state: "RS",
      zipCode: "13579"
    },
    phoneNumber: "555-555-5555"
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore')
  .then(() => console.log('MongoDB connected for seeding...'))
  .catch(err => console.error('MongoDB connection error:', err));

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Book.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Insert books
    const createdBooks = await Book.insertMany(books);
    console.log(`Inserted ${createdBooks.length} books`);

    // Hash passwords and insert users
    const hashedUsers = await Promise.all(users.map(async user => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      return { ...user, password: hashedPassword };
    }));

    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`Inserted ${createdUsers.length} users`);


    
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      fullName: 'Admin User',
      role: 'admin',
      isActive: true,
      isAdmin: true
    });

await adminUser.save();
    console.log('Admin user created successfully');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }


};

// Run the seed function
seedDatabase(); 