import mongoose from 'mongoose';


const userLibrarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  readingStatus: {
    type: String,
    enum: ['not-started', 'reading', 'completed'],
    default: 'not-started'
  },
  notes: {
    type: String,
    default: ''
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Compound index to ensure a user can't have duplicate books
userLibrarySchema.index({ userId: 1, bookId: 1 }, { unique: true });

export default mongoose.model('UserLibrary', userLibrarySchema);
