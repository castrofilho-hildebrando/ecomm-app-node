import { BaseError } from './BaseError';

export class NotFoundError extends BaseError {
  public readonly statusCode = 404;
  public readonly code = 'NOT_FOUND';
  
  constructor(resource: string) {
    super(`${resource} não encontrado`);
  }
}
