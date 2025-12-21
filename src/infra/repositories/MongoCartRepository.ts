import { Cart } from "../../models/Cart";
import { CartRepository } from "../../application/ports/CartRepository";

export class MongoCartRepository implements CartRepository {

    async findByUserId(userId: string) {
        const cart = await Cart.findOne({ userId });

        if (!cart) return null;

        return {
            id: cart._id.toString(),
            items: cart.items.map(item => ({
                productId: item.productId.toString(),
                quantity: item.quantity,
            })),
        };
    }

    async clear(cartId: string): Promise<void> {
        await Cart.updateOne(
            { _id: cartId },
            { $set: { items: [] } }
        );
    }
}
