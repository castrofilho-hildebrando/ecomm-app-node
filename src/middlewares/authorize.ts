import { Request, Response, NextFunction } from 'express';
import { AuthorizationError } from '../domain/errors/AuthorizationError';

type Role = 'user' | 'admin';

export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AuthorizationError('Usuário não autenticado');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AuthorizationError('Permissão insuficiente');
    }

    next();
  };
};

// Uso: authorize('admin') ou authorize('user', 'admin')