import { BaseError } from './BaseError';

export class AuthenticationError extends BaseError {
  public readonly statusCode = 401;
  public readonly code = 'AUTHENTICATION_ERROR';
  
  constructor(message: string = 'Não autenticado') {
    super(message);
  }
}
