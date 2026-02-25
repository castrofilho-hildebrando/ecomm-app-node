import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { AdminStatsService } from '../application/services/AdminStatsService';
import { dateRangeSchema } from '../validation/schemas';

@injectable()
export class AdminController {
  constructor(
    @inject('AdminStatsService') private statsService: AdminStatsService
  ) {}

  getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validação segura de datas
      const { startDate, endDate } = dateRangeSchema.parse(req.query);

      const start = startDate ? new Date(startDate) : new Date('1970-01-01');
      const end = endDate ? new Date(endDate) : new Date();

      // Sanity check - evita ranges absurdos
      const maxRange = 365 * 24 * 60 * 60 * 1000; // 1 ano
      if (end.getTime() - start.getTime() > maxRange) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_RANGE',
            message: 'Intervalo máximo de 1 ano',
          },
        });
      }

      const stats = await this.statsService.getStats(start, end);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  };
}