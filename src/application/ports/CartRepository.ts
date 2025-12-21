export type CartItemData = {
    productId: string;
    quantity: number;
};

export type CartData = {
    id: string;
    items: CartItemData[];
};

export interface CartRepository {
    findByUserId(userId: string): Promise<CartData | null>;
    clear(cartId: string): Promise<void>;
}
