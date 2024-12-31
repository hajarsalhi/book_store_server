import mongoose from 'mongoose';
import Coupon from '../models/Coupon.js'; 
import dotenv from 'dotenv';

dotenv.config();

const seedCoupons = async () => {
  const coupons = [
    {
      code: 'SUMMER10',
      discountType: 'percentage',
      discountValue: 10,
      expirationDate: new Date('2023-09-01'), // Expired
      usageLimit: 100,
      usedCount: 0,
      usedBy: []
    },
    {
      code: 'WINTER20',
      discountType: 'percentage',
      discountValue: 20,
      expirationDate: new Date('2024-01-01'), // Valid
      usageLimit: 50,
      usedCount: 0,
      usedBy: []
    },
    {
      code: 'FREESHIP',
      discountType: 'freeShipping',
      discountValue: 0,
      expirationDate: new Date('2024-12-31'), // Valid
      usageLimit: 200,
      usedCount: 0,
      usedBy: []
    },
    {
      code: 'SAVE5',
      discountType: 'fixed',
      discountValue: 5,
      expirationDate: new Date('2024-06-30'), // Valid
      usageLimit: 150,
      usedCount: 0,
      usedBy: []
    },
    {
      code: 'NEWYEAR20',
      discountType: 'fixed',
      discountValue: 20,
      expirationDate: new Date('2024-06-30'), // Valid
      usageLimit: 150,
      usedCount: 0,
      usedBy: []
    }
  ];

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });

    await Coupon.deleteMany(); // Clear existing coupons
    await Coupon.insertMany(coupons); // Insert new coupons
    console.log('Coupons seeded successfully!');
  } catch (error) {
    console.error('Error seeding coupons:', error);
  } 
};

seedCoupons();
