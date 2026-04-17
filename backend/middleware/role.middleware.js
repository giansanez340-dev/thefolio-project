// backend/middleware/role.middleware.js
const memberOrAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });

  if (req.user.role === 'member' || req.user.role === 'admin') {
    return next();
  }

  res.status(403).json({ message: 'Forbidden' });
};

const adminOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });

  if (req.user.role === 'admin') return next();

  res.status(403).json({ message: 'Admins only' });
};

module.exports = { memberOrAdmin, adminOnly };