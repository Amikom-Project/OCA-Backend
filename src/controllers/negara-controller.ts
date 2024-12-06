import { Request, Response, NextFunction } from 'express';

import { handleError } from '@/errors/response-error';
import { NegaraService } from '@/services/negara-service';
import { successResponse } from '@/utils/response-success-util';

export class NegaraController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await NegaraService.list();

      successResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }
}
