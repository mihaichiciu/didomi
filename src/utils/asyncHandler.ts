import { Request, Response, NextFunction } from 'express';
import { ApiError, UnprocessableEntityError } from '@/utils/apiErrors';
import { ZodError } from 'zod';

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const asyncHandler = (fn: AsyncFunction) => (req: Request, res: Response, next: NextFunction) => {
  return Promise.resolve(fn(req, res, next)).catch((err: any) => {
    if (err instanceof ZodError) {
      const unprocessableError = new UnprocessableEntityError('Validation failed', err.errors);
      return res.status(unprocessableError.statusCode).json({
        success: false,
        message: unprocessableError.message,
        ...(unprocessableError.data && { data: unprocessableError.data }),
      });
    } else if (err instanceof ApiError) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        ...(err.data && { data: err.data }),
      });
    } else {
      console.error('Error', err);
      const statusCode = err.statusCode && typeof err.statusCode === 'number' ? err.statusCode : 500;
      const message = statusCode === 500 ? 'Internal Server Error' : err.message || 'Something went wrong';

      return res.status(statusCode).json({
        success: false,
        message: message,
      });
    }
  });
};

export default asyncHandler;
