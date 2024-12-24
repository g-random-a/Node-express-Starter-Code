import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import configs from '../config/configs';

const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    res.sendStatus(403);
    return;
  }

  jwt.verify(
    token,
    configs.JWT_SECRET_KEY || '',
    { algorithms: ['HS256'] },
    (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.body.user = user;
      next();
    },
  );
};

export default authenticateJWT;
