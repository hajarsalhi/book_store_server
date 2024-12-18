import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    const user = await User.findById(decoded.id);
    
    if (!user) {
      console.log('User not found with ID:', decoded.id);
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Please authenticate' });
  }
};

export const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user && req.user.isAdmin) {
        next();
      } else {
        res.status(403).json({ message: 'Admin access required' });
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
}; 