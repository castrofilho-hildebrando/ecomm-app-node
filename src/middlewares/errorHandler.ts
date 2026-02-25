import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../domain/errors/BaseError';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log estruturado do erro
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    requestId: req.requestId,
  });

  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  // Erros inesperados - não expõe detalhes
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Erro interno do servidor',
    },
  });
};