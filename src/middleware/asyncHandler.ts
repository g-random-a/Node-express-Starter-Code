import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };
};
