import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = (process.env.JWT_SECRET || 'supersecret') as string;

export interface AuthRequest extends Request {
    user?: { userId: string; role: string };
}

interface TokenPayload extends JwtPayload {
    userId: string;
    role: string;
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    try {

        const decoded = jwt.verify(
            token,
            JWT_SECRET,
        ) as unknown as TokenPayload;

        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };

        next();
    } catch (error) {

        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
};
