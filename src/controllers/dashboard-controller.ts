import { Request, Response, NextFunction } from 'express';

import { handleError } from '@/errors/response-error';
import { DashboardService } from '@/services/dashboard-service';
import { successSingleResponse } from '@/utils/response-success-util';

export class DashboardController {
  static async count(req: Request, res: Response, next: NextFunction) {
    try {
      const idl = req.query.idl as string;

      const response = await DashboardService.count(idl);

      successSingleResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }
}
