import {Response} from "express";
import {AuthRequest} from "../middlewares/authMiddleware";

import {Cart} from "../models/Cart";
import {Product} from "../models/Product";
import {Order} from "../models/Order";

import {OrderValidationService} from "../domain/services/OrderValidationService";
import {makeCheckoutUseCase} from "../infra/factories/checkoutFactory";
import {DomainError} from "../domain/errors/DomainError";
import {Order as DomainOrder} from "../domain/entities/Order";

import {eventBus} from "../infra/eventBus";

const orderDomainService = new OrderValidationService();

export async function checkout(req: Request, res: Response) {

    try {

        const userId = req.user!.id;
        const checkoutUseCase = makeCheckoutUseCase();
        const result = await checkoutUseCase.execute({userId});

        return res.status(201).json(result);
    } catch (error) {

        return res.status(500).json({message: "Internal server error"});
    }
}

export const createOrder = async (req: AuthRequest, res: Response) => {

    try {

        if (!req.user?.userId)

            return res.status(401).json({error: "Usuário não autenticado"});

        const {items, total} = req.body;

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

        res.status(500).json({error: "Erro ao criar pedido"});
    }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.userId)
            return res.status(401).json({error: "Usuário não autenticado"});
        const orders = await Order.find({userId: req.user.userId});
        res.json(orders);
    } catch (error) {
        res.status(500).json({error: "Erro ao listar pedidos"});
    }
};

export const getAllOrders = async (req: AuthRequest, res: Response) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({error: "Erro ao listar todos os pedidos"});
    }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {

    try {

        const {id} = req.params;
        const {status} = req.body;

        const order = await Order.findById(id);

        if (!order) {

            return res.status(404).json({error: "Pedido não encontrado"});
        }

        // Adaptar Mongoose → Domínio
        const domainOrder = new DomainOrder(
            order.status,
            order.items.map(item => ({
                productId: item.productId.toString(),
                quantity: item.quantity
            })),
            order.total
        );

        // Delegar decisão ao domínio
        switch (status) {

            case "paid":
                domainOrder.markAsPaid();
                break;
            case "shipped":
                domainOrder.ship();
                break;
            case "cancelled":
                domainOrder.cancel();
                break;
            default:
                return res.status(400).json({error: "Status inválido"});
        }

        // Persistir estado decidido pelo domínio
        order.status = domainOrder.status;
        await order.save();

        return res.json(order);

    } catch (error) {

        if (error instanceof DomainError) {

            return res.status(400).json({error: error.message});
        }

        console.error(error);
        return res.status(500).json({error: "Erro ao atualizar pedido"});
    }
};