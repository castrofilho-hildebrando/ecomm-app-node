export type ProductData = {
    id: string;
    price: number;
    stock: number;
};

export interface ProductRepository {
    findByIds(ids: string[]): Promise<ProductData[]>;
    decrementStock(productId: string, quantity: number): Promise<void>;
}
