import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

// Middleware to check if the user is authenticated
export const isAuth = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    // If no token, user is not authorized
    if (!token) {
      return res
       .status(403)
      .json({ message: 'Unauthorized: No token provided' });
    }

    try {
      // Verify token using the JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID and remove the password field
      req.user = await User.findById(decoded.id).select('-password');

      // Proceed to the next middleware or route
      next();
    } catch (error) {
      // If token is invalid or expired
      return res.status(401).json({ message: 'Invalid or Expired Token' });
    }
  } catch (error) {
    // General server error
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
