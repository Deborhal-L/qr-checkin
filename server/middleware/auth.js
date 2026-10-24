const jwt = require('jsonwebtoken');

// Verifies the Bearer token. If `role` is given, also enforces it.
module.exports = function auth(role) {
  return (req, res, next) => {
    try {
      const token = (req.headers.authorization || '').replace('Bearer ', '');
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (role && payload.role !== role) {
        return res.status(403).json({ msg: 'Forbidden' });
      }
      req.user = payload; // { id, role, name }
      next();
    } catch {
      res.status(401).json({ msg: 'Unauthorized' });
    }
  };
};
