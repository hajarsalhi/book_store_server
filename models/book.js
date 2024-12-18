import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  imageUrl: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Fiction',
      'Non-Fiction',
      'Science Fiction',
      'Contemporary Fiction',
      'Historical Fiction',
      'Fantasy',
      'Mystery',
      'Thriller',
      'Romance',
      'Horror',
      'Biography',
      'History',
      'Philosophy',
      'Poetry',
      'Drama',
      'Children',
      'Young Adult',
      'Self-Help',
      'Business',
      'Technology',
      'Science',
      'Art',
      'Travel',
      'Health',
      'Cooking',
      'Religion',
      'Sports',
      'Post-Apocalyptic',
      'Dystopian',
      'Other'
    ],
    default: 'Other'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
bookSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Book = mongoose.model('Book', bookSchema);

export default Book;
