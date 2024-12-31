import Coupon from '../models/Coupon.js';
import User from '../models/user.js';

export const validateCoupon = async (req, res) => {
  const { code } = req.body;
  const userId = req.user.id;

  try {
    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    if (coupon.expirationDate < new Date()) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(401).json({ message: 'Coupon usage limit reached.' });
    }

    if (coupon.usedBy.includes(userId)) {
      return res.status(403).json({ message: 'You have already used this coupon.' });
    }
    if(coupon.discountType === 'freeShipping'){
      return res.status(201).json({ message: 'Free shipping applied!', discount: 0 });
    }


    // If all checks pass, you can proceed to apply the coupon
    coupon.usedCount++;
    coupon.usedBy.push(userId); // Record the user ID
    await coupon.save(); // Save the updated coupon

    res.status(200).json({ discount: coupon.discountValue });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const calculLoyaltyDiscount = (totalPurchases) => {
  if (totalPurchases >= 50) {
    return 20; // 20% discount for 50+ purchases
  } else if (totalPurchases >= 30) {
    return 15; // 15% discount for 30-49 purchases
  } else if (totalPurchases >= 10) {
    return 10; // 10% discount for 10-29 purchases
  }
  return 0; // No discount
};

export const calculateLoyaltyDiscount = async (req, res) => {
  const userId = req.user.id; // Get user ID from the request

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const discount = calculLoyaltyDiscount(user.totalPurchases); // Use the user's totalPurchases
    res.status(200).json({ discount });
  } catch (error) {
    console.error('Error calculating loyalty discount:', error);
    res.status(500).json({ message: 'Error calculating loyalty discount', error: error.message });
  }
}; 