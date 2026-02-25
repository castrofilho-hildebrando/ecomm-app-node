import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requestStore } from '../utils/logger';

export const requestContext = (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] as string || uuidv4();
  
  // Adiciona ao request para uso nos controllers
  req.requestId = requestId;
  
  // Adiciona ao header de resposta
  res.setHeader('X-Request-Id', requestId);
  
  // Executa o resto da cadeia dentro do contexto
  requestStore.run({ requestId }, () => {
    next();
  });
};