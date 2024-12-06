import { Request, Response, NextFunction } from 'express';

import { handleError } from '@/errors/response-error';
import { BankService } from '@/services/bank-service';
import { successResponse } from '@/utils/response-success-util';

export class BankController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await BankService.list();

      successResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }
}
