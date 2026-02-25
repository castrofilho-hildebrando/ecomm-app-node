import { z } from 'zod';
import mongoose from 'mongoose';

// Helper para validar ObjectId do MongoDB
const objectIdSchema = z.string().refine(
  (val) => mongoose.Types.ObjectId.isValid(val),
  { message: 'ID inválido' }
);

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100)
    .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'Deve conter pelo menos um número'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const addToCartSchema = z.object({
  productId: objectIdSchema,
  quantity: z.number().int().positive(),
});

export const removeFromCartSchema = z.object({
  productId: objectIdSchema,
});

export const addressSchema = z.object({
  street: z.string().min(5).max(200),
  city: z.string().min(2).max(100),
  state: z.string().length(2),
  zipCode: z.string().regex(/^\d{5}-\d{3}$/, 'Formato: 12345-678'),
  country: z.string().default('Brazil'),
  isDefault: z.boolean().default(false),
});

export const updateAddressSchema = addressSchema.partial();

export const productSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(2000).default(''),
  price: z.number().positive(),
  stock: z.number().int().nonnegative().default(0),
});

export const updateProductSchema = productSchema.partial();

export const orderStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'shipped', 'completed', 'cancelled']),
});

export const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});