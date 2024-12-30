import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: String,
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxLength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

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
      'Classic',
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
  },
  reviews: [reviewSchema],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0
  },
  priceHistory: [{ price: Number, date: { type: Date, default: Date.now } }]
});

// Update the updatedAt timestamp before saving
bookSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Add method to update average rating
bookSchema.methods.updateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.totalRatings = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = Math.round((sum / this.reviews.length) * 10) / 10;
    this.totalRatings = this.reviews.length;
  }
};

const Book = mongoose.model('Book', bookSchema);

export default Book;
