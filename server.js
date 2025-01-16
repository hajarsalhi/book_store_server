import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import bookRoutes from './routes/bookRoutes.js';
import authRoutes from './routes/authRoutes.js';
import commandRoutes from './routes/commandRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import bookPacksRouter from './routes/bookPacksRouter.js';
import libraryRoutes from './routes/libraryRoutes.js';
import { errorHandler } from './middleware/errorhandler.js';
import couponRoutes from './routes/couponRoutes.js';
import { generateBookPacks } from './controllers/bookPackController.js';
import wishListRouter from './routes/wishListRouter.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://book-store-mlb4.onrender.com', // Add your frontend Render URL
    'https://book-store-server-z514.onrender.com'    // Add your backend Render URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Debug log for routes
console.log('Registering routes...');

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/commands', commandRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api',bookPacksRouter);
app.use('/api/library',libraryRoutes);
app.use('/api/wishlist',wishListRouter);

// Add a test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

console.log('Routes registered');

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

console.log('Current environment:', process.env.NODE_ENV);

app.listen(PORT, async() => {
  console.log(`Server running on port ${PORT}`);
  await generateBookPacks();
});