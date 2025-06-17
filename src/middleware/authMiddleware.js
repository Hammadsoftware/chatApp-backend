// authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/auth.model.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yoursecret');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};