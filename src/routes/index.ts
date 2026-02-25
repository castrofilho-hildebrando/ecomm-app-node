// src/routes/index.ts
import { Router } from 'express';
import { container } from 'tsyringe';
import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/authorize';
import { validateRequest } from '../middlewares/validateRequest';
import { errorHandler } from '../middlewares/errorHandler';

// Controllers
import { AuthController } from '../controllers/authController';
import { CartController } from '../controllers/cartController';
import { ProductController } from '../controllers/productController';
import { AddressController } from '../controllers/addressController';
import { OrderController } from '../controllers/orderController';
import { AdminController } from '../controllers/adminController';
import { UserController } from '../controllers/userController';

// Schemas
import {
  registerSchema,
  loginSchema,
  addToCartSchema,
  removeFromCartSchema,
  addressSchema,
  updateAddressSchema,
  productSchema,
  updateProductSchema,
  orderStatusSchema,
} from '../validation/schemas';

const router = Router();

// Instancia controllers via DI
const authController = container.resolve(AuthController);
const cartController = container.resolve(CartController);
const productController = container.resolve(ProductController);
const addressController = container.resolve(AddressController);
const orderController = container.resolve(OrderController);
const adminController = container.resolve(AdminController);
const userController = container.resolve(UserController);

// Auth routes
router.post('/auth/register', validateRequest(registerSchema), authController.register);
router.post('/auth/login', validateRequest(loginSchema), authController.login);

// Product routes (públicas e protegidas)
router.get('/products', productController.getAll);
router.post('/products', authenticate, authorize('admin'), validateRequest(productSchema), productController.create);
router.put('/products/:id', authenticate, authorize('admin'), validateRequest(updateProductSchema), productController.update);
router.delete('/products/:id', authenticate, authorize('admin'), productController.delete);

// Cart routes
router.get('/cart', authenticate, cartController.getCart);
router.post('/cart/add', authenticate, validateRequest(addToCartSchema), cartController.addItem);
router.post('/cart/remove', authenticate, validateRequest(removeFromCartSchema), cartController.removeItem);
router.post('/cart/clear', authenticate, cartController.clearCart);

// Address routes
router.get('/addresses', authenticate, addressController.getAll);
router.post('/addresses', authenticate, validateRequest(addressSchema), addressController.create);
router.put('/addresses/:id', authenticate, validateRequest(updateAddressSchema), addressController.update);
router.delete('/addresses/:id', authenticate, addressController.delete);

// Order routes
router.post('/orders/checkout', authenticate, orderController.checkout);
router.get('/orders/my', authenticate, orderController.getMyOrders);
router.get('/orders', authenticate, orderController.getAllOrders);
router.put('/orders/:id', authenticate, validateRequest(orderStatusSchema), orderController.updateStatus);

// Admin routes
router.get('/admin/stats', authenticate, authorize('admin'), adminController.getStats);

// User routes (admin only)
router.get('/users', authenticate, authorize('admin'), userController.getAll);
router.get('/users/:id', authenticate, authorize('admin'), userController.getById);
router.put('/users/:id', authenticate, authorize('admin'), userController.update);
router.delete('/users/:id', authenticate, authorize('admin'), userController.delete);

// Error handler deve ser o último
router.use(errorHandler);

export default router;