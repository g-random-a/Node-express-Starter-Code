import { Request, Response, NextFunction } from 'express';

// Central error handling middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error for server-side debugging
  console.error(err);

  res.status(statusCode).json({
    message,
    // Optionally include the stack trace for development (remove in production)
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
