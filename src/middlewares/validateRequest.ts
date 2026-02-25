import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../domain/errors/ValidationError';

export const validateRequest = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse(req[source]);
      req[source] = result; // Substitui pelo dado validado e tipado
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        next(new ValidationError(messages.join(', ')));
      } else {
        next(error);
      }
    }
  };
};