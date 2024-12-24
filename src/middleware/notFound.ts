import { Request, Response, NextFunction } from 'express';
import HTTP from '../utils/status/statusCodes';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(HTTP.NOT_FOUND);
  next(error);
};

export default notFound;
