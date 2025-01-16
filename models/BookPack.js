import mongoose from 'mongoose';

const bookPackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }], // Reference to Book model
  createdAt: { type: Date, default: Date.now }
});

const BookPack = mongoose.model('BookPack', bookPackSchema);
export default BookPack;
