function errorMiddleware(err, req, res, next) {
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors,
    });
  }

  // Prisma errors
  if (err.code) {
    // Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({
        error: 'Resource not found',
        message: err.meta?.cause || 'The requested resource does not exist',
      });
    }

    // Unique constraint violation
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: 'Resource already exists',
        message: `A record with this ${err.meta?.target?.join(
          ', '
        )} already exists`,
      });
    }

    // Foreign key constraint violation
    if (err.code === 'P2003') {
      return res.status(400).json({
        error: 'Invalid reference',
        message: 'The referenced resource does not exist',
      });
    }
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

export default errorMiddleware;
