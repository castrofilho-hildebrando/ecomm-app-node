export abstract class BaseError extends Error {
  public abstract readonly statusCode: number;
  public abstract readonly code: string;
  
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
