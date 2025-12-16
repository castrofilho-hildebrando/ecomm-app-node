import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {
    getCart,
    addToCart,
    removeFromCart,
    clearCart,
} from "../controllers/cartController";

const router = Router();

// Todas as rotas de carrinho são protegidas por autenticação
router.use(authenticate);

router.get("/", getCart);
router.post("/add", addToCart);
router.post("/remove", removeFromCart);
router.post("/clear", clearCart);

export default router;
