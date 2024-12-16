import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import bookRoutes from './routes/bookRoutes.js';
import authRoutes from './routes/authRoutes.js';
//import userRoutes from './routes/userRoutes.js';
//import orderRoutes from './routes/orderRoutes.js';
import { errorHandler } from './middleware/errorhandler.js';




// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(errorHandler);

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);
//app.use('/api/users', userRoutes);
//app.use('/api/orders', orderRoutes);

// Error Handler
//app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});