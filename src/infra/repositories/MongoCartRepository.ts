import { injectable } from 'tsyringe';
import { ClientSession } from 'mongoose';
import { Cart } from '../models/Cart';
import { CartRepository, CartData } from '../../application/ports/CartRepository';

@injectable()
export class MongoCartRepository implements CartRepository {
  async findByUserId(userId: string, session?: ClientSession): Promise<CartData | null> {
    const cart = await Cart.findOne({ userId }).session(session || null).lean();

    if (!cart) return null;

    return {
      userId: cart.userId.toString(),
      items: cart.items.map(item => ({
        productId: item.productId.toString(),
        quantity: item.quantity,
      })),
    };
  }

  async addItem(userId: string, productId: string, quantity: number, session?: ClientSession): Promise<void> {
    // Tenta incrementar quantidade existente
    const updateResult = await Cart.updateOne(
      { userId, 'items.productId': productId },
      { $inc: { 'items.$.quantity': quantity } },
      { session }
    );

    // Se não encontrou, adiciona novo item
    if (updateResult.matchedCount === 0) {
      await Cart.updateOne(
        { userId },
        { $push: { items: { productId, quantity } } },
        { upsert: true, session }
      );
    }
  }

  async removeItem(userId: string, productId: string, session?: ClientSession): Promise<void> {
    await Cart.updateOne(
      { userId },
      { $pull: { items: { productId } } },
      { session }
    );
  }

  async clear(userId: string, session?: ClientSession): Promise<void> {
    await Cart.updateOne(
      { userId },
      { $set: { items: [] } },
      { session }
    );
  }
}