import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { ProductRepository } from '../application/ports/ProductRepository';
import { NotFoundError } from '../domain/errors/NotFoundError';

@injectable()
export class ProductController {
  constructor(
    @inject('ProductRepository') private productRepository: ProductRepository
  ) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await this.productRepository.findAll();

      res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.productRepository.create(req.body);

      res.status(201).json({
        success: true,
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const product = await this.productRepository.update(id, req.body);

      if (!product) {
        throw new NotFoundError('Produto');
      }

      res.json({
        success: true,
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleted = await this.productRepository.delete(id);

      if (!deleted) {
        throw new NotFoundError('Produto');
      }

      res.json({
        success: true,
        data: { deleted: true, id },
      });
    } catch (error) {
      next(error);
    }
  };
}