import { Order } from "../../models/Order";
import { OrderRepository } from "../../application/ports/OrderRepository";

export class MongoOrderRepository implements OrderRepository {

  async create(data: {
    userId: string;
    items: { productId: string; quantity: number }[];
    total: number;
    status: string;
  }): Promise<{ id: string }> {

    const order = new Order({
      userId: data.userId,
      items: data.items,
      total: data.total,
      status: data.status,
    });

    await order.save();

    return { id: order._id.toString() };
  }
}
