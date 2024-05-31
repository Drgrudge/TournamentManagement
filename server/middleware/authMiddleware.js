import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new Error();
    }
    req.user.role = user.role; // Add user role to the request object
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const adminOrOrganizerMiddleware = (req, res, next) => {
  if (req.user.role === 'Admin' || req.user.role === 'Organizer') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
};
