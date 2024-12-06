import { Response, Request, NextFunction } from 'express';
import { ZodError } from 'zod';

import { HttpError } from '@/errors/response-error';

export const ErrorMiddleware = async (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      status: {
        code: 400,
        description: 'Validation Error',
      },
      result: error.errors,
    });
  } else if (error instanceof HttpError) {
    res.status(error.statusCode).json({
      errors: error.message,
    });
  } else {
    res.status(500).json({
      errors: error.message,
    });
  }
};
