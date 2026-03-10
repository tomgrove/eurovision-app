const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

// Use a safe fallback for JWT secret to avoid server crashes when not set in env
const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    // Warn in server logs; not ideal for production but prevents crashes
    console.warn('Warning: JWT_SECRET is not set. Using insecure fallback secret. Set JWT_SECRET in production.');
  }
  return process.env.JWT_SECRET || 'dev_insecure_jwt_secret';
};

const generateToken = (userId) => {
  const secret = getJwtSecret();
  return jwt.sign({ id: userId }, secret, {
    expiresIn: '7d',
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch (error) {
    return null;
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
};
