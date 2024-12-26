import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Book from '../models/book.js';
import User from '../models/user.js';
import Coupon from '../models/Coupon.js';
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
  },
  {
    title: "The Power of Now",
    author: "Eckhart Tolle",
    description: "A spiritual self-help book about the present moment and the power of consciousness.",
    price: 12.99,
    imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=500&h=750",
    stock: 50,
    category: "Self-Help"
  },
  {
    title: 'Harry Potter and the Sorcerer\'s Stone',
    author: 'J.K. Rowling',
    category: 'Fantasy',
    description: 'A young boy discovers he is a wizard and attends a magical school.',
    price: 19.99,
    imageUrl: 'https://example.com/hp1.jpg',
    stock: 100,
  },
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
    category: 'Fantasy',
    description: 'Harry returns for his second year at Hogwarts and faces new challenges.',
    price: 19.99,
    imageUrl: 'https://example.com/hp2.jpg',
    stock: 100,
  },
  {
    title: 'Harry Potter and the Prisoner of Azkaban',
    author: 'J.K. Rowling',
    category: 'Fantasy',
    description: 'Harry learns more about his past and faces a dangerous escaped prisoner.',
    price: 19.99,
    imageUrl: 'https://example.com/hp3.jpg',
    stock: 100,
  },
  {
    title: 'Harry Potter and the Goblet of Fire',
    author: 'J.K. Rowling',
    category: 'Fantasy',
    description: 'Harry competes in a dangerous magical tournament.',
    price: 19.99,
    imageUrl: 'https://example.com/hp4.jpg',
    stock: 100,
  },
  {
    title: 'A Game of Thrones',
    author: 'George R.R. Martin',
    category: 'Fantasy',
    description: 'Noble families vie for control of the Iron Throne in a land of ice and fire.',
    price: 24.99,
    imageUrl: 'https://example.com/got1.jpg',
    stock: 50,
  },
  {
    title: 'A Clash of Kings',
    author: 'George R.R. Martin',
    category: 'Fantasy',
    description: 'The battle for the Iron Throne intensifies as new factions emerge.',
    price: 24.99,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&h=750',
    stock: 50,
  },
  {
    title: 'A Storm of Swords',
    author: 'George R.R. Martin',
    category: 'Fantasy',
    description: 'The war for the Seven Kingdoms reaches a bloody climax.',
    price: 24.99,
    imageUrl: 'https://example.com/got3.jpg',
    stock: 50,
  },
  {
    title: 'A Feast for Crows',
    author: 'George R.R. Martin',
    category: 'Fantasy',
    description: 'The aftermath of war leaves the realm in chaos.',
    price: 24.99,
    imageUrl: 'https://example.com/got4.jpg',
    stock: 50,
  },
  {
    title: 'Murder on the Orient Express',
    author: 'Agatha Christie',
    category: 'Mystery',
    description: 'Detective Hercule Poirot solves a murder on a luxurious train.',
    price: 14.99,
    imageUrl: 'https://example.com/agatha1.jpg',
    stock: 75,
  },
  {
    title: 'And Then There Were None',
    author: 'Agatha Christie',
    category: 'Mystery',
    description: 'Ten strangers are invited to an island, where they are killed one by one.',
    price: 14.99,
    imageUrl: 'https://example.com/agatha2.jpg',
    stock: 75,
  },
  {
    title: 'The Murder of Roger Ackroyd',
    author: 'Agatha Christie',
    category: 'Mystery',
    description: 'A murder mystery that challenges the reader’s assumptions.',
    price: 14.99,
    imageUrl: 'https://example.com/agatha3.jpg',
    stock: 75,
  },
  {
    title: 'Death on the Nile',
    author: 'Agatha Christie',
    category: 'Mystery',
    description: 'A wealthy heiress is murdered on a Nile cruise, and Poirot investigates.',
    price: 14.99,
    imageUrl: 'https://example.com/agatha4.jpg',
    stock: 75,
  },
  {
    title: 'Sense and Sensibility',
    author: 'Jane Austen',
    category: 'Classic',
    description: 'The story of the Dashwood sisters and their romantic entanglements.',
    price: 12.99,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&h=750',
    stock: 80,
  },
  {
    title: 'Emma',
    author: 'Jane Austen',
    category: 'Classic',
    description: 'A young woman meddles in the romantic affairs of her friends.',
    price: 12.99,
    imageUrl: 'https://example.com/austen3.jpg',
    stock: 80,
  },
  {
    title: 'Mansfield Park',
    author: 'Jane Austen',
    category: 'Classic',
    description: 'A story of social class and morality in early 19th-century England.',
    price: 12.99,
    imageUrl: 'https://example.com/austen4.jpg',
    stock: 80,
  },
  {
    title: 'Tender Is the Night',
    author: 'F. Scott Fitzgerald',
    category: 'Classic',
    description: 'A story of love and ambition set in the 1920s.',
    price: 15.99,
    imageUrl: 'https://example.com/fitzgerald2.jpg',
    stock: 60,
  },
  {
    title: 'This Side of Paradise',
    author: 'F. Scott Fitzgerald',
    category: 'Classic',
    description: 'A novel about the life and loves of a young man in post-war America.',
    price: 15.99,
    imageUrl: 'https://example.com/fitzgerald3.jpg',
    stock: 60,
  },
  {
    title: 'The Beautiful and Damned',
    author: 'F. Scott Fitzgerald',
    category: 'Classic',
    description: 'A story of a young couple’s disillusionment in the Jazz Age.',
    price: 15.99,
    imageUrl: 'https://example.com/fitzgerald4.jpg',
    stock: 60,
  },
  {
    title: 'The Adventures of Tom Sawyer',
    author: 'Mark Twain',
    category: 'Classic',
    description: 'The adventures of a young boy growing up along the Mississippi River.',
    price: 10.99,
    imageUrl: 'https://example.com/twain1.jpg',
    stock: 90,
  },
  {
    title: 'Adventures of Huckleberry Finn',
    author: 'Mark Twain',
    category: 'Classic',
    description: 'A young boy’s journey down the Mississippi River with an escaped slave.',
    price: 10.99,
    imageUrl: 'https://example.com/twain2.jpg',
    stock: 90,
  },
  {
    title: 'The Prince and the Pauper',
    author: 'Mark Twain',
    category: 'Classic',
    description: 'Two boys from different backgrounds switch places and learn valuable lessons.',
    price: 10.99,
    imageUrl: 'https://example.com/twain3.jpg',
    stock: 90,
  },
  {
    title: 'A Connecticut Yankee in King Arthur\'s Court',
    author: 'Mark Twain',
    category: 'Classic',
    description: 'A modern man is transported back to medieval England.',
    price: 10.99,
    imageUrl: 'https://example.com/twain4.jpg',
    stock: 90,
  },
  {
    title: 'The Shining',
    author: 'Stephen King',
    category: 'Horror',
    description: 'A family becomes isolated in a haunted hotel.',
    price: 18.99,
    imageUrl: 'https://example.com/king1.jpg',
    stock: 40,
  },

  {
    title: 'It',
    author: 'Stephen King',
    category: 'Horror',
    description: 'A group of children confronts a shape-shifting entity that preys on their fears.',
    price: 18.99,
    imageUrl: 'https://example.com/king2.jpg',
    stock: 40,
  },
  {
    title: 'Misery',
    author: 'Stephen King',
    category: 'Horror',
    description: 'An author is held captive by his "number one fan."',
    price: 18.99,
    imageUrl: 'https://example.com/king3.jpg',
    stock: 40,
  },
  {
    title: 'Carrie',
    author: 'Stephen King',
    category: 'Horror',
    description: 'A high school girl discovers her telekinetic powers and seeks revenge.',
    price: 18.99,
    imageUrl: 'https://example.com/king4.jpg',
    stock: 40,
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category: 'Classic',
    description: 'A young girl learns about racial injustice in the Deep South.',
    price: 12.99,
    imageUrl: 'https://example.com/lee1.jpg',
    stock: 70,
  },
  {
    title: 'Go Set a Watchman',
    author: 'Harper Lee',
    category: 'Classic',
    description: 'A sequel to "To Kill a Mockingbird," exploring themes of race and identity.',
    price: 12.99,
    imageUrl: 'https://example.com/lee2.jpg',
    stock: 70,
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    category: 'Fantasy',
    description: 'A hobbit embarks on an adventure to reclaim a treasure guarded by a dragon.',
    price: 15.99,
    imageUrl: 'https://example.com/tolkien1.jpg',
    stock: 50,
  },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    author: 'J.R.R. Tolkien',
    category: 'Fantasy',
    description: 'A group of heroes sets out to destroy a powerful ring.',
    price: 15.99,
    imageUrl: 'https://example.com/tolkien2.jpg',
    stock: 50,
  },
  {
    title: 'The Lord of the Rings: The Two Towers',
    author: 'J.R.R. Tolkien',
    category: 'Fantasy',
    description: 'The quest to destroy the ring continues amidst growing darkness.',
    price: 15.99,
    imageUrl: 'https://example.com/tolkien3.jpg',
    stock: 50,
  },
  {
    title: 'The Lord of the Rings: The Return of the King',
    author: 'J.R.R. Tolkien',
    category: 'Fantasy',
    description: 'The final battle for Middle-earth and the fate of the ring.',
    price: 15.99,
    imageUrl: 'https://example.com/tolkien4.jpg',
    stock: 50,
  },
  {
    title: 'The Lion, the Witch and the Wardrobe',
    author: 'C.S. Lewis',
    category: 'Fantasy',
    description: 'Four siblings enter a magical land and battle an evil witch.',
    price: 10.99,
    imageUrl: 'https://example.com/lewis1.jpg',
    stock: 80,
  },
  {
    title: 'Prince Caspian',
    author: 'C.S. Lewis',
    category: 'Fantasy',
    description: 'The Pevensie siblings return to Narnia to help Prince Caspian reclaim his throne.',
    price: 10.99,
    imageUrl: 'https://example.com/lewis2.jpg',
    stock: 80,
  },
  {
    title: 'The Voyage of the Dawn Treader',
    author: 'C.S. Lewis',
    category: 'Fantasy',
    description: 'A sea voyage to find lost lords and discover new lands.',
    price: 10.99,
    imageUrl: 'https://example.com/lewis3.jpg',
    stock: 80,
  },
  {
        title: 'The Silver Chair',
        author: 'C.S. Lewis',
        category: 'Fantasy',
        description: 'Eustace and Jill embark on a quest to rescue Prince Rilian.',
        price: 10.99,
        imageUrl: 'https://example.com/lewis4.jpg',
        stock: 80,
      },
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


    // Sample coupons
    const coupons = [
      {
        code: 'SAVE10',
        discount: 10, // 10% off
        expirationDate: new Date('2023-12-31'),
      },
      {
        code: 'SAVE20',
        discount: 20, // 20% off
        expirationDate: new Date('2023-11-30'),
      },
      {
        code: 'FREESHIP',
        discount: 0, // Free shipping (could be treated as a fixed discount)
        expirationDate: new Date('2023-10-15'),
      },
      {
        code: 'WELCOME15',
        discount: 15, // 15% off for new users
        expirationDate: new Date('2024-01-01'),
      },
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
    await Coupon.deleteMany({});
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
    await Coupon.insertMany(coupons);
    console.log('Coupons seeded successfully!');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }


};

// Run the seed function
seedDatabase(); 