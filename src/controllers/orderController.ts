import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { Order } from "../models/Order";
import { Cart } from "../models/Cart";
import { Product, IProduct } from "../models/Product";
import { Types } from "mongoose";

export const checkout = async (req: AuthRequest, res: Response) => {

    try {

        if (!req.user?.userId)
            return res.status(401).json({ error: "Usuário não autenticado" });

        const cart = await Cart.findOne({ userId: req.user.userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: "Carrinho vazio" });
        }

        const productIds = cart.items.map((item) => item.productId);
        const products = await Product.find({ _id: { $in: productIds } });

        const productMap = products.reduce(
            (acc, product) => {
                acc[product._id.toString()] = product;
                return acc;
            },
            {} as { [key: string]: IProduct },
        );

        let total = 0;
        const productsToUpdate: { productId: string; quantity: number }[] = [];

        for (const item of cart.items) {
            const productIdStr = item.productId.toString();
            const product = productMap[productIdStr];

            if (!product) {
                // Caso o produto não exista mais (embora o ObjectId exista)
                return res.status(404).json({
                    error: `Produto ID ${productIdStr} não encontrado.`,
                });
            }

            // A. Validação de Estoque
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    error: `Estoque insuficiente para ${product.name}. Disponível: ${product.stock}, Solicitado: ${item.quantity}`,
                });
            }

            // B. Cálculo do Total (Corrigido no Passo 1)
            total += product.price * item.quantity;

            productsToUpdate.push({
                productId: productIdStr,
                quantity: item.quantity,
            });
        }

        if (total === 0) {
            return res.status(400).json({
                error: "O total do pedido é zero. Verifique os itens.",
            });
        }

        // 3. Criação do Pedido e Limpeza do Carrinho
        const newOrder = new Order({
            userId: req.user.userId,
            items: cart.items,
            total,
            status: "pending",
        });
        await newOrder.save();

        cart.items = [];
        await cart.save();

        // 4. Redução de Estoque (Pós-Pedido)
        const bulkOps = productsToUpdate.map((update) => ({

            updateOne: {

                filter: { _id: new Types.ObjectId(update.productId) },
                update: { $inc: { stock: -update.quantity } },
            },
        }));

        if (bulkOps.length > 0) {
            // Usa bulkWrite para uma atualização eficiente e atômica de vários documentos
            await Product.bulkWrite(bulkOps);
        }

        res.status(201).json({
            message: "Pedido criado a partir do carrinho!",
            order: newOrder,
        });
    } catch (error) {
        // Logar o erro completo aqui seria útil em produção
        res.status(500).json({ error: "Erro ao finalizar checkout" });
    }
};

export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.userId)
            return res.status(401).json({ error: "Usuário não autenticado" });
        const { items, total } = req.body;

        const newOrder = new Order({
            userId: req.user.userId,
            items,
            total,
            status: "pending",
        });
        await newOrder.save();
        res.status(201).json({
            message: "Pedido criado com sucesso!",
            order: newOrder,
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar pedido" });
    }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.userId)
            return res.status(401).json({ error: "Usuário não autenticado" });
        const orders = await Order.find({ userId: req.user.userId });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar pedidos" });
    }
};

export const getAllOrders = async (req: AuthRequest, res: Response) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar todos os pedidos" });
    }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true },
        );

        if (!updatedOrder)
            return res.status(404).json({ error: "Pedido não encontrado" });

        res.json({
            message: "Status atualizado com sucesso!",
            order: updatedOrder,
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar pedido" });
    }
};
