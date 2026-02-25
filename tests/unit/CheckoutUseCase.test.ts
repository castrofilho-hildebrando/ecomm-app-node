import { CheckoutUseCaseImpl } from '../../src/application/usecases/CheckoutUseCaseImpl';
import { CartEmptyError } from '../../src/domain/errors/CheckoutErrors';
import { ProductNotFoundError } from '../../src/domain/errors/CheckoutErrors';

describe('CheckoutUseCase', () => {
  let useCase: CheckoutUseCaseImpl;
  let mockCartRepo: jest.Mocked<any>;
  let mockProductRepo: jest.Mocked<any>;
  let mockOrderRepo: jest.Mocked<any>;
  let mockTransactionManager: jest.Mocked<any>;
  let mockOutboxRepo: jest.Mocked<any>;

  beforeEach(() => {
    mockCartRepo = {
      findByUserId: jest.fn(),
      clear: jest.fn(),
    };
    mockProductRepo = {
      findByIds: jest.fn(),
      decrementStock: jest.fn(),
    };
    mockOrderRepo = {
      create: jest.fn(),
    };
    mockTransactionManager = {
      runInTransaction: jest.fn((fn) => fn({})),
    };
    mockOutboxRepo = {
      save: jest.fn(),
    };

    useCase = new CheckoutUseCaseImpl(
      mockCartRepo,
      mockProductRepo,
      mockOrderRepo,
      mockTransactionManager,
      mockOutboxRepo
    );
  });

  it('deve lançar erro quando carrinho está vazio', async () => {
    mockCartRepo.findByUserId.mockResolvedValue(null);

    await expect(useCase.execute({ userId: '123' }))
      .rejects
      .toThrow(CartEmptyError);
  });

  it('deve criar pedido com sucesso', async () => {
    mockCartRepo.findByUserId.mockResolvedValue({
      userId: '123',
      items: [{ productId: 'prod1', quantity: 2 }],
    });
    mockProductRepo.findByIds.mockResolvedValue([
      { id: 'prod1', price: 100, stock: 10 },
    ]);
    mockOrderRepo.create.mockResolvedValue({
      id: 'order1',
      status: 'pending',
      total: 200,
    });

    const result = await useCase.execute({ userId: '123' });

    expect(result.orderId).toBe('order1');
    expect(result.total).toBe(200);
    expect(mockProductRepo.decrementStock).toHaveBeenCalledWith('prod1', 2, {});
  });
});