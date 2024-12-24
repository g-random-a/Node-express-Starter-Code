import { NextFunction, Request, Response } from 'express';
import FailureError from '../utils/responses/failureResponse';
import HTTP from '../utils/status/statusCodes';

export const globalErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  console.error('Error caught:', err);

  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack || 'No stack trace available');
  }

  if (err instanceof FailureError) {
    res.status(err.statusCode || HTTP.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: err.message,
      code: err.errorCode,
      details: err.details,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
  }

  res.status(HTTP.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message:
      process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred!'
        : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
