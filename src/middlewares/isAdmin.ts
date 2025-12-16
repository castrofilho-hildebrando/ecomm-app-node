import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

export const isAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    if (!req.user) {
        return res.status(401).json({ error: "Usuário não autenticado" });
    }

    if (req.user.role !== "admin") {
        return res
            .status(403)
            .json({ error: "Acesso negado: apenas administradores" });
    }

    next();
};
