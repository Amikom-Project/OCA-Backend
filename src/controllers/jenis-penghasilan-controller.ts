import { Request, Response, NextFunction } from 'express';

import { handleError } from '@/errors/response-error';
import { JenisPenghasilanService } from '@/services/jenis-penghasilan-service';
import { successResponse } from '@/utils/response-success-util';

export class JenisPenghasilanController {
  static async listJenisPenghasilanPPh21(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response =
        await JenisPenghasilanService.listJenisPenghasilanPPh21();

      successResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }

  static async listJenisPenghasilanPPh23(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response =
        await JenisPenghasilanService.listJenisPenghasilanPPh23();

      successResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }

  static async listJenisPenghasilanPPh4Ayat2(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response =
        await JenisPenghasilanService.listJenisPenghasilanPPh4Ayat2();

      successResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }
}
