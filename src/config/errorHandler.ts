import { Request, Response, NextFunction } from 'express';

interface ErrorHandler extends Error {
  status?: number;
}

const errorHandler = (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorHandler;
