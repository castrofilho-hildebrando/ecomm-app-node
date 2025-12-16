// FILE: src/middlewares/adminAuth.ts

import { Response, NextFunction, Request } from 'express';

// Se você definiu AuthRequest em authMiddleware, importe de lá. 
// Caso contrário, use esta definição para garantir o acesso a req.user:
export interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: 'user' | 'admin';
    };
}

export const adminAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    // 1. Verifica se o usuário foi autenticado
    if (!req.user || !req.user.role) {
        return res.status(401).json({ error: 'Acesso negado. Token inválido ou ausente.' });
    }
    
    // 2. Verifica se o papel (role) é 'admin'
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado. Requer permissão de Administrador.' });
    }

    next();
};