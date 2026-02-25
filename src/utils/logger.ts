// src/utils/logger.ts
import winston from 'winston';
import { AsyncLocalStorage } from 'async_hooks';

// Contexto da requisição para correlation ID
export const requestStore = new AsyncLocalStorage<{ requestId: string }>();

const { combine, timestamp, json, errors } = winston.format;

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: {
    service: 'ecommerce-api',
    environment: process.env.NODE_ENV,
  },
  format: combine(
    timestamp(),
    errors({ stack: true }),
    json()
  ),
  transports: [
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'development'
        ? winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        : undefined,
    }),
  ],
});

// Wrapper que adiciona contexto da requisição
export const getLogger = () => {
  const store = requestStore.getStore();
  return logger.child({
    requestId: store?.requestId,
  });
};