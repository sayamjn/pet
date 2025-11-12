const { verifyToken } = require('../utils/jwt');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Access token is required',
        code: 'NO_TOKEN'
      }
    });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      }
    });
  }

  req.user = decoded;
  next();
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Authentication required',
          code: 'NOT_AUTHENTICATED'
        }
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Insufficient permissions',
          code: 'FORBIDDEN'
        }
      });
    }

    next();
  };
};

module.exports = { authenticateToken, authorizeRoles };
