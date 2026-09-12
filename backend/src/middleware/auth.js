const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate requests using JWT
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Missing or malformed token.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'carnodes_super_secret_jwt_key_hackathon_2026');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};

/**
 * Middleware to enforce role-based access control
 * @param  {...string} roles Allowed roles ('BUYER', 'SELLER', 'AUTHORITY')
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' is not authorized to perform this action.`
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  requireRole
};
