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
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('Admin auth - checking token:', token ? 'Token present' : 'No token');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Admin auth - decoded token:', decoded);
    
    const user = await User.findById(decoded.id);
    console.log('Admin auth - found user:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.isAdmin) {
      console.log('Admin auth - user is not admin');
      return res.status(403).json({ message: 'Admin access required' });
    }

    console.log('Admin auth - success');
    req.user = user;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(401).json({ message: 'Please authenticate as admin' });
  }
}; 