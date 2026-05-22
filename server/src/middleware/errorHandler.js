const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.isOperational ? err.message : 'Something went wrong';

  // Only log unexpected server errors (5xx), not intentional 4xx operational errors
  if (process.env.NODE_ENV !== 'test' && statusCode >= 500) {
    console.error(`[${code}] ${err.message}`, err.stack);
  }

  res.status(statusCode).json({
    error: true,
    message,
    code,
    ...(err.details && { details: err.details }),
  });
};

export default errorHandler;
