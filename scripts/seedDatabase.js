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
    price: 15.99,
    imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=500&h=750",
    stock: 50,
    category: "Fiction"
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "A powerful story of racial injustice and the loss of innocence in the American South.",
    price: 14.99,
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&h=750",
    stock: 45,
    category: "Fiction"
  },
  {
    title: "1984",
    author: "George Orwell",
    description: "A dystopian social science fiction novel and cautionary tale about totalitarianism.",
    price: 12.99,
    imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=500&h=750",
    stock: 40,
    category: "Science Fiction"
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "A romantic novel of manners that explores the dependence of women on marriage in Georgian times.",
    price: 11.99,
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&h=750",
    stock: 35,
    category: "Romance"
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "A fantasy novel about the adventures of hobbit Bilbo Baggins.",
    price: 16.99,
    imageUrl: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?auto=format&fit=crop&w=500&h=750",
    stock: 55,
    category: "Fantasy"
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    description: "A story of teenage alienation and loss of innocence in postwar America.",
    price: 13.99,
    imageUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=500&h=750",
    stock: 30,
    category: "Fiction"
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    description: "An epic high-fantasy novel that follows the quest to destroy the One Ring.",
    price: 29.99,
    imageUrl: "https://images.unsplash.com/photo-1479894720049-a57d9a555e2c?auto=format&fit=crop&w=500&h=750",
    stock: 25,
    category: "Fantasy"
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    description: "A dystopian novel set in a futuristic World State of genetically modified citizens.",
    price: 12.99,
    imageUrl: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=500&h=750",
    stock: 38,
    category: "Science Fiction"
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    description: "A masterpiece of science fiction about power, politics, and humanity's future in a desert planet.",
    price: 19.99,
    imageUrl: "https://images.unsplash.com/photo-1603162525937-76c50fb53674?auto=format&fit=crop&w=500&h=750",
    stock: 42,
    category: "Science Fiction"
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    description: "A philosophical novel about following one's dreams and finding one's destiny.",
    price: 13.99,
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&h=750",
    stock: 60,
    category: "Philosophy"
  },
  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
    description: "A psychological thriller about a woman's act of violence against her husband.",
    price: 16.99,
    imageUrl: "https://images.unsplash.com/photo-1587876931567-564ce588bfbd?auto=format&fit=crop&w=500&h=750",
    stock: 35,
    category: "Thriller"
  },
  {
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    description: "An epic fantasy about a young man who becomes a legendary magician.",
    price: 18.99,
    imageUrl: "https://images.unsplash.com/photo-1528459105426-b9548367069b?auto=format&fit=crop&w=500&h=750",
    stock: 28,
    category: "Fantasy"
  },
  {
    title: "The Road",
    author: "Cormac McCarthy",
    description: "A post-apocalyptic tale of a journey of a father and his young son over a period of several months.",
    price: 15.99,
    imageUrl: "https://images.unsplash.com/photo-1598618589929-b1433d05cdf5?auto=format&fit=crop&w=500&h=750",
    stock: 25,
    category: "Post-Apocalyptic"
  },
  {
    title: "The Handmaid's Tale",
    author: "Margaret Atwood",
    description: "A dystopian novel about a woman's struggle in a totalitarian society.",
    price: 14.99,
    imageUrl: "https://images.unsplash.com/photo-1585437642374-53a1977f5604?auto=format&fit=crop&w=500&h=750",
    stock: 40,
    category: "Dystopian"
  },
  {
    title: "The Midnight Library",
    author: "Matt Haig",
    description: "A novel about life, death, and making choices through infinite possibilities.",
    price: 17.99,
    imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=500&h=750",
    stock: 45,
    category: "Contemporary Fiction"
  },
  {
    title: "Project Hail Mary",
    author: "Andy Weir",
    description: "A science fiction novel about an astronaut who wakes up alone on a spacecraft.",
    price: 20.99,
    imageUrl: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=500&h=750",
    stock: 32,
    category: "Science Fiction"
  },
  {
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    description: "A historical fiction about a Hollywood movie icon and her life secrets.",
    price: 16.99,
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&h=750",
    stock: 38,
    category: "Historical Fiction"
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    description: "A practical guide to breaking bad habits and building good ones.",
    price: 21.99,
    imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=500&h=750",
    stock: 50,
    category: "Self-Help"
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
    const hashedPassword = await bcrypt.hash('Admin99@dmin', 10);
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