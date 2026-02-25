import { injectable } from 'tsyringe';
import mongoose, { ClientSession } from 'mongoose';
import { TransactionManager } from '../../application/ports/TransactionManager';

@injectable()
export class MongoTransactionManager implements TransactionManager {
  async runInTransaction<T>(fn: (session: ClientSession) => Promise<T>): Promise<T> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const result = await fn(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}