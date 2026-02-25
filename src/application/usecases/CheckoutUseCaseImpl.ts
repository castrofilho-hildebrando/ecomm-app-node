// src/application/usecases/CheckoutUseCaseImpl.ts
import { inject, injectable } from 'tsyringe';
import { CheckoutUseCase, CheckoutInput, CheckoutOutput } from './CheckoutUseCase';
import { CartRepository } from '../ports/CartRepository';
import { ProductRepository } from '../ports/ProductRepository';
import { OrderRepository } from '../ports/OrderRepository';
import { TransactionManager } from '../ports/TransactionManager';
import { OutboxRepository } from '../ports/OutboxRepository';
import { OrderValidationService } from '../../domain/services/OrderValidationService';
import { CartEmptyError } from '../../domain/errors/CheckoutErrors';

@injectable()
export class CheckoutUseCaseImpl implements CheckoutUseCase {
  constructor(
    @inject('CartRepository') private cartRepository: CartRepository,
    @inject('ProductRepository') private productRepository: ProductRepository,
    @inject('OrderRepository') private orderRepository: OrderRepository,
    @inject('TransactionManager') private transactionManager: TransactionManager,
    @inject('OutboxRepository') private outboxRepository: OutboxRepository
  ) {}

  async execute(input: CheckoutInput): Promise<CheckoutOutput> {
    return this.transactionManager.runInTransaction(async (session) => {
      // 1. Busca carrinho
      const cart = await this.cartRepository.findByUserId(input.userId, session);
      if (!cart || cart.items.length === 0) {
        throw new CartEmptyError();
      }

      // 2. Busca produtos e valida
      const productIds = cart.items.map(i => i.productId);
      const products = await this.productRepository.findByIds(productIds, session);

      const validationService = new OrderValidationService();
      const total = validationService.validateAndCalculateTotal(cart.items, products);

      // 3. Decrementa estoque
      for (const item of cart.items) {
        await this.productRepository.decrementStock(item.productId, item.quantity, session);
      }

      // 4. Cria pedido
      const order = await this.orderRepository.create({
        userId: input.userId,
        items: cart.items,
        total,
        status: 'pending',
      }, session);

      // 5. Limpa carrinho
      await this.cartRepository.clear(input.userId, session);

      // 6. Registra evento no outbox (mesma transação!)
      await this.outboxRepository.save({
        name: 'order.placed',
        payload: {
          orderId: order.id,
          userId: input.userId,
          total,
        },
        occurredAt: new Date(),
      }, session);

      return {
        orderId: order.id,
        status: 'pending',
        total,
      };
    });
  }
}