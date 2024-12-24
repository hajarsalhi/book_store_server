import Coupon from '../models/Coupon.js';

export const validateCoupon = async (req, res) => {
  const { code } = req.body;

  try {
    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    if (new Date() > coupon.expirationDate) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    res.status(200).json({ discount: coupon.discount });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 