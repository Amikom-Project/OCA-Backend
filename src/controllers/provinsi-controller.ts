import { Request, Response, NextFunction } from 'express';

import { handleError } from '@/errors/response-error';
import { ProvinsiService } from '@/services/provinsi-service';
import { successResponse } from '@/utils/response-success-util';

export class ProvinsiController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await ProvinsiService.list();

      successResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }
}
