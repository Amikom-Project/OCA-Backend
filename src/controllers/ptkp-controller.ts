import { Request, Response, NextFunction } from 'express';

import { handleError } from '@/errors/response-error';
import { PtkpService } from '@/services/ptkp-service';
import { successResponse } from '@/utils/response-success-util';

export class PtkpController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await PtkpService.list();

      successResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }
}
