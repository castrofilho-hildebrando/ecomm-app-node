import { CheckoutUseCase } from "../../application/usecases/CheckoutUseCase";
import { CheckoutUseCaseImpl } from "../../application/usecases/CheckoutUseCaseImpl";

import { MongoCartRepository } from "../repositories/MongoCartRepository";
import { MongoProductRepository } from "../repositories/MongoProductRepository";
import { MongoOrderRepository } from "../repositories/MongoOrderRepository";
import { MongoTransactionManager } from "../transaction/MongoTransactionManager";

import { eventBus } from "../eventBus";

export function makeCheckoutUseCase(): CheckoutUseCase {

    const cartRepository = new MongoCartRepository();
    const productRepository = new MongoProductRepository();
    const orderRepository = new MongoOrderRepository();
    const transactionManager = new MongoTransactionManager();

    return new CheckoutUseCaseImpl(

        cartRepository,
        productRepository,
        orderRepository,
        transactionManager,
        eventBus,
    );
}
