import { Request, Response } from "express";
import { Cart } from "../models/Cart";
import { Product } from "../models/Product";

export const getCart = async (req: Request, res: Response) => {

    try {

        if (!req.user?.id)
            return res.status(401).json({ error: "Usuário não autenticado" });
        const cart = await Cart.findOne({ userId: req.user.id });
        res.json(cart || { items: [] });
    } catch (error) {

        res.status(500).json({ error: "Erro ao buscar carrinho" });
    }
};

export const addToCart = async (req: Request, res: Response) => {

    try {

        if (!req.user?.id)
            return res.status(401).json({ error: "Usuário não autenticado" });

        const { productId, quantity } = req.body;

        // 1. Validação Básica de Input
        if (!productId || typeof quantity !== "number" || quantity <= 0) {
            return res
                .status(400)
                .json({
                    error: "ID do produto e uma quantidade positiva são obrigatórios.",
                });
        }

        // 2. Validação de Produto Existente no DB
        const product = await Product.findById(productId);
        if (!product) {
            return res
                .status(404)
                .json({
                    error: "Produto não encontrado para ser adicionado ao carrinho.",
                });
        }

        // 3. (OPCIONAL mas RECOMENDADO) Validação de Estoque (para prevenir adição excessiva)
        // Buscamos o carrinho existente para calcular o total após a adição
        let cart = await Cart.findOne({ userId: req.user.id });

        const existingItem = cart?.items.find(
            (item) => item.productId.toString() === productId,
        );

        const newQuantity = (existingItem ? existingItem.quantity : 0) + quantity;

        if (newQuantity > product.stock) {

            return res.status(400).json({

                error: `Não é possível adicionar ${quantity} unidades. O estoque total disponível é de ${product.stock}, e você já tem ${existingItem ? existingItem.quantity : 0} no carrinho.`,
            });
        }

        if (!cart) {

            cart = new Cart({ userId: req.user.id, items: [] });
        }

        if (existingItem) {

            existingItem.quantity += quantity;
        } else {

            cart.items.push({ productId, quantity });
        }

        await cart.save();
        res.json({ message: "Item adicionado ao carrinho", cart });
    } catch (error) {

        res.status(500).json({ error: "Erro ao adicionar item" });
    }
};

export const removeFromCart = async (req: Request, res: Response) => {

    try {

        if (!req.user?.id)
            return res.status(401).json({ error: "Usuário não autenticado" });

        const { productId } = req.body;
        const cart = await Cart.findOne({ userId: req.user.id });

        if (!cart)
            return res.status(404).json({ error: "Carrinho não encontrado" });

        cart.items = cart.items.filter(
            (item) => item.productId.toString() !== productId,
        );

        await cart.save();

        res.json({ message: "Item removido do carrinho", cart });
    } catch (error) {

        res.status(500).json({ error: "Erro ao remover item" });
    }
};

export const clearCart = async (req: Request, res: Response) => {

    try {

        if (!req.user?.id)
            return res.status(401).json({ error: "Usuário não autenticado" });

        const cart = await Cart.findOne({ userId: req.user.id });

        if (!cart)
            return res.status(404).json({ error: "Carrinho não encontrado" });

        cart.items = [];
        await cart.save();
        res.json({ message: "Carrinho limpo com sucesso", cart });
    } catch (error) {

        res.status(500).json({ error: "Erro ao limpar carrinho" });
    }
};
