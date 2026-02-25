import { BaseError } from './BaseError';

export class AuthorizationError extends BaseError {
  public readonly statusCode = 403;
  public readonly code = 'AUTHORIZATION_ERROR';
  
  constructor(message: string = 'Acesso negado') {
    super(message);
  }
}