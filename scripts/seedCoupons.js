import mongoose from 'mongoose';
import Coupon from '../models/Coupon.js'; // Adjust the path as necessary

const seedCoupons = async () => {
  try {
    // Connect to the database
    await mongoose.connect('mongodb://localhost:27017/yourDatabaseName', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing coupons
    await Coupon.deleteMany({});

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

    // Insert coupons into the database
    await Coupon.insertMany(coupons);
    console.log('Coupons seeded successfully!');

    // Close the database connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding coupons:', error);
    mongoose.connection.close();
  }
};

// Run the seed function
seedCoupons();