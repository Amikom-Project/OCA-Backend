import { Request, Response, NextFunction } from 'express';

import { handleError } from '@/errors/response-error';
import { StatusPegawaiService } from '@/services/status-pegawai-service';
import { successResponse } from '@/utils/response-success-util';

export class StatusPegawaiController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await StatusPegawaiService.list();

      successResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }
}
