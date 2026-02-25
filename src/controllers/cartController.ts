import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { AddItemToCartUseCase } from '../application/usecases/AddItemToCartUseCase';
import { GetCartUseCase } from '../application/usecases/GetCartUseCase';
import { RemoveItemFromCartUseCase } from '../application/usecases/RemoveItemFromCartUseCase';
import { ClearCartUseCase } from '../application/usecases/ClearCartUseCase';
import { NotFoundError } from '../domain/errors/NotFoundError';

@injectable()
export class CartController {
  constructor(
    @inject('AddItemToCartUseCase') private addItemUseCase: AddItemToCartUseCase,
    @inject('GetCartUseCase') private getCartUseCase: GetCartUseCase,
    @inject('RemoveItemFromCartUseCase') private removeItemUseCase: RemoveItemFromCartUseCase,
    @inject('ClearCartUseCase') private clearCartUseCase: ClearCartUseCase
  ) {}

  getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const cart = await this.getCartUseCase.execute({ userId });

      res.json({
        success: true,
        data: { items: cart.items },
      });
    } catch (error) {
      next(error);
    }
  };

  addItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { productId, quantity } = req.body;

      await this.addItemUseCase.execute({ userId, productId, quantity });

      const updatedCart = await this.getCartUseCase.execute({ userId });

      res.json({
        success: true,
        data: { cart: updatedCart },
      });
    } catch (error) {
      next(error);
    }
  };

  removeItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { productId } = req.body;

      // Verifica se carrinho existe
      const existing = await this.getCartUseCase.execute({ userId });
      if (!existing.items.length) {
        throw new NotFoundError('Carrinho');
      }

      await this.removeItemUseCase.execute({ userId, productId });
      const updatedCart = await this.getCartUseCase.execute({ userId });

      res.json({
        success: true,
        data: { cart: updatedCart },
      });
    } catch (error) {
      next(error);
    }
  };

  clearCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;

      const existing = await this.getCartUseCase.execute({ userId });
      if (!existing.items.length) {
        throw new NotFoundError('Carrinho');
      }

      await this.clearCartUseCase.execute({ userId });

      res.json({
        success: true,
        data: { cart: { items: [] } },
      });
    } catch (error) {
      next(error);
    }
  };
}