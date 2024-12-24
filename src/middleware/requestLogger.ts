import { Request, Response, NextFunction } from 'express';

const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (process.env.NODE_ENV !== 'production') {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const logMessage = `${req.method} ${req.originalUrl} | Status: ${res.statusCode} | Duration: ${duration}ms`;

      if (res.statusCode >= 400) {
        console.error(`❌ [${new Date().toISOString()}] ${logMessage}`);
        console.log('');
      } else {
        console.log(`✅ [${new Date().toISOString()}] ${logMessage}`);
        console.log('');
      }
    });
  }

  next();
};

export default requestLoggerMiddleware;
