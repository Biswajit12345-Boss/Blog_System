const jwt = require('jsonwebtoken');
const User = require('../model/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) return res.status(401).json({ message: 'User not found' });
      if (req.user.isBlocked) return res.status(403).json({ message: 'Account suspended' });
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ message: 'Admin access required' });
};

const editorOrAbove = (req, res, next) => {
  if (req.user && ['admin','editor'].includes(req.user.role)) return next();
  res.status(403).json({ message: 'Editor access required' });
};

const authorOrAbove = (req, res, next) => {
  if (req.user && ['admin','editor','author'].includes(req.user.role)) return next();
  res.status(403).json({ message: 'Author access required' });
};

const canPublish = (req, res, next) => {
  if (req.user && ['admin','editor','author'].includes(req.user.role)) return next();
  // Contributors can only submit for approval
  if (req.user && req.user.role === 'contributor') {
    req.body.status = 'pending';
    return next();
  }
  res.status(403).json({ message: 'Cannot publish' });
};

module.exports = { protect, adminOnly, editorOrAbove, authorOrAbove, canPublish };
