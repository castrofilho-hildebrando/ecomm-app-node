import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { CheckoutUseCase } from '../application/usecases/CheckoutUseCase';
import { ListMyOrdersUseCase } from '../application/usecases/ListMyOrdersUseCase';
import { GetAllOrdersUseCase } from '../application/usecases/GetAllOrdersUseCase';
import { UpdateOrderStatusUseCase } from '../application/usecases/UpdateOrderStatusUseCase';
import { AuthorizationError } from '../domain/errors/AuthorizationError';

@injectable()
export class OrderController {
  constructor(
    @inject('CheckoutUseCase') private checkoutUseCase: CheckoutUseCase,
    @inject('ListMyOrdersUseCase') private listMyOrdersUseCase: ListMyOrdersUseCase,
    @inject('GetAllOrdersUseCase') private getAllOrdersUseCase: GetAllOrdersUseCase,
    @inject('UpdateOrderStatusUseCase') private updateOrderStatusUseCase: UpdateOrderStatusUseCase
  ) {}

  checkout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const result = await this.checkoutUseCase.execute({ userId });

      res.status(201).json({
        success: true,
        data: {
          order: {
            id: result.orderId,
            status: result.status,
            total: result.total,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const orders = await this.listMyOrdersUseCase.execute({ userId });

      res.json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;

      if (user.role !== 'admin') {
        throw new AuthorizationError();
      }

      const orders = await this.getAllOrdersUseCase.execute({
        actor: { id: user.userId, role: user.role },
      });

      res.json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const { id } = req.params;
      const { status } = req.body;

      const result = await this.updateOrderStatusUseCase.execute({
        orderId: id,
        newStatus: status,
        actor: { id: user.userId, role: user.role },
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}