import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['percentage', 'fixed', 'freeShipping'], required: true },
  discountValue: { type: Number, required: true },
  expirationDate: { type: Date, required: true },
  usageLimit: { type: Number, default: 1 }, // Limit how many times a coupon can be used
  usedCount: { type: Number, default: 0 }, // Track how many times the coupon has been used
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Track users who have used the coupon
});

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon; 