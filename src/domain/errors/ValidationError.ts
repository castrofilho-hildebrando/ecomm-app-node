import { BaseError } from './BaseError';

export class ValidationError extends BaseError {
  public readonly statusCode = 400;
  public readonly code = 'VALIDATION_ERROR';
  
  constructor(message: string) {
    super(message);
  }
}