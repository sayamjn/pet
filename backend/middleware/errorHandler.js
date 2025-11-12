const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  let statusCode = 500;
  let errorResponse = {
    success: false,
    error: {
      message: 'Internal server error',
      code: 'SERVER_ERROR'
    }
  };

  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorResponse.error = {
      message: Object.values(err.errors).map(e => e.message).join(', '),
      code: 'VALIDATION_ERROR'
    };
  } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    errorResponse.error = {
      message: 'Resource not found',
      code: 'NOT_FOUND'
    };
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern)[0];
    errorResponse.error = {
      message: `Duplicate value for ${field}`,
      code: 'DUPLICATE_ERROR'
    };
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorResponse.error = {
      message: 'Invalid token',
      code: 'INVALID_TOKEN'
    };
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorResponse.error = {
      message: 'Token expired',
      code: 'TOKEN_EXPIRED'
    };
  } else if (err.statusCode) {
    statusCode = err.statusCode;
    errorResponse.error = {
      message: err.message || 'Error occurred',
      code: err.code || 'ERROR'
    };
  }

  if (process.env.NODE_ENV !== 'production') {
    errorResponse.error.details = {
      stack: err.stack,
      name: err.name
    };
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
