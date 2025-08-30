// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach decoded payload to req.user
    req.user = decoded; // decoded has { id, email, role } because you signed it that way
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
