
import jwt from 'jsonwebtoken';
import User from '../model/authModel.js';

const authenticateToken = async (req, res, next) => {
  const token = req.cookies.jwt; // Extract token from cookies
  if (!token) return res.status(401).json({ status: 'Error', error: 'Access denied' });

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verify token
    const user = await User.findById(decodedToken.id); // Find user in the database
    if (!user) return res.status(403).json({ status: 'Error', error: 'User not found' });
    req.user = user; // Attach user object to request
    next();
  } catch (err) {
    return res.status(403).json({ status: 'Error', error: 'Invalid token' });
  }
};

export default authenticateToken;
