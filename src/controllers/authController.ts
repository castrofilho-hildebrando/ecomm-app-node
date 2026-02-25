import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import { UserRepository } from '../application/ports/UserRepository';
import { AuthenticationError } from '../domain/errors/AuthenticationError';
import { ConflictError } from '../domain/errors/ConflictError';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '1d';

@injectable()
export class AuthController {
  constructor(
    @inject('UserRepository') private userRepository: UserRepository
  ) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new ConflictError('E-mail já registrado');
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await this.userRepository.create({
        name,
        email,
        passwordHash,
        role: 'user',
      });

      const token = this.generateToken(user.id, user.role);

      res.status(201).json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user = await this.userRepository.findByEmailWithPassword(email);
      if (!user) {
        throw new AuthenticationError('Credenciais inválidas');
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        throw new AuthenticationError('Credenciais inválidas');
      }

      const token = this.generateToken(user.id, user.role);

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

  private generateToken(userId: string, role: string): string {
    return jwt.sign({ userId, role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  }
}