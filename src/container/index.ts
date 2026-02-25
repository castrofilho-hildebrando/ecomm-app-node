import { container } from 'tsyringe';
import { MongoCartRepository } from '../infra/repositories/MongoCartRepository';
import { MongoProductRepository } from '../infra/repositories/MongoProductRepository';
import { MongoOrderRepository } from '../infra/repositories/MongoOrderRepository';
import { MongoOutboxRepository } from '../infra/repositories/MongoOutboxRepository';
import { MongoTransactionManager } from '../infra/transaction/MongoTransactionManager';
import { AddItemToCartUseCaseImpl } from '../application/usecases/AddItemToCartUseCaseImpl';
import { GetCartUseCaseImpl } from '../application/usecases/GetCartUseCaseImpl';
import { RemoveItemFromCartUseCaseImpl } from '../application/usecases/RemoveItemFromCartUseCaseImpl';
import { ClearCartUseCaseImpl } from '../application/usecases/ClearCartUseCaseImpl';
import { CheckoutUseCaseImpl } from '../application/usecases/CheckoutUseCaseImpl';
import { ListMyOrdersUseCaseImpl } from '../application/usecases/ListMyOrdersUseCaseImpl';
import { GetAllOrdersUseCaseImpl } from '../application/usecases/GetAllOrdersUseCaseImpl';
import { UpdateOrderStatusUseCaseImpl } from '../application/usecases/UpdateOrderStatusUseCaseImpl';

// Registra repositórios como singletons
container.register('CartRepository', { useClass: MongoCartRepository });
container.register('ProductRepository', { useClass: MongoProductRepository });
container.register('OrderRepository', { useClass: MongoOrderRepository });
container.register('OutboxRepository', { useClass: MongoOutboxRepository });
container.register('TransactionManager', { useClass: MongoTransactionManager });

// Registra use cases
container.register('AddItemToCartUseCase', { useClass: AddItemToCartUseCaseImpl });
container.register('GetCartUseCase', { useClass: GetCartUseCaseImpl });
container.register('RemoveItemFromCartUseCase', { useClass: RemoveItemFromCartUseCaseImpl });
container.register('ClearCartUseCase', { useClass: ClearCartUseCaseImpl });
container.register('CheckoutUseCase', { useClass: CheckoutUseCaseImpl });
container.register('ListMyOrdersUseCase', { useClass: ListMyOrdersUseCaseImpl });
container.register('GetAllOrdersUseCase', { useClass: GetAllOrdersUseCaseImpl });
container.register('UpdateOrderStatusUseCase', { useClass: UpdateOrderStatusUseCaseImpl });

export { container };