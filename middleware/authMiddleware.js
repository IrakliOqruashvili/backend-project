const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

async function authenticateUser(username, password) {
  const user = await User.findOne({ username });
  if (!user) return null;

  const isPasswordValid = await bcrypt.compare(password, user.password);
  return isPasswordValid ? user : null;
}

function generateToken(user) {
  return jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
}

module.exports = {
  authenticateUser,
  generateToken,
  verifyToken
};
